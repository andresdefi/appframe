import { useEffect, useRef } from 'react';
import { usePreviewStore, projectSnapshotFromState, type ProjectSnapshot } from '../store';
import { saveProject } from '../utils/api';
import { createSaveScheduler } from '../utils/saveScheduler';

const DEBOUNCE_MS = 500;

export interface UseProjectAutosaveOptions {
  enabled: boolean;
  project?: string;
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
 */
export function useProjectAutosave({
  enabled,
  project = 'default',
  debounceMs = DEBOUNCE_MS,
}: UseProjectAutosaveOptions): void {
  const skipNextRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    skipNextRef.current = true;

    const scheduler = createSaveScheduler<ProjectSnapshot>({
      debounceMs,
      save: (snapshot, mode) => {
        if (mode === 'sync') {
          // keepalive lets the request outlive a page unload (Chrome,
          // Firefox, Safari all support it for fetch in modern versions).
          fetch(`/api/projects/${encodeURIComponent(project)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snapshot),
            keepalive: true,
          }).catch(() => {
            // best effort — nothing we can do once the page is gone
          });
          return;
        }
        saveProject(snapshot, project).catch((err: unknown) => {
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
      if (skipNextRef.current) {
        skipNextRef.current = false;
        return;
      }
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
