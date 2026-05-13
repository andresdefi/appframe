// Background presets, organized into named categories so the Background tab
// can render them as collapsible rows in the shots.so style. Each category
// is rendered as a single row with the first N tiles visible and the rest
// behind an expand chevron.

export interface GradientPreset {
  name: string;
  colors: string[];
  direction: number;
  type?: 'linear' | 'radial';
  radialPosition?: string;
}

// --- Solid color catalog -----------------------------------------------------

interface SolidCategory {
  name: string;
  colors: string[];
}

export const SOLID_CATEGORIES: SolidCategory[] = [
  {
    name: 'Mono',
    colors: [
      '#000000', '#0a0a0a', '#1a1a1a', '#262626', '#404040', '#525252',
      '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5', '#f5f5f5', '#ffffff',
    ],
  },
  {
    name: 'Vibrant',
    colors: [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
      '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
      '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    ],
  },
  {
    name: 'Pastel',
    colors: [
      '#fecaca', '#fed7aa', '#fef3c7', '#fef9c3', '#ecfccb', '#d1fae5',
      '#bbf7d0', '#a7f3d0', '#bfdbfe', '#c7d2fe', '#ddd6fe', '#fbcfe8',
    ],
  },
  {
    name: 'Earth',
    colors: [
      '#7c2d12', '#92400e', '#a16207', '#854d0e', '#365314', '#14532d',
      '#134e4a', '#0c4a6e', '#1e3a8a', '#3730a3', '#4a044e', '#831843',
    ],
  },
  {
    name: 'Brand',
    colors: [
      '#0f3460', '#16213e', '#1a1a2e', '#533483', '#2d3436', '#636e72',
      '#2c3e50', '#34495e', '#0f0c29', '#302b63',
    ],
  },
];

// --- Gradient catalog --------------------------------------------------------

interface GradientCategory {
  name: string;
  presets: GradientPreset[];
}

export const GRADIENT_CATEGORIES: GradientCategory[] = [
  {
    name: 'Sunset',
    presets: [
      { name: 'Sunset', colors: ['#ff6b35', '#f7c948', '#ff3864'], direction: 135 },
      { name: 'Flamingo', colors: ['#ee5a24', '#f0932b', '#fad390'], direction: 135 },
      { name: 'Coral Glow', colors: ['#ff9a9e', '#fecfef'], direction: 135 },
      { name: 'Peach Sky', colors: ['#ffecd2', '#fcb69f'], direction: 135 },
      { name: 'Dusk', colors: ['#2c3e50', '#fd746c'], direction: 135 },
      { name: 'Honeyed', colors: ['#ee9ca7', '#ffdde1'], direction: 135 },
      { name: 'Persimmon', colors: ['#f83600', '#f9d423'], direction: 135 },
      { name: 'Amber Wave', colors: ['#fc6076', '#ff9a44'], direction: 90 },
      { name: 'Tangerine', colors: ['#f6d365', '#fda085'], direction: 135 },
    ],
  },
  {
    name: 'Ocean',
    presets: [
      { name: 'Open Ocean', colors: ['#0052d4', '#4364f7', '#6fb1fc'], direction: 135 },
      { name: 'Lagoon', colors: ['#004e92', '#00b4db', '#88d8b0'], direction: 135 },
      { name: 'Sky Surface', colors: ['#2980b9', '#6dd5fa', '#ffffff'], direction: 180 },
      { name: 'Deep Reef', colors: ['#1e3c72', '#2a5298'], direction: 135 },
      { name: 'Arctic Bay', colors: ['#1e3c72', '#2a5298', '#e8f5e9'], direction: 180 },
      { name: 'Aqua', colors: ['#00c9ff', '#92fe9d'], direction: 135 },
      { name: 'Ice Lake', colors: ['#83a4d4', '#b6fbff'], direction: 135 },
      { name: 'Marine', colors: ['#1cb5e0', '#000851'], direction: 180 },
    ],
  },
  {
    name: 'Cosmic',
    presets: [
      { name: 'Midnight', colors: ['#0f0c29', '#302b63', '#24243e'], direction: 135 },
      { name: 'Velvet', colors: ['#6a0572', '#ab83a1', '#f5e6cc'], direction: 135 },
      { name: 'Berry', colors: ['#8e2de2', '#4a00e0'], direction: 135 },
      { name: 'Indigo Night', colors: ['#667eea', '#764ba2'], direction: 135 },
      { name: 'Nebula', colors: ['#41295a', '#2f0743'], direction: 135 },
      { name: 'Galaxy', colors: ['#42275a', '#734b6d'], direction: 135 },
      { name: 'Purple Haze', colors: ['#5614b0', '#dbd65c'], direction: 135 },
      { name: 'Void', colors: ['#000000', '#434343'], direction: 180 },
    ],
  },
  {
    name: 'Aurora',
    presets: [
      { name: 'Aurora', colors: ['#00c9ff', '#92fe9d'], direction: 135 },
      { name: 'Emerald Glow', colors: ['#11998e', '#38ef7d'], direction: 135 },
      { name: 'Mint Forest', colors: ['#00b09b', '#96c93d'], direction: 135 },
      { name: 'Forest', colors: ['#134e5e', '#71b280'], direction: 135 },
      { name: 'Spring Bud', colors: ['#a8e063', '#56ab2f'], direction: 135 },
      { name: 'Polar', colors: ['#e0eafc', '#cfdef3'], direction: 135 },
      { name: 'Sage', colors: ['#a8c0ff', '#3f2b96'], direction: 135 },
      { name: 'Lush Field', colors: ['#56ab2f', '#a8e063'], direction: 180 },
    ],
  },
  {
    name: 'Vivid',
    presets: [
      { name: 'Vapor', colors: ['#fc5c7d', '#ce9ffc', '#6a82fb'], direction: 135 },
      { name: 'Tropical', colors: ['#f7971e', '#ffd200', '#21d4fd'], direction: 135 },
      { name: 'Candy', colors: ['#fc5c7d', '#6a82fb'], direction: 135 },
      { name: 'Neon', colors: ['#00f260', '#0575e6'], direction: 135 },
      { name: 'Warm Glow', colors: ['#f093fb', '#f5576c'], direction: 135 },
      { name: 'Fire', colors: ['#f83600', '#f9d423'], direction: 135 },
      { name: 'Lush Tropics', colors: ['#fc466b', '#3f5efb'], direction: 135 },
      { name: 'Citrus', colors: ['#feac5e', '#c779d0', '#4bc0c8'], direction: 135 },
    ],
  },
  {
    name: 'Pastel',
    presets: [
      { name: 'Lavender', colors: ['#a18cd1', '#fbc2eb'], direction: 135 },
      { name: 'Rose', colors: ['#ee9ca7', '#ffdde1'], direction: 135 },
      { name: 'Mint Cream', colors: ['#d4fc79', '#96e6a1'], direction: 135 },
      { name: 'Soft Sky', colors: ['#c2e9fb', '#a1c4fd'], direction: 135 },
      { name: 'Cotton Candy', colors: ['#fbc8d4', '#9795f0'], direction: 135 },
      { name: 'Powder', colors: ['#fdfbfb', '#ebedee'], direction: 135 },
      { name: 'Sherbet', colors: ['#fad0c4', '#ffd1ff'], direction: 135 },
      { name: 'Mist', colors: ['#e9defa', '#fbfcdb'], direction: 135 },
    ],
  },
  {
    name: 'Glow',
    presets: [
      { name: 'Spotlight', colors: ['#ffd194', '#70e1f5'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Sunburst', colors: ['#fff100', '#ff8a00', '#e52e71'], direction: 0, type: 'radial', radialPosition: 'top' },
      { name: 'Coral Pop', colors: ['#ff9a9e', '#fad0c4'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Halo', colors: ['#a1c4fd', '#c2e9fb', '#0f0c29'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Aurora Halo', colors: ['#11998e', '#38ef7d', '#0f0c29'], direction: 0, type: 'radial', radialPosition: 'center' },
      { name: 'Bloom', colors: ['#fce38a', '#f38181'], direction: 0, type: 'radial', radialPosition: 'top' },
      { name: 'Lift', colors: ['#fff', '#dee9ff', '#a8c0ff'], direction: 0, type: 'radial', radialPosition: 'bottom' },
      { name: 'Side Beam', colors: ['#fa709a', '#fee140'], direction: 0, type: 'radial', radialPosition: 'left' },
    ],
  },
  {
    name: 'Mesh',
    presets: [
      { name: 'Iris', colors: ['#667eea', '#764ba2', '#f093fb'], direction: 45 },
      { name: 'Rainbow Wash', colors: ['#ff9a9e', '#fad0c4', '#fbc2eb', '#a18cd1', '#fbc2eb'], direction: 135 },
      { name: 'Lava Lamp', colors: ['#ee0979', '#ff6a00', '#ffba00'], direction: 60 },
      { name: 'Aurora Mesh', colors: ['#00c6ff', '#0072ff', '#7b4397'], direction: 135 },
      { name: 'Cyber', colors: ['#fc466b', '#3f5efb', '#00ff87'], direction: 135 },
      { name: 'Sunset Mesh', colors: ['#ff6e7f', '#bfe9ff', '#ffa17f'], direction: 90 },
      { name: 'Pearl', colors: ['#e0c3fc', '#8ec5fc', '#ffd6e0'], direction: 135 },
      { name: 'Mountain Air', colors: ['#43cea2', '#185a9d', '#ffc371'], direction: 180 },
      { name: 'Liquid', colors: ['#a18cd1', '#fbc2eb', '#84fab0', '#8fd3f4'], direction: 135 },
    ],
  },
];

// --- Flat backward-compat exports --------------------------------------------
// Some older call sites import the flat lists directly. Keep them working by
// flattening the categorized data so we have a single source of truth.

export const SOLID_PRESETS: string[] = SOLID_CATEGORIES.flatMap((c) => c.colors);
export const GRADIENT_PRESETS: GradientPreset[] = GRADIENT_CATEGORIES.flatMap((c) => c.presets);

// --- Koubou device color hex map (unchanged) ---------------------------------

export const KOUBOU_COLOR_HEX: Record<string, string> = {
  'Natural Titanium': '#9a8e7e', 'Black Titanium': '#3c3c3c', 'White Titanium': '#e8e5e0',
  'Desert Titanium': '#c4a882', 'Blue Titanium': '#394e5f',
  'Black': '#1c1c1e', 'White': '#f5f5f7', 'Pink': '#f9cdd3', 'Teal': '#5eb5b5',
  'Ultramarine': '#4a50c7', 'Blue': '#5b8fb9', 'Green': '#3f6e4e', 'Yellow': '#f2d44e',
  'Red': '#c43d40', 'Purple': '#7c5dab',
  'Midnight': '#2c2c3a', 'Starlight': '#f0e8d8', 'Product Red': '#c43d40',
  'Space Black': '#2a2a2c', 'Space Gray': '#636366', 'Silver': '#d6d6d6', 'Gold': '#e3caa5',
  'Deep Purple': '#5e4580', 'Graphite': '#4f4f4f', 'Pacific Blue': '#1e5c82',
  'Sierra Blue': '#9fb8cf', 'Alpine Green': '#3c5e48', 'Rose Gold': '#e6c0aa',
};
