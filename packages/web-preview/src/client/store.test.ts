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
