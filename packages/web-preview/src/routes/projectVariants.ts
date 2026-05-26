import type { Express, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import type { RouteContext } from './context.js';
import { isRecord } from './utils.js';
import {
  applyVariantSnapshotToData,
  mutateProject,
  syncActiveVariantSnapshot,
} from './projectPatchHelpers.js';

// Variant lifecycle endpoints — A/B alternatives inside a project.
// Each variant carries its own snapshot of screens / locales /
// panoramic state. The UI shows one at a time; switching active
// replaces the top-level state with the chosen variant's snapshot.

export function registerProjectVariantRoutes(app: Express, ctx: RouteContext): void {
  // POST /api/projects/:project/variants/create
  //   { name?: string, mode?: 'blank' | 'duplicate-active' }
  //
  // duplicate-active (default): snapshots the current top-level state
  // (screens + locales + panoramic) into a new variant. The agent then
  // mutates the new variant via patch_screen etc. to make it diverge.
  // blank: snapshots just an empty `[{}]` screen — fattenScreen will
  // inflate defaults on hydrate. Matches the UI's "Add Variant" button.
  // The new variant becomes active; top-level state.screens is updated
  // to match its snapshot.
  app.post('/api/projects/:project/variants/create', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { name, mode } = body;
    const resolvedMode = mode === 'blank' ? 'blank' : 'duplicate-active';
    let newVariant: Record<string, unknown>;
    const written = await mutateProject(ctx, project, res, 'variants/create', ({ data, screens }) => {
      const variants = Array.isArray(data.variants) ? data.variants : [];
      syncActiveVariantSnapshot(data, screens);
      const now = new Date().toISOString();
      const newId = `variant-${randomUUID().slice(0, 8)}`;
      const resolvedName = typeof name === 'string' && name.length > 0
        ? name
        : `Variant ${variants.length + 1}`;
      const snapshotScreens =
        resolvedMode === 'blank' ? [{ id: randomUUID() }] : structuredClone(screens);
      const baseSnapshotFields = {
        platform: data.platform,
        previewW: data.previewW,
        previewH: data.previewH,
        locale: 'default',
        sessionLocales: resolvedMode === 'blank' ? {} : structuredClone(data.sessionLocales ?? {}),
        localeScreens: resolvedMode === 'blank' ? {} : structuredClone(data.localeScreens ?? {}),
        localePanoramicElements:
          resolvedMode === 'blank' ? {} : structuredClone(data.localePanoramicElements ?? {}),
        isPanoramic: resolvedMode === 'blank' ? false : data.isPanoramic === true,
        screens: snapshotScreens,
        selectedScreen: 0,
        panoramicFrameCount: data.panoramicFrameCount ?? 5,
        panoramicBackground: resolvedMode === 'blank' ? null : structuredClone(data.panoramicBackground ?? null),
        panoramicElements:
          resolvedMode === 'blank' ? [] : structuredClone(data.panoramicElements ?? []),
        panoramicEffects: structuredClone(data.panoramicEffects ?? {}),
        selectedElementIndex: null,
        exportSize: data.exportSize ?? '',
      };
      newVariant = {
        id: newId,
        name: resolvedName,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        snapshot: baseSnapshotFields,
        artifacts: [],
        previewArtifacts: [],
        copyAssignments: [],
        history: [
          { kind: 'created', message: resolvedMode === 'blank' ? 'Variant created blank' : 'Variant duplicated from active', at: now },
        ],
        provenance:
          resolvedMode === 'blank'
            ? { origin: 'manual', branchDepth: 0, note: 'Started fresh — no carryover from the active variant.' }
            : { origin: 'manual', branchDepth: 0, note: 'Duplicated from the active variant via MCP.' },
      };
      return {
        ...data,
        variants: [...variants, newVariant],
        activeVariantId: newId,
        screens: snapshotScreens,
        sessionLocales: baseSnapshotFields.sessionLocales,
        localeScreens: baseSnapshotFields.localeScreens,
        localePanoramicElements: baseSnapshotFields.localePanoramicElements,
        panoramicElements: baseSnapshotFields.panoramicElements,
        isPanoramic: baseSnapshotFields.isPanoramic,
        selectedScreen: 0,
        selectedElementIndex: null,
        locale: 'default',
      };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, variant: newVariant! });
    }
  });

  // POST /api/projects/:project/variants/:id/delete
  //
  // Removes the variant. If it was active, falls back to the first
  // remaining variant and applies its snapshot. Rejects when it would
  // leave the project with zero variants (the UI assumes >= 1).
  app.post('/api/projects/:project/variants/:id/delete', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const variantId = typeof req.params.id === 'string' ? req.params.id : '';
    if (!variantId) {
      res.status(400).json({ error: '`id` is required in the URL' });
      return;
    }
    const written = await mutateProject(ctx, project, res, 'variants/delete', ({ data }) => {
      const variants = Array.isArray(data.variants) ? data.variants : [];
      const filtered = variants.filter((v) => isRecord(v) && v.id !== variantId);
      if (filtered.length === variants.length) {
        res.status(404).json({ error: `variant id "${variantId}" not found` });
        return null;
      }
      if (filtered.length === 0) {
        res.status(400).json({ error: 'cannot delete the last variant — projects must have at least 1' });
        return null;
      }
      let nextData: Record<string, unknown> = { ...data, variants: filtered };
      if (data.activeVariantId === variantId) {
        const fallback = filtered[0] as Record<string, unknown>;
        const fallbackId = typeof fallback.id === 'string' ? fallback.id : '';
        const snapshot = isRecord(fallback.snapshot) ? fallback.snapshot : {};
        nextData = applyVariantSnapshotToData(nextData, snapshot, fallbackId);
      }
      return nextData;
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, deleted: variantId });
    }
  });

  // POST /api/projects/:project/variants/:id/set-active
  //
  // Switch which variant is rendered. Top-level data.screens and the
  // related locale / panoramic / selection fields are replaced from the
  // target variant's snapshot, mirroring the browser's applyVariantSnapshot.
  app.post('/api/projects/:project/variants/:id/set-active', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const variantId = typeof req.params.id === 'string' ? req.params.id : '';
    if (!variantId) {
      res.status(400).json({ error: '`id` is required in the URL' });
      return;
    }
    const written = await mutateProject(ctx, project, res, 'variants/set-active', ({ data, screens }) => {
      const variants = Array.isArray(data.variants) ? data.variants : [];
      const target = variants.find((v) => isRecord(v) && v.id === variantId) as
        | Record<string, unknown>
        | undefined;
      if (!target) {
        res.status(404).json({ error: `variant id "${variantId}" not found` });
        return null;
      }
      if (data.activeVariantId === variantId) {
        res.json({ success: true, savedAt: '', alreadyActive: true });
        return null;
      }
      syncActiveVariantSnapshot(data, screens);
      const snapshot = isRecord(target.snapshot) ? target.snapshot : {};
      return applyVariantSnapshotToData(data, snapshot, variantId);
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, active: variantId });
    }
  });

  // POST /api/projects/:project/variants/:id/rename { name?, description?, status? }
  app.post('/api/projects/:project/variants/:id/rename', async (req: Request, res: Response) => {
    const project = typeof req.params.project === 'string' ? req.params.project : '';
    const variantId = typeof req.params.id === 'string' ? req.params.id : '';
    const body = req.body;
    if (!isRecord(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const { name, description, status } = body;
    if (
      name === undefined &&
      description === undefined &&
      status === undefined
    ) {
      res.status(400).json({ error: 'pass at least one of name / description / status' });
      return;
    }
    if (status !== undefined && status !== 'draft' && status !== 'approved') {
      res.status(400).json({ error: '`status` must be "draft" or "approved"' });
      return;
    }
    let updated: Record<string, unknown>;
    const written = await mutateProject(ctx, project, res, 'variants/rename', ({ data }) => {
      const variants = Array.isArray(data.variants) ? data.variants : [];
      let foundIdx = -1;
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (isRecord(v) && v.id === variantId) {
          foundIdx = i;
          break;
        }
      }
      if (foundIdx < 0) {
        res.status(404).json({ error: `variant id "${variantId}" not found` });
        return null;
      }
      const existing = variants[foundIdx] as Record<string, unknown>;
      updated = {
        ...existing,
        ...(typeof name === 'string' && name.length > 0 ? { name } : {}),
        ...(typeof description === 'string' ? { description } : {}),
        ...(typeof status === 'string' ? { status } : {}),
        updatedAt: new Date().toISOString(),
      };
      const nextVariants = variants.slice();
      nextVariants[foundIdx] = updated;
      return { ...data, variants: nextVariants };
    });
    if (written) {
      res.json({ success: true, savedAt: written.savedAt, variant: updated! });
    }
  });
}
