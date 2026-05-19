import { useEffect, useRef } from 'react';
import { usePreviewStore, projectSnapshotFromState, type ProjectSnapshot } from '../store';
import { saveProject } from '../utils/api';
import { createSaveScheduler } from '../utils/saveScheduler';
import { slimProjectSnapshot } from '../utils/screenSerialization';

const DEBOUNCE_MS = 500;

export interface UseProjectAutosaveOptions {
  enabled: boolean;
  /** Active project slug. Required; the hook becomes a no-op if empty. */
  project: string;
  debounceMs?: number;
}

/**
 * Subscribes to the persistable slice of the store and POSTs a debounced
 * snapshot to /api/projects/<project>. Flushes pending saves on
 * `beforeunload` and `visibilitychange → hidden` so a tab close doesn't
 * eat the user's last keystroke.
 *
 * The first store change after `enabled` flips true is skipped — it lets
 * the boot hydration settle without triggering an immediate echo save.
 *
 * Becomes a no-op if `project` is empty (e.g. during boot before
 * App.tsx has resumed or auto-created a project) — without this guard
 * we'd PUT /api/projects/ which 404s and corrupts the autosave loop.
 */
export function useProjectAutosave({
  enabled,
  project,
  debounceMs = DEBOUNCE_MS,
}: UseProjectAutosaveOptions): void {
  // Snapshot at subscribe time, used to ignore subscribe-time echoes
  // without dropping the user's first real edit. The old skip-the-
  // next-change ref dropped the first edit whenever a project was
  // opened or switched, because hydrate had already finished before
  // the subscriber attached — the user's first edit was the first
  // change observed, and it got skipped. Comparing against a baseline
  // serializes only the no-op echoes (state set to the same shape it
  // already had) and lets real edits through.
  const baselineRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Empty project = not booted yet. Don't subscribe — see header comment.
    if (!project) return;
    baselineRef.current = JSON.stringify(projectSnapshotFromState(usePreviewStore.getState()));

    const scheduler = createSaveScheduler<ProjectSnapshot>({
      debounceMs,
      save: (snapshot, mode) => {
        // Slim screen fields at the JSON-boundary: fields that still
        // match STATIC_SCREEN_DEFAULTS are stripped, shrinking the
        // persisted file by roughly 3-5x without changing in-memory
        // behaviour. fattenScreen in applyVariantSnapshot re-injects
        // the defaults on load.
        const slimmed = slimProjectSnapshot(snapshot);
        if (mode === 'sync') {
          // keepalive lets the request outlive a page unload (Chrome,
          // Firefox, Safari all support it for fetch in modern versions).
          fetch(`/api/projects/${encodeURIComponent(project)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slimmed),
            keepalive: true,
          }).catch(() => {
            // best effort — nothing we can do once the page is gone
          });
          return;
        }
        saveProject(slimmed, project).catch((err: unknown) => {
          console.warn('Project autosave failed', err);
        });
      },
    });

    const unsubscribe = usePreviewStore.subscribe((state, prev) => {
      const fields: Array<keyof typeof state> = [
        'platform',
        'previewW',
        'previewH',
        'locale',
        'sessionLocales',
        'localeScreens',
        'localePanoramicElements',
        'isPanoramic',
        'screens',
        'selectedScreen',
        'panoramicFrameCount',
        'panoramicBackground',
        'panoramicElements',
        'panoramicEffects',
        'selectedElementIndex',
        'exportSize',
        'variants',
        'activeVariantId',
        'recommendedVariantId',
      ];
      const changed = fields.some((f) => state[f] !== prev[f]);
      if (!changed) return;
      // Compare serialized snapshots against the baseline so we ignore
      // store events that produce the same persistent shape as what we
      // already had at subscribe time. Anything that meaningfully
      // diverges — every real edit — gets through on the first try.
      const nextSerialized = JSON.stringify(
        projectSnapshotFromState(usePreviewStore.getState()),
      );
      if (nextSerialized === baselineRef.current) return;
      baselineRef.current = nextSerialized;
      scheduler.schedule(() => projectSnapshotFromState(usePreviewStore.getState()));
    });

    const onBeforeUnload = () => scheduler.flushSync();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') scheduler.flushSync();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onVisibility);
      // Flush before dispose so a project-switch doesn't drop the user's
      // last edits to the project they're navigating away from. The
      // scheduler was set up with the *old* project's URL, which is
      // exactly what we want here.
      scheduler.flushSync();
      scheduler.dispose();
    };
  }, [enabled, project, debounceMs]);
}
