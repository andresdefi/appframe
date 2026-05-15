import { mkdir, readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Express, Request, Response } from 'express';

const PROJECT_SLUG_RE = /^[a-zA-Z0-9_-]+$/;
const PROJECT_FILE = 'appframe.json';

export const PROJECT_SCHEMA_VERSION = 1;

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

export function registerProjectRoutes(app: Express, options: ProjectStorageOptions): void {
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
