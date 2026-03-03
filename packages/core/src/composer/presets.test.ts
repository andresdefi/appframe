import { describe, it, expect } from 'vitest';
import { COMPOSITION_PRESETS } from './presets.js';
import type { CompositionPreset } from './presets.js';

const ALL_PRESETS: CompositionPreset[] = [
  'single', 'peek-right', 'peek-left', 'tilt-left', 'tilt-right',
  'duo-overlap', 'duo-split', 'hero-tilt', 'fanned-cards',
];

describe('COMPOSITION_PRESETS', () => {
  it('contains all 9 preset types', () => {
    expect(Object.keys(COMPOSITION_PRESETS)).toHaveLength(9);
    for (const id of ALL_PRESETS) {
      expect(COMPOSITION_PRESETS[id]).toBeDefined();
    }
  });

  it('every preset has required fields', () => {
    for (const preset of Object.values(COMPOSITION_PRESETS)) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.deviceCount).toBeGreaterThanOrEqual(1);
      expect(preset.slots.length).toBe(preset.deviceCount);
    }
  });

  it('preset IDs match record keys', () => {
    for (const [key, preset] of Object.entries(COMPOSITION_PRESETS)) {
      expect(preset.id).toBe(key);
    }
  });

  it('single-device presets have 1 slot', () => {
    for (const id of ['single', 'peek-right', 'peek-left', 'tilt-left', 'tilt-right'] as const) {
      expect(COMPOSITION_PRESETS[id].deviceCount).toBe(1);
      expect(COMPOSITION_PRESETS[id].slots).toHaveLength(1);
    }
  });

  it('multi-device presets have 2-3 slots', () => {
    expect(COMPOSITION_PRESETS['duo-overlap'].slots).toHaveLength(2);
    expect(COMPOSITION_PRESETS['duo-split'].slots).toHaveLength(2);
    expect(COMPOSITION_PRESETS['hero-tilt'].slots).toHaveLength(2);
    expect(COMPOSITION_PRESETS['fanned-cards'].slots).toHaveLength(3);
  });

  it('all slots have required fields within reasonable ranges', () => {
    for (const preset of Object.values(COMPOSITION_PRESETS)) {
      for (const slot of preset.slots) {
        expect(slot.offsetX).toBeGreaterThanOrEqual(-100);
        expect(slot.offsetX).toBeLessThanOrEqual(100);
        expect(slot.offsetY).toBeGreaterThanOrEqual(-50);
        expect(slot.offsetY).toBeLessThanOrEqual(100);
        expect(slot.scale).toBeGreaterThan(0);
        expect(slot.scale).toBeLessThanOrEqual(200);
        expect(typeof slot.rotation).toBe('number');
        expect(typeof slot.angle).toBe('number');
        expect(typeof slot.tilt).toBe('number');
        expect(slot.zIndex).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
