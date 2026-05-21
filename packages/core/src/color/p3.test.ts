import { describe, it, expect } from 'vitest';
import {
  hexToDisplayP3,
  displayP3ToHex,
  parseDisplayP3,
  isColorValue,
  toDisplayP3,
} from './p3.js';

describe('hexToDisplayP3', () => {
  it('maps white and black to (1,1,1) / (0,0,0)', () => {
    expect(hexToDisplayP3('#ffffff')).toBe('color(display-p3 1.0000 1.0000 1.0000)');
    expect(hexToDisplayP3('#000000')).toBe('color(display-p3 0.0000 0.0000 0.0000)');
  });

  it('expands 3-char hex shorthand', () => {
    // #fff is equivalent to #ffffff.
    expect(hexToDisplayP3('#fff')).toBe(hexToDisplayP3('#ffffff'));
  });

  it('produces canonical P3 values for sRGB primaries', () => {
    // sRGB red (#ff0000) sits inside the P3 gamut and re-expresses as
    // approximately (0.9175, 0.2003, 0.1386). These are the values CSS
    // engines use when converting sRGB→P3 internally — see CSS Color 4.
    const red = parseDisplayP3(hexToDisplayP3('#ff0000'))!;
    expect(red.r).toBeCloseTo(0.9175, 3);
    expect(red.g).toBeCloseTo(0.2003, 3);
    expect(red.b).toBeCloseTo(0.1386, 3);

    const green = parseDisplayP3(hexToDisplayP3('#00ff00'))!;
    expect(green.r).toBeCloseTo(0.4584, 3);
    expect(green.g).toBeCloseTo(0.9853, 3);
    expect(green.b).toBeCloseTo(0.2983, 3);

    const blue = parseDisplayP3(hexToDisplayP3('#0000ff'))!;
    expect(blue.r).toBeCloseTo(0, 3);
    expect(blue.g).toBeCloseTo(0, 3);
    expect(blue.b).toBeCloseTo(0.9596, 3);
  });

  it('round-trips hex → P3 → hex losslessly for sRGB values', () => {
    // Any sRGB value should land back at the same hex byte after a
    // round trip — the conversion only re-expresses the same CIE point.
    const cases = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#7c3aed',
      '#2563eb',
      '#f8fafc',
      '#0f172a',
    ];
    for (const hex of cases) {
      const p3 = hexToDisplayP3(hex);
      const back = displayP3ToHex(p3);
      expect(back).toBe(hex);
    }
  });

  it('passes through unrecognised input unchanged', () => {
    expect(hexToDisplayP3('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
    expect(hexToDisplayP3('not a colour')).toBe('not a colour');
    expect(hexToDisplayP3('')).toBe('');
  });
});

describe('parseDisplayP3', () => {
  it('accepts canonical, whitespace-flexible, and scientific notation', () => {
    expect(parseDisplayP3('color(display-p3 1 0 0)')).toEqual({ r: 1, g: 0, b: 0 });
    expect(parseDisplayP3('color( display-p3   0.5  0.25  0.75 )')).toEqual({
      r: 0.5,
      g: 0.25,
      b: 0.75,
    });
    expect(parseDisplayP3('color(display-p3 1e0 5e-1 2.5e-1)')).toEqual({
      r: 1,
      g: 0.5,
      b: 0.25,
    });
  });

  it('accepts an optional alpha and ignores it', () => {
    // We store alpha separately (currently via opacity sliders), so
    // the parser tolerates but discards an alpha channel in the value.
    expect(parseDisplayP3('color(display-p3 1 0 0 / 0.5)')).toEqual({ r: 1, g: 0, b: 0 });
  });

  it('rejects malformed input', () => {
    expect(parseDisplayP3('color(srgb 1 0 0)')).toBeNull();
    expect(parseDisplayP3('#ff0000')).toBeNull();
    expect(parseDisplayP3('color(display-p3 1 0)')).toBeNull();
    expect(parseDisplayP3('not a colour')).toBeNull();
  });
});

describe('displayP3ToHex', () => {
  it('clamps out-of-gamut values to the nearest sRGB point', () => {
    // P3 red beyond sRGB gamut — without clamping this would round to
    // a negative byte. With clamping it lands at #ff0000.
    expect(displayP3ToHex('color(display-p3 1 0 0)')).toBe('#ff0000');
  });

  it('returns null for non-P3 input', () => {
    expect(displayP3ToHex('#ff0000')).toBeNull();
  });
});

describe('isColorValue / toDisplayP3', () => {
  it('recognises both hex and P3 notation', () => {
    expect(isColorValue('#ff0000')).toBe(true);
    expect(isColorValue('#fff')).toBe(true);
    expect(isColorValue('color(display-p3 1 0 0)')).toBe(true);
    expect(isColorValue('rgb(255, 0, 0)')).toBe(false);
  });

  it('toDisplayP3 is idempotent on already-P3 values', () => {
    const p3 = 'color(display-p3 0.5 0.5 0.5)';
    expect(toDisplayP3(p3)).toBe(p3);
  });

  it('toDisplayP3 leaves unrecognised input alone', () => {
    expect(toDisplayP3('inherit')).toBe('inherit');
  });
});
