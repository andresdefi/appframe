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
  ValidationResult,
  ValidationError,
  FormattedError,
} from './config/index.js';

export const VERSION = '0.1.0';
