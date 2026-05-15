import { describe, it, expect, beforeEach } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';
import { mkdtemp, readFile, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  PROJECT_SCHEMA_VERSION,
  ProjectCorruptError,
  ProjectFutureSchemaError,
  readProject,
  registerProjectRoutes,
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
