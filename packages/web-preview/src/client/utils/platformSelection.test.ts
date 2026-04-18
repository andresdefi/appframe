import { describe, expect, it } from 'vitest';
import { getDefaultExportSizeKey, getPlatformPreviewSize } from './platformSelection';

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
});
