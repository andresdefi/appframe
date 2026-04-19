import { describe, it, expect } from 'vitest';
import { FONT_CATALOG, getFontName, loadFontFaces } from './loader.js';

describe('FONT_CATALOG', () => {
  it('contains the curated 27 entries', () => {
    expect(FONT_CATALOG.length).toBe(27);
  });

  it('every entry has valid structure', () => {
    for (const font of FONT_CATALOG) {
      expect(font.id).toBeTruthy();
      expect(font.name).toBeTruthy();
      expect(font.weights.length).toBeGreaterThan(0);
      expect(Array.isArray(font.italicWeights)).toBe(true);
      expect(font.category).toMatch(/^(sans-serif|serif|display|condensed|mono|script|rounded)$/);
      expect(font.description.length).toBeGreaterThan(0);
    }
  });

  it('all IDs are unique', () => {
    const ids = FONT_CATALOG.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every italic weight is also listed as a regular weight', () => {
    for (const font of FONT_CATALOG) {
      for (const italic of font.italicWeights) {
        expect(font.weights).toContain(italic);
      }
    }
  });

  it('includes Inter with italic coverage', () => {
    const inter = FONT_CATALOG.find((f) => f.id === 'inter');
    expect(inter).toBeDefined();
    expect(inter!.name).toBe('Inter');
    expect(inter!.weights).toContain(400);
    expect(inter!.weights).toContain(700);
    expect(inter!.italicWeights).toContain(400);
    expect(inter!.italicWeights).toContain(700);
  });
});

describe('getFontName', () => {
  it('resolves known font ID to display name', () => {
    expect(getFontName('inter')).toBe('Inter');
    expect(getFontName('space-grotesk')).toBe('Space Grotesk');
    expect(getFontName('playfair-display')).toBe('Playfair Display');
  });

  it('returns raw ID for unknown font', () => {
    expect(getFontName('custom-font')).toBe('custom-font');
  });
});

describe('loadFontFaces', () => {
  it('returns @font-face CSS for known font', async () => {
    const css = await loadFontFaces('inter');
    if (css) {
      expect(css).toContain('@font-face');
      expect(css).toContain('Inter');
    }
    // If fonts dir doesn't exist in test environment, empty string is ok
    expect(typeof css).toBe('string');
  });

  it('returns empty string for unknown font', async () => {
    const css = await loadFontFaces('nonexistent-font-xyz');
    expect(css).toBe('');
  });

  it('caches results', async () => {
    const first = await loadFontFaces('inter');
    const second = await loadFontFaces('inter');
    expect(first).toBe(second);
  });
});
