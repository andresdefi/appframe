// Full Koubou device family catalog
// Each family maps to one or more Koubou device frame PNGs (color + orientation variants).
// The koubouId values must match the PNG filename stems in Koubou's frames/ directory exactly.

export type DeviceCategory = 'iphone' | 'ipad' | 'mac' | 'watch';

export interface DeviceColorVariant {
  name: string;
  koubouId: string; // portrait Koubou frame identifier
}

export interface DeviceFamily {
  id: string;
  name: string;
  category: DeviceCategory;
  year: number;
  colors: DeviceColorVariant[];
  landscapeColors?: DeviceColorVariant[]; // landscape Koubou frame identifiers
  defaultColor: string;
  screenResolution: { width: number; height: number };
  appStoreSize: string; // recommended Koubou output_size key
  previewFrameId: string; // appframe SVG frame for preview approximation ('' if none)
  screenRect?: { x: number; y: number; width: number; height: number }; // measured screen area in Koubou's frame PNG
  framePngSize?: { width: number; height: number }; // Koubou frame PNG pixel dimensions
  screenBorderRadius?: number; // corner radius (px) for the screen area inside the frame PNG
}

// --- iPhone families ---

const IPHONE_17_PRO_MAX: DeviceFamily = {
  id: 'iphone-17-pro-max',
  name: 'iPhone 17 Pro Max',
  category: 'iphone',
  year: 2025,
  colors: [
    { name: 'Default', koubouId: 'local:apple/iphone-17-pro-max/frame' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1320, height: 2868 },
  appStoreSize: 'iPhone6_9',
  previewFrameId: '',
  screenRect: { x: 69, y: 58, width: 1334, height: 2886 },
  framePngSize: { width: 1470, height: 3000 },
  screenBorderRadius: 120,
};

const IPHONE_17_PRO: DeviceFamily = {
  id: 'iphone-17-pro',
  name: 'iPhone 17 Pro',
  category: 'iphone',
  year: 2025,
  colors: [
    { name: 'Default', koubouId: 'local:apple/iphone-17-pro/frame' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1206, height: 2622 },
  appStoreSize: 'iPhone6_7',
  previewFrameId: '',
  screenRect: { x: 66, y: 63, width: 1220, height: 2640 },
  framePngSize: { width: 1350, height: 2760 },
  screenBorderRadius: 115,
};

const IPHONE_17: DeviceFamily = {
  id: 'iphone-17',
  name: 'iPhone 17',
  category: 'iphone',
  year: 2025,
  colors: [
    { name: 'Default', koubouId: 'local:apple/iphone-17/frame' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1206, height: 2622 },
  appStoreSize: 'iPhone6_1',
  previewFrameId: '',
  screenRect: { x: 66, y: 63, width: 1220, height: 2640 },
  framePngSize: { width: 1350, height: 2760 },
  screenBorderRadius: 120,
};

const IPHONE_AIR: DeviceFamily = {
  id: 'iphone-air',
  name: 'iPhone Air',
  category: 'iphone',
  year: 2025,
  colors: [
    { name: 'Default', koubouId: 'local:apple/iphone-air/frame' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1260, height: 2736 },
  appStoreSize: 'iPhone6_1',
  previewFrameId: '',
  screenRect: { x: 60, y: 72, width: 1262, height: 2738 },
  framePngSize: { width: 1380, height: 2880 },
  screenBorderRadius: 115,
};

// --- iPad families ---

const IPAD_PRO_13_M4: DeviceFamily = {
  id: 'ipad-pro-13-m4',
  name: 'iPad Pro 13" (M4)',
  category: 'ipad',
  year: 2024,
  colors: [
    { name: 'Silver', koubouId: 'iPad Pro 13 - M4 - Silver - Portrait' },
    { name: 'Space Gray', koubouId: 'iPad Pro 13 - M4 - Space Gray - Portrait' },
  ],
  landscapeColors: [
    { name: 'Silver', koubouId: 'iPad Pro 13 - M4 - Silver - Landscape' },
    { name: 'Space Gray', koubouId: 'iPad Pro 13 - M4 - Space Gray - Landscape' },
  ],
  defaultColor: 'Silver',
  screenResolution: { width: 2064, height: 2752 },
  appStoreSize: 'iPadPro13',
  previewFrameId: 'ipad-pro-13',
  // Measured from the Koubou PNG's transparent screen opening.
  screenRect: { x: 118, y: 124, width: 2064, height: 2752 },
  framePngSize: { width: 2300, height: 3000 },
  screenBorderRadius: 60,
};

const IPAD_PRO_11_M4: DeviceFamily = {
  id: 'ipad-pro-11-m4',
  name: 'iPad Pro 11" (M4)',
  category: 'ipad',
  year: 2024,
  colors: [
    { name: 'Silver', koubouId: 'iPad Pro 11 - M4 - Silver - Portrait' },
    { name: 'Space Gray', koubouId: 'iPad Pro 11 - M4 - Space Gray - Portrait' },
  ],
  landscapeColors: [
    { name: 'Silver', koubouId: 'iPad Pro 11 - M4 - Silver - Landscape' },
    { name: 'Space Gray', koubouId: 'iPad Pro 11 - M4 - Space Gray - Landscape' },
  ],
  defaultColor: 'Silver',
  screenResolution: { width: 1668, height: 2388 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'ipad-pro-11',
  // Measured from the Koubou PNG's transparent screen opening.
  screenRect: { x: 106, y: 110, width: 1668, height: 2420 },
  framePngSize: { width: 1880, height: 2640 },
  screenBorderRadius: 64,
};

// --- Mac families ---

const MACBOOK_AIR_2020: DeviceFamily = {
  id: 'macbook-air-2020',
  name: 'MacBook Air (2020)',
  category: 'mac',
  year: 2020,
  colors: [
    { name: 'Default', koubouId: 'MacBook Air 2020' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 2560, height: 1600 },
  appStoreSize: 'MacBookAir',
  previewFrameId: '',
  screenRect: { x: 620, y: 652, width: 2560, height: 1600 },
  framePngSize: { width: 3800, height: 3000 },
};

const MACBOOK_AIR_2022: DeviceFamily = {
  id: 'macbook-air-2022',
  name: 'MacBook Air (2022)',
  category: 'mac',
  year: 2022,
  colors: [
    { name: 'Default', koubouId: 'MacBook Air 2022' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 2560, height: 1664 },
  appStoreSize: 'MacBookAir',
  previewFrameId: '',
  // Measured from the Koubou PNG's transparent screen opening.
  screenRect: { x: 330, y: 218, width: 2560, height: 1664 },
  framePngSize: { width: 3220, height: 2100 },
  screenBorderRadius: 57,
};

const MACBOOK_PRO_2021_14: DeviceFamily = {
  id: 'macbook-pro-2021-14',
  name: 'MacBook Pro 14" (2021)',
  category: 'mac',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'MacBook Pro 2021 14' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 3024, height: 1964 },
  appStoreSize: 'MacBookPro14',
  previewFrameId: '',
  // Measured from the Koubou PNG's transparent screen opening.
  screenRect: { x: 461, y: 301, width: 3022, height: 1962 },
  framePngSize: { width: 3944, height: 2564 },
  screenBorderRadius: 47,
};

const MACBOOK_PRO_2021_16: DeviceFamily = {
  id: 'macbook-pro-2021-16',
  name: 'MacBook Pro 16" (2021)',
  category: 'mac',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'MacBook Pro 2021 16' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 3456, height: 2234 },
  appStoreSize: 'MacBookPro16',
  previewFrameId: '',
  // Measured from the Koubou PNG's transparent screen opening.
  screenRect: { x: 443, y: 314, width: 3454, height: 2232 },
  framePngSize: { width: 4340, height: 2860 },
  screenBorderRadius: 46,
};

const IMAC_2021: DeviceFamily = {
  id: 'imac-2021',
  name: 'iMac (2021)',
  category: 'mac',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'iMac 2021' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 4480, height: 2520 },
  appStoreSize: 'iMac24',
  previewFrameId: '',
  screenRect: { x: 141, y: 161, width: 4480, height: 2520 },
  framePngSize: { width: 4760, height: 4040 },
};

const IMAC_24_SILVER: DeviceFamily = {
  id: 'imac-24-silver',
  name: 'iMac 24" (Silver)',
  category: 'mac',
  year: 2021,
  colors: [
    { name: 'Silver', koubouId: 'iMac 24" - Silver' },
  ],
  defaultColor: 'Silver',
  screenResolution: { width: 4480, height: 2520 },
  appStoreSize: 'iMac24',
  previewFrameId: '',
  screenRect: { x: 140, y: 160, width: 4480, height: 2520 },
  framePngSize: { width: 4760, height: 4040 },
};

// --- Watch families ---

const WATCH_ULTRA: DeviceFamily = {
  id: 'watch-ultra',
  name: 'Apple Watch Ultra',
  category: 'watch',
  year: 2022,
  colors: [
    { name: 'Default', koubouId: 'Watch Ultra 2022' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 410, height: 502 },
  appStoreSize: 'WatchUltra',
  previewFrameId: '',
  screenRect: { x: 95, y: 219, width: 410, height: 502 },
  framePngSize: { width: 600, height: 940 },
  screenBorderRadius: 146,
};

const WATCH_SERIES_7_45: DeviceFamily = {
  id: 'watch-series-7-45',
  name: 'Apple Watch Series 7 (45mm)',
  category: 'watch',
  year: 2021,
  colors: [
    { name: 'Midnight', koubouId: 'Watch Series 7 45 Midnight' },
    { name: 'Starlight', koubouId: 'Watch Series 7 45 Starlight' },
  ],
  defaultColor: 'Midnight',
  screenResolution: { width: 396, height: 484 },
  appStoreSize: 'WatchS7_45',
  previewFrameId: '',
  // Measured from the Koubou PNG's transparent screen opening.
  screenRect: { x: 73, y: 199, width: 394, height: 472 },
  framePngSize: { width: 540, height: 860 },
  screenBorderRadius: 45,
};

const WATCH_SERIES_4_44: DeviceFamily = {
  id: 'watch-series-4-44',
  name: 'Apple Watch Series 4 (44mm)',
  category: 'watch',
  year: 2018,
  colors: [
    { name: 'Default', koubouId: 'Watch Series 4 44' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 368, height: 448 },
  appStoreSize: 'WatchS4_44',
  previewFrameId: '',
  screenRect: { x: 66, y: 222, width: 368, height: 447 },
  framePngSize: { width: 512, height: 890 },
  screenBorderRadius: 85,
};

const WATCH_SERIES_4_40: DeviceFamily = {
  id: 'watch-series-4-40',
  name: 'Apple Watch Series 4 (40mm)',
  category: 'watch',
  year: 2018,
  colors: [
    { name: 'Default', koubouId: 'Watch Series 4 40' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 324, height: 394 },
  appStoreSize: 'WatchS4_40',
  previewFrameId: '',
  screenRect: { x: 114, y: 308, width: 324, height: 394 },
  framePngSize: { width: 570, height: 1000 },
  screenBorderRadius: 79,
};

// --- Full catalog ---

const KOUBOU_DEVICE_CATALOG: DeviceFamily[] = [
  // iPhone
  IPHONE_17_PRO_MAX,
  IPHONE_17_PRO,
  IPHONE_17,
  IPHONE_AIR,
  // iPad
  IPAD_PRO_13_M4,
  IPAD_PRO_11_M4,
  // Mac
  MACBOOK_AIR_2020,
  MACBOOK_AIR_2022,
  MACBOOK_PRO_2021_14,
  MACBOOK_PRO_2021_16,
  IMAC_2021,
  IMAC_24_SILVER,
  // Watch
  WATCH_ULTRA,
  WATCH_SERIES_7_45,
  WATCH_SERIES_4_44,
  WATCH_SERIES_4_40,
];

// Indexed by family ID for fast lookup
const CATALOG_BY_ID = new Map<string, DeviceFamily>(
  KOUBOU_DEVICE_CATALOG.map(f => [f.id, f]),
);

// --- Public API ---

export function getDeviceFamilies(): DeviceFamily[] {
  return KOUBOU_DEVICE_CATALOG;
}

export function getDeviceFamily(familyId: string): DeviceFamily | null {
  return CATALOG_BY_ID.get(familyId) ?? null;
}

/**
 * Resolve a family ID + optional color/orientation to the exact Koubou device identifier string.
 * Falls back to default color and portrait when not specified.
 */
export function getDeviceId(
  familyId: string,
  color?: string,
  orientation?: 'portrait' | 'landscape',
): string | null {
  const family = CATALOG_BY_ID.get(familyId);
  if (!family) return null;

  const isLandscape = orientation === 'landscape';
  const variants = isLandscape && family.landscapeColors
    ? family.landscapeColors
    : family.colors;

  const targetColor = color ?? family.defaultColor;
  const match = variants.find(v => v.name === targetColor);
  if (match) return match.koubouId;

  // Fall back to first available variant
  return variants[0]?.koubouId ?? null;
}

/**
 * Reverse lookup: find the best matching Koubou device family for an appframe SVG frame ID.
 * Returns the most recent family that uses this previewFrameId.
 */
export function getDeviceFamilyByFrameId(appframeFrameId: string): DeviceFamily | null {
  const matches = KOUBOU_DEVICE_CATALOG.filter(f => f.previewFrameId === appframeFrameId);
  if (matches.length === 0) return null;
  // Return the most recent device
  return matches.sort((a, b) => b.year - a.year)[0] ?? null;
}

/**
 * Get all color variant names available for a device family.
 */
export function getDeviceColorNames(familyId: string): string[] {
  const family = CATALOG_BY_ID.get(familyId);
  if (!family) return [];
  return family.colors.map(c => c.name);
}

/**
 * Find the best matching device family for a screenshot's pixel dimensions.
 * Returns the most recent family whose screenResolution matches within `tolerancePct` (default 10%).
 */
/**
 * Get the platform category for a device family ID.
 * Returns 'iphone', 'ipad', 'mac', 'watch', or null for unknown.
 */
export function getDevicePlatformCategory(familyId: string): DeviceCategory | null {
  const family = CATALOG_BY_ID.get(familyId);
  return family?.category ?? null;
}

export function findMatchingDeviceFamily(
  width: number,
  height: number,
  tolerancePct = 10,
): DeviceFamily | null {
  const tolerance = tolerancePct / 100;
  const matches = KOUBOU_DEVICE_CATALOG.filter(f => {
    const res = f.screenResolution;
    // Check portrait match
    const wRatio = Math.abs(width - res.width) / res.width;
    const hRatio = Math.abs(height - res.height) / res.height;
    if (wRatio <= tolerance && hRatio <= tolerance) return true;
    // Check landscape match (swapped dimensions)
    const wRatioL = Math.abs(width - res.height) / res.height;
    const hRatioL = Math.abs(height - res.width) / res.width;
    return wRatioL <= tolerance && hRatioL <= tolerance;
  });
  if (matches.length === 0) return null;
  // Prefer exact matches, then most recent device
  const exact = matches.find(f =>
    f.screenResolution.width === width && f.screenResolution.height === height,
  );
  if (exact) return exact;
  return matches.sort((a, b) => b.year - a.year)[0] ?? null;
}
