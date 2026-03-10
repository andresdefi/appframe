export { detectKoubou } from './detector.js';
export { translateConfig, translateConfigWithLocale, translateConfigWithLocalization, mapSizeToKoubou, mapDeviceToKoubou } from './translator.js';
export type { TranslateOptions } from './translator.js';
export { generateWithKoubou, generateKoubouConfig, renderSingleScreenWithKoubou } from './pipeline.js';
export type { KoubouSingleScreenOptions } from './pipeline.js';
export { resolveLocalizedAsset } from './assets.js';
export { KOUBOU_DIMENSIONS } from './types.js';
export type {
  KoubouConfig,
  KoubouProject,
  KoubouBackground,
  KoubouTextElement,
  KoubouImageElement,
  KoubouSpotlightElement,
  KoubouHighlightElement,
  KoubouContentElement,
  KoubouScreenshot,
  KoubouDefaults,
  KoubouDetectionResult,
  KoubouLocalizationConfig,
} from './types.js';
export {
  getDeviceFamilies,
  getDeviceFamily,
  getDeviceId,
  getDeviceFamilyByFrameId,
  getDeviceColorNames,
  findMatchingDeviceFamily,
  getDevicePlatformCategory,
} from './catalog.js';
export type { DeviceFamily, DeviceCategory, DeviceColorVariant } from './catalog.js';
export { getKoubouFramesDir, getDeviceFramePath } from './frames.js';
