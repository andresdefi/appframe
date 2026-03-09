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
  getKoubouDeviceFamilies,
  getKoubouDeviceFamily,
  getKoubouDeviceId,
  getKoubouFamilyByFrameId,
  getKoubouColorNames,
  findMatchingDeviceFamily,
  getDevicePlatformCategory,
} from './catalog.js';
export type { KoubouDeviceFamily, KoubouDeviceCategory, KoubouColorVariant } from './catalog.js';
export { getKoubouFramesDir, getKoubouFramePath } from './frames.js';
