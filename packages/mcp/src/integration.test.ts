// Integration test: spin up the real preview server on an ephemeral
// port pointed at a temp projectsRoot, then exercise the MCP client
// end-to-end against it. Catches the kind of bug that pure unit tests
// miss — wrong endpoint paths, schema-vs-handler drift, broken atomic
// writes — without touching the user's real ~/Documents/appframe data.
//
// The browser is NOT involved. Tools that need the browser
// (render_preview, set_active_project from a real UI session) are
// covered by manual smoke tests in mcp-*.py.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startPreviewServer } from '@appframe/web-preview';
import { AppframeClient } from './client.js';

interface ServerHandle {
  port: number;
  close: () => Promise<void>;
}

let server: ServerHandle;
let client: AppframeClient;
let tempRoot: string;

beforeAll(async () => {
  tempRoot = await mkdtemp(join(tmpdir(), 'appframe-mcp-it-'));
  server = await startPreviewServer({
    port: 0, // ephemeral
    host: '127.0.0.1',
    projectsRoot: tempRoot,
  });
  client = new AppframeClient({ baseUrl: `http://127.0.0.1:${server.port}` });
});

afterAll(async () => {
  if (server) await server.close();
  if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
});

describe('integration: lifecycle', () => {
  it('reaches the health endpoint', async () => {
    const result = await client.health();
    expect(result).toEqual({ status: 'ok' });
  });

  it('reports a version', async () => {
    const result = await client.serverVersion();
    expect(result.name).toBe('@appframe/web-preview');
    expect(typeof result.version).toBe('string');
  });

  it('starts with no projects, can create one', async () => {
    const before = await client.listProjects();
    expect(before.projects).toEqual([]);
    const created = await client.createProject('My Test Project');
    expect(created.success).toBe(true);
    expect(created.meta.name).toBe('my-test-project');
    expect(created.meta.displayName).toBe('My Test Project');
    const after = await client.listProjects();
    expect(after.projects.length).toBe(1);
    expect(after.projects[0]?.name).toBe('my-test-project');
  });
});

describe('integration: project envelope read + write', () => {
  it('can read the project envelope (empty after create)', async () => {
    const env = await client.getProjectEnvelope('my-test-project');
    expect(env.schemaVersion).toBeGreaterThan(0);
    expect(env.data).toBeDefined();
  });

  it('add_screen + patch_screen round-trips through disk', async () => {
    // Add 3 screens
    for (let i = 0; i < 3; i++) {
      await client.insertScreen('my-test-project');
    }
    const env = await client.getProjectEnvelope('my-test-project');
    const data = env.data as { screens: unknown[] };
    expect(data.screens.length).toBe(3);

    // Patch screen 1 headline
    const r = await client.patchScreen('my-test-project', 1, {
      headline: '<p>integration test</p>',
    });
    expect(r.success).toBe(true);
    expect((r.screen as { headline: string }).headline).toBe('<p>integration test</p>');

    // Verify the patch landed on disk
    const file = join(tempRoot, 'my-test-project', 'appframe.json');
    const raw = JSON.parse(await readFile(file, 'utf-8')) as {
      data: { screens: Array<{ headline: string }> };
    };
    expect(raw.data.screens[1]?.headline).toBe('<p>integration test</p>');
  });

  it('batch_patch_screens applies multiple ops atomically', async () => {
    const result = await client.patchScreensBatch('my-test-project', [
      { index: 0, patch: { headline: '<p>screen 0 batched</p>' } },
      { index: 2, patch: { headline: '<p>screen 2 batched</p>' } },
    ]);
    expect(result.success).toBe(true);
    expect(result.applied).toBe(2);
    expect(result.screens.length).toBe(2);

    const env = await client.getProjectEnvelope('my-test-project');
    const screens = (env.data as { screens: Array<{ headline: string }> }).screens;
    expect(screens[0]?.headline).toBe('<p>screen 0 batched</p>');
    expect(screens[2]?.headline).toBe('<p>screen 2 batched</p>');
    // Screen 1 untouched
    expect(screens[1]?.headline).toBe('<p>integration test</p>');
  });
});

describe('integration: catalogs', () => {
  it('list_fonts returns a non-empty array', async () => {
    const fonts = await client.listFonts();
    expect(Array.isArray(fonts)).toBe(true);
    expect(fonts.length).toBeGreaterThan(0);
  });

  it('list_frames returns a non-empty array', async () => {
    const frames = await client.listFrames();
    expect(Array.isArray(frames)).toBe(true);
    expect(frames.length).toBeGreaterThan(0);
  });

  it('catalog cache returns the same reference on second call', async () => {
    const first = await client.listFonts();
    const second = await client.listFonts();
    expect(first).toBe(second);
  });
});

describe('integration: cleanup', () => {
  it('delete_project removes the slug + screenshots folder', async () => {
    await client.deleteProject('my-test-project');
    const after = await client.listProjects();
    expect(after.projects).toEqual([]);
  });
});
