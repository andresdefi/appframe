import type { ScreenshotSize } from './types.js';

// App Store and Play Store screenshot specifications
// Canvas sizes for rendering (at 1x, Playwright will capture at 2x via deviceScaleFactor)
export const STORE_SIZES: Record<string, ScreenshotSize> = {
  // iOS iPhone — dimensions from Apple's screenshot specifications
  'ios-6.7': {
    name: 'iPhone 6.7"',
    width: 642,  // 1284 / 2
    height: 1389, // 2778 / 2
    platform: 'ios',
  },
  'ios-6.5': {
    name: 'iPhone 6.5"',
    width: 621,  // 1242 / 2
    height: 1344, // 2688 / 2
    platform: 'ios',
  },
  'ios-6.9': {
    name: 'iPhone 6.9"',
    width: 645,  // 1290 / 2
    height: 1398, // 2796 / 2
    platform: 'ios',
  },
  'ios-6.3': {
    name: 'iPhone 6.3"',
    width: 603,  // 1206 / 2
    height: 1311, // 2622 / 2
    platform: 'ios',
  },
  'ios-5.5': {
    name: 'iPhone 5.5"',
    width: 621,  // 1242 / 2
    height: 1104, // 2208 / 2
    platform: 'ios',
  },
  // iOS iPad — from Apple's screenshot specifications
  'ios-ipad-13': {
    name: 'iPad 13"',
    width: 1032, // 2064 / 2
    height: 1376, // 2752 / 2
    platform: 'ios',
  },
  'ios-ipad-12.9': {
    name: 'iPad 12.9"',
    width: 1024, // 2048 / 2
    height: 1366, // 2732 / 2
    platform: 'ios',
  },
  'ios-ipad-11': {
    name: 'iPad 11"',
    width: 834,  // 1668 / 2
    height: 1194, // 2388 / 2
    platform: 'ios',
  },
  // Mac (16:10 aspect ratio)
  'mac-2880x1800': {
    name: 'Mac 2880x1800',
    width: 1440, // 2880 / 2
    height: 900, // 1800 / 2
    platform: 'mac',
  },
  'mac-2560x1600': {
    name: 'Mac 2560x1600',
    width: 1280, // 2560 / 2
    height: 800, // 1600 / 2
    platform: 'mac',
  },
  'mac-1440x900': {
    name: 'Mac 1440x900',
    width: 720, // 1440 / 2
    height: 450, // 900 / 2
    platform: 'mac',
  },
  'mac-1280x800': {
    name: 'Mac 1280x800',
    width: 640, // 1280 / 2
    height: 400, // 800 / 2
    platform: 'mac',
  },
  // Apple Watch
  'watch-ultra3': {
    name: 'Watch Ultra 3 (422x514)',
    width: 211, // 422 / 2
    height: 257, // 514 / 2
    platform: 'watch',
  },
  'watch-ultra': {
    name: 'Watch Ultra (410x502)',
    width: 205, // 410 / 2
    height: 251, // 502 / 2
    platform: 'watch',
  },
  'watch-s10': {
    name: 'Watch S10/S11 (416x496)',
    width: 208, // 416 / 2
    height: 248, // 496 / 2
    platform: 'watch',
  },
  'watch-s7': {
    name: 'Watch S7-S9 (396x484)',
    width: 198, // 396 / 2
    height: 242, // 484 / 2
    platform: 'watch',
  },
  'watch-s4': {
    name: 'Watch S4-S6/SE (368x448)',
    width: 184, // 368 / 2
    height: 224, // 448 / 2
    platform: 'watch',
  },
  'watch-s3': {
    name: 'Watch Series 3 (312x390)',
    width: 156, // 312 / 2
    height: 195, // 390 / 2
    platform: 'watch',
  },
  // Android
  'android-phone': {
    name: 'Android Phone',
    width: 540,   // 1080 / 2
    height: 960,  // 1920 / 2
    platform: 'android',
  },
  'android-7-tablet': {
    name: 'Android 7" Tablet',
    width: 600,  // 1200 / 2
    height: 960, // 1920 / 2
    platform: 'android',
  },
  'android-10-tablet': {
    name: 'Android 10" Tablet',
    width: 900,  // 1800 / 2
    height: 1280, // 2560 / 2
    platform: 'android',
  },
  'android-feature-graphic': {
    name: 'Feature Graphic',
    width: 512,  // 1024 / 2
    height: 250, // 500 / 2
    platform: 'android',
  },
};

export function getTargetSizes(
  platforms: string[],
  iosSizes?: number[],
  androidSizes?: string[],
  featureGraphic?: boolean,
  macSizes?: string[],
  watchSizes?: string[],
): ScreenshotSize[] {
  const sizes: ScreenshotSize[] = [];

  if (platforms.includes('ios')) {
    const iosTargets = iosSizes ?? [6.7, 6.5];
    for (const size of iosTargets) {
      const key = `ios-${size}`;
      const sizeSpec = STORE_SIZES[key];
      if (sizeSpec) sizes.push(sizeSpec);
    }
  }

  if (platforms.includes('android')) {
    const androidTargets = androidSizes ?? ['phone'];
    for (const size of androidTargets) {
      const key = `android-${size}`;
      const sizeSpec = STORE_SIZES[key];
      if (sizeSpec) sizes.push(sizeSpec);
    }
    if (featureGraphic) {
      const fg = STORE_SIZES['android-feature-graphic'];
      if (fg) sizes.push(fg);
    }
  }

  if (platforms.includes('mac')) {
    const macTargets = macSizes ?? ['2560x1600'];
    for (const size of macTargets) {
      const key = `mac-${size}`;
      const sizeSpec = STORE_SIZES[key];
      if (sizeSpec) sizes.push(sizeSpec);
    }
  }

  if (platforms.includes('watch')) {
    const watchTargets = watchSizes ?? ['ultra', 's7'];
    for (const size of watchTargets) {
      const key = `watch-${size}`;
      const sizeSpec = STORE_SIZES[key];
      if (sizeSpec) sizes.push(sizeSpec);
    }
  }

  return sizes;
}
