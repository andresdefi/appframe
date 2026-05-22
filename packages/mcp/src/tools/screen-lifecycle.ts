import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  requireConfirm,
  requireIndex,
  requireRecord,
  requireSlug,
} from './helpers.js';

export const screenLifecycleTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'add_screen',
      description:
        'Insert a new screen into the project. `atIndex` defaults to ' +
        'appending. Optional `screen` overrides any of the new screen\'s ' +
        'default editor-state fields (headline, subtitle, frameId, ' +
        'backgroundType, etc.). Missing fields are filled in on hydrate ' +
        'from STATIC_SCREEN_DEFAULTS — the server-side default is an ' +
        'empty centered <p> for both headline and subtitle. Returns the ' +
        'new screen including its generated id and the inserted index.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          atIndex: { type: 'integer', minimum: 0 },
          screen: { type: 'object', description: 'Partial<ScreenState> overrides.' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'add_screen');
      const slug = requireSlug(a);
      const { atIndex, screen } = a;
      if (atIndex !== undefined && (typeof atIndex !== 'number' || !Number.isInteger(atIndex) || atIndex < 0)) {
        throw new Error('`atIndex` must be a non-negative integer if provided');
      }
      if (screen !== undefined && !isRecord(screen)) {
        throw new Error('`screen` must be an object if provided');
      }
      return jsonContent(
        await client.insertScreen(
          slug,
          typeof atIndex === 'number' ? atIndex : undefined,
          isRecord(screen) ? screen : undefined,
        ),
      );
    },
  },
  {
    descriptor: {
      name: 'remove_screen',
      description:
        'Remove the screen at `index`. Rejects if it would leave the ' +
        'project with zero screens (the UI requires at least one). The ' +
        'active variant snapshot and `selectedScreen` are kept in sync. ' +
        'Requires `confirm: true`; agent should confirm with the user ' +
        'unless they explicitly asked for removal.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'confirm'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          confirm: { const: true, description: 'Must be `true`. Safety guard.' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'remove_screen');
      requireConfirm(a, 'remove_screen', 'remove a screen from the project');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      return jsonContent(await client.removeScreen(slug, index));
    },
  },
  {
    descriptor: {
      name: 'reorder_screens',
      description:
        'Reorder all screens by passing a permutation array. ' +
        '`order[i]` is the OLD index of the screen that should land at ' +
        'the NEW position `i`. Must be a complete permutation of ' +
        '[0..N-1]; any omission or duplicate is rejected. Example: to ' +
        'move screen 3 to the front of a 4-screen project, pass ' +
        '`[3, 0, 1, 2]`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'order'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          order: { type: 'array', items: { type: 'integer', minimum: 0 }, minItems: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'reorder_screens');
      const slug = requireSlug(a);
      const { order } = a;
      if (!Array.isArray(order) || !order.every((v) => Number.isInteger(v) && v >= 0)) {
        throw new Error('`order` must be an array of non-negative integers');
      }
      return jsonContent(await client.reorderScreens(slug, order as number[]));
    },
  },
];
