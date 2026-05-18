export { loadConfig } from './loader.js';
export { validateConfig, validateConfigOrThrow } from './validator.js';
export type { ValidationResult, ValidationError, FormattedError, FormattedWarning } from './validator.js';
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
  OutputConfig,
  IOSOutputConfig,
  AndroidOutputConfig,
  Platform,
  FrameStyle,
  LayoutVariant,
  CompositionPreset,
  TextGradient,
  SpotlightConfig,
  Annotation,
  BackgroundType,
  BackgroundImageFit,
  BackgroundGradient,
  BackgroundOverlay,
  DeviceShadow,
  BorderSimulation,
  Loupe,
  Callout,
  Overlay,
  PanoramicElement,
  PanoramicConfig,
  PanoramicBackground,
  PanoramicBackgroundLayer,
} from './schema.js';
export { GRADIENT_PRESETS, SOLID_PRESETS } from './background-presets.js';
export type { GradientPreset } from './background-presets.js';
