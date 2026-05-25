import type { Express, Request, Response } from 'express';
import { gzipSync, gunzipSync } from 'node:zlib';
import { writeProject } from '../projectStorage.js';
import type { RouteContext } from './context.js';

// In-memory undo history per project. Hooked from writeAndBroadcast
// (projectPatchHelpers.ts) so every envelope mutation that goes through
// the agent-write chokepoint shows up here.
//
// Design notes:
//   - History is per-slug, capped at MAX_HISTORY entries (oldest evicted).
//   - Each entry stores the pre-write envelope as a gzipped JSON buffer.
//     A typical 40 KB envelope compresses to ~4-8 KB; 25 entries x ~6 KB
//     ≈ 150 KB per active project (vs ~1 MB uncompressed). Gzip costs
//     ~1-2 ms on write and the same on undo. We chose gzip over an
//     RFC 6902 patch chain because most envelope writes reassign whole
//     top-level fields (`{...data, screens: nextScreens}`) — a top-
//     level diff would store the full previous `screens` array anyway,
//     and a deep diff that walks into arrays adds correctness risk
//     without much more savings than gzip already provides.
//   - Server restart clears history. Agents shouldn't expect undo
//     across restarts — the user can reload the file from disk to see
//     the last persisted state.
//   - Undo doesn't track itself (no infinite stack). Once undone,
//     entries are gone; there's no redo.
//   - No-op writes (envelope identical to current) skip recording —
//     writeAndBroadcast already returns early on those.

const MAX_HISTORY = 25;

interface HistoryEntry {
  /** gzipSync(JSON.stringify(beforeData)). Restore via gunzipSync + JSON.parse. */
  compressedBefore: Buffer;
  opName: string;
  savedAt: string;
}

const projectHistory = new Map<string, HistoryEntry[]>();

/**
 * Record a pre-write snapshot for `slug`. Called by writeAndBroadcast
 * after a successful disk write. Compresses the envelope before
 * storing so 25 entries x 40 KB stays under ~200 KB instead of ~1 MB.
 * Oldest entry evicts when the stack passes MAX_HISTORY.
 */
export function recordEnvelopeWrite(
  slug: string,
  beforeData: unknown,
  opName: string,
  savedAt: string,
): void {
  const stack = projectHistory.get(slug) ?? [];
  const compressedBefore = gzipSync(JSON.stringify(beforeData));
  stack.push({ compressedBefore, opName, savedAt });
  if (stack.length > MAX_HISTORY) stack.shift();
  projectHistory.set(slug, stack);
}

/**
 * Returns the most-recent-first list of history entries (metadata only)
 * for `slug`. `limit` caps the response; default returns everything.
 */
export function getRecentWrites(
  slug: string,
  limit?: number,
): { opName: string; savedAt: string; index: number }[] {
  const stack = projectHistory.get(slug) ?? [];
  // Most recent first — the agent thinks in "undo this latest one".
  const reversed = stack
    .map((e, i) => ({ opName: e.opName, savedAt: e.savedAt, index: stack.length - 1 - i }))
    .reverse();
  return typeof limit === 'number' && limit > 0 ? reversed.slice(0, limit) : reversed;
}

/**
 * Pop the most recent entry off `slug`'s history. Returns null when
 * the stack is empty. Callers are responsible for actually applying
 * the restored envelope to disk.
 */
function popLastWrite(slug: string): HistoryEntry | null {
  const stack = projectHistory.get(slug);
  if (!stack || stack.length === 0) return null;
  const entry = stack.pop()!;
  // Keep the empty array in the map — cheap and avoids re-creating
  // the entry on the next write. clearHistoryForProject handles
  // explicit removal.
  return entry;
}

/**
 * Drop all history for `slug`. Called when a project is deleted so a
 * future project with the same slug doesn't inherit ghost history.
 */
export function clearHistoryForProject(slug: string): void {
  projectHistory.delete(slug);
}

/**
 * Test-only: clear every history entry across every project. Used by
 * the integration test setup to keep tests independent.
 */
export function resetAllHistoryForTesting(): void {
  projectHistory.clear();
}

export function registerProjectHistoryRoutes(app: Express, ctx: RouteContext): void {
  // GET /api/projects/:project/recent-writes?limit=N
  //
  // Lightweight read: opName + savedAt + index per entry. Does NOT
  // return the snapshotted envelopes themselves — those can be 40 KB
  // each. The agent uses this to confirm what would be undone.
  app.get('/api/projects/:project/recent-writes', (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const limitRaw = req.query.limit;
    let limit: number | undefined;
    if (typeof limitRaw === 'string' && limitRaw.length > 0) {
      const n = Number(limitRaw);
      if (!Number.isInteger(n) || n <= 0) {
        res.status(400).json({ error: '`limit` must be a positive integer' });
        return;
      }
      limit = n;
    }
    const entries = getRecentWrites(project, limit);
    res.json({ slug: project, entries, total: (projectHistory.get(project) ?? []).length });
  });

  // POST /api/projects/:project/undo-last-write
  //
  // Pop the most recent entry off the history stack, write its
  // `beforeData` snapshot back to disk, broadcast a project-changed
  // SSE so the browser re-hydrates. The undo itself does NOT push to
  // history — that would create an infinite stack and there's no redo
  // tool. A 409 conflict is returned when the history is empty.
  app.post('/api/projects/:project/undo-last-write', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const entry = popLastWrite(project);
    if (!entry) {
      res.status(409).json({
        error: 'no history to undo for this project (server may have restarted, or no agent writes have happened yet)',
      });
      return;
    }
    try {
      // Decompress + parse the stored pre-write envelope. JSON.parse
      // throws on corrupt input; the catch below pushes the entry back
      // onto the stack so the user can retry / report.
      const beforeData = JSON.parse(gunzipSync(entry.compressedBefore).toString('utf-8')) as Record<string, unknown>;
      const written = await writeProject(
        ctx.projectStorage,
        project,
        beforeData,
      );
      ctx.broadcastEvent({ type: 'project-changed', source: 'agent', slug: project, undo: true });
      res.json({
        success: true,
        undone: { opName: entry.opName, savedAt: entry.savedAt },
        remaining: (projectHistory.get(project) ?? []).length,
        newSavedAt: written.savedAt,
      });
    } catch (err) {
      // Restore the entry on failure so the user can retry. Push-back
      // is safe because pop already mutated the stack — appending it
      // back puts it where it was.
      const stack = projectHistory.get(project) ?? [];
      stack.push(entry);
      projectHistory.set(project, stack);
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
    }
  });
}
