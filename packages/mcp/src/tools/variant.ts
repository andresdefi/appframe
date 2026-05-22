import type { ToolDefinition } from './types.js';
import { jsonContent, requireConfirm, requireRecord, requireSlug, requireString } from './helpers.js';

export const variantTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'create_variant',
      description:
        "Create a new variant in the project. Two modes:\n" +
        '  • `mode: "duplicate-active"` (default) — snapshots the ' +
        "currently-active variant's screens + locales + panoramic state " +
        'into the new one. Use this when the agent should fork the ' +
        'current set and then mutate it to differentiate (e.g. ' +
        '"give me 3 design directions" — duplicate three times, then ' +
        'patch each).\n' +
        '  • `mode: "blank"` — minimal single-screen snapshot, no locale ' +
        'or panoramic carryover. Matches the UI\'s "Add Variant" button. ' +
        'The agent typically wants `duplicate-active`.\n' +
        'The new variant becomes active immediately — top-level state is ' +
        'replaced with its snapshot. `name` defaults to "Variant N".',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          mode: { enum: ['blank', 'duplicate-active'] },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'create_variant');
      const slug = requireSlug(a);
      const { name, mode } = a;
      if (mode !== undefined && mode !== 'blank' && mode !== 'duplicate-active') {
        throw new Error('`mode` must be "blank" or "duplicate-active"');
      }
      return jsonContent(
        await client.createVariant(slug, {
          name: typeof name === 'string' ? name : undefined,
          mode: mode as 'blank' | 'duplicate-active' | undefined,
        }),
      );
    },
  },
  {
    descriptor: {
      name: 'delete_variant',
      description:
        'Delete a variant. If it was the active one, the project falls ' +
        'back to the first remaining variant (its snapshot is applied to ' +
        'the top-level state). Rejects when deleting would leave zero ' +
        'variants — projects must have at least one. Requires ' +
        '`confirm: true`; the agent should confirm with the user first.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'variantId', 'confirm'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          variantId: { type: 'string', minLength: 1 },
          confirm: { const: true, description: 'Must be `true`. Safety guard.' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'delete_variant');
      requireConfirm(a, 'delete_variant', 'delete a variant and its snapshot');
      const slug = requireSlug(a);
      const variantId = requireString(a, 'variantId');
      return jsonContent(await client.deleteVariant(slug, variantId));
    },
  },
  {
    descriptor: {
      name: 'set_active_variant',
      description:
        'Switch which variant the project is currently rendering. ' +
        "Before the flip, the previous active variant's snapshot is " +
        'synced from the live top-level state so flipping back later ' +
        'returns to the same edits. After the flip, top-level ' +
        "state.screens / locales / panoramic come from the target " +
        'variant\'s frozen snapshot.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'variantId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          variantId: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_active_variant');
      const slug = requireSlug(a);
      const variantId = requireString(a, 'variantId');
      return jsonContent(await client.setActiveVariant(slug, variantId));
    },
  },
  {
    descriptor: {
      name: 'rename_variant',
      description:
        "Update a variant's metadata. Pass any combination of `name` " +
        '(display label), `description`, or `status` (`"draft"` or ' +
        '`"approved"` — for the UI\'s approval flow). At least one field ' +
        'is required.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'variantId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          variantId: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          status: { enum: ['draft', 'approved'] },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'rename_variant');
      const slug = requireSlug(a);
      const variantId = requireString(a, 'variantId');
      const { name, description, status } = a;
      if (name === undefined && description === undefined && status === undefined) {
        throw new Error('pass at least one of name / description / status');
      }
      if (status !== undefined && status !== 'draft' && status !== 'approved') {
        throw new Error('`status` must be "draft" or "approved"');
      }
      const patch: { name?: string; description?: string; status?: 'draft' | 'approved' } = {};
      if (typeof name === 'string') patch.name = name;
      if (typeof description === 'string') patch.description = description;
      if (status === 'draft' || status === 'approved') patch.status = status;
      return jsonContent(await client.renameVariant(slug, variantId, patch));
    },
  },
];
