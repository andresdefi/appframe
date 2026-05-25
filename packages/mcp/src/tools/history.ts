import type { ToolDefinition } from './types.js';
import {
  jsonContent,
  requireConfirm,
  requireRecord,
  requireSlug,
} from './helpers.js';

// Server-side undo history. Every envelope write that goes through
// `writeAndBroadcast` (patch_screen, batch_patch_screens, locale ops,
// variant lifecycle, etc.) pushes the pre-write snapshot into a per-
// project in-memory ring buffer (capped at 25 entries). The agent can
// observe the recent stack and pop the most recent one.
//
// Caveats the descriptions surface to the agent:
//   - History is in-memory, lost on preview-server restart.
//   - No redo. Once undone, an entry is gone.
//   - The undo itself does NOT push to history (would create an
//     infinite stack).

export const historyTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'list_recent_writes',
      description:
        'List the most recent envelope writes for a project, most recent ' +
        'first. Returns `{ entries: [{opName, savedAt, index}], total }` ' +
        'where each entry names the operation (e.g. `patch_screen`, ' +
        '`locales/patch-batch`, `variants/create`) and when it landed. ' +
        '`index` 0 = the next one `undo_last_write` would revert. ' +
        '`limit` (optional) caps the response. History is in-memory ' +
        'per server instance — restarting `pnpm preview` clears it.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'list_recent_writes');
      const slug = requireSlug(a);
      const limit = typeof a.limit === 'number' ? a.limit : undefined;
      return jsonContent(await client.listRecentWrites(slug, limit));
    },
  },
  {
    descriptor: {
      name: 'undo_last_write',
      description:
        "Pop the most recent envelope write off this project's undo " +
        "stack and restore its `beforeData` to disk. Mutates the on- " +
        'disk envelope and broadcasts a project-changed SSE so the ' +
        'browser re-hydrates. Returns the undone entry\'s metadata + ' +
        '`remaining` (how many undos are still queued). 409 conflict ' +
        'if the history is empty (server restart wipes it, and a ' +
        'project with no agent writes never had any). No redo: once ' +
        'undone, the entry is gone. Requires `confirm: true` because ' +
        'it overwrites whatever the agent has just patched.',
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
      const a = requireRecord(args, 'undo_last_write');
      requireConfirm(a, 'undo_last_write', `revert the last envelope write on "${a.slug}"`);
      const slug = requireSlug(a);
      return jsonContent(await client.undoLastWrite(slug));
    },
  },
];
