import type { Express } from 'express';
import { loadConfig } from '@appframe/core';
import type { AppframeConfig } from '@appframe/core';
import { buildConfigFromEditorState } from '../editorState.js';
import { isRecord } from './utils.js';
import type { RouteContext } from './context.js';

export function registerConfigRoutes(app: Express, ctx: RouteContext): void {
  // API: Get current live config (reflects in-browser edits, not disk state).
  app.get('/api/config', (_req, res) => {
    res.json(ctx.getConfig());
  });
  app.get('/api/project', (_req, res) => {
    res.json(ctx.getConfig());
  });

  // API: Replace the in-memory live config. Browser debounces edits here so that
  // agents querying GET /api/config see the user's latest state in real time.
  // If the body carries `__editorState: true` it is treated as the editor-state
  // shape used by /api/export-config; otherwise it is taken as a full AppframeConfig.
  app.put('/api/config', (req, res) => {
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'Request body must be an object' });
      return;
    }
    try {
      const next =
        body.__editorState === true
          ? buildConfigFromEditorState(ctx.getConfig(), body)
          : (body as AppframeConfig);
      ctx.setConfig(next);
      res.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  });

  // API: Reload config from disk. /api/reload + /api/project/reload are
  // intentionally aliases — older clients shipped one name, newer ones
  // ship the other; both still arrive in the wild.
  const reloadHandler = async (
    _req: unknown,
    res: { json: (body: unknown) => void; status: (n: number) => { json: (b: unknown) => void } },
  ): Promise<void> => {
    try {
      if (!ctx.resolvedConfigPath) {
        res.json({ success: true, note: 'No config file — using defaults' });
        return;
      }
      ctx.setConfig(await loadConfig(ctx.resolvedConfigPath));
      res.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  };

  app.post('/api/reload', reloadHandler);
  app.post('/api/project/reload', reloadHandler);
}
