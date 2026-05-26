import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import type { Express, Request, Response } from 'express';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';

const MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;
const BASE_TIMEOUT_MS = 15_000;
const PER_SLOT_TIMEOUT_MS = 10_000;
const IFRAME_POOL_SIZE = 3;

interface BatchItem {
  locale: string;
  index: number;
  width: number;
  height: number;
  relPath: string;
}

interface PendingBatch {
  items: BatchItem[];
  outDir: string;
  results: Map<string, { relPath: string; bytes: number } | { relPath: string; error: string }>;
  resolve: (value: BatchResult) => void;
  timer: NodeJS.Timeout;
}

interface BatchResult {
  files: Array<{ relPath: string; absPath: string; bytes: number }>;
  errors: Array<{ relPath: string; error: string }>;
}

export function registerRenderBatchRoutes(app: Express, ctx: RouteContext): void {
  const pending = new Map<string, PendingBatch>();

  function tryFinalize(batchId: string): void {
    const batch = pending.get(batchId);
    if (!batch) return;
    if (batch.results.size < batch.items.length) return;
    clearTimeout(batch.timer);
    pending.delete(batchId);
    const files: BatchResult['files'] = [];
    const errors: BatchResult['errors'] = [];
    for (const r of batch.results.values()) {
      if ('error' in r) {
        errors.push({ relPath: r.relPath, error: r.error });
      } else {
        files.push({ relPath: r.relPath, absPath: join(batch.outDir, r.relPath), bytes: r.bytes });
      }
    }
    batch.resolve({ files, errors });
  }

  // POST /api/render-batch
  // { slug, outDir, items: [{ locale, index, width, height, relPath }] }
  //
  // Broadcasts a render-batch SSE event to the browser. The browser
  // renders each item via the iframe pool and POSTs individual results
  // back to /api/render-batch-result/:batchId/:itemId. Once all items
  // report back (or the timeout fires), the batch resolves.
  app.post('/api/render-batch', async (req: Request, res: Response) => {
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { slug, outDir, items } = body;
    if (typeof slug !== 'string' || slug.length === 0) {
      res.status(400).json({ error: '`slug` is required' });
      return;
    }
    if (typeof outDir !== 'string' || outDir.length === 0) {
      res.status(400).json({ error: '`outDir` is required' });
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: '`items` must be a non-empty array' });
      return;
    }
    const resolvedOutDir = resolve(outDir);
    try {
      await mkdir(resolvedOutDir, { recursive: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: `cannot create output directory: ${msg}` });
      return;
    }

    const batchId = randomUUID();
    const validatedItems: BatchItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!isRecord(item)) {
        res.status(400).json({ error: `items[${i}] must be an object` });
        return;
      }
      validatedItems.push({
        locale: typeof item.locale === 'string' ? item.locale : 'default',
        index: typeof item.index === 'number' ? item.index : 0,
        width: typeof item.width === 'number' ? item.width : 1260,
        height: typeof item.height === 'number' ? item.height : 2736,
        relPath: typeof item.relPath === 'string' ? item.relPath : `screen-${i + 1}.png`,
      });
    }

    const timeoutMs = BASE_TIMEOUT_MS + Math.ceil(validatedItems.length / IFRAME_POOL_SIZE) * PER_SLOT_TIMEOUT_MS;

    const result = await new Promise<BatchResult>((resolvePromise) => {
      const timer = setTimeout(() => {
        const batch = pending.get(batchId);
        if (!batch) return;
        pending.delete(batchId);
        const files: BatchResult['files'] = [];
        const errors: BatchResult['errors'] = [];
        for (const item of batch.items) {
          const r = batch.results.get(item.relPath);
          if (!r) {
            errors.push({ relPath: item.relPath, error: 'render timed out - is the browser open at http://localhost:4400?' });
          } else if ('error' in r) {
            errors.push({ relPath: item.relPath, error: r.error });
          } else {
            files.push({ relPath: r.relPath, absPath: join(batch.outDir, r.relPath), bytes: r.bytes });
          }
        }
        resolvePromise({ files, errors });
      }, timeoutMs);

      pending.set(batchId, {
        items: validatedItems,
        outDir: resolvedOutDir,
        results: new Map(),
        resolve: resolvePromise,
        timer,
      });

      ctx.broadcastEvent({
        type: 'render-batch',
        batchId,
        slug,
        items: validatedItems,
      });
    });

    res.json(result);
  });

  // POST /api/render-batch-result/:batchId
  // { relPath, dataUrl } or { relPath, error }
  //
  // The browser POSTs each rendered PNG here. The server decodes the
  // base64 and writes the file to disk immediately.
  app.post('/api/render-batch-result/:batchId', async (req: Request, res: Response) => {
    const batchId = typeof req.params.batchId === 'string' ? req.params.batchId : '';
    const batch = pending.get(batchId);
    if (!batch) {
      res.json({ success: false, reason: 'unknown or expired batchId' });
      return;
    }
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const relPath = typeof body.relPath === 'string' ? body.relPath : '';
    if (!relPath) {
      res.status(400).json({ error: '`relPath` is required' });
      return;
    }

    if (typeof body.error === 'string' && body.error.length > 0) {
      batch.results.set(relPath, { relPath, error: body.error });
      res.json({ success: true });
      tryFinalize(batchId);
      return;
    }

    if (typeof body.dataUrl !== 'string' || !body.dataUrl.startsWith('data:image/')) {
      batch.results.set(relPath, { relPath, error: 'browser sent a non-image dataUrl' });
      res.json({ success: true });
      tryFinalize(batchId);
      return;
    }
    if (body.dataUrl.length > MAX_PAYLOAD_BYTES) {
      batch.results.set(relPath, { relPath, error: 'payload too large' });
      res.json({ success: true });
      tryFinalize(batchId);
      return;
    }

    const comma = body.dataUrl.indexOf(',');
    const base64 = body.dataUrl.slice(comma + 1);
    const buf = Buffer.from(base64, 'base64');
    const absPath = join(batch.outDir, relPath);
    try {
      await mkdir(dirname(absPath), { recursive: true });
      await writeFile(absPath, buf);
      batch.results.set(relPath, { relPath, bytes: buf.length });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      batch.results.set(relPath, { relPath, error: `disk write failed: ${msg}` });
    }
    res.json({ success: true });
    tryFinalize(batchId);
  });
}
