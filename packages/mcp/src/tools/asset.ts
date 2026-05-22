import type { ToolDefinition } from './types.js';
import {
  jsonContent,
  readFileAsDataUrl,
  requireIndex,
  requireRecord,
  requireSlug,
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
];
