import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { Express } from 'express';

vi.mock('@appframe/core', () => ({
  loadConfig: vi.fn().mockResolvedValue({
    app: { name: 'TestApp', description: 'Test', platforms: ['ios'], features: [] },
    theme: { style: 'minimal', colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' }, font: 'inter', fontWeight: 600 },
    frames: { style: 'flat' },
    screens: [{ screenshot: 'test.png', headline: 'Hello', layout: 'center' }],
    output: { platforms: ['ios'], directory: './output' },
  }),
  listFrames: vi.fn().mockResolvedValue([
    { id: 'iphone-16', name: 'iPhone 16', manufacturer: 'apple', year: 2024, platform: 'ios', tags: [] },
  ]),
  FONT_CATALOG: [
    { id: 'inter', name: 'Inter', weights: [400, 700], category: 'sans-serif' },
  ],
  COMPOSITION_PRESETS: {
    single: { id: 'single', name: 'Single', description: 'Single device', deviceCount: 1, slots: [] },
  },
  getKoubouDeviceFamilies: vi.fn().mockReturnValue([
    { id: 'iphone-16', name: 'iPhone 16', category: 'iphone', year: 2024, colors: [{ name: 'Black', koubouId: 'iPhone 16 - Black' }] },
  ]),
  detectKoubou: vi.fn().mockResolvedValue({ available: false, version: null }),
  Renderer: vi.fn(),
  TemplateEngine: vi.fn(),
  getFrame: vi.fn(),
  getDefaultFrame: vi.fn(),
}));

import { listFrames, getKoubouDeviceFamilies, detectKoubou, FONT_CATALOG, COMPOSITION_PRESETS } from '@appframe/core';

let app: Express;

beforeEach(() => {
  vi.clearAllMocks();

  app = express();
  app.use(express.json());

  const config = {
    app: { name: 'TestApp' },
    theme: { style: 'minimal' },
    screens: [{ screenshot: 'test.png', headline: 'Hello' }],
  };
  let koubouStatusCache: { available: boolean; version: string | null } | null = null;

  app.get('/api/config', (_req, res) => { res.json(config); });
  app.get('/api/frames', async (_req, res) => {
    try { res.json(await listFrames()); }
    catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });
  app.get('/api/templates', (_req, res) => {
    res.json(['minimal', 'bold', 'glow', 'playful', 'clean', 'branded', 'editorial', 'fullscreen']);
  });
  app.get('/api/fonts', (_req, res) => { res.json(FONT_CATALOG); });
  app.get('/api/compositions', (_req, res) => { res.json(Object.values(COMPOSITION_PRESETS)); });
  app.get('/api/koubou-devices', (_req, res) => {
    const families = getKoubouDeviceFamilies() as Array<{ category: string }>;
    const grouped: Record<string, unknown[]> = {};
    for (const family of families) {
      const list = grouped[family.category] ?? [];
      list.push(family);
      grouped[family.category] = list;
    }
    res.json({ families, grouped });
  });
  app.get('/api/koubou-status', async (_req, res) => {
    try {
      if (!koubouStatusCache) {
        const detection = await (detectKoubou as () => Promise<{ available: boolean; version: string | null }>)();
        koubouStatusCache = { available: detection.available, version: detection.version };
      }
      res.json(koubouStatusCache);
    } catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });
  app.post('/api/reload', async (_req, res) => {
    koubouStatusCache = null;
    res.json({ success: true });
  });
});

describe('GET /api/config', () => {
  it('returns 200 with JSON config', async () => {
    const res = await request(app).get('/api/config');
    expect(res.status).toBe(200);
    expect(res.body.app.name).toBe('TestApp');
  });
});

describe('GET /api/frames', () => {
  it('returns 200 with array', async () => {
    const res = await request(app).get('/api/frames');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/templates', () => {
  it('returns 200 with 8 styles', async () => {
    const res = await request(app).get('/api/templates');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(8);
    expect(res.body).toContain('minimal');
    expect(res.body).toContain('fullscreen');
  });
});

describe('GET /api/fonts', () => {
  it('returns 200 with font catalog', async () => {
    const res = await request(app).get('/api/fonts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/compositions', () => {
  it('returns 200 with presets', async () => {
    const res = await request(app).get('/api/compositions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/koubou-devices', () => {
  it('returns families and grouped', async () => {
    const res = await request(app).get('/api/koubou-devices');
    expect(res.status).toBe(200);
    expect(res.body.families).toBeDefined();
    expect(res.body.grouped).toBeDefined();
  });
});

describe('GET /api/koubou-status', () => {
  it('returns availability status', async () => {
    const res = await request(app).get('/api/koubou-status');
    expect(res.status).toBe(200);
    expect(res.body.available).toBe(false);
  });

  it('caches result on second call', async () => {
    await request(app).get('/api/koubou-status');
    await request(app).get('/api/koubou-status');
    expect(detectKoubou).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/reload', () => {
  it('returns success and resets caches', async () => {
    await request(app).get('/api/koubou-status');
    expect(detectKoubou).toHaveBeenCalledTimes(1);

    const res = await request(app).post('/api/reload');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    await request(app).get('/api/koubou-status');
    expect(detectKoubou).toHaveBeenCalledTimes(2);
  });
});
