import { describe, it, expect } from 'vitest';
import { diffScreens } from './screen-inspect.js';

describe('diffScreens', () => {
  it('reports empty for identical screens', () => {
    const s = { headline: '<p>hi</p>', headlineFont: 'inter', spotlight: { x: 50, y: 50 } };
    expect(diffScreens({ ...s }, { ...s })).toEqual({});
  });

  it('reports a single dot-path for a top-level primitive diff', () => {
    const a = { headlineFont: 'inter', headlineSize: 110 };
    const b = { headlineFont: 'anton', headlineSize: 110 };
    expect(diffScreens(a, b)).toEqual({ headlineFont: { a: 'inter', b: 'anton' } });
  });

  it('walks nested objects emitting dotted paths', () => {
    const a = { spotlight: { x: 50, y: 50, blur: 0 } };
    const b = { spotlight: { x: 60, y: 50, blur: 4 } };
    expect(diffScreens(a, b)).toEqual({
      'spotlight.x': { a: 50, b: 60 },
      'spotlight.blur': { a: 0, b: 4 },
    });
  });

  it('treats arrays as atomic — one entry even when many elements differ', () => {
    const a = { callouts: [{ id: '1', x: 100 }, { id: '2', x: 200 }] };
    const b = { callouts: [{ id: '1', x: 110 }, { id: '2', x: 210 }, { id: '3', x: 300 }] };
    const out = diffScreens(a, b);
    expect(Object.keys(out)).toEqual(['callouts']);
    expect(out.callouts!.a).toEqual(a.callouts);
    expect(out.callouts!.b).toEqual(b.callouts);
  });

  it('considers reference-equal arrays identical', () => {
    const arr = [{ x: 1 }];
    expect(diffScreens({ callouts: arr }, { callouts: [...arr] })).toEqual({});
  });

  it('reports keys present on only one side', () => {
    const a = { headline: '<p>hi</p>' };
    const b = { headline: '<p>hi</p>', subtitle: '<p>extra</p>' };
    expect(diffScreens(a, b)).toEqual({ subtitle: { a: undefined, b: '<p>extra</p>' } });
  });

  it('honours the `restrict` allowlist on top-level keys only', () => {
    const a = { headlineFont: 'inter', subtitleFont: 'inter', spotlight: { x: 50 } };
    const b = { headlineFont: 'anton', subtitleFont: 'roboto', spotlight: { x: 60 } };
    expect(diffScreens(a, b, ['headlineFont'])).toEqual({
      headlineFont: { a: 'inter', b: 'anton' },
    });
  });

  it('mixed object vs primitive shows up as a leaf diff', () => {
    const a = { spotlight: { x: 50 } };
    const b = { spotlight: null };
    expect(diffScreens(a, b)).toEqual({
      spotlight: { a: { x: 50 }, b: null },
    });
  });
});
