import { randomUUID } from 'node:crypto';
import type { Express, Request, Response } from 'express';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';

// Memory-only round trip: the server asks the browser to render a screen
// via modern-screenshot (the same pipeline the user's exports use), the
// browser POSTs the PNG back, the server hands it to the waiting MCP
// caller, and the entry is dropped. Nothing touches disk.
//
// Safeguards:
//  - Pending requests time out (RENDER_TIMEOUT_MS) so a closed-browser
//    scenario doesn't leak the map.
//  - Result payloads are size-capped (MAX_PAYLOAD_BYTES) so an unbounded
//    base64 PNG can't blow the server's heap.

const RENDER_TIMEOUT_MS = 20_000;
const MAX_PAYLOAD_BYTES = 16 * 1024 * 1024; // 16 MB base64 ceiling

interface PendingRender {
  resolve: (result: { dataUrl: string } | { error: string }) => void;
  timer: NodeJS.Timeout;
}

export function registerRenderPreviewRoutes(app: Express, ctx: RouteContext): void {
  const pending = new Map<string, PendingRender>();

  // POST /api/render-preview { slug, index, locale?, width? }
  //
  // Generates a requestId, broadcasts `render-request` over SSE, and
  // returns a promise that resolves once the browser POSTs to
  // /api/render-result/:requestId. Returns the PNG as a base64 data URL.
  app.post('/api/render-preview', async (req: Request, res: Response) => {
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { slug, index, locale, width } = body;
    if (typeof slug !== 'string' || slug.length === 0) {
      res.status(400).json({ error: '`slug` is required' });
      return;
    }
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
      res.status(400).json({ error: '`index` must be a non-negative integer' });
      return;
    }

    const requestId = randomUUID();
    const result = await new Promise<{ dataUrl: string } | { error: string }>((resolve) => {
      const timer = setTimeout(() => {
        pending.delete(requestId);
        resolve({
          error:
            'render timed out — is the browser open at http://localhost:4400? ' +
            'render_preview needs the live preview window so modern-screenshot ' +
            'can capture the canvas.',
        });
      }, RENDER_TIMEOUT_MS);
      pending.set(requestId, { resolve, timer });

      ctx.broadcastEvent({
        type: 'render-request',
        requestId,
        slug,
        index,
        locale: typeof locale === 'string' ? locale : undefined,
        width: typeof width === 'number' ? width : undefined,
      });
    });

    if ('error' in result) {
      res.status(504).json({ error: result.error });
      return;
    }
    res.json({ dataUrl: result.dataUrl });
  });

  // POST /api/render-result/:requestId
  //   { dataUrl: "data:image/png;base64,..." }
  //   OR { error: string }
  //
  // The browser POSTs the captured PNG here. If the requestId isn't in
  // the pending map (timed out or unknown), the result is dropped — no
  // error to the browser, since this is best-effort.
  app.post('/api/render-result/:requestId', (req: Request, res: Response) => {
    const requestId = typeof req.params.requestId === 'string' ? req.params.requestId : '';
    const entry = pending.get(requestId);
    if (!entry) {
      res.json({ success: false, reason: 'unknown or expired requestId' });
      return;
    }
    pending.delete(requestId);
    clearTimeout(entry.timer);

    const body = req.body;
    if (!isRecord(body)) {
      entry.resolve({ error: 'browser sent malformed result body' });
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    if (typeof body.error === 'string' && body.error.length > 0) {
      entry.resolve({ error: body.error });
      res.json({ success: true });
      return;
    }
    if (typeof body.dataUrl !== 'string' || !body.dataUrl.startsWith('data:image/')) {
      entry.resolve({ error: 'browser sent a non-image dataUrl' });
      res.status(400).json({ error: '`dataUrl` must be a data:image/...;base64,... string' });
      return;
    }
    if (body.dataUrl.length > MAX_PAYLOAD_BYTES) {
      entry.resolve({
        error: `render payload (${Math.round(body.dataUrl.length / 1024)} KB) exceeds the ${Math.round(MAX_PAYLOAD_BYTES / 1024 / 1024)} MB cap`,
      });
      res.status(413).json({ error: 'payload too large' });
      return;
    }
    entry.resolve({ dataUrl: body.dataUrl });
    res.json({ success: true });
  });
}
