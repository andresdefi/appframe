import { describe, it, expect, beforeEach } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';
import { mkdtemp, readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  PROJECT_SCHEMA_VERSION,
  ProjectCorruptError,
  ProjectFutureSchemaError,
  createProject,
  deleteProject,
  duplicateProject,
  listProjects,
  readProject,
  registerProjectRoutes,
  renameProject,
  touchProject,
  writeProject,
  type ProjectStorageOptions,
} from './projectStorage.js';

async function makeRoot(): Promise<ProjectStorageOptions> {
  const dir = await mkdtemp(join(tmpdir(), 'appframe-project-'));
  return { projectsRoot: dir };
}

function buildApp(options: ProjectStorageOptions): Express {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  registerProjectRoutes(app, options);
  return app;
}

describe('writeProject / readProject', () => {
  it('round-trips a snapshot through disk', async () => {
    const options = await makeRoot();
    const data = { screens: [{ headline: 'hi' }], exportSize: 'app-store' };
    const written = await writeProject(options, 'default', data);
    expect(written.absPath.endsWith('/default/appframe.json')).toBe(true);
    const envelope = await readProject(options, 'default');
    expect(envelope).not.toBeNull();
    expect(envelope!.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
    expect(envelope!.savedAt).toBe(written.savedAt);
    expect(envelope!.data).toEqual(data);
  });

  it('returns null when no file exists', async () => {
    const options = await makeRoot();
    const envelope = await readProject(options, 'default');
    expect(envelope).toBeNull();
  });

  it('rejects bad project names', async () => {
    const options = await makeRoot();
    await expect(writeProject(options, '../escape', {})).rejects.toThrow();
    await expect(readProject(options, '../escape')).rejects.toThrow();
  });

  it('throws ProjectCorruptError on invalid JSON', async () => {
    const options = await makeRoot();
    await writeProject(options, 'default', {});
    const filePath = join(options.projectsRoot, 'default', 'appframe.json');
    await writeFile(filePath, '{not json', 'utf-8');
    await expect(readProject(options, 'default')).rejects.toThrow(ProjectCorruptError);
  });

  it('throws ProjectCorruptError when root is not an object', async () => {
    const options = await makeRoot();
    await writeProject(options, 'default', {});
    const filePath = join(options.projectsRoot, 'default', 'appframe.json');
    await writeFile(filePath, '[1,2,3]', 'utf-8');
    await expect(readProject(options, 'default')).rejects.toThrow(ProjectCorruptError);
  });

  it('treats files without schemaVersion as legacy v0 (no destructive read)', async () => {
    const options = await makeRoot();
    const filePath = join(options.projectsRoot, 'default', 'appframe.json');
    await writeProject(options, 'default', {}); // creates the directory
    const legacy = { screens: [{ headline: 'legacy' }] };
    await writeFile(filePath, JSON.stringify(legacy), 'utf-8');
    const envelope = await readProject(options, 'default');
    expect(envelope).not.toBeNull();
    expect(envelope!.schemaVersion).toBe(0);
    expect(envelope!.data).toEqual(legacy);
  });

  it('throws ProjectFutureSchemaError on newer versions instead of dropping fields', async () => {
    const options = await makeRoot();
    await writeProject(options, 'default', {});
    const filePath = join(options.projectsRoot, 'default', 'appframe.json');
    await writeFile(
      filePath,
      JSON.stringify({ schemaVersion: PROJECT_SCHEMA_VERSION + 99, savedAt: '', data: {} }),
      'utf-8',
    );
    await expect(readProject(options, 'default')).rejects.toThrow(ProjectFutureSchemaError);
  });

  it('writes atomically: tmp file does not linger after a successful write', async () => {
    const options = await makeRoot();
    await writeProject(options, 'default', { ok: true });
    const tmpPath = join(options.projectsRoot, 'default', 'appframe.json.tmp');
    await expect(stat(tmpPath)).rejects.toThrow();
  });

  it('overwrites an existing file in place without leaving a tmp', async () => {
    const options = await makeRoot();
    await writeProject(options, 'default', { v: 1 });
    await writeProject(options, 'default', { v: 2 });
    const envelope = await readProject(options, 'default');
    expect((envelope!.data as { v: number }).v).toBe(2);
    const tmpPath = join(options.projectsRoot, 'default', 'appframe.json.tmp');
    await expect(stat(tmpPath)).rejects.toThrow();
  });
});

describe('PUT/GET /api/projects/:project', () => {
  let app: Express;
  let options: ProjectStorageOptions;

  beforeEach(async () => {
    options = await makeRoot();
    app = buildApp(options);
  });

  it('saves and loads a project round-trip', async () => {
    const payload = { screens: [{ headline: 'hi' }], exportSize: 'app-store' };
    const put = await request(app).put('/api/projects/default').send(payload);
    expect(put.status).toBe(200);
    expect(put.body.success).toBe(true);
    expect(typeof put.body.savedAt).toBe('string');

    const get = await request(app).get('/api/projects/default');
    expect(get.status).toBe(200);
    expect(get.body.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
    expect(get.body.data).toEqual(payload);
  });

  it('returns 404 when the project does not exist', async () => {
    const res = await request(app).get('/api/projects/default');
    expect(res.status).toBe(404);
  });

  it('returns 422 for corrupt JSON instead of nuking it', async () => {
    await request(app).put('/api/projects/default').send({ ok: true });
    const filePath = join(options.projectsRoot, 'default', 'appframe.json');
    await writeFile(filePath, 'not valid json', 'utf-8');
    const res = await request(app).get('/api/projects/default');
    expect(res.status).toBe(422);
    expect(res.body.corrupt).toBe(true);

    // File should still be on disk — the read failed loud, didn't destroy it.
    const raw = await readFile(filePath, 'utf-8');
    expect(raw).toBe('not valid json');
  });

  it('returns 409 when the file is from a future schema', async () => {
    await request(app).put('/api/projects/default').send({ ok: true });
    const filePath = join(options.projectsRoot, 'default', 'appframe.json');
    await writeFile(
      filePath,
      JSON.stringify({ schemaVersion: PROJECT_SCHEMA_VERSION + 5, data: {} }),
      'utf-8',
    );
    const res = await request(app).get('/api/projects/default');
    expect(res.status).toBe(409);
    expect(res.body.futureSchema).toBe(true);
    expect(res.body.schemaVersion).toBe(PROJECT_SCHEMA_VERSION + 5);
  });

  it('rejects non-object bodies with 400', async () => {
    const res = await request(app)
      .put('/api/projects/default')
      .set('Content-Type', 'application/json')
      .send('"plain string"');
    expect(res.status).toBe(400);
  });

  it('rejects bad project slugs with 400', async () => {
    const res = await request(app).put('/api/projects/bad name').send({ ok: true });
    // Express routing treats spaces as literal — the slug check fires
    // server-side and 400s.
    expect([400, 404]).toContain(res.status);
  });
});

describe('createProject / listProjects / touchProject', () => {
  it('createProject seeds meta.json + appframe.json; collisions auto-suffix', async () => {
    const options = await makeRoot();
    const meta = await createProject(options, 'alpha');
    expect(meta.name).toBe('alpha');
    expect(meta.displayName).toBe('alpha');
    expect(meta.createdAt).toBe(meta.lastOpenedAt);
    const projectFile = join(options.projectsRoot, 'alpha', 'appframe.json');
    const metaFile = join(options.projectsRoot, 'alpha', 'meta.json');
    await expect(stat(projectFile)).resolves.toBeTruthy();
    await expect(stat(metaFile)).resolves.toBeTruthy();
    // Creating with the same name disambiguates the directory but keeps
    // the display name as the user typed it.
    const dup = await createProject(options, 'alpha');
    expect(dup.name).toBe('alpha-2');
    expect(dup.displayName).toBe('alpha');
  });

  it('createProject accepts human display names and slugifies them', async () => {
    const options = await makeRoot();
    const meta = await createProject(options, 'Impostor Party Game');
    expect(meta.name).toBe('impostor-party-game');
    expect(meta.displayName).toBe('Impostor Party Game');
    await expect(
      stat(join(options.projectsRoot, 'impostor-party-game', 'meta.json')),
    ).resolves.toBeTruthy();
  });

  it('createProject rejects empty / unusable names', async () => {
    const options = await makeRoot();
    await expect(createProject(options, '')).rejects.toThrow();
    await expect(createProject(options, '   ')).rejects.toThrow();
    await expect(createProject(options, '!!!')).rejects.toThrow(/usable characters/);
  });

  it('listProjects ignores directories without an appframe.json', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha');
    await mkdir(join(options.projectsRoot, 'not-a-project'));
    await writeFile(join(options.projectsRoot, 'stray.txt'), 'hi', 'utf-8');
    const projects = await listProjects(options);
    expect(projects.map((p) => p.name)).toEqual(['alpha']);
  });

  it('listProjects returns an empty array when the root does not exist', async () => {
    const projects = await listProjects({ projectsRoot: join(tmpdir(), 'definitely-does-not-exist-xyz') });
    expect(projects).toEqual([]);
  });

  it('listProjects survives a broken meta.json without crashing', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha');
    await writeFile(join(options.projectsRoot, 'alpha', 'meta.json'), '{not json', 'utf-8');
    const projects = await listProjects(options);
    expect(projects).toHaveLength(1);
    expect(projects[0]!.name).toBe('alpha');
    // lastOpenedAt falls back to savedAt or empty, not undefined.
    expect(typeof projects[0]!.lastOpenedAt).toBe('string');
  });

  it('listProjects sorts by lastOpenedAt desc', async () => {
    const options = await makeRoot();
    await createProject(options, 'oldest', () => new Date('2026-01-01T00:00:00Z'));
    await createProject(options, 'middle', () => new Date('2026-03-01T00:00:00Z'));
    await createProject(options, 'newest', () => new Date('2026-05-01T00:00:00Z'));
    const projects = await listProjects(options);
    expect(projects.map((p) => p.name)).toEqual(['newest', 'middle', 'oldest']);
  });

  it('touchProject bumps lastOpenedAt and preserves createdAt', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha', () => new Date('2026-01-01T00:00:00Z'));
    const next = await touchProject(options, 'alpha', () => new Date('2026-06-01T12:00:00Z'));
    expect(next.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(next.lastOpenedAt).toBe('2026-06-01T12:00:00.000Z');
  });
});

describe('renameProject / duplicateProject / deleteProject', () => {
  it('renameProject moves the directory and rewrites meta', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha');
    await writeProject(options, 'alpha', { headline: 'hi' });
    const meta = await renameProject(options, 'alpha', 'beta');
    expect(meta.name).toBe('beta');
    await expect(stat(join(options.projectsRoot, 'alpha'))).rejects.toThrow();
    await expect(stat(join(options.projectsRoot, 'beta', 'appframe.json'))).resolves.toBeTruthy();
    const env = await readProject(options, 'beta');
    expect((env!.data as { headline: string }).headline).toBe('hi');
  });

  it('renameProject refuses to clobber an existing destination', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha');
    await createProject(options, 'beta');
    await expect(renameProject(options, 'alpha', 'beta')).rejects.toThrow(/already exists/);
    // Source must still be present.
    await expect(stat(join(options.projectsRoot, 'alpha'))).resolves.toBeTruthy();
  });

  it('renameProject errors when the source does not exist', async () => {
    const options = await makeRoot();
    await expect(renameProject(options, 'ghost', 'beta')).rejects.toThrow(/not found/);
  });

  it('duplicateProject copies the directory contents', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha');
    await writeProject(options, 'alpha', { headline: 'hi' });
    await writeFile(
      join(options.projectsRoot, 'alpha', 'screenshots', 'home.png'),
      'pngdata',
      { encoding: 'utf-8' },
    ).catch(async () => {
      // screenshots dir might not exist; create it
      await mkdir(join(options.projectsRoot, 'alpha', 'screenshots'), { recursive: true });
      await writeFile(
        join(options.projectsRoot, 'alpha', 'screenshots', 'home.png'),
        'pngdata',
        'utf-8',
      );
    });
    const meta = await duplicateProject(options, 'alpha', 'gamma');
    expect(meta.name).toBe('gamma');
    const copied = await readFile(
      join(options.projectsRoot, 'gamma', 'screenshots', 'home.png'),
      'utf-8',
    );
    expect(copied).toBe('pngdata');
    const env = await readProject(options, 'gamma');
    expect((env!.data as { headline: string }).headline).toBe('hi');
  });

  it('duplicateProject auto-suffixes when destination slug collides', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha');
    await createProject(options, 'beta');
    const dup = await duplicateProject(options, 'alpha', 'beta');
    expect(dup.name).toBe('beta-2');
    expect(dup.displayName).toBe('beta');
  });

  it('deleteProject removes the directory', async () => {
    const options = await makeRoot();
    await createProject(options, 'alpha');
    await deleteProject(options, 'alpha');
    await expect(stat(join(options.projectsRoot, 'alpha'))).rejects.toThrow();
  });

  it('deleteProject errors on missing project instead of silently succeeding', async () => {
    const options = await makeRoot();
    await expect(deleteProject(options, 'ghost')).rejects.toThrow(/not found/);
  });
});

describe('multi-project HTTP layer', () => {
  let app: Express;
  let options: ProjectStorageOptions;

  beforeEach(async () => {
    options = await makeRoot();
    app = express();
    app.use(express.json({ limit: '50mb' }));
    registerProjectRoutes(app, options);
  });

  it('GET /api/projects returns []', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.projects).toEqual([]);
  });

  it('full CRUD flow via HTTP', async () => {
    // Create
    let res = await request(app).post('/api/projects').send({ name: 'alpha' });
    expect(res.status).toBe(200);
    expect(res.body.meta.name).toBe('alpha');

    // List
    res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.projects).toHaveLength(1);

    // Save edits to it
    res = await request(app).put('/api/projects/alpha').send({ headline: 'hi' });
    expect(res.status).toBe(200);

    // Duplicate
    res = await request(app).post('/api/projects/alpha/duplicate').send({ to: 'beta' });
    expect(res.status).toBe(200);
    const loaded = await request(app).get('/api/projects/beta');
    expect((loaded.body.data as { headline: string }).headline).toBe('hi');

    // Rename
    res = await request(app).post('/api/projects/alpha/rename').send({ to: 'alpha-renamed' });
    expect(res.status).toBe(200);

    // Touch (move lastOpenedAt forward)
    res = await request(app).post('/api/projects/beta/touch');
    expect(res.status).toBe(200);
    expect(typeof res.body.meta.lastOpenedAt).toBe('string');

    // Delete
    res = await request(app).delete('/api/projects/beta');
    expect(res.status).toBe(200);
    res = await request(app).get('/api/projects/beta');
    expect(res.status).toBe(404);
  });

  it('rejects rename to existing destination with 400', async () => {
    await request(app).post('/api/projects').send({ name: 'alpha' });
    await request(app).post('/api/projects').send({ name: 'beta' });
    const res = await request(app).post('/api/projects/alpha/rename').send({ to: 'beta' });
    expect(res.status).toBe(400);
  });

  it('rejects create with missing name', async () => {
    const res = await request(app).post('/api/projects').send({});
    expect(res.status).toBe(400);
  });

  it('accepts human display names and returns the slug + displayName', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ name: 'Impostor Party Game' });
    expect(res.status).toBe(200);
    expect(res.body.meta.name).toBe('impostor-party-game');
    expect(res.body.meta.displayName).toBe('Impostor Party Game');
    const list = await request(app).get('/api/projects');
    expect(list.body.projects[0].displayName).toBe('Impostor Party Game');
  });
});
