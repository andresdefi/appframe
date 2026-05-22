import type { Express, Response } from 'express';

export interface EventBroadcaster {
  register(app: Express): void;
  broadcast(payload: Record<string, unknown>): void;
  clientCount(): number;
}

const HEARTBEAT_MS = 25_000;

// SSE channel that lets the browser UI and any other listener react to
// out-of-band config changes instantly (e.g. an MCP agent calling PUT
// /api/config). Browser-originated edits — which arrive as PUT bodies
// flagged with `__editorState: true` — are NOT broadcast here; the
// browser is the only listener that matters for its own writes, and
// echoing them back would either no-op or risk clobbering an in-flight
// edit. See registerConfigRoutes for the gating.
export function createEventBroadcaster(): EventBroadcaster {
  const clients = new Set<Response>();

  function send(res: Response, payload: Record<string, unknown>): void {
    try {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch {
      clients.delete(res);
    }
  }

  return {
    register(app: Express): void {
      app.get('/api/events', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders?.();

        clients.add(res);
        send(res, { type: 'hello', clientCount: clients.size });

        const heartbeat = setInterval(() => {
          try {
            res.write(': heartbeat\n\n');
          } catch {
            clearInterval(heartbeat);
            clients.delete(res);
          }
        }, HEARTBEAT_MS);

        req.on('close', () => {
          clearInterval(heartbeat);
          clients.delete(res);
        });
      });
    },
    broadcast(payload: Record<string, unknown>): void {
      for (const res of clients) {
        send(res, payload);
      }
    },
    clientCount(): number {
      return clients.size;
    },
  };
}
