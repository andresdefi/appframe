import { describe, it, expect, beforeEach } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  parseScreenshotUrl,
  readScreenshotAsBuffer,
  registerScreenshotRoutes,
  resolveScreenshotPath,
  resolveScreenshotUrlToDataUrl,
  writeScreenshotFromDataUrl,
  type ScreenshotStorageOptions,
} from './screenshotStorage.js';

// 1x1 transparent PNG. The first 8 bytes are the PNG signature.
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgAAIAAAUAAeImBZsAAAAASUVORK5CYII=';
const TINY_PNG_DATA_URL = `data:image/png;base64,${TINY_PNG_BASE64}`;

async function makeRoot(): Promise<ScreenshotStorageOptions> {
  const dir = await mkdtemp(join(tmpdir(), 'appframe-screenshots-'));
  return { projectsRoot: dir };
}

function buildApp(options: ScreenshotStorageOptions): Express {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  registerScreenshotRoutes(app, options);
  return app;
}

describe('parseScreenshotUrl', () => {
  it('parses a valid upload URL', () => {
    expect(parseScreenshotUrl('/api/screenshots/default/home.png')).toEqual({
      project: 'default',
      filename: 'home.png',
    });
  });

  it('returns null for unrelated URLs', () => {
    expect(parseScreenshotUrl('data:image/png;base64,abc')).toBeNull();
    expect(parseScreenshotUrl('/some/other/path')).toBeNull();
    expect(parseScreenshotUrl('/api/screenshots/default/../etc/passwd')).toBeNull();
    expect(parseScreenshotUrl('/api/screenshots/default')).toBeNull();
  });
});

describe('resolveScreenshotPath', () => {
  it('returns the absolute path for a safe filename', () => {
    const abs = resolveScreenshotPath('/tmp/p', 'default', 'home.png');
    expect(abs.endsWith('/default/screenshots/home.png')).toBe(true);
  });

  it('rejects path-traversal filenames', () => {
    expect(() => resolveScreenshotPath('/tmp/p', 'default', '../etc/passwd')).toThrow();
    expect(() => resolveScreenshotPath('/tmp/p', 'default', 'foo/bar.png')).toThrow();
  });

  it('rejects invalid project names', () => {
    expect(() => resolveScreenshotPath('/tmp/p', '../escape', 'a.png')).toThrow();
    expect(() => resolveScreenshotPath('/tmp/p', 'bad name', 'a.png')).toThrow();
  });
});

describe('writeScreenshotFromDataUrl', () => {
  it('round-trips a PNG: bytes on disk match the decoded data URL', async () => {
    const options = await makeRoot();
    const written = await writeScreenshotFromDataUrl(options, {
      filename: 'home.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    expect(written.project).toBe('default');
    expect(written.filename).toBe('home.png');
    expect(written.relPath).toBe('screenshots/home.png');
    expect(written.url).toBe('/api/screenshots/default/home.png');
    const onDisk = await readFile(written.absPath);
    const expected = Buffer.from(TINY_PNG_BASE64, 'base64');
    expect(onDisk.equals(expected)).toBe(true);
    expect(written.bytes).toBe(expected.byteLength);
  });

  it('disambiguates collisions instead of clobbering', async () => {
    const options = await makeRoot();
    const a = await writeScreenshotFromDataUrl(options, {
      filename: 'home.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    const b = await writeScreenshotFromDataUrl(options, {
      filename: 'home.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    expect(a.filename).toBe('home.png');
    expect(b.filename).toBe('home-2.png');
    expect(b.absPath).not.toBe(a.absPath);
  });

  it('slugifies risky stems', async () => {
    const options = await makeRoot();
    const written = await writeScreenshotFromDataUrl(options, {
      filename: 'My Screen 1!!.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    expect(written.filename).toBe('my-screen-1.png');
  });

  it('refuses unsupported extensions', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(options, { filename: 'a.exe', dataUrl: TINY_PNG_DATA_URL }),
    ).rejects.toThrow(/unsupported file extension/);
  });

  it('refuses oversize uploads', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(
        { ...options, maxBytes: 8 },
        { filename: 'big.png', dataUrl: TINY_PNG_DATA_URL },
      ),
    ).rejects.toThrow(/exceeds/);
  });

  it('refuses non-data dataUrl', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(options, {
        filename: 'a.png',
        dataUrl: 'https://evil.example.com/x.png',
      }),
    ).rejects.toThrow(/data URI/);
  });

  it('refuses path-traversal in project name', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(options, {
        project: '../escape',
        filename: 'a.png',
        dataUrl: TINY_PNG_DATA_URL,
      }),
    ).rejects.toThrow();
  });
});

describe('readScreenshotAsBuffer / resolveScreenshotUrlToDataUrl', () => {
  it('reads a written PNG back with correct content type', async () => {
    const options = await makeRoot();
    const written = await writeScreenshotFromDataUrl(options, {
      filename: 'a.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    const read = await readScreenshotAsBuffer(options, 'default', written.filename);
    expect(read).not.toBeNull();
    expect(read!.contentType).toBe('image/png');
    expect(read!.buffer.equals(Buffer.from(TINY_PNG_BASE64, 'base64'))).toBe(true);
  });

  it('returns null for unknown filenames without throwing', async () => {
    const options = await makeRoot();
    expect(await readScreenshotAsBuffer(options, 'default', 'missing.png')).toBeNull();
  });

  it('returns null for traversal attempts without throwing', async () => {
    const options = await makeRoot();
    expect(await readScreenshotAsBuffer(options, '../escape', 'a.png')).toBeNull();
    expect(await readScreenshotAsBuffer(options, 'default', '../../etc/passwd')).toBeNull();
  });

  it('resolveScreenshotUrlToDataUrl round-trips a written screenshot', async () => {
    const options = await makeRoot();
    const written = await writeScreenshotFromDataUrl(options, {
      filename: 'a.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    const resolved = await resolveScreenshotUrlToDataUrl(options, written.url);
    expect(resolved).toBe(TINY_PNG_DATA_URL);
  });

  it('returns null for non-upload URLs', async () => {
    const options = await makeRoot();
    expect(await resolveScreenshotUrlToDataUrl(options, '/foo')).toBeNull();
    expect(await resolveScreenshotUrlToDataUrl(options, TINY_PNG_DATA_URL)).toBeNull();
  });
});

describe('POST /api/screenshots/upload', () => {
  let app: Express;
  let options: ScreenshotStorageOptions;

  beforeEach(async () => {
    options = await makeRoot();
    app = buildApp(options);
  });

  it('writes a PNG and returns its URL', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    expect(res.status).toBe(200);
    expect(res.body.url).toBe('/api/screenshots/default/home.png');
    expect(res.body.relPath).toBe('screenshots/home.png');
    const onDisk = await readFile(res.body.absPath);
    expect(onDisk.equals(Buffer.from(TINY_PNG_BASE64, 'base64'))).toBe(true);
  });

  it('rejects path-traversal in filename with 400', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: '../../etc/passwd', dataUrl: TINY_PNG_DATA_URL });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('rejects unsupported extensions with 400', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: 'malware.exe', dataUrl: TINY_PNG_DATA_URL });
    expect(res.status).toBe(400);
  });

  it('rejects missing dataUrl with 400', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: 'home.png' });
    expect(res.status).toBe(400);
  });

  it('does not clobber an existing file', async () => {
    const a = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    const b = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    expect(a.body.filename).toBe('home.png');
    expect(b.body.filename).toBe('home-2.png');
    expect(b.body.absPath).not.toBe(a.body.absPath);
  });
});

describe('GET /api/screenshots/:project/:filename', () => {
  let app: Express;
  let options: ScreenshotStorageOptions;

  beforeEach(async () => {
    options = await makeRoot();
    app = buildApp(options);
  });

  it('serves a written PNG with image/png', async () => {
    const upload = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    const res = await request(app).get(upload.body.url);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('image/png');
    expect(Buffer.from(res.body as Buffer).equals(Buffer.from(TINY_PNG_BASE64, 'base64'))).toBe(
      true,
    );
  });

  it('returns 404 for unknown files', async () => {
    const res = await request(app).get('/api/screenshots/default/nope.png');
    expect(res.status).toBe(404);
  });

  it('does not leak files outside the screenshots dir', async () => {
    // Plant a file directly in the projects root, then try to read it via a
    // crafted project name. Express normalizes most traversal in :param, but
    // the storage layer also rejects bad project names — both layers must hold.
    const secret = join(options.projectsRoot, 'secret.txt');
    await writeFile(secret, 'tres secreto', 'utf-8');
    const res = await request(app).get('/api/screenshots/..%2F/secret.txt');
    expect(res.status).toBe(404);
  });
});
