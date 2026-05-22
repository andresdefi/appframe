import { COMPOSITION_PRESETS } from '@appframe/core';
import type { AppframeClient } from '../client.js';
import type { ContentResult, ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  normalizeColor,
  readFileAsDataUrl,
  readScreen,
  requireIndex,
  requireRecord,
  requireSlug,
  requireString,
  unknownIdError,
  wrapTextAsHtml,
} from './helpers.js';

// Valid composition ids — derived from the core catalog so the
// allowed-values list stays in sync if presets are added or renamed.
const COMPOSITION_IDS = Object.keys(COMPOSITION_PRESETS);

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
      name: 'get_screen',
      description:
        'Read one screen from the on-disk project envelope by index. ' +
        'Returns the FULL editor-state shape (every per-screen field the ' +
        'UI persists — spotlight / loupe / callouts / annotations / ' +
        'overlays / per-text fonts and gradients / screenshot URL / ' +
        'etc). Faster than `get_project` when you only need one screen ' +
        'and gives you the rich shape, not the slim AppframeConfig.',
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
      const a = requireRecord(args, 'get_screen');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const screen = await readScreen(client, slug, index);
      return jsonContent(screen);
    },
  },
  {
    descriptor: {
      name: 'set_composition',
      description:
        "Set the multi-device composition layout for a screen. Valid " +
        'values come from `list_compositions`: "single" (one device), ' +
        '"duo-overlap" (two stacked), "duo-split" (two side-by-side), ' +
        '"hero-tilt" (one tilted hero), "fanned-cards" (fanned spread). ' +
        'Composition controls how many device slots the screen renders ' +
        'and their default geometry — pair with `move_device_frame` (or ' +
        'extraDevices via `patch_screen`) for fine-grained positioning.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'composition'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          composition: { enum: COMPOSITION_IDS },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_composition');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const composition = requireString(a, 'composition');
      if (!COMPOSITION_IDS.includes(composition)) {
        throw unknownIdError(
          'composition',
          composition,
          COMPOSITION_IDS,
          'Call `list_compositions` for details.',
        );
      }
      const result = await client.patchScreen(slug, index, { composition });
      return jsonContent(result.screen);
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
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'batch_patch_screens');
      const slug = requireSlug(a);
      const { ops } = a;
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
      return jsonContent(await client.patchScreensBatch(slug, validated));
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
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'patch_screen');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { patch } = a;
      if (!isRecord(patch)) {
        throw new Error('`patch` must be an object of editor-state screen fields');
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_headline',
      description:
        "Set a screen's headline. `text` accepts plain text (wrapped in " +
        'a centered <p>) or HTML (passed through). For multi-paragraph / ' +
        'gradient / rotated text, use `patch_screen` with the full ' +
        '`headline` HTML.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'text'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          text: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => setText(args, 'set_headline', 'headline', client),
  },
  {
    descriptor: {
      name: 'set_subtitle',
      description:
        "Set a screen's subtitle. `text` accepts plain text or HTML — " +
        'same conventions as `set_headline`. Pass an empty string to ' +
        'clear the subtitle.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'text'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          text: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => setText(args, 'set_subtitle', 'subtitle', client),
  },
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
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_font',
      description:
        'Set the font (and optional weight) on one of the text slots of a ' +
        'screen. `target` is "headline" | "subtitle" | "freeText". `font` ' +
        'is a font id from `list_fonts` (e.g. "inter", "ultra", "bungee", ' +
        '"dm-sans"). `weight` is optional — e.g. 400 for regular, 600 for ' +
        'semibold, 700 for bold.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target', 'font'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          font: { type: 'string', minLength: 1 },
          weight: { type: 'integer', minimum: 100, maximum: 900 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_font');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, font, weight } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      if (typeof font !== 'string' || font.length === 0) {
        throw new Error('`font` must be a non-empty font id (see list_fonts)');
      }
      const fontKey = `${target}Font`;
      const weightKey = `${target}FontWeight`;
      const patch: Record<string, unknown> = { [fontKey]: font };
      if (typeof weight === 'number' && Number.isFinite(weight)) {
        patch[weightKey] = weight;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_device_frame',
      description:
        "Swap the device frame on a screen. `frameId` is an id from " +
        '`list_frames` ("ipad-pro-13", "generic-phone") or ' +
        '`list_koubou_devices` ("iphone-17-pro-max", "iphone-air"). ' +
        '`deviceColor` is the variant name (e.g. "Default", "Natural ' +
        'Titanium") — koubou families expose available colors under ' +
        'each family\'s `colors` array.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'frameId'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          frameId: { type: 'string', minLength: 1 },
          deviceColor: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_device_frame');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const frameId = requireString(a, 'frameId');
      const { deviceColor } = a;
      const patch: Record<string, unknown> = { frameId };
      if (typeof deviceColor === 'string' && deviceColor.length > 0) {
        patch.deviceColor = deviceColor;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'move_device_frame',
      description:
        'Adjust the device frame placement on a screen. All fields are ' +
        'optional — pass only what you want to change. `scale` is the ' +
        "device's relative size on the canvas (default ~92, typical " +
        'range 50-130). `top` is the vertical offset in % (default ~15; ' +
        'lower numbers push the device down). `angle` is the planar ' +
        'rotation in degrees (default 0, used for "angled-left" / ' +
        '"angled-right" layouts). `tilt` is a 3D tilt for the perspective ' +
        'compositions. `rotation` is a pure 2D rotation. `offsetX` shifts ' +
        'the device horizontally in %.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          scale: { type: 'number', minimum: 0, maximum: 300 },
          top: { type: 'number' },
          angle: { type: 'number' },
          tilt: { type: 'number' },
          rotation: { type: 'number' },
          offsetX: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'move_device_frame');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const fieldMap: Record<string, string> = {
        scale: 'deviceScale',
        top: 'deviceTop',
        angle: 'deviceAngle',
        tilt: 'deviceTilt',
        rotation: 'deviceRotation',
        offsetX: 'deviceOffsetX',
      };
      const patch: Record<string, unknown> = {};
      for (const [shorthand, fieldName] of Object.entries(fieldMap)) {
        const v = a[shorthand];
        if (typeof v === 'number' && Number.isFinite(v)) {
          patch[fieldName] = v;
        }
      }
      if (Object.keys(patch).length === 0) {
        throw new Error('pass at least one of scale, top, angle, tilt, rotation, offsetX');
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_border_simulation',
      description:
        "Toggle / style the simulated device border (the dark bezel " +
        'around the screenshot, useful when the screenshot itself is ' +
        "edge-to-edge and you want a thin device frame look). All " +
        'fields are optional and merge with the existing config — ' +
        '`thickness` 0-20 px, `radius` 0-60 px (matches CSS border-' +
        'radius), `color` hex/P3. Set `enabled: false` to hide without ' +
        "losing your tuned thickness/color/radius.",
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          thickness: { type: 'number', minimum: 0, maximum: 20 },
          color: { type: 'string' },
          radius: { type: 'number', minimum: 0, maximum: 60 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_border_simulation');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, thickness, radius, color } = a;
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.borderSimulation) ? screen.borderSimulation : {};
      // Schema defaults — apply when first enabling so the agent gets a
      // sensible look without having to know every field.
      const BORDER_DEFAULTS = {
        enabled: false,
        thickness: 4,
        color: '#1a1a1a',
        radius: 40,
      };
      const merged: Record<string, unknown> = { ...BORDER_DEFAULTS, ...existing };
      if (typeof enabled === 'boolean') merged.enabled = enabled;
      if (typeof thickness === 'number') merged.thickness = thickness;
      if (typeof radius === 'number') merged.radius = radius;
      if (typeof color === 'string' && color.length > 0) {
        merged.color = normalizeColor(color);
      }
      // First-enable inference: if the user passes any styling field
      // without an `enabled` flag and there was no prior config, turn
      // it on. Matches set_spotlight / set_loupe.
      if (typeof enabled !== 'boolean' && !isRecord(screen.borderSimulation)) {
        merged.enabled = true;
      }
      const result = await client.patchScreen(slug, index, { borderSimulation: merged });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_device_shadow',
      description:
        'Toggle / style the drop shadow under the device frame. Unlike ' +
        '`borderSimulation`, there is no `enabled` flag — the field is ' +
        '`null` when off, an object when on. Pass any field to enable; ' +
        'pass `enabled: false` to clear back to null. `opacity` 0-1, ' +
        '`blur` 0-50 px, `offsetY` 0-30 px, `color` hex/P3. Defaults: ' +
        'opacity 0.25, blur 20, offsetY 10, color #000000.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          opacity: { type: 'number', minimum: 0, maximum: 1 },
          blur: { type: 'number', minimum: 0, maximum: 50 },
          color: { type: 'string' },
          offsetY: { type: 'number', minimum: 0, maximum: 30 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_device_shadow');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, opacity, blur, color, offsetY } = a;
      if (enabled === false) {
        const result = await client.patchScreen(slug, index, { deviceShadow: null });
        return jsonContent(result.screen);
      }
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.deviceShadow) ? screen.deviceShadow : {};
      const SHADOW_DEFAULTS = {
        opacity: 0.25,
        blur: 20,
        color: '#000000',
        offsetY: 10,
      };
      const merged: Record<string, unknown> = { ...SHADOW_DEFAULTS, ...existing };
      if (typeof opacity === 'number') merged.opacity = opacity;
      if (typeof blur === 'number') merged.blur = blur;
      if (typeof offsetY === 'number') merged.offsetY = offsetY;
      if (typeof color === 'string' && color.length > 0) {
        merged.color = normalizeColor(color);
      }
      const result = await client.patchScreen(slug, index, { deviceShadow: merged });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_spotlight',
      description:
        "Enable / position / shape a screen's spotlight (the area that " +
        'stays bright while the rest of the screenshot dims). All fields ' +
        'are optional and merge with the existing spotlight — pass just ' +
        'the fields you want to change. Coordinates and sizes are in ' +
        'percent of the device screen (0-100). `shape` is "rectangle" or ' +
        '"oval". `dimOpacity` 0-1 (default 0.5). `blur` 0-40px. ' +
        '`borderRadius` 0-100. Set `enabled: false` to hide the spotlight ' +
        'without losing your tuned config.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          x: { type: 'number', minimum: 0, maximum: 100 },
          y: { type: 'number', minimum: 0, maximum: 100 },
          w: { type: 'number', minimum: 0, maximum: 100 },
          h: { type: 'number', minimum: 0, maximum: 100 },
          shape: { enum: ['rectangle', 'oval'] },
          dimOpacity: { type: 'number', minimum: 0, maximum: 1 },
          blur: { type: 'number', minimum: 0, maximum: 40 },
          borderRadius: { type: 'number', minimum: 0, maximum: 100 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_spotlight');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, slug: _s, index: _i, ...shape } = a;
      void _s; void _i;
      const screen = await readScreen(client, slug, index);
      const existingSpotlight = isRecord(screen.spotlight) ? screen.spotlight : {};
      const SPOTLIGHT_DEFAULTS = {
        x: 50, y: 50, w: 60, h: 25,
        shape: 'rectangle',
        dimOpacity: 0.5, blur: 0, borderRadius: 0,
      };
      const merged = { ...SPOTLIGHT_DEFAULTS, ...existingSpotlight, ...shape };
      const patch: Record<string, unknown> = { spotlight: merged };
      if (typeof enabled === 'boolean') {
        patch.spotlightEnabled = enabled;
      } else if (!isRecord(screen.spotlight)) {
        patch.spotlightEnabled = true;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_text_position',
      description:
        'Place one of the text slots at a custom canvas position. ' +
        '`target` is "headline" | "subtitle" | "freeText". `x` is left ' +
        'offset, `y` is top offset — both in canvas % (0-100). `width` ' +
        '(optional) constrains the text block width in canvas % so the ' +
        'text wraps. Pass `null` for all three coords (via ' +
        '`patch_screen` with `textPositions.<target>: null`) to revert ' +
        'to the default layout. The default layout uses the `layout` ' +
        'preset (center / angled-left / angled-right).',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target', 'x', 'y'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          x: { type: 'number' },
          y: { type: 'number' },
          width: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_text_position');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, x, y, width } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      if (typeof x !== 'number' || typeof y !== 'number') {
        throw new Error('`x` and `y` are required numbers');
      }
      // Merge with the existing textPositions object so we don't blow
      // away the other two slots when only setting one.
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.textPositions) ? screen.textPositions : {};
      const newPos: Record<string, unknown> = { x, y };
      if (typeof width === 'number') newPos.width = width;
      const merged = { ...existing, [target]: newPos };
      const result = await client.patchScreen(slug, index, { textPositions: merged });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_text_gradient',
      description:
        'Apply a linear gradient fill to a screen\'s headline or ' +
        "subtitle. `target` is \"headline\" or \"subtitle\" — freeText " +
        'gradients aren\'t in the schema. `colors` is 2-5 hex/P3 ' +
        'strings. `direction` is degrees 0-360 (default 90, vertical). ' +
        'Pass `null` for `colors` (via patch_screen) to clear the ' +
        'gradient and revert to the screen\'s solid text color.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target', 'colors'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle'] },
          colors: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
          direction: { type: 'number', minimum: 0, maximum: 360 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_text_gradient');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, colors, direction } = a;
      if (target !== 'headline' && target !== 'subtitle') {
        throw new Error('`target` must be "headline" or "subtitle"');
      }
      if (!Array.isArray(colors) || colors.length < 2 || colors.length > 5) {
        throw new Error('`colors` must be 2-5 color strings');
      }
      const normalized = colors.map((c) => {
        if (typeof c !== 'string') throw new Error('`colors` entries must be strings');
        return normalizeColor(c);
      });
      const gradient: Record<string, unknown> = { colors: normalized };
      if (typeof direction === 'number') gradient.direction = direction;
      const fieldKey = `${target}Gradient`;
      const result = await client.patchScreen(slug, index, { [fieldKey]: gradient });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_text_shadow',
      description:
        'Toggle / style the drop-shadow on one text slot. `target` is ' +
        '"headline" | "subtitle" | "freeText". All other fields are ' +
        'optional and merge with the existing config — `enabled` ' +
        'toggle, `offsetX`/`offsetY` -20..20 px, `blur` 0-30 px, ' +
        '`color` hex/P3, `opacity` 0-100. blur=0 + non-zero offset ' +
        '= hard drop shadow; blur > 0 with offset=0 = a glow centered ' +
        'on the glyph.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index', 'target'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          target: { enum: ['headline', 'subtitle', 'freeText'] },
          enabled: { type: 'boolean' },
          offsetX: { type: 'number', minimum: -20, maximum: 20 },
          offsetY: { type: 'number', minimum: -20, maximum: 20 },
          blur: { type: 'number', minimum: 0, maximum: 30 },
          color: { type: 'string' },
          opacity: { type: 'number', minimum: 0, maximum: 100 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_text_shadow');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { target, enabled, offsetX, offsetY, blur, color, opacity } = a;
      if (target !== 'headline' && target !== 'subtitle' && target !== 'freeText') {
        throw new Error('`target` must be "headline", "subtitle", or "freeText"');
      }
      const fieldKey = `${target}Shadow`;
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen[fieldKey]) ? (screen[fieldKey] as Record<string, unknown>) : {};
      // Defaults match the slim-default "off but ready" shape — see
      // STATIC_SCREEN_DEFAULTS in screenSerialization.ts.
      const SHADOW_DEFAULTS = {
        enabled: false,
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        color: '#000000',
        opacity: 30,
      };
      const merged: Record<string, unknown> = { ...SHADOW_DEFAULTS, ...existing };
      if (typeof enabled === 'boolean') merged.enabled = enabled;
      if (typeof offsetX === 'number') merged.offsetX = offsetX;
      if (typeof offsetY === 'number') merged.offsetY = offsetY;
      if (typeof blur === 'number') merged.blur = blur;
      if (typeof opacity === 'number') merged.opacity = opacity;
      if (typeof color === 'string' && color.length > 0) {
        merged.color = normalizeColor(color);
      }
      // First-enable inference: if the agent passes styling fields with
      // no explicit `enabled` and the shadow was off, turn it on.
      if (
        typeof enabled !== 'boolean' &&
        merged.enabled === false &&
        (offsetX !== undefined || offsetY !== undefined || blur !== undefined || color !== undefined || opacity !== undefined)
      ) {
        merged.enabled = true;
      }
      const result = await client.patchScreen(slug, index, { [fieldKey]: merged });
      return jsonContent(result.screen);
    },
  },
  {
    descriptor: {
      name: 'set_loupe',
      description:
        "Enable / position / shape a screen's loupe (a magnified inset " +
        'showing part of the screenshot bigger). Same merge semantics as ' +
        '`set_spotlight` — pass only the fields you want to change. ' +
        '`sourceX`/`sourceY` (-1 to 1) pick the source point on the ' +
        'device. `displayX`/`displayY` (0-100, %) position the loupe on ' +
        'the canvas. `width`/`height` are FRACTIONS (0.05-1) of the ' +
        'preview, not percentages. `zoom` 1-5. `cornerRadius` in px ' +
        '(0-200). Toggle without losing config via `enabled: false`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          enabled: { type: 'boolean' },
          sourceX: { type: 'number', minimum: -1, maximum: 1 },
          sourceY: { type: 'number', minimum: -1, maximum: 1 },
          displayX: { type: 'number', minimum: 0, maximum: 100 },
          displayY: { type: 'number', minimum: 0, maximum: 100 },
          width: { type: 'number', minimum: 0.05, maximum: 1 },
          height: { type: 'number', minimum: 0.05, maximum: 1 },
          zoom: { type: 'number', minimum: 1, maximum: 5 },
          cornerRadius: { type: 'number', minimum: 0, maximum: 200 },
          borderWidth: { type: 'number', minimum: 0, maximum: 10 },
          borderColor: { type: 'string' },
          shadow: { type: 'boolean' },
          shadowColor: { type: 'string' },
          shadowRadius: { type: 'number', minimum: 0, maximum: 100 },
          shadowOffsetX: { type: 'number', minimum: -50, maximum: 50 },
          shadowOffsetY: { type: 'number', minimum: -50, maximum: 50 },
          xOffset: { type: 'number', minimum: -100, maximum: 100 },
          yOffset: { type: 'number', minimum: -100, maximum: 100 },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_loupe');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const { enabled, borderColor, shadowColor, slug: _s, index: _i, ...rest } = a;
      void _s; void _i;
      const colorPatch: Record<string, unknown> = {};
      if (typeof borderColor === 'string' && borderColor.length > 0) {
        colorPatch.borderColor = normalizeColor(borderColor);
      }
      if (typeof shadowColor === 'string' && shadowColor.length > 0) {
        colorPatch.shadowColor = normalizeColor(shadowColor);
      }
      const screen = await readScreen(client, slug, index);
      const existing = isRecord(screen.loupe) ? screen.loupe : {};
      const LOUPE_DEFAULTS = {
        sourceX: 0, sourceY: 0,
        displayX: 50, displayY: 60,
        width: 0.5, height: 0.33,
        zoom: 2.5,
        cornerRadius: 0, borderWidth: 0, borderColor: '#ffffff',
        shadow: false, shadowColor: '#000000',
        shadowRadius: 30, shadowOffsetX: 0, shadowOffsetY: 0,
        xOffset: 0, yOffset: 0,
      };
      const merged = { ...LOUPE_DEFAULTS, ...existing, ...rest, ...colorPatch };
      const patch: Record<string, unknown> = { loupe: merged };
      if (typeof enabled === 'boolean') {
        patch.loupeEnabled = enabled;
      } else if (!isRecord(screen.loupe)) {
        patch.loupeEnabled = true;
      }
      const result = await client.patchScreen(slug, index, patch);
      return jsonContent(result.screen);
    },
  },
];

// Shared body for `set_headline` and `set_subtitle`. Keeps the two
// handlers from diverging in subtle ways (e.g. one trimming whitespace
// and the other not).
async function setText(
  args: unknown,
  toolName: string,
  field: 'headline' | 'subtitle',
  client: AppframeClient,
): Promise<ContentResult> {
  const a = requireRecord(args, toolName);
  const slug = requireSlug(a);
  const index = requireIndex(a);
  const { text } = a;
  if (typeof text !== 'string') {
    throw new Error('`text` must be a string');
  }
  const result = await client.patchScreen(slug, index, {
    [field]: wrapTextAsHtml(text),
  });
  return jsonContent(result.screen);
}
