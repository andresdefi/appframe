import { describe, it, expect, beforeEach } from 'vitest';
import { usePreviewStore } from './store';
import { buildVariantRecord } from './storeSnapshots';

beforeEach(() => {
  usePreviewStore.setState({
    variants: [],
    activeVariantId: null,
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
