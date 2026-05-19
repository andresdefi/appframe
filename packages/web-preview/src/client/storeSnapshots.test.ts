import { describe, it, expect } from 'vitest';
import {
  variantSnapshotFromState,
  applyVariantSnapshot,
  coerceVariantSnapshot,
  buildVariantRecord,
  nextVariantName,
  makeHistoryEntry,
  makeId,
} from './storeSnapshots';
import type { ScreenState, PanoramicElement, PanoramicBackground, PanoramicEffects } from './types';
import type { VariantSnapshot } from './store';

function makeStubScreen(id: string, overrides: Partial<ScreenState> = {}): ScreenState {
  // The factory used by the snapshot helpers only cares about a handful
  // of fields existing; everything else is round-tripped untouched.
  return {
    id,
    screenIndex: 0,
    headline: 'Hello',
    subtitle: '',
    isFullscreen: false,
    layout: 'center',
    font: 'inter',
    fontWeight: 400,
    headlineFont: 'inter',
    headlineFontWeight: 600,
    subtitleFont: 'inter',
    subtitleFontWeight: 400,
    headlineSize: 0,
    subtitleSize: 0,
    headlineRotation: 0,
    subtitleRotation: 0,
    freeText: '',
    freeTextEnabled: false,
    freeTextSize: 0,
    freeTextFont: 'inter',
    freeTextFontWeight: 400,
    freeTextRotation: 0,
    freeTextLetterSpacing: 0,
    freeTextTextTransform: '',
    colors: {
      primary: '#000',
      secondary: '#000',
      background: '#fff',
      text: '#000',
      subtitle: '#64748B',
      freeText: '#64748B',
    },
    frameId: '',
    deviceColor: '',
    frameStyle: 'flat',
    composition: 'single',
    deviceScale: 92,
    deviceTop: 20,
    deviceRotation: 0,
    deviceOffsetX: 0,
    deviceAngle: 8,
    deviceTilt: 0,
    headlineGradient: null,
    subtitleGradient: null,
    headlineLineHeight: 0,
    headlineLetterSpacing: 0,
    headlineTextTransform: '',
    headlineFontStyle: '',
    subtitleOpacity: 0,
    subtitleLetterSpacing: 0,
    subtitleTextTransform: '',
    spotlight: null,
    annotations: [],
    textPositions: { headline: null, subtitle: null, freeText: null },
    screenshotUrl: null,
    screenshotName: null,
    screenshotDims: null,
    backgroundType: 'solid',
    backgroundColor: '#fff',
    backgroundGradient: { type: 'linear', colors: ['#fff', '#000'], direction: 0, radialPosition: 'center' },
    backgroundImageDataUrl: null,
    backgroundImageFit: 'cover',
    backgroundImagePositionX: 50,
    backgroundImagePositionY: 50,
    backgroundImageScale: 100,
    backgroundOverlay: null,
    deviceShadow: null,
    borderSimulation: null,
    cornerRadius: 0,
    loupe: null,
    callouts: [],
    overlays: [],
    extraDevices: [],
    ...overrides,
  } as ScreenState;
}

const stubBackground: PanoramicBackground = { type: 'solid', color: '#ffffff', layers: [] };
const stubEffects: PanoramicEffects = { spotlight: null, annotations: [], overlays: [] };

function makeBaseState() {
  return {
    platform: 'iphone',
    previewW: 400,
    previewH: 868,
    locale: 'default',
    sessionLocales: {},
    localeScreens: {},
    localePanoramicElements: {},
    isPanoramic: false,
    screens: [makeStubScreen('s1')],
    selectedScreen: 0,
    panoramicFrameCount: 5,
    panoramicBackground: stubBackground,
    panoramicElements: [] as PanoramicElement[],
    panoramicEffects: stubEffects,
    selectedElementIndex: null,
    exportSize: 'ios-6.9',
  };
}

describe('makeId', () => {
  it('returns a prefixed unique-ish id', () => {
    const a = makeId('history');
    const b = makeId('history');
    expect(a.startsWith('history-')).toBe(true);
    expect(b.startsWith('history-')).toBe(true);
    expect(a).not.toBe(b);
  });
});

describe('makeHistoryEntry', () => {
  it('builds an entry with auto-generated id and timestamp', () => {
    const entry = makeHistoryEntry('created', 'New variant');
    expect(entry.type).toBe('created');
    expect(entry.label).toBe('New variant');
    expect(entry.id.startsWith('history-')).toBe(true);
    expect(typeof entry.createdAt).toBe('string');
    expect(() => new Date(entry.createdAt).toISOString()).not.toThrow();
  });

  it('merges extras over the base fields', () => {
    const entry = makeHistoryEntry('duplicated', 'Branch', { sourceVariantId: 'v1' });
    expect(entry.sourceVariantId).toBe('v1');
  });
});

describe('variantSnapshotFromState', () => {
  it('deep-copies every nested reference so later mutations don\'t leak in', () => {
    const state = makeBaseState();
    const snapshot = variantSnapshotFromState(state);
    expect(snapshot.screens).not.toBe(state.screens);
    expect(snapshot.screens[0]).not.toBe(state.screens[0]);
    // Mutating the original after snapshotting must not change the snapshot
    state.screens[0]!.headline = 'CHANGED';
    expect(snapshot.screens[0]!.headline).toBe('Hello');
  });

  it('round-trips through applyVariantSnapshot preserving primitive fields', () => {
    const state = makeBaseState();
    state.locale = 'es-MX';
    state.previewW = 500;
    state.selectedScreen = 0;
    const snapshot = variantSnapshotFromState(state);
    const applied = applyVariantSnapshot(snapshot);
    expect(applied.locale).toBe('es-MX');
    expect(applied.previewW).toBe(500);
    expect(applied.platform).toBe(state.platform);
    expect(applied.screens.length).toBe(state.screens.length);
    expect(applied.screens[0]!.headline).toBe(state.screens[0]!.headline);
  });

  it('initializes localeScreens / localePanoramicElements to {} on legacy snapshots', () => {
    const state = makeBaseState();
    const snapshot = variantSnapshotFromState(state);
    // Strip the snapshot-model fields the way an older saved file would.
    const legacy = { ...snapshot } as VariantSnapshot;
    delete (legacy as { localeScreens?: unknown }).localeScreens;
    delete (legacy as { localePanoramicElements?: unknown }).localePanoramicElements;
    const applied = applyVariantSnapshot(legacy);
    expect(applied.localeScreens).toEqual({});
    expect(applied.localePanoramicElements).toEqual({});
  });

  it('runs the screenshotDataUrl→screenshotUrl migration on locale snapshots', () => {
    // A pre-rename project file would have `screenshotDataUrl` on each
    // locale screen too — not just the top-level screens. Without
    // fattening locale screens on load, the field would survive under
    // the legacy name and the new code (reading `.screenshotUrl`) would
    // see undefined → screenshots vanish from the locale rows.
    const state = makeBaseState();
    const snapshot = variantSnapshotFromState(state);
    const legacy = {
      ...snapshot,
      localeScreens: {
        'es-ES': [
          {
            id: 'es-1',
            screenIndex: 0,
            headline: 'Hola',
            screenshotDataUrl: '/api/screenshots/proj/screen-1.png',
          },
        ],
      },
    } as unknown as VariantSnapshot;
    const applied = applyVariantSnapshot(legacy);
    const esScreens = applied.localeScreens['es-ES']!;
    expect(esScreens[0]!.screenshotUrl).toBe('/api/screenshots/proj/screen-1.png');
    // Legacy key is gone after the migration.
    expect((esScreens[0] as Record<string, unknown>).screenshotDataUrl).toBeUndefined();
  });
});

describe('coerceVariantSnapshot', () => {
  it('returns the fallback for non-object candidates', () => {
    const fallback = variantSnapshotFromState(makeBaseState());
    expect(coerceVariantSnapshot(null, fallback)).toBe(fallback);
    expect(coerceVariantSnapshot('not an object', fallback)).toBe(fallback);
    expect(coerceVariantSnapshot(42, fallback)).toBe(fallback);
  });

  it('returns the fallback when screens or panoramicElements arrays are missing', () => {
    const fallback = variantSnapshotFromState(makeBaseState());
    expect(coerceVariantSnapshot({ locale: 'es-MX' }, fallback)).toBe(fallback);
  });

  it('accepts a well-formed candidate and deep-copies nested arrays', () => {
    const fallback = variantSnapshotFromState(makeBaseState());
    const candidate = {
      ...fallback,
      locale: 'es-MX',
      screens: [makeStubScreen('s2', { headline: 'Hola' })],
    };
    const result = coerceVariantSnapshot(candidate, fallback);
    expect(result.locale).toBe('es-MX');
    expect(result.screens).not.toBe(candidate.screens);
    expect(result.screens[0]!.headline).toBe('Hola');
  });

  it('defaults missing localeScreens to {}', () => {
    const fallback = variantSnapshotFromState(makeBaseState());
    const candidate: Record<string, unknown> = {
      ...fallback,
      screens: [makeStubScreen('s1')],
      panoramicElements: [],
    };
    delete candidate.localeScreens;
    delete candidate.localePanoramicElements;
    const result = coerceVariantSnapshot(candidate, fallback);
    expect(result.localeScreens).toEqual({});
    expect(result.localePanoramicElements).toEqual({});
  });
});

describe('buildVariantRecord', () => {
  it('snapshots the state and attaches default history', () => {
    const state = makeBaseState();
    const variant = buildVariantRecord('Concept A', state);
    expect(variant.name).toBe('Concept A');
    expect(variant.status).toBe('draft');
    expect(variant.snapshot.screens.length).toBe(1);
    expect(variant.history.length).toBe(1);
    expect(variant.history[0]!.type).toBe('created');
    expect(variant.provenance.origin).toBe('manual');
  });

  it('uses provided provenance and history when given', () => {
    const state = makeBaseState();
    const customHistory = [makeHistoryEntry('duplicated', 'Forked')];
    const variant = buildVariantRecord('Branch', state, {
      provenance: { origin: 'duplicate', parentVariantId: 'v0', branchDepth: 1 },
      history: customHistory,
    });
    expect(variant.history).toBe(customHistory);
    expect(variant.provenance.origin).toBe('duplicate');
    expect(variant.provenance.parentVariantId).toBe('v0');
  });
});

describe('nextVariantName', () => {
  it('returns "Variant 1" for an empty list', () => {
    expect(nextVariantName([])).toBe('Variant 1');
  });

  it('skips taken names', () => {
    const variants = [
      { name: 'Variant 1' },
      { name: 'Variant 2' },
    ] as Parameters<typeof nextVariantName>[0];
    expect(nextVariantName(variants)).toBe('Variant 3');
  });

  it('honors custom prefix', () => {
    expect(nextVariantName([], 'Concept')).toBe('Concept 1');
  });
});
