import { mkdir, readFile, writeFile, rename, unlink, readdir, stat, rm, cp } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Express, Request, Response } from 'express';
import { log } from './logger.js';
import { clearHistoryForProject } from './routes/projectHistory.js';
import { withProjectLock } from './routes/projectMutex.js';

const PROJECT_SLUG_RE = /^[a-zA-Z0-9_-]+$/;
const PROJECT_FILE = 'appframe.json';
const META_FILE = 'meta.json';

export const PROJECT_SCHEMA_VERSION = 1;
export const META_SCHEMA_VERSION = 1;

export interface ProjectStorageOptions {
  projectsRoot: string;
}

export interface ProjectEnvelope {
  schemaVersion: number;
  savedAt: string;
  data: unknown;
}

export class ProjectCorruptError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ProjectCorruptError';
  }
}

export class ProjectFutureSchemaError extends Error {
  readonly schemaVersion: number;
  constructor(schemaVersion: number) {
    super(
      `project file uses schemaVersion ${schemaVersion}, this server understands up to ${PROJECT_SCHEMA_VERSION}`,
    );
    this.name = 'ProjectFutureSchemaError';
    this.schemaVersion = schemaVersion;
  }
}

export function sanitizeProject(value: unknown): string {
  // Throw on missing/empty rather than silently falling back to a magic
  // 'default' slug. The fallback was the root cause of a bug where
  // screenshot uploads landed in the wrong project folder when the
  // caller forgot to pass an active project — fail loudly so future
  // callers can't repeat that mistake.
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('project name is required');
  }
  if (!PROJECT_SLUG_RE.test(value)) {
    throw new Error('project name must match /^[a-zA-Z0-9_-]+$/');
  }
  return value;
}

/**
 * Convert an arbitrary user-typed display name into a filesystem-safe slug
 * suitable for use as a directory name. Returns null if the input has no
 * usable characters after stripping.
 */
export function slugifyProjectName(displayName: string): string | null {
  const slug = displayName
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return slug.length > 0 ? slug : null;
}

/**
 * Walks any JSON-shaped value and rewrites strings of the form
 * `/api/screenshots/<oldSlug>/...` to `/api/screenshots/<newSlug>/...`.
 * Returns a new value; the input is left unchanged. URLs that don't
 * start with `/api/screenshots/<oldSlug>/` (data URLs, URLs for a
 * different project, etc.) pass through untouched.
 */
export function rewriteScreenshotProjectInJson(
  value: unknown,
  oldSlug: string,
  newSlug: string,
): unknown {
  if (oldSlug === newSlug) return value;
  const oldPrefix = `/api/screenshots/${oldSlug}/`;
  const newPrefix = `/api/screenshots/${newSlug}/`;
  function walk(node: unknown): unknown {
    if (typeof node === 'string') {
      return node.startsWith(oldPrefix) ? newPrefix + node.slice(oldPrefix.length) : node;
    }
    if (Array.isArray(node)) {
      return node.map(walk);
    }
    if (node && typeof node === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        out[k] = walk(v);
      }
      return out;
    }
    return node;
  }
  return walk(value);
}

async function pickUniqueProjectSlug(root: string, baseSlug: string): Promise<string> {
  let candidate = baseSlug;
  let i = 2;
  while (await projectExists(root, candidate)) {
    candidate = `${baseSlug}-${i}`;
    i += 1;
    if (i > 9999) throw new Error('unable to find a free project slug');
  }
  return candidate;
}

function projectDir(root: string, project: string): string {
  return join(resolve(root), project);
}

function projectFilePath(root: string, project: string): string {
  return join(projectDir(root, project), PROJECT_FILE);
}

/**
 * Write a file atomically: serialize to `<path>.tmp`, then rename
 * over the destination. A crash between write and rename leaves the
 * previous good file (or no file) in place — never a half-written
 * partial file. Used for both appframe.json and meta.json so a power
 * cut mid-save can't corrupt either one.
 */
async function writeFileAtomically(path: string, contents: string): Promise<void> {
  const tmpPath = `${path}.tmp`;
  await writeFile(tmpPath, contents, 'utf-8');
  try {
    await rename(tmpPath, path);
  } catch (err) {
    try {
      await unlink(tmpPath);
    } catch {
      // ignore — best-effort cleanup
    }
    throw err;
  }
}

/**
 * Writes the project JSON atomically: write to `.tmp` then rename. A crash
 * between write and rename leaves the previous good file (or no file) on
 * disk — never a half-written `appframe.json`.
 */
export async function writeProject(
  options: ProjectStorageOptions,
  project: string,
  data: unknown,
  now: () => Date = () => new Date(),
): Promise<{ absPath: string; savedAt: string }> {
  const safeProject = sanitizeProject(project);
  const dir = projectDir(options.projectsRoot, safeProject);
  await mkdir(dir, { recursive: true });
  const absPath = projectFilePath(options.projectsRoot, safeProject);
  const envelope: ProjectEnvelope = {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    savedAt: now().toISOString(),
    data,
  };
  await writeFileAtomically(absPath, JSON.stringify(envelope, null, 2));
  // Stamp the same savedAt onto meta.json so listProjects can sort the
  // picker without parsing every appframe.json. Preserve the existing
  // displayName / createdAt / lastOpenedAt when the meta already exists;
  // synthesize sensible defaults when it doesn't (e.g. for a project
  // created by hand outside the UI).
  const existingMeta = await readMetaSafe(options.projectsRoot, safeProject);
  const meta: ProjectMeta = {
    schemaVersion: META_SCHEMA_VERSION,
    name: safeProject,
    displayName:
      typeof existingMeta?.displayName === 'string' && existingMeta.displayName.length > 0
        ? existingMeta.displayName
        : safeProject,
    createdAt:
      typeof existingMeta?.createdAt === 'string' && existingMeta.createdAt.length > 0
        ? existingMeta.createdAt
        : envelope.savedAt,
    lastOpenedAt:
      typeof existingMeta?.lastOpenedAt === 'string' && existingMeta.lastOpenedAt.length > 0
        ? existingMeta.lastOpenedAt
        : envelope.savedAt,
    savedAt: envelope.savedAt,
  };
  await writeMeta(options.projectsRoot, safeProject, meta);
  return { absPath, savedAt: envelope.savedAt };
}

/**
 * Reads and parses the project JSON. Returns null when the file doesn't
 * exist, throws ProjectCorruptError on parse failure, and
 * ProjectFutureSchemaError when the schemaVersion is newer than the server
 * understands. A missing schemaVersion is treated as legacy v0 and the
 * envelope is reconstructed with `data` = the parsed root.
 */
export async function readProject(
  options: ProjectStorageOptions,
  project: string,
): Promise<ProjectEnvelope | null> {
  const safeProject = sanitizeProject(project);
  const absPath = projectFilePath(options.projectsRoot, safeProject);
  let raw: string;
  try {
    raw = await readFile(absPath, 'utf-8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new ProjectCorruptError(
      `project file is not valid JSON: ${(err as Error).message}`,
      { cause: err },
    );
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new ProjectCorruptError('project file root is not a JSON object');
  }
  const obj = parsed as Record<string, unknown>;
  const versionRaw = obj.schemaVersion;
  if (typeof versionRaw !== 'number') {
    // Legacy / pre-versioned file — wrap as if it were a v0 envelope.
    return { schemaVersion: 0, savedAt: '', data: obj };
  }
  if (versionRaw > PROJECT_SCHEMA_VERSION) {
    throw new ProjectFutureSchemaError(versionRaw);
  }
  const savedAtRaw = obj.savedAt;
  return {
    schemaVersion: versionRaw,
    savedAt: typeof savedAtRaw === 'string' ? savedAtRaw : '',
    data: obj.data,
  };
}

// ---------------------------------------------------------------------------
// Phase 3: multi-project listing + CRUD
// ---------------------------------------------------------------------------

export interface ProjectMeta {
  schemaVersion: number;
  /** Filesystem slug — the directory name. */
  name: string;
  /** Human-readable name shown in the UI. Defaults to the slug if unset. */
  displayName: string;
  createdAt: string;
  lastOpenedAt: string;
  /**
   * ISO timestamp of the most recent appframe.json write. Duplicated
   * here so listProjects can sort the picker by recency without having
   * to open and parse every project's content file. Older meta files
   * may lack this field; listProjects falls back to the appframe.json
   * mtime in that case.
   */
  savedAt?: string;
}

export interface ProjectSummary {
  /** Directory slug. */
  name: string;
  /** Human-readable name. Falls back to slug when meta.json is missing. */
  displayName: string;
  createdAt: string;
  lastOpenedAt: string;
  savedAt: string;
  hasProjectFile: boolean;
}

function metaPath(root: string, project: string): string {
  return join(projectDir(root, project), META_FILE);
}

async function readMetaSafe(root: string, project: string): Promise<Partial<ProjectMeta> | null> {
  try {
    const raw = await readFile(metaPath(root, project), 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as Partial<ProjectMeta>;
  } catch {
    return null;
  }
}

async function writeMeta(root: string, project: string, meta: ProjectMeta): Promise<void> {
  const dir = projectDir(root, project);
  await mkdir(dir, { recursive: true });
  // Atomic write so a crash mid-save can't leave a zero-byte meta.json
  // (which would silently lose the project's display name on next list).
  await writeFileAtomically(metaPath(root, project), JSON.stringify(meta, null, 2));
}

export async function touchProject(
  options: ProjectStorageOptions,
  project: string,
  now: () => Date = () => new Date(),
): Promise<ProjectMeta> {
  const safeProject = sanitizeProject(project);
  const existing = await readMetaSafe(options.projectsRoot, safeProject);
  const isoNow = now().toISOString();
  const meta: ProjectMeta = {
    schemaVersion: META_SCHEMA_VERSION,
    name: safeProject,
    displayName:
      typeof existing?.displayName === 'string' && existing.displayName.length > 0
        ? existing.displayName
        : typeof existing?.name === 'string' && existing.name.length > 0
          ? existing.name
          : safeProject,
    createdAt:
      typeof existing?.createdAt === 'string' && existing.createdAt.length > 0
        ? existing.createdAt
        : isoNow,
    lastOpenedAt: isoNow,
    // touchProject only bumps lastOpenedAt — preserve the previous
    // savedAt so opening a project doesn't make it appear "more recently
    // saved" than it actually is.
    ...(typeof existing?.savedAt === 'string' && existing.savedAt.length > 0
      ? { savedAt: existing.savedAt }
      : {}),
  };
  await writeMeta(options.projectsRoot, safeProject, meta);
  return meta;
}

/**
 * Scans the projects root and returns a summary for each directory that
 * contains an `appframe.json`. Sorted by lastOpenedAt desc (most recent
 * first). Directories without a project file are ignored — they're not
 * appframe projects. A broken meta.json doesn't disqualify the entry, it
 * just leaves the timestamps empty so the UI can show the row but won't
 * crash on the listing.
 */
export async function listProjects(options: ProjectStorageOptions): Promise<ProjectSummary[]> {
  const root = resolve(options.projectsRoot);
  let entries: string[];
  try {
    entries = await readdir(root);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }

  const summaries: ProjectSummary[] = [];
  for (const name of entries) {
    if (!PROJECT_SLUG_RE.test(name)) continue;
    const projectPath = join(root, name);
    try {
      const s = await stat(projectPath);
      if (!s.isDirectory()) continue;
    } catch {
      continue;
    }

    const projectFile = join(projectPath, PROJECT_FILE);
    let projectFileMtime: Date;
    try {
      const s = await stat(projectFile);
      if (!s.isFile()) continue;
      projectFileMtime = s.mtime;
    } catch {
      // No project file — skip.
      continue;
    }

    // Read meta.json once. Both displayName + savedAt + timestamps come
    // from here so we don't have to parse the (much larger)
    // appframe.json just to populate the picker row. Falls back to the
    // appframe.json mtime for savedAt when meta lacks the field (older
    // files created before savedAt moved into meta).
    const meta = await readMetaSafe(root, name);
    const savedAt =
      (typeof meta?.savedAt === 'string' && meta.savedAt.length > 0
        ? meta.savedAt
        : projectFileMtime?.toISOString()) ?? '';
    summaries.push({
      name,
      displayName:
        typeof meta?.displayName === 'string' && meta.displayName.length > 0
          ? meta.displayName
          : name,
      createdAt: typeof meta?.createdAt === 'string' ? meta.createdAt : '',
      lastOpenedAt: typeof meta?.lastOpenedAt === 'string' ? meta.lastOpenedAt : savedAt,
      savedAt,
      hasProjectFile: true,
    });
  }

  // Most recently used first. Empty timestamps sort to the end.
  summaries.sort((a, b) => {
    const aKey = a.lastOpenedAt || a.savedAt || '';
    const bKey = b.lastOpenedAt || b.savedAt || '';
    if (aKey === bKey) return a.name.localeCompare(b.name);
    return aKey < bKey ? 1 : -1;
  });

  return summaries;
}

async function projectExists(root: string, project: string): Promise<boolean> {
  try {
    const s = await stat(projectDir(root, project));
    return s.isDirectory();
  } catch {
    return false;
  }
}

export async function createProject(
  options: ProjectStorageOptions,
  displayNameOrSlug: string,
  now: () => Date = () => new Date(),
): Promise<ProjectMeta> {
  const trimmed = (displayNameOrSlug ?? '').trim();
  if (!trimmed) throw new Error('project name is required');
  // If the caller passed a valid slug, use it as-is (preserves "default"
  // and other already-slugified callers). Otherwise treat the input as a
  // human-readable display name and slugify it.
  const isAlreadySlug = PROJECT_SLUG_RE.test(trimmed);
  const baseSlug = isAlreadySlug ? trimmed : slugifyProjectName(trimmed);
  if (!baseSlug) throw new Error('project name has no usable characters');
  const safeName = await pickUniqueProjectSlug(options.projectsRoot, baseSlug);
  const dir = projectDir(options.projectsRoot, safeName);
  await mkdir(dir, { recursive: true });
  const isoNow = now().toISOString();
  const meta: ProjectMeta = {
    schemaVersion: META_SCHEMA_VERSION,
    name: safeName,
    displayName: trimmed,
    createdAt: isoNow,
    lastOpenedAt: isoNow,
  };
  await writeMeta(options.projectsRoot, safeName, meta);
  // Seed a minimal but VALID editor-state envelope so listProjects picks
  // it up immediately AND the MCP write endpoints (which expect
  // data.screens to be an array) work on a freshly-created project
  // without first round-tripping through a browser session.
  //
  // Top-level shape mirrors what the browser autosave would write on
  // first save (see ProjectSnapshot / VariantSnapshot in client/store.ts):
  // include the panoramic-side fields and the structural locale maps so
  // the hydrate path's `coerceVariantSnapshot` accepts the envelope as a
  // real (non-fresh) project and merges per-screen data correctly.
  // Without `panoramicElements` here, hydrate previously bailed to the
  // previous-project fallback and silently dropped MCP-written edits.
  // Theme-derived top-level fields (platform / previewW / previewH /
  // panoramicBackground / panoramicEffects / exportSize) are deliberately
  // omitted — they fall back per-field in coerceVariantSnapshot from the
  // currently-loaded slim config so the new project inherits sane
  // canvas dimensions on hydrate.
  await writeProject(options, safeName, {
    screens: [],
    variants: [],
    sessionLocales: {},
    localeScreens: {},
    localePanoramicElements: {},
    locale: 'default',
    isPanoramic: false,
    selectedScreen: 0,
    selectedElementIndex: null,
    panoramicElements: [],
  });
  return meta;
}

export async function renameProject(
  options: ProjectStorageOptions,
  from: string,
  toDisplayName: string,
): Promise<ProjectMeta> {
  const safeFrom = sanitizeProject(from);
  const trimmed = (toDisplayName ?? '').trim();
  if (!trimmed) throw new Error('new project name is required');
  if (!(await projectExists(options.projectsRoot, safeFrom))) {
    throw new Error(`project "${safeFrom}" not found`);
  }

  const isAlreadySlug = PROJECT_SLUG_RE.test(trimmed);
  const baseSlug = isAlreadySlug ? trimmed : slugifyProjectName(trimmed);
  if (!baseSlug) throw new Error('new project name has no usable characters');

  const existing = await readMetaSafe(options.projectsRoot, safeFrom);
  // If only the display name changed (same slug), keep the directory put.
  if (baseSlug === safeFrom) {
    const meta: ProjectMeta = {
      schemaVersion: META_SCHEMA_VERSION,
      name: safeFrom,
      displayName: trimmed,
      createdAt: typeof existing?.createdAt === 'string' ? existing.createdAt : '',
      lastOpenedAt: typeof existing?.lastOpenedAt === 'string' ? existing.lastOpenedAt : '',
      ...(typeof existing?.savedAt === 'string' && existing.savedAt.length > 0
        ? { savedAt: existing.savedAt }
        : {}),
    };
    await writeMeta(options.projectsRoot, safeFrom, meta);
    return meta;
  }

  if (await projectExists(options.projectsRoot, baseSlug)) {
    throw new Error(`project "${baseSlug}" already exists`);
  }
  // Validate-then-mutate. Read + rewrite the JSON in memory first so a
  // corrupt / future-schema project file aborts BEFORE we touch the
  // filesystem. Previously we renamed the directory, then tried to
  // read; if the read failed the directory was already at the new
  // name but the JSON inside still pointed at the old slug — a
  // half-renamed state we couldn't recover from.
  const preflight = await readProject(options, safeFrom);
  const rewritten = preflight
    ? rewriteScreenshotProjectInJson(preflight.data, safeFrom, baseSlug)
    : null;
  await rename(
    projectDir(options.projectsRoot, safeFrom),
    projectDir(options.projectsRoot, baseSlug),
  );
  // Now the dir is at the new path. Write the precomputed rewritten
  // JSON. If THIS write fails we roll the rename back so the user
  // ends up with the project under its original slug, not stranded
  // with broken screenshot URLs at the new slug.
  if (rewritten) {
    try {
      await writeProject(options, baseSlug, rewritten);
    } catch (err) {
      try {
        await rename(
          projectDir(options.projectsRoot, baseSlug),
          projectDir(options.projectsRoot, safeFrom),
        );
      } catch (rollbackErr) {
        log.warn('rename rollback also failed', { error: String(rollbackErr) });
      }
      throw err;
    }
  }
  const meta: ProjectMeta = {
    schemaVersion: META_SCHEMA_VERSION,
    name: baseSlug,
    displayName: trimmed,
    createdAt: typeof existing?.createdAt === 'string' ? existing.createdAt : '',
    lastOpenedAt: typeof existing?.lastOpenedAt === 'string' ? existing.lastOpenedAt : '',
    // Renaming doesn't change content; preserve the savedAt that
    // writeProject (via the rewrite step above, if it fired) already
    // wrote, otherwise inherit from the source meta.
    ...(typeof existing?.savedAt === 'string' && existing.savedAt.length > 0
      ? { savedAt: existing.savedAt }
      : {}),
  };
  await writeMeta(options.projectsRoot, baseSlug, meta);
  return meta;
}

export async function duplicateProject(
  options: ProjectStorageOptions,
  from: string,
  toDisplayName: string,
  now: () => Date = () => new Date(),
): Promise<ProjectMeta> {
  const safeFrom = sanitizeProject(from);
  const trimmed = (toDisplayName ?? '').trim();
  if (!trimmed) throw new Error('duplicate target name is required');
  if (!(await projectExists(options.projectsRoot, safeFrom))) {
    throw new Error(`project "${safeFrom}" not found`);
  }
  const isAlreadySlug = PROJECT_SLUG_RE.test(trimmed);
  const baseSlug = isAlreadySlug ? trimmed : slugifyProjectName(trimmed);
  if (!baseSlug) throw new Error('duplicate target name has no usable characters');
  const safeTo = await pickUniqueProjectSlug(options.projectsRoot, baseSlug);
  // Same validate-then-mutate dance as renameProject: read + rewrite
  // the source JSON in memory before any FS change. A corrupt source
  // file aborts here instead of leaving a half-copied destination
  // behind.
  const preflight = await readProject(options, safeFrom);
  const rewritten = preflight
    ? rewriteScreenshotProjectInJson(preflight.data, safeFrom, safeTo)
    : null;
  await cp(
    projectDir(options.projectsRoot, safeFrom),
    projectDir(options.projectsRoot, safeTo),
    { recursive: true },
  );
  // Now the destination dir exists with the source's JSON. Overwrite
  // with the rewritten copy so /api/screenshots/<safeFrom>/... URLs
  // point at the new slug. If the write fails we clean up the
  // half-copied destination dir so the user isn't left with a stranded
  // project that references the wrong screenshot path.
  if (rewritten) {
    try {
      await writeProject(options, safeTo, rewritten);
    } catch (err) {
      try {
        await rm(projectDir(options.projectsRoot, safeTo), { recursive: true, force: true });
      } catch (cleanupErr) {
        log.warn('duplicate cleanup failed', { error: String(cleanupErr) });
      }
      throw err;
    }
  }
  const isoNow = now().toISOString();
  const meta: ProjectMeta = {
    schemaVersion: META_SCHEMA_VERSION,
    name: safeTo,
    displayName: trimmed,
    createdAt: isoNow,
    lastOpenedAt: isoNow,
  };
  await writeMeta(options.projectsRoot, safeTo, meta);
  return meta;
}

export async function deleteProject(
  options: ProjectStorageOptions,
  project: string,
): Promise<void> {
  const safeProject = sanitizeProject(project);
  if (!(await projectExists(options.projectsRoot, safeProject))) {
    throw new Error(`project "${safeProject}" not found`);
  }
  await rm(projectDir(options.projectsRoot, safeProject), { recursive: true, force: true });
}

export function registerProjectRoutes(app: Express, options: ProjectStorageOptions): void {
  // List projects. Defined before /:project so it doesn't accidentally
  // match the wildcard route.
  app.get('/api/projects', async (_req: Request, res: Response) => {
    try {
      const projects = await listProjects(options);
      res.json({ projects });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/projects', async (req: Request, res: Response) => {
    try {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const name = typeof body.name === 'string' ? body.name : '';
      if (!name) {
        res.status(400).json({ error: 'project name is required' });
        return;
      }
      const meta = await createProject(options, name);
      res.json({ success: true, meta });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
    }
  });

  app.post('/api/projects/:project/rename', async (req: Request, res: Response) => {
    const from = typeof req.params.project === 'string' ? req.params.project : '';
    await withProjectLock(from, async () => {
      try {
        const body = (req.body ?? {}) as Record<string, unknown>;
        const to = typeof body.to === 'string' ? body.to : '';
        const meta = await renameProject(options, from, to);
        res.json({ success: true, meta });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        res.status(400).json({ error: message });
      }
    });
  });

  app.post('/api/projects/:project/duplicate', async (req: Request, res: Response) => {
    const from = typeof req.params.project === 'string' ? req.params.project : '';
    await withProjectLock(from, async () => {
      try {
        const body = (req.body ?? {}) as Record<string, unknown>;
        const to = typeof body.to === 'string' ? body.to : '';
        const meta = await duplicateProject(options, from, to);
        res.json({ success: true, meta });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        res.status(400).json({ error: message });
      }
    });
  });

  app.post('/api/projects/:project/touch', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    await withProjectLock(project, async () => {
      try {
        const meta = await touchProject(options, project);
        res.json({ success: true, meta });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        res.status(400).json({ error: message });
      }
    });
  });

  app.delete('/api/projects/:project', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    await withProjectLock(project, async () => {
      try {
        await deleteProject(options, project);
        clearHistoryForProject(project);
        res.json({ success: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        res.status(400).json({ error: message });
      }
    });
  });

  app.put('/api/projects/:project', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    await withProjectLock(project, async () => {
      try {
        const written = await writeProject(options, project, body);
        res.json({ success: true, savedAt: written.savedAt, absPath: written.absPath });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        res.status(400).json({ error: message });
      }
    });
  });

  app.get('/api/projects/:project', async (req: Request, res: Response) => {
    try {
      const project = typeof req.params.project === 'string' ? req.params.project : '';
      const envelope = await readProject(options, project);
      if (!envelope) {
        res.status(404).json({ error: 'project not found' });
        return;
      }
      res.json(envelope);
    } catch (err) {
      if (err instanceof ProjectCorruptError) {
        res.status(422).json({ error: err.message, corrupt: true });
        return;
      }
      if (err instanceof ProjectFutureSchemaError) {
        res.status(409).json({
          error: err.message,
          futureSchema: true,
          schemaVersion: err.schemaVersion,
        });
        return;
      }
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
    }
  });
}
