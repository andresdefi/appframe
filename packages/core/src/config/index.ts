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
  OutputConfig,
  IOSOutputConfig,
  AndroidOutputConfig,
  Platform,
  TemplateStyle,
  FrameStyle,
  LayoutVariant,
} from './schema.js';
