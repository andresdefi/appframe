export type CompositionPreset =
  | 'single'
  // Single-device edge bleed presets
  | 'peek-right'
  | 'peek-left'
  | 'tilt-left'
  | 'tilt-right'
  // Multi-device presets
  | 'duo-overlap'
  | 'duo-split'
  | 'hero-tilt'
  | 'fanned-cards';

export interface DeviceSlotPreset {
  offsetX: number;    // horizontal offset from center as % of canvas width
  offsetY: number;    // vertical position as % of canvas height
  scale: number;      // device width as % of canvas width
  rotation: number;   // rotation in degrees
  angle: number;      // perspective rotateY angle
  tilt: number;       // perspective rotateX tilt
  zIndex: number;     // stacking order
}

export interface CompositionDefinition {
  id: CompositionPreset;
  name: string;
  description: string;
  deviceCount: number;
  slots: DeviceSlotPreset[];
}

export const COMPOSITION_PRESETS: Record<CompositionPreset, CompositionDefinition> = {
  single: {
    id: 'single',
    name: 'Single Device',
    description: 'Default centered device',
    deviceCount: 1,
    slots: [
      { offsetX: 0, offsetY: 15, scale: 92, rotation: 0, angle: 0, tilt: 0, zIndex: 1 },
    ],
  },

  // ===== Single-device edge bleed presets =====
  // These position one device to overflow the canvas edge, creating
  // a "bleeding" effect when screens are placed side by side in the store.

  'peek-right': {
    id: 'peek-right',
    name: 'Peek Right',
    description: 'Device bleeds off right edge — pair with Peek Left on next screen',
    deviceCount: 1,
    slots: [
      { offsetX: 48, offsetY: 8, scale: 95, rotation: 5, angle: -8, tilt: 0, zIndex: 1 },
    ],
  },
  'peek-left': {
    id: 'peek-left',
    name: 'Peek Left',
    description: 'Device bleeds off left edge — pair with Peek Right on previous screen',
    deviceCount: 1,
    slots: [
      { offsetX: -48, offsetY: 8, scale: 95, rotation: -5, angle: 8, tilt: 0, zIndex: 1 },
    ],
  },
  'tilt-left': {
    id: 'tilt-left',
    name: 'Tilt Left',
    description: 'Dramatic tilt overflowing left edge',
    deviceCount: 1,
    slots: [
      { offsetX: -25, offsetY: 5, scale: 105, rotation: -18, angle: 15, tilt: 3, zIndex: 1 },
    ],
  },
  'tilt-right': {
    id: 'tilt-right',
    name: 'Tilt Right',
    description: 'Dramatic tilt overflowing right edge',
    deviceCount: 1,
    slots: [
      { offsetX: 25, offsetY: 5, scale: 105, rotation: 18, angle: -15, tilt: 3, zIndex: 1 },
    ],
  },

  // ===== Multi-device presets =====
  // Large devices that overflow canvas edges. When adjacent screens
  // use complementary presets, devices appear to span across screens.

  'duo-overlap': {
    id: 'duo-overlap',
    name: 'Duo Overlap',
    description: 'Two overlapping devices — back one tilted, front one prominent',
    deviceCount: 2,
    slots: [
      // Back device: large, pushed left, tilted — bleeds off left edge
      { offsetX: -30, offsetY: 18, scale: 85, rotation: -12, angle: 12, tilt: 2, zIndex: 1 },
      // Front device: large, pushed right, slight rotation — bleeds off right edge
      { offsetX: 22, offsetY: 8, scale: 88, rotation: 4, angle: 0, tilt: 0, zIndex: 2 },
    ],
  },
  'duo-split': {
    id: 'duo-split',
    name: 'Duo Split',
    description: 'Two devices side by side — each bleeds off opposite edges',
    deviceCount: 2,
    slots: [
      // Left device: bleeds off left edge
      { offsetX: -38, offsetY: 12, scale: 80, rotation: -5, angle: 8, tilt: 2, zIndex: 1 },
      // Right device: bleeds off right edge
      { offsetX: 38, offsetY: 12, scale: 80, rotation: 5, angle: -8, tilt: 2, zIndex: 1 },
    ],
  },
  'hero-tilt': {
    id: 'hero-tilt',
    name: 'Hero + Background',
    description: 'Large hero device front-center, smaller tilted device behind',
    deviceCount: 2,
    slots: [
      // Background device: tilted, pushed far left, bleeds off left edge
      { offsetX: -35, offsetY: 20, scale: 78, rotation: -15, angle: 15, tilt: 4, zIndex: 1 },
      // Hero device: large, center-right, prominent
      { offsetX: 12, offsetY: 8, scale: 92, rotation: 0, angle: 0, tilt: 0, zIndex: 2 },
    ],
  },
  'fanned-cards': {
    id: 'fanned-cards',
    name: 'Fanned Cards',
    description: 'Three devices fanned out — sides overflow edges',
    deviceCount: 3,
    slots: [
      // Left card: bleeds off left edge
      { offsetX: -35, offsetY: 16, scale: 68, rotation: -18, angle: 0, tilt: 0, zIndex: 1 },
      // Center card: prominent, slightly larger
      { offsetX: 0, offsetY: 8, scale: 72, rotation: 0, angle: 0, tilt: 0, zIndex: 3 },
      // Right card: bleeds off right edge
      { offsetX: 35, offsetY: 16, scale: 68, rotation: 18, angle: 0, tilt: 0, zIndex: 2 },
    ],
  },
};
