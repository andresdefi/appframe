import type { ScreenshotSize } from './types.js';

// App Store and Play Store screenshot specifications
// Canvas sizes for rendering (at 1x, Playwright will capture at 2x via deviceScaleFactor)
export const STORE_SIZES: Record<string, ScreenshotSize> = {
  // iOS — dimensions are the actual output pixel sizes
  'ios-6.7': {
    name: 'iPhone 6.7"',
    width: 645,  // 1290 / 2
    height: 1398, // 2796 / 2
    platform: 'ios',
  },
  'ios-6.5': {
    name: 'iPhone 6.5"',
    width: 642,  // 1284 / 2
    height: 1389, // 2778 / 2
    platform: 'ios',
  },
  'ios-5.5': {
    name: 'iPhone 5.5"',
    width: 621,  // 1242 / 2
    height: 1104, // 2208 / 2
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

  return sizes;
}
