import type { PanoramicElement } from '../types';
import type { DeviceFamily } from '../store';

const PLATFORM_TO_CATEGORY: Record<string, string> = {
  iphone: 'iphone',
  android: 'iphone',
  ipad: 'ipad',
  mac: 'mac',
  watch: 'watch',
};

export function getDefaultFrameForPlatform(
  platform: string,
  deviceFamilies: DeviceFamily[],
): string {
  if (platform === 'android') return 'generic-phone';
  const category = PLATFORM_TO_CATEGORY[platform] ?? 'iphone';
  const match = deviceFamilies
    .filter((family) => family.category === category)
    .sort((a, b) => b.year - a.year)[0];

  if (match) return match.id;
  if (category === 'ipad') return 'ipad-pro-13';
  return 'generic-phone';
}

export function syncPanoramicDevicesToPlatform(
  elements: PanoramicElement[],
  platform: string,
  deviceFamilies: DeviceFamily[],
): PanoramicElement[] {
  const defaultFrame = getDefaultFrameForPlatform(platform, deviceFamilies);

  return elements.map((element) => {
    if (element.type !== 'device') return element;
    if (element.frame === defaultFrame && (element.deviceColor ?? '') === '') {
      return element;
    }
    return {
      ...element,
      frame: defaultFrame,
      deviceColor: '',
    };
  });
}
