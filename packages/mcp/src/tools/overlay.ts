import { randomUUID } from 'node:crypto';
import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  normalizeColor,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
  requireString,
} from './helpers.js';

const OVERLAY_FIELD_SCHEMA = {
  type: { enum: ['icon', 'badge', 'star-rating', 'custom', 'shape'] },
  iconRef: { type: 'string' },
  imageDataUrl: { type: 'string' },
  x: { type: 'number', minimum: -100, maximum: 200 },
  y: { type: 'number', minimum: -100, maximum: 200 },
  size: { type: 'number', minimum: 20, maximum: 3000 },
  rotation: { type: 'number', minimum: -180, maximum: 180 },
  opacity: { type: 'number', minimum: 0, maximum: 1 },
  shapeType: { enum: ['circle', 'rectangle', 'line', 'arrow'] },
  shapeColor: { type: 'string' },
  shapeOpacity: { type: 'number', minimum: 0, maximum: 1 },
  shapeBlur: { type: 'number', minimum: 0, maximum: 30 },
  layer: { enum: ['front', 'default', 'behind-text', 'behind-device'] },
  softBlur: { type: 'number', minimum: 0, maximum: 200 },
  blendMode: {
    enum: [
      'normal', 'multiply', 'screen', 'overlay', 'soft-light',
      'hard-light', 'darken', 'lighten', 'color-dodge', 'color-burn',
      'difference', 'exclusion',
    ],
  },
};

function normalizeOverlayColors(patch: Record<string, unknown>): void {
  if (typeof patch.shapeColor === 'string' && patch.shapeColor.length > 0) {
    patch.shapeColor = normalizeColor(patch.shapeColor);
  }
}

export const overlayTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'add_overlay',
      description:
        'Add an overlay element to a screen. Overlays are richer than ' +
        'annotations — they include icons, badges, star ratings, custom ' +
        'image stickers, and pure shapes used as decorative blobs/glows. ' +
        "`type` is one of:\n" +
        '  • "icon" — a vector icon. Set `iconRef` (e.g. "lucide:star").\n' +
        '  • "shape" — a coloured shape (circle / rectangle / line / ' +
        'arrow). Set `shapeType` and usually `shapeColor`.\n' +
        '  • "badge" / "star-rating" — preset compositions.\n' +
        '  • "custom" — bring-your-own image (set `imageDataUrl`).\n' +
        'Position: `x`/`y` are canvas-% from -100 to 200 (so elements ' +
        'can sit fully outside for bleed effects). `size` is canvas ' +
        'pixels (20-3000, default 200). `rotation` -180 to 180. ' +
        '`opacity` 0-1. `layer` controls stacking: "front" | "default" | ' +
        '"behind-text" | "behind-device". `blendMode` is a CSS blend ' +
        '(multiply, screen, overlay, soft-light, ...). `softBlur` ' +
        '(0-200 px) blurs the whole element — turns a flat blob into an ' +
        'atmospheric glow.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'type', 'x', 'y'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          ...OVERLAY_FIELD_SCHEMA,
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'add_overlay');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { slug: _s, index: _i, ...fields } = a;
      void _s; void _i;
      normalizeOverlayColors(fields);
      const screen = await readScreen(client, slug, index);
      const id = `overlay-${randomUUID().slice(0, 8)}`;
      const next = { id, ...fields };
      const existing = Array.isArray(screen.overlays) ? screen.overlays : [];
      const result = await client.patchScreen(slug, index, {
        overlays: [...existing, next],
      });
      return jsonContent({ id, overlay: next, screen: result.screen });
    },
  },
  {
    descriptor: {
      name: 'update_overlay',
      description:
        'Update fields on an existing overlay by id. Shallow merge — to ' +
        'change one nested attribute, pass it directly (overlays have no ' +
        'nested objects, all fields are top-level).',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'overlayId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          overlayId: { type: 'string', minLength: 1 },
          ...OVERLAY_FIELD_SCHEMA,
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'update_overlay');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const overlayId = requireString(a, 'overlayId');
      const { slug: _s, index: _i, overlayId: _o, ...patch } = a;
      void _s; void _i; void _o;
      normalizeOverlayColors(patch);
      const screen = await readScreen(client, slug, index);
      const existing = Array.isArray(screen.overlays) ? screen.overlays : [];
      let foundIdx = -1;
      for (let i = 0; i < existing.length; i++) {
        const o = existing[i];
        if (isRecord(o) && o.id === overlayId) {
          foundIdx = i;
          break;
        }
      }
      if (foundIdx < 0) {
        throw new Error(`overlay id "${overlayId}" not found on screen ${index}`);
      }
      const merged = { ...(existing[foundIdx] as Record<string, unknown>), ...patch };
      const nextOverlays = existing.slice();
      nextOverlays[foundIdx] = merged;
      await client.patchScreen(slug, index, { overlays: nextOverlays });
      return jsonContent({ success: true, overlay: merged });
    },
  },
  {
    descriptor: {
      name: 'remove_overlay',
      description: 'Remove an overlay from a screen by its id.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'overlayId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          overlayId: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'remove_overlay');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const overlayId = requireString(a, 'overlayId');
      const screen = await readScreen(client, slug, index);
      const existing = Array.isArray(screen.overlays) ? screen.overlays : [];
      const filtered = existing.filter((o) => isRecord(o) && o.id !== overlayId);
      const removed = existing.length - filtered.length;
      if (removed === 0) {
        return jsonContent({ success: false, reason: 'id not found', overlayId });
      }
      await client.patchScreen(slug, index, { overlays: filtered });
      return jsonContent({ success: true, removed, remaining: filtered.length });
    },
  },
];
