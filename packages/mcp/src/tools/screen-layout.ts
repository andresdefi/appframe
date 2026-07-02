import type { AppframeClient } from '../client.js';
import type { ToolDefinition } from './types.js';
import { canvasDimensionsFor, measureText, estimateDeviceBounds } from '../measure.js';
import {
  isRecord,
  jsonContent,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
  requireString,
  stripTagsFromHeadline,
} from './helpers.js';

// Fetch the project's render canvas dimensions in physical pixels for
// the platform/size set via set_export_size. Layout-prediction tools
// need this so an iPad headline budget isn't measured against an
// iPhone canvas. Reads the envelope once per call — cheap, and
// keeps the three tools consistent.
async function projectCanvas(
  client: AppframeClient,
  slug: string,
): Promise<{ width: number; height: number }> {
  const env = await client.getProjectEnvelope(slug);
  const exportSize = isRecord(env.data) ? env.data.exportSize : undefined;
  return canvasDimensionsFor(exportSize);
}

export const screenLayoutTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'auto_fit_headline',
      description:
        'Binary-search the largest headline font size that fits the ' +
        'headline text inside the screen\'s text area within `maxLines` ' +
        '(default 2). Uses fontkit to measure the actual glyph widths ' +
        'of the screen\'s headlineFont — no browser round-trip, ~10ms. ' +
        '\n\n' +
        'Note: `headlineSize` is in the engine\'s 1290px reference ' +
        'frame (templates/engine.ts) — the renderer scales it ' +
        'proportionally to the actual canvas, so the same headlineSize ' +
        'fits the same on iPhone, iPad, or Mac. The suggestion does NOT ' +
        'change per platform.\n\n' +
        'Returns the suggested size + the measurement (wrappedWidth, ' +
        'lineCount, height). Pass `apply: true` to also write it to ' +
        '`headlineSize` via patch_screen. `text` (optional) lets you ' +
        'try a hypothetical headline without changing the screen.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          text: { type: 'string' },
          maxLines: { type: 'integer', minimum: 1, maximum: 6 },
          apply: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'auto_fit_headline');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const screen = await readScreen(client, slug, index);
      const text = typeof a.text === 'string'
        ? a.text
        : stripTagsFromHeadline(screen.headline);
      if (!text) throw new Error('No headline text to fit. Pass `text` or set screen.headline first.');
      const maxLines = typeof a.maxLines === 'number' ? a.maxLines : 2;
      const fontId = typeof screen.headlineFont === 'string' ? screen.headlineFont : 'inter';
      const fontWeight = typeof screen.headlineFontWeight === 'number' ? screen.headlineFontWeight : 700;
      // Canvas dimensions: read from the project's exportSize via
      // STORE_SIZES, falling back to iPhone 6.9 (1320 x 2868). iPad /
      // Mac targets have very different widths so reading the actual
      // size matters for binary-search accuracy.
      const { width: canvasWidth } = await projectCanvas(client, slug);
      // Text area width: canvas * (1 - 2 * padding). Padding default
      // 0.075 → 85% of canvas. See presetTextAreaPadding in core.
      const availableWidth = canvasWidth * 0.85;
      // Binary search font size between min (12px) and max (300px).
      let lo = 12;
      let hi = 300;
      let best = lo;
      let bestMetrics: ReturnType<typeof measureText> | null = null;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const metrics = measureText({
          text,
          fontId,
          fontSize: mid,
          fontWeight,
          maxWidth: availableWidth,
        });
        if (metrics.lineCount <= maxLines && metrics.wrappedWidth <= availableWidth) {
          best = mid;
          bestMetrics = metrics;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (a.apply === true) {
        await client.patchScreen(slug, index, { headlineSize: best });
      }
      return jsonContent({
        suggestedSize: best,
        applied: a.apply === true,
        measuredAt: bestMetrics,
        font: fontId,
        availableWidth,
        maxLines,
      });
    },
  },
  {
    descriptor: {
      name: 'check_text_overlap',
      description:
        'Estimate whether the headline text overlaps the device frame ' +
        'on the canvas. Computes headline bounds from the current ' +
        'headlineSize + position, estimates device bounds from ' +
        'deviceTop / deviceScale / deviceOffsetX, returns intersection ' +
        'info. Approximation: device height is estimated from a typical ' +
        'phone aspect ratio (2:1). Canvas aspect ratio comes from the ' +
        'project\'s `exportSize` so iPad (more square) reports a larger ' +
        'vertical-% for the same text than iPhone — useful when a ' +
        'layout that works on phone overlaps the device on tablet. Use ' +
        'this as a pre-render sanity check before the user notices ' +
        'the visual collision.',
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
      const a = requireRecord(args, 'check_text_overlap');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const screen = await readScreen(client, slug, index);
      const text = stripTagsFromHeadline(screen.headline);
      const fontId = typeof screen.headlineFont === 'string' ? screen.headlineFont : 'inter';
      const fontWeight = typeof screen.headlineFontWeight === 'number' ? screen.headlineFontWeight : 700;
      const fontSize = typeof screen.headlineSize === 'number' ? screen.headlineSize : 110;
      const { width: canvasWidth, height: canvasHeight } = await projectCanvas(client, slug);
      const headlineWidthPxRaw = measureText({
        text,
        fontId,
        fontSize,
        fontWeight,
        maxWidth: canvasWidth * 0.85,
      });
      // Default headline area: top of the canvas at 7% (preset
      // textAreaTop default), centered horizontally. Width = 85% of
      // canvas. Position can be overridden by textPositions.headline.
      const customPos = isRecord(screen.textPositions)
        ? isRecord(screen.textPositions.headline)
          ? screen.textPositions.headline
          : null
        : null;
      const headlineTopPct = typeof customPos?.y === 'number' ? customPos.y : 7;
      const headlineLeftPct = typeof customPos?.x === 'number' ? customPos.x : 7.5;
      const headlineWidthPct = typeof customPos?.width === 'number'
        ? customPos.width
        : (headlineWidthPxRaw.wrappedWidth / canvasWidth) * 100;
      const headlineHeightPct = (headlineWidthPxRaw.height / canvasHeight) * 100;
      const headlineBounds = {
        left: headlineLeftPct,
        top: headlineTopPct,
        width: headlineWidthPct,
        height: headlineHeightPct,
      };
      const deviceBounds = estimateDeviceBounds(screen);
      // AABB intersection on canvas-% rectangles.
      const overlaps = !(
        headlineBounds.left + headlineBounds.width <= deviceBounds.left ||
        deviceBounds.left + deviceBounds.width <= headlineBounds.left ||
        headlineBounds.top + headlineBounds.height <= deviceBounds.top ||
        deviceBounds.top + deviceBounds.height <= headlineBounds.top
      );
      return jsonContent({
        overlaps,
        headlineBounds,
        deviceBounds,
        recommendation: overlaps
          ? 'Headline area intersects device frame. Either reduce headlineSize, move headline up (set_text_position with smaller y), set headlineLayer: "above-overlays", or accept the overlap if intentional.'
          : 'No overlap detected.',
      });
    },
  },
  {
    descriptor: {
      name: 'predict_locale_overflow',
      description:
        'Given a translated headline (e.g. for a non-English locale), ' +
        'predict whether it will overflow the screen\'s text area at ' +
        'the current font size. Returns the measured line count, ' +
        'wrapped width, and whether it fits within `maxLines` (default ' +
        '2). Useful before committing a translation to a locale — ' +
        'longer-language translations (German, Russian, Finnish) often ' +
        'wrap into 3+ lines and break the layout. Like ' +
        '`auto_fit_headline`, the math is in the engine\'s 1290-ref ' +
        'frame so the overflow verdict is the same regardless of which ' +
        'platform export size the project targets.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'translatedText'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          translatedText: { type: 'string', minLength: 1 },
          locale: { type: 'string' },
          maxLines: { type: 'integer', minimum: 1, maximum: 6 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'predict_locale_overflow');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const translatedText = requireString(a, 'translatedText');
      const maxLines = typeof a.maxLines === 'number' ? a.maxLines : 2;
      const screen = await readScreen(client, slug, index);
      const fontId = typeof screen.headlineFont === 'string' ? screen.headlineFont : 'inter';
      const fontWeight = typeof screen.headlineFontWeight === 'number' ? screen.headlineFontWeight : 700;
      const fontSize = typeof screen.headlineSize === 'number' ? screen.headlineSize : 110;
      const { width: canvasWidth } = await projectCanvas(client, slug);
      const availableWidth = canvasWidth * 0.85;
      const metrics = measureText({
        text: translatedText,
        fontId,
        fontSize,
        fontWeight,
        maxWidth: availableWidth,
      });
      const fits = metrics.lineCount <= maxLines && metrics.wrappedWidth <= availableWidth;
      // Run auto_fit logic in parallel for the recommendation when it
      // doesn't fit at current size.
      let suggestedSize: number | null = null;
      if (!fits) {
        let lo = 12;
        let hi = fontSize;
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          const m = measureText({
            text: translatedText,
            fontId,
            fontSize: mid,
            fontWeight,
            maxWidth: availableWidth,
          });
          if (m.lineCount <= maxLines && m.wrappedWidth <= availableWidth) {
            suggestedSize = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
      }
      return jsonContent({
        fits,
        maxLines,
        measured: metrics,
        currentSize: fontSize,
        suggestedSize,
        recommendation: fits
          ? 'Translation fits comfortably.'
          : suggestedSize !== null
            ? `Translation overflows at ${fontSize}px. Try size ${suggestedSize}px to fit in ${maxLines} lines.`
            : 'Translation cannot fit in the given maxLines at any reasonable font size. Consider shortening the translation or increasing maxLines.',
      });
    },
  },
];
