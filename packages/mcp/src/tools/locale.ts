import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  requireIndex,
  requireRecord,
  requireSlug,
  requireString,
  wrapTextAsHtml,
} from './helpers.js';

export const localeTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'add_locale',
      description:
        'Add a locale to a project. Deep-clones the current default ' +
        "screens into the new locale's snapshot — so adding `fr` makes " +
        'the French set start identical to Default. Edits in either ' +
        "locale don't propagate to the other. `code` should come from " +
        '`list_locales`. `label` overrides the human label (defaults to ' +
        'the catalog English name).',
      inputSchema: {
        type: 'object',
        required: ['slug', 'code'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          code: { type: 'string', minLength: 1 },
          label: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'add_locale');
      const slug = requireSlug(a);
      const code = requireString(a, 'code');
      const label = typeof a.label === 'string' ? a.label : undefined;
      return jsonContent(await client.addLocale(slug, code, label));
    },
  },
  {
    descriptor: {
      name: 'remove_locale',
      description:
        'Remove a locale from a project. Drops both its metadata and ' +
        'snapshotted screens. If it was the active locale, the project ' +
        'falls back to "default". Cannot remove "default" itself.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'code'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          code: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'remove_locale');
      const slug = requireSlug(a);
      const code = requireString(a, 'code');
      return jsonContent(await client.removeLocale(slug, code));
    },
  },
  {
    descriptor: {
      name: 'set_active_locale',
      description:
        "Switch which locale the project is currently rendering. " +
        '"default" is the base set (top-level data.screens); any other ' +
        'code must be configured via `add_locale` first. The browser ' +
        'preview re-renders with the new locale on the next SSE update.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'code'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          code: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_active_locale');
      const slug = requireSlug(a);
      const code = requireString(a, 'code');
      return jsonContent(await client.setActiveLocale(slug, code));
    },
  },
  {
    descriptor: {
      name: 'patch_locale_screen',
      description:
        "Edit one screen inside a non-default locale's snapshot. Same " +
        'shallow-merge semantics as `patch_screen`. `code` cannot be ' +
        '"default" — use `patch_screen` for the base set. Useful for ' +
        'per-locale text translations, fonts, gradients, or screenshot ' +
        'swaps without touching the original.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'code', 'index', 'patch'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          code: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          patch: { type: 'object' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'patch_locale_screen');
      const slug = requireSlug(a);
      const code = requireString(a, 'code');
      if (code === 'default') {
        throw new Error('`code` must be a non-default locale code — use `patch_screen` for default');
      }
      const index = requireIndex(a);
      const { patch } = a;
      if (!isRecord(patch)) {
        throw new Error('`patch` must be an object of editor-state screen fields');
      }
      const result = await client.patchLocaleScreen(slug, code, index, patch);
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_locale_text',
      description:
        'Convenience wrapper: set the headline / subtitle / freeText on ' +
        'a single screen of a non-default locale. `target` is one of ' +
        '"headline" | "subtitle" | "freeText". `text` is plain text ' +
        '(wrapped in a centered <p>) or HTML (passed through). For more ' +
        "than one field at once, use `patch_locale_screen`.",
      inputSchema: {
        type: 'object',
        required: ['slug', 'code', 'index', 'target', 'text'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          code: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          text: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_locale_text');
      const slug = requireSlug(a);
      const code = requireString(a, 'code');
      if (code === 'default') {
        throw new Error('`code` must be a non-default locale — use `set_headline` / `set_subtitle` for default');
      }
      const index = requireIndex(a);
      const { target, text } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      if (typeof text !== 'string') {
        throw new Error('`text` must be a string');
      }
      const result = await client.patchLocaleScreen(slug, code, index, {
        [target]: wrapTextAsHtml(text),
      });
      return jsonContent(result.screen);
    },
  },
];
