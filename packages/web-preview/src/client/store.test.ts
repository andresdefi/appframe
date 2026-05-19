import { describe, it, expect, beforeEach } from 'vitest';
import { usePreviewStore } from './store';
import { buildVariantRecord } from './storeSnapshots';
import type { AppframeConfig } from './types';

function makeConfig(): AppframeConfig {
  return {
    project: 'test-store',
    platforms: ['iphone'],
    sizes: { iphone: ['ios-6.9'] },
    frames: { ios: 'iphone-17-pro-max', style: 'flat', deviceColor: undefined },
    theme: {
      font: 'inter',
      fontWeight: 700,
      headlineFont: 'inter',
      headlineFontWeight: 800,
      subtitleFont: 'inter',
      subtitleFontWeight: 400,
      colors: {
        primary: '#000', secondary: '#666', background: '#fff',
        text: '#000', subtitle: '#666', freeText: '#666',
      },
    },
    screens: [
      { headline: 'Existing', subtitle: 'A', screenshot: 'screenshots/a.png' },
    ],
    backgrounds: { default: 'preset:lavender' },
    fonts: { paths: [] },
  } as unknown as AppframeConfig;
}

beforeEach(() => {
  usePreviewStore.setState({
    variants: [],
    activeVariantId: null,
    config: null,
  });
});

describe('recordVariantArtifact', () => {
  // Regression: makeId was used in store.ts without being imported, so
  // recordVariantArtifact / recordVariantArtifactForVariant threw a
  // ReferenceError the moment an export finished.
  it('records an artifact onto the active variant without throwing', () => {
    const variant = buildVariantRecord('Test', usePreviewStore.getState());
    usePreviewStore.setState({ variants: [variant], activeVariantId: variant.id });

    expect(() =>
      usePreviewStore.getState().recordVariantArtifact({
        kind: 'screens',
        locale: 'default',
        mode: 'individual',
        sizeKey: 'ios-6.9',
        renderer: 'modern-screenshot',
        fileNames: ['screen-1.png'],
      }),
    ).not.toThrow();

    const updated = usePreviewStore.getState().variants.find((v) => v.id === variant.id);
    expect(updated?.artifacts).toHaveLength(1);
    expect(updated?.artifacts[0]?.id).toMatch(/^artifact-/);
  });

  it('recordVariantArtifactForVariant assigns a fresh id without throwing', () => {
    const variant = buildVariantRecord('Test', usePreviewStore.getState());
    usePreviewStore.setState({ variants: [variant], activeVariantId: null });

    expect(() =>
      usePreviewStore.getState().recordVariantArtifactForVariant(variant.id, {
        kind: 'frames',
        locale: 'default',
        mode: 'individual',
        sizeKey: 'ios-6.9',
        renderer: 'modern-screenshot',
        fileNames: ['frame-1.png'],
      }),
    ).not.toThrow();

    const updated = usePreviewStore.getState().variants.find((v) => v.id === variant.id);
    expect(updated?.artifacts[0]?.id).toMatch(/^artifact-/);
  });
});

describe('createVariant', () => {
  // Phase 9.1: the "New variant" button used to silently snapshot the
  // active variant's state. The mental model is alternate canvases —
  // a new variant should start fresh, not carry over the active one's
  // edits. "Duplicate current" is the fork path.
  it('creates a blank variant with a single fresh screen, ignoring the active variant state', () => {
    const config = makeConfig();
    // Seed an active variant with rich state — a fresh createVariant
    // call must not inherit any of this.
    usePreviewStore.setState({
      config,
      platform: 'iphone',
      variants: [],
      activeVariantId: null,
      screens: [],
      panoramicElements: [],
      localeScreens: { 'es-ES': [] },
      sessionLocales: { 'es-ES': { label: 'Spanish' } },
    });

    usePreviewStore.getState().createVariant('Fresh');

    const state = usePreviewStore.getState();
    const created = state.variants.find((v) => v.name === 'Fresh');
    expect(created).toBeDefined();
    expect(state.activeVariantId).toBe(created!.id);
    expect(created!.snapshot.screens).toHaveLength(1);
    expect(created!.snapshot.isPanoramic).toBe(false);
    expect(created!.snapshot.localeScreens).toEqual({});
    expect(created!.snapshot.sessionLocales).toEqual({});
    expect(created!.provenance?.origin).toBe('manual');
    expect(created!.history[0]?.label).toMatch(/blank/i);
  });

  it('is a no-op when config has not been loaded yet', () => {
    usePreviewStore.setState({ config: null, variants: [], activeVariantId: null });
    usePreviewStore.getState().createVariant('Fresh');
    expect(usePreviewStore.getState().variants).toHaveLength(0);
  });
});

describe('variant thumbnails', () => {
  it('setVariantThumbnail stores the data URL on the matching variant', () => {
    const a = buildVariantRecord('A', usePreviewStore.getState());
    const b = buildVariantRecord('B', usePreviewStore.getState());
    usePreviewStore.setState({ variants: [a, b], activeVariantId: a.id });

    usePreviewStore.getState().setVariantThumbnail(b.id, 'data:image/png;base64,XXX');
    const variants = usePreviewStore.getState().variants;
    expect(variants.find((v) => v.id === a.id)?.thumbnail ?? null).toBeNull();
    expect(variants.find((v) => v.id === b.id)?.thumbnail).toBe('data:image/png;base64,XXX');
  });

  it('selectVariant preserves the outgoing variant thumbnail when nothing was edited', () => {
    const a = buildVariantRecord('A', usePreviewStore.getState());
    const b = buildVariantRecord('B', usePreviewStore.getState());
    usePreviewStore.setState({ variants: [a, b], activeVariantId: a.id });
    usePreviewStore.getState().setVariantThumbnail(a.id, 'data:image/png;base64,KEEP');

    usePreviewStore.getState().selectVariant(b.id);
    const updatedA = usePreviewStore.getState().variants.find((v) => v.id === a.id);
    expect(updatedA?.thumbnail).toBe('data:image/png;base64,KEEP');
  });

  it('selectVariant invalidates the outgoing variant thumbnail when its snapshot actually changed', () => {
    const a = buildVariantRecord('A', usePreviewStore.getState());
    const b = buildVariantRecord('B', usePreviewStore.getState());
    usePreviewStore.setState({ variants: [a, b], activeVariantId: a.id });
    usePreviewStore.getState().setVariantThumbnail(a.id, 'data:image/png;base64,OLD');

    // Simulate an edit to the active variant by changing the live
    // state. selectVariant's sync will pull this into A's snapshot
    // and detect the difference.
    usePreviewStore.setState({ previewW: 999 });

    usePreviewStore.getState().selectVariant(b.id);
    const updatedA = usePreviewStore.getState().variants.find((v) => v.id === a.id);
    expect(updatedA?.thumbnail).toBeNull();
  });

  it('selectVariant is a no-op when re-selecting the active variant — thumbnail kept', () => {
    const a = buildVariantRecord('A', usePreviewStore.getState());
    usePreviewStore.setState({ variants: [a], activeVariantId: a.id });
    usePreviewStore.getState().setVariantThumbnail(a.id, 'data:image/png;base64,KEEP');

    usePreviewStore.getState().selectVariant(a.id);
    const sameA = usePreviewStore.getState().variants.find((v) => v.id === a.id);
    expect(sameA?.thumbnail).toBe('data:image/png;base64,KEEP');
  });
});

describe('duplicateScreen', () => {
  it('inserts a deep clone right after the source with a fresh id, selects it, and re-indexes', () => {
    const config = makeConfig();
    usePreviewStore.setState({ config, platform: 'iphone', locale: 'default' });
    // Populate two screens so we can verify "insert after source" rather
    // than "append".
    usePreviewStore.getState().addScreen();
    expect(usePreviewStore.getState().screens).toHaveLength(2);

    const before = usePreviewStore.getState().screens;
    const sourceId = before[0]!.id;
    const sourceHeadline = before[0]!.headline;

    usePreviewStore.getState().duplicateScreen(0);

    const screens = usePreviewStore.getState().screens;
    expect(screens).toHaveLength(3);
    // Clone is at index 1, original at index 0, prior index-1 pushed to index 2.
    expect(screens[1]!.id).not.toBe(sourceId);
    expect(screens[1]!.headline).toBe(sourceHeadline);
    expect(screens[1]!.screenIndex).toBe(1);
    expect(screens[0]!.screenIndex).toBe(0);
    expect(screens[2]!.screenIndex).toBe(2);
    expect(usePreviewStore.getState().selectedScreen).toBe(1);
  });

  it('regenerates ids for nested annotations / overlays / callouts so refs do not collide', () => {
    const config = makeConfig();
    usePreviewStore.setState({ config, platform: 'iphone', locale: 'default' });
    // Force one screen into existence and seed it with a known-id list.
    const seeded = usePreviewStore.getState().screens[0]!;
    usePreviewStore.setState({
      screens: [
        {
          ...seeded,
          annotations: [
            { id: 'ann-keep', shape: 'rectangle', x: 0, y: 0, w: 10, h: 10, strokeColor: '#000', strokeWidth: 1, borderRadius: 0 },
          ],
          overlays: [{ id: 'overlay-keep', type: 'shape', x: 0, y: 0, size: 10, rotation: 0, opacity: 1 }] as never,
          callouts: [{ id: 'callout-keep', sourceX: 0, sourceY: 0, sourceW: 10, sourceH: 10, displayX: 0, displayY: 0, displayScale: 1, rotation: 0, borderRadius: 0, shadow: true, borderWidth: 0, borderColor: '#fff', background: '#fff', padding: 0, cardScale: 1 }] as never,
        },
      ],
    });

    usePreviewStore.getState().duplicateScreen(0);

    const dup = usePreviewStore.getState().screens[1]!;
    expect(dup.annotations[0]!.id).not.toBe('ann-keep');
    expect(dup.overlays[0]!.id).not.toBe('overlay-keep');
    expect(dup.callouts[0]!.id).not.toBe('callout-keep');
    // Originals should still have their old ids.
    const orig = usePreviewStore.getState().screens[0]!;
    expect(orig.annotations[0]!.id).toBe('ann-keep');
  });

  it('is locked on non-default locales', () => {
    const config = makeConfig();
    usePreviewStore.setState({ config, platform: 'iphone', locale: 'es-ES' });
    const before = usePreviewStore.getState().screens.length;
    usePreviewStore.getState().duplicateScreen(0);
    expect(usePreviewStore.getState().screens).toHaveLength(before);
  });
});

describe('undo/redo', () => {
  // Regression: HistoryEntry used to skip localeScreens, so updateScreen
  // on a non-default locale would push a snapshot that didn't carry the
  // locale's data — undo would leave the locale edited and the default
  // unchanged.
  function makeScreen(headline: string): ScreenStateForTest {
    return {
      id: `scr-${headline}`,
      screenIndex: 0,
      headline,
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
        primary: '#000', secondary: '#000', background: '#fff',
        text: '#000', subtitle: '#666', freeText: '#666',
      },
      frameId: '', deviceColor: '', frameStyle: 'flat', composition: 'single',
      deviceScale: 92, deviceTop: 20, deviceRotation: 0, deviceOffsetX: 0,
      deviceAngle: 8, deviceTilt: 0,
      headlineGradient: null, subtitleGradient: null,
      headlineLineHeight: 0, headlineLetterSpacing: 0,
      headlineTextTransform: '', headlineFontStyle: '',
      subtitleOpacity: 0, subtitleLetterSpacing: 0, subtitleTextTransform: '',
      spotlightEnabled: false, spotlight: null, annotations: [],
      textPositions: { headline: null, subtitle: null, freeText: null },
      screenshotUrl: null, screenshotName: null, screenshotDims: null,
      backgroundType: 'solid', backgroundColor: '#fff',
      backgroundGradient: { type: 'linear', colors: ['#6366f1', '#ec4899'], direction: 135, radialPosition: 'center' },
      backgroundImageDataUrl: null, backgroundImageFit: 'cover',
      backgroundImagePositionX: 50, backgroundImagePositionY: 50, backgroundImageScale: 100,
      backgroundOverlay: null, deviceShadow: null, borderSimulation: null,
      cornerRadius: 0, loupeEnabled: false, loupe: null, callouts: [], overlays: [], extraDevices: [],
    };
  }

  it('undo restores locale-scoped edits, not just default screens', () => {
    const defaultScreen = makeScreen('default-original');
    const localeScreen = makeScreen('es-original');
    usePreviewStore.setState({
      screens: [defaultScreen],
      localeScreens: { 'es-ES': [localeScreen] },
      sessionLocales: { 'es-ES': { label: 'Spanish' } },
      locale: 'es-ES',
    });

    // Edit the Spanish row's screen.
    usePreviewStore.getState().updateScreen(0, { headline: 'es-edited' });
    expect(usePreviewStore.getState().localeScreens['es-ES']?.[0]?.headline).toBe('es-edited');

    // Undo must restore es-ES's screen to its original headline.
    usePreviewStore.getState().undo();
    expect(usePreviewStore.getState().localeScreens['es-ES']?.[0]?.headline).toBe('es-original');
  });

  it('setActiveProject clears the undo stack so undo cannot leak across projects', () => {
    const screen = makeScreen('headline');
    usePreviewStore.setState({
      screens: [screen],
      localeScreens: {},
      sessionLocales: {},
      locale: 'default',
    });

    // Build up an undo entry.
    usePreviewStore.getState().updateScreen(0, { headline: 'edited' });
    // The action pushed one snapshot — verify undo would otherwise restore.
    usePreviewStore.getState().setActiveProject('other-project');
    usePreviewStore.getState().undo();
    expect(usePreviewStore.getState().screens[0]?.headline).toBe('edited');
  });
});

// Local alias so we don't have to inline the full ScreenState shape on
// every fixture above.
type ScreenStateForTest = Parameters<ReturnType<typeof usePreviewStore.getState>['updateScreen']>[1] extends Partial<infer S>
  ? S
  : never;
