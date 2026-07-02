import type { ToolDefinition } from './types.js';
import { COMPOSITION_PRESETS } from '@appframe/core';

const COMPOSITION_IDS = Object.keys(COMPOSITION_PRESETS);
import {
  jsonContent,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
  requireString,
  unknownIdError,
} from './helpers.js';

export const screenDeviceTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'set_composition',
      description:
        "Set the multi-device composition layout for a screen. Valid " +
        'values come from `list_compositions`: "single" (one device), ' +
        '"duo-overlap" (two stacked), "duo-split" (two side-by-side), ' +
        '"hero-tilt" (one tilted hero), "fanned-cards" (fanned spread). ' +
        'Composition controls how many device slots the screen renders ' +
        'and their default geometry — pair with `move_device_frame` (or ' +
        'extraDevices via `patch_screen`) for fine-grained positioning.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'composition'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          composition: { enum: COMPOSITION_IDS },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_composition');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const composition = requireString(a, 'composition');
      if (!COMPOSITION_IDS.includes(composition)) {
        throw unknownIdError(
          'composition',
          composition,
          COMPOSITION_IDS,
          'Call `list_compositions` for details.',
        );
      }
      // Pad / trim extraDevices to match the preset's deviceCount.
      // Primary device lives at screen.device; extraDevices holds the
      // additional slots (length = deviceCount - 1). Empty placeholder
      // entries inherit preset slot config at render time, which is
      // what the UI does when you pick a preset.
      const preset = COMPOSITION_PRESETS[composition as keyof typeof COMPOSITION_PRESETS];
      const targetExtraCount = (preset?.deviceCount ?? 1) - 1;
      const screen = await readScreen(client, slug, index);
      const currentExtras = Array.isArray(screen.extraDevices) ? screen.extraDevices : [];
      const PLACEHOLDER = {
        dataUrl: null,
        name: null,
        frameId: null,
        offsetX: null,
        offsetY: null,
        scale: null,
        rotation: null,
        angle: null,
        tilt: null,
      };
      const nextExtras = currentExtras.slice(0, targetExtraCount);
      while (nextExtras.length < targetExtraCount) {
        nextExtras.push({ ...PLACEHOLDER });
      }
      const result = await client.patchScreen(slug, index, {
        composition,
        extraDevices: nextExtras,
      });
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'set_device_frame',
      description:
        "Swap the device frame on a screen. `frameId` is an id from " +
        '`list_frames` ("ipad-pro-13", "generic-phone") or ' +
        '`list_koubou_devices` ("iphone-17-pro-max", "iphone-air"). ' +
        '`deviceColor` is the variant name (e.g. "Default", "Natural ' +
        'Titanium") — koubou families expose available colors under ' +
        'each family\'s `colors` array.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'frameId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          frameId: { type: 'string', minLength: 1 },
          deviceColor: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_device_frame');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const frameId = requireString(a, 'frameId');
      const { deviceColor } = a;
      const patch: Record<string, unknown> = { frameId };
      if (typeof deviceColor === 'string' && deviceColor.length > 0) {
        patch.deviceColor = deviceColor;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'move_device_frame',
      description:
        'Adjust the device frame placement on a screen. All fields are ' +
        'optional — pass only what you want to change. `scale` is the ' +
        "device's relative size on the canvas (default ~92, typical " +
        'range 50-130). `top` is the vertical offset in % (default ~15; ' +
        'lower numbers push the device down). `angle` is the planar ' +
        'rotation in degrees (default 0, used for "angled-left" / ' +
        '"angled-right" layouts). `tilt` is a 3D tilt for the perspective ' +
        'compositions. `rotation` is a pure 2D rotation. `offsetX` shifts ' +
        'the device horizontally in %.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          scale: { type: 'number', minimum: 0, maximum: 300 },
          top: { type: 'number' },
          angle: { type: 'number' },
          tilt: { type: 'number' },
          rotation: { type: 'number' },
          offsetX: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'move_device_frame');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const fieldMap: Record<string, string> = {
        scale: 'deviceScale',
        top: 'deviceTop',
        angle: 'deviceAngle',
        tilt: 'deviceTilt',
        rotation: 'deviceRotation',
        offsetX: 'deviceOffsetX',
      };
      const patch: Record<string, unknown> = {};
      for (const [shorthand, fieldName] of Object.entries(fieldMap)) {
        const v = a[shorthand];
        if (typeof v === 'number' && Number.isFinite(v)) {
          patch[fieldName] = v;
        }
      }
      if (Object.keys(patch).length === 0) {
        throw new Error('pass at least one of scale, top, angle, tilt, rotation, offsetX');
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'set_frame_style',
      description:
        'Set the device frame style for a screen. `style` is "flat" ' +
        '(default — renders the device frame around the screenshot) or ' +
        '"none" (removes the device frame entirely, leaving the bare ' +
        'edge-to-edge screenshot). When you set "none", pair it with ' +
        '`set_border_simulation` to draw a thin colored bezel around the ' +
        'screenshot — otherwise the screenshot has no device outline at ' +
        'all. `frameStyle` is also reachable via the generic ' +
        '`patch_screen`; inspect it via `inspect_schema` "screen".',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'style'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          style: { enum: ['flat', 'none'] },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_frame_style');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const style = requireString(a, 'style');
      if (style !== 'flat' && style !== 'none') {
        throw unknownIdError(
          'style',
          style,
          ['flat', 'none'],
          'frameStyle is one of "flat" (device frame) or "none" (no frame — pair with set_border_simulation).',
        );
      }
      // frameStyle is a top-level scalar; patchScreen merges top-level
      // keys wholesale, so setting it alone leaves every sibling field
      // (device position, effects, text) untouched — no read needed.
      const result = await client.patchScreen(slug, index, { frameStyle: style });
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'set_device_position',
      description:
        'Move / scale the device on a screen using the canonical ' +
        'editor-state field names — the common "reposition the device" ' +
        'case without reaching for `patch_screen`. All fields optional; ' +
        'pass only what you want to change. `deviceScale` device width ' +
        'as % of canvas width (50-100, default 92). `deviceTop` vertical ' +
        'position as % of canvas height (-80..80, default 15; lower ' +
        'values push the device down). `deviceOffsetX` horizontal offset ' +
        'from center as % of canvas width (-80..80, default 0). ' +
        '`deviceAngle` perspective angle in degrees for angled layouts ' +
        '(2-45, default 8). For 3D `deviceTilt` or 2D `deviceRotation` ' +
        'use `move_device_frame`. Same underlying fields as ' +
        '`move_device_frame` (shorthand names) and `patch_screen`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          deviceScale: { type: 'number', minimum: 50, maximum: 100 },
          deviceTop: { type: 'number', minimum: -80, maximum: 80 },
          deviceOffsetX: { type: 'number', minimum: -80, maximum: 80 },
          deviceAngle: { type: 'number', minimum: 2, maximum: 45 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_device_position');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const patch: Record<string, unknown> = {};
      for (const field of ['deviceScale', 'deviceTop', 'deviceOffsetX', 'deviceAngle'] as const) {
        const v = a[field];
        if (typeof v === 'number' && Number.isFinite(v)) {
          patch[field] = v;
        }
      }
      if (Object.keys(patch).length === 0) {
        throw new Error('pass at least one of deviceScale, deviceTop, deviceOffsetX, deviceAngle');
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
];
