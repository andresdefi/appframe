/**
 * Tiny ring buffer of recent significant state changes. Surfaces in
 * the export diagnostic so a bug report carries the lead-up to the
 * failure, not just the moment-of-failure snapshot. The buffer lives
 * in browser memory only — nothing leaves the machine until the user
 * pastes the diagnostic JSON somewhere themselves.
 *
 * Detection is field-diff based: a single Zustand subscriber compares
 * each store transition against the previous state and emits a short
 * label. That keeps the instrumentation in one place rather than
 * sprinkled through every action.
 */

import { usePreviewStore } from '../store';

interface RecentAction {
  t: string; // ISO timestamp
  label: string;
}

const CAPACITY = 30;
const buffer: RecentAction[] = [];

function push(label: string): void {
  buffer.push({ t: new Date().toISOString(), label });
  if (buffer.length > CAPACITY) buffer.shift();
}

export function recordAction(label: string): void {
  push(label);
}

export function getRecentActions(): RecentAction[] {
  return buffer.slice();
}

export function clearRecentActions(): void {
  buffer.length = 0;
}

let subscribed = false;

/**
 * Install the store subscriber. Idempotent — calling twice is a no-op.
 * Compares previous vs next state on tracked fields and emits a label
 * for each meaningful transition. Designed to be cheap: only
 * reference comparisons + a handful of key-set diffs per event.
 */
export function setupRecentActionsRecorder(): void {
  if (subscribed) return;
  subscribed = true;
  usePreviewStore.subscribe((state, prev) => {
    if (state.activeProject !== prev.activeProject) {
      push(`setActiveProject(${state.activeProject})`);
    }
    if (state.activeVariantId !== prev.activeVariantId) {
      push(`selectVariant(${state.activeVariantId ?? 'null'})`);
    }
    if (state.variants !== prev.variants && state.variants.length !== prev.variants.length) {
      push(
        state.variants.length > prev.variants.length
          ? `createVariant -> ${state.variants.length}`
          : `deleteVariant -> ${state.variants.length}`,
      );
    }
    if (state.isPanoramic !== prev.isPanoramic) {
      push(`togglePanoramic(${state.isPanoramic})`);
    }
    if (state.locale !== prev.locale) {
      push(`setLocale(${state.locale})`);
    }
    if (state.platform !== prev.platform) {
      push(`setPlatform(${state.platform})`);
    }
    if (state.exportSize !== prev.exportSize) {
      push(`setExportSize(${state.exportSize})`);
    }
    if (state.localeScreens !== prev.localeScreens) {
      const prevKeys = Object.keys(prev.localeScreens ?? {});
      const nextKeys = Object.keys(state.localeScreens ?? {});
      if (nextKeys.length > prevKeys.length) {
        const added = nextKeys.find((k) => !prevKeys.includes(k));
        push(`addLocale(${added})`);
      } else if (nextKeys.length < prevKeys.length) {
        const removed = prevKeys.find((k) => !nextKeys.includes(k));
        push(`removeLocale(${removed})`);
      }
    }
    if (state.screens !== prev.screens) {
      if (state.screens.length !== prev.screens.length) {
        push(
          state.screens.length > prev.screens.length
            ? `addScreen -> ${state.screens.length}`
            : `removeScreen -> ${state.screens.length}`,
        );
      } else {
        // Same length, different reference. Most likely an edit on one
        // of the screens. Log the index that diverged.
        const idx = state.screens.findIndex((s, i) => s !== prev.screens[i]);
        if (idx !== -1) push(`updateScreen[${idx}]`);
      }
    }
    if (state.panoramicElements !== prev.panoramicElements) {
      if (state.panoramicElements.length !== prev.panoramicElements.length) {
        push(`panoramicElements -> ${state.panoramicElements.length}`);
      } else {
        const idx = state.panoramicElements.findIndex((e, i) => e !== prev.panoramicElements[i]);
        if (idx !== -1) push(`updatePanoramicElement[${idx}]`);
      }
    }
    if (state.panoramicBackground !== prev.panoramicBackground) {
      push('updatePanoramicBackground');
    }
    if (state.panoramicEffects !== prev.panoramicEffects) {
      push('updatePanoramicEffects');
    }
    if (state.panoramicFrameCount !== prev.panoramicFrameCount) {
      push(`setPanoramicFrameCount(${state.panoramicFrameCount})`);
    }
    if (state.autosaveStatus !== prev.autosaveStatus) {
      // Useful breadcrumb: autosave transitions next to user edits.
      push(`autosave: ${state.autosaveStatus}`);
    }
  });
}
