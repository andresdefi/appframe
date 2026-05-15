import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { join, resolve, extname, basename } from 'node:path';
import { homedir } from 'node:os';
import type { Express, Request, Response } from 'express';

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};
const MAX_SCREENSHOT_BYTES = 25 * 1024 * 1024;
const PROJECT_SLUG_RE = /^[a-zA-Z0-9_-]+$/;

export interface ScreenshotStorageOptions {
  projectsRoot: string;
  maxBytes?: number;
}

export interface WrittenScreenshot {
  project: string;
  filename: string;
  /** Path relative to the project directory. */
  relPath: string;
  /** Absolute path on disk. */
  absPath: string;
  /** Browser-facing URL. */
  url: string;
  bytes: number;
}

export function getDefaultProjectsRoot(): string {
  return process.env.APPFRAME_PROJECTS_DIR ?? join(homedir(), 'Documents', 'appframe', 'projects');
}

function sanitizeProject(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return 'default';
  if (!PROJECT_SLUG_RE.test(value)) {
    throw new Error('project name must match /^[a-zA-Z0-9_-]+$/');
  }
  return value;
}

function sanitizeFilename(value: unknown): { stem: string; ext: string } {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('filename is required');
  }
  const base = basename(value);
  const ext = extname(base).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new Error(`unsupported file extension: ${ext || '(none)'}`);
  }
  const stemRaw = base.slice(0, base.length - ext.length);
  const stem = stemRaw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (!stem) throw new Error('filename has no usable characters');
  return { stem, ext };
}

function projectScreenshotsDir(root: string, project: string): string {
  return join(resolve(root), project, 'screenshots');
}

export function resolveScreenshotPath(root: string, project: string, filename: string): string {
  const safeProject = sanitizeProject(project);
  if (typeof filename !== 'string' || filename.length === 0) {
    throw new Error('filename is required');
  }
  const safeName = basename(filename);
  if (safeName !== filename || safeName.includes('..')) {
    throw new Error('filename must not contain path separators');
  }
  const dir = projectScreenshotsDir(root, safeProject);
  const abs = resolve(dir, safeName);
  const sep = process.platform === 'win32' ? '\\' : '/';
  if (!abs.startsWith(resolve(dir) + sep)) {
    throw new Error('resolved path escapes the project screenshots directory');
  }
  return abs;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function pickUniqueFilename(dir: string, stem: string, ext: string): Promise<string> {
  let candidate = `${stem}${ext}`;
  let i = 2;
  while (await fileExists(join(dir, candidate))) {
    candidate = `${stem}-${i}${ext}`;
    i += 1;
    if (i > 9999) throw new Error('unable to find a free filename');
  }
  return candidate;
}

function decodeDataUrl(
  dataUrl: unknown,
  maxBytes: number,
): { buffer: Buffer; declaredExt: string | null } {
  if (typeof dataUrl !== 'string') throw new Error('dataUrl is required');
  const match = /^data:([^;,]+)?(?:;([^,]+))?,(.*)$/.exec(dataUrl);
  if (!match) throw new Error('dataUrl is not a valid data URI');
  const mime = match[1] ?? '';
  const encoding = match[2] ?? '';
  const payload = match[3] ?? '';
  const buffer =
    encoding === 'base64'
      ? Buffer.from(payload, 'base64')
      : Buffer.from(decodeURIComponent(payload), 'utf-8');
  if (buffer.byteLength > maxBytes) {
    throw new Error(`image exceeds the ${Math.round(maxBytes / (1024 * 1024))}MB cap`);
  }
  const declaredExt =
    mime === 'image/png'
      ? '.png'
      : mime === 'image/jpeg'
        ? '.jpg'
        : mime === 'image/webp'
          ? '.webp'
          : mime === 'image/svg+xml'
            ? '.svg'
            : null;
  return { buffer, declaredExt };
}

export async function writeScreenshotFromDataUrl(
  options: ScreenshotStorageOptions,
  input: { project?: unknown; filename: unknown; dataUrl: unknown },
): Promise<WrittenScreenshot> {
  const project = sanitizeProject(input.project);
  const { stem, ext } = sanitizeFilename(input.filename);
  const maxBytes = options.maxBytes ?? MAX_SCREENSHOT_BYTES;
  const { buffer, declaredExt } = decodeDataUrl(input.dataUrl, maxBytes);
  const finalExt = declaredExt ?? ext;
  const dir = projectScreenshotsDir(options.projectsRoot, project);
  await mkdir(dir, { recursive: true });
  const filename = await pickUniqueFilename(dir, stem, finalExt);
  const absPath = resolve(dir, filename);
  const sep = process.platform === 'win32' ? '\\' : '/';
  if (!absPath.startsWith(resolve(dir) + sep)) {
    throw new Error('resolved path escapes the project screenshots directory');
  }
  await writeFile(absPath, buffer);
  return {
    project,
    filename,
    relPath: `screenshots/${filename}`,
    absPath,
    url: `/api/screenshots/${project}/${filename}`,
    bytes: buffer.byteLength,
  };
}

export async function readScreenshotAsBuffer(
  options: ScreenshotStorageOptions,
  project: string,
  filename: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  let abs: string;
  try {
    abs = resolveScreenshotPath(options.projectsRoot, project, filename);
  } catch {
    return null;
  }
  try {
    const buffer = await readFile(abs);
    const ext = extname(abs).toLowerCase();
    return { buffer, contentType: CONTENT_TYPES[ext] ?? 'application/octet-stream' };
  } catch {
    return null;
  }
}

export function parseScreenshotUrl(src: string): { project: string; filename: string } | null {
  const m = /^\/api\/screenshots\/([a-zA-Z0-9_-]+)\/([^/?#]+)$/.exec(src);
  if (!m) return null;
  return { project: m[1]!, filename: m[2]! };
}

export async function resolveScreenshotUrlToDataUrl(
  options: ScreenshotStorageOptions,
  src: string,
): Promise<string | null> {
  const parsed = parseScreenshotUrl(src);
  if (!parsed) return null;
  const read = await readScreenshotAsBuffer(options, parsed.project, parsed.filename);
  if (!read) return null;
  return `data:${read.contentType};base64,${read.buffer.toString('base64')}`;
}

export function registerScreenshotRoutes(app: Express, options: ScreenshotStorageOptions): void {
  app.post('/api/screenshots/upload', async (req: Request, res: Response) => {
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const written = await writeScreenshotFromDataUrl(options, {
        project: body.project,
        filename: body.filename,
        dataUrl: body.dataUrl,
      });
      res.json(written);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
    }
  });

  app.get('/api/screenshots/:project/:filename', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const filename = typeof req.params.filename === 'string' ? req.params.filename : '';
    const read = await readScreenshotAsBuffer(options, project, filename);
    if (!read) {
      res.status(404).json({ error: 'screenshot not found' });
      return;
    }
    res.set('Content-Type', read.contentType);
    res.set('Cache-Control', 'no-store');
    res.send(read.buffer);
  });
}
