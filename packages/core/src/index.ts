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
  OutputConfig,
  IOSOutputConfig,
  AndroidOutputConfig,
  Platform,
  TemplateStyle,
  FrameStyle,
  LayoutVariant,
  CompositionPreset,
  ValidationResult,
  ValidationError,
  FormattedError,
} from './config/index.js';

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
export type { TemplateContext, DeviceContext } from './templates/index.js';

export { loadFontFaces, loadAllFontFaces, getFontName, FONT_CATALOG } from './fonts/index.js';
export type { FontInfo } from './fonts/index.js';

export { Renderer } from './renderer/renderer.js';
export { generateScreenshots } from './renderer/pipeline.js';
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
  generateWithKoubou,
  generateKoubouConfig,
  mapSizeToKoubou,
  mapDeviceToKoubou,
  KOUBOU_DIMENSIONS,
} from './koubou/index.js';
export type {
  KoubouConfig,
  KoubouDetectionResult,
  TranslateOptions as KoubouTranslateOptions,
} from './koubou/index.js';

export const VERSION = '0.1.0';
