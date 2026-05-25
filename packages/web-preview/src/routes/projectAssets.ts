import type { Express, Request, Response } from 'express';
import { readProject } from '../projectStorage.js';
import {
  collectReferencedScreenshotFilenames,
  deleteScreenshotFile,
  listScreenshotFiles,
} from '../screenshotStorage.js';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';

// Asset endpoints. Reads + writes against the project's screenshots/
// folder, coordinated with the envelope so an agent can answer "what
// am I keeping on disk" and "drop everything I'm not using anymore"
// without manual file management. No SSE broadcast — the on-disk image
// files are independent of the envelope, and the cleanup endpoint only
// removes files nothing references, so the browser's in-flight image
// requests stay valid.

export function registerProjectAssetRoutes(app: Express, ctx: RouteContext): void {
  // GET /api/projects/:project/assets
  //
  // Returns inventory of every screenshot file under the project's
  // screenshots/ dir, annotated with whether it's referenced by the
  // current envelope. The agent can then decide whether to clean up.
  app.get('/api/projects/:project/assets', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    let envelope;
    try {
      envelope = await readProject(ctx.projectStorage, project);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
      return;
    }
    if (!envelope) {
      res.status(404).json({ error: 'project not found' });
      return;
    }
    let files;
    try {
      files = await listScreenshotFiles(ctx.screenshotStorage, project);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
      return;
    }
    const referenced = collectReferencedScreenshotFilenames(envelope.data, project);
    const assets = files.map((f) => ({
      filename: f.filename,
      bytes: f.bytes,
      referenced: referenced.has(f.filename),
    }));
    const referencedSet = new Set(files.map((f) => f.filename));
    const referencedButMissing: string[] = [];
    for (const name of referenced) {
      if (!referencedSet.has(name)) referencedButMissing.push(name);
    }
    const unreferenced = assets.filter((a) => !a.referenced).map((a) => a.filename);
    res.json({
      project,
      assets,
      unreferenced,
      // Broken references — the envelope points at a filename that
      // isn't on disk. Usually a manual delete or a project copied
      // between machines. Agent can surface this to the user.
      referencedButMissing,
    });
  });

  // POST /api/projects/:project/screenshots/delete { filename }
  //
  // Refuses if the filename is still referenced anywhere in the
  // envelope (default screens, locale screens, variants, overlays,
  // backgrounds). The agent must drop the reference first via
  // patch_screen / patch_locale_screen / etc. Refusing rather than
  // cascading is intentional — cascade would silently mutate fields
  // outside the agent's awareness.
  app.post('/api/projects/:project/screenshots/delete', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { filename } = body;
    if (typeof filename !== 'string' || filename.length === 0) {
      res.status(400).json({ error: '`filename` is required' });
      return;
    }
    let envelope;
    try {
      envelope = await readProject(ctx.projectStorage, project);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
      return;
    }
    if (!envelope) {
      res.status(404).json({ error: 'project not found' });
      return;
    }
    const referenced = collectReferencedScreenshotFilenames(envelope.data, project);
    if (referenced.has(filename)) {
      res.status(409).json({
        error:
          `"${filename}" is still referenced by the project envelope. ` +
          'Drop the reference first (patch_screen / patch_locale_screen / ' +
          'set_screenshot with a different image) before deleting.',
      });
      return;
    }
    let result;
    try {
      result = await deleteScreenshotFile(ctx.screenshotStorage, project, filename);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
      return;
    }
    if (!result.deleted) {
      res.status(404).json({ error: `"${filename}" not found on disk` });
      return;
    }
    res.json({ success: true, deleted: filename, previewDeleted: result.previewDeleted });
  });

  // POST /api/projects/:project/screenshots/cleanup
  //
  // Sweep every unreferenced file out of the project's screenshots/
  // dir. Same logic as the boot-time sweep in screenshotStorage but
  // scoped to a single project and triggerable on demand. Returns the
  // filenames removed; previews are removed alongside the sources.
  app.post('/api/projects/:project/screenshots/cleanup', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    let envelope;
    try {
      envelope = await readProject(ctx.projectStorage, project);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(500).json({ error: message });
      return;
    }
    if (!envelope) {
      res.status(404).json({ error: 'project not found' });
      return;
    }
    let files;
    try {
      files = await listScreenshotFiles(ctx.screenshotStorage, project);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(400).json({ error: message });
      return;
    }
    const referenced = collectReferencedScreenshotFilenames(envelope.data, project);
    const deleted: string[] = [];
    const failed: Array<{ filename: string; error: string }> = [];
    for (const f of files) {
      if (referenced.has(f.filename)) continue;
      try {
        const r = await deleteScreenshotFile(ctx.screenshotStorage, project, f.filename);
        if (r.deleted) deleted.push(f.filename);
      } catch (err) {
        failed.push({
          filename: f.filename,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    res.json({ success: true, deleted, failed });
  });
}
