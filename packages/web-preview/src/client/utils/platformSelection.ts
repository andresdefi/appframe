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
