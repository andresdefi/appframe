import type {
  TemplateStyle,
  LayoutVariant,
  FrameStyle,
  BackgroundType,
  BackgroundGradient,
  BackgroundOverlay,
  DeviceShadow,
  BorderSimulation,
  Loupe,
  Callout,
  Overlay,
  Annotation,
  SpotlightConfig,
  CompositionPreset,
  TextGradient,
  AppframeConfig,
  LocaleConfig,
  PanoramicElement,
  PanoramicBackground,
  PanoramicBackgroundLayer,
} from '@appframe/core';

export type {
  TemplateStyle,
  LayoutVariant,
  FrameStyle,
  BackgroundType,
  BackgroundGradient,
  BackgroundOverlay,
  DeviceShadow,
  BorderSimulation,
  Loupe,
  Callout,
  Overlay,
  Annotation,
  SpotlightConfig,
  CompositionPreset,
  TextGradient,
  AppframeConfig,
  LocaleConfig,
  PanoramicElement,
  PanoramicBackground,
  PanoramicBackgroundLayer,
};

export interface PanoramicEffects {
  spotlight: SpotlightConfig | null;
  annotations: Annotation[];
  overlays: Overlay[];
}

export interface TextPosition {
  x: number;
  y: number;
  width?: number;
}

export interface ScreenColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  subtitle: string;
}

export interface ExtraDeviceState {
  dataUrl: string | null;
  name: string | null;
  frameId: string | null;
  offsetX: number | null;
  offsetY: number | null;
  scale: number | null;
  rotation: number | null;
  angle: number | null;
  tilt: number | null;
}

export interface ScreenState {
  screenIndex: number;
  eyebrow: string;
  headline: string;
  subtitle: string;
  accentColor: string;
  style: TemplateStyle;
  layout: LayoutVariant;
  font: string;
  fontWeight: number;
  eyebrowFont: string | null;
  eyebrowFontWeight: number | null;
  headlineFont: string | null;
  headlineFontWeight: number | null;
  subtitleFont: string | null;
  subtitleFontWeight: number | null;
  headlineSize: number;
  subtitleSize: number;
  headlineRotation: number;
  subtitleRotation: number;
  colors: ScreenColors;
  frameId: string;
  deviceColor: string;
  frameStyle: FrameStyle;
  composition: CompositionPreset;
  deviceScale: number;
  deviceTop: number;
  deviceRotation: number;
  deviceOffsetX: number;
  deviceAngle: number;
  deviceTilt: number;
  headlineGradient: TextGradient | null;
  subtitleGradient: TextGradient | null;
  headlineLineHeight: number;
  headlineLetterSpacing: number;
  headlineTextTransform: string;
  headlineFontStyle: string;
  subtitleOpacity: number;
  subtitleLetterSpacing: number;
  subtitleTextTransform: string;
  spotlight: SpotlightConfig | null;
  annotations: Annotation[];
  textPositions: {
    eyebrow: TextPosition | null;
    headline: TextPosition | null;
    subtitle: TextPosition | null;
  };
  eyebrowSize: number;
  screenshotDataUrl: string | null;
  screenshotName: string | null;
  screenshotDims: { width: number; height: number } | null;
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundGradient: BackgroundGradient;
  backgroundImageDataUrl: string | null;
  backgroundOverlay: BackgroundOverlay | null;
  deviceShadow: DeviceShadow | null;
  borderSimulation: BorderSimulation | null;
  cornerRadius: number;
  loupe: Loupe | null;
  callouts: Callout[];
  overlays: Overlay[];
  extraDevices: ExtraDeviceState[];
}

export interface PlatformPreviewSize {
  w: number;
  h: number;
}

export const PLATFORM_PREVIEW_SIZES: Record<string, PlatformPreviewSize> = {
  iphone: { w: 400, h: 868 },
  ipad: { w: 500, h: 716 },
  mac: { w: 640, h: 400 },
  watch: { w: 205, h: 251 },
  android: { w: 400, h: 711 },
};

export const PLATFORM_DEVICE_DEFAULTS: Record<
  string,
  { deviceScale: number; deviceTop: number; deviceAngle: number }
> = {
  iphone: { deviceScale: 92, deviceTop: 15, deviceAngle: 8 },
  ipad: { deviceScale: 92, deviceTop: 15, deviceAngle: 8 },
  mac: { deviceScale: 85, deviceTop: 20, deviceAngle: 0 },
  watch: { deviceScale: 80, deviceTop: 22, deviceAngle: 0 },
  android: { deviceScale: 92, deviceTop: 15, deviceAngle: 8 },
};
