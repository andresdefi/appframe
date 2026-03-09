export { loadConfig } from './loader.js';
export { validateConfig, validateConfigOrThrow } from './validator.js';
export type { ValidationResult, ValidationError, FormattedError } from './validator.js';
export { appframeConfigSchema } from './schema.js';
export type {
  AppframeConfig,
  AppConfig,
  ThemeConfig,
  ColorConfig,
  FrameConfig,
  ScreenConfig,
  LocaleConfig,
  LocaleScreenConfig,
  LocalizationConfig,
  OutputConfig,
  IOSOutputConfig,
  AndroidOutputConfig,
  Platform,
  TemplateStyle,
  FrameStyle,
  LayoutVariant,
  CompositionPreset,
  TextGradient,
  SpotlightConfig,
  Annotation,
  BackgroundType,
  BackgroundGradient,
  BackgroundOverlay,
  DeviceShadow,
  BorderSimulation,
  Loupe,
  Callout,
  Overlay,
} from './schema.js';
export { STYLE_PRESETS } from './presets.js';
export type { StylePreset, TypographyDefaults, ShadowConfig, BgEffect, ShadowIntensity } from './presets.js';
export { GRADIENT_PRESETS, SOLID_PRESETS } from './background-presets.js';
export type { GradientPreset } from './background-presets.js';
