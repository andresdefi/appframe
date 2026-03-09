export const SOLID_PRESETS = [
  '#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#f5f5f5', '#fafafa', '#2d3436', '#636e72',
  '#00b894', '#00cec9', '#6c5ce7', '#fdcb6e', '#e17055',
  '#dfe6e9', '#b2bec3', '#2c3e50', '#8e44ad', '#2980b9',
];

export interface GradientPreset {
  name: string;
  colors: string[];
  direction: number;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  // 3-stop gradients
  { name: 'Sunset', colors: ['#ff6b35', '#f7c948', '#ff3864'], direction: 135 },
  { name: 'Ocean', colors: ['#0052d4', '#4364f7', '#6fb1fc'], direction: 135 },
  { name: 'Midnight', colors: ['#0f0c29', '#302b63', '#24243e'], direction: 135 },
  { name: 'Sky', colors: ['#2980b9', '#6dd5fa', '#ffffff'], direction: 180 },
  { name: 'Horizon', colors: ['#003973', '#e5e5be', '#f7a600'], direction: 180 },
  { name: 'Vapor', colors: ['#fc5c7d', '#ce9ffc', '#6a82fb'], direction: 135 },
  { name: 'Tropical', colors: ['#f7971e', '#ffd200', '#21d4fd'], direction: 135 },
  { name: 'Dusk Sky', colors: ['#2c3e50', '#4ca1af', '#c4e0e5'], direction: 180 },
  { name: 'Flamingo', colors: ['#ee5a24', '#f0932b', '#fad390'], direction: 135 },
  { name: 'Arctic', colors: ['#1e3c72', '#2a5298', '#e8f5e9'], direction: 180 },
  { name: 'Velvet', colors: ['#6a0572', '#ab83a1', '#f5e6cc'], direction: 135 },
  { name: 'Lush', colors: ['#004e92', '#00b4db', '#88d8b0'], direction: 135 },
  // 2-stop gradients
  { name: 'Aurora', colors: ['#00c9ff', '#92fe9d'], direction: 135 },
  { name: 'Coral', colors: ['#ff9a9e', '#fecfef'], direction: 135 },
  { name: 'Lavender', colors: ['#a18cd1', '#fbc2eb'], direction: 135 },
  { name: 'Emerald', colors: ['#11998e', '#38ef7d'], direction: 135 },
  { name: 'Fire', colors: ['#f83600', '#f9d423'], direction: 135 },
  { name: 'Berry', colors: ['#8e2de2', '#4a00e0'], direction: 135 },
  { name: 'Peach', colors: ['#ffecd2', '#fcb69f'], direction: 135 },
  { name: 'Dusk', colors: ['#2c3e50', '#fd746c'], direction: 135 },
  { name: 'Mint', colors: ['#00b09b', '#96c93d'], direction: 135 },
  { name: 'Rose', colors: ['#ee9ca7', '#ffdde1'], direction: 135 },
  { name: 'Indigo', colors: ['#667eea', '#764ba2'], direction: 135 },
  { name: 'Candy', colors: ['#fc5c7d', '#6a82fb'], direction: 135 },
  { name: 'Forest', colors: ['#134e5e', '#71b280'], direction: 135 },
  { name: 'Neon', colors: ['#00f260', '#0575e6'], direction: 135 },
  { name: 'Warm', colors: ['#f093fb', '#f5576c'], direction: 135 },
];

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
