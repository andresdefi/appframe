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
  if (typeof value !== 'string' || value.length === 0) return 'default';
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
  const tmpPath = `${absPath}.tmp`;
  const envelope: ProjectEnvelope = {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    savedAt: now().toISOString(),
    data,
  };
  const serialized = JSON.stringify(envelope, null, 2);
  await writeFile(tmpPath, serialized, 'utf-8');
  try {
    await rename(tmpPath, absPath);
  } catch (err) {
    // If rename fails, try to clean up the tmp file so it doesn't linger.
    try {
      await unlink(tmpPath);
    } catch {
      // ignore
    }
    throw err;
  }
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
  await writeFile(metaPath(root, project), JSON.stringify(meta, null, 2), 'utf-8');
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
    let savedAt = '';
    try {
      const s = await stat(projectFile);
      hasProjectFile = s.isFile();
      // Read savedAt from the file content if available, falling back to
      // the file's mtime so the picker still has a useful sort key when an
      // older file lacks the field.
      if (hasProjectFile) {
        try {
          const env = await readProject(options, name);
          savedAt = env?.savedAt ?? s.mtime.toISOString();
        } catch {
          savedAt = s.mtime.toISOString();
        }
      }
    } catch {
      // No project file — skip.
      continue;
    }

    if (!hasProjectFile) continue;

    const meta = await readMetaSafe(root, name);
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
  const meta: ProjectMeta = {
    schemaVersion: META_SCHEMA_VERSION,
    name: baseSlug,
    displayName: trimmed,
    createdAt: typeof existing?.createdAt === 'string' ? existing.createdAt : '',
    lastOpenedAt: typeof existing?.lastOpenedAt === 'string' ? existing.lastOpenedAt : '',
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
      const project = typeof req.params.project === 'string' ? req.params.project : 'default';
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
      const project = typeof req.params.project === 'string' ? req.params.project : 'default';
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
