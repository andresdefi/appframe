import { describe, it, expect } from 'vitest';
import {
  getKoubouDeviceFamilies,
  getKoubouDeviceFamily,
  getKoubouDeviceId,
  getKoubouFamilyByFrameId,
  getKoubouColorNames,
  findMatchingDeviceFamily,
} from './catalog.js';

describe('getKoubouDeviceFamilies', () => {
  const families = getKoubouDeviceFamilies();

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
    expect(counts.iphone).toBeGreaterThanOrEqual(10);
    expect(counts.ipad).toBeGreaterThanOrEqual(5);
    expect(counts.mac).toBeGreaterThanOrEqual(3);
    expect(counts.watch).toBeGreaterThanOrEqual(3);
  });
});

describe('getKoubouDeviceFamily', () => {
  it('returns a family by id', () => {
    const family = getKoubouDeviceFamily('iphone-16-pro-max');
    expect(family).not.toBeNull();
    expect(family!.name).toBe('iPhone 16 Pro Max');
  });

  it('returns null for unknown id', () => {
    expect(getKoubouDeviceFamily('nonexistent')).toBeNull();
  });
});

describe('getKoubouDeviceId', () => {
  it('returns default color portrait id', () => {
    const id = getKoubouDeviceId('iphone-16-pro-max');
    expect(id).toBe('iPhone 16 Pro Max - Natural Titanium - Portrait');
  });

  it('returns specific color portrait id', () => {
    const id = getKoubouDeviceId('iphone-16-pro-max', 'Black Titanium');
    expect(id).toBe('iPhone 16 Pro Max - Black Titanium - Portrait');
  });

  it('returns landscape id when orientation is landscape', () => {
    const id = getKoubouDeviceId('iphone-16-pro-max', undefined, 'landscape');
    expect(id).toBe('iPhone 16 Pro Max - Natural Titanium - Landscape');
  });

  it('returns null for unknown family', () => {
    expect(getKoubouDeviceId('nonexistent')).toBeNull();
  });

  it('falls back to first variant for unknown color', () => {
    const id = getKoubouDeviceId('iphone-16-pro-max', 'Imaginary Color');
    expect(id).toBe('iPhone 16 Pro Max - Natural Titanium - Portrait');
  });
});

describe('getKoubouFamilyByFrameId', () => {
  it('returns most recent family for a known frame id', () => {
    const family = getKoubouFamilyByFrameId('iphone-16-pro-max');
    expect(family).not.toBeNull();
    expect(family!.id).toBe('iphone-16-pro-max');
  });

  it('returns null for unknown frame id', () => {
    expect(getKoubouFamilyByFrameId('nonexistent-frame')).toBeNull();
  });
});

describe('getKoubouColorNames', () => {
  it('returns color names for multi-color family', () => {
    const colors = getKoubouColorNames('iphone-16-pro-max');
    expect(colors).toContain('Natural Titanium');
    expect(colors).toContain('Black Titanium');
    expect(colors.length).toBe(4);
  });

  it('returns single color for single-color family', () => {
    const colors = getKoubouColorNames('iphone-14-pro-max');
    expect(colors).toEqual(['Default']);
  });

  it('returns empty for unknown family', () => {
    expect(getKoubouColorNames('nonexistent')).toEqual([]);
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
