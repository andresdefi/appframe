// Variant + project snapshot serialization extracted from store.ts.
//
// All functions are pure (state in → snapshot out, or snapshot in →
// hydrated slice out). They never read or mutate the live store, which
// makes them trivially unit-testable — see storeSnapshots.test.ts.

import type {
  LocaleConfig,
  PanoramicBackground,
  PanoramicEffects,
  PanoramicElement,
  ScreenState,
} from './types';
import type {
  PreviewStore,
  ProjectSnapshot,
  VariantHistoryEntry,
  VariantProvenance,
  VariantRecord,
  VariantSnapshot,
} from './store';
import { fattenScreen } from './utils/screenSerialization';
import { deepCopy, isRecord } from './utils/cloneHelpers';

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeHistoryEntry(
  type: VariantHistoryEntry['type'],
  label: string,
  extras: Omit<VariantHistoryEntry, 'id' | 'createdAt' | 'type' | 'label'> = {},
): VariantHistoryEntry {
  return {
    id: makeId('history'),
    createdAt: new Date().toISOString(),
    type,
    label,
    ...extras,
  };
}

type SnapshotablePreviewState = Pick<
  PreviewStore,
  | 'platform'
  | 'previewW'
  | 'previewH'
  | 'locale'
  | 'sessionLocales'
  | 'localeScreens'
  | 'localePanoramicElements'
  | 'isPanoramic'
  | 'screens'
  | 'selectedScreen'
  | 'panoramicFrameCount'
  | 'panoramicBackground'
  | 'panoramicElements'
  | 'panoramicEffects'
  | 'selectedElementIndex'
  | 'exportSize'
>;

export function variantSnapshotFromState(state: SnapshotablePreviewState): VariantSnapshot {
  return {
    platform: state.platform,
    previewW: state.previewW,
    previewH: state.previewH,
    locale: state.locale,
    sessionLocales: deepCopy(state.sessionLocales),
    localeScreens: deepCopy(state.localeScreens ?? {}),
    localePanoramicElements: deepCopy(state.localePanoramicElements ?? {}),
    isPanoramic: state.isPanoramic,
    screens: deepCopy(state.screens),
    selectedScreen: state.selectedScreen,
    panoramicFrameCount: state.panoramicFrameCount,
    panoramicBackground: deepCopy(state.panoramicBackground),
    panoramicElements: deepCopy(state.panoramicElements),
    panoramicEffects: deepCopy(state.panoramicEffects),
    selectedElementIndex: state.selectedElementIndex,
    exportSize: state.exportSize,
  };
}

export function projectSnapshotFromState(
  state: SnapshotablePreviewState &
    Pick<PreviewStore, 'variants' | 'activeVariantId' | 'recommendedVariantId'>,
): ProjectSnapshot {
  // syncActiveVariantRecord refreshes the active variant's snapshot field
  // from the current state before serializing, so a save always captures
  // the user's latest edits in the active variant's record.
  const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
  return {
    ...variantSnapshotFromState(state),
    variants: deepCopy(variants),
    activeVariantId: state.activeVariantId,
    recommendedVariantId: state.recommendedVariantId,
  };
}

/**
 * Apply `fattenScreen` to every screen in every locale snapshot. Mirrors
 * the top-level `snapshot.screens` fatten pass so the legacy
 * `screenshotDataUrl` → `screenshotUrl` migration (and any other
 * STATIC-defaults re-injection) runs on locale clones too. Without this,
 * a project file saved before the rename would load with the locale
 * screenshots missing — the field would be present on disk under the
 * old key and absent under the new one.
 */
function fattenLocaleScreens(
  raw: Record<string, ScreenState[]> | undefined,
): Record<string, ScreenState[]> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, ScreenState[]> = {};
  for (const [code, screens] of Object.entries(raw)) {
    if (!Array.isArray(screens)) continue;
    out[code] = screens.map((rawScreen) => fattenScreen(rawScreen) as ScreenState);
  }
  return out;
}

export function applyVariantSnapshot(
  snapshot: VariantSnapshot,
): Pick<
  PreviewStore,
  | 'platform'
  | 'previewW'
  | 'previewH'
  | 'locale'
  | 'sessionLocales'
  | 'localeScreens'
  | 'localePanoramicElements'
  | 'isPanoramic'
  | 'screens'
  | 'selectedScreen'
  | 'panoramicFrameCount'
  | 'panoramicBackground'
  | 'panoramicElements'
  | 'panoramicEffects'
  | 'selectedElementIndex'
  | 'exportSize'
> {
  return {
    platform: snapshot.platform,
    previewW: snapshot.previewW,
    previewH: snapshot.previewH,
    locale: snapshot.locale,
    sessionLocales: deepCopy(snapshot.sessionLocales),
    // Each locale's screens needs the same fattenScreen pass the
    // top-level `screens` gets below, so STATIC defaults are re-injected
    // AND the legacy `screenshotDataUrl` → `screenshotUrl` migration
    // runs on each entry. Without this, locales saved before the rename
    // lose their screenshots on load.
    localeScreens: fattenLocaleScreens(snapshot.localeScreens),
    localePanoramicElements: deepCopy(snapshot.localePanoramicElements ?? {}),
    isPanoramic: snapshot.isPanoramic,
    // Backfill stable id for older snapshots that pre-date the field.
    // Also backfill the freeText fields for snapshots saved before that
    // feature shipped — defaults match createScreenState.
    //
    // Slimming at save time strips fields that match STATIC_SCREEN_DEFAULTS
    // (see utils/screenSerialization). fattenScreen re-injects those
    // defaults here so consumers downstream still see a full ScreenState.
    // The ad-hoc backfills below remain for theme-derived fields that
    // aren't part of the static-defaults set.
    screens: deepCopy(snapshot.screens).map((rawScreen) => {
      const s = fattenScreen(rawScreen) as ScreenState;
      const fallbackFont = s.font ?? 'inter';
      const next: ScreenState = {
        ...s,
        id: s.id ?? crypto.randomUUID(),
        headlineFont: s.headlineFont ?? fallbackFont,
        headlineFontWeight: s.headlineFontWeight ?? s.fontWeight ?? 600,
        subtitleFont: s.subtitleFont ?? fallbackFont,
        subtitleFontWeight: s.subtitleFontWeight ?? 400,
        freeText: s.freeText ?? '',
        freeTextEnabled: s.freeTextEnabled ?? false,
        freeTextSize: s.freeTextSize ?? 0,
        freeTextFont: s.freeTextFont ?? fallbackFont,
        freeTextFontWeight: s.freeTextFontWeight ?? 400,
        freeTextRotation: s.freeTextRotation ?? 0,
        freeTextLetterSpacing: s.freeTextLetterSpacing ?? 0,
        freeTextTextTransform: s.freeTextTextTransform ?? '',
        colors: {
          ...s.colors,
          freeText: s.colors?.freeText ?? s.colors?.subtitle ?? '#64748B',
        },
        textPositions: {
          headline: s.textPositions?.headline ?? null,
          subtitle: s.textPositions?.subtitle ?? null,
          freeText: s.textPositions?.freeText ?? null,
        },
      };
      return next;
    }),
    selectedScreen: snapshot.selectedScreen,
    panoramicFrameCount: snapshot.panoramicFrameCount,
    panoramicBackground: deepCopy(snapshot.panoramicBackground),
    panoramicElements: deepCopy(snapshot.panoramicElements),
    panoramicEffects: deepCopy(snapshot.panoramicEffects),
    selectedElementIndex: snapshot.selectedElementIndex,
    exportSize: snapshot.exportSize,
  };
}

export function coerceVariantSnapshot(
  candidate: unknown,
  fallback: VariantSnapshot,
): VariantSnapshot {
  if (!candidate || typeof candidate !== 'object') return fallback;
  const snapshot = candidate as Partial<VariantSnapshot>;
  if (!Array.isArray(snapshot.screens) || !Array.isArray(snapshot.panoramicElements)) {
    return fallback;
  }

  return {
    ...fallback,
    ...snapshot,
    locale: typeof snapshot.locale === 'string' ? snapshot.locale : fallback.locale,
    sessionLocales:
      snapshot.sessionLocales && typeof snapshot.sessionLocales === 'object'
        ? deepCopy(snapshot.sessionLocales as Record<string, LocaleConfig>)
        : fallback.sessionLocales,
    localeScreens:
      snapshot.localeScreens && typeof snapshot.localeScreens === 'object'
        ? fattenLocaleScreens(snapshot.localeScreens as Record<string, ScreenState[]>)
        : {},
    localePanoramicElements:
      snapshot.localePanoramicElements &&
      typeof snapshot.localePanoramicElements === 'object'
        ? deepCopy(
            snapshot.localePanoramicElements as Record<string, PanoramicElement[]>,
          )
        : {},
    screens: deepCopy(snapshot.screens as ScreenState[]),
    panoramicBackground: deepCopy(
      (snapshot.panoramicBackground ?? fallback.panoramicBackground) as PanoramicBackground,
    ),
    panoramicElements: deepCopy(snapshot.panoramicElements as PanoramicElement[]),
    panoramicEffects: deepCopy(
      (snapshot.panoramicEffects ?? fallback.panoramicEffects) as PanoramicEffects,
    ),
    exportSize: typeof snapshot.exportSize === 'string' ? snapshot.exportSize : fallback.exportSize,
  };
}

export function syncActiveVariantRecord(
  variants: VariantRecord[],
  activeVariantId: string | null,
  state: SnapshotablePreviewState,
): VariantRecord[] {
  if (!activeVariantId) return variants;

  const snapshot = variantSnapshotFromState(state);
  const updatedAt = new Date().toISOString();
  return variants.map((variant) =>
    variant.id === activeVariantId ? { ...variant, snapshot, updatedAt } : variant,
  );
}

export function buildVariantRecord(
  name: string,
  state: SnapshotablePreviewState,
  options: {
    description?: string;
    provenance?: VariantProvenance;
    history?: VariantHistoryEntry[];
  } = {},
): VariantRecord {
  const timestamp = new Date().toISOString();
  return {
    id: makeId('variant'),
    name,
    description: options.description,
    status: 'draft',
    createdAt: timestamp,
    updatedAt: timestamp,
    snapshot: variantSnapshotFromState(state),
    artifacts: [],
    previewArtifacts: [],
    copyAssignments: [],
    history: options.history ?? [makeHistoryEntry('created', 'Variant created')],
    provenance: options.provenance ?? { origin: 'manual', branchDepth: 0 },
  };
}

export function cloneVariantRecord(
  source: VariantRecord,
  snapshot: VariantSnapshot,
  options: {
    name: string;
    description?: string;
    provenance: VariantProvenance;
    historyEntry: VariantHistoryEntry;
  },
): VariantRecord {
  const timestamp = new Date().toISOString();
  return {
    ...source,
    id: makeId('variant'),
    name: options.name,
    description: options.description ?? source.description,
    status: 'draft',
    createdAt: timestamp,
    updatedAt: timestamp,
    snapshot,
    artifacts: [],
    previewArtifacts: [],
    score: undefined,
    history: [options.historyEntry, ...source.history],
    provenance: options.provenance,
  };
}

export function nextVariantName(variants: VariantRecord[], prefix = 'Variant'): string {
  let index = variants.length + 1;
  let candidate = `${prefix} ${index}`;
  const taken = new Set(variants.map((variant) => variant.name));
  while (taken.has(candidate)) {
    index += 1;
    candidate = `${prefix} ${index}`;
  }
  return candidate;
}

/**
 * Pick a non-colliding branch name for a duplicated variant.
 * Strips any trailing ` Branch` / ` Branch N` from the active name to
 * find the base, then walks `Branch`, `Branch 2`, `Branch 3`, … until
 * one's free. Prevents "Variant 2 Branch Branch Branch" pile-ups when
 * the user duplicates an already-duplicated variant.
 */
export function nextBranchName(activeName: string, variants: VariantRecord[]): string {
  const base = activeName.replace(/ Branch(?: \d+)?$/, '');
  const taken = new Set(variants.map((variant) => variant.name));
  const first = `${base} Branch`;
  if (!taken.has(first)) return first;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base} Branch ${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base} Branch ${Date.now()}`;
}

// Re-export the clone helpers so callers don't need to know they live
// in utils/. Keeps the import surface coherent.
export { deepCopy, isRecord };
