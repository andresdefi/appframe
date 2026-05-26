import { randomUUID } from 'node:crypto';
import archiver from 'archiver';
import type { Express, Request, Response } from 'express';
import { readProject } from '../projectStorage.js';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';

const BASE_TIMEOUT_MS = 15_000;
const PER_SLOT_TIMEOUT_MS = 10_000;
const IFRAME_POOL_SIZE = 3;
const MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;

interface PendingExport {
  total: number;
  received: number;
  archive: archiver.Archiver;
  timer: NodeJS.Timeout;
  aborted: boolean;
}

export function registerExportStreamRoutes(app: Express, ctx: RouteContext): void {
  const pending = new Map<string, PendingExport>();

  // GET /api/export-zip/:slug?locales=default,fr,es-MX&width=1260&height=2736
  //
  // Initiates a streaming ZIP download. Broadcasts a render-batch SSE
  // event; the browser renders each screen and POSTs results to
  // /api/export-zip-result/:batchId. Each PNG is appended to the archive
  // stream immediately so the browser's download tray shows progress.
  app.get('/api/export-zip/:slug', async (req: Request, res: Response) => {
    const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
    if (!slug) {
      res.status(400).json({ error: 'slug is required' });
      return;
    }
    const localesParam = typeof req.query.locales === 'string' ? req.query.locales : '';
    const width = Number(req.query.width) || 1260;
    const height = Number(req.query.height) || 2736;

    const envelope = await readProject(ctx.projectStorage, slug);
    if (!envelope) {
      res.status(404).json({ error: 'project not found' });
      return;
    }
    const data = isRecord(envelope.data) ? envelope.data : {};
    const screens = Array.isArray(data.screens) ? data.screens : [];
    const sessionLocales = isRecord(data.sessionLocales) ? data.sessionLocales : {};
    const localeScreensMap = isRecord(data.localeScreens) ? data.localeScreens : {};

    const requestedLocales = localesParam
      ? localesParam.split(',').filter(Boolean)
      : ['default', ...Object.keys(sessionLocales)];
    const useFolders = requestedLocales.length > 1;

    const items: Array<{ locale: string; index: number; width: number; height: number; relPath: string }> = [];
    for (const locale of requestedLocales) {
      const count = locale === 'default'
        ? screens.length
        : (Array.isArray(localeScreensMap[locale]) ? (localeScreensMap[locale] as unknown[]).length : 0);
      for (let i = 0; i < count; i++) {
        const fileName = `screen-${i + 1}.png`;
        const relPath = useFolders ? `${locale}/${fileName}` : fileName;
        items.push({ locale, index: i, width, height, relPath });
      }
    }

    if (items.length === 0) {
      res.status(400).json({ error: 'no screens to export' });
      return;
    }

    const batchId = randomUUID();
    const archive = archiver('zip', { store: true });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${slug}-screens.zip"`);
    res.setHeader('Transfer-Encoding', 'chunked');
    archive.pipe(res);

    const timeoutMs = BASE_TIMEOUT_MS + Math.ceil(items.length / IFRAME_POOL_SIZE) * PER_SLOT_TIMEOUT_MS;
    const timer = setTimeout(() => {
      const entry = pending.get(batchId);
      if (!entry || entry.aborted) return;
      entry.aborted = true;
      pending.delete(batchId);
      archive.finalize();
    }, timeoutMs);

    pending.set(batchId, { total: items.length, received: 0, archive, timer, aborted: false });

    req.on('close', () => {
      const entry = pending.get(batchId);
      if (entry && !entry.aborted) {
        entry.aborted = true;
        pending.delete(batchId);
        clearTimeout(entry.timer);
        archive.abort();
      }
    });

    ctx.broadcastEvent({
      type: 'render-batch',
      batchId,
      slug,
      items,
      resultUrl: '/api/export-zip-result',
    });

    ctx.broadcastEvent({
      type: 'export-progress',
      batchId,
      phase: 'started',
      done: 0,
      total: items.length,
    });
  });

  // POST /api/export-zip-result/:batchId { relPath, dataUrl } or { relPath, error }
  //
  // Browser POSTs each rendered PNG here. Appended directly to the
  // streaming archive.
  app.post('/api/export-zip-result/:batchId', (req: Request, res: Response) => {
    const batchId = typeof req.params.batchId === 'string' ? req.params.batchId : '';
    const entry = pending.get(batchId);
    if (!entry || entry.aborted) {
      res.json({ success: false, reason: 'unknown or expired batchId' });
      return;
    }

    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'body must be a JSON object' });
      return;
    }
    const relPath = typeof body.relPath === 'string' ? body.relPath : '';

    if (typeof body.dataUrl === 'string' && body.dataUrl.startsWith('data:image/') && body.dataUrl.length <= MAX_PAYLOAD_BYTES) {
      const comma = body.dataUrl.indexOf(',');
      const buf = Buffer.from(body.dataUrl.slice(comma + 1), 'base64');
      entry.archive.append(buf, { name: relPath });
    }

    entry.received++;
    ctx.broadcastEvent({
      type: 'export-progress',
      batchId,
      phase: 'rendering',
      done: entry.received,
      total: entry.total,
      relPath,
    });

    if (entry.received >= entry.total) {
      clearTimeout(entry.timer);
      pending.delete(batchId);
      entry.archive.finalize();
      ctx.broadcastEvent({
        type: 'export-progress',
        batchId,
        phase: 'complete',
        done: entry.total,
        total: entry.total,
      });
    }

    res.json({ success: true });
  });
}
