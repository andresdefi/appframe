import { describe, it, expect } from 'vitest';
import { injectSpotlightHTML, injectAnnotationsHTML } from './injectors.js';

const BASE_HTML = '<html><head></head><body><div>content</div></body></html>';

describe('injectSpotlightHTML', () => {
  it('injects style and overlay div', () => {
    const result = injectSpotlightHTML(BASE_HTML, {
      x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 0,
    });
    expect(result).toContain('spotlight-overlay');
    expect(result).toContain('spotlight-cutout');
    expect(result).toContain('<style>');
    expect(result).toContain('</style>');
  });

  it('uses border-radius: 50% for circle shape', () => {
    const result = injectSpotlightHTML(BASE_HTML, {
      x: 50, y: 50, w: 30, h: 30, shape: 'circle', dimOpacity: 0.6, blur: 0,
    });
    expect(result).toContain('border-radius: 50%');
  });

  it('uses border-radius: 0 for rectangle shape', () => {
    const result = injectSpotlightHTML(BASE_HTML, {
      x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 0,
    });
    expect(result).toContain('border-radius: 0');
  });

  it('positions the cutout centered on the spotlight coords', () => {
    // x/y are the spotlight CENTER as a %; the cutout div is anchored at
    // top-left, so left = x - w/2 and top = y - h/2.
    const result = injectSpotlightHTML(BASE_HTML, {
      x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 0,
    });
    expect(result).toContain('left: 35%');
    expect(result).toContain('top: 35%');
    expect(result).toContain('width: 30%');
    expect(result).toContain('height: 30%');
  });

  it('applies blur in the box-shadow when blur > 0', () => {
    const result = injectSpotlightHTML(BASE_HTML, {
      x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 5,
    });
    expect(result).toContain('box-shadow: 0 0 5px 9999px rgba(0,0,0,0.6)');
  });

  it('uses 0px blur when blur is 0', () => {
    const result = injectSpotlightHTML(BASE_HTML, {
      x: 50, y: 50, w: 30, h: 30, shape: 'rectangle', dimOpacity: 0.6, blur: 0,
    });
    expect(result).toContain('box-shadow: 0 0 0px 9999px rgba(0,0,0,0.6)');
  });
});

describe('injectAnnotationsHTML', () => {
  it('returns unchanged HTML for empty array', () => {
    const result = injectAnnotationsHTML(BASE_HTML, [], 1290);
    expect(result).toBe(BASE_HTML);
  });

  it('injects annotation shapes with correct styles', () => {
    const result = injectAnnotationsHTML(BASE_HTML, [
      { id: 'a1', shape: 'circle', x: 10, y: 20, w: 30, h: 30, strokeColor: '#FF0000', strokeWidth: 4 },
    ], 1290);
    expect(result).toContain('annotation-overlay');
    expect(result).toContain('annotation-shape');
    expect(result).toContain('#FF0000');
    expect(result).toContain('border-radius: 50%');
  });

  it('handles rounded-rect shape', () => {
    const result = injectAnnotationsHTML(BASE_HTML, [
      { id: 'a2', shape: 'rounded-rect', x: 10, y: 20, w: 30, h: 30, strokeColor: '#00F', strokeWidth: 2 },
    ], 1290);
    expect(result).toContain('annotation-shape');
    expect(result).toContain('border-radius:');
  });

  it('includes fill color when provided', () => {
    const result = injectAnnotationsHTML(BASE_HTML, [
      { id: 'a3', shape: 'rectangle', x: 10, y: 20, w: 30, h: 30, strokeColor: '#FF0000', strokeWidth: 2, fillColor: '#00FF00' },
    ], 1290);
    expect(result).toContain('#00FF00');
  });
});
