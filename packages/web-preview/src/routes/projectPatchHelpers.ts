import type { Response } from 'express';
import { readProject, writeProject, ProjectCorruptError, ProjectFutureSchemaError } from '../projectStorage.js';
import type { RouteContext } from './context.js';
import { recordEnvelopeWrite } from './projectHistory.js';
import { withProjectLock } from './projectMutex.js';
import { isRecord } from './utils.js';

// Shared helpers used by projectScreens, projectVariants, projectLocales
// route modules. Pulled out when projectPatch.ts grew past 1100 lines
// with the PR #28 bulk-locale additions. No routes registered here.

// Reject keys that could pollute an object's prototype or shadow
// built-in properties when used as a computed key. The locale code
// and similar user-controlled inputs flow into `{ ...obj, [key]: v }`
// patterns; even though spread + computed-key doesn't reach
// Object.prototype, a key like `toString` would silently break the
// editor state on next read.
const UNSAFE_OBJECT_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  'toString',
  'valueOf',
  'hasOwnProperty',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

export function isSafeObjectKey(key: string): boolean {
  return !UNSAFE_OBJECT_KEYS.has(key);
}

export function sanitizePatch(patch: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = Object.create(null);
  for (const key of Object.keys(patch)) {
    if (isSafeObjectKey(key)) safe[key] = patch[key];
  }
  return safe;
}

// Mutate the active variant's snapshot.screens in lockstep with the
// top-level data.screens. The browser's autosave does this every time it
// serialises (via syncActiveVariantRecord), so without this step the
// Variants panel would temporarily show a stale snapshot for the active
// variant between the agent's write and the user's next edit. Updates
// `updatedAt` on the touched variant for the same reason.
export function syncActiveVariantSnapshot(
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
export function applyVariantSnapshotToData(
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
export type LoadedEnvelope = {
  envelope: { schemaVersion: number; savedAt: string; data: unknown };
  data: Record<string, unknown>;
  screens: unknown[];
};

export async function loadForScreenOp(
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
export async function writeAndBroadcast(
  ctx: RouteContext,
  project: string,
  nextData: Record<string, unknown>,
  res: Response,
  previousData: Record<string, unknown> | undefined,
  opName: string,
): Promise<{ savedAt: string } | null> {
  try {
    // Skip the disk write if the envelope is byte-identical to what
    // was loaded — no-op patches happen surprisingly often (agent
    // setting a field to its current value). Atomic write is cheap
    // (~2 ms) but skipping is cheaper and avoids spurious savedAt
    // timestamps that could trick the user into thinking they have
    // unsaved work to commit. We still broadcast in case any client
    // is interested in the touch. No-ops don't go into undo history
    // either — there'd be nothing to undo.
    if (previousData && deepEquals(previousData, nextData)) {
      ctx.broadcastEvent({ type: 'project-changed', source: 'agent', slug: project, unchanged: true });
      return { savedAt: '' };
    }
    const written = await writeProject(ctx.projectStorage, project, nextData);
    ctx.broadcastEvent({ type: 'project-changed', source: 'agent', slug: project });
    // Push the pre-write envelope onto the undo stack. We only get here
    // when previousData was supplied and differs from nextData; both
    // are required to make undo meaningful.
    if (previousData) {
      recordEnvelopeWrite(project, previousData, opName, written.savedAt);
    }
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

/**
 * Serialised read-modify-write on a project's JSON envelope.
 *
 * Acquires the per-project mutex, reads the envelope from disk, hands
 * it to `fn`, and writes the result back atomically. The lock is held
 * for the entire cycle so concurrent callers cannot interleave reads
 * and writes.
 *
 * `fn` receives the loaded envelope and must return the next top-level
 * `data` object. Return `null` to abort without writing (e.g. after
 * sending an error response via `res`).
 */
export async function mutateProject(
  ctx: RouteContext,
  project: string,
  res: Response,
  opName: string,
  fn: (loaded: LoadedEnvelope) => Record<string, unknown> | null,
): Promise<{ savedAt: string } | null> {
  return withProjectLock(project, async () => {
    const loaded = await loadForScreenOp(ctx, project, res);
    if (!loaded) return null;
    const nextData = fn(loaded);
    if (!nextData) return null;
    return writeAndBroadcast(ctx, project, nextData, res, loaded.data, opName);
  });
}
