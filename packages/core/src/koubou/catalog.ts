// Full Koubou device family catalog
// Each family maps to one or more Koubou device frame PNGs (color + orientation variants).
// The koubouId values must match the PNG filename stems in Koubou's frames/ directory exactly.

export type KoubouDeviceCategory = 'iphone' | 'ipad' | 'mac' | 'watch';

export interface KoubouColorVariant {
  name: string;
  koubouId: string; // portrait Koubou frame identifier
}

export interface KoubouDeviceFamily {
  id: string;
  name: string;
  category: KoubouDeviceCategory;
  year: number;
  colors: KoubouColorVariant[];
  landscapeColors?: KoubouColorVariant[]; // landscape Koubou frame identifiers
  defaultColor: string;
  screenResolution: { width: number; height: number };
  appStoreSize: string; // recommended Koubou output_size key
  previewFrameId: string; // appframe SVG frame for preview approximation ('' if none)
  screenOffset?: { x: number; y: number }; // pixel offset to screen area in Koubou's frame PNG
  framePngSize?: { width: number; height: number }; // Koubou frame PNG pixel dimensions
  screenBorderRadius?: number; // corner radius (px) for the screen area inside the frame PNG
}

// --- iPhone families ---

const IPHONE_16_PRO_MAX: KoubouDeviceFamily = {
  id: 'iphone-16-pro-max',
  name: 'iPhone 16 Pro Max',
  category: 'iphone',
  year: 2024,
  colors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 16 Pro Max - Natural Titanium - Portrait' },
    { name: 'Black Titanium', koubouId: 'iPhone 16 Pro Max - Black Titanium - Portrait' },
    { name: 'White Titanium', koubouId: 'iPhone 16 Pro Max - White Titanium - Portrait' },
    { name: 'Desert Titanium', koubouId: 'iPhone 16 Pro Max - Desert Titanium - Portrait' },
  ],
  landscapeColors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 16 Pro Max - Natural Titanium - Landscape' },
    { name: 'Black Titanium', koubouId: 'iPhone 16 Pro Max - Black Titanium - Landscape' },
    { name: 'White Titanium', koubouId: 'iPhone 16 Pro Max - White Titanium - Landscape' },
    { name: 'Desert Titanium', koubouId: 'iPhone 16 Pro Max - Desert Titanium - Landscape' },
  ],
  defaultColor: 'Natural Titanium',
  screenResolution: { width: 1320, height: 2868 },
  appStoreSize: 'iPhone6_9',
  previewFrameId: 'iphone-16-pro-max',
};

const IPHONE_16_PRO: KoubouDeviceFamily = {
  id: 'iphone-16-pro',
  name: 'iPhone 16 Pro',
  category: 'iphone',
  year: 2024,
  colors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 16 Pro - Natural Titanium - Portrait' },
    { name: 'Black Titanium', koubouId: 'iPhone 16 Pro - Black Titanium - Portrait' },
    { name: 'White Titanium', koubouId: 'iPhone 16 Pro - White Titanium - Portrait' },
    { name: 'Desert Titanium', koubouId: 'iPhone 16 Pro - Desert Titanium - Portrait' },
  ],
  landscapeColors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 16 Pro - Natural Titanium - Landscape' },
    { name: 'Black Titanium', koubouId: 'iPhone 16 Pro - Black Titanium - Landscape' },
    { name: 'White Titanium', koubouId: 'iPhone 16 Pro - White Titanium - Landscape' },
    { name: 'Desert Titanium', koubouId: 'iPhone 16 Pro - Desert Titanium - Landscape' },
  ],
  defaultColor: 'Natural Titanium',
  screenResolution: { width: 1320, height: 2868 },
  appStoreSize: 'iPhone6_9',
  previewFrameId: 'iphone-16-pro-max',
};

const IPHONE_16: KoubouDeviceFamily = {
  id: 'iphone-16',
  name: 'iPhone 16',
  category: 'iphone',
  year: 2024,
  colors: [
    { name: 'Black', koubouId: 'iPhone 16 - Black - Portrait' },
    { name: 'White', koubouId: 'iPhone 16 - White - Portrait' },
    { name: 'Pink', koubouId: 'iPhone 16 - Pink - Portrait' },
    { name: 'Teal', koubouId: 'iPhone 16 - Teal - Portrait' },
    { name: 'Ultramarine', koubouId: 'iPhone 16 - Ultramarine - Portrait' },
  ],
  landscapeColors: [
    { name: 'Black', koubouId: 'iPhone 16 - Black - Landscape' },
    { name: 'White', koubouId: 'iPhone 16 - White - Landscape' },
    { name: 'Pink', koubouId: 'iPhone 16 - Pink - Landscape' },
    { name: 'Teal', koubouId: 'iPhone 16 - Teal - Landscape' },
    { name: 'Ultramarine', koubouId: 'iPhone 16 - Ultramarine - Landscape' },
  ],
  defaultColor: 'Black',
  screenResolution: { width: 1179, height: 2556 },
  appStoreSize: 'iPhone6_1',
  previewFrameId: 'iphone-16-pro-max',
};

const IPHONE_15_PRO_MAX: KoubouDeviceFamily = {
  id: 'iphone-15-pro-max',
  name: 'iPhone 15 Pro Max',
  category: 'iphone',
  year: 2023,
  colors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 15 Pro Max - Natural Titanium - Portrait' },
    { name: 'Black Titanium', koubouId: 'iPhone 15 Pro Max - Black Titanium - Portrait' },
    { name: 'Blue Titanium', koubouId: 'iPhone 15 Pro Max - Blue Titanium - Portrait' },
    { name: 'White Titanium', koubouId: 'iPhone 15 Pro Max - White Titanium - Portrait' },
  ],
  landscapeColors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 15 Pro Max - Natural Titanium - Landscape' },
    { name: 'Black Titanium', koubouId: 'iPhone 15 Pro Max - Black Titanium - Landscape' },
    { name: 'Blue Titanium', koubouId: 'iPhone 15 Pro Max - Blue Titanium - Landscape' },
    { name: 'White Titanium', koubouId: 'iPhone 15 Pro Max - White Titanium - Landscape' },
  ],
  defaultColor: 'Natural Titanium',
  screenResolution: { width: 1320, height: 2868 },
  appStoreSize: 'iPhone6_9',
  previewFrameId: 'iphone-15-pro-max',
};

const IPHONE_15_PRO: KoubouDeviceFamily = {
  id: 'iphone-15-pro',
  name: 'iPhone 15 Pro',
  category: 'iphone',
  year: 2023,
  colors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 15 Pro - Natural Titanium - Portrait' },
    { name: 'Black Titanium', koubouId: 'iPhone 15 Pro - Black Titanium - Portrait' },
    { name: 'Blue Titanium', koubouId: 'iPhone 15 Pro - Blue Titanium - Portrait' },
    { name: 'White Titanium', koubouId: 'iPhone 15 Pro - White Titanium - Portrait' },
  ],
  landscapeColors: [
    { name: 'Natural Titanium', koubouId: 'iPhone 15 Pro - Natural Titanium - Landscape' },
    { name: 'Black Titanium', koubouId: 'iPhone 15 Pro - Black Titanium - Landscape' },
    { name: 'Blue Titanium', koubouId: 'iPhone 15 Pro - Blue Titanium - Landscape' },
    { name: 'White Titanium', koubouId: 'iPhone 15 Pro - White Titanium - Landscape' },
  ],
  defaultColor: 'Natural Titanium',
  screenResolution: { width: 1290, height: 2796 },
  appStoreSize: 'iPhone6_7',
  previewFrameId: 'iphone-15-pro-max',
};

const IPHONE_15: KoubouDeviceFamily = {
  id: 'iphone-15',
  name: 'iPhone 15',
  category: 'iphone',
  year: 2023,
  colors: [
    { name: 'Black', koubouId: 'iPhone 15 - Black - Portrait' },
    { name: 'Blue', koubouId: 'iPhone 15 - Blue - Portrait' },
    { name: 'Green', koubouId: 'iPhone 15 - Green - Portrait' },
    { name: 'Pink', koubouId: 'iPhone 15 - Pink - Portrait' },
    { name: 'Yellow', koubouId: 'iPhone 15 - Yellow - Portrait' },
  ],
  landscapeColors: [
    { name: 'Black', koubouId: 'iPhone 15 - Black - Landscape' },
    { name: 'Blue', koubouId: 'iPhone 15 - Blue - Landscape' },
    { name: 'Green', koubouId: 'iPhone 15 - Green - Landscape' },
    { name: 'Pink', koubouId: 'iPhone 15 - Pink - Landscape' },
    { name: 'Yellow', koubouId: 'iPhone 15 - Yellow - Landscape' },
  ],
  defaultColor: 'Black',
  screenResolution: { width: 1179, height: 2556 },
  appStoreSize: 'iPhone6_1',
  previewFrameId: 'iphone-15-pro-max',
};

const IPHONE_14_PRO_MAX: KoubouDeviceFamily = {
  id: 'iphone-14-pro-max',
  name: 'iPhone 14 Pro Max',
  category: 'iphone',
  year: 2022,
  colors: [
    { name: 'Default', koubouId: 'iPhone 14 Pro Max Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPhone 14 Pro Max Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1320, height: 2868 },
  appStoreSize: 'iPhone6_9',
  previewFrameId: 'iphone-16-pro-max',
};

const IPHONE_14_PRO: KoubouDeviceFamily = {
  id: 'iphone-14-pro',
  name: 'iPhone 14 Pro',
  category: 'iphone',
  year: 2022,
  colors: [
    { name: 'Default', koubouId: 'iPhone 14 Pro Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPhone 14 Pro Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1290, height: 2796 },
  appStoreSize: 'iPhone6_7',
  previewFrameId: 'iphone-16-pro-max',
};

const IPHONE_12_13_PRO_MAX: KoubouDeviceFamily = {
  id: 'iphone-12-13-pro-max',
  name: 'iPhone 12/13 Pro Max',
  category: 'iphone',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'iPhone 12-13 Pro Max Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPhone 12-13 Pro Max Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1284, height: 2778 },
  appStoreSize: 'iPhone6_5',
  previewFrameId: 'iphone-15-pro-max',
};

const IPHONE_12_13_PRO: KoubouDeviceFamily = {
  id: 'iphone-12-13-pro',
  name: 'iPhone 12/13 Pro',
  category: 'iphone',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'iPhone 12-13 Pro Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPhone 12-13 Pro Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1170, height: 2532 },
  appStoreSize: 'iPhone6_1',
  previewFrameId: 'iphone-15-pro-max',
};

const IPHONE_12_13_MINI: KoubouDeviceFamily = {
  id: 'iphone-12-13-mini',
  name: 'iPhone 12/13 mini',
  category: 'iphone',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'iPhone 12-13 mini Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPhone 12-13 mini Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1080, height: 2340 },
  appStoreSize: 'iPhone5_5',
  previewFrameId: 'generic-phone',
};

const IPHONE_11_PRO_MAX: KoubouDeviceFamily = {
  id: 'iphone-11-pro-max',
  name: 'iPhone 11 Pro Max',
  category: 'iphone',
  year: 2019,
  colors: [
    { name: 'Default', koubouId: 'iPhone 11 Pro Max Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPhone 11 Pro Max Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1242, height: 2688 },
  appStoreSize: 'iPhone6_5',
  previewFrameId: 'generic-phone',
};

const IPHONE_11_PRO: KoubouDeviceFamily = {
  id: 'iphone-11-pro',
  name: 'iPhone 11 Pro',
  category: 'iphone',
  year: 2019,
  colors: [
    { name: 'Default', koubouId: 'iPhone 11 Pro Portrait' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1125, height: 2436 },
  appStoreSize: 'iPhone6_1',
  previewFrameId: 'generic-phone',
};

const IPHONE_11: KoubouDeviceFamily = {
  id: 'iphone-11',
  name: 'iPhone 11',
  category: 'iphone',
  year: 2019,
  colors: [
    { name: 'Default', koubouId: 'iPhone 11 Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPhone 11 Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 828, height: 1792 },
  appStoreSize: 'iPhone6_1',
  previewFrameId: 'generic-phone',
};

const IPHONE_SE_8: KoubouDeviceFamily = {
  id: 'iphone-se-8',
  name: 'iPhone SE / 8',
  category: 'iphone',
  year: 2020,
  colors: [
    { name: 'Default', koubouId: 'iPhone 8 and 2020 SE' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 750, height: 1334 },
  appStoreSize: 'iPhone5_5',
  previewFrameId: 'generic-phone',
};

// --- iPad families ---

const IPAD_PRO_13_M4: KoubouDeviceFamily = {
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
};

const IPAD_PRO_11_M4: KoubouDeviceFamily = {
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
};

const IPAD_PRO_2018_2021_12_9: KoubouDeviceFamily = {
  id: 'ipad-pro-2018-2021-12-9',
  name: 'iPad Pro 12.9" (2018-2021)',
  category: 'ipad',
  year: 2018,
  colors: [
    { name: 'Default', koubouId: 'iPad Pro 2018-2021 Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPad Pro 2018-2021 Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 2048, height: 2732 },
  appStoreSize: 'iPadPro12_9',
  previewFrameId: 'ipad-pro-13',
};

const IPAD_PRO_2018_2021_11: KoubouDeviceFamily = {
  id: 'ipad-pro-2018-2021-11',
  name: 'iPad Pro 11" (2018-2021)',
  category: 'ipad',
  year: 2018,
  colors: [
    { name: 'Default', koubouId: 'iPad Pro 2018-2021 11 Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPad Pro 2018-2021 11 Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1668, height: 2388 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'ipad-pro-11',
};

const IPAD_AIR_13_M2: KoubouDeviceFamily = {
  id: 'ipad-air-13-m2',
  name: 'iPad Air 13" (M2)',
  category: 'ipad',
  year: 2024,
  colors: [
    { name: 'Blue', koubouId: 'iPad Air 13" - M2 - Blue - Portrait' },
    { name: 'Purple', koubouId: 'iPad Air 13" - M2 - Purple - Portrait' },
    { name: 'Space Gray', koubouId: 'iPad Air 13" - M2 - Space Gray - Portrait' },
    { name: 'Stardust', koubouId: 'iPad Air 13" - M2 - Stardust - Portrait' },
  ],
  landscapeColors: [
    { name: 'Blue', koubouId: 'iPad Air 13" - M2 - Blue - Landscape' },
    { name: 'Purple', koubouId: 'iPad Air 13" - M2 - Purple - Landscape' },
    { name: 'Space Gray', koubouId: 'iPad Air 13" - M2 - Space Gray - Landscape' },
    { name: 'Stardust', koubouId: 'iPad Air 13" - M2 - Stardust - Landscape' },
  ],
  defaultColor: 'Space Gray',
  screenResolution: { width: 2048, height: 2732 },
  appStoreSize: 'iPadPro12_9',
  previewFrameId: 'ipad-pro-13',
};

const IPAD_AIR_11_M2: KoubouDeviceFamily = {
  id: 'ipad-air-11-m2',
  name: 'iPad Air 11" (M2)',
  category: 'ipad',
  year: 2024,
  colors: [
    { name: 'Blue', koubouId: 'iPad Air 11" - M2 - Blue - Portrait' },
    { name: 'Purple', koubouId: 'iPad Air 11" - M2 - Purple - Portrait' },
    { name: 'Space Gray', koubouId: 'iPad Air 11" - M2 - Space Gray - Portrait' },
    { name: 'Stardust', koubouId: 'iPad Air 11" - M2 - Stardust - Portrait' },
  ],
  landscapeColors: [
    { name: 'Blue', koubouId: 'iPad Air 11" - M2 - Blue - Landscape' },
    { name: 'Purple', koubouId: 'iPad Air 11" - M2 - Purple - Landscape' },
    { name: 'Space Gray', koubouId: 'iPad Air 11" - M2 - Space Gray - Landscape' },
    { name: 'Stardust', koubouId: 'iPad Air 11" - M2 - Stardust - Landscape' },
  ],
  defaultColor: 'Space Gray',
  screenResolution: { width: 1668, height: 2388 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'ipad-pro-11',
};

const IPAD_AIR_2020: KoubouDeviceFamily = {
  id: 'ipad-air-2020',
  name: 'iPad Air (2020)',
  category: 'ipad',
  year: 2020,
  colors: [
    { name: 'Default', koubouId: 'iPad Air 2020 Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPad Air 2020 Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1640, height: 2360 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'ipad-pro-11',
};

const IPAD_2021: KoubouDeviceFamily = {
  id: 'ipad-2021',
  name: 'iPad (2021)',
  category: 'ipad',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'iPad 2021 Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPad 2021 Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1620, height: 2160 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'generic-tablet',
};

const IPAD_SILVER: KoubouDeviceFamily = {
  id: 'ipad-silver',
  name: 'iPad (Silver)',
  category: 'ipad',
  year: 2020,
  colors: [
    { name: 'Silver', koubouId: 'iPad - Silver - Portrait' },
  ],
  landscapeColors: [
    { name: 'Silver', koubouId: 'iPad - Silver - Landscape' },
  ],
  defaultColor: 'Silver',
  screenResolution: { width: 1620, height: 2160 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'generic-tablet',
};

const IPAD_MINI_STARLIGHT: KoubouDeviceFamily = {
  id: 'ipad-mini-starlight',
  name: 'iPad mini (Starlight)',
  category: 'ipad',
  year: 2021,
  colors: [
    { name: 'Starlight', koubouId: 'iPad mini - Starlight - Portrait' },
  ],
  landscapeColors: [
    { name: 'Starlight', koubouId: 'iPad mini - Starlight - Landscape' },
  ],
  defaultColor: 'Starlight',
  screenResolution: { width: 1488, height: 2266 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'generic-tablet',
};

const IPAD_MINI_2021: KoubouDeviceFamily = {
  id: 'ipad-mini-2021',
  name: 'iPad mini (2021)',
  category: 'ipad',
  year: 2021,
  colors: [
    { name: 'Default', koubouId: 'iPad mini 2021 Portrait' },
  ],
  landscapeColors: [
    { name: 'Default', koubouId: 'iPad mini 2021 Landscape' },
  ],
  defaultColor: 'Default',
  screenResolution: { width: 1488, height: 2266 },
  appStoreSize: 'iPadPro11',
  previewFrameId: 'generic-tablet',
};

// --- Mac families ---

const MACBOOK_AIR_2020: KoubouDeviceFamily = {
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
  screenOffset: { x: 620, y: 652 },
  framePngSize: { width: 3800, height: 3000 },
};

const MACBOOK_AIR_2022: KoubouDeviceFamily = {
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
  screenOffset: { x: 330, y: 218 },
  framePngSize: { width: 3220, height: 2100 },
};

const MACBOOK_PRO_2021_14: KoubouDeviceFamily = {
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
  screenOffset: { x: 460, y: 300 },
  framePngSize: { width: 3944, height: 2564 },
};

const MACBOOK_PRO_2021_16: KoubouDeviceFamily = {
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
  screenOffset: { x: 442, y: 313 },
  framePngSize: { width: 4340, height: 2860 },
};

const IMAC_2021: KoubouDeviceFamily = {
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
  screenOffset: { x: 141, y: 161 },
  framePngSize: { width: 4760, height: 4040 },
};

const IMAC_24_SILVER: KoubouDeviceFamily = {
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
  screenOffset: { x: 141, y: 161 },
  framePngSize: { width: 4760, height: 4040 },
};

// --- Watch families ---

const WATCH_ULTRA: KoubouDeviceFamily = {
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
  screenOffset: { x: 95, y: 219 },
  framePngSize: { width: 600, height: 940 },
  screenBorderRadius: 146,
};

const WATCH_SERIES_7_45: KoubouDeviceFamily = {
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
  screenOffset: { x: 72, y: 188 },
  framePngSize: { width: 540, height: 860 },
  screenBorderRadius: 136,
};

const WATCH_SERIES_4_44: KoubouDeviceFamily = {
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
  screenOffset: { x: 66, y: 222 },
  framePngSize: { width: 512, height: 890 },
  screenBorderRadius: 85,
};

const WATCH_SERIES_4_40: KoubouDeviceFamily = {
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
  screenOffset: { x: 114, y: 308 },
  framePngSize: { width: 570, height: 1000 },
  screenBorderRadius: 63,
};

// --- Full catalog ---

const KOUBOU_DEVICE_CATALOG: KoubouDeviceFamily[] = [
  // iPhone
  IPHONE_16_PRO_MAX,
  IPHONE_16_PRO,
  IPHONE_16,
  IPHONE_15_PRO_MAX,
  IPHONE_15_PRO,
  IPHONE_15,
  IPHONE_14_PRO_MAX,
  IPHONE_14_PRO,
  IPHONE_12_13_PRO_MAX,
  IPHONE_12_13_PRO,
  IPHONE_12_13_MINI,
  IPHONE_11_PRO_MAX,
  IPHONE_11_PRO,
  IPHONE_11,
  IPHONE_SE_8,
  // iPad
  IPAD_PRO_13_M4,
  IPAD_PRO_11_M4,
  IPAD_PRO_2018_2021_12_9,
  IPAD_PRO_2018_2021_11,
  IPAD_AIR_13_M2,
  IPAD_AIR_11_M2,
  IPAD_AIR_2020,
  IPAD_2021,
  IPAD_SILVER,
  IPAD_MINI_STARLIGHT,
  IPAD_MINI_2021,
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
const CATALOG_BY_ID = new Map<string, KoubouDeviceFamily>(
  KOUBOU_DEVICE_CATALOG.map(f => [f.id, f]),
);

// --- Public API ---

export function getKoubouDeviceFamilies(): KoubouDeviceFamily[] {
  return KOUBOU_DEVICE_CATALOG;
}

export function getKoubouDeviceFamily(familyId: string): KoubouDeviceFamily | null {
  return CATALOG_BY_ID.get(familyId) ?? null;
}

/**
 * Resolve a family ID + optional color/orientation to the exact Koubou device identifier string.
 * Falls back to default color and portrait when not specified.
 */
export function getKoubouDeviceId(
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
export function getKoubouFamilyByFrameId(appframeFrameId: string): KoubouDeviceFamily | null {
  const matches = KOUBOU_DEVICE_CATALOG.filter(f => f.previewFrameId === appframeFrameId);
  if (matches.length === 0) return null;
  // Return the most recent device
  return matches.sort((a, b) => b.year - a.year)[0] ?? null;
}

/**
 * Get all color variant names available for a device family.
 */
export function getKoubouColorNames(familyId: string): string[] {
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
export function getDevicePlatformCategory(familyId: string): KoubouDeviceCategory | null {
  const family = CATALOG_BY_ID.get(familyId);
  return family?.category ?? null;
}

export function findMatchingDeviceFamily(
  width: number,
  height: number,
  tolerancePct = 10,
): KoubouDeviceFamily | null {
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
