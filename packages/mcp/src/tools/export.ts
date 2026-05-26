import { join } from 'node:path';
import { homedir } from 'node:os';
import { mkdir, writeFile } from 'node:fs/promises';
import JSZip from 'jszip';
import type { ToolDefinition } from './types.js';
import {
  isRecord,
  jsonContent,
  requireRecord,
  requireSlug,
} from './helpers.js';

async function resolveExportDims(
  client: { getSizes: () => Promise<Record<string, Array<{ key: string; width: number; height: number }>>> },
  exportSizeKey: string,
): Promise<{ width: number; height: number }> {
  const sizes = await client.getSizes();
  for (const group of Object.values(sizes)) {
    const match = group.find((s) => s.key === exportSizeKey);
    if (match) return { width: match.width, height: match.height };
  }
  return { width: 1260, height: 2736 };
}

interface BatchItem {
  locale: string;
  index: number;
  width: number;
  height: number;
  relPath: string;
}

function buildItemList(
  screenCount: number,
  locales: string[],
  width: number,
  height: number,
  useFolders: boolean,
): BatchItem[] {
  const items: BatchItem[] = [];
  for (const locale of locales) {
    for (let i = 0; i < screenCount; i++) {
      const fileName = `screen-${i + 1}.png`;
      const relPath = useFolders ? `${locale}/${fileName}` : fileName;
      items.push({ locale, index: i, width, height, relPath });
    }
  }
  return items;
}

export const exportTools: ToolDefinition[] = [
  {
    descriptor: {
      name: 'export_project',
      description:
        'Export all locales of a project as a ZIP file, mirroring the ' +
        "browser's \"Download all screens\" button. Renders every screen " +
        'at full export resolution via the live browser preview, writes ' +
        'PNGs to disk, and bundles them as a ZIP.\n' +
        '\n' +
        'Folder structure: `<locale>/screen-<N>.png` (1-indexed). The ' +
        '"default" locale uses the folder name `default`. Single-locale ' +
        'projects put files at the ZIP root.\n' +
        '\n' +
        'Requires the browser preview tab open at http://localhost:4400. ' +
        'Large projects (many locales x screens) can take minutes.',
      inputSchema: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          outDir: {
            type: 'string',
            description: 'Directory to write the ZIP to. Defaults to ~/Downloads.',
          },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'export_project');
      const slug = requireSlug(a);
      const outDir = typeof a.outDir === 'string' && a.outDir.length > 0
        ? a.outDir
        : join(homedir(), 'Downloads');
      const t0 = Date.now();

      const env = await client.getProjectEnvelope(slug);
      const data = isRecord(env.data) ? env.data : {};
      const screens = Array.isArray(data.screens) ? data.screens : [];
      const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
      const localeScreensMap = isRecord(data.localeScreens) ? data.localeScreens : {};
      const exportSizeKey = typeof data.exportSize === 'string' ? data.exportSize : 'ios-6.9';
      const { width, height } = await resolveExportDims(client, exportSizeKey);

      const localeCodes = ['default', ...Object.keys(sessionLocales)];
      const useFolders = localeCodes.length > 1;

      const allItems: BatchItem[] = [];
      for (const locale of localeCodes) {
        const localeScreenCount = locale === 'default'
          ? screens.length
          : (Array.isArray(localeScreensMap[locale]) ? (localeScreensMap[locale] as unknown[]).length : 0);
        if (localeScreenCount === 0) continue;
        for (let i = 0; i < localeScreenCount; i++) {
          const fileName = `screen-${i + 1}.png`;
          const relPath = useFolders ? `${locale}/${fileName}` : fileName;
          allItems.push({ locale, index: i, width, height, relPath });
        }
      }

      if (allItems.length === 0) {
        return jsonContent({ success: false, error: 'project has no screens to export' });
      }

      const tmpDir = join(outDir, `.appframe-export-${Date.now()}`);
      const result = await client.renderBatch({ slug, outDir: tmpDir, items: allItems });

      const zip = new JSZip();
      for (const file of result.files) {
        const { readFile } = await import('node:fs/promises');
        const buf = await readFile(file.absPath);
        zip.file(file.relPath, buf, { compression: 'STORE' });
      }
      const zipBuf = await zip.generateAsync({ type: 'nodebuffer' });
      const zipPath = join(outDir, `${slug}-screens.zip`);
      await mkdir(outDir, { recursive: true });
      await writeFile(zipPath, zipBuf);

      const { rm } = await import('node:fs/promises');
      await rm(tmpDir, { recursive: true, force: true }).catch(() => {});

      const durationMs = Date.now() - t0;
      return jsonContent({
        success: true,
        zipPath,
        locales: localeCodes,
        totalScreens: allItems.length,
        rendered: result.files.length,
        errors: result.errors,
        bytes: zipBuf.length,
        durationMs,
      });
    },
  },
  {
    descriptor: {
      name: 'export_locale',
      description:
        'Export all screens for a single locale as individual PNG files ' +
        'in a folder. Renders at full export resolution via the live ' +
        'browser preview.\n' +
        '\n' +
        'Output: `<outDir>/<slug>-<locale>/screen-<N>.png` (1-indexed).\n' +
        '\n' +
        'Requires the browser preview tab open at http://localhost:4400.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'code'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          code: {
            type: 'string',
            minLength: 1,
            description: 'Locale code (e.g. "default", "es-MX", "ja").',
          },
          outDir: {
            type: 'string',
            description: 'Parent directory for the output folder. Defaults to ~/Downloads.',
          },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'export_locale');
      const slug = requireSlug(a);
      const code = typeof a.code === 'string' ? a.code : 'default';
      const parentDir = typeof a.outDir === 'string' && a.outDir.length > 0
        ? a.outDir
        : join(homedir(), 'Downloads');

      const env = await client.getProjectEnvelope(slug);
      const data = isRecord(env.data) ? env.data : {};
      const screens = Array.isArray(data.screens) ? data.screens : [];
      const localeScreensMap = isRecord(data.localeScreens) ? data.localeScreens : {};
      const exportSizeKey = typeof data.exportSize === 'string' ? data.exportSize : 'ios-6.9';
      const { width, height } = await resolveExportDims(client, exportSizeKey);

      const screenCount = code === 'default'
        ? screens.length
        : (Array.isArray(localeScreensMap[code]) ? (localeScreensMap[code] as unknown[]).length : 0);
      if (screenCount === 0) {
        return jsonContent({ success: false, error: `locale "${code}" has no screens` });
      }

      const items = buildItemList(screenCount, [code], width, height, false);
      const outputDir = join(parentDir, `${slug}-${code}`);
      const result = await client.renderBatch({ slug, outDir: outputDir, items });

      return jsonContent({
        success: true,
        outputDir,
        files: result.files.map((f) => ({ relPath: f.relPath, absPath: f.absPath, bytes: f.bytes })),
        errors: result.errors,
      });
    },
  },
  {
    descriptor: {
      name: 'export_screen',
      description:
        'Export a single screen as a full-resolution PNG file. Same ' +
        "pipeline as the browser's export but writes directly to disk.\n" +
        '\n' +
        'Requires the browser preview tab open at http://localhost:4400.',
      inputSchema: {
        type: 'object',
        required: ['slug', 'index'],
        properties: {
          slug: { type: 'string', minLength: 1 },
          index: { type: 'integer', minimum: 0 },
          code: {
            type: 'string',
            description: 'Locale code. Defaults to "default".',
          },
          outPath: {
            type: 'string',
            description: 'Full file path for the output PNG. Defaults to ~/Downloads/<slug>-screen-<N>.png.',
          },
        },
        additionalProperties: false,
      },
    },
    handler: async (args, { client }) => {
      const a = requireRecord(args, 'export_screen');
      const slug = requireSlug(a);
      const index = typeof a.index === 'number' ? a.index : 0;
      const code = typeof a.code === 'string' && a.code.length > 0 ? a.code : 'default';
      const defaultPath = join(homedir(), 'Downloads', `${slug}-screen-${index + 1}.png`);
      const outPath = typeof a.outPath === 'string' && a.outPath.length > 0
        ? a.outPath
        : defaultPath;

      const env = await client.getProjectEnvelope(slug);
      const data = isRecord(env.data) ? env.data : {};
      const exportSizeKey = typeof data.exportSize === 'string' ? data.exportSize : 'ios-6.9';
      const { width, height } = await resolveExportDims(client, exportSizeKey);

      const { dirname } = await import('node:path');
      const outDir = dirname(outPath);
      const { basename } = await import('node:path');
      const fileName = basename(outPath);

      const result = await client.renderBatch({
        slug,
        outDir,
        items: [{ locale: code, index, width, height, relPath: fileName }],
      });

      if (result.files.length === 0) {
        const errMsg = result.errors[0]?.error ?? 'render failed';
        return jsonContent({ success: false, error: errMsg });
      }
      const file = result.files[0]!;
      return jsonContent({
        success: true,
        filePath: file.absPath,
        bytes: file.bytes,
        dims: { width, height },
      });
    },
  },
];
