import { readFile } from 'node:fs/promises';
import type { Express } from 'express';
import {
  listFrames,
  FONT_CATALOG,
  COMPOSITION_PRESETS,
  STORE_SIZES,
  getDeviceFamilies,
  getDeviceFamily,
  getDeviceId,
  getDeviceFramePath,
} from '@appframe/core';
import { SOLID_CATEGORIES, GRADIENT_CATEGORIES } from '../backgroundPresets.js';

export function registerCatalogRoutes(app: Express): void {
  // API: categorised background palette. Same catalog the UI Background
  // tab renders; served here so MCP agents see the exact same presets.
  app.get('/api/background-presets', (_req, res) => {
    res.json({
      solids: SOLID_CATEGORIES,
      gradients: GRADIENT_CATEGORIES,
    });
  });

  // API: List available frames
  app.get('/api/frames', async (_req, res) => {
    try {
      const frames = await listFrames();
      res.json(frames);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // API: List available fonts
  app.get('/api/fonts', (_req, res) => {
    res.json(FONT_CATALOG);
  });

  // API: List available compositions
  app.get('/api/compositions', (_req, res) => {
    res.json(Object.values(COMPOSITION_PRESETS));
  });

  // API: List store sizes grouped by platform category
  app.get('/api/sizes', (_req, res) => {
    const grouped: Record<
      string,
      Array<{ key: string; name: string; width: number; height: number }>
    > = {};
    const categoryMap: Record<string, string> = {
      ios: 'iphone',
      mac: 'mac',
      watch: 'watch',
      android: 'android',
    };
    for (const [key, size] of Object.entries(STORE_SIZES)) {
      let category = categoryMap[size.platform] ?? size.platform;
      // Split iOS into iphone and ipad
      if (size.platform === 'ios' && key.includes('ipad')) category = 'ipad';
      const list = grouped[category] ?? [];
      list.push({ key, name: size.name, width: size.width * 2, height: size.height * 2 });
      grouped[category] = list;
    }
    res.json(grouped);
  });

  // API: List Koubou device catalog (grouped by category)
  app.get('/api/koubou-devices', (_req, res) => {
    const families = getDeviceFamilies();
    const grouped: Record<string, typeof families> = {};
    for (const family of families) {
      const list = grouped[family.category] ?? [];
      list.push(family);
      grouped[family.category] = list;
    }
    res.json({ families, grouped });
  });

  // API: Serve Koubou device frame PNG
  app.get('/api/koubou-frame/:familyId', async (req, res) => {
    try {
      const { familyId } = req.params;
      const color = req.query.color as string | undefined;
      const family = getDeviceFamily(familyId);
      if (!family) {
        res.status(404).json({ error: `Unknown device family: ${familyId}` });
        return;
      }

      const koubouId = getDeviceId(familyId, color || undefined);
      if (!koubouId) {
        res.status(404).json({ error: `No Koubou device ID for family: ${familyId}` });
        return;
      }

      const pngPath = await getDeviceFramePath(koubouId);
      if (!pngPath) {
        res.status(404).json({ error: 'Koubou frame not found. Is Koubou installed?' });
        return;
      }

      const pngBuffer = await readFile(pngPath);
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=3600');
      res.send(pngBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });
}
