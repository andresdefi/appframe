import type { SizeEntry } from '../store';
import { PLATFORM_PREVIEW_SIZES } from '../types';

export function getPlatformPreviewSize(platform: string) {
  return PLATFORM_PREVIEW_SIZES[platform] ?? PLATFORM_PREVIEW_SIZES.iphone!;
}

const PREFERRED_DEFAULT_SIZE_KEY: Record<string, string> = {
  iphone: 'ios-6.5',
};

export function getDefaultExportSizeKey(
  sizes: Record<string, SizeEntry[]>,
  platform: string,
): string | undefined {
  const preferred = PREFERRED_DEFAULT_SIZE_KEY[platform];
  if (preferred && sizes[platform]?.some((entry) => entry.key === preferred)) {
    return preferred;
  }
  return sizes[platform]?.[0]?.key;
}

// Representative portrait aspect ratios for each platform, normalized to <=1
// so landscape and portrait screenshots match the same bucket.
const PLATFORM_REFERENCE_AR: Record<string, number> = {
  iphone: 0.46,
  android: 0.45,
  ipad: 0.75,
  mac: 0.625,
  watch: 0.82,
};

const PLATFORM_AR_TOLERANCE = 0.1;

function normalizeAspectRatio(ar: number): number {
  return ar > 1 ? 1 / ar : ar;
}

export function isPlatformCompatibleWithScreenshot(
  platform: string,
  screenshotDims: { width: number; height: number } | null,
): boolean {
  if (!screenshotDims) return true;
  const ref = PLATFORM_REFERENCE_AR[platform];
  if (ref === undefined) return true;
  const ar = normalizeAspectRatio(screenshotDims.width / screenshotDims.height);
  return Math.abs(ar - ref) <= PLATFORM_AR_TOLERANCE;
}
