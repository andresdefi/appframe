import type { PreviewStore } from '../store';
import { buildExportBody } from './previewBody';
import { exportScreenClientSide } from './clientExport';

export interface RenderBatchEvent {
  type: 'render-batch';
  batchId?: string;
  slug?: string;
  items?: Array<{
    locale: string;
    index: number;
    width: number;
    height: number;
    relPath: string;
  }>;
}

const CONCURRENCY = 3;

export async function handleRenderBatch(
  event: RenderBatchEvent,
  storeApi: { getState: () => PreviewStore },
): Promise<void> {
  if (typeof event.batchId !== 'string' || !event.batchId) return;
  if (!Array.isArray(event.items) || event.items.length === 0) return;
  const state = storeApi.getState();
  if (typeof event.slug !== 'string' || !event.slug || state.activeProject !== event.slug) return;
  const id = event.batchId;
  const itemList = event.items;

  let cursor = 0;
  async function worker(): Promise<void> {
    while (true) {
      const slot = cursor++;
      if (slot >= itemList.length) return;
      const item = itemList[slot]!;
      await renderOneItem(id, item, state);
    }
  }
  const workers = Array.from(
    { length: Math.min(CONCURRENCY, itemList.length) },
    () => worker(),
  );
  await Promise.all(workers);
}

async function renderOneItem(
  batchId: string,
  item: { locale: string; index: number; width: number; height: number; relPath: string },
  state: PreviewStore,
): Promise<void> {
  try {
    const locale = item.locale;
    const screen = locale !== 'default' && state.localeScreens[locale]?.[item.index]
      ? state.localeScreens[locale][item.index]
      : state.screens[item.index];
    if (!screen) {
      await postBatchResult(batchId, item.relPath, undefined, `screen index ${item.index} out of bounds`);
      return;
    }
    const localeConfig = locale !== 'default' && state.sessionLocales[locale]
      ? state.sessionLocales[locale]
      : undefined;
    const body = buildExportBody(screen, {
      previewW: state.previewW,
      previewH: state.previewH,
      locale,
      localeConfig,
      sizeKey: state.exportSize,
    });
    const blob = await exportScreenClientSide(
      body as unknown as Record<string, unknown>,
      item.width,
      item.height,
    );
    const dataUrl = await blobToDataUrl(blob);
    await postBatchResult(batchId, item.relPath, dataUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await postBatchResult(batchId, item.relPath, undefined, `client render failed: ${message}`);
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

async function postBatchResult(
  batchId: string,
  relPath: string,
  dataUrl?: string,
  error?: string,
): Promise<void> {
  try {
    await fetch(`/api/render-batch-result/${encodeURIComponent(batchId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataUrl ? { relPath, dataUrl } : { relPath, error: error ?? 'unknown error' }),
    });
  } catch {
    // Best-effort - server timeout handles the failure case
  }
}
