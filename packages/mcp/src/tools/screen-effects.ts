import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  normalizeColor,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
} from './helpers.js';

export const screenEffectsTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'set_border_simulation',
      description:
        "Toggle / style the simulated device border (the dark bezel " +
        'around the screenshot, useful when the screenshot itself is ' +
        "edge-to-edge and you want a thin device frame look). All " +
        'fields are optional and merge with the existing config — ' +
        '`thickness` 0-20 px, `radius` 0-60 px (matches CSS border-' +
        'radius), `color` hex/P3. Set `enabled: false` to hide without ' +
        "losing your tuned thickness/color/radius.",
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          thickness: { type: 'number', minimum: 0, maximum: 20 },
          color: { type: 'string' },
          radius: { type: 'number', minimum: 0, maximum: 60 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_border_simulation');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, thickness, radius, color } = a;
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.borderSimulation) ? screen.borderSimulation : {};
      // Schema defaults — apply when first enabling so the agent gets a
      // sensible look without having to know every field.
      const BORDER_DEFAULTS = {
        enabled: false,
        thickness: 4,
        color: '#1a1a1a',
        radius: 40,
      };
      const merged: Record<string, unknown> = { ...BORDER_DEFAULTS, ...existing };
      if (typeof enabled === 'boolean') merged.enabled = enabled;
      if (typeof thickness === 'number') merged.thickness = thickness;
      if (typeof radius === 'number') merged.radius = radius;
      if (typeof color === 'string' && color.length > 0) {
        merged.color = normalizeColor(color);
      }
      // First-enable inference: if the user passes any styling field
      // without an `enabled` flag and there was no prior config, turn
      // it on. Matches set_spotlight / set_loupe.
      if (typeof enabled !== 'boolean' && !isRecord(screen.borderSimulation)) {
        merged.enabled = true;
      }
      const result = await client.patchScreen(slug, index, { borderSimulation: merged });
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'set_device_shadow',
      description:
        'Toggle / style the drop shadow under the device frame. Unlike ' +
        '`borderSimulation`, there is no `enabled` flag — the field is ' +
        '`null` when off, an object when on. Pass any field to enable; ' +
        'pass `enabled: false` to clear back to null. `opacity` 0-1, ' +
        '`blur` 0-50 px, `offsetY` 0-30 px, `color` hex/P3. Defaults: ' +
        'opacity 0.25, blur 20, offsetY 10, color #000000.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          opacity: { type: 'number', minimum: 0, maximum: 1 },
          blur: { type: 'number', minimum: 0, maximum: 50 },
          color: { type: 'string' },
          offsetY: { type: 'number', minimum: 0, maximum: 30 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_device_shadow');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, opacity, blur, color, offsetY } = a;
      if (enabled === false) {
        const result = await client.patchScreen(slug, index, { deviceShadow: null });
        return jsonContent({ success: true, savedAt: result.savedAt });
      }
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.deviceShadow) ? screen.deviceShadow : {};
      const SHADOW_DEFAULTS = {
        opacity: 0.25,
        blur: 20,
        color: '#000000',
        offsetY: 10,
      };
      const merged: Record<string, unknown> = { ...SHADOW_DEFAULTS, ...existing };
      if (typeof opacity === 'number') merged.opacity = opacity;
      if (typeof blur === 'number') merged.blur = blur;
      if (typeof offsetY === 'number') merged.offsetY = offsetY;
      if (typeof color === 'string' && color.length > 0) {
        merged.color = normalizeColor(color);
      }
      const result = await client.patchScreen(slug, index, { deviceShadow: merged });
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'set_spotlight',
      description:
        "Enable / position / shape a screen's spotlight (the area that " +
        'stays bright while the rest of the screenshot dims). All fields ' +
        'are optional and merge with the existing spotlight — pass just ' +
        'the fields you want to change. Coordinates and sizes are in ' +
        'percent of the device screen (0-100). `shape` is "rectangle" or ' +
        '"oval". `dimOpacity` 0-1 (default 0.5). `blur` 0-40px. ' +
        '`borderRadius` 0-100. Set `enabled: false` to hide the spotlight ' +
        'without losing your tuned config.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          x: { type: 'number', minimum: 0, maximum: 100 },
          y: { type: 'number', minimum: 0, maximum: 100 },
          w: { type: 'number', minimum: 0, maximum: 100 },
          h: { type: 'number', minimum: 0, maximum: 100 },
          shape: { enum: ['rectangle', 'oval'] },
          dimOpacity: { type: 'number', minimum: 0, maximum: 1 },
          blur: { type: 'number', minimum: 0, maximum: 40 },
          borderRadius: { type: 'number', minimum: 0, maximum: 100 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_spotlight');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, slug: _s, index: _i, ...shape } = a;
      void _s; void _i;
      const screen = await readScreen(client, slug, index);
      const existingSpotlight = isRecord(screen.spotlight) ? screen.spotlight : {};
      const SPOTLIGHT_DEFAULTS = {
        x: 50, y: 50, w: 60, h: 25,
        shape: 'rectangle',
        dimOpacity: 0.5, blur: 0, borderRadius: 0,
      };
      const merged = { ...SPOTLIGHT_DEFAULTS, ...existingSpotlight, ...shape };
      const patch: Record<string, unknown> = { spotlight: merged };
      if (typeof enabled === 'boolean') {
        patch.spotlightEnabled = enabled;
      } else if (!isRecord(screen.spotlight)) {
        patch.spotlightEnabled = true;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'set_loupe',
      description:
        "Enable / position / shape a screen's loupe (a magnified inset " +
        'showing part of the screenshot bigger). Same merge semantics as ' +
        '`set_spotlight` — pass only the fields you want to change. ' +
        '`sourceX`/`sourceY` (-1 to 1) pick the source point on the ' +
        'device. `displayX`/`displayY` (0-100, %) position the loupe on ' +
        'the canvas. `width`/`height` are FRACTIONS (0.05-1) of the ' +
        'preview, not percentages. `zoom` 1-5. `cornerRadius` in px ' +
        '(0-200). Toggle without losing config via `enabled: false`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          sourceX: { type: 'number', minimum: -1, maximum: 1 },
          sourceY: { type: 'number', minimum: -1, maximum: 1 },
          displayX: { type: 'number', minimum: 0, maximum: 100 },
          displayY: { type: 'number', minimum: 0, maximum: 100 },
          width: { type: 'number', minimum: 0.05, maximum: 1 },
          height: { type: 'number', minimum: 0.05, maximum: 1 },
          zoom: { type: 'number', minimum: 1, maximum: 5 },
          cornerRadius: { type: 'number', minimum: 0, maximum: 200 },
          borderWidth: { type: 'number', minimum: 0, maximum: 10 },
          borderColor: { type: 'string' },
          shadow: { type: 'boolean' },
          shadowColor: { type: 'string' },
          shadowRadius: { type: 'number', minimum: 0, maximum: 100 },
          shadowOffsetX: { type: 'number', minimum: -50, maximum: 50 },
          shadowOffsetY: { type: 'number', minimum: -50, maximum: 50 },
          xOffset: { type: 'number', minimum: -100, maximum: 100 },
          yOffset: { type: 'number', minimum: -100, maximum: 100 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_loupe');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, borderColor, shadowColor, slug: _s, index: _i, ...rest } = a;
      void _s; void _i;
      const colorPatch: Record<string, unknown> = {};
      if (typeof borderColor === 'string' && borderColor.length > 0) {
        colorPatch.borderColor = normalizeColor(borderColor);
      }
      if (typeof shadowColor === 'string' && shadowColor.length > 0) {
        colorPatch.shadowColor = normalizeColor(shadowColor);
      }
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.loupe) ? screen.loupe : {};
      const LOUPE_DEFAULTS = {
        sourceX: 0, sourceY: 0,
        displayX: 50, displayY: 60,
        width: 0.5, height: 0.33,
        zoom: 2.5,
        cornerRadius: 0, borderWidth: 0, borderColor: '#ffffff',
        shadow: false, shadowColor: '#000000',
        shadowRadius: 30, shadowOffsetX: 0, shadowOffsetY: 0,
        xOffset: 0, yOffset: 0,
      };
      const merged = { ...LOUPE_DEFAULTS, ...existing, ...rest, ...colorPatch };
      const patch: Record<string, unknown> = { loupe: merged };
      if (typeof enabled === 'boolean') {
        patch.loupeEnabled = enabled;
      } else if (!isRecord(screen.loupe)) {
        patch.loupeEnabled = true;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
];
