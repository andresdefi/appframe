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
      return jsonContent({ success: true, savedAt: result.savedAt });
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
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
  {
    descriptor: {
      name: 'bulk_translate_locale',
      description:
        'Apply a translation set to many screens of one locale in a ' +
        'single atomic write. `translations` is an array of `{ index, ' +
        'headline?, subtitle?, freeText? }` — every text field is ' +
        'wrapped via wrapTextAsHtml (plain text → centered <p>, HTML ' +
        'passed through). Replaces the per-screen `set_locale_text` ' +
        'loop the agent used to write: one call instead of N. `code` ' +
        'cannot be "default" — use `batch_patch_screens` for that. ' +
        'Ops are independent (one entry per screen index); each entry ' +
        'must include at least one of the text fields.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'code', 'translations'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          code: { type: 'string', minLength: 1 },
          translations: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['index'],
              properties: {
                index: { type: 'integer', minimum: 0 },
                headline: { type: 'string' },
                subtitle: { type: 'string' },
                freeText: { type: 'string' },
              },
              additionalProperties: false,
            },
          },
          verbose: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'bulk_translate_locale');
      const slug = requireSlug(a);
      const code = requireString(a, 'code');
      if (code === 'default') {
        throw new Error('`code` must be a non-default locale — use `batch_patch_screens` for default');
      }
      const { translations, verbose } = a;
      if (!Array.isArray(translations) || translations.length === 0) {
        throw new Error('`translations` must be a non-empty array');
      }
      const ops: Array<{ index: number; patch: Record<string, unknown> }> = [];
      for (let i = 0; i < translations.length; i++) {
        const t = translations[i];
        if (!isRecord(t)) throw new Error(`translations[${i}] must be an object`);
        const idx = t.index;
        if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0) {
          throw new Error(`translations[${i}].index must be a non-negative integer`);
        }
        const patch: Record<string, unknown> = {};
        for (const field of ['headline', 'subtitle', 'freeText'] as const) {
          const v = t[field];
          if (v === undefined) continue;
          if (typeof v !== 'string') {
            throw new Error(`translations[${i}].${field} must be a string`);
          }
          patch[field] = wrapTextAsHtml(v);
        }
        if (Object.keys(patch).length === 0) {
          throw new Error(`translations[${i}] must include at least one of headline / subtitle / freeText`);
        }
        ops.push({ index: idx, patch });
      }
      const result = await client.patchLocaleScreensBatch(slug, code, ops);
      if (verbose === true) {
        return jsonContent(result);
      }
      return jsonContent({ success: true, savedAt: result.savedAt, applied: result.applied });
    },
  },
  {
    descriptor: {
      name: 'duplicate_screen_to_all_locales',
      description:
        'Copy the default-locale screen at `sourceIndex` into every ' +
        'configured locale\'s snapshot at the same index. Used after ' +
        'changing structural fields on the default (device frame, ' +
        'layout, background, composition) when you want the change to ' +
        'land on every translated set without reopening each locale. ' +
        'The locale\'s previous text + per-locale edits are overwritten ' +
        '— that\'s the contract. If you want to preserve translations, ' +
        'call `bulk_translate_locale` immediately after to re-apply the ' +
        'text. Returns the list of locale codes actually updated; ' +
        'locales whose snapshot is too short are skipped.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'sourceIndex'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          sourceIndex: { type: 'integer', minimum: 0 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'duplicate_screen_to_all_locales');
      const slug = requireSlug(a);
      const sourceIndex = a.sourceIndex;
      if (typeof sourceIndex !== 'number' || !Number.isInteger(sourceIndex) || sourceIndex < 0) {
        throw new Error('`sourceIndex` must be a non-negative integer');
      }
      const result = await client.broadcastScreenToLocales(slug, sourceIndex);
      return jsonContent(result);
    },
  },
  {
    descriptor: {
      name: 'get_locale_overrides',
      description:
        'Show which fields each screen in a locale explicitly overrides vs. ' +
        'inherits from the default. Returns per-screen lists of top-level ' +
        'keys that differ. Use before deciding whether to reset a locale or ' +
        'apply a uniform change across locales.',
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
      const a = requireRecord(args, 'get_locale_overrides');
      const slug = requireSlug(a);
      const code = requireString(a, 'code');
      if (code === 'default') {
        throw new Error('`code` must be a non-default locale');
      }
      const env = await client.getProjectEnvelope(slug);
      const data = env.data as Record<string, unknown>;
      const baseScreens = Array.isArray(data.screens) ? data.screens : [];
      const localeScreens = isRecord(data.localeScreens)
        ? (data.localeScreens as Record<string, unknown>)
        : {};
      const localeArr = localeScreens[code];
      if (!Array.isArray(localeArr)) {
        throw new Error(`locale "${code}" not found or has no screens`);
      }
      const screens = localeArr.map((localeScreen: unknown, i: number) => {
        const base = i < baseScreens.length ? baseScreens[i] : {};
        const overrides = diffKeys(
          isRecord(base) ? base : {},
          isRecord(localeScreen) ? localeScreen : {},
        );
        return { index: i, overrides };
      });
      return jsonContent({ locale: code, screens });
    },
  },
  {
    descriptor: {
      name: 'duplicate_locale',
      description:
        'Deep-copy all screens from one locale to a new locale code. The ' +
        'target must not already exist (409 if it does). Used for setting ' +
        'up regional variants like es-MX from es-ES, fr-CA from fr-FR. ' +
        'Source can be "default" to copy the base screens.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'fromCode', 'toCode'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          fromCode: { type: 'string', minLength: 1 },
          toCode: { type: 'string', minLength: 1 },
          label: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'duplicate_locale');
      const slug = requireSlug(a);
      const fromCode = requireString(a, 'fromCode');
      const toCode = requireString(a, 'toCode');
      const label = typeof a.label === 'string' && a.label.length > 0 ? a.label : undefined;
      const result = await client.duplicateLocale(slug, fromCode, toCode, label);
      return jsonContent(result);
    },
  },
];

function diffKeys(
  base: Record<string, unknown>,
  locale: Record<string, unknown>,
): string[] {
  const keys = new Set([...Object.keys(base), ...Object.keys(locale)]);
  const overrides: string[] = [];
  for (const key of keys) {
    if (key === 'id') continue;
    if (JSON.stringify(base[key]) !== JSON.stringify(locale[key])) {
      overrides.push(key);
    }
  }
  return overrides.sort();
}
