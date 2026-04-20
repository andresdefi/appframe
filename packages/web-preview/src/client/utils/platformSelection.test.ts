import { describe, expect, it } from 'vitest';
import {
  getDefaultExportSizeKey,
  getPlatformPreviewSize,
  isPlatformCompatibleWithScreenshot,
} from './platformSelection';

describe('platform selection helpers', () => {
  it('returns the preview size for the requested platform and falls back to iphone', () => {
    expect(getPlatformPreviewSize('android')).toEqual({ w: 400, h: 711 });
    expect(getPlatformPreviewSize('unknown-platform')).toEqual({ w: 400, h: 868 });
  });

  it('prefers ios-6.5 for iphone when present, else falls back to first', () => {
    const sizes = {
      iphone: [
        { key: 'ios-6.9', name: 'iPhone 6.9"', width: 1260, height: 2736 },
        { key: 'ios-6.7', name: 'iPhone 6.7"', width: 1290, height: 2796 },
        { key: 'ios-6.5', name: 'iPhone 6.5"', width: 1284, height: 2778 },
      ],
      android: [
        { key: 'android-phone', name: 'Android Phone', width: 1080, height: 1920 },
      ],
    };

    expect(getDefaultExportSizeKey(sizes, 'iphone')).toBe('ios-6.5');
    expect(getDefaultExportSizeKey(sizes, 'android')).toBe('android-phone');
    expect(getDefaultExportSizeKey(sizes, 'watch')).toBeUndefined();
  });

  it('falls back to first iphone size when ios-6.5 is missing', () => {
    const sizes = {
      iphone: [
        { key: 'ios-6.9', name: 'iPhone 6.9"', width: 1260, height: 2736 },
        { key: 'ios-6.7', name: 'iPhone 6.7"', width: 1290, height: 2796 },
      ],
    };

    expect(getDefaultExportSizeKey(sizes, 'iphone')).toBe('ios-6.9');
  });

  describe('isPlatformCompatibleWithScreenshot', () => {
    const iphone17Pro = { width: 1290, height: 2796 };
    const androidPhone = { width: 1080, height: 2400 };
    const ipadPortrait = { width: 2064, height: 2752 };
    const macLandscape = { width: 2880, height: 1800 };
    const watchFace = { width: 410, height: 502 };

    it('returns true for every platform when no screenshot is uploaded', () => {
      for (const p of ['iphone', 'ipad', 'mac', 'watch', 'android']) {
        expect(isPlatformCompatibleWithScreenshot(p, null)).toBe(true);
      }
    });

    it('matches phones only to iphone/android for an iPhone screenshot', () => {
      expect(isPlatformCompatibleWithScreenshot('iphone', iphone17Pro)).toBe(true);
      expect(isPlatformCompatibleWithScreenshot('android', iphone17Pro)).toBe(true);
      expect(isPlatformCompatibleWithScreenshot('ipad', iphone17Pro)).toBe(false);
      expect(isPlatformCompatibleWithScreenshot('mac', iphone17Pro)).toBe(false);
      expect(isPlatformCompatibleWithScreenshot('watch', iphone17Pro)).toBe(false);
    });

    it('matches Android phone the same way as iPhone', () => {
      expect(isPlatformCompatibleWithScreenshot('android', androidPhone)).toBe(true);
      expect(isPlatformCompatibleWithScreenshot('iphone', androidPhone)).toBe(true);
      expect(isPlatformCompatibleWithScreenshot('mac', androidPhone)).toBe(false);
    });

    it('matches ipad to an iPad screenshot and rejects phones/mac', () => {
      expect(isPlatformCompatibleWithScreenshot('ipad', ipadPortrait)).toBe(true);
      expect(isPlatformCompatibleWithScreenshot('iphone', ipadPortrait)).toBe(false);
      expect(isPlatformCompatibleWithScreenshot('android', ipadPortrait)).toBe(false);
      expect(isPlatformCompatibleWithScreenshot('mac', ipadPortrait)).toBe(false);
    });

    it('matches mac to a landscape Mac screenshot', () => {
      expect(isPlatformCompatibleWithScreenshot('mac', macLandscape)).toBe(true);
      expect(isPlatformCompatibleWithScreenshot('iphone', macLandscape)).toBe(false);
      expect(isPlatformCompatibleWithScreenshot('ipad', macLandscape)).toBe(false);
    });

    it('matches watch to a near-square watch screenshot', () => {
      expect(isPlatformCompatibleWithScreenshot('watch', watchFace)).toBe(true);
      expect(isPlatformCompatibleWithScreenshot('iphone', watchFace)).toBe(false);
      expect(isPlatformCompatibleWithScreenshot('mac', watchFace)).toBe(false);
    });

    it('returns true for unknown platforms so the UI does not over-filter', () => {
      expect(isPlatformCompatibleWithScreenshot('tv', iphone17Pro)).toBe(true);
    });
  });
});
