export {
  loadConfig,
  validateConfig,
  validateConfigOrThrow,
  appframeConfigSchema,
} from './config/index.js';

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
  PanoramicElement,
  PanoramicConfig,
  PanoramicBackground,
  PanoramicBackgroundLayer,
  ValidationResult,
  ValidationError,
  FormattedError,
} from './config/index.js';

export { GRADIENT_PRESETS, SOLID_PRESETS } from './config/index.js';
export type { GradientPreset } from './config/index.js';

export {
  loadFrameManifest,
  getFrame,
  listFrames,
  getDefaultFrame,
} from './frames/index.js';

export type {
  FrameManifest,
  FrameDefinition,
  ScreenArea,
  FrameSize,
} from './frames/index.js';

export { TemplateEngine } from './templates/index.js';
export type {
  TemplateContext,
  DeviceContext,
  PanoramicTemplateContext,
  PanoramicRenderedBackgroundLayer,
  PanoramicRenderedElement,
} from './templates/index.js';
export { injectSpotlightHTML, injectAnnotationsHTML, injectOverlaysHTML } from './templates/index.js';

export { loadFontFaces, loadAllFontFaces, getFontName, FONT_CATALOG } from './fonts/index.js';
export type { FontInfo } from './fonts/index.js';

export { Renderer } from './renderer/renderer.js';
export { generateScreenshots } from './renderer/pipeline.js';
export { generatePanoramicScreenshots } from './renderer/panoramic.js';
export { STORE_SIZES, getTargetSizes } from './renderer/sizes.js';
export type { ScreenshotSize } from './renderer/types.js';
export type {
  RenderOptions,
  RenderResult,
  GenerateOptions,
  GenerateResult,
} from './renderer/types.js';

export { COMPOSITION_PRESETS } from './composer/presets.js';
export type { CompositionDefinition, DeviceSlotPreset } from './composer/presets.js';

// Koubou integration
export {
  detectKoubou,
  translateConfig as translateKoubouConfig,
  translateConfigWithLocalization,
  generateWithKoubou,
  generateKoubouConfig,
  renderSingleScreenWithKoubou,
  resolveLocalizedAsset,
  mapSizeToKoubou,
  mapDeviceToKoubou,
  KOUBOU_DIMENSIONS,
  getDeviceFamilies,
  getDeviceFamily,
  getDeviceId,
  getDeviceFamilyByFrameId,
  getDeviceColorNames,
  findMatchingDeviceFamily,
  getDevicePlatformCategory,
  getKoubouFramesDir,
  getDeviceFramePath,
} from './devices/index.js';
export type {
  KoubouConfig,
  KoubouLocalizationConfig,
  KoubouDetectionResult,
  KoubouSingleScreenOptions,
  TranslateOptions as KoubouTranslateOptions,
  DeviceFamily,
  DeviceCategory,
  DeviceColorVariant,
} from './devices/index.js';

export const VERSION = '0.1.0';
