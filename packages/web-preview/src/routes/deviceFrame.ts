import type { Express } from 'express';
import sharp from 'sharp';
import { getDeviceFramePath } from '@appframe/core';

// Device-frame PNGs are large (~600KB on disk, ~17MB decoded RGBA per
// iframe). Serving via URL lets the browser cache one copy across all
// iframes and re-renders.
//
// `?preview=1` returns a 900-px-wide resize — the same Safari memory
// pressure that drove the screenshot-preview work hits frame bitmaps
// just as hard (6 iframes × ~17 MB decoded full-res frame = 100+ MB).
// Frames are static and content-addressed by ID, so the resized buffer
// is cached in memory keyed by ID; first request runs sharp, every
// other one is a map lookup.
const FRAME_PREVIEW_WIDTH = 900;
const previewCache = new Map<string, Buffer>();

async function getPreviewFrameBuffer(id: string, sourcePath: string): Promise<Buffer> {
  const cached = previewCache.get(id);
  if (cached) return cached;
  const buf = await sharp(sourcePath)
    .resize({ width: FRAME_PREVIEW_WIDTH, withoutEnlargement: true })
    .png()
    .toBuffer();
  previewCache.set(id, buf);
  return buf;
}

export function registerDeviceFrameRoutes(app: Express): void {
  app.get('/api/device-frame', async (req, res) => {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!id) {
      res.status(400).json({ error: 'missing id' });
      return;
    }
    const wantsPreview = req.query.preview === '1' || req.query.preview === 'true';
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
      if (wantsPreview) {
        try {
          const buf = await getPreviewFrameBuffer(id, pngPath);
          res.send(buf);
          return;
        } catch (err) {
          console.warn(`[deviceFrame] preview resize failed for ${id}, serving full-res:`, err);
          // Fall through to full-res serve so the UI never breaks.
        }
      }
      res.sendFile(pngPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
    }
  });
}
