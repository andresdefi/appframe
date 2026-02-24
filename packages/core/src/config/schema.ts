export interface AppframeConfig {
  app: AppConfig;
  theme: ThemeConfig;
  frames: FrameConfig;
  screens: ScreenConfig[];
  locales?: Record<string, LocaleConfig>;
  output: OutputConfig;
}

export interface AppConfig {
  name: string;
  description: string;
  platforms: Platform[];
  features: string[];
}

export type Platform = 'ios' | 'android';

export interface ThemeConfig {
  style: TemplateStyle;
  colors: ColorConfig;
  font: string;
  fontWeight: number;
}

export type TemplateStyle = 'minimal' | 'bold' | 'dark' | 'playful';

export interface ColorConfig {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  subtitle?: string;
}

export interface FrameConfig {
  ios?: string;
  android?: string;
  style: FrameStyle;
}

export type FrameStyle = 'flat' | '3d' | 'floating' | 'none';

export interface ScreenConfig {
  screenshot: string;
  headline: string;
  subtitle?: string;
  layout: LayoutVariant;
  device?: string;
  background?: string;
}

export type LayoutVariant =
  | 'center'
  | 'left'
  | 'right'
  | 'angled-left'
  | 'angled-right'
  | 'floating'
  | 'side-by-side';

export interface LocaleConfig {
  screens: LocaleScreenConfig[];
}

export interface LocaleScreenConfig {
  headline: string;
  subtitle?: string;
}

export interface OutputConfig {
  platforms: Platform[];
  ios?: IOSOutputConfig;
  android?: AndroidOutputConfig;
  directory: string;
}

export interface IOSOutputConfig {
  sizes: number[];
  format: 'png' | 'jpeg';
  quality?: number;
}

export interface AndroidOutputConfig {
  sizes: string[];
  format: 'png' | 'jpeg';
  quality?: number;
  featureGraphic?: boolean;
}
