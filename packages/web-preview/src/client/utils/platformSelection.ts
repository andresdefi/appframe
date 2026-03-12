import type { SizeEntry } from '../store';
import { PLATFORM_PREVIEW_SIZES } from '../types';

export function getPlatformPreviewSize(platform: string) {
  return PLATFORM_PREVIEW_SIZES[platform] ?? PLATFORM_PREVIEW_SIZES.iphone!;
}

export function getDefaultExportSizeKey(
  sizes: Record<string, SizeEntry[]>,
  platform: string,
): string | undefined {
  return sizes[platform]?.[0]?.key;
}
