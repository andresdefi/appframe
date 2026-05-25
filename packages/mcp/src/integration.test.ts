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
import { ALL_TOOLS } from './tools/index.js';

function findTool(name: string) {
  const t = ALL_TOOLS.find((x) => x.descriptor.name === name);
  if (!t) throw new Error(`tool ${name} not found in catalog`);
  return t;
}

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

describe('integration: theme broadcast tools', () => {
  it('set_theme_font writes font + per-slot overrides to every screen', async () => {
    const tool = findTool('set_theme_font');
    const result = await tool.handler(
      { slug: 'my-test-project', font: 'anton', verbose: false },
      { client },
    );
    const payload = JSON.parse((result.content[0] as { text: string }).text);
    expect(payload.applied).toBe(3);
    expect(payload.font).toBe('anton');

    const env = await client.getProjectEnvelope('my-test-project');
    const screens = (env.data as { screens: Record<string, unknown>[] }).screens;
    expect(screens.length).toBe(3);
    for (const s of screens) {
      expect(s.font).toBe('anton');
      expect(s.headlineFont).toBe('anton');
      expect(s.subtitleFont).toBe('anton');
      expect(s.freeTextFont).toBe('anton');
    }
  });

  it('set_theme_font honours `slots` to limit which overrides write', async () => {
    const tool = findTool('set_theme_font');
    await tool.handler(
      {
        slug: 'my-test-project',
        font: 'inter',
        slots: ['headline'],
        weight: 700,
        verbose: false,
      },
      { client },
    );
    const env = await client.getProjectEnvelope('my-test-project');
    const screens = (env.data as { screens: Record<string, unknown>[] }).screens;
    for (const s of screens) {
      expect(s.font).toBe('inter');
      expect(s.headlineFont).toBe('inter');
      expect(s.headlineFontWeight).toBe(700);
      // subtitle/freeText overrides should still carry the previous
      // ("anton") value since this call's slots was ["headline"] only.
      expect(s.subtitleFont).toBe('anton');
      expect(s.freeTextFont).toBe('anton');
    }
  });

  it('set_theme_font rejects unknown font ids with did-you-mean', async () => {
    const tool = findTool('set_theme_font');
    await expect(
      tool.handler({ slug: 'my-test-project', font: 'antonn' }, { client }),
    ).rejects.toThrow(/unknown font "antonn"/);
  });

  it('set_theme_colors merges into existing colors object per screen', async () => {
    // Seed one screen with a starting colors object so the merge is
    // visible (other slots should survive).
    await client.patchScreen('my-test-project', 0, {
      colors: { primary: '#000000', secondary: '#111111' },
    });

    const tool = findTool('set_theme_colors');
    const result = await tool.handler(
      {
        slug: 'my-test-project',
        colors: { primary: '#ff0000', text: '#00ff00' },
        verbose: false,
      },
      { client },
    );
    const payload = JSON.parse((result.content[0] as { text: string }).text);
    expect(payload.applied).toBe(3);

    const env = await client.getProjectEnvelope('my-test-project');
    const screens = (env.data as { screens: Record<string, unknown>[] }).screens;
    const s0 = screens[0]!.colors as Record<string, string>;
    // The colors are normalised through toDisplayP3 — exact byte form
    // depends on the gamut conversion, so just assert presence + that
    // the unpatched `secondary` slot survived the merge.
    expect(typeof s0.primary).toBe('string');
    expect(typeof s0.text).toBe('string');
    expect(s0.secondary).toBeDefined();
    // Screens that didn't have a colors object before should still
    // gain one with only the two patched slots.
    const s1 = screens[1]!.colors as Record<string, string>;
    expect(typeof s1.primary).toBe('string');
    expect(typeof s1.text).toBe('string');
  });

  it('set_theme_colors rejects empty color maps', async () => {
    const tool = findTool('set_theme_colors');
    await expect(
      tool.handler({ slug: 'my-test-project', colors: {} }, { client }),
    ).rejects.toThrow(/must contain at least one/);
  });
});

describe('integration: multi-platform layout measurement', () => {
  // The engine's typography is in a 1290-reference frame
  // (templates/engine.ts), so the binary-search width budget is the
  // same on every platform. What DOES change per platform is the
  // canvas aspect ratio - check_text_overlap converts text height to
  // canvas-% and that depends on the platform's actual height.
  it('auto_fit_headline returns the same suggestion across iPhone and iPad', async () => {
    const longText = 'A reasonably long headline that wraps differently on each platform';
    const autoFit = findTool('auto_fit_headline');

    await client.patchProject('my-test-project', { exportSize: 'ios-6.9' });
    const phoneRes = await autoFit.handler(
      { slug: 'my-test-project', index: 0, text: longText, maxLines: 2 },
      { client },
    );
    const phonePayload = JSON.parse((phoneRes.content[0] as { text: string }).text);

    await client.patchProject('my-test-project', { exportSize: 'ios-ipad-13' });
    const ipadRes = await autoFit.handler(
      { slug: 'my-test-project', index: 0, text: longText, maxLines: 2 },
      { client },
    );
    const ipadPayload = JSON.parse((ipadRes.content[0] as { text: string }).text);

    expect(ipadPayload.availableWidth).toBe(phonePayload.availableWidth);
    expect(ipadPayload.suggestedSize).toBe(phonePayload.suggestedSize);
  });

  it('check_text_overlap height % shifts because canvas aspect differs', async () => {
    await client.patchScreen('my-test-project', 0, {
      headline: '<p>A reasonably long headline that needs space</p>',
      headlineSize: 110,
    });
    const overlap = findTool('check_text_overlap');

    await client.patchProject('my-test-project', { exportSize: 'ios-6.9' });
    const phoneRes = await overlap.handler(
      { slug: 'my-test-project', index: 0 },
      { client },
    );
    const phonePayload = JSON.parse((phoneRes.content[0] as { text: string }).text);

    await client.patchProject('my-test-project', { exportSize: 'ios-ipad-13' });
    const ipadRes = await overlap.handler(
      { slug: 'my-test-project', index: 0 },
      { client },
    );
    const ipadPayload = JSON.parse((ipadRes.content[0] as { text: string }).text);

    // Same text + same font size on a shorter canvas takes up a
    // larger % of vertical real estate. The numbers don't need to
    // match exact ratios, just confirm the platform value flowed
    // through to the bounds calculation.
    expect(ipadPayload.headlineBounds.height).toBeGreaterThan(phonePayload.headlineBounds.height);
  });
});

describe('integration: diff_screens', () => {
  it('reports identical when two screens carry the same fields', async () => {
    // Re-stamp both with the same headline so prior tests don't bleed in.
    await client.patchScreensBatch('my-test-project', [
      { index: 0, patch: { headline: '<p>same</p>', subtitle: '' } },
      { index: 1, patch: { headline: '<p>same</p>', subtitle: '' } },
    ]);
    const tool = findTool('diff_screens');
    const res = await tool.handler(
      { slug: 'my-test-project', indexA: 0, indexB: 1, fields: ['headline', 'subtitle'] },
      { client },
    );
    const payload = JSON.parse((res.content[0] as { text: string }).text);
    expect(payload.identical).toBe(true);
    expect(payload.changedKeys).toEqual([]);
  });

  it('reports the path of a single diverging field', async () => {
    await client.patchScreen('my-test-project', 1, { headlineSize: 88 });
    await client.patchScreen('my-test-project', 0, { headlineSize: 110 });
    const tool = findTool('diff_screens');
    const res = await tool.handler(
      { slug: 'my-test-project', indexA: 0, indexB: 1, fields: ['headlineSize'] },
      { client },
    );
    const payload = JSON.parse((res.content[0] as { text: string }).text);
    expect(payload.identical).toBe(false);
    expect(payload.changedKeys).toEqual(['headlineSize']);
    expect(payload.changed.headlineSize).toEqual({ a: 110, b: 88 });
  });

  it('rejects out-of-bounds indices with a clear message', async () => {
    const tool = findTool('diff_screens');
    await expect(
      tool.handler({ slug: 'my-test-project', indexA: 0, indexB: 99 }, { client }),
    ).rejects.toThrow(/out of bounds/);
  });
});

describe('integration: prototype-pollution defense', () => {
  it('rejects locale codes that are reserved JS property names', async () => {
    // The locale-add endpoint uses the code as a computed object key
    // (`{ ...localeScreens, [code]: ... }`). Spread + computed key is
    // safe from Object.prototype pollution, but a key like `toString`
    // or `__proto__` would still silently shadow built-ins on later
    // reads. The endpoint must reject these by name.
    for (const dangerous of ['__proto__', 'constructor', 'prototype', 'toString']) {
      const res = await fetch(`http://127.0.0.1:${server.port}/api/projects/my-test-project/locales/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: dangerous }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string };
      expect(body.error).toMatch(/reserved JavaScript property name/);
    }
  });
});

describe('integration: cleanup', () => {
  it('delete_project removes the slug + screenshots folder', async () => {
    await client.deleteProject('my-test-project');
    const after = await client.listProjects();
    expect(after.projects).toEqual([]);
  });
});
