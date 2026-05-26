import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  normalizeColor,
  requireRecord,
  requireSlug,
  requireString,
  unknownIdError,
} from './helpers.js';

// Theme-level fields are not stored on the project envelope directly:
// `editorState.ts` derives `theme.font` / `theme.colors` / etc. from
// `screens[0]` on read. So a "theme" tool is really a broadcast — set
// the same field on every screen in one atomic write + one SSE event,
// instead of forcing the agent to issue N patch_screen / batch ops.
//
// All theme tools route through `patchScreensBatch` so the disk write
// stays atomic and the browser sees one project-changed event.

const COLOR_KEYS = ['primary', 'secondary', 'background', 'text', 'subtitle', 'freeText'] as const;
type ColorKey = (typeof COLOR_KEYS)[number];

export const projectThemeTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'set_theme_font',
      description:
        'Set the font on EVERY screen of the project in one atomic ' +
        'write. Broadcast helper: replaces `font` (the screen-level ' +
        'default) plus the three per-slot overrides ' +
        '(`headlineFont` / `subtitleFont` / `freeTextFont`) so the new ' +
        'font wins regardless of which slot the renderer reads. Pass ' +
        '`slots` to limit which overrides get written (default: all ' +
        'three). `font` must be a valid id from `list_fonts`. Optional ' +
        '`weight` (100-900) writes `fontWeight` and the matching per-' +
        'slot weight field — use when changing to a font whose default ' +
        "weight differs from the current value. Saves N round-trips " +
        'compared to batch_patch_screens for the common "all 6 screens, ' +
        'same font" case.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'font'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          font: { type: 'string', minLength: 1 },
          weight: { type: 'integer', minimum: 100, maximum: 900 },
          slots: {
            type: 'array',
            minItems: 1,
            items: { enum: ['headline', 'subtitle', 'freeText'] },
          },
          verbose: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_theme_font');
      const slug = requireSlug(a);
      const font = requireString(a, 'font');
      const weight = typeof a.weight === 'number' ? a.weight : undefined;
      const verbose = a.verbose;

      const fonts = await client.listFonts();
      const fontIds = new Set<string>();
      for (const f of fonts) {
        if (isRecord(f) && typeof f.id === 'string') fontIds.add(f.id);
      }
      if (!fontIds.has(font)) {
        throw unknownIdError('font', font, fontIds, 'Call `list_fonts` to see valid ids.');
      }

      const slots = Array.isArray(a.slots) && a.slots.length > 0
        ? (a.slots as string[])
        : ['headline', 'subtitle', 'freeText'];
      for (const s of slots) {
        if (s !== 'headline' && s !== 'subtitle' && s !== 'freeText') {
          throw new Error(`invalid slot "${s}" — must be one of headline / subtitle / freeText`);
        }
      }

      const patch: Record<string, unknown> = { font };
      if (weight !== undefined) patch.fontWeight = weight;
      for (const slot of slots) {
        patch[`${slot}Font`] = font;
        if (weight !== undefined) patch[`${slot}FontWeight`] = weight;
      }

      const env = await client.getProjectEnvelope(slug);
      const screens = isRecord(env.data) && Array.isArray(env.data.screens)
        ? env.data.screens
        : [];
      if (screens.length === 0) {
        throw new Error(`project "${slug}" has no screens to apply theme font to`);
      }
      const ops = screens.map((_, index) => ({ index, patch }));
      const result = await client.patchScreensBatch(slug, ops);
      if (verbose === true) {
        return jsonContent(result);
      }
      return jsonContent({
        success: true,
        savedAt: result.savedAt,
        applied: result.applied,
        font,
        slots,
        weight: weight ?? null,
      });
    },
  },
  {
    descriptor: {
      name: 'set_theme_colors',
      description:
        'Update the color palette on EVERY screen in one atomic write. ' +
        '`colors` is a partial map of `{ primary?, secondary?, ' +
        'background?, text?, subtitle?, freeText? }` — only the keys ' +
        'you pass are written, and each is shallow-merged into the ' +
        "screen's existing `colors` object so unspecified slots stay " +
        'put. Values must be hex (`#rrggbb`) or display-p3 strings; the ' +
        'server normalises via toDisplayP3 the same way set_background ' +
        'does. Broadcast helper for the common "rebrand all 6 screens" ' +
        'case — single SSE event, single disk write.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'colors'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          colors: {
            type: 'object',
            properties: {
              primary: { type: 'string', minLength: 1 },
              secondary: { type: 'string', minLength: 1 },
              background: { type: 'string', minLength: 1 },
              text: { type: 'string', minLength: 1 },
              subtitle: { type: 'string', minLength: 1 },
              freeText: { type: 'string', minLength: 1 },
            },
            additionalProperties: false,
          },
          verbose: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_theme_colors');
      const slug = requireSlug(a);
      const colorsArg = a.colors;
      const verbose = a.verbose;
      if (!isRecord(colorsArg)) {
        throw new Error('`colors` must be an object of slot -> color string');
      }
      const normalised: Partial<Record<ColorKey, string>> = {};
      for (const key of COLOR_KEYS) {
        const v = colorsArg[key];
        if (v === undefined) continue;
        if (typeof v !== 'string' || v.length === 0) {
          throw new Error(`\`colors.${key}\` must be a non-empty color string`);
        }
        normalised[key] = normalizeColor(v);
      }
      if (Object.keys(normalised).length === 0) {
        throw new Error('`colors` must contain at least one of: ' + COLOR_KEYS.join(', '));
      }

      const env = await client.getProjectEnvelope(slug);
      const screens = isRecord(env.data) && Array.isArray(env.data.screens)
        ? env.data.screens
        : [];
      if (screens.length === 0) {
        throw new Error(`project "${slug}" has no screens to apply theme colors to`);
      }
      // Shallow-merge per-screen so we don't blow away a slot that
      // wasn't named in `colors`. patchScreen replaces top-level fields
      // wholesale, so the merge has to happen here.
      const ops = screens.map((s, index) => {
        const existing = isRecord(s) && isRecord(s.colors) ? s.colors : {};
        return {
          index,
          patch: { colors: { ...existing, ...normalised } },
        };
      });
      const result = await client.patchScreensBatch(slug, ops);
      if (verbose === true) {
        return jsonContent(result);
      }
      return jsonContent({
        success: true,
        savedAt: result.savedAt,
        applied: result.applied,
        colors: normalised,
      });
    },
  },
];
