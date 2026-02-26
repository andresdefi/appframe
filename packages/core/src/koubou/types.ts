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
  alignment?: string;
}

export interface KoubouImageElement {
  type: 'image';
  asset: string;
  position: [string, string];
  scale: number;
  frame?: boolean;
}

export type KoubouContentElement = KoubouTextElement | KoubouImageElement;

export interface KoubouScreenshot {
  content: KoubouContentElement[];
  background?: KoubouBackground;
}

export interface KoubouDefaults {
  background?: KoubouBackground;
}

export interface KoubouConfig {
  project: KoubouProject;
  defaults?: KoubouDefaults;
  screenshots: Record<string, KoubouScreenshot>;
}

export interface KoubouDetectionResult {
  available: boolean;
  binaryPath: string | null;
  version: string | null;
}

// Koubou output size dimensions (actual pixels)
export const KOUBOU_DIMENSIONS: Record<string, { width: number; height: number }> = {
  'iPhone6_9': { width: 1320, height: 2868 },
  'iPhone6_7': { width: 1290, height: 2796 },
  'iPhone6_5': { width: 1242, height: 2688 },
  'iPhone6_1': { width: 1179, height: 2556 },
  'iPhone5_5': { width: 1242, height: 2208 },
  'iPadPro12_9': { width: 2048, height: 2732 },
  'iPadPro11': { width: 1668, height: 2388 },
  'iPadPro13': { width: 2064, height: 2752 },
};
