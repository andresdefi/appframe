export interface GradientPreset {
  name: string;
  colors: string[];
  direction: number;
  type?: 'linear' | 'radial';
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Sunset', colors: ['#ff6b35', '#f7c948', '#ff3864'], direction: 135 },
  { name: 'Ocean', colors: ['#0052d4', '#4364f7', '#6fb1fc'], direction: 135 },
  { name: 'Aurora', colors: ['#00c9ff', '#92fe9d'], direction: 135 },
  { name: 'Midnight', colors: ['#0f0c29', '#302b63', '#24243e'], direction: 135 },
  { name: 'Coral', colors: ['#ff9a9e', '#fecfef'], direction: 135 },
  { name: 'Lavender', colors: ['#a18cd1', '#fbc2eb'], direction: 135 },
  { name: 'Emerald', colors: ['#11998e', '#38ef7d'], direction: 135 },
  { name: 'Fire', colors: ['#f83600', '#f9d423'], direction: 135 },
  { name: 'Berry', colors: ['#8e2de2', '#4a00e0'], direction: 135 },
  { name: 'Peach', colors: ['#ffecd2', '#fcb69f'], direction: 135 },
  { name: 'Sky', colors: ['#2980b9', '#6dd5fa', '#ffffff'], direction: 180 },
  { name: 'Dusk', colors: ['#2c3e50', '#fd746c'], direction: 135 },
  { name: 'Mint', colors: ['#00b09b', '#96c93d'], direction: 135 },
  { name: 'Rose', colors: ['#ee9ca7', '#ffdde1'], direction: 135 },
  { name: 'Indigo', colors: ['#667eea', '#764ba2'], direction: 135 },
  { name: 'Slate', colors: ['#bdc3c7', '#2c3e50'], direction: 135 },
  { name: 'Candy', colors: ['#fc5c7d', '#6a82fb'], direction: 135 },
  { name: 'Forest', colors: ['#134e5e', '#71b280'], direction: 135 },
  { name: 'Neon', colors: ['#00f260', '#0575e6'], direction: 135 },
  { name: 'Warm', colors: ['#f093fb', '#f5576c'], direction: 135 },
];

export const SOLID_PRESETS: string[] = [
  '#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#f5f5f5', '#fafafa', '#2d3436', '#636e72',
  '#00b894', '#00cec9', '#6c5ce7', '#fdcb6e', '#e17055',
  '#dfe6e9', '#b2bec3', '#2c3e50', '#8e44ad', '#2980b9',
];
