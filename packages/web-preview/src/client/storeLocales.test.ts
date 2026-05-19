import { describe, it, expect, beforeEach } from 'vitest';
import { usePreviewStore, createScreenState } from './store';
import type { AppframeConfig, PanoramicElement, ScreenState } from './types';

// Minimal config that createScreenState accepts. Borrowed from the rest of
// the test suite's pattern so we get a single representative screen state
// without re-listing every field by hand.
function makeConfig(): AppframeConfig {
  return {
    project: 'test-locale-audit',
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
      { headline: 'One', subtitle: 'A', screenshot: 'screenshots/one.png' },
      { headline: 'Two', subtitle: 'B', screenshot: 'screenshots/two.png' },
    ],
    backgrounds: { default: 'preset:lavender' },
    fonts: { paths: [] },
  } as unknown as AppframeConfig;
}

function makePanoramicDevice(): PanoramicElement {
  return {
    type: 'device',
    x: 10, y: 10, width: 20, height: 30, rotation: 0, opacity: 1, z: 1,
    screenshot: '/api/screenshots/test-locale-audit/one.png',
    frame: 'iphone-17-pro-max',
  } as PanoramicElement;
}

function seedIndividual(): ScreenState[] {
  const config = makeConfig();
  return [createScreenState(0, config, 'iphone'), createScreenState(1, config, 'iphone')];
}

beforeEach(() => {
  // Reset the store between tests. Zustand's create returns a hook that's
  // also a singleton — setState() resets just the fields we touch.
  usePreviewStore.setState({
    isPanoramic: false,
    screens: seedIndividual(),
    panoramicElements: [],
    localeScreens: {},
    localePanoramicElements: {},
    sessionLocales: {},
    localeVersions: {},
    locale: 'default',
  });
});

describe('locale snapshot lifecycle (individual mode)', () => {
  it('addLocale deep-clones screens so mutating the snapshot does not affect Default', () => {
    const before = usePreviewStore.getState().screens;
    usePreviewStore.getState().addLocale('es-ES', { copyImages: true });
    const snapshot = usePreviewStore.getState().localeScreens['es-ES'];
    expect(snapshot).toBeDefined();
    expect(snapshot![0]).not.toBe(before[0]);
    // Mutate the snapshot and confirm Default is untouched.
    snapshot![0]!.headline = 'mutated';
    expect(usePreviewStore.getState().screens[0]!.headline).toBe('One');
  });

  it('addLocale with copyImages:false nulls out screenshot fields on the clone', () => {
    usePreviewStore.getState().addLocale('es-ES', { copyImages: false });
    const snapshot = usePreviewStore.getState().localeScreens['es-ES']!;
    for (const s of snapshot) {
      expect(s.screenshotUrl).toBeNull();
      expect(s.screenshotName).toBeNull();
      expect(s.screenshotDims).toBeNull();
    }
    // Default's screenshots are NOT cleared.
    expect(usePreviewStore.getState().screens[0]!.screenshotName).not.toBeNull();
  });

  it('addLocale becomes a no-op if the locale already exists', () => {
    usePreviewStore.getState().addLocale('es-ES', { copyImages: true });
    const snapshotA = usePreviewStore.getState().localeScreens['es-ES']!;
    usePreviewStore.getState().addLocale('es-ES', { copyImages: false });
    const snapshotB = usePreviewStore.getState().localeScreens['es-ES']!;
    expect(snapshotB).toBe(snapshotA); // same reference — second call no-oped
  });

  it('removeLocale fully clears localeScreens, sessionLocales, and localeVersions for that code', () => {
    usePreviewStore.getState().addLocale('es-ES', { copyImages: true });
    expect(usePreviewStore.getState().localeScreens['es-ES']).toBeDefined();
    expect(usePreviewStore.getState().sessionLocales['es-ES']).toBeDefined();
    expect(usePreviewStore.getState().localeVersions['es-ES']).toBeGreaterThan(0);

    usePreviewStore.getState().removeLocale('es-ES');
    const s = usePreviewStore.getState();
    expect(s.localeScreens['es-ES']).toBeUndefined();
    expect(s.sessionLocales['es-ES']).toBeUndefined();
    expect(s.localeVersions['es-ES']).toBeUndefined();
  });

  it('removeLocale resets the active locale to default if removing the currently-active one', () => {
    usePreviewStore.getState().addLocale('es-ES', { copyImages: true });
    expect(usePreviewStore.getState().locale).toBe('es-ES');
    usePreviewStore.getState().removeLocale('es-ES');
    expect(usePreviewStore.getState().locale).toBe('default');
  });

  it('repeated add/remove cycles never accumulate stale state', () => {
    for (let i = 0; i < 10; i++) {
      usePreviewStore.getState().addLocale('es-ES', { copyImages: true });
      usePreviewStore.getState().removeLocale('es-ES');
    }
    const s = usePreviewStore.getState();
    expect(Object.keys(s.localeScreens)).toEqual([]);
    expect(Object.keys(s.sessionLocales)).toEqual([]);
    expect(Object.keys(s.localeVersions)).toEqual([]);
  });
});

describe('locale snapshot lifecycle (panoramic mode)', () => {
  beforeEach(() => {
    usePreviewStore.setState({
      isPanoramic: true,
      panoramicElements: [makePanoramicDevice(), makePanoramicDevice()],
    });
  });

  it('addLocale deep-clones panoramicElements so mutating the snapshot does not affect Default', () => {
    const before = usePreviewStore.getState().panoramicElements;
    usePreviewStore.getState().addLocale('fr-FR', { copyImages: true });
    const snapshot = usePreviewStore.getState().localePanoramicElements['fr-FR']!;
    expect(snapshot[0]).not.toBe(before[0]);
    // Mutate via the discriminated-union device type.
    (snapshot[0] as { x: number }).x = 99;
    expect((usePreviewStore.getState().panoramicElements[0] as { x: number }).x).toBe(10);
  });

  it('addLocale with copyImages:false strips per-element screenshots', () => {
    usePreviewStore.getState().addLocale('fr-FR', { copyImages: false });
    const snapshot = usePreviewStore.getState().localePanoramicElements['fr-FR']!;
    for (const el of snapshot) {
      if ('screenshot' in el) {
        expect((el as { screenshot?: string }).screenshot).toBeUndefined();
      }
    }
  });

  it('removeLocale cleans up localePanoramicElements + sessionLocales + localeVersions', () => {
    usePreviewStore.getState().addLocale('fr-FR', { copyImages: true });
    usePreviewStore.getState().removeLocale('fr-FR');
    const s = usePreviewStore.getState();
    expect(s.localePanoramicElements['fr-FR']).toBeUndefined();
    expect(s.sessionLocales['fr-FR']).toBeUndefined();
    expect(s.localeVersions['fr-FR']).toBeUndefined();
  });
});

describe('locale snapshot lifecycle (cross-mode behavior)', () => {
  it('removing the panoramic locale keeps the individual-mode locale data intact', () => {
    // Seed individual locale.
    usePreviewStore.setState({ isPanoramic: false });
    usePreviewStore.getState().addLocale('es-ES', { copyImages: true });
    // Switch to panoramic and add the same code there.
    usePreviewStore.setState({
      isPanoramic: true,
      panoramicElements: [makePanoramicDevice()],
    });
    usePreviewStore.getState().addLocale('es-ES', { copyImages: true });
    // Now remove the panoramic version. Individual data must survive.
    usePreviewStore.getState().removeLocale('es-ES');
    const s = usePreviewStore.getState();
    expect(s.localePanoramicElements['es-ES']).toBeUndefined();
    expect(s.localeScreens['es-ES']).toBeDefined();
    // sessionLocales + localeVersions stay since individual mode still uses them.
    expect(s.sessionLocales['es-ES']).toBeDefined();
    expect(s.localeVersions['es-ES']).toBeDefined();
  });
});
