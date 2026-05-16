// Barrel re-export so App.tsx's existing lazy import path keeps working.
// The original file held the three Content components plus a defunct
// `PanoramicTab` parent (unused — App.tsx renders the three Content
// components directly based on the active sub-tab). Implementation
// now lives in ./Panoramic/.
export { PanoramicBackgroundContent } from './Panoramic/BackgroundContent';
export { PanoramicDeviceContent } from './Panoramic/DeviceContent';
export { PanoramicTextContent } from './Panoramic/TextContent';
