import sharp from 'sharp';
import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  requireIndex,
  requireRecord,
  requireSlug,
  stripTagsFromHeadline,
} from './helpers.js';

// Core render + write tools. Read/describe/diff tools live in
// screen-inspect.ts; ergonomic per-field setters live in their domain
// files (screen-text, screen-device, ...). Keep this file scoped to
// "things that either paint pixels or write the envelope".

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
        'all screens are rendered. `labels` (optional, default false) ' +
        'adds a small caption strip under each cell showing the screen ' +
        'index and a truncated headline — handy when the agent renders ' +
        'multiple screens and wants to refer to them by number later.',
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
          labels: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'render_preview_grid');
      const slug = requireSlug(a);
      const { indices, locale, columns, screenWidth, labels } = a;
      const cols = typeof columns === 'number' ? columns : 3;
      const width = typeof screenWidth === 'number' ? screenWidth : 400;
      const PAD = 16; // pixels between cells
      const LABEL_HEIGHT = 36; // pixels under each cell when labels=true
      const labelsOn = labels === true;

      let targets: number[];
      // Headlines are only fetched when labels are on; the envelope read
      // is the same one render_preview_grid already needed for the
      // default "render all" case, so when labelsOn we just take both
      // pieces from the same fetch.
      const headlines: Record<number, string> = {};
      if (Array.isArray(indices)) {
        for (const i of indices) {
          if (typeof i !== 'number' || !Number.isInteger(i) || i < 0) {
            throw new Error('`indices` must be an array of non-negative integers');
          }
        }
        targets = indices;
        if (labelsOn) {
          const env = await client.getProjectEnvelope(slug);
          const screens = isRecord(env.data) && Array.isArray(env.data.screens)
            ? env.data.screens
            : [];
          for (const idx of targets) {
            const s = screens[idx];
            if (isRecord(s)) headlines[idx] = stripTagsFromHeadline(s.headline);
          }
        }
      } else {
        // Use the envelope for both targets AND headlines when labelsOn
        // so we don't double-fetch.
        if (labelsOn) {
          const env = await client.getProjectEnvelope(slug);
          const screens = isRecord(env.data) && Array.isArray(env.data.screens)
            ? env.data.screens
            : [];
          targets = screens.map((_, i) => i);
          for (let i = 0; i < screens.length; i++) {
            const s = screens[i];
            if (isRecord(s)) headlines[i] = stripTagsFromHeadline(s.headline);
          }
        } else {
          const project = await client.getProject();
          targets = project.screens.map((_, i) => i);
        }
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
      const slotHeight = labelsOn ? cellHeight + LABEL_HEIGHT : cellHeight;
      const rows = Math.ceil(targets.length / cols);
      const compositeWidth = cols * width + (cols + 1) * PAD;
      const compositeHeight = rows * slotHeight + (rows + 1) * PAD;

      const overlays: { input: Buffer; top: number; left: number }[] = [];
      for (let i = 0; i < cellMetas.length; i++) {
        const meta = cellMetas[i]!;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const slotTop = PAD + row * (slotHeight + PAD);
        const slotLeft = PAD + col * (width + PAD);
        overlays.push({ input: meta.buf, top: slotTop, left: slotLeft });
        if (labelsOn) {
          const targetIdx = targets[i]!;
          const headline = headlines[targetIdx] ?? '';
          const labelSvg = renderLabelSvg(targetIdx, headline, width, LABEL_HEIGHT);
          overlays.push({
            input: Buffer.from(labelSvg),
            top: slotTop + cellHeight,
            left: slotLeft,
          });
        }
      }

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

// Render a single label strip for render_preview_grid as SVG. Sharp
// composites SVG buffers natively (librsvg under the hood), so we
// avoid pulling in a font renderer just for grid captions. Headline
// text is truncated to fit roughly `width / 9` characters at the
// chosen 13px size; XML-escaped to keep angle brackets / ampersands
// from breaking the SVG parser.
function renderLabelSvg(
  index: number,
  headline: string,
  width: number,
  height: number,
): string {
  const maxChars = Math.max(8, Math.floor(width / 9) - 6);
  const truncated = headline.length > maxChars ? headline.slice(0, maxChars - 1) + '…' : headline;
  const label = `#${index} - ${truncated}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<rect width="${width}" height="${height}" fill="#1f2937"/>` +
    `<text x="${Math.floor(width / 2)}" y="${Math.floor(height / 2) + 5}" ` +
    `font-family="-apple-system, system-ui, sans-serif" font-size="13" ` +
    `fill="#f3f4f6" text-anchor="middle">${escapeXml(label)}</text>` +
    `</svg>`
  );
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
