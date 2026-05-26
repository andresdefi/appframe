import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  normalizeColor,
  readFileAsDataUrl,
  requireIndex,
  requireRecord,
  requireSlug,
} from './helpers.js';

export const screenBackgroundTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'set_background',
      description:
        "Set a screen's background. Three modes (pass exactly one):\n" +
        '  • Solid: `color` as hex (#rrggbb / #rgb) or a ' +
        '`color(display-p3 r g b)` string.\n' +
        '  • Gradient: `gradient: { type, colors, direction?, ' +
        'radialPosition? }`. `type` is "linear" or "radial" (default ' +
        'linear). `colors` is 2-5 hex/P3 strings. `direction` is degrees ' +
        '0-360 (linear; default 135). `radialPosition` is "center" | ' +
        '"top" | "bottom" | "left" | "right" (radial; default center).\n' +
        '  • Image: `image: { filePath | dataUrl | url, fit?, ' +
        'positionX?, positionY?, scale?, overlay? }`. Provide ONE of ' +
        '`filePath` (uploads to project screenshots/ first), `dataUrl` ' +
        '(also uploads — requires `filename`), or `url` (pre-uploaded, ' +
        'e.g. from `upload_screenshot`). `fit` is "cover" | "contain" | ' +
        '"fill" (default cover). `positionX`/`positionY` 0-100 (% — ' +
        'default 50). `scale` 0.1-3 (1 = native fit). `overlay` is ' +
        '`{ color, opacity }` for a tint on top (color hex/P3, opacity ' +
        '0-1).',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          color: { type: 'string' },
          gradient: {
            type: 'object',
            properties: {
              type: { enum: ['linear', 'radial'] },
              colors: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
              direction: { type: 'number', minimum: 0, maximum: 360 },
              radialPosition: { enum: ['center', 'top', 'bottom', 'left', 'right'] },
            },
            required: ['colors'],
            additionalProperties: false,
          },
          image: {
            type: 'object',
            properties: {
              filePath: { type: 'string' },
              dataUrl: { type: 'string' },
              url: { type: 'string' },
              filename: { type: 'string' },
              fit: { enum: ['cover', 'contain', 'fill'] },
              positionX: { type: 'number', minimum: 0, maximum: 100 },
              positionY: { type: 'number', minimum: 0, maximum: 100 },
              scale: { type: 'number', minimum: 0.1, maximum: 3 },
              overlay: {
                type: 'object',
                required: ['color'],
                properties: {
                  color: { type: 'string' },
                  opacity: { type: 'number', minimum: 0, maximum: 1 },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_background');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { color, gradient, image } = a;
      const modeCount =
        (color !== undefined ? 1 : 0) +
        (gradient !== undefined ? 1 : 0) +
        (image !== undefined ? 1 : 0);
      if (modeCount !== 1) {
        throw new Error('Pass exactly one of `color`, `gradient`, or `image`');
      }
      let patch: Record<string, unknown>;
      if (typeof color === 'string' && color.length > 0) {
        patch = { backgroundType: 'solid', backgroundColor: normalizeColor(color) };
      } else if (isRecord(gradient)) {
        const rawColors = gradient.colors;
        if (!Array.isArray(rawColors) || rawColors.length < 2 || rawColors.length > 5) {
          throw new Error('`gradient.colors` must be 2-5 color strings');
        }
        const colors = rawColors.map((c) => {
          if (typeof c !== 'string') throw new Error('`gradient.colors` entries must be strings');
          return normalizeColor(c);
        });
        const type = gradient.type === 'radial' ? 'radial' : 'linear';
        const next: Record<string, unknown> = { type, colors };
        if (typeof gradient.direction === 'number') next.direction = gradient.direction;
        if (typeof gradient.radialPosition === 'string') {
          next.radialPosition = gradient.radialPosition;
        }
        patch = { backgroundType: 'gradient', backgroundGradient: next };
      } else if (isRecord(image)) {
        const imgFilePath = image.filePath;
        const imgDataUrl = image.dataUrl;
        const imgUrl = image.url;
        const imgFilename = image.filename;
        const sourceCount =
          (typeof imgFilePath === 'string' && imgFilePath.length > 0 ? 1 : 0) +
          (typeof imgDataUrl === 'string' && imgDataUrl.length > 0 ? 1 : 0) +
          (typeof imgUrl === 'string' && imgUrl.length > 0 ? 1 : 0);
        if (sourceCount !== 1) {
          throw new Error('Pass exactly one of `image.filePath`, `image.dataUrl`, or `image.url`');
        }
        let resolvedUrl: string;
        if (typeof imgUrl === 'string' && imgUrl.length > 0) {
          resolvedUrl = imgUrl;
        } else if (typeof imgFilePath === 'string') {
          const read = await readFileAsDataUrl(imgFilePath);
          const explicitName =
            typeof imgFilename === 'string' && imgFilename.length > 0 ? imgFilename : read.filename;
          const uploaded = await client.uploadScreenshot({
            slug,
            filename: explicitName,
            dataUrl: read.dataUrl,
          });
          resolvedUrl = uploaded.url;
        } else {
          if (typeof imgFilename !== 'string' || imgFilename.length === 0) {
            throw new Error('`image.filename` is required when uploading via `dataUrl`');
          }
          const uploaded = await client.uploadScreenshot({
            slug,
            filename: imgFilename,
            dataUrl: imgDataUrl as string,
          });
          resolvedUrl = uploaded.url;
        }
        patch = { backgroundType: 'image', backgroundImageDataUrl: resolvedUrl };
        if (typeof image.fit === 'string') patch.backgroundImageFit = image.fit;
        if (typeof image.positionX === 'number') patch.backgroundImagePositionX = image.positionX;
        if (typeof image.positionY === 'number') patch.backgroundImagePositionY = image.positionY;
        if (typeof image.scale === 'number') patch.backgroundImageScale = image.scale;
        if (isRecord(image.overlay)) {
          const overlayColor = image.overlay.color;
          if (typeof overlayColor !== 'string' || overlayColor.length === 0) {
            throw new Error('`image.overlay.color` must be a colour string');
          }
          const overlay: Record<string, unknown> = { color: normalizeColor(overlayColor) };
          if (typeof image.overlay.opacity === 'number') {
            overlay.opacity = image.overlay.opacity;
          }
          patch.backgroundOverlay = overlay;
        }
      } else {
        throw new Error('Pass `color` as a string, `gradient` / `image` as an object');
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent({ success: true, savedAt: result.savedAt });
    },
  },
];
