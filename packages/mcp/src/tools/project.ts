import { STORE_SIZES } from '@appframe/core';
import type { ToolDefinition } from './types.js';
import {
  jsonContent,
  requireConfirm,
  requireRecord,
  requireSlug,
  requireString,
  unknownIdError,
} from './helpers.js';

// STORE_SIZES is a flat Record<sizeKey, sizeInfo>; the /api/sizes
// endpoint regroups it by platform for the UI. Just take the keys for
// O(1) validation here.
const VALID_EXPORT_SIZE_KEYS = new Set<string>(Object.keys(STORE_SIZES));

export const projectTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'create_project',
      description:
        'Create a new project. `name` is the human display name (e.g. ' +
        '"My App Screenshots"); the server slugifies it (e.g. ' +
        '"my-app-screenshots") and handles collision-avoidance (appends ' +
        '`-2`, `-3`, ... if the slug exists). Returns the meta — pull ' +
        '`name` (slug) and pass to `switch_project` if you want the ' +
        "browser to navigate to it. Doesn't auto-switch.",
      inputSchema: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string', minLength: 1 } },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'create_project');
      const name = requireString(a, 'name');
      return jsonContent(await client.createProject(name));
    },
  },
  {
    descriptor: {
      name: 'rename_project',
      description:
        'Rename a project. `from` is the current slug (from ' +
        '`list_projects` or `get_active_project`). `to` is the new ' +
        'human display name — the server slugifies and resolves ' +
        'collisions. Returns the new meta. Updates screenshot URLs ' +
        'embedded in the project envelope to point at the new slug.',
      inputSchema: {
        type: 'object',
        required: ['from', 'to'],
        properties: {
          from: { type: 'string', minLength: 1 },
          to: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'rename_project');
      const from = requireString(a, 'from');
      const to = requireString(a, 'to');
      return jsonContent(await client.renameProject(from, to));
    },
  },
  {
    descriptor: {
      name: 'duplicate_project',
      description:
        'Copy a project to a new slug. `from` is the source slug, `to` ' +
        'is the new display name. Useful for branching variants of an ' +
        'existing screenshot set without disturbing the original.',
      inputSchema: {
        type: 'object',
        required: ['from', 'to'],
        properties: {
          from: { type: 'string', minLength: 1 },
          to: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'duplicate_project');
      const from = requireString(a, 'from');
      const to = requireString(a, 'to');
      return jsonContent(await client.duplicateProject(from, to));
    },
  },
  {
    descriptor: {
      name: 'delete_project',
      description:
        'Permanently delete a project (the appframe.json envelope, its ' +
        'meta.json index entry, AND the screenshots/ folder). Destructive ' +
        '— no recycle bin. Requires `confirm: true` so the tool rejects ' +
        'accidental calls; the agent should confirm with the user before ' +
        'passing it.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'confirm'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          confirm: { const: true, description: 'Must be `true`. Safety guard.' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'delete_project');
      requireConfirm(a, 'delete_project', `delete the project "${a.slug}" and all its screenshots`);
      const slug = requireString(a, 'slug');
      return jsonContent(await client.deleteProject(slug));
    },
  },
  {
    descriptor: {
      name: 'set_export_size',
      description:
        "Set the App Store / Play Store target export size for the " +
        'project. Valid keys come from `list_sizes` — e.g. "ios-6.9" ' +
        '(iPhone 6.9"), "ios-ipad-13" (iPad 13"), "android-phone", ' +
        '"watch-ultra3", "mac-2880x1800". Affects the dimensions of ' +
        'rendered exports; the preview canvas itself doesn\'t change.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'exportSize'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          exportSize: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_export_size');
      const slug = requireSlug(a);
      const exportSize = requireString(a, 'exportSize');
      if (!VALID_EXPORT_SIZE_KEYS.has(exportSize)) {
        throw unknownIdError(
          'export size',
          exportSize,
          VALID_EXPORT_SIZE_KEYS,
          'Call `list_sizes` to see valid keys.',
        );
      }
      const result = await client.patchProject(slug, { exportSize });
      return jsonContent(result);
    },
  },
  {
    descriptor: {
      name: 'switch_project',
      description:
        "Set the active project and ask the browser to navigate to it. " +
        'The server validates the slug exists, marks it active, and ' +
        'broadcasts a `project-switched` event over SSE; the browser ' +
        'flushes the previous project\'s autosave first to avoid ' +
        "corrupting the old file, then loads + hydrates the new one. " +
        'Pair with `create_project` so the user lands in the project the ' +
        'agent just made.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: { slug: { type: 'string', minLength: 1 } },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'switch_project');
      const slug = requireString(a, 'slug');
      return jsonContent(await client.switchProject(slug));
    },
  },
];
