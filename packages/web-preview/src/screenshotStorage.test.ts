import { describe, it, expect, beforeEach } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';
import { mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import {
  parseScreenshotUrl,
  readScreenshotAsBuffer,
  registerScreenshotRoutes,
  resolveScreenshotPath,
  resolveScreenshotUrlToDataUrl,
  sweepPreviews,
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

/**
 * Generate a known-dimension test PNG via sharp and return the base64
 * data URL. Used to verify the preview-resize behavior (the 1×1
 * TINY_PNG_DATA_URL is too small to meaningfully measure resize).
 */
async function makeTestPngDataUrl(width: number, height: number): Promise<string> {
  const buf = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 200, g: 50, b: 100, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  return `data:image/png;base64,${buf.toString('base64')}`;
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
      project: 'alpha',
      filename: 'home.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    expect(written.project).toBe('alpha');
    expect(written.filename).toBe('home.png');
    expect(written.relPath).toBe('screenshots/home.png');
    expect(written.url).toBe('/api/screenshots/alpha/home.png');
    const onDisk = await readFile(written.absPath);
    const expected = Buffer.from(TINY_PNG_BASE64, 'base64');
    expect(onDisk.equals(expected)).toBe(true);
    expect(written.bytes).toBe(expected.byteLength);
  });

  it('disambiguates collisions instead of clobbering', async () => {
    const options = await makeRoot();
    const a = await writeScreenshotFromDataUrl(options, {
      project: 'alpha',
      filename: 'home.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    const b = await writeScreenshotFromDataUrl(options, {
      project: 'alpha',
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
      project: 'alpha',
      filename: 'My Screen 1!!.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    expect(written.filename).toBe('my-screen-1.png');
  });

  it('refuses unsupported extensions', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(options, {
        project: 'alpha',
        filename: 'a.exe',
        dataUrl: TINY_PNG_DATA_URL,
      }),
    ).rejects.toThrow(/unsupported file extension/);
  });

  it('refuses oversize uploads', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(
        { ...options, maxBytes: 8 },
        { project: 'alpha', filename: 'big.png', dataUrl: TINY_PNG_DATA_URL },
      ),
    ).rejects.toThrow(/exceeds/);
  });

  it('refuses non-data dataUrl', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(options, {
        project: 'alpha',
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

  it('throws when project is missing (no silent default-slug fallback)', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(options, {
        filename: 'a.png',
        dataUrl: TINY_PNG_DATA_URL,
      }),
    ).rejects.toThrow(/project name is required/);
  });

  it('throws when project is an empty string', async () => {
    const options = await makeRoot();
    await expect(
      writeScreenshotFromDataUrl(options, {
        project: '',
        filename: 'a.png',
        dataUrl: TINY_PNG_DATA_URL,
      }),
    ).rejects.toThrow(/project name is required/);
  });
});

describe('readScreenshotAsBuffer / resolveScreenshotUrlToDataUrl', () => {
  it('reads a written PNG back with correct content type', async () => {
    const options = await makeRoot();
    const written = await writeScreenshotFromDataUrl(options, {
      project: 'alpha',
      filename: 'a.png',
      dataUrl: TINY_PNG_DATA_URL,
    });
    const read = await readScreenshotAsBuffer(options, 'alpha', written.filename);
    expect(read).not.toBeNull();
    expect(read!.contentType).toBe('image/png');
    expect(read!.buffer.equals(Buffer.from(TINY_PNG_BASE64, 'base64'))).toBe(true);
  });

  it('returns null for unknown filenames without throwing', async () => {
    const options = await makeRoot();
    expect(await readScreenshotAsBuffer(options, 'alpha', 'missing.png')).toBeNull();
  });

  it('returns null for traversal attempts without throwing', async () => {
    const options = await makeRoot();
    expect(await readScreenshotAsBuffer(options, '../escape', 'a.png')).toBeNull();
    expect(await readScreenshotAsBuffer(options, 'alpha', '../../etc/passwd')).toBeNull();
  });

  it('resolveScreenshotUrlToDataUrl round-trips a written screenshot', async () => {
    const options = await makeRoot();
    const written = await writeScreenshotFromDataUrl(options, {
      project: 'alpha',
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
      .send({ project: 'alpha', filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    expect(res.status).toBe(200);
    expect(res.body.url).toBe('/api/screenshots/alpha/home.png');
    expect(res.body.relPath).toBe('screenshots/home.png');
    const onDisk = await readFile(res.body.absPath);
    expect(onDisk.equals(Buffer.from(TINY_PNG_BASE64, 'base64'))).toBe(true);
  });

  it('rejects path-traversal in filename with 400', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ project: 'alpha', filename: '../../etc/passwd', dataUrl: TINY_PNG_DATA_URL });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('rejects unsupported extensions with 400', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ project: 'alpha', filename: 'malware.exe', dataUrl: TINY_PNG_DATA_URL });
    expect(res.status).toBe(400);
  });

  it('rejects missing dataUrl with 400', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ project: 'alpha', filename: 'home.png' });
    expect(res.status).toBe(400);
  });

  it('rejects missing project with 400 (no silent default-slug fallback)', async () => {
    const res = await request(app)
      .post('/api/screenshots/upload')
      .send({ filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/project name is required/);
  });

  it('does not clobber an existing file', async () => {
    const a = await request(app)
      .post('/api/screenshots/upload')
      .send({ project: 'alpha', filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    const b = await request(app)
      .post('/api/screenshots/upload')
      .send({ project: 'alpha', filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    expect(a.body.filename).toBe('home.png');
    expect(b.body.filename).toBe('home-2.png');
    expect(b.body.absPath).not.toBe(a.body.absPath);
  });

  it('isolates uploads by project — same filename in two projects coexists', async () => {
    const a = await request(app)
      .post('/api/screenshots/upload')
      .send({ project: 'alpha', filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    const b = await request(app)
      .post('/api/screenshots/upload')
      .send({ project: 'beta', filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    expect(a.body.url).toBe('/api/screenshots/alpha/home.png');
    expect(b.body.url).toBe('/api/screenshots/beta/home.png');
    expect(a.body.absPath).not.toBe(b.body.absPath);
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
      .send({ project: 'alpha', filename: 'home.png', dataUrl: TINY_PNG_DATA_URL });
    const res = await request(app).get(upload.body.url);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('image/png');
    expect(Buffer.from(res.body as Buffer).equals(Buffer.from(TINY_PNG_BASE64, 'base64'))).toBe(
      true,
    );
  });

  it('returns 404 for unknown files', async () => {
    const res = await request(app).get('/api/screenshots/alpha/nope.png');
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

describe('preview-resolution screenshots', () => {
  let app: Express;
  let options: ScreenshotStorageOptions;

  beforeEach(async () => {
    options = await makeRoot();
    app = buildApp(options);
  });

  it('writeScreenshotFromDataUrl also writes a preview in .previews/', async () => {
    const dataUrl = await makeTestPngDataUrl(1200, 1800);
    const written = await writeScreenshotFromDataUrl(options, {
      project: 'alpha',
      filename: 'home.png',
      dataUrl,
    });
    const previewPath = join(
      options.projectsRoot,
      'alpha',
      'screenshots',
      '.previews',
      written.filename,
    );
    const previewBuf = await readFile(previewPath);
    const meta = await sharp(previewBuf).metadata();
    expect(meta.width).toBeLessThanOrEqual(900);
    // Source was 1200×1800 → preview is 900-wide and proportionally tall.
    expect(meta.width).toBe(900);
    expect(meta.height).toBe(1350);
  });

  it('preview generation is skipped for SVG sources (vector — no decoded-bitmap pressure)', async () => {
    const svgDataUrl =
      'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"/>');
    const written = await writeScreenshotFromDataUrl(options, {
      project: 'alpha',
      filename: 'logo.svg',
      dataUrl: svgDataUrl,
    });
    const previewPath = join(
      options.projectsRoot,
      'alpha',
      'screenshots',
      '.previews',
      written.filename,
    );
    await expect(stat(previewPath)).rejects.toThrow();
  });

  it('does not upscale small sources beyond their native width', async () => {
    const dataUrl = await makeTestPngDataUrl(400, 600);
    const written = await writeScreenshotFromDataUrl(options, {
      project: 'alpha',
      filename: 'tiny.png',
      dataUrl,
    });
    const previewPath = join(
      options.projectsRoot,
      'alpha',
      'screenshots',
      '.previews',
      written.filename,
    );
    const previewBuf = await readFile(previewPath);
    const meta = await sharp(previewBuf).metadata();
    expect(meta.width).toBe(400);
    expect(meta.height).toBe(600);
  });

  describe('GET /api/screenshots/:project/.previews/:filename', () => {
    it('serves the preview when it exists', async () => {
      const dataUrl = await makeTestPngDataUrl(1500, 2000);
      const written = await writeScreenshotFromDataUrl(options, {
        project: 'alpha',
        filename: 'home.png',
        dataUrl,
      });
      const res = await request(app).get(
        `/api/screenshots/alpha/.previews/${written.filename}`,
      );
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('image/png');
      const meta = await sharp(Buffer.from(res.body as Buffer)).metadata();
      expect(meta.width).toBe(900);
    });

    it('lazily heals: regenerates the preview if missing but source exists', async () => {
      const dataUrl = await makeTestPngDataUrl(1500, 2000);
      const written = await writeScreenshotFromDataUrl(options, {
        project: 'alpha',
        filename: 'home.png',
        dataUrl,
      });
      // Simulate a user deleting the preview file directly in Finder.
      const previewPath = join(
        options.projectsRoot,
        'alpha',
        'screenshots',
        '.previews',
        written.filename,
      );
      const { unlink } = await import('node:fs/promises');
      await unlink(previewPath);
      // First GET should regenerate.
      const res = await request(app).get(
        `/api/screenshots/alpha/.previews/${written.filename}`,
      );
      expect(res.status).toBe(200);
      const regen = await readFile(previewPath);
      const meta = await sharp(regen).metadata();
      expect(meta.width).toBe(900);
    });

    it('returns 404 when the source screenshot is not in the project', async () => {
      const res = await request(app).get('/api/screenshots/alpha/.previews/missing.png');
      expect(res.status).toBe(404);
    });

    it('rejects path traversal in the preview filename', async () => {
      const res = await request(app).get(
        '/api/screenshots/alpha/.previews/..%2Fsecret.png',
      );
      expect([400, 404]).toContain(res.status);
    });
  });

  describe('sweepPreviews', () => {
    it('generates missing previews for existing source screenshots', async () => {
      // Drop a source PNG straight into the project dir without using the
      // upload path — simulates a project that pre-existed the preview
      // feature (the migration case).
      const project = 'alpha';
      const screenshotsDir = join(options.projectsRoot, project, 'screenshots');
      await mkdir(screenshotsDir, { recursive: true });
      const buf = await sharp({
        create: {
          width: 1500,
          height: 2000,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      })
        .png()
        .toBuffer();
      await writeFile(join(screenshotsDir, 'home.png'), buf);

      await sweepPreviews(options);

      const previewPath = join(screenshotsDir, '.previews', 'home.png');
      const previewBuf = await readFile(previewPath);
      const meta = await sharp(previewBuf).metadata();
      expect(meta.width).toBe(900);
    });

    it('deletes orphan previews whose source no longer exists', async () => {
      const project = 'alpha';
      const screenshotsDir = join(options.projectsRoot, project, 'screenshots');
      const previewsDir = join(screenshotsDir, '.previews');
      await mkdir(previewsDir, { recursive: true });
      // Plant an orphan preview (no matching source file).
      await writeFile(join(previewsDir, 'orphan.png'), Buffer.from('not a real png'));

      await sweepPreviews(options);

      await expect(stat(join(previewsDir, 'orphan.png'))).rejects.toThrow();
    });

    it('is idempotent: a second sweep does not regenerate fresh previews', async () => {
      const dataUrl = await makeTestPngDataUrl(1500, 2000);
      const written = await writeScreenshotFromDataUrl(options, {
        project: 'alpha',
        filename: 'home.png',
        dataUrl,
      });
      const previewPath = join(
        options.projectsRoot,
        'alpha',
        'screenshots',
        '.previews',
        written.filename,
      );
      const firstStat = await stat(previewPath);
      await new Promise((r) => setTimeout(r, 10)); // mtime resolution gap
      await sweepPreviews(options);
      const secondStat = await stat(previewPath);
      expect(secondStat.mtimeMs).toBe(firstStat.mtimeMs);
    });

    it('does not throw when the projects root does not exist', async () => {
      const bogus: ScreenshotStorageOptions = { projectsRoot: '/tmp/does-not-exist-appframe' };
      await expect(sweepPreviews(bogus)).resolves.toBeUndefined();
    });

    it('skips project names that fail validation', async () => {
      // Plant a directory whose name doesn't match the project-slug regex;
      // sweep should ignore it rather than crash or sweep it.
      const badName = join(options.projectsRoot, 'has spaces');
      await mkdir(join(badName, 'screenshots'), { recursive: true });
      const dataUrl = await makeTestPngDataUrl(1500, 2000);
      const okProject = 'beta';
      await writeScreenshotFromDataUrl(options, {
        project: okProject,
        filename: 'home.png',
        dataUrl,
      });
      await expect(sweepPreviews(options)).resolves.toBeUndefined();
    });

    it('deletes orphan source files not referenced by appframe.json', async () => {
      const project = 'alpha';
      const screenshotsDir = join(options.projectsRoot, project, 'screenshots');
      await mkdir(screenshotsDir, { recursive: true });

      // Three source PNGs; only two are referenced by the project file.
      const png = await sharp({
        create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
      }).png().toBuffer();
      await writeFile(join(screenshotsDir, 'kept-1.png'), png);
      await writeFile(join(screenshotsDir, 'kept-2.png'), png);
      await writeFile(join(screenshotsDir, 'orphan.png'), png);
      await writeFile(join(screenshotsDir, 'also-orphan.jpg'), png);

      await writeFile(
        join(options.projectsRoot, project, 'appframe.json'),
        JSON.stringify({
          data: {
            screens: [
              { screenshotUrl: `/api/screenshots/${project}/kept-1.png` },
              { screenshotUrl: `/api/screenshots/${project}/kept-2.png` },
            ],
          },
          savedAt: new Date().toISOString(),
          schemaVersion: 1,
        }),
      );

      await sweepPreviews(options);

      await expect(stat(join(screenshotsDir, 'kept-1.png'))).resolves.toBeDefined();
      await expect(stat(join(screenshotsDir, 'kept-2.png'))).resolves.toBeDefined();
      await expect(stat(join(screenshotsDir, 'orphan.png'))).rejects.toThrow();
      await expect(stat(join(screenshotsDir, 'also-orphan.jpg'))).rejects.toThrow();
    });

    it('finds references in nested places: variants, localeScreens, panoramic elements, background layers', async () => {
      const project = 'alpha';
      const screenshotsDir = join(options.projectsRoot, project, 'screenshots');
      await mkdir(screenshotsDir, { recursive: true });

      const png = await sharp({
        create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
      }).png().toBuffer();
      for (const f of ['variant.png', 'locale.png', 'pano.png', 'bg.png', 'orphan.png']) {
        await writeFile(join(screenshotsDir, f), png);
      }

      await writeFile(
        join(options.projectsRoot, project, 'appframe.json'),
        JSON.stringify({
          data: {
            screens: [],
            localeScreens: {
              'es-ES': [{ screenshotUrl: `/api/screenshots/${project}/locale.png` }],
            },
            panoramicElements: [
              { type: 'device', screenshot: `/api/screenshots/${project}/pano.png` },
            ],
            panoramicBackground: {
              layers: [{ kind: 'image', image: `/api/screenshots/${project}/bg.png` }],
            },
            variants: [
              {
                snapshot: {
                  screens: [{ screenshotUrl: `/api/screenshots/${project}/variant.png` }],
                },
              },
            ],
          },
          savedAt: new Date().toISOString(),
          schemaVersion: 1,
        }),
      );

      await sweepPreviews(options);

      for (const f of ['variant.png', 'locale.png', 'pano.png', 'bg.png']) {
        await expect(stat(join(screenshotsDir, f))).resolves.toBeDefined();
      }
      await expect(stat(join(screenshotsDir, 'orphan.png'))).rejects.toThrow();
    });

    it('does not delete source files when appframe.json is missing or malformed', async () => {
      const project = 'alpha';
      const screenshotsDir = join(options.projectsRoot, project, 'screenshots');
      await mkdir(screenshotsDir, { recursive: true });
      const png = await sharp({
        create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
      }).png().toBuffer();
      await writeFile(join(screenshotsDir, 'orphan.png'), png);
      // No appframe.json at all.

      await sweepPreviews(options);

      // Orphan is preserved because we don't know which files are referenced.
      await expect(stat(join(screenshotsDir, 'orphan.png'))).resolves.toBeDefined();

      // Now plant a malformed appframe.json — same safety rule.
      await writeFile(join(options.projectsRoot, project, 'appframe.json'), '{ this is not valid json');
      await sweepPreviews(options);
      await expect(stat(join(screenshotsDir, 'orphan.png'))).resolves.toBeDefined();
    });
  });
});
