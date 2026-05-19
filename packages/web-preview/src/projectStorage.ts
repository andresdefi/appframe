import { mkdir, readFile, writeFile, rename, unlink, readdir, stat, rm, cp } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Express, Request, Response } from 'express';

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
    let isDir = false;
    try {
      const s = await stat(projectPath);
      isDir = s.isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;

    const projectFile = join(projectPath, PROJECT_FILE);
    let hasProjectFile = false;
    let projectFileMtime: Date | null = null;
    try {
      const s = await stat(projectFile);
      hasProjectFile = s.isFile();
      projectFileMtime = s.mtime;
    } catch {
      // No project file — skip.
      continue;
    }

    if (!hasProjectFile) continue;

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
  // Seed an empty project file so listProjects picks it up immediately
  // (a brand-new project shouldn't have to wait for the first edit to
  // become visible in the picker).
  await writeProject(options, safeName, {});
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
  await rename(
    projectDir(options.projectsRoot, safeFrom),
    projectDir(options.projectsRoot, baseSlug),
  );
  // The directory move leaves screenshot files in place under the new
  // path on disk, but the URLs persisted inside appframe.json still
  // reference the old slug — every <img src="/api/screenshots/<old>/...">
  // would 404 after the rename. Rewrite those URLs to the new slug so
  // the project's own references stay valid.
  const envelope = await readProject(options, baseSlug);
  if (envelope) {
    const rewritten = rewriteScreenshotProjectInJson(envelope.data, safeFrom, baseSlug);
    await writeProject(options, baseSlug, rewritten);
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
  await cp(
    projectDir(options.projectsRoot, safeFrom),
    projectDir(options.projectsRoot, safeTo),
    { recursive: true },
  );
  // cp leaves every /api/screenshots/<safeFrom>/... URL inside the copied
  // appframe.json pointing at the original project. Delete or rename the
  // source and the duplicate breaks. Rewrite those URLs to the new slug
  // here, same as renameProject does at the top of this file.
  const envelope = await readProject(options, safeTo);
  if (envelope) {
    const rewritten = rewriteScreenshotProjectInJson(envelope.data, safeFrom, safeTo);
    await writeProject(options, safeTo, rewritten);
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
    try {
      const from = typeof req.params.project === 'string' ? req.params.project : '';
      const body = (req.body ?? {}) as Record<string, unknown>;
      const to = typeof body.to === 'string' ? body.to : '';
      const meta = await renameProject(options, from, to);
      res.json({ success: true, meta });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
    }
  });

  app.post('/api/projects/:project/duplicate', async (req: Request, res: Response) => {
    try {
      const from = typeof req.params.project === 'string' ? req.params.project : '';
      const body = (req.body ?? {}) as Record<string, unknown>;
      const to = typeof body.to === 'string' ? body.to : '';
      const meta = await duplicateProject(options, from, to);
      res.json({ success: true, meta });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
    }
  });

  app.post('/api/projects/:project/touch', async (req: Request, res: Response) => {
    try {
      const project = typeof req.params.project === 'string' ? req.params.project : '';
      const meta = await touchProject(options, project);
      res.json({ success: true, meta });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
    }
  });

  app.delete('/api/projects/:project', async (req: Request, res: Response) => {
    try {
      const project = typeof req.params.project === 'string' ? req.params.project : '';
      await deleteProject(options, project);
      res.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
    }
  });

  app.put('/api/projects/:project', async (req: Request, res: Response) => {
    try {
      const project = typeof req.params.project === 'string' ? req.params.project : '';
      const body = req.body;
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        res.status(400).json({ error: 'request body must be a JSON object' });
        return;
      }
      const written = await writeProject(options, project, body);
      res.json({ success: true, savedAt: written.savedAt, absPath: written.absPath });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
    }
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
