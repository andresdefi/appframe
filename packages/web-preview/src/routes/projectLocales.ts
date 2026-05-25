import type { Express, Request, Response } from 'express';
import { getLocaleLabel } from '@appframe/core';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';
import {
  isSafeObjectKey,
  loadForScreenOp,
  writeAndBroadcast,
} from './projectPatchHelpers.js';

// Locale lifecycle + per-locale screen ops. Snapshot-at-add-time model
// (CLAUDE.md "Locales" section): adding a locale deep-clones the
// current default-locale screens into data.localeScreens[code]; from
// that point on the two sets evolve independently.

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
    if (!isSafeObjectKey(code)) {
      res.status(400).json({ error: '`code` cannot be a reserved JavaScript property name' });
      return;
    }
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
    if (sessionLocales[code]) {
      res.status(409).json({ error: `locale "${code}" already exists on this project` });
      return;
    }
    const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
    const resolvedLabel = typeof label === 'string' && label.length > 0 ? label : getLocaleLabel(code);
    const nextData: Record<string, unknown> = {
      ...data,
      sessionLocales: { ...sessionLocales, [code]: { label: resolvedLabel } },
      localeScreens: { ...localeScreens, [code]: structuredClone(screens) },
    };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data, 'locales/add');
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, code, label: resolvedLabel });
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
    if (!isSafeObjectKey(code)) {
      res.status(400).json({ error: '`code` cannot be a reserved JavaScript property name' });
      return;
    }
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data } = loaded;
    const sessionLocales = isRecord(data.sessionLocales) ? { ...data.sessionLocales } : {};
    const localeScreens = isRecord(data.localeScreens) ? { ...data.localeScreens } : {};
    if (!(code in sessionLocales) && !(code in localeScreens)) {
      res.status(404).json({ error: `locale "${code}" not found on this project` });
      return;
    }
    delete sessionLocales[code];
    delete localeScreens[code];
    const nextData: Record<string, unknown> = {
      ...data,
      sessionLocales,
      localeScreens,
    };
    if (data.locale === code) {
      nextData.locale = 'default';
    }
    const written = await writeAndBroadcast(ctx, project, nextData, res, data, 'locales/remove');
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, removed: code });
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
    if (code !== 'default' && !isSafeObjectKey(code)) {
      res.status(400).json({ error: '`code` cannot be a reserved JavaScript property name' });
      return;
    }
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data } = loaded;
    if (code !== 'default') {
      const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
      const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
      if (!(code in sessionLocales) && !(code in localeScreens)) {
        res.status(404).json({ error: `locale "${code}" not configured — add it first with /locales/add` });
        return;
      }
    }
    const nextData = { ...data, locale: code };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data, 'locales/set-active');
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, locale: code });
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
    if (!isSafeObjectKey(code)) {
      res.status(400).json({ error: '`code` cannot be a reserved JavaScript property name' });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data } = loaded;
    const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
    const screens = localeScreens[code];
    if (!Array.isArray(screens)) {
      res.status(404).json({ error: `locale "${code}" has no screens — add it first with /locales/add` });
      return;
    }
    if (index >= screens.length) {
      res.status(400).json({ error: `screen index ${index} out of bounds for locale "${code}"` });
      return;
    }
    const existing = screens[index];
    if (!isRecord(existing)) {
      res.status(422).json({ error: `localeScreens[${code}][${index}] is not an object` });
      return;
    }
    const merged: Record<string, unknown> = { ...existing, ...patch };
    const nextScreens = screens.slice();
    nextScreens[index] = merged;
    const nextLocaleScreens = { ...localeScreens, [code]: nextScreens };
    const nextData = { ...data, localeScreens: nextLocaleScreens };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data, 'locales/patch-screen');
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, screen: merged });
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
    if (!isSafeObjectKey(code)) {
      res.status(400).json({ error: '`code` cannot be a reserved JavaScript property name' });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data } = loaded;
    const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
    const screens = localeScreens[code];
    if (!Array.isArray(screens)) {
      res.status(404).json({ error: `locale "${code}" has no screens — add it first with /locales/add` });
      return;
    }
    const nextScreens = screens.slice();
    const merged: Record<string, unknown>[] = [];
    for (const op of ops as Array<{ index: number; patch: Record<string, unknown> }>) {
      if (op.index >= nextScreens.length) {
        res.status(400).json({
          error: `op.index ${op.index} out of bounds — locale "${code}" has ${nextScreens.length} screen(s)`,
        });
        return;
      }
      const existing = nextScreens[op.index];
      if (!isRecord(existing)) {
        res.status(422).json({ error: `localeScreens[${code}][${op.index}] is not an object` });
        return;
      }
      const next = { ...existing, ...op.patch };
      nextScreens[op.index] = next;
      merged.push(next);
    }
    const nextLocaleScreens = { ...localeScreens, [code]: nextScreens };
    const nextData = { ...data, localeScreens: nextLocaleScreens };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data, 'locales/patch-batch');
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, applied: ops.length, screens: merged });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    if (sourceIndex >= screens.length) {
      res.status(400).json({
        error: `sourceIndex ${sourceIndex} out of bounds — project has ${screens.length} screen(s)`,
      });
      return;
    }
    const sourceScreen = screens[sourceIndex];
    if (!isRecord(sourceScreen)) {
      res.status(422).json({ error: `screens[${sourceIndex}] is not an object` });
      return;
    }
    const localeScreens = isRecord(data.localeScreens) ? data.localeScreens : {};
    const codes = Object.keys(localeScreens).filter(isSafeObjectKey);
    if (codes.length === 0) {
      res.json({ success: true, savedAt: null, affected: [], note: 'project has no locales configured' });
      return;
    }
    const nextLocaleScreens: Record<string, unknown> = { ...localeScreens };
    const affected: string[] = [];
    for (const code of codes) {
      const localeArr = localeScreens[code];
      if (!Array.isArray(localeArr) || sourceIndex >= localeArr.length) continue;
      const nextArr = localeArr.slice();
      nextArr[sourceIndex] = structuredClone(sourceScreen);
      nextLocaleScreens[code] = nextArr;
      affected.push(code);
    }
    if (affected.length === 0) {
      res.json({ success: true, savedAt: null, affected: [], note: 'no locales had a screen at this index' });
      return;
    }
    const nextData = { ...data, localeScreens: nextLocaleScreens };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data, 'locales/broadcast-screen');
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, affected });
  });
}
