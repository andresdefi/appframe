import type { ToolDefinition } from './types.js';
import {
  jsonContent,
  readFileAsDataUrl,
  requireConfirm,
  requireIndex,
  requireRecord,
  requireSlug,
  requireString,
} from './helpers.js';

export const assetTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'upload_screenshot',
      description:
        'Upload an image to the active project\'s screenshots/ folder. ' +
        'Pass either `filePath` (a path on the user\'s local machine; the ' +
        "MCP server reads it directly) OR `dataUrl` (a `data:image/...;" +
        'base64,...` URL — useful when the agent already has the bytes). ' +
        'Supported image types: png, jpg/jpeg, webp, gif, heic/heif. ' +
        '`filename` is optional — derived from filePath basename if not ' +
        'provided. Returns { url, filename, bytes, ... } — pass the ' +
        '`url` and `filename` to `set_screenshot` or `patch_screen` ' +
        "(fields `screenshotUrl` and `screenshotName`) to assign the " +
        'image to a screen.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          filePath: { type: 'string' },
          dataUrl: { type: 'string' },
          filename: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'upload_screenshot');
      const slug = requireSlug(a);
      const { filePath, dataUrl: dataUrlArg, filename: filenameArg } = a;
      if ((typeof filePath !== 'string') === (typeof dataUrlArg !== 'string')) {
        throw new Error('Pass exactly one of `filePath` or `dataUrl`');
      }
      let dataUrl: string;
      let filename: string;
      if (typeof filePath === 'string') {
        const read = await readFileAsDataUrl(filePath);
        dataUrl = read.dataUrl;
        filename =
          typeof filenameArg === 'string' && filenameArg.length > 0
            ? filenameArg
            : read.filename;
      } else {
        dataUrl = dataUrlArg as string;
        if (typeof filenameArg !== 'string' || filenameArg.length === 0) {
          throw new Error('`filename` is required when uploading via `dataUrl`');
        }
        filename = filenameArg;
      }
      const result = await client.uploadScreenshot({ slug, filename, dataUrl });
      return jsonContent(result);
    },
  },
  {
    descriptor: {
      name: 'set_screenshot',
      description:
        'Assign an image to a screen. Two modes:\n' +
        '  • Pre-uploaded: pass `screenshotUrl` (and optionally ' +
        '`screenshotName`). No upload happens — just sets the fields on ' +
        'the screen.\n' +
        '  • Upload + assign: pass `filePath` OR `dataUrl`. The MCP ' +
        'uploads the image first (same as `upload_screenshot`), then ' +
        'sets `screenshotUrl` / `screenshotName` on the screen.\n' +
        'Returns the updated screen including the uploaded URL.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          filePath: { type: 'string' },
          dataUrl: { type: 'string' },
          screenshotUrl: { type: 'string' },
          screenshotName: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'set_screenshot');
      const slug = requireSlug(a);
      const index = requireIndex(a);
      const {
        filePath,
        dataUrl: dataUrlArg,
        screenshotUrl: urlArg,
        screenshotName: nameArg,
      } = a;
      const inputsPresent =
        (typeof filePath === 'string' && filePath.length > 0 ? 1 : 0) +
        (typeof dataUrlArg === 'string' && dataUrlArg.length > 0 ? 1 : 0) +
        (typeof urlArg === 'string' && urlArg.length > 0 ? 1 : 0);
      if (inputsPresent !== 1) {
        throw new Error('Pass exactly one of `filePath`, `dataUrl`, or `screenshotUrl`');
      }
      let screenshotUrl: string;
      let screenshotName: string;
      if (typeof urlArg === 'string' && urlArg.length > 0) {
        screenshotUrl = urlArg;
        if (typeof nameArg === 'string' && nameArg.length > 0) {
          screenshotName = nameArg;
        } else {
          const tail = urlArg.split('?')[0]!.split('/').pop() ?? '';
          screenshotName = tail || 'screenshot.png';
        }
      } else if (typeof filePath === 'string') {
        const read = await readFileAsDataUrl(filePath);
        const explicitName =
          typeof nameArg === 'string' && nameArg.length > 0 ? nameArg : read.filename;
        const uploaded = await client.uploadScreenshot({
          slug,
          filename: explicitName,
          dataUrl: read.dataUrl,
        });
        screenshotUrl = uploaded.url;
        screenshotName = uploaded.filename;
      } else {
        if (typeof nameArg !== 'string' || nameArg.length === 0) {
          throw new Error('`screenshotName` is required when uploading via `dataUrl`');
        }
        const uploaded = await client.uploadScreenshot({
          slug,
          filename: nameArg,
          dataUrl: dataUrlArg as string,
        });
        screenshotUrl = uploaded.url;
        screenshotName = uploaded.filename;
      }
      const result = await client.patchScreen(slug, index, {
        screenshotUrl,
        screenshotName,
      });
      return jsonContent({ screenshotUrl, screenshotName, screen: result.screen });
    },
  },
  {
    descriptor: {
      name: 'list_assets',
      description:
        'Inventory of every screenshot file under the project\'s ' +
        'screenshots/ folder, annotated with whether the current ' +
        'envelope still references each one. Returns `{ assets: ' +
        '[{filename, bytes, referenced}], unreferenced: [], ' +
        'referencedButMissing: [] }`. `unreferenced` is the candidate ' +
        'list for `cleanup_unused_screenshots`. `referencedButMissing` ' +
        'flags broken references — the envelope points at a file that ' +
        'isn\'t on disk (usually a manual delete or a project copied ' +
        'between machines). Read-only — touches nothing.',
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
      const a = requireRecord(args, 'list_assets');
      const slug = requireSlug(a);
      return jsonContent(await client.listAssets(slug));
    },
  },
  {
    descriptor: {
      name: 'delete_screenshot',
      description:
        'Remove a single screenshot file (and its preview) from a ' +
        'project\'s screenshots/ folder. REFUSES if the filename is ' +
        'still referenced anywhere in the envelope (default screens, ' +
        'locale screens, variant snapshots, overlays, backgrounds). ' +
        'Drop the references first via `patch_screen` / ' +
        '`patch_locale_screen` / `set_screenshot` (with a different ' +
        'image) before calling this. Destructive — requires ' +
        '`confirm: true`. Use `list_assets` first to confirm the file ' +
        'is in `unreferenced`.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'filename', 'confirm'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          filename: { type: 'string', minLength: 1 },
          confirm: { const: true, description: 'Must be `true`. Safety guard.' },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'delete_screenshot');
      requireConfirm(a, 'delete_screenshot', `delete the screenshot "${a.filename}" from disk`);
      const slug = requireSlug(a);
      const filename = requireString(a, 'filename');
      return jsonContent(await client.deleteScreenshot(slug, filename));
    },
  },
  {
    descriptor: {
      name: 'cleanup_unused_screenshots',
      description:
        'Sweep every unreferenced screenshot file out of the project\'s ' +
        'screenshots/ folder. Mirrors the boot-time orphan sweep but ' +
        'scoped to one project and triggerable on demand. Returns the ' +
        'filenames deleted (plus any that failed). Destructive — ' +
        'requires `confirm: true`. Always safe vs the envelope: only ' +
        'files NOT referenced get removed. Run `list_assets` first to ' +
        'see what will be removed.',
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
      const a = requireRecord(args, 'cleanup_unused_screenshots');
      requireConfirm(a, 'cleanup_unused_screenshots', 'permanently delete every unreferenced screenshot file');
      const slug = requireSlug(a);
      return jsonContent(await client.cleanupUnusedScreenshots(slug));
    },
  },
];
