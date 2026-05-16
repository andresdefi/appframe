import type { Express } from 'express';
import { getDeviceFramePath } from '@appframe/core';

// Device-frame PNGs are large (~600KB) and previously embedded as base64
// inside every iframe preview, producing ~3MB of duplicated data per
// render cycle. Serving via URL lets the browser cache one copy across
// all iframes and re-renders.
export function registerDeviceFrameRoutes(app: Express): void {
  app.get('/api/device-frame', async (req, res) => {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!id) {
      res.status(400).json({ error: 'missing id' });
      return;
    }
    try {
      const pngPath = await getDeviceFramePath(id);
      if (!pngPath) {
        res.status(404).json({ error: 'device frame not found' });
        return;
      }
      res.set('Content-Type', 'image/png');
      // Device frames are content-addressed by ID and never mutate, so
      // they're safe to cache aggressively.
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.sendFile(pngPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
    }
  });
}
