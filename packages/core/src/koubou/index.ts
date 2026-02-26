export { detectKoubou } from './detector.js';
export { translateConfig, translateConfigWithLocale, mapSizeToKoubou, mapDeviceToKoubou } from './translator.js';
export type { TranslateOptions } from './translator.js';
export { generateWithKoubou, generateKoubouConfig } from './pipeline.js';
export { KOUBOU_DIMENSIONS } from './types.js';
export type {
  KoubouConfig,
  KoubouProject,
  KoubouBackground,
  KoubouTextElement,
  KoubouImageElement,
  KoubouContentElement,
  KoubouScreenshot,
  KoubouDefaults,
  KoubouDetectionResult,
} from './types.js';
