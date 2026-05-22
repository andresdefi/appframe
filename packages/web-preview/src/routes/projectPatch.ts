import type { Express, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { getLocaleLabel } from '@appframe/core';
import { readProject, writeProject, ProjectCorruptError, ProjectFutureSchemaError } from '../projectStorage.js';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';

// Mutate the active variant's snapshot.screens in lockstep with the
// top-level data.screens. The browser's autosave does this every time it
// serialises (via syncActiveVariantRecord), so without this step the
// Variants panel would temporarily show a stale snapshot for the active
// variant between the agent's write and the user's next edit. Updates
// `updatedAt` on the touched variant for the same reason.
function syncActiveVariantSnapshot(
  data: Record<string, unknown>,
  nextScreens: unknown[],
): void {
  const activeId = data.activeVariantId;
  const variants = data.variants;
  if (typeof activeId !== 'string' || !Array.isArray(variants)) return;
  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    if (!isRecord(v) || v.id !== activeId) continue;
    const snapshot = isRecord(v.snapshot) ? v.snapshot : {};
    variants[i] = {
      ...v,
      snapshot: { ...snapshot, screens: nextScreens },
      updatedAt: new Date().toISOString(),
    };
    return;
  }
}

// Apply a variant snapshot to the top-level data, mirroring the
// browser's applyVariantSnapshot. Top-level data.screens, locale state,
// panoramic state, and selection cursors all come from the variant's
// frozen snapshot; the snapshot itself is left as-is so flips are
// reversible. Returns a new data object — does not mutate input.
function applyVariantSnapshotToData(
  data: Record<string, unknown>,
  snapshot: Record<string, unknown>,
  variantId: string,
): Record<string, unknown> {
  return {
    ...data,
    activeVariantId: variantId,
    screens: Array.isArray(snapshot.screens) ? snapshot.screens : [],
    sessionLocales: isRecord(snapshot.sessionLocales) ? snapshot.sessionLocales : {},
    localeScreens: isRecord(snapshot.localeScreens) ? snapshot.localeScreens : {},
    localePanoramicElements: isRecord(snapshot.localePanoramicElements)
      ? snapshot.localePanoramicElements
      : {},
    panoramicElements: Array.isArray(snapshot.panoramicElements) ? snapshot.panoramicElements : [],
    panoramicBackground: isRecord(snapshot.panoramicBackground) ? snapshot.panoramicBackground : null,
    panoramicEffects: isRecord(snapshot.panoramicEffects) ? snapshot.panoramicEffects : {},
    panoramicFrameCount:
      typeof snapshot.panoramicFrameCount === 'number' ? snapshot.panoramicFrameCount : 5,
    isPanoramic: snapshot.isPanoramic === true,
    locale: typeof snapshot.locale === 'string' ? snapshot.locale : 'default',
    selectedScreen:
      typeof snapshot.selectedScreen === 'number' ? snapshot.selectedScreen : 0,
    selectedElementIndex:
      typeof snapshot.selectedElementIndex === 'number' ? snapshot.selectedElementIndex : null,
    exportSize: typeof snapshot.exportSize === 'string' ? snapshot.exportSize : data.exportSize,
  };
}

// Read the envelope, validate `data` and `data.screens`, hand back the
// loaded pieces. Centralised so the screen-op endpoints share preconds
// + error responses.
type LoadedEnvelope = {
  envelope: { schemaVersion: number; savedAt: string; data: unknown };
  data: Record<string, unknown>;
  screens: unknown[];
};

async function loadForScreenOp(
  ctx: RouteContext,
  project: string,
  res: Response,
): Promise<LoadedEnvelope | null> {
  let envelope;
  try {
    envelope = await readProject(ctx.projectStorage, project);
  } catch (err) {
    if (err instanceof ProjectCorruptError) {
      res.status(422).json({ error: err.message });
      return null;
    }
    if (err instanceof ProjectFutureSchemaError) {
      res.status(409).json({ error: err.message, schemaVersion: err.schemaVersion });
      return null;
    }
    const message = err instanceof Error ? err.message : 'unknown error';
    res.status(500).json({ error: message });
    return null;
  }
  if (!envelope) {
    res.status(404).json({ error: 'project not found' });
    return null;
  }
  if (!isRecord(envelope.data)) {
    res.status(422).json({ error: 'project envelope `data` is not an object' });
    return null;
  }
  const data = envelope.data as Record<string, unknown>;
  const screens = data.screens;
  if (!Array.isArray(screens)) {
    res.status(422).json({ error: 'project envelope `data.screens` is not an array' });
    return null;
  }
  return { envelope, data, screens };
}

// Write the new project envelope and broadcast a project-changed SSE
// event to the browser. Wraps writeProject so every route below shares
// the same error handling — the write step used to be copy-pasted into
// ~12 handlers, each with a try/catch that drifted over time. Returns
// { savedAt } so routes can include it in their JSON response.
async function writeAndBroadcast(
  ctx: RouteContext,
  project: string,
  nextData: Record<string, unknown>,
  res: Response,
  previousData?: Record<string, unknown>,
): Promise<{ savedAt: string } | null> {
  try {
    // Skip the disk write if the envelope is byte-identical to what
    // was loaded — no-op patches happen surprisingly often (agent
    // setting a field to its current value). Atomic write is cheap
    // (~2 ms) but skipping is cheaper and avoids spurious savedAt
    // timestamps that could trick the user into thinking they have
    // unsaved work to commit. We still broadcast in case any client
    // is interested in the touch.
    if (previousData && deepEquals(previousData, nextData)) {
      ctx.broadcastEvent({ type: 'project-changed', source: 'agent', slug: project, unchanged: true });
      return { savedAt: '' };
    }
    const written = await writeProject(ctx.projectStorage, project, nextData);
    ctx.broadcastEvent({ type: 'project-changed', source: 'agent', slug: project });
    return { savedAt: written.savedAt };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    res.status(500).json({ error: message });
    return null;
  }
}

// Stable JSON-shape equality. Cheap on the typical 40 KB envelope —
// ~5 ms — and safe because the data is plain JSON (no Dates, Maps,
// undefined, etc).
function deepEquals(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

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

export function registerProjectPatchRoutes(app: Express, ctx: RouteContext): void {
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    if (index >= screens.length) {
      res.status(400).json({
        error: `screen index ${index} out of bounds — project has ${screens.length} screen(s)`,
      });
      return;
    }
    const existing = screens[index];
    if (!isRecord(existing)) {
      res.status(422).json({ error: `data.screens[${index}] is not an object` });
      return;
    }
    const merged: Record<string, unknown> = { ...existing, ...patch };
    const nextScreens = screens.slice();
    nextScreens[index] = merged;
    syncActiveVariantSnapshot(data, nextScreens);
    const nextData = { ...data, screens: nextScreens };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, screen: merged });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    const nextScreens = screens.slice();
    const merged: Record<string, unknown>[] = [];
    for (const op of ops as Array<{ index: number; patch: Record<string, unknown> }>) {
      if (op.index >= nextScreens.length) {
        res.status(400).json({
          error: `op.index ${op.index} out of bounds — project has ${nextScreens.length} screen(s)`,
        });
        return;
      }
      const existing = nextScreens[op.index];
      if (!isRecord(existing)) {
        res.status(422).json({ error: `screens[${op.index}] is not an object` });
        return;
      }
      const next = { ...existing, ...op.patch };
      nextScreens[op.index] = next;
      merged.push(next);
    }
    syncActiveVariantSnapshot(data, nextScreens);
    const nextData = { ...data, screens: nextScreens };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, applied: ops.length, screens: merged });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    const insertAt = typeof atIndex === 'number' && Number.isInteger(atIndex) && atIndex >= 0
      ? Math.min(atIndex, screens.length)
      : screens.length;
    if (screen !== undefined && !isRecord(screen)) {
      res.status(400).json({ error: '`screen` must be an object if provided' });
      return;
    }
    // Empty centered <p> matches what the UI inserts; minimal but loads
    // identically once fattenScreen runs on hydrate.
    const newScreen: Record<string, unknown> = {
      id: randomUUID(),
      headline: '<p style="text-align: center;"></p>',
      subtitle: '<p style="text-align: center;"></p>',
      ...(isRecord(screen) ? screen : {}),
    };
    // Always assign a fresh id even if the caller passed one — duplicate
    // ids in the same array break React reconciliation in the editor.
    newScreen.id = randomUUID();
    const nextScreens = [...screens.slice(0, insertAt), newScreen, ...screens.slice(insertAt)];
    syncActiveVariantSnapshot(data, nextScreens);
    const nextData = { ...data, screens: nextScreens };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, atIndex: insertAt, screen: newScreen });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    if (index >= screens.length) {
      res.status(400).json({ error: `screen index ${index} out of bounds` });
      return;
    }
    if (screens.length <= 1) {
      res.status(400).json({ error: 'cannot remove the last screen — projects must have at least 1' });
      return;
    }
    const nextScreens = screens.slice();
    const [removed] = nextScreens.splice(index, 1);
    syncActiveVariantSnapshot(data, nextScreens);
    // Clamp selectedScreen so the UI doesn't point at a now-out-of-bounds
    // index on hydrate.
    const nextData: Record<string, unknown> = { ...data, screens: nextScreens };
    const currentSelected = data.selectedScreen;
    if (typeof currentSelected === 'number') {
      if (currentSelected >= nextScreens.length) {
        nextData.selectedScreen = Math.max(0, nextScreens.length - 1);
      } else if (currentSelected > index) {
        nextData.selectedScreen = currentSelected - 1;
      }
    }
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({
      success: true,
      savedAt: written.savedAt,
      removed,
      remaining: nextScreens.length,
    });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data } = loaded;
    const nextData = { ...data, ...accepted };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, applied: accepted });
  });

  // --- Variant lifecycle -------------------------------------------------

  // POST /api/projects/:project/variants/create
  //   { name?: string, mode?: 'blank' | 'duplicate-active' }
  //
  // duplicate-active (default): snapshots the current top-level state
  // (screens + locales + panoramic) into a new variant. The agent then
  // mutates the new variant via patch_screen etc. to make it diverge.
  // blank: snapshots just an empty `[{}]` screen — fattenScreen will
  // inflate defaults on hydrate. Matches the UI's "Add Variant" button.
  // The new variant becomes active; top-level state.screens is updated
  // to match its snapshot.
  app.post('/api/projects/:project/variants/create', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { name, mode } = body;
    const resolvedMode = mode === 'blank' ? 'blank' : 'duplicate-active';
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    const variants = Array.isArray(data.variants) ? data.variants : [];

    // Sync active variant snapshot before branching, so we don't lose
    // the agent's most recent edits to the active variant when we copy
    // its state into the new one.
    syncActiveVariantSnapshot(data, screens);

    const now = new Date().toISOString();
    const newId = `variant-${randomUUID().slice(0, 8)}`;
    const resolvedName = typeof name === 'string' && name.length > 0
      ? name
      : `Variant ${variants.length + 1}`;
    const snapshotScreens =
      resolvedMode === 'blank' ? [{ id: randomUUID() }] : structuredClone(screens);
    const baseSnapshotFields = {
      platform: data.platform,
      previewW: data.previewW,
      previewH: data.previewH,
      locale: 'default',
      sessionLocales: resolvedMode === 'blank' ? {} : structuredClone(data.sessionLocales ?? {}),
      localeScreens: resolvedMode === 'blank' ? {} : structuredClone(data.localeScreens ?? {}),
      localePanoramicElements:
        resolvedMode === 'blank' ? {} : structuredClone(data.localePanoramicElements ?? {}),
      isPanoramic: resolvedMode === 'blank' ? false : data.isPanoramic === true,
      screens: snapshotScreens,
      selectedScreen: 0,
      panoramicFrameCount: data.panoramicFrameCount ?? 5,
      panoramicBackground: resolvedMode === 'blank' ? null : structuredClone(data.panoramicBackground ?? null),
      panoramicElements:
        resolvedMode === 'blank' ? [] : structuredClone(data.panoramicElements ?? []),
      panoramicEffects: structuredClone(data.panoramicEffects ?? {}),
      selectedElementIndex: null,
      exportSize: data.exportSize ?? '',
    };
    const newVariant: Record<string, unknown> = {
      id: newId,
      name: resolvedName,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      snapshot: baseSnapshotFields,
      artifacts: [],
      previewArtifacts: [],
      copyAssignments: [],
      history: [
        { kind: 'created', message: resolvedMode === 'blank' ? 'Variant created blank' : 'Variant duplicated from active', at: now },
      ],
      provenance:
        resolvedMode === 'blank'
          ? { origin: 'manual', branchDepth: 0, note: 'Started fresh — no carryover from the active variant.' }
          : { origin: 'manual', branchDepth: 0, note: 'Duplicated from the active variant via MCP.' },
    };

    const nextVariants = [...variants, newVariant];
    // Make the new variant active and reflect its snapshot at the top
    // level — the browser's hydrate path reads from there.
    const nextData: Record<string, unknown> = {
      ...data,
      variants: nextVariants,
      activeVariantId: newId,
      screens: snapshotScreens,
      sessionLocales: baseSnapshotFields.sessionLocales,
      localeScreens: baseSnapshotFields.localeScreens,
      localePanoramicElements: baseSnapshotFields.localePanoramicElements,
      panoramicElements: baseSnapshotFields.panoramicElements,
      isPanoramic: baseSnapshotFields.isPanoramic,
      selectedScreen: 0,
      selectedElementIndex: null,
      locale: 'default',
    };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, variant: newVariant });
  });

  // POST /api/projects/:project/variants/:id/delete
  //
  // Removes the variant. If it was active, falls back to the first
  // remaining variant and applies its snapshot. Rejects when it would
  // leave the project with zero variants (the UI assumes >= 1).
  app.post('/api/projects/:project/variants/:id/delete', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const variantId = typeof req.params.id === 'string' ? req.params.id : '';
    if (!variantId) {
      res.status(400).json({ error: '`id` is required in the URL' });
      return;
    }
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data } = loaded;
    const variants = Array.isArray(data.variants) ? data.variants : [];
    const filtered = variants.filter((v) => isRecord(v) && v.id !== variantId);
    if (filtered.length === variants.length) {
      res.status(404).json({ error: `variant id "${variantId}" not found` });
      return;
    }
    if (filtered.length === 0) {
      res.status(400).json({ error: 'cannot delete the last variant — projects must have at least 1' });
      return;
    }
    let nextData: Record<string, unknown> = { ...data, variants: filtered };
    if (data.activeVariantId === variantId) {
      const fallback = filtered[0] as Record<string, unknown>;
      const fallbackId = typeof fallback.id === 'string' ? fallback.id : '';
      const snapshot = isRecord(fallback.snapshot) ? fallback.snapshot : {};
      nextData = applyVariantSnapshotToData(nextData, snapshot, fallbackId);
    }
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, deleted: variantId });
  });

  // POST /api/projects/:project/variants/:id/set-active
  //
  // Switch which variant is rendered. Top-level data.screens and the
  // related locale / panoramic / selection fields are replaced from the
  // target variant's snapshot, mirroring the browser's applyVariantSnapshot.
  app.post('/api/projects/:project/variants/:id/set-active', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const variantId = typeof req.params.id === 'string' ? req.params.id : '';
    if (!variantId) {
      res.status(400).json({ error: '`id` is required in the URL' });
      return;
    }
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    const variants = Array.isArray(data.variants) ? data.variants : [];
    const target = variants.find((v) => isRecord(v) && v.id === variantId) as
      | Record<string, unknown>
      | undefined;
    if (!target) {
      res.status(404).json({ error: `variant id "${variantId}" not found` });
      return;
    }
    if (data.activeVariantId === variantId) {
      res.json({ success: true, savedAt: '', alreadyActive: true });
      return;
    }
    // Sync the OLD active variant's snapshot from current state before
    // switching, so subsequent flips between variants don't lose edits.
    syncActiveVariantSnapshot(data, screens);
    const snapshot = isRecord(target.snapshot) ? target.snapshot : {};
    const nextData = applyVariantSnapshotToData(data, snapshot, variantId);
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, active: variantId });
  });

  // POST /api/projects/:project/variants/:id/rename { name?, description?, status? }
  app.post('/api/projects/:project/variants/:id/rename', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const variantId = typeof req.params.id === 'string' ? req.params.id : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { name, description, status } = body;
    if (
      name === undefined &&
      description === undefined &&
      status === undefined
    ) {
      res.status(400).json({ error: 'pass at least one of name / description / status' });
      return;
    }
    if (status !== undefined && status !== 'draft' && status !== 'approved') {
      res.status(400).json({ error: '`status` must be "draft" or "approved"' });
      return;
    }
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data } = loaded;
    const variants = Array.isArray(data.variants) ? data.variants : [];
    let foundIdx = -1;
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (isRecord(v) && v.id === variantId) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx < 0) {
      res.status(404).json({ error: `variant id "${variantId}" not found` });
      return;
    }
    const existing = variants[foundIdx] as Record<string, unknown>;
    const updated = {
      ...existing,
      ...(typeof name === 'string' && name.length > 0 ? { name } : {}),
      ...(typeof description === 'string' ? { description } : {}),
      ...(typeof status === 'string' ? { status } : {}),
      updatedAt: new Date().toISOString(),
    };
    const nextVariants = variants.slice();
    nextVariants[foundIdx] = updated;
    const nextData = { ...data, variants: nextVariants };
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, variant: updated });
  });

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
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
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
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
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
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
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
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, screen: merged });
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
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return;
    const { data, screens } = loaded;
    const n = screens.length;
    if (order.length !== n) {
      res.status(400).json({
        error: `\`order\` length ${order.length} must match screen count ${n}`,
      });
      return;
    }
    const seen = new Set<number>();
    for (const i of order) {
      if (i >= n) {
        res.status(400).json({ error: `\`order\` index ${i} out of bounds (n=${n})` });
        return;
      }
      if (seen.has(i)) {
        res.status(400).json({ error: `\`order\` is not a permutation — index ${i} appears more than once` });
        return;
      }
      seen.add(i);
    }
    const nextScreens = order.map((i) => screens[i]);
    syncActiveVariantSnapshot(data, nextScreens);
    // Remap selectedScreen so the UI stays on the same logical screen.
    const nextData: Record<string, unknown> = { ...data, screens: nextScreens };
    const currentSelected = data.selectedScreen;
    if (typeof currentSelected === 'number') {
      const newPosition = order.indexOf(currentSelected);
      if (newPosition >= 0) nextData.selectedScreen = newPosition;
    }
    const written = await writeAndBroadcast(ctx, project, nextData, res, data);
    if (!written) return;
    res.json({ success: true, savedAt: written.savedAt, order });
  });
}
