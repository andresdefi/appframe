import { describe, expect, it } from 'vitest';
import type { DeviceFamily } from '../store';
import type { PanoramicElement } from '../types';
import {
  getDefaultFrameForPlatform,
  syncPanoramicDevicesToPlatform,
} from './deviceFrames';

const deviceFamilies: DeviceFamily[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    category: 'iphone',
    year: 2023,
    colors: [{ name: 'Black' }],
    screenResolution: { width: 1179, height: 2556 },
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    category: 'iphone',
    year: 2024,
    colors: [{ name: 'Natural Titanium' }],
    screenResolution: { width: 1206, height: 2622 },
  },
  {
    id: 'ipad-pro-13',
    name: 'iPad Pro 13',
    category: 'ipad',
    year: 2024,
    colors: [{ name: 'Silver' }],
    screenResolution: { width: 2064, height: 2752 },
  },
];

describe('device frame helpers', () => {
  it('chooses the newest matching frame family for the current platform', () => {
    expect(getDefaultFrameForPlatform('iphone', deviceFamilies)).toBe('iphone-16-pro');
    expect(getDefaultFrameForPlatform('ipad', deviceFamilies)).toBe('ipad-pro-13');
    expect(getDefaultFrameForPlatform('android', deviceFamilies)).toBe('generic-phone');
  });

  it('syncs panoramic device elements to the active platform frame and clears device colors', () => {
    const elements: PanoramicElement[] = [
      {
        type: 'device',
        screenshot: 'screenshots/screen-1.png',
        frame: 'iphone-15-pro',
        deviceColor: 'Blue',
        x: 10,
        y: 15,
        width: 12,
        rotation: 0,
        z: 5,
      },
      {
        type: 'text',
        content: 'Headline',
        x: 5,
        y: 5,
        fontSize: 4,
        color: '#ffffff',
        fontWeight: 700,
        fontStyle: 'normal',
        textAlign: 'left',
        lineHeight: 1.1,
        z: 10,
      },
    ];

    expect(syncPanoramicDevicesToPlatform(elements, 'android', deviceFamilies)).toEqual([
      {
        type: 'device',
        screenshot: 'screenshots/screen-1.png',
        frame: 'generic-phone',
        deviceColor: '',
        x: 10,
        y: 15,
        width: 12,
        rotation: 0,
        z: 5,
      },
      elements[1],
    ]);
  });
});
