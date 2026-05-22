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

// Common geometry/style props shared by add + update. Listed once to
// keep both schemas in lockstep — drift here used to cause silent
// validation gaps where a field worked on add but not update.
const CALLOUT_FIELD_SCHEMA = {
  sourceX: { type: 'number', minimum: 0, maximum: 100 },
  sourceY: { type: 'number', minimum: 0, maximum: 100 },
  sourceW: { type: 'number', minimum: 1, maximum: 100 },
  sourceH: { type: 'number', minimum: 1, maximum: 100 },
  displayX: { type: 'number', minimum: 0, maximum: 100 },
  displayY: { type: 'number', minimum: 0, maximum: 100 },
  displayScale: { type: 'number', minimum: 0.5, maximum: 3 },
  rotation: { type: 'number', minimum: -45, maximum: 45 },
  borderRadius: { type: 'number', minimum: 0, maximum: 30 },
  shadow: { type: 'boolean' },
  borderWidth: { type: 'number', minimum: 0, maximum: 5 },
  borderColor: { type: 'string' },
  background: { type: 'string' },
  padding: { type: 'number', minimum: 0, maximum: 20 },
  cardScale: { type: 'number', minimum: 0.5, maximum: 3 },
  sourceLocked: { type: 'boolean' },
};

function normalizeCalloutColors(patch: Record<string, unknown>): void {
  if (typeof patch.borderColor === 'string' && patch.borderColor.length > 0) {
    patch.borderColor = normalizeColor(patch.borderColor);
  }
  if (typeof patch.background === 'string' && patch.background.length > 0) {
    patch.background = normalizeColor(patch.background);
  }
}

export const calloutTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'add_callout',
      description:
        'Add a callout to a screen — a card showing a cropped, optionally ' +
        'magnified region of the device screenshot, positioned on the ' +
        'canvas. `source*` defines the crop in the screenshot (0-100, %). ' +
        '`display*` positions the card on the canvas (0-100, %). ' +
        '`displayScale` magnifies content inside the card (0.5-3). ' +
        "`sourceLocked` (default true) means the crop coordinates are " +
        'independent of card position — match the drag-to-select ' +
        'behavior. Returns the new callout including the generated `id`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'sourceX', 'sourceY', 'sourceW', 'sourceH', 'displayX', 'displayY'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          ...CALLOUT_FIELD_SCHEMA,
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'add_callout');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { slug: _s, index: _i, ...callout } = a;
      void _s; void _i;
      normalizeCalloutColors(callout);
      const screen = await readScreen(client, slug, index);
      const id = `callout-${randomUUID().slice(0, 8)}`;
      // sourceLocked defaults to true so new callouts behave like
      // drag-to-select ones (crop pinned to screenshot coords). Legacy
      // "crop follows card" mode is opt-in via false.
      const next = { id, sourceLocked: true, ...callout };
      const existing = Array.isArray(screen.callouts) ? screen.callouts : [];
      const result = await client.patchScreen(slug, index, {
        callouts: [...existing, next],
      });
      return jsonContent({ id, callout: next, screen: result.screen });
    },
  },
  {
    descriptor: {
      name: 'remove_callout',
      description:
        'Remove a callout from a screen by its id. No-op (and returns ' +
        'success: false) when the id is not found.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'calloutId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          calloutId: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'remove_callout');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const calloutId = requireString(a, 'calloutId');
      const screen = await readScreen(client, slug, index);
      const existing = Array.isArray(screen.callouts) ? screen.callouts : [];
      const filtered = existing.filter((c) => isRecord(c) && c.id !== calloutId);
      const removed = existing.length - filtered.length;
      if (removed === 0) {
        return jsonContent({ success: false, reason: 'id not found', calloutId });
      }
      await client.patchScreen(slug, index, { callouts: filtered });
      return jsonContent({ success: true, removed, remaining: filtered.length });
    },
  },
  {
    descriptor: {
      name: 'update_callout',
      description:
        'Update fields on an existing callout. Shallow-merge — pass only ' +
        'the fields you want to change. Use `add_callout` to create new ' +
        'ones, `remove_callout` to delete.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'calloutId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          calloutId: { type: 'string', minLength: 1 },
          ...CALLOUT_FIELD_SCHEMA,
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'update_callout');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const calloutId = requireString(a, 'calloutId');
      const { slug: _s, index: _i, calloutId: _c, ...patch } = a;
      void _s; void _i; void _c;
      normalizeCalloutColors(patch);
      const screen = await readScreen(client, slug, index);
      const existing = Array.isArray(screen.callouts) ? screen.callouts : [];
      let foundIdx = -1;
      for (let i = 0; i < existing.length; i++) {
        const c = existing[i];
        if (isRecord(c) && c.id === calloutId) {
          foundIdx = i;
          break;
        }
      }
      if (foundIdx < 0) {
        throw new Error(`callout id "${calloutId}" not found on screen ${index}`);
      }
      const merged = { ...(existing[foundIdx] as Record<string, unknown>), ...patch };
      const nextCallouts = existing.slice();
      nextCallouts[foundIdx] = merged;
      await client.patchScreen(slug, index, { callouts: nextCallouts });
      return jsonContent({ success: true, callout: merged });
    },
  },
];
