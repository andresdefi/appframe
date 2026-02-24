export interface RenderOptions {
  html: string;
  width: number;
  height: number;
  outputPath: string;
  deviceScaleFactor?: number;
}

export interface RenderResult {
  outputPath: string;
  width: number;
  height: number;
  fileSize: number;
}

export interface GenerateOptions {
  configPath: string;
  platform?: string;
  locale?: string;
  screenIndex?: number;
  outputDir?: string;
  templateOverride?: string;
  onProgress?: (current: number, total: number, name: string) => void;
}

export interface GenerateResult {
  screenshots: RenderResult[];
  totalTime: number;
}

export interface ScreenshotSize {
  name: string;
  width: number;
  height: number;
  platform: 'ios' | 'android';
}
