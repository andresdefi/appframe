import { mkdir, readFile, writeFile, access, readdir, unlink } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { join, resolve, extname, basename, dirname } from 'node:path';
import { homedir } from 'node:os';
import type { Express, Request, Response } from 'express';
import sharp from 'sharp';

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

// Preview-resolution screenshots live next to the originals in a hidden
// `.previews/` subdir and are served to the in-app iframes (not export).
// Cuts Safari's decoded-bitmap memory by ~5× — the bitmap pressure was
// the root cause of the periodic screenshot reload Safari users hit.
// SVGs are vectors; their decoded memory is bounded by render size not
// source size, so no preview is generated for them.
const PREVIEW_DIR_NAME = '.previews';
// 900 px is the sweet spot from the 2026-05-19 memory investigation:
// ~37 MB decoded across 6 typical-sized iPhone screenshots (well below
// Safari's critical-pressure threshold) while staying sharp enough that
// max-zoom editing doesn't show visible softness on app UI details.
// 600 px was tighter on memory but visibly soft at high zoom; 1200 px
// preserved sharpness but barely improved over full-res memory usage.
const PREVIEW_WIDTH = 900;
const PREVIEW_RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

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
  // Throw on missing/empty rather than silently falling back to a magic
  // 'default' slug. The fallback was the root cause of a bug where
  // every upload landed in projects/default/screenshots/ when the
  // client forgot to pass an active project.
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('project name is required');
  }
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

function previewPathFor(absSourcePath: string): string {
  return join(dirname(absSourcePath), PREVIEW_DIR_NAME, basename(absSourcePath));
}

/**
 * Write a preview-resolution copy of `absSourcePath` to its sibling
 * `.previews/` dir. No-op for SVG (vector) and other non-raster sources.
 * Throws on sharp errors so callers can decide whether to fall through
 * — the upload path swallows the error since the original is the
 * source of truth.
 */
async function generatePreview(absSourcePath: string): Promise<void> {
  const ext = extname(absSourcePath).toLowerCase();
  if (!PREVIEW_RASTER_EXTENSIONS.has(ext)) return;
  const previewPath = previewPathFor(absSourcePath);
  await mkdir(dirname(previewPath), { recursive: true });
  // withoutEnlargement: leave already-small screenshots alone rather than
  // upscaling them. Format is inferred from the destination extension.
  await sharp(absSourcePath)
    .resize({ width: PREVIEW_WIDTH, withoutEnlargement: true })
    .toFile(previewPath);
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
  // Preview is best-effort: a failure here doesn't invalidate the
  // full-res upload, and the GET route lazily regenerates on first
  // request if the preview is missing.
  try {
    await generatePreview(absPath);
  } catch (err) {
    console.warn(`[screenshotStorage] preview generation failed for ${absPath}:`, err);
  }
  return {
    project,
    filename,
    relPath: `screenshots/${filename}`,
    absPath,
    url: `/api/screenshots/${project}/${filename}`,
    bytes: buffer.byteLength,
  };
}

/**
 * Walk an arbitrary JSON tree (the appframe.json `data` envelope) and
 * collect every string value of the form `/api/screenshots/<slug>/<file>`
 * matching the given project slug. Robust to schema drift — finds
 * references in screens, locale snapshots, variant snapshots, panoramic
 * element trees, background image layers, extras, and anywhere else a
 * screenshot URL might be embedded.
 */
function collectReferencedScreenshotFilenames(data: unknown, projectSlug: string): Set<string> {
  const prefix = `/api/screenshots/${projectSlug}/`;
  const referenced = new Set<string>();
  const stack: unknown[] = [data];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === null || node === undefined) continue;
    if (typeof node === 'string') {
      if (!node.startsWith(prefix)) continue;
      const rest = node.slice(prefix.length);
      // Strip any query / hash / nested path — filename is the first
      // segment after the slug.
      const filename = rest.split(/[?#/]/)[0];
      if (filename) referenced.add(filename);
      continue;
    }
    if (Array.isArray(node)) {
      for (const item of node) stack.push(item);
      continue;
    }
    if (typeof node === 'object') {
      for (const value of Object.values(node as Record<string, unknown>)) {
        stack.push(value);
      }
    }
  }
  return referenced;
}

/**
 * Boot-time sweep. For each project under `projectsRoot`:
 *   - generate any missing preview for an existing source screenshot
 *   - delete any preview whose source no longer exists
 *   - delete any source screenshot no longer referenced by the
 *     project's appframe.json (orphans from re-uploads, removed
 *     screens, deleted variants, etc.)
 *
 * Idempotent + self-healing — runs on every server start. Source-file
 * orphan cleanup is gated on a parseable appframe.json: if the project
 * file is missing or malformed we leave all sources in place rather
 * than risk deleting files for an unknown state. The orphan pass runs
 * BEFORE the preview pass so any newly-orphaned source's preview gets
 * cleaned in the same sweep. Errors are logged and skipped; the sweep
 * never throws.
 */
export async function sweepPreviews(options: ScreenshotStorageOptions): Promise<void> {
  const root = resolve(options.projectsRoot);
  let projectDirs: string[];
  try {
    projectDirs = await readdir(root);
  } catch {
    return; // no projects dir yet → nothing to sweep
  }
  for (const projectSlug of projectDirs) {
    if (!PROJECT_SLUG_RE.test(projectSlug)) continue;
    const screenshotsDir = projectScreenshotsDir(root, projectSlug);
    let sources: string[];
    try {
      sources = await readdir(screenshotsDir);
    } catch {
      continue;
    }
    let sourceFiles = sources.filter(
      (n) => SUPPORTED_EXTENSIONS.has(extname(n).toLowerCase()),
    );

    // Orphan source cleanup — read the project file, collect every
    // /api/screenshots/<slug>/<file> reference, then unlink anything
    // on disk that's not referenced. Only runs when the project file
    // is readable and well-formed; otherwise leave everything alone.
    const projectFilePath = join(root, projectSlug, 'appframe.json');
    let referenced: Set<string> | null = null;
    try {
      const raw = await readFile(projectFilePath, 'utf-8');
      const parsed = JSON.parse(raw) as unknown;
      // Project file is an envelope { data, savedAt, schemaVersion }.
      const envelope = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null;
      const projectData = envelope && 'data' in envelope ? envelope.data : envelope;
      if (projectData) {
        referenced = collectReferencedScreenshotFilenames(projectData, projectSlug);
      }
    } catch {
      // Missing / unreadable / unparseable appframe.json — skip orphan
      // cleanup for this project so we never delete files based on
      // an unknown state. The preview-side cleanup below still runs.
      referenced = null;
    }
    if (referenced) {
      const survivors: string[] = [];
      for (const name of sourceFiles) {
        if (referenced.has(name)) {
          survivors.push(name);
          continue;
        }
        try {
          await unlink(join(screenshotsDir, name));
        } catch (err) {
          console.warn(
            `[screenshotStorage] sweep: orphan source unlink failed ${projectSlug}/${name}:`,
            err,
          );
          survivors.push(name); // keep it in the list so we don't try to regenerate its preview either
        }
      }
      sourceFiles = survivors;
    }

    // Restrict the preview pass to raster sources (SVGs don't have
    // generated previews; see PREVIEW_RASTER_EXTENSIONS).
    sourceFiles = sourceFiles.filter(
      (n) => PREVIEW_RASTER_EXTENSIONS.has(extname(n).toLowerCase()),
    );
    for (const name of sourceFiles) {
      const previewPath = join(screenshotsDir, PREVIEW_DIR_NAME, name);
      if (await fileExists(previewPath)) continue;
      try {
        await generatePreview(join(screenshotsDir, name));
      } catch (err) {
        console.warn(`[screenshotStorage] sweep: skipped ${projectSlug}/${name}:`, err);
      }
    }
    // Orphan cleanup: any preview whose source is gone gets deleted.
    let previews: string[];
    try {
      previews = await readdir(join(screenshotsDir, PREVIEW_DIR_NAME));
    } catch {
      continue; // .previews/ doesn't exist → nothing to clean
    }
    const sourceSet = new Set(sourceFiles);
    for (const name of previews) {
      if (sourceSet.has(name)) continue;
      try {
        await unlink(join(screenshotsDir, PREVIEW_DIR_NAME, name));
      } catch (err) {
        console.warn(`[screenshotStorage] sweep: orphan unlink failed ${projectSlug}/${name}:`, err);
      }
    }
  }
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

  // Preview route must come before the catch-all `:filename` route — Express
  // matches in declaration order and the path includes a literal `.previews`
  // segment that the generic route would not match anyway, but explicit
  // ordering keeps the intent obvious.
  app.get('/api/screenshots/:project/.previews/:filename', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const filename = typeof req.params.filename === 'string' ? req.params.filename : '';
    try {
      sanitizeProject(project);
    } catch {
      res.status(400).json({ error: 'invalid project' });
      return;
    }
    const safeName = basename(filename);
    if (safeName !== filename || safeName.includes('..')) {
      res.status(400).json({ error: 'invalid filename' });
      return;
    }
    const screenshotsDir = projectScreenshotsDir(options.projectsRoot, project);
    const sourcePath = resolve(screenshotsDir, safeName);
    const sep = process.platform === 'win32' ? '\\' : '/';
    if (!sourcePath.startsWith(resolve(screenshotsDir) + sep)) {
      res.status(400).json({ error: 'invalid path' });
      return;
    }
    const previewPath = previewPathFor(sourcePath);
    // Lazy heal: if the preview is missing but the source exists, regenerate
    // on the fly. Keeps the route robust against manual deletes or a failed
    // upload-time preview write.
    if (!(await fileExists(previewPath))) {
      if (!(await fileExists(sourcePath))) {
        res.status(404).json({ error: 'screenshot not found' });
        return;
      }
      try {
        await generatePreview(sourcePath);
      } catch (err) {
        console.warn(`[screenshotStorage] on-demand preview failed ${project}/${safeName}:`, err);
        // Fall back to serving the full-res file so the UI never breaks.
        const fallback = await readScreenshotAsBuffer(options, project, safeName);
        if (!fallback) {
          res.status(404).json({ error: 'screenshot not found' });
          return;
        }
        res.set('Content-Type', fallback.contentType);
        res.set('Cache-Control', 'public, max-age=3600, immutable');
        res.send(fallback.buffer);
        return;
      }
    }
    try {
      const buffer = await readFile(previewPath);
      const ext = extname(previewPath).toLowerCase();
      res.set('Content-Type', CONTENT_TYPES[ext] ?? 'application/octet-stream');
      res.set('Cache-Control', 'public, max-age=3600, immutable');
      res.send(buffer);
    } catch {
      res.status(404).json({ error: 'preview not found' });
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
    // Filenames are content-addressed (collision auto-suffixes to
    // foo-2.png / foo-3.png), so a URL → content mapping is stable
    // for the lifetime of the file. Cache aggressively so the browser
    // reuses the image across page refreshes too, not just across iframes
    // within one session.
    res.set('Cache-Control', 'public, max-age=3600, immutable');
    res.send(read.buffer);
  });
}
