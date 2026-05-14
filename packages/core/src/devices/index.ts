export { resolveLocalizedAsset } from './assets.js';
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
