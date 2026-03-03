// Types representing Koubou's YAML config structure

export interface KoubouProject {
  name: string;
  output_dir: string;
  device: string;
  output_size: string;
}

export interface KoubouBackground {
  type: 'solid' | 'linear' | 'radial';
  color?: string;
  colors?: string[];
  direction?: number;
  center?: [string, string];
  radius?: string;
}

export interface KoubouTextElement {
  type: 'text';
  content: string;
  position: [string, string];
  size: number;
  color?: string;
  weight?: string;
  font?: string;
  alignment?: string;
  gradient?: { colors: string[]; direction: number };
}

export interface KoubouImageElement {
  type: 'image';
  asset: string | Record<string, string>;
  position: [string, string];
  scale: number;
  frame?: boolean;
  rotation?: number;
}

export interface KoubouSpotlightElement {
  type: 'spotlight';
  position: [string, string];
  size: [string, string];
  shape?: 'circle' | 'rectangle';
  dim_opacity?: number;
  blur?: number;
}

export interface KoubouHighlightElement {
  type: 'highlight';
  shape: 'circle' | 'rounded-rect' | 'rectangle';
  position: [string, string];
  size: [string, string];
  color: string;
  stroke_width: number;
  fill_color?: string;
}

export interface KoubouCalloutElement {
  type: 'callout';
  source: { position: [string, string]; size: [string, string] };
  target: { position: [string, string] };
  magnification: number;
  connector?: 'line' | 'elbow' | 'none';
  border_color?: string;
  border_width?: number;
  shadow?: boolean;
}

export type KoubouContentElement = KoubouTextElement | KoubouImageElement | KoubouSpotlightElement | KoubouHighlightElement | KoubouCalloutElement;

export interface KoubouScreenshot {
  content: KoubouContentElement[];
  background?: KoubouBackground;
}

export interface KoubouDefaults {
  background?: KoubouBackground;
}

export interface KoubouLocalizationConfig {
  base_language: string;
  languages: string[];
  xcstrings_path: string;
}

export interface KoubouConfig {
  project: KoubouProject;
  defaults?: KoubouDefaults;
  localization?: KoubouLocalizationConfig;
  screenshots: Record<string, KoubouScreenshot>;
}

export interface KoubouDetectionResult {
  available: boolean;
  binaryPath: string | null;
  version: string | null;
}

// Koubou output size dimensions (actual pixels)
export const KOUBOU_DIMENSIONS: Record<string, { width: number; height: number }> = {
  // iPhone
  'iPhone6_9': { width: 1320, height: 2868 },
  'iPhone6_7': { width: 1290, height: 2796 },
  'iPhone6_5': { width: 1242, height: 2688 },
  'iPhone6_1': { width: 1179, height: 2556 },
  'iPhone5_5': { width: 1242, height: 2208 },
  // iPad
  'iPadPro12_9': { width: 2048, height: 2732 },
  'iPadPro11': { width: 1668, height: 2388 },
  'iPadPro13': { width: 2064, height: 2752 },
  // Mac
  'MacBookAir': { width: 2560, height: 1600 },
  'MacBookPro14': { width: 2880, height: 1800 },
  'MacBookPro16': { width: 2880, height: 1800 },
  'iMac24': { width: 2880, height: 1800 },
  // Apple Watch
  'WatchUltra': { width: 410, height: 502 },
  'WatchS7_45': { width: 396, height: 484 },
  'WatchS4_44': { width: 368, height: 448 },
  'WatchS4_40': { width: 324, height: 394 },
};
