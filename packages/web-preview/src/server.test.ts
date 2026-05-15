import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { Express } from 'express';

vi.mock('@appframe/core', () => ({
  loadConfig: vi.fn().mockResolvedValue({
    app: { name: 'TestApp', description: 'Test', platforms: ['ios'], features: [] },
    theme: { colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' }, font: 'inter', fontWeight: 600 },
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
  getDeviceFamilies: vi.fn().mockReturnValue([
    { id: 'iphone-16', name: 'iPhone 16', category: 'iphone', year: 2024, colors: [{ name: 'Black', koubouId: 'iPhone 16 - Black' }] },
  ]),
  TemplateEngine: vi.fn(),
  getFrame: vi.fn(),
  getDefaultFrame: vi.fn(),
}));

import { listFrames, getDeviceFamilies, FONT_CATALOG, COMPOSITION_PRESETS } from '@appframe/core';

let app: Express;

beforeEach(() => {
  vi.clearAllMocks();

  app = express();
  app.use(express.json());

  let config: Record<string, unknown> = {
    app: { name: 'TestApp' },
    theme: {},
    screens: [{ screenshot: 'test.png', headline: 'Hello' }],
  };

  app.get('/api/config', (_req, res) => { res.json(config); });
  app.get('/api/project', (_req, res) => { res.json(config); });
  app.put('/api/config', (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'Request body must be an object' });
      return;
    }
    config = body;
    res.json({ success: true });
  });
  app.get('/api/frames', async (_req, res) => {
    try { res.json(await listFrames()); }
    catch (err) { res.status(500).json({ error: (err as Error).message }); }
  });
  app.get('/api/fonts', (_req, res) => { res.json(FONT_CATALOG); });
  app.get('/api/compositions', (_req, res) => { res.json(Object.values(COMPOSITION_PRESETS)); });
  app.get('/api/koubou-devices', (_req, res) => {
    const families = getDeviceFamilies() as Array<{ category: string }>;
    const grouped: Record<string, unknown[]> = {};
    for (const family of families) {
      const list = grouped[family.category] ?? [];
      list.push(family);
      grouped[family.category] = list;
    }
    res.json({ families, grouped });
  });
  app.post('/api/reload', async (_req, res) => {
    res.json({ success: true });
  });
  app.post('/api/project/reload', async (_req, res) => {
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

describe('GET /api/project', () => {
  it('returns 200 with JSON project payload', async () => {
    const res = await request(app).get('/api/project');
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

describe('POST /api/reload', () => {
  it('returns success', async () => {
    const res = await request(app).post('/api/reload');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/project/reload', () => {
  it('returns success', async () => {
    const res = await request(app).post('/api/project/reload');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('PUT /api/config', () => {
  it('stores the posted config so subsequent GET returns it', async () => {
    const updated = {
      app: { name: 'TestApp' },
      theme: { font: 'roboto' },
      screens: [{ screenshot: 'test.png', headline: 'Updated headline' }],
    };

    const putRes = await request(app)
      .put('/api/config')
      .send(updated);
    expect(putRes.status).toBe(200);
    expect(putRes.body.success).toBe(true);

    const getRes = await request(app).get('/api/config');
    expect(getRes.status).toBe(200);
    expect(getRes.body.theme.font).toBe('roboto');
    expect(getRes.body.screens[0].headline).toBe('Updated headline');
  });

  it('rejects non-object bodies', async () => {
    const res = await request(app)
      .put('/api/config')
      .set('Content-Type', 'application/json')
      .send('"not an object"');
    expect(res.status).toBe(400);
  });
});

