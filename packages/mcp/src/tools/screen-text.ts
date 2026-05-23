import type { AppframeClient } from '../client.js';
import type { ContentResult, ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  normalizeColor,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
  wrapTextAsHtml,
} from './helpers.js';

export const screenTextTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'set_headline',
      description:
        "Set a screen's headline. `text` accepts plain text (wrapped in " +
        'a centered <p>) or HTML (passed through). For multi-paragraph / ' +
        'gradient / rotated text, use `patch_screen` with the full ' +
        '`headline` HTML.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'text'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          text: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => setText(args, 'set_headline', 'headline', client),
  },
  {
    descriptor: {
      name: 'set_subtitle',
      description:
        "Set a screen's subtitle. `text` accepts plain text or HTML — " +
        'same conventions as `set_headline`. Pass an empty string to ' +
        'clear the subtitle.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'text'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          text: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => setText(args, 'set_subtitle', 'subtitle', client),
  },
  {
    descriptor: {
      name: 'set_font',
      description:
        'Set the font (and optional weight) on one of the text slots of a ' +
        'screen. `target` is "headline" | "subtitle" | "freeText". `font` ' +
        'is a font id from `list_fonts` (e.g. "inter", "ultra", "bungee", ' +
        '"dm-sans"). `weight` is optional — e.g. 400 for regular, 600 for ' +
        'semibold, 700 for bold.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target', 'font'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          font: { type: 'string', minLength: 1 },
          weight: { type: 'integer', minimum: 100, maximum: 900 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_font');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, font, weight } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      if (typeof font !== 'string' || font.length === 0) {
        throw new Error('`font` must be a non-empty font id (see list_fonts)');
      }
      const fontKey = `${target}Font`;
      const weightKey = `${target}FontWeight`;
      const patch: Record<string, unknown> = { [fontKey]: font };
      if (typeof weight === 'number' && Number.isFinite(weight)) {
        patch[weightKey] = weight;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_text_layer',
      description:
        'Set the stacking tier for one of the three text slots. ' +
        '`target` is "headline" | "subtitle" | "freeText". `layer` is:\n' +
        '  • "behind-device" (z:0) — tucks under the device frame so ' +
        'the frame partially occludes the text. Paints on top of the ' +
        'canvas background.\n' +
        '  • "default" (z:2) — standard behavior: above the device ' +
        'frame, below `default`/`front` overlays.\n' +
        '  • "above-overlays" (z:30) — above every overlay including ' +
        '`front`. Useful when a decorative overlay would otherwise ' +
        'cover the text.\n' +
        'Slots can have different layers — the renderer keeps a hidden ' +
        'placeholder of each slot in the inactive container so vertical ' +
        'stacking stays consistent.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target', 'layer'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          layer: { enum: ['behind-device', 'default', 'above-overlays'] },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_text_layer');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, layer } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      if (layer !== 'behind-device' && layer !== 'default' && layer !== 'above-overlays') {
        throw new Error('`layer` must be "behind-device", "default", or "above-overlays"');
      }
      const fieldKey = `${target}Layer`;
      const result = await client.patchScreen(slug, index, { [fieldKey]: layer });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_text_position',
      description:
        'Place one of the text slots at a custom canvas position. ' +
        '`target` is "headline" | "subtitle" | "freeText". `x` is left ' +
        'offset, `y` is top offset — both in canvas % (0-100). `width` ' +
        '(optional) constrains the text block width in canvas % so the ' +
        'text wraps. Pass `null` for all three coords (via ' +
        '`patch_screen` with `textPositions.<target>: null`) to revert ' +
        'to the default layout. The default layout uses the `layout` ' +
        'preset (center / angled-left / angled-right).',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target', 'x', 'y'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          x: { type: 'number' },
          y: { type: 'number' },
          width: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_text_position');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, x, y, width } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('`x` and `y` are required numbers');
      }
      // Merge with the existing textPositions object so we don't blow
      // away the other two slots when only setting one.
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.textPositions) ? screen.textPositions : {};
      const newPos: Record<string, unknown> = { x, y };
      if (typeof width === 'number') newPos.width = width;
      const merged = { ...existing, [target]: newPos };
      const result = await client.patchScreen(slug, index, { textPositions: merged });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_text_gradient',
      description:
        'Apply a linear gradient fill to a screen\'s headline or ' +
        "subtitle. `target` is \"headline\" or \"subtitle\" — freeText " +
        'gradients aren\'t in the schema. `colors` is 2-5 hex/P3 ' +
        'strings. `direction` is degrees 0-360 (default 90, vertical). ' +
        'Pass `null` for `colors` (via patch_screen) to clear the ' +
        'gradient and revert to the screen\'s solid text color.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target', 'colors'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle'] },
          colors: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
          direction: { type: 'number', minimum: 0, maximum: 360 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_text_gradient');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, colors, direction } = a;
      if (target !== 'headline' && target !== 'subtitle') {
        throw new Error('`target` must be "headline" or "subtitle"');
      }
      if (!Array.isArray(colors) || colors.length < 2 || colors.length > 5) {
        throw new Error('`colors` must be 2-5 color strings');
      }
      const normalized = colors.map((c) => {
        if (typeof c !== 'string') throw new Error('`colors` entries must be strings');
        return normalizeColor(c);
      });
      const gradient: Record<string, unknown> = { colors: normalized };
      if (typeof direction === 'number') gradient.direction = direction;
      const fieldKey = `${target}Gradient`;
      const result = await client.patchScreen(slug, index, { [fieldKey]: gradient });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_text_shadow',
      description:
        'Toggle / style the drop-shadow on one text slot. `target` is ' +
        '"headline" | "subtitle" | "freeText". All other fields are ' +
        'optional and merge with the existing config — `enabled` ' +
        'toggle, `offsetX`/`offsetY` -20..20 px, `blur` 0-30 px, ' +
        '`color` hex/P3, `opacity` 0-100. blur=0 + non-zero offset ' +
        '= hard drop shadow; blur > 0 with offset=0 = a glow centered ' +
        'on the glyph.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          enabled: { type: 'boolean' },
          offsetX: { type: 'number', minimum: -20, maximum: 20 },
          offsetY: { type: 'number', minimum: -20, maximum: 20 },
          blur: { type: 'number', minimum: 0, maximum: 30 },
          color: { type: 'string' },
          opacity: { type: 'number', minimum: 0, maximum: 100 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_text_shadow');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, enabled, offsetX, offsetY, blur, color, opacity } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      const fieldKey = `${target}Shadow`;
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen[fieldKey]) ? (screen[fieldKey] as Record<string, unknown>) : {};
      // Defaults match the slim-default "off but ready" shape — see
      // STATIC_SCREEN_DEFAULTS in screenSerialization.ts.
      const SHADOW_DEFAULTS = {
        enabled: false,
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        color: '#000000',
        opacity: 30,
      };
      const merged: Record<string, unknown> = { ...SHADOW_DEFAULTS, ...existing };
      if (typeof enabled === 'boolean') merged.enabled = enabled;
      if (typeof offsetX === 'number') merged.offsetX = offsetX;
      if (typeof offsetY === 'number') merged.offsetY = offsetY;
      if (typeof blur === 'number') merged.blur = blur;
      if (typeof opacity === 'number') merged.opacity = opacity;
      if (typeof color === 'string' && color.length > 0) {
        merged.color = normalizeColor(color);
      }
      // First-enable inference: if the agent passes styling fields with
      // no explicit `enabled` and the shadow was off, turn it on.
      if (
        typeof enabled !== 'boolean' &&
        merged.enabled === false &&
        (offsetX !== undefined || offsetY !== undefined || blur !== undefined || color !== undefined || opacity !== undefined)
      ) {
        merged.enabled = true;
      }
      const result = await client.patchScreen(slug, index, { [fieldKey]: merged });
      return jsonContent(result.screen);
    },
  },
];

// Shared body for `set_headline` and `set_subtitle`. Keeps the two
// handlers from diverging in subtle ways.
async function setText(
  args: unknown,
  toolName: string,
  field: 'headline' | 'subtitle',
  client: AppframeClient,
): Promise<ContentResult> {
  const a = requireRecord(args, toolName);
  const slug = requireSlug(a);
  const index = requireIndex(a);
  const { text } = a;
  if (typeof text !== 'string') {
    throw new Error('`text` must be a string');
  }
  const result = await client.patchScreen(slug, index, {
    [field]: wrapTextAsHtml(text),
  });
  return jsonContent(result.screen);
}
