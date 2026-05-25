import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
  stripTagsFromHeadline,
} from './helpers.js';

// Read / describe / diff tools. Split out of screen.ts so the file
// that owns the write + render paths doesn't keep growing every time
// a new "inspect" helper lands. Everything here is read-only against
// the project envelope; nothing here touches disk or SSE.

export const screenInspectTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'get_screen',
      description:
        'Read one screen from the on-disk project envelope by index. ' +
        'Default returns the FULL editor-state shape (every per-screen ' +
        'field the UI persists — spotlight / loupe / callouts / ' +
        'annotations / overlays / per-text fonts and gradients / ' +
        'screenshot URL / etc). Pass `fields` as an array of dot-paths ' +
        '(e.g. `["headline", "headlineFont", "spotlight.x", "spotlight.y"]`) ' +
        'to return ONLY those fields — typical token saving 80-95% when ' +
        'you only need a few values.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          fields: {
            type: 'array',
            items: { type: 'string', minLength: 1 },
            minItems: 1,
          },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'get_screen');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const screen = await readScreen(client, slug, index);
      if (Array.isArray(a.fields) && a.fields.length > 0) {
        return jsonContent(pickFields(screen, a.fields as string[]));
      }
      return jsonContent(screen);
    },
  },
  {
    descriptor: {
      name: 'inspect_fonts',
      description:
        'Report which fonts a screen actually resolves to. For each ' +
        'text slot (headline / subtitle / freeText), returns the ' +
        'requested font id, the resolved id (after theme-level ' +
        'fallback), the human-readable name, and whether the id is ' +
        'present in the font catalog. Use after `render_preview` if ' +
        'you suspect a font fallback — e.g. if your headline was meant ' +
        "to be Anton but the glyphs don't look condensed.\n" +
        '\n' +
        'Note: this checks the REQUESTED font chain, not the actual ' +
        'browser-rendered glyphs. If your requested font is in the ' +
        'catalog but the rendered glyphs look wrong, that points to a ' +
        'real renderer bug — file an issue.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'inspect_fonts');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const screen = await readScreen(client, slug, index);
      const fonts = await client.listFonts();
      const catalog = new Map<string, { id: string; name: string }>();
      for (const f of fonts) {
        if (isRecord(f) && typeof f.id === 'string' && typeof f.name === 'string') {
          catalog.set(f.id, { id: f.id, name: f.name });
        }
      }

      const resolveSlot = (
        requested: unknown,
      ): {
        requested: string | null;
        resolved: string;
        name: string;
        inCatalog: boolean;
      } => {
        const req = typeof requested === 'string' ? requested : null;
        // Theme-level fallback chain matches what the engine does
        // (route preview.ts builds the same context). Without an
        // explicit per-element font, the engine uses context.font
        // which defaults to 'inter'.
        const resolved = req ?? 'inter';
        const entry = catalog.get(resolved);
        return {
          requested: req,
          resolved,
          name: entry?.name ?? resolved,
          inCatalog: entry !== undefined,
        };
      };

      return jsonContent({
        screen: index,
        headline: resolveSlot(screen.headlineFont),
        subtitle: resolveSlot(screen.subtitleFont),
        freeText: screen.freeTextEnabled === true
          ? resolveSlot(screen.freeTextFont)
          : { skipped: 'freeText not enabled on this screen' },
      });
    },
  },
  {
    descriptor: {
      name: 'describe_screen',
      description:
        'Natural-language summary of one screen — what fonts, what ' +
        'composition, what effects, what device frame, what background. ' +
        'Cheaper for an agent to reason about than parsing the full ' +
        'editor-state JSON returned by `get_screen`. Use this when you ' +
        'want to ask "what does screen N look like" without inspecting ' +
        'every field. The summary intentionally drops empty / default-' +
        'valued fields so the signal-to-noise ratio stays high.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'describe_screen');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const screen = await readScreen(client, slug, index);
      const description = formatScreenDescription(screen, index);
      return { content: [{ type: 'text', text: description }] };
    },
  },
  {
    descriptor: {
      name: 'describe_project',
      description:
        'Natural-language summary of EVERY screen in the project, one ' +
        'block per screen. Saves N round-trips compared to calling ' +
        'describe_screen N times. Use as the cheapest way to understand ' +
        '"what is this whole project set up to look like" before ' +
        'editing.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'describe_project');
      const slug = requireSlug(a);
      // Fetch the full envelope once, then describe each screen from
      // the loaded data instead of N readScreen calls.
      const env = await client.getProjectEnvelope(slug);
      const screens = isRecord(env.data) && Array.isArray(env.data.screens)
        ? env.data.screens
        : [];
      const blocks = screens.map((s, i) =>
        formatScreenDescription(isRecord(s) ? s : {}, i),
      );
      return {
        content: [
          {
            type: 'text',
            text: blocks.length === 0
              ? `Project "${slug}" has no screens yet.`
              : `Project "${slug}" — ${blocks.length} screen${blocks.length === 1 ? '' : 's'}:\n\n` + blocks.join('\n\n'),
          },
        ],
      };
    },
  },
  {
    descriptor: {
      name: 'diff_screens',
      description:
        'Compare two screens of the same project and return a structured ' +
        'diff. Useful for: "what differs between variant A\'s screen 0 ' +
        'and variant B\'s screen 0", "which fields drift between locale ' +
        'screens", or "what did I just change". Returns `{ identical, ' +
        'changedKeys, changed: { <path>: { a, b } } }` where each path ' +
        'is a dot-path into the screen object (e.g. `headlineFont`, ' +
        '`spotlight.x`). Arrays (`callouts`, `annotations`, `overlays`) ' +
        'are compared atomically — if any element differs, the whole ' +
        'array is reported as one entry. Use `get_screen` with the ' +
        'reported path if you need to drill into a specific element.\n' +
        '\n' +
        '`fields` (optional) restricts the comparison to the listed ' +
        'top-level keys, useful for "did the typography change between ' +
        'these screens" without picking up unrelated noise.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'indexA', 'indexB'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          indexA: { type: 'integer', minimum: 0 },
          indexB: { type: 'integer', minimum: 0 },
          fields: {
            type: 'array',
            items: { type: 'string', minLength: 1 },
            minItems: 1,
          },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'diff_screens');
      const slug = requireSlug(a);
      const { indexA, indexB } = a;
      if (typeof indexA !== 'number' || !Number.isInteger(indexA) || indexA < 0) {
        throw new Error('`indexA` must be a non-negative integer');
      }
      if (typeof indexB !== 'number' || !Number.isInteger(indexB) || indexB < 0) {
        throw new Error('`indexB` must be a non-negative integer');
      }
      // Two single-screen reads in parallel — ~4 KB total instead of
      // one ~40 KB envelope fetch. The endpoint itself reports
      // out-of-bounds with a clear error so we don't need to load the
      // full screens array up front for length checking.
      const [resA, resB] = await Promise.all([
        client.readScreen(slug, indexA),
        client.readScreen(slug, indexB),
      ]);
      const a0 = isRecord(resA.screen) ? resA.screen : {};
      const b0 = isRecord(resB.screen) ? resB.screen : {};
      const fields = Array.isArray(a.fields) && a.fields.length > 0
        ? (a.fields as string[])
        : null;
      const changed = diffScreens(a0, b0, fields);
      const changedKeys = Object.keys(changed);
      return jsonContent({
        slug,
        indexA,
        indexB,
        identical: changedKeys.length === 0,
        changedKeys,
        changed,
      });
    },
  },
];

// Pick a subset of fields from a record by dot-path. Each path can
// navigate into nested objects (e.g. "spotlight.x") or array elements
// by index ("callouts.0.id"). Missing paths are silently skipped (the
// agent gets back only the paths that exist). Returns a flat object
// where keys are the original paths and values are the resolved leaf
// values — flat-keyed avoids the agent having to walk the shape to
// reassemble nested structures.
function pickFields(source: Record<string, unknown>, paths: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const path of paths) {
    const parts = path.split('.');
    let cur: unknown = source;
    let found = true;
    for (const part of parts) {
      if (cur === null || cur === undefined) {
        found = false;
        break;
      }
      if (Array.isArray(cur)) {
        const idx = Number(part);
        if (!Number.isInteger(idx) || idx < 0 || idx >= cur.length) {
          found = false;
          break;
        }
        cur = cur[idx];
      } else if (typeof cur === 'object') {
        cur = (cur as Record<string, unknown>)[part];
      } else {
        found = false;
        break;
      }
    }
    if (found && cur !== undefined) out[path] = cur;
  }
  return out;
}

// Structural diff between two screen objects. Walks nested plain
// objects emitting dot-paths (e.g. `spotlight.x`) for any leaf that
// differs. Arrays are treated as atomic — they either match (same JSON)
// or the whole array shows up in the diff. This keeps the output bounded
// even when callouts / annotations / overlays differ by many elements;
// the agent can re-query specific indices via `get_screen` if needed.
// `restrict`, when non-null, limits the walk to those top-level keys.
export function diffScreens(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  restrict: string[] | null = null,
): Record<string, { a: unknown; b: unknown }> {
  const out: Record<string, { a: unknown; b: unknown }> = {};
  const keys = new Set<string>();
  for (const k of Object.keys(a)) if (!restrict || restrict.includes(k)) keys.add(k);
  for (const k of Object.keys(b)) if (!restrict || restrict.includes(k)) keys.add(k);
  for (const key of keys) {
    walk(a[key], b[key], key, out);
  }
  return out;
}

function walk(
  a: unknown,
  b: unknown,
  path: string,
  out: Record<string, { a: unknown; b: unknown }>,
): void {
  if (a === b) return;
  // Arrays are atomic per the tool contract — short-circuit to a JSON
  // equality check so identical-but-different-reference arrays don't
  // get flagged.
  if (Array.isArray(a) || Array.isArray(b)) {
    if (JSON.stringify(a) !== JSON.stringify(b)) out[path] = { a, b };
    return;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      walk(a[key], b[key], `${path}.${key}`, out);
    }
    return;
  }
  // Mixed types or both primitives that differ — record the leaf.
  out[path] = { a, b };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Natural-language summary for `describe_screen`. Reads defensively
// against the rich editor-state shape — every field is optional. Lines
// for default-valued sections are dropped so the agent sees signal
// over noise; the goal is "what's distinctive about THIS screen", not
// a JSON dump.
function formatScreenDescription(screen: Record<string, unknown>, index: number): string {
  const lines: string[] = [`Screen ${index}`];

  const truncate = (s: string, max: number): string =>
    s.length > max ? s.slice(0, max - 1) + '…' : s;

  const headline = typeof screen.headline === 'string' ? stripTagsFromHeadline(screen.headline) : '';
  if (headline) {
    const font = typeof screen.headlineFont === 'string' ? screen.headlineFont : '(theme default)';
    const sizeBits: string[] = [];
    if (typeof screen.headlineSize === 'number') sizeBits.push(`${screen.headlineSize}px`);
    if (typeof screen.headlineFontWeight === 'number') sizeBits.push(`weight ${screen.headlineFontWeight}`);
    if (typeof screen.headlineRotation === 'number' && screen.headlineRotation !== 0) {
      sizeBits.push(`${screen.headlineRotation}° rotation`);
    }
    const tail = sizeBits.length > 0 ? ` (${sizeBits.join(', ')})` : '';
    lines.push(`  Headline: "${truncate(headline, 80)}" — ${font}${tail}`);
    if (isRecord(screen.headlineGradient)) {
      const colors = Array.isArray(screen.headlineGradient.colors)
        ? screen.headlineGradient.colors.join(' → ')
        : '';
      if (colors) lines.push(`    gradient: ${colors}`);
    }
    if (isRecord(screen.headlineShadow) && screen.headlineShadow.enabled === true) {
      lines.push(`    shadow enabled`);
    }
  }

  const subtitle = typeof screen.subtitle === 'string' ? stripTagsFromHeadline(screen.subtitle) : '';
  if (subtitle) {
    const font = typeof screen.subtitleFont === 'string' ? screen.subtitleFont : '(theme default)';
    lines.push(`  Subtitle: "${truncate(subtitle, 80)}" — ${font}`);
  }

  const freeText = typeof screen.freeText === 'string' ? stripTagsFromHeadline(screen.freeText) : '';
  if (screen.freeTextEnabled === true && freeText) {
    const font = typeof screen.freeTextFont === 'string' ? screen.freeTextFont : '(theme default)';
    lines.push(`  Free text: "${truncate(freeText, 80)}" — ${font}`);
  }

  const layer = (field: 'headlineLayer' | 'subtitleLayer' | 'freeTextLayer'): string | null => {
    const v = screen[field];
    if (typeof v === 'string' && v !== 'default') return v;
    return null;
  };
  const layerNotes: string[] = [];
  for (const f of ['headlineLayer', 'subtitleLayer', 'freeTextLayer'] as const) {
    const v = layer(f);
    if (v) layerNotes.push(`${f.replace('Layer', '')}: ${v}`);
  }
  if (layerNotes.length > 0) lines.push(`  Text layers: ${layerNotes.join(', ')}`);

  const composition = typeof screen.composition === 'string' ? screen.composition : 'single';
  const frameId = typeof screen.frameId === 'string' ? screen.frameId : '(unset)';
  const deviceBits = [`composition: ${composition}`, `frame: ${frameId}`];
  if (typeof screen.deviceTop === 'number' && screen.deviceTop !== 0) {
    deviceBits.push(`top: ${screen.deviceTop}%`);
  }
  if (typeof screen.deviceScale === 'number' && screen.deviceScale !== 100) {
    deviceBits.push(`scale: ${screen.deviceScale}%`);
  }
  if (typeof screen.deviceRotation === 'number' && screen.deviceRotation !== 0) {
    deviceBits.push(`rotation: ${screen.deviceRotation}°`);
  }
  lines.push(`  Device: ${deviceBits.join(', ')}`);

  const bgType = typeof screen.backgroundType === 'string' ? screen.backgroundType : 'preset';
  const bgBits = [bgType];
  if (bgType === 'solid' && typeof screen.backgroundColor === 'string') {
    bgBits.push(screen.backgroundColor);
  }
  if (bgType === 'gradient' && isRecord(screen.backgroundGradient)) {
    const colors = Array.isArray(screen.backgroundGradient.colors)
      ? screen.backgroundGradient.colors.join(' → ')
      : '';
    if (colors) bgBits.push(colors);
  }
  if (bgType === 'image') {
    bgBits.push('uploaded image');
  }
  lines.push(`  Background: ${bgBits.join(' — ')}`);

  const screenshot = typeof screen.screenshotName === 'string' ? screen.screenshotName : null;
  if (screenshot) lines.push(`  Screenshot: ${screenshot}`);

  const effects: string[] = [];
  if (screen.spotlightEnabled === true) effects.push('spotlight');
  if (screen.loupeEnabled === true) effects.push('loupe');
  if (isRecord(screen.borderSimulation) && screen.borderSimulation.enabled === true) {
    effects.push('border simulation');
  }
  if (isRecord(screen.deviceShadow)) effects.push('device shadow');
  if (effects.length > 0) lines.push(`  Effects: ${effects.join(', ')}`);

  const counts: string[] = [];
  if (Array.isArray(screen.callouts) && screen.callouts.length > 0) {
    counts.push(`${screen.callouts.length} callout${screen.callouts.length === 1 ? '' : 's'}`);
  }
  if (Array.isArray(screen.annotations) && screen.annotations.length > 0) {
    counts.push(`${screen.annotations.length} annotation${screen.annotations.length === 1 ? '' : 's'}`);
  }
  if (Array.isArray(screen.overlays) && screen.overlays.length > 0) {
    counts.push(`${screen.overlays.length} overlay${screen.overlays.length === 1 ? '' : 's'}`);
  }
  if (counts.length > 0) lines.push(`  Elements: ${counts.join(', ')}`);

  return lines.join('\n');
}
