import type { Express, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { readProject, ProjectCorruptError, ProjectFutureSchemaError } from '../projectStorage.js';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';
import {
  loadForScreenOp,
  mergeScreenPatch,
  mutateProject,
  syncActiveVariantSnapshot,
} from './projectPatchHelpers.js';

// Default-locale screen operations + project-level metadata routes.
// Sibling files cover variants (projectVariants.ts) and locales
// (projectLocales.ts). Shared helpers live in projectPatchHelpers.ts.
//
// Out-of-band writes to a project envelope. Used by MCP agents to patch
// editor-state-shape screen fields directly into the on-disk project,
// then notify the browser via SSE.
//
// Why a separate endpoint instead of PUT /api/config (the live
// AppframeConfig): the AppframeConfig is a slim projection that loses
// per-screen editor-state details (callouts, gradients, spotlight flags,
// shadow toggles, etc.) when round-tripped back to editor state. Writes
// through this endpoint preserve every field the UI knows about, because
// the disk file IS the editor-state shape.
//
// The patch is shallow-merged at the top level of the target screen
// object: any key present in `patch` replaces the screen's value
// wholesale (e.g. to tweak one spotlight field you must send the full
// `spotlight` object). This matches the convention used elsewhere and
// avoids the complexity of nested-object merge semantics.

export function registerProjectScreenRoutes(app: Express, ctx: RouteContext): void {
  // GET /api/active-project — agent-facing read of the slug the browser
  // currently has open. Returns { slug: null } when no project is
  // active yet (e.g. server just booted, no browser has connected).
  app.get('/api/active-project', (_req: Request, res: Response) => {
    res.json({ slug: ctx.getActiveProjectSlug() });
  });

  // POST /api/active-project — browser tells the server which project
  // it just opened. Idempotent; passing the same slug twice is fine.
  // Pass { slug: null } to clear (not currently used by the UI but
  // kept for symmetry).
  app.post('/api/active-project', (req: Request, res: Response) => {
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const raw = body.slug;
    if (raw === null) {
      ctx.setActiveProjectSlug(null);
      res.json({ success: true, slug: null });
      return;
    }
    if (typeof raw !== 'string' || raw.length === 0) {
      res.status(400).json({ error: '`slug` must be a non-empty string or null' });
      return;
    }
    ctx.setActiveProjectSlug(raw);
    res.json({ success: true, slug: raw });
  });

  // GET /api/projects/:project/screens/:index
  //
  // Read a single screen from the envelope on disk. Returns
  // `{ schemaVersion, savedAt, index, screen }`. The agent's inspect
  // tools (get_screen, inspect_fonts, diff_screens, auto_fit_headline,
  // ...) used to fetch the full ~40 KB envelope just to read one
  // screen; this endpoint cuts the network payload to ~2 KB per
  // inspect. Tools that genuinely need every screen (describe_project,
  // theme-broadcast helpers) still hit GET /api/projects/:slug.
  app.get('/api/projects/:project/screens/:index', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const indexParam = typeof req.params.index === 'string' ? req.params.index : '';
    const index = Number(indexParam);
    if (!Number.isInteger(index) || index < 0) {
      res.status(400).json({ error: '`index` must be a non-negative integer' });
      return;
    }
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { envelope, screens } = loaded;
    if (index >= screens.length) {
      res.status(400).json({
        error: `screen index ${index} out of bounds — project has ${screens.length} screen(s)`,
      });
      return;
    }
    const screen = screens[index];
    if (!isRecord(screen)) {
      res.status(422).json({ error: `data.screens[${index}] is not an object` });
      return;
    }
    res.json({
      schemaVersion: envelope.schemaVersion,
      savedAt: envelope.savedAt,
      index,
      screen,
    });
  });

  // PATCH /api/projects/:project/screens/:index
  //   Body: Partial<ScreenState> (the patch itself, no wrapper)
  //
  // REST-style endpoint — index in the URL, body IS the patch. Same
  // shallow-merge semantics as POST /patch-screen.
  app.patch('/api/projects/:project/screens/:index', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const indexParam = typeof req.params.index === 'string' ? req.params.index : '';
    const index = Number(indexParam);
    if (!Number.isInteger(index) || index < 0) {
      res.status(400).json({ error: '`index` must be a non-negative integer' });
      return;
    }
    const patch = req.body;
    if (!isRecord(patch)) {
      res.status(400).json({ error: 'request body must be an object of editor-state screen fields' });
      return;
    }
    let merged: Record<string, unknown>;
    const written = await mutateProject(ctx, project, res, 'patch_screen', ({ data, screens }) => {
      if (index >= screens.length) {
        res.status(400).json({
          error: `screen index ${index} out of bounds — project has ${screens.length} screen(s)`,
        });
        return null;
      }
      const existing = screens[index];
      if (!isRecord(existing)) {
        res.status(422).json({ error: `data.screens[${index}] is not an object` });
        return null;
      }
      merged = mergeScreenPatch(existing, patch);
      const nextScreens = screens.slice();
      nextScreens[index] = merged;
      syncActiveVariantSnapshot(data, nextScreens);
      return { ...data, screens: nextScreens };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, screen: merged! });
    }
  });

  // POST /api/projects/:project/patch-screen
  //   { index: number, patch: Partial<ScreenState> }
  //
  // Reads the envelope, shallow-merges patch into data.screens[index],
  // writes atomically, broadcasts SSE. Returns the merged screen.
  app.post('/api/projects/:project/patch-screen', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
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
    const written = await mutateProject(ctx, project, res, 'patch_screen', ({ data, screens }) => {
      if (index >= screens.length) {
        res.status(400).json({
          error: `screen index ${index} out of bounds — project has ${screens.length} screen(s)`,
        });
        return null;
      }
      const existing = screens[index];
      if (!isRecord(existing)) {
        res.status(422).json({ error: `data.screens[${index}] is not an object` });
        return null;
      }
      merged = mergeScreenPatch(existing, patch);
      const nextScreens = screens.slice();
      nextScreens[index] = merged;
      syncActiveVariantSnapshot(data, nextScreens);
      return { ...data, screens: nextScreens };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, screen: merged! });
    }
  });

  // POST /api/projects/:project/patch-batch
  //   { ops: [{ index: number, patch: Partial<ScreenState> }, ...] }
  //
  // Applies N shallow-merge screen patches in one envelope read + write.
  // For the agent's bulk-edit flows ("set all 6 headlines"), this cuts
  // N HTTP round-trips + N atomic writes down to one of each. Ops are
  // applied in order; any malformed op fails the whole batch (no
  // partial writes). Returns the post-merge screens that were touched.
  app.post('/api/projects/:project/patch-batch', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
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
    const written = await mutateProject(ctx, project, res, 'patch_batch', ({ data, screens }) => {
      const nextScreens = screens.slice();
      mergedScreens = [];
      for (const op of ops as Array<{ index: number; patch: Record<string, unknown> }>) {
        if (op.index >= nextScreens.length) {
          res.status(400).json({
            error: `op.index ${op.index} out of bounds — project has ${nextScreens.length} screen(s)`,
          });
          return null;
        }
        const existing = nextScreens[op.index];
        if (!isRecord(existing)) {
          res.status(422).json({ error: `screens[${op.index}] is not an object` });
          return null;
        }
        const next = mergeScreenPatch(existing, op.patch);
        nextScreens[op.index] = next;
        mergedScreens.push(next);
      }
      syncActiveVariantSnapshot(data, nextScreens);
      return { ...data, screens: nextScreens };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, applied: ops.length, screens: mergedScreens! });
    }
  });

  // POST /api/projects/:project/screens/insert
  //   { atIndex?: number, screen?: Partial<ScreenState> }
  //
  // Builds a new screen with an auto-generated id and the caller's
  // overrides on top of an empty record (fattenScreen on hydrate fills
  // in STATIC_SCREEN_DEFAULTS, so a near-empty input is enough). atIndex
  // defaults to appending. Always updates the active variant's snapshot
  // to match — see syncActiveVariantSnapshot.
  app.post('/api/projects/:project/screens/insert', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { atIndex, screen } = body;
    if (screen !== undefined && !isRecord(screen)) {
      res.status(400).json({ error: '`screen` must be an object if provided' });
      return;
    }
    let insertAt: number;
    let newScreen: Record<string, unknown>;
    const written = await mutateProject(ctx, project, res, 'screens/insert', ({ data, screens }) => {
      insertAt = typeof atIndex === 'number' && Number.isInteger(atIndex) && atIndex >= 0
        ? Math.min(atIndex, screens.length)
        : screens.length;
      newScreen = {
        id: randomUUID(),
        headline: '<p style="text-align: center;"></p>',
        subtitle: '<p style="text-align: center;"></p>',
        ...(isRecord(screen) ? screen : {}),
      };
      newScreen.id = randomUUID();
      const nextScreens = [...screens.slice(0, insertAt), newScreen, ...screens.slice(insertAt)];
      syncActiveVariantSnapshot(data, nextScreens);
      return { ...data, screens: nextScreens };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, atIndex: insertAt!, screen: newScreen! });
    }
  });

  // POST /api/projects/:project/screens/remove { index: number }
  app.post('/api/projects/:project/screens/remove', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { index } = body;
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
      res.status(400).json({ error: '`index` must be a non-negative integer' });
      return;
    }
    let removed: unknown;
    let remaining: number;
    const written = await mutateProject(ctx, project, res, 'screens/remove', ({ data, screens }) => {
      if (index >= screens.length) {
        res.status(400).json({ error: `screen index ${index} out of bounds` });
        return null;
      }
      if (screens.length <= 1) {
        res.status(400).json({ error: 'cannot remove the last screen — projects must have at least 1' });
        return null;
      }
      const nextScreens = screens.slice();
      [removed] = nextScreens.splice(index, 1);
      remaining = nextScreens.length;
      syncActiveVariantSnapshot(data, nextScreens);
      const nextData: Record<string, unknown> = { ...data, screens: nextScreens };
      const currentSelected = data.selectedScreen;
      if (typeof currentSelected === 'number') {
        if (currentSelected >= nextScreens.length) {
          nextData.selectedScreen = Math.max(0, nextScreens.length - 1);
        } else if (currentSelected > index) {
          nextData.selectedScreen = currentSelected - 1;
        }
      }
      return nextData;
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, removed, remaining: remaining! });
    }
  });

  // POST /api/projects/:project/switch
  //
  // Validates the project exists, sets it as the active slug, broadcasts
  // a `project-switched` event so the browser UI navigates to it. This
  // is distinct from `project-changed` (which means "the active project
  // was edited") — browser handlers must distinguish so a remote edit
  // doesn't yank the user into a different project.
  app.post('/api/projects/:project/switch', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    let envelope;
    try {
      envelope = await readProject(ctx.projectStorage, project);
    } catch (err) {
      if (err instanceof ProjectCorruptError) {
        res.status(422).json({ error: err.message });
        return;
      }
      if (err instanceof ProjectFutureSchemaError) {
        res.status(409).json({ error: err.message, schemaVersion: err.schemaVersion });
        return;
      }
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
      return;
    }
    if (!envelope) {
      res.status(404).json({ error: 'project not found' });
      return;
    }
    ctx.setActiveProjectSlug(project);
    ctx.broadcastEvent({ type: 'project-switched', slug: project });
    res.json({ success: true, slug: project });
  });

  // POST /api/projects/:project/patch-project { patch }
  //
  // Top-level fields on the project envelope (not per-screen). Only
  // whitelisted keys are accepted to guard against accidentally
  // clobbering structural fields like `screens`, `variants`, or
  // `localeScreens` through this surface — those have dedicated
  // endpoints. Expand the whitelist as new top-level fields earn
  // a tool wrapper.
  const TOP_LEVEL_PATCH_WHITELIST = new Set([
    'exportSize',
    'platform',
    'previewW',
    'previewH',
    'panoramicFrameCount',
  ]);
  app.post('/api/projects/:project/patch-project', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { patch } = body;
    if (!isRecord(patch)) {
      res.status(400).json({ error: '`patch` must be an object' });
      return;
    }
    const rejected: string[] = [];
    const accepted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (TOP_LEVEL_PATCH_WHITELIST.has(key)) accepted[key] = value;
      else rejected.push(key);
    }
    if (rejected.length > 0) {
      res.status(400).json({
        error: `patch contained non-whitelisted keys: ${rejected.join(', ')} ` +
          `(allowed: ${Array.from(TOP_LEVEL_PATCH_WHITELIST).join(', ')})`,
      });
      return;
    }
    if (Object.keys(accepted).length === 0) {
      res.status(400).json({ error: 'patch must contain at least one whitelisted field' });
      return;
    }
    const written = await mutateProject(ctx, project, res, 'patch_project', ({ data }) => {
      return { ...data, ...accepted };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, applied: accepted });
    }
  });

  // POST /api/projects/:project/screens/reorder { order: number[] }
  //
  // `order` is a permutation of [0..N-1]; result[i] = screens[order[i]].
  // Rejects orders that aren't a complete permutation to avoid
  // accidentally dropping or duplicating screens.
  app.post('/api/projects/:project/screens/reorder', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { order } = body;
    if (!Array.isArray(order) || !order.every((v) => Number.isInteger(v) && v >= 0)) {
      res.status(400).json({ error: '`order` must be an array of non-negative integers' });
      return;
    }
    const written = await mutateProject(ctx, project, res, 'screens/reorder', ({ data, screens }) => {
      const n = screens.length;
      if (order.length !== n) {
        res.status(400).json({
          error: `\`order\` length ${order.length} must match screen count ${n}`,
        });
        return null;
      }
      const seen = new Set<number>();
      for (const i of order) {
        if (i >= n) {
          res.status(400).json({ error: `\`order\` index ${i} out of bounds (n=${n})` });
          return null;
        }
        if (seen.has(i)) {
          res.status(400).json({ error: `\`order\` is not a permutation — index ${i} appears more than once` });
          return null;
        }
        seen.add(i);
      }
      const nextScreens = order.map((i) => screens[i]);
      syncActiveVariantSnapshot(data, nextScreens);
      const nextData: Record<string, unknown> = { ...data, screens: nextScreens };
      const currentSelected = data.selectedScreen;
      if (typeof currentSelected === 'number') {
        const newPosition = order.indexOf(currentSelected);
        if (newPosition >= 0) nextData.selectedScreen = newPosition;
      }
      return nextData;
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, order });
    }
  });
}
