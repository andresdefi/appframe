import { describe, it, expect } from 'vitest';
import { canvasDimensionsFor, measureText } from './measure.js';

describe('canvasDimensionsFor', () => {
  it('falls back to iPhone 6.9 aspect (1290 x 2796) when no exportSize is set', () => {
    expect(canvasDimensionsFor(undefined)).toEqual({ width: 1290, height: 2796 });
    expect(canvasDimensionsFor(null)).toEqual({ width: 1290, height: 2796 });
    expect(canvasDimensionsFor('')).toEqual({ width: 1290, height: 2796 });
  });

  it('falls back to iPhone 6.9 aspect for unknown keys', () => {
    expect(canvasDimensionsFor('mystery-platform')).toEqual({ width: 1290, height: 2796 });
  });

  it('keeps width at the 1290 reference but adjusts height by aspect ratio', () => {
    const phone = canvasDimensionsFor('ios-6.9');
    expect(phone.width).toBe(1290);
    expect(phone.height).toBeGreaterThan(2700);

    const ipad = canvasDimensionsFor('ios-ipad-13');
    expect(ipad.width).toBe(1290);
    // iPad 13" is 1032 x 1376 logical, aspect ratio ~1.33, so the
    // 1290-ref height is ~1720. Much shorter than the phone aspect.
    expect(ipad.height).toBeLessThan(2000);

    const mac = canvasDimensionsFor('mac-2880x1800');
    expect(mac.width).toBe(1290);
    // Mac is landscape — height shorter than width.
    expect(mac.height).toBeLessThan(mac.width);
  });
});

describe('measureText is platform-invariant for font-fit math', () => {
  // The engine renders headlineSize scaled to the actual canvas:
  // actual_px = (canvas_width / 1290) * headlineSize. Measuring at
  // `headlineSize` against canvasDimensionsFor()*0.85 stays in the
  // 1290-reference frame, so the same text fits the same headlineSize
  // on every platform. Confirms the fix from the multi-platform pass:
  // we no longer over-estimate a fit budget for wider exports.
  it('a given fontSize produces the same metrics regardless of exportSize key', () => {
    const text = 'A reasonably long headline that needs some real estate';
    const phoneWidth = canvasDimensionsFor('ios-6.9').width;
    const ipadWidth = canvasDimensionsFor('ios-ipad-13').width;
    expect(phoneWidth).toBe(ipadWidth);
    const onPhone = measureText({
      text,
      fontId: 'inter',
      fontSize: 110,
      fontWeight: 700,
      maxWidth: phoneWidth * 0.85,
    });
    const onIpad = measureText({
      text,
      fontId: 'inter',
      fontSize: 110,
      fontWeight: 700,
      maxWidth: ipadWidth * 0.85,
    });
    expect(onIpad.lineCount).toBe(onPhone.lineCount);
    expect(onIpad.wrappedWidth).toBe(onPhone.wrappedWidth);
  });
});
