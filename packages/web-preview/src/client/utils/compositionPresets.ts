// Client-side copy of composition preset device values.
// Mirrors packages/core/src/composer/presets.ts — keep in sync.

export interface DeviceSlotPreset {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  angle: number;
  tilt: number;
  zIndex: number;
}

export const COMPOSITION_PRESETS: Record<string, { deviceCount: number; slots: DeviceSlotPreset[] }> = {
  single: {
    deviceCount: 1,
    slots: [{ offsetX: 0, offsetY: 15, scale: 92, rotation: 0, angle: 0, tilt: 0, zIndex: 1 }],
  },
  'peek-right': {
    deviceCount: 1,
    slots: [{ offsetX: 48, offsetY: 8, scale: 95, rotation: 5, angle: -8, tilt: 0, zIndex: 1 }],
  },
  'peek-left': {
    deviceCount: 1,
    slots: [{ offsetX: -48, offsetY: 8, scale: 95, rotation: -5, angle: 8, tilt: 0, zIndex: 1 }],
  },
  'tilt-left': {
    deviceCount: 1,
    slots: [{ offsetX: -25, offsetY: 5, scale: 105, rotation: -18, angle: 15, tilt: 3, zIndex: 1 }],
  },
  'tilt-right': {
    deviceCount: 1,
    slots: [{ offsetX: 25, offsetY: 5, scale: 105, rotation: 18, angle: -15, tilt: 3, zIndex: 1 }],
  },
  'duo-overlap': {
    deviceCount: 2,
    slots: [
      { offsetX: -30, offsetY: 18, scale: 85, rotation: -12, angle: 12, tilt: 2, zIndex: 1 },
      { offsetX: 22, offsetY: 8, scale: 88, rotation: 4, angle: 0, tilt: 0, zIndex: 2 },
    ],
  },
  'duo-split': {
    deviceCount: 2,
    slots: [
      { offsetX: -38, offsetY: 12, scale: 80, rotation: -5, angle: 8, tilt: 2, zIndex: 1 },
      { offsetX: 38, offsetY: 12, scale: 80, rotation: 5, angle: -8, tilt: 2, zIndex: 1 },
    ],
  },
  'hero-tilt': {
    deviceCount: 2,
    slots: [
      { offsetX: -35, offsetY: 20, scale: 78, rotation: -15, angle: 15, tilt: 4, zIndex: 1 },
      { offsetX: 12, offsetY: 8, scale: 92, rotation: 0, angle: 0, tilt: 0, zIndex: 2 },
    ],
  },
  'fanned-cards': {
    deviceCount: 3,
    slots: [
      { offsetX: -35, offsetY: 16, scale: 68, rotation: -18, angle: 0, tilt: 0, zIndex: 1 },
      { offsetX: 0, offsetY: 8, scale: 72, rotation: 0, angle: 0, tilt: 0, zIndex: 3 },
      { offsetX: 35, offsetY: 16, scale: 68, rotation: 18, angle: 0, tilt: 0, zIndex: 2 },
    ],
  },
};
