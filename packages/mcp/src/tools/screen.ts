import sharp from 'sharp';
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

export const screenTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'render_preview',
      description:
        'Capture PNG snapshots of one or more screens as they currently ' +
        'render in the live preview. Returns image content the agent ' +
        'can directly see (the MCP host displays each inline). Uses the ' +
        'same modern-screenshot pipeline the user\'s exports use — what ' +
        'you see is what the user would download.\n' +
        '\n' +
        'Pass exactly one of:\n' +
        '  • `index` — render one specific screen, returns one image\n' +
        '  • `indices` — array of screen indices, returns one image per ' +
        'screen in the same order\n' +
        '  • neither — renders ALL screens of the active project in ' +
        'order, returns one image per screen\n' +
        '\n' +
        'Each screen renders via its own browser round-trip (~0.4-0.6s ' +
        'each, sequential). Requires the browser preview tab open at ' +
        'http://localhost:4400. Ephemeral — nothing is written to the ' +
        "user's disk. `width` (optional, default 800px) controls render " +
        'width; height scales to preserve aspect ratio. `locale` ' +
        '(optional) overrides which locale to render.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          indices: {
            type: 'array',
            items: { type: 'integer', minimum: 0 },
            minItems: 1,
          },
          locale: { type: 'string', minLength: 1 },
          width: { type: 'integer', minimum: 100, maximum: 4000 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'render_preview');
      const slug = requireSlug(a);
      const { index, indices, locale, width } = a;
      if (index !== undefined && indices !== undefined) {
        throw new Error('Pass `index` (single) OR `indices` (multi), not both');
      }
      // Resolve the list of screen indices to render. Without either arg
      // we render every screen — fetched once from the live config so
      // the agent doesn't have to count first.
      let targets: number[];
      if (typeof index === 'number') {
        targets = [index];
      } else if (Array.isArray(indices)) {
        for (const i of indices) {
          if (typeof i !== 'number' || !Number.isInteger(i) || i < 0) {
            throw new Error('`indices` must be an array of non-negative integers');
          }
        }
        targets = indices;
      } else {
        const project = await client.getProject();
        targets = project.screens.map((_, i) => i);
      }
      // Parallel up to RENDER_CONCURRENCY since the browser uses an
      // iframe pool internally. Order of the returned content[] still
      // matches `targets` so the agent gets predictable indexing.
      const RENDER_CONCURRENCY = 3;
      const results: ({ type: 'image'; mimeType: string; data: string } | undefined)[] =
        new Array(targets.length).fill(undefined);
      let cursor = 0;
      async function worker(): Promise<void> {
        while (true) {
          const slot = cursor++;
          if (slot >= targets.length) return;
          const target = targets[slot]!;
          const result = await client.renderPreview({
            slug,
            index: target,
            locale: typeof locale === 'string' ? locale : undefined,
            width: typeof width === 'number' ? width : undefined,
          });
          const dataUrl = result.dataUrl;
          const comma = dataUrl.indexOf(',');
          const meta = dataUrl.slice(0, comma);
          const data = dataUrl.slice(comma + 1);
          const mimeMatch = meta.match(/^data:([^;]+)(?:;base64)?$/);
          const mimeType = mimeMatch?.[1] ?? 'image/png';
          results[slot] = { type: 'image', mimeType, data };
        }
      }
      const workers = Array.from(
        { length: Math.min(RENDER_CONCURRENCY, targets.length) },
        () => worker(),
      );
      await Promise.all(workers);
      return { content: results as { type: 'image'; mimeType: string; data: string }[] };
    },
  },
  {
    descriptor: {
      name: 'render_preview_grid',
      description:
        'Like `render_preview` but composites every requested screen ' +
        'into a SINGLE image (rows x columns). Returns one image content ' +
        'block instead of N. Useful when the agent wants to see the full ' +
        'set at a glance without burning N images worth of context. The ' +
        'composite is ordered left-to-right, top-to-bottom matching the ' +
        'screen order in the project.\n' +
        '\n' +
        '`columns` (optional, default 3) controls the grid width. ' +
        '`screenWidth` (optional, default 400) is the per-screen render ' +
        'width; total composite width is `columns * screenWidth + ' +
        'padding`. `indices` (optional) renders a subset; without it, ' +
        'all screens are rendered.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          indices: {
            type: 'array',
            items: { type: 'integer', minimum: 0 },
            minItems: 1,
          },
          locale: { type: 'string', minLength: 1 },
          columns: { type: 'integer', minimum: 1, maximum: 6 },
          screenWidth: { type: 'integer', minimum: 100, maximum: 2000 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'render_preview_grid');
      const slug = requireSlug(a);
      const { indices, locale, columns, screenWidth } = a;
      const cols = typeof columns === 'number' ? columns : 3;
      const width = typeof screenWidth === 'number' ? screenWidth : 400;
      const PAD = 16; // pixels between cells

      let targets: number[];
      if (Array.isArray(indices)) {
        for (const i of indices) {
          if (typeof i !== 'number' || !Number.isInteger(i) || i < 0) {
            throw new Error('`indices` must be an array of non-negative integers');
          }
        }
        targets = indices;
      } else {
        const project = await client.getProject();
        targets = project.screens.map((_, i) => i);
      }

      // Render every cell in parallel up to the iframe-pool concurrency.
      // Same worker pattern as render_preview — order of pngBuffers
      // matches `targets`.
      const RENDER_CONCURRENCY = 3;
      const pngBuffers: (Buffer | undefined)[] = new Array(targets.length).fill(undefined);
      let cursor = 0;
      async function worker(): Promise<void> {
        while (true) {
          const slot = cursor++;
          if (slot >= targets.length) return;
          const target = targets[slot]!;
          const result = await client.renderPreview({
            slug,
            index: target,
            locale: typeof locale === 'string' ? locale : undefined,
            width,
          });
          const comma = result.dataUrl.indexOf(',');
          pngBuffers[slot] = Buffer.from(result.dataUrl.slice(comma + 1), 'base64');
        }
      }
      const workers = Array.from(
        { length: Math.min(RENDER_CONCURRENCY, targets.length) },
        () => worker(),
      );
      await Promise.all(workers);

      // Measure the first cell to determine height. All cells should
      // render to the same canvas height since they share the platform
      // aspect ratio, but read each one's actual height to be safe.
      const cellMetas = await Promise.all(
        pngBuffers.map(async (buf) => {
          if (!buf) throw new Error('render returned empty buffer');
          const { width: w, height: h } = await sharp(buf).metadata();
          return { buf, width: w ?? width, height: h ?? width };
        }),
      );
      const cellHeight = Math.max(...cellMetas.map((m) => m.height));
      const rows = Math.ceil(targets.length / cols);
      const compositeWidth = cols * width + (cols + 1) * PAD;
      const compositeHeight = rows * cellHeight + (rows + 1) * PAD;

      const overlays = cellMetas.map((meta, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          input: meta.buf,
          top: PAD + row * (cellHeight + PAD),
          left: PAD + col * (width + PAD),
        };
      });

      const composite = await sharp({
        create: {
          width: compositeWidth,
          height: compositeHeight,
          channels: 4,
          background: { r: 240, g: 240, b: 240, alpha: 1 },
        },
      })
        .composite(overlays)
        .png()
        .toBuffer();

      return {
        content: [
          {
            type: 'image' as const,
            mimeType: 'image/png',
            data: composite.toString('base64'),
          },
        ],
      };
    },
  },
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
      name: 'batch_patch_screens',
      description:
        'Apply many screen patches in one disk write + one SSE broadcast. ' +
        '`ops` is an array of `{ index, patch }` — each `patch` is the ' +
        'same shallow-merge editor-state shape as `patch_screen`. The ' +
        'batch is atomic: any malformed op fails the whole call (no ' +
        'partial writes). Use when the agent has decided multiple ' +
        'screen edits at once (e.g. "set all 6 headlines", "color all ' +
        'screens differently") — much cheaper than calling patch_screen ' +
        'N times. Ops apply in array order.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'ops'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          ops: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['index', 'patch'],
              properties: {
                index: { type: 'integer', minimum: 0 },
                patch: { type: 'object' },
              },
              additionalProperties: false,
            },
          },
          // Token efficiency: when false, response omits the full
          // merged screens and returns only { savedAt, applied }.
          // Defaults to true for backwards compatibility.
          verbose: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'batch_patch_screens');
      const slug = requireSlug(a);
      const { ops, verbose } = a;
      if (!Array.isArray(ops) || ops.length === 0) {
        throw new Error('`ops` must be a non-empty array');
      }
      const validated: Array<{ index: number; patch: Record<string, unknown> }> = [];
      for (const op of ops) {
        if (!isRecord(op)) throw new Error('each op must be an object');
        const { index, patch } = op;
        if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
          throw new Error('each op.index must be a non-negative integer');
        }
        if (!isRecord(patch)) throw new Error('each op.patch must be an object');
        validated.push({ index, patch });
      }
      const result = await client.patchScreensBatch(slug, validated);
      if (verbose === false) {
        return jsonContent({ savedAt: result.savedAt, applied: result.applied });
      }
      return jsonContent(result);
    },
  },
  {
    descriptor: {
      name: 'patch_screen',
      description:
        'Update one screen of the active project envelope on disk. The ' +
        'patch is in EDITOR-STATE shape (the same rich fields the UI ' +
        'persists): headline, subtitle, frameId, deviceScale, deviceTop, ' +
        'deviceAngle, backgroundType ("solid"|"gradient"|"image"), ' +
        'backgroundColor, backgroundGradient, spotlightEnabled, spotlight ' +
        '({x,y,w,h,shape,dimOpacity,blur,borderRadius}), loupeEnabled, ' +
        'loupe ({sourceX,sourceY,displayX,displayY,width,height,zoom,...}), ' +
        'callouts ([{sourceX,sourceY,sourceW,sourceH,displayX,displayY,...}]), ' +
        'borderSimulation, headlineFont, headlineFontWeight, headlineSize, ' +
        'headlineGradient, etc. ' +
        'Shallow-merged at the top level: any key present replaces the ' +
        "screen's value wholesale (to change one spotlight field, send the " +
        'full spotlight object). Call `get_project` to see the current ' +
        'shape. Server writes atomically + broadcasts SSE so the browser ' +
        'preview refreshes instantly. Use the slug from `get_active_project`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'patch'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          patch: {
            type: 'object',
            description:
              'Partial ScreenState (editor-state shape). Top-level fields ' +
              "in `patch` replace the screen's matching fields wholesale.",
          },
          // Token efficiency: when false, response is {savedAt} instead
          // of the full merged screen (~2 KB → ~50 bytes). Default true
          // for backwards compatibility.
          verbose: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'patch_screen');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { patch, verbose } = a;
      if (!isRecord(patch)) {
        throw new Error('`patch` must be an object of editor-state screen fields');
      }
      const result = await client.patchScreen(slug, index, patch);
      if (verbose === false) {
        return jsonContent({ savedAt: result.savedAt });
      }
      return jsonContent(result.screen);
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

