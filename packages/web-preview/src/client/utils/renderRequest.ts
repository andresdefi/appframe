// Render-request handler: server sends a `render-request` SSE event,
// the browser captures the requested screen via modern-screenshot (the
// same pipeline the export tab uses), and POSTs the PNG back to
// /api/render-result/:requestId. Pure ephemeral round-trip — nothing
// is persisted to disk on either side.

import type { PreviewStore } from '../store';
import { buildExportBody } from './previewBody';
import { exportScreenClientSide } from './clientExport';

// Default agent-facing render width. Smaller than full export so the
// base64 round-trip stays cheap (~150 KB typical) and the agent gets a
// preview, not a print-quality file. Browsers cap fetch with binary
// bodies pretty generously; the server has a 16 MB ceiling per
// renderPreview.ts.
const DEFAULT_RENDER_WIDTH = 800;

export interface RenderRequestEvent {
  type: 'render-request';
  requestId?: string;
  slug?: string;
  index?: number;
  locale?: string;
  width?: number;
}

// Concurrent renders are safe — `exportScreenClientSide` now uses an
// iframe pool internally (see clientExport.ts), so multiple captures
// can run in parallel up to MAX_POOL_SIZE. No external queue needed.
export async function handleRenderRequest(
  event: RenderRequestEvent,
  storeApi: { getState: () => PreviewStore },
): Promise<void> {
  const { requestId, slug, index, locale: requestedLocale, width } = event;
  if (typeof requestId !== 'string' || requestId.length === 0) return;
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
    void postResult(requestId, undefined, '`index` must be a non-negative integer');
    return;
  }
  const state = storeApi.getState();
  if (typeof slug !== 'string' || slug.length === 0 || state.activeProject !== slug) {
    // Render request was for a project this browser isn't currently
    // showing — drop it silently so we don't render the wrong project.
    return;
  }
  const screen = state.screens[index];
  if (!screen) {
    void postResult(requestId, undefined, `screen index ${index} out of bounds (${state.screens.length} screens)`);
    return;
  }
  const locale = typeof requestedLocale === 'string' && requestedLocale.length > 0
    ? requestedLocale
    : state.locale;
  const activeLocaleConfig =
    locale !== 'default' && state.sessionLocales[locale] ? state.sessionLocales[locale] : undefined;
  // Pick a size from the project's export catalog so the aspect ratio
  // matches what the export tab would produce. Fall back to preview
  // dims when no exportSize / size catalog has loaded yet.
  const exportSize = state.exportSize;
  const sizesByPlatform = state.sizes ?? {};
  const sizeSpec = Object.values(sizesByPlatform)
    .flat()
    .find((s) => s && s.key === exportSize);
  const baseW = sizeSpec?.width ?? state.previewW;
  const baseH = sizeSpec?.height ?? state.previewH;
  // Scale to the requested width while preserving aspect ratio.
  const targetW = Math.max(100, Math.round(width ?? DEFAULT_RENDER_WIDTH));
  const targetH = Math.round((baseH / Math.max(baseW, 1)) * targetW);

  try {
    const body = buildExportBody(screen, {
      previewW: state.previewW,
      previewH: state.previewH,
      locale,
      localeConfig: activeLocaleConfig,
      sizeKey: exportSize,
    });
    const blob = await exportScreenClientSide(
      body as unknown as Record<string, unknown>,
      targetW,
      targetH,
    );
    const dataUrl = await blobToDataUrl(blob);
    await postResult(requestId, dataUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await postResult(requestId, undefined, `client render failed: ${message}`);
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

async function postResult(
  requestId: string,
  dataUrl?: string,
  error?: string,
): Promise<void> {
  try {
    await fetch(`/api/render-result/${encodeURIComponent(requestId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUrl ? { dataUrl } : { error: error ?? 'unknown error' }),
    });
  } catch {
    // Best-effort — if the POST itself fails, the server-side timeout
    // will surface the error to the MCP caller.
  }
}
