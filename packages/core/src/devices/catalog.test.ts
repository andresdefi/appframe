import { describe, it, expect } from 'vitest';
import {
  getDeviceFamilies,
  getDeviceFamily,
  getDeviceId,
  getDeviceFamilyByFrameId,
  getDeviceColorNames,
  findMatchingDeviceFamily,
} from './catalog.js';

describe('getDeviceFamilies', () => {
  const families = getDeviceFamilies();

  it('returns all device families', () => {
    expect(families.length).toBeGreaterThan(0);
  });

  it('every family has required fields', () => {
    for (const family of families) {
      expect(family.id).toBeTruthy();
      expect(family.name).toBeTruthy();
      expect(family.category).toMatch(/^(iphone|ipad|mac|watch)$/);
      expect(family.colors.length).toBeGreaterThan(0);
      expect(family.defaultColor).toBeTruthy();
      expect(family.screenResolution.width).toBeGreaterThan(0);
      expect(family.screenResolution.height).toBeGreaterThan(0);
    }
  });

  it('all portrait koubouIds are unique', () => {
    const ids = families.flatMap((f) => f.colors.map((c) => c.koubouId));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains expected category distribution', () => {
    const counts = { iphone: 0, ipad: 0, mac: 0, watch: 0 };
    for (const f of families) counts[f.category]++;
    expect(counts.iphone).toBeGreaterThanOrEqual(4);
    expect(counts.ipad).toBeGreaterThanOrEqual(2);
    expect(counts.mac).toBeGreaterThanOrEqual(3);
    expect(counts.watch).toBeGreaterThanOrEqual(3);
  });
});

describe('getDeviceFamily', () => {
  it('returns a family by id', () => {
    const family = getDeviceFamily('iphone-17-pro-max');
    expect(family).not.toBeNull();
    expect(family!.name).toBe('iPhone 17 Pro Max');
  });

  it('uses measured screen geometry for the affected ipad, macbook, and watch png frames', () => {
    expect(getDeviceFamily('ipad-pro-11-m4')).toMatchObject({
      screenRect: { x: 106, y: 110, width: 1668, height: 2420 },
      screenBorderRadius: 64,
    });
    expect(getDeviceFamily('ipad-pro-13-m4')).toMatchObject({
      screenRect: { x: 118, y: 124, width: 2064, height: 2752 },
      screenBorderRadius: 60,
    });
    expect(getDeviceFamily('macbook-air-2022')).toMatchObject({
      screenRect: { x: 330, y: 218, width: 2560, height: 1664 },
      screenBorderRadius: 57,
    });
    expect(getDeviceFamily('macbook-pro-2021-14')).toMatchObject({
      screenRect: { x: 461, y: 301, width: 3022, height: 1962 },
      screenBorderRadius: 47,
    });
    expect(getDeviceFamily('macbook-pro-2021-16')).toMatchObject({
      screenRect: { x: 443, y: 314, width: 3454, height: 2232 },
      screenBorderRadius: 46,
    });
    expect(getDeviceFamily('watch-series-7-45')).toMatchObject({
      screenRect: { x: 73, y: 199, width: 394, height: 472 },
      screenBorderRadius: 45,
    });
    expect(getDeviceFamily('watch-series-4-40')).toMatchObject({
      screenBorderRadius: 79,
    });
  });

  it('returns null for unknown id', () => {
    expect(getDeviceFamily('nonexistent')).toBeNull();
  });
});

describe('getDeviceId', () => {
  it('returns default color portrait id', () => {
    const id = getDeviceId('iphone-17-pro-max');
    expect(id).toBe('local:apple/iphone-17-pro-max/frame');
  });

  it('returns specific color portrait id', () => {
    const id = getDeviceId('ipad-pro-13-m4', 'Space Gray');
    expect(id).toBe('iPad Pro 13 - M4 - Space Gray - Portrait');
  });

  it('returns landscape id when orientation is landscape', () => {
    const id = getDeviceId('ipad-pro-13-m4', undefined, 'landscape');
    expect(id).toBe('iPad Pro 13 - M4 - Silver - Landscape');
  });

  it('returns null for unknown family', () => {
    expect(getDeviceId('nonexistent')).toBeNull();
  });

  it('falls back to first variant for unknown color', () => {
    const id = getDeviceId('ipad-pro-13-m4', 'Imaginary Color');
    expect(id).toBe('iPad Pro 13 - M4 - Silver - Portrait');
  });
});

describe('getDeviceFamilyByFrameId', () => {
  it('returns most recent family for a known frame id', () => {
    const family = getDeviceFamilyByFrameId('ipad-pro-13');
    expect(family).not.toBeNull();
    expect(family!.category).toBe('ipad');
  });

  it('returns null for unknown frame id', () => {
    expect(getDeviceFamilyByFrameId('nonexistent-frame')).toBeNull();
  });
});

describe('getDeviceColorNames', () => {
  it('returns color names for multi-color family', () => {
    const colors = getDeviceColorNames('ipad-pro-13-m4');
    expect(colors).toContain('Silver');
    expect(colors).toContain('Space Gray');
    expect(colors.length).toBe(2);
  });

  it('returns single color for single-color family', () => {
    const colors = getDeviceColorNames('iphone-17-pro-max');
    expect(colors).toEqual(['Default']);
  });

  it('returns empty for unknown family', () => {
    expect(getDeviceColorNames('nonexistent')).toEqual([]);
  });
});

describe('findMatchingDeviceFamily', () => {
  it('finds exact portrait match', () => {
    const family = findMatchingDeviceFamily(1320, 2868);
    expect(family).not.toBeNull();
    expect(family!.category).toBe('iphone');
  });

  it('finds match within tolerance', () => {
    // 5% off from 1320x2868
    const family = findMatchingDeviceFamily(1386, 2868, 10);
    expect(family).not.toBeNull();
  });

  it('finds landscape match (swapped dimensions)', () => {
    const family = findMatchingDeviceFamily(2868, 1320);
    expect(family).not.toBeNull();
  });

  it('returns null for no match', () => {
    expect(findMatchingDeviceFamily(100, 100)).toBeNull();
  });
});
