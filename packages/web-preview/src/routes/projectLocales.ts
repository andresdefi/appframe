import type { Express, Request, Response } from 'express';
import { getLocaleLabel } from '@appframe/core';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';
import {
  mergeScreenPatch,
  mutateProject,
} from './projectPatchHelpers.js';

// Locale lifecycle + per-locale screen ops. Snapshot-at-add-time model
// (CLAUDE.md "Locales" section): adding a locale deep-clones the
// current default-locale screens into data.localeScreens[code]; from
// that point on the two sets evolve independently.

const LOCALE_CODE_RE = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/;

function validateLocaleCode(code: string): string | null {
  if (!LOCALE_CODE_RE.test(code)) return null;
  return code;
}

export function registerProjectLocaleRoutes(app: Express, ctx: RouteContext): void {
  // POST /api/projects/:project/locales/add { code, label? }
  //
  // Snapshot-at-add-time semantics matching the UI: deep-clone the
  // current top-level data.screens into data.localeScreens[code]. The
  // Default screens become the per-locale baseline; further edits on
  // either side stay independent.
  app.post('/api/projects/:project/locales/add', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { code, label } = body;
    if (typeof code !== 'string' || code.length === 0) {
      res.status(400).json({ error: '`code` is required (e.g. "fr", "es-MX")' });
      return;
    }
    if (code === 'default') {
      res.status(400).json({ error: '"default" is the implicit base locale and cannot be added' });
      return;
    }
    const safeCode = validateLocaleCode(code);
    if (!safeCode) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    const resolvedLabel = typeof label === 'string' && label.length > 0 ? label : getLocaleLabel(safeCode);
    const written = await mutateProject(ctx, project, res, 'locales/add', ({ data, screens }) => {
      const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
      if (sessionLocales[safeCode]) {
        res.status(409).json({ error: `locale "${safeCode}" already exists on this project` });
        return null;
      }
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      return {
        ...data,
        sessionLocales: { ...sessionLocales, [safeCode]: { label: resolvedLabel } },
        localeScreens: { ...localeScreens, [safeCode]: structuredClone(screens) },
      };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, code: safeCode, label: resolvedLabel });
    }
  });

  // POST /api/projects/:project/locales/remove { code }
  //
  // Drops `code` from both sessionLocales and localeScreens. If the
  // active locale was the one being removed, falls back to "default".
  app.post('/api/projects/:project/locales/remove', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { code } = body;
    if (typeof code !== 'string' || code.length === 0) {
      res.status(400).json({ error: '`code` is required' });
      return;
    }
    if (code === 'default') {
      res.status(400).json({ error: 'cannot remove the implicit "default" locale' });
      return;
    }
    const safeCode = validateLocaleCode(code);
    if (!safeCode) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    const written = await mutateProject(ctx, project, res, 'locales/remove', ({ data }) => {
      const sessionLocales = isRecord(data.sessionLocales) ? { ...data.sessionLocales } : {};
      const localeScreens = isRecord(data.localeScreens) ? { ...data.localeScreens } : {};
      if (!(safeCode in sessionLocales) && !(safeCode in localeScreens)) {
        res.status(404).json({ error: `locale "${safeCode}" not found on this project` });
        return null;
      }
      delete sessionLocales[safeCode];
      delete localeScreens[safeCode];
      const nextData: Record<string, unknown> = { ...data, sessionLocales, localeScreens };
      if (data.locale === safeCode) nextData.locale = 'default';
      return nextData;
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, removed: safeCode });
    }
  });

  // POST /api/projects/:project/locales/set-active { code }
  //
  // Switch the active locale (data.locale). "default" is the base set;
  // any other value must exist in sessionLocales / localeScreens.
  app.post('/api/projects/:project/locales/set-active', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { code } = body;
    if (typeof code !== 'string' || code.length === 0) {
      res.status(400).json({ error: '`code` is required' });
      return;
    }
    if (code !== 'default' && !validateLocaleCode(code)) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    const written = await mutateProject(ctx, project, res, 'locales/set-active', ({ data }) => {
      if (code !== 'default') {
        const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
        const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
        if (!(code in sessionLocales) && !(code in localeScreens)) {
          res.status(404).json({ error: `locale "${code}" not configured — add it first with /locales/add` });
          return null;
        }
      }
      return { ...data, locale: code };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, locale: code });
    }
  });

  // POST /api/projects/:project/locales/:code/patch-screen
  //   { index: number, patch: Partial<ScreenState> }
  //
  // Edits localeScreens[code][index]. Same shallow-merge semantics as
  // the top-level patch-screen. The `default` locale routes to
  // data.screens — call /api/projects/:project/patch-screen instead.
  app.post('/api/projects/:project/locales/:code/patch-screen', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const code = typeof req.params.code === 'string' ? req.params.code : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    if (code === 'default') {
      res.status(400).json({
        error: 'use /api/projects/:slug/patch-screen for the default locale',
      });
      return;
    }
    const safeCode = validateLocaleCode(code);
    if (!safeCode) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    const { index, patch } = body;
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
      res.status(400).json({ error: '`index` must be a non-negative integer' });
      return;
    }
    if (!isRecord(patch)) {
      res.status(400).json({ error: '`patch` must be an object of editor-state screen fields' });
      return;
    }
    let merged: Record<string, unknown>;
    const written = await mutateProject(ctx, project, res, 'locales/patch-screen', ({ data }) => {
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      const screens = localeScreens[safeCode];
      if (!Array.isArray(screens)) {
        res.status(404).json({ error: `locale "${safeCode}" has no screens — add it first with /locales/add` });
        return null;
      }
      if (index >= screens.length) {
        res.status(400).json({ error: `screen index ${index} out of bounds for locale "${safeCode}"` });
        return null;
      }
      const existing = screens[index];
      if (!isRecord(existing)) {
        res.status(422).json({ error: `localeScreens[${safeCode}][${index}] is not an object` });
        return null;
      }
      merged = mergeScreenPatch(existing, patch);
      const nextScreens = screens.slice();
      nextScreens[index] = merged;
      return { ...data, localeScreens: { ...localeScreens, [safeCode]: nextScreens } };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, screen: merged! });
    }
  });

  // POST /api/projects/:project/locales/:code/patch-batch
  //   { ops: [{ index: number, patch: Partial<ScreenState> }, ...] }
  //
  // Locale-scoped mirror of /patch-batch. Applies N shallow-merge
  // patches inside localeScreens[code] in one atomic write. Used by the
  // MCP `bulk_translate_locale` tool so an agent can drop a full
  // translation set for 6 screens in one round-trip instead of six.
  app.post('/api/projects/:project/locales/:code/patch-batch', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const code = typeof req.params.code === 'string' ? req.params.code : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    if (code === 'default') {
      res.status(400).json({
        error: 'use /api/projects/:slug/patch-batch for the default locale',
      });
      return;
    }
    const safeCode = validateLocaleCode(code);
    if (!safeCode) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    const { ops } = body;
    if (!Array.isArray(ops) || ops.length === 0) {
      res.status(400).json({ error: '`ops` must be a non-empty array of { index, patch } objects' });
      return;
    }
    for (const op of ops) {
      if (!isRecord(op)) {
        res.status(400).json({ error: 'each op must be an object' });
        return;
      }
      const { index, patch } = op;
      if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
        res.status(400).json({ error: 'each op.index must be a non-negative integer' });
        return;
      }
      if (!isRecord(patch)) {
        res.status(400).json({ error: 'each op.patch must be an object' });
        return;
      }
    }
    let mergedScreens: Record<string, unknown>[];
    const written = await mutateProject(ctx, project, res, 'locales/patch-batch', ({ data }) => {
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      const screens = localeScreens[safeCode];
      if (!Array.isArray(screens)) {
        res.status(404).json({ error: `locale "${safeCode}" has no screens — add it first with /locales/add` });
        return null;
      }
      const nextScreens = screens.slice();
      mergedScreens = [];
      for (const op of ops as Array<{ index: number; patch: Record<string, unknown> }>) {
        if (op.index >= nextScreens.length) {
          res.status(400).json({
            error: `op.index ${op.index} out of bounds — locale "${safeCode}" has ${nextScreens.length} screen(s)`,
          });
          return null;
        }
        const existing = nextScreens[op.index];
        if (!isRecord(existing)) {
          res.status(422).json({ error: `localeScreens[${safeCode}][${op.index}] is not an object` });
          return null;
        }
        const next = mergeScreenPatch(existing, op.patch);
        nextScreens[op.index] = next;
        mergedScreens.push(next);
      }
      return { ...data, localeScreens: { ...localeScreens, [safeCode]: nextScreens } };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, applied: ops.length, screens: mergedScreens! });
    }
  });

  // POST /api/projects/:project/locales { code, label? }
  //
  // REST-style alias for /locales/add. Same semantics.
  app.post('/api/projects/:project/locales', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { code, label } = body;
    if (typeof code !== 'string' || code.length === 0) {
      res.status(400).json({ error: '`code` is required (e.g. "fr", "es-MX")' });
      return;
    }
    if (code === 'default') {
      res.status(400).json({ error: '"default" is the implicit base locale and cannot be added' });
      return;
    }
    if (!LOCALE_CODE_RE.test(code)) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    const safeCode = String(code);
    const resolvedLabel = typeof label === 'string' && label.length > 0 ? label : getLocaleLabel(code);
    const written = await mutateProject(ctx, project, res, 'locales/add', ({ data, screens }) => {
      const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
      if (sessionLocales[safeCode]) {
        res.status(409).json({ error: `locale "${safeCode}" already exists on this project` });
        return null;
      }
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      return {
        ...data,
        sessionLocales: { ...sessionLocales, [safeCode]: { label: resolvedLabel } },
        localeScreens: { ...localeScreens, [safeCode]: structuredClone(screens) },
      };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, code: safeCode, label: resolvedLabel });
    }
  });

  // DELETE /api/projects/:project/locales/:code
  //
  // REST-style alias for POST /locales/remove. Code in URL, no body.
  app.delete('/api/projects/:project/locales/:code', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const code = typeof req.params.code === 'string' ? req.params.code : '';
    if (code === 'default') {
      res.status(400).json({ error: 'cannot remove the implicit "default" locale' });
      return;
    }
    if (!LOCALE_CODE_RE.test(code)) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    const safeCode = String(code);
    const written = await mutateProject(ctx, project, res, 'locales/remove', ({ data }) => {
      const sessionLocales = isRecord(data.sessionLocales) ? { ...data.sessionLocales } : {};
      const localeScreens = isRecord(data.localeScreens) ? { ...data.localeScreens } : {};
      if (!(safeCode in sessionLocales) && !(safeCode in localeScreens)) {
        res.status(404).json({ error: `locale "${safeCode}" not found on this project` });
        return null;
      }
      delete sessionLocales[safeCode];
      delete localeScreens[safeCode];
      const nextData: Record<string, unknown> = { ...data, sessionLocales, localeScreens };
      if (data.locale === safeCode) nextData.locale = 'default';
      return nextData;
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, removed: safeCode });
    }
  });

  // PATCH /api/projects/:project/locales/:code/screens/:index
  //   Body: Partial<ScreenState> (the patch itself, no wrapper)
  //
  // REST-style endpoint for locale screen patches. Index in URL, body
  // IS the patch. Same shallow-merge semantics as POST /locales/:code/patch-screen.
  app.patch('/api/projects/:project/locales/:code/screens/:index', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const code = typeof req.params.code === 'string' ? req.params.code : '';
    const indexParam = typeof req.params.index === 'string' ? req.params.index : '';
    const index = Number(indexParam);
    if (code === 'default') {
      res.status(400).json({
        error: 'use PATCH /api/projects/:slug/screens/:index for the default locale',
      });
      return;
    }
    if (!LOCALE_CODE_RE.test(code)) {
      res.status(400).json({ error: '`code` must be a valid locale code (e.g. "fr", "es-MX")' });
      return;
    }
    if (!Number.isInteger(index) || index < 0) {
      res.status(400).json({ error: '`index` must be a non-negative integer' });
      return;
    }
    const patch = req.body;
    if (!isRecord(patch)) {
      res.status(400).json({ error: 'request body must be an object of editor-state screen fields' });
      return;
    }
    const safeCode = String(code);
    let merged: Record<string, unknown>;
    const written = await mutateProject(ctx, project, res, 'locales/patch-screen', ({ data }) => {
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      const screens = localeScreens[safeCode];
      if (!Array.isArray(screens)) {
        res.status(404).json({ error: `locale "${safeCode}" has no screens — add it first` });
        return null;
      }
      if (index >= screens.length) {
        res.status(400).json({ error: `screen index ${index} out of bounds for locale "${safeCode}"` });
        return null;
      }
      const existing = screens[index];
      if (!isRecord(existing)) {
        res.status(422).json({ error: `localeScreens[${safeCode}][${index}] is not an object` });
        return null;
      }
      merged = mergeScreenPatch(existing, patch);
      const nextScreens = screens.slice();
      nextScreens[index] = merged;
      return { ...data, localeScreens: { ...localeScreens, [safeCode]: nextScreens } };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, screen: merged! });
    }
  });

  // POST /api/projects/:project/locales/broadcast-screen { sourceIndex: number }
  //
  // For each configured locale, replace `localeScreens[code][sourceIndex]`
  // with a structuredClone of `data.screens[sourceIndex]`. Used by the
  // MCP `duplicate_screen_to_all_locales` tool when the default screen
  // has been updated (new device, new layout, new background) and the
  // agent wants the change to propagate to every translated set without
  // re-touching their per-locale text. Each locale's text + per-locale
  // edits get overwritten — that's the contract; if the agent wants to
  // preserve text, it must re-apply via `bulk_translate_locale` after.
  app.post('/api/projects/:project/locales/broadcast-screen', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { sourceIndex } = body;
    if (typeof sourceIndex !== 'number' || !Number.isInteger(sourceIndex) || sourceIndex < 0) {
      res.status(400).json({ error: '`sourceIndex` must be a non-negative integer' });
      return;
    }
    let affected: string[];
    const written = await mutateProject(ctx, project, res, 'locales/broadcast-screen', ({ data, screens }) => {
      if (sourceIndex >= screens.length) {
        res.status(400).json({
          error: `sourceIndex ${sourceIndex} out of bounds — project has ${screens.length} screen(s)`,
        });
        return null;
      }
      const sourceScreen = screens[sourceIndex];
      if (!isRecord(sourceScreen)) {
        res.status(422).json({ error: `screens[${sourceIndex}] is not an object` });
        return null;
      }
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      const codes = Object.keys(localeScreens).flatMap(k => {
        const safe = validateLocaleCode(k);
        return safe ? [safe] : [];
      });
      if (codes.length === 0) {
        res.json({ success: true, savedAt: null, affected: [], note: 'project has no locales configured' });
        return null;
      }
      const nextLocaleScreens: Record<string, unknown> = { ...localeScreens };
      affected = [];
      for (const safeCode of codes) {
        const localeArr = localeScreens[safeCode];
        if (!Array.isArray(localeArr) || sourceIndex >= localeArr.length) continue;
        const nextArr = localeArr.slice();
        nextArr[sourceIndex] = structuredClone(sourceScreen);
        nextLocaleScreens[safeCode] = nextArr;
        affected.push(safeCode);
      }
      if (affected.length === 0) {
        res.json({ success: true, savedAt: null, affected: [], note: 'no locales had a screen at this index' });
        return null;
      }
      return { ...data, localeScreens: nextLocaleScreens };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, affected: affected! });
    }
  });
}
