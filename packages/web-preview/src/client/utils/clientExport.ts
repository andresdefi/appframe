/**
 * Client-side export. Rasterizes the same HTML the iframe preview uses,
 * entirely in the user's browser, via modern-screenshot. Single-screen and
 * panoramic-slicing variants below.
 *
 * This is the only export path — the previous server-side Playwright route
 * (POST /api/export, POST /api/panoramic-export, the Renderer class) was
 * removed in Phase 4 of the migration. See docs/client-side-export-plan.md
 * for the history.
 */

// modern-screenshot is ~200 KB in the main bundle but only fires on the
// Download path. Dynamic-import keeps it in its own lazy chunk so the
// editor's initial load stays smaller. The first export pays a one-time
// chunk-load cost (~50-200 ms on a slow connection) which is invisible
// next to the rasterization itself.
import type { domToCanvas } from 'modern-screenshot';
import { canvasToPngBlob, ensureDisplayP3Canvas } from './canvasBlob';
import { withTimeout } from './withTimeout';

// Bounds. Picked generously enough that a slow data-URL decode or a
// large font face load won't trip them, but small enough that a true
// hang surfaces as a thrown error instead of an indefinite spinner.
const READINESS_TIMEOUT_MS = 15_000;
const RASTERIZE_TIMEOUT_MS = 20_000;

type DomToCanvas = typeof domToCanvas;
let domToCanvasPromise: Promise<DomToCanvas> | null = null;
function loadDomToCanvas(): Promise<DomToCanvas> {
  if (!domToCanvasPromise) {
    domToCanvasPromise = import('modern-screenshot').then((m) => m.domToCanvas);
  }
  return domToCanvasPromise;
}

// Small pool of hidden iframes so multiple renders can run in parallel.
// One iframe per concurrent capture — each is exclusively held until
// release. Previously a singleton, which serialised the agent's
// render_preview batch calls (a 6-screen capture took ~3.4s
// sequentially); the pool cuts that to ~1.2s for the same batch.
//
// Cap at MAX_POOL_SIZE because each iframe pulls modern-screenshot's
// internal canvas resources, and Safari starts losing precision past
// 4-5 concurrent decode + rasterise pipelines. 3 is a safe sweet spot.
const MAX_POOL_SIZE = 3;

interface PooledIframe {
  iframe: HTMLIFrameElement;
  busy: boolean;
}

const pool: PooledIframe[] = [];
const waitQueue: Array<(slot: PooledIframe) => void> = [];

function createPooledIframe(): PooledIframe {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('title', 'appframe export');
  iframe.style.cssText = 'position: fixed; top: 0; left: -99999px; border: none;';
  document.body.appendChild(iframe);
  return { iframe, busy: false };
}

async function acquireIframe(width: number, height: number): Promise<PooledIframe> {
  if (typeof document === 'undefined') {
    throw new Error('client export requires a document');
  }
  // Prefer reusing an idle slot before growing the pool.
  const idle = pool.find((s) => !s.busy);
  let slot: PooledIframe;
  if (idle) {
    slot = idle;
  } else if (pool.length < MAX_POOL_SIZE) {
    slot = createPooledIframe();
    pool.push(slot);
  } else {
    // All slots busy — wait for one to release.
    slot = await new Promise<PooledIframe>((resolve) => waitQueue.push(resolve));
  }
  slot.busy = true;
  slot.iframe.style.width = `${width}px`;
  slot.iframe.style.height = `${height}px`;
  return slot;
}

function releaseIframe(slot: PooledIframe): void {
  slot.busy = false;
  const next = waitQueue.shift();
  if (next) {
    slot.busy = true; // immediately reassign — avoids a race where a
                     // new caller acquires the slot before the queued
                     // waiter does
    next(slot);
  }
}

async function prepareIframeForRender(iframe: HTMLIFrameElement, html: string): Promise<void> {
  const doc = iframe.contentDocument;
  if (!doc) throw new Error('iframe has no contentDocument');
  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts and images in parallel so the rasterizer never captures
  // a half-loaded state. The old 200ms generic settle was a guess that
  // could be too short for a slow data-URI screenshot to decode; these two
  // awaits are exact instead.
  //
  // - fonts.ready resolves when every @font-face has loaded. Catch-and-
  //   shrug because some embeddings don't expose the API.
  // - img.decode() resolves when each image is fully decoded into a
  //   bitmap (stronger than img.complete, which only means the network
  //   fetch finished). Promise.allSettled tolerates broken images —
  //   we proceed past them rather than hanging the export.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fontsReady = (doc as any).fonts?.ready
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).fonts.ready.catch(() => undefined)
    : Promise.resolve();
  const images = Array.from(doc.images);
  const imagesDecoded = Promise.allSettled(images.map((img) => img.decode()));
  await withTimeout(
    Promise.all([fontsReady, imagesDecoded]),
    READINESS_TIMEOUT_MS,
    'export: font/image readiness',
  );
}

/**
 * Render a single screen to PNG entirely on the client. The body must be the
 * same shape that /api/preview-html accepts — i.e. what `buildPreviewBody`
 * produces — but with `width`/`height` set to the final export resolution
 * (the server uses `sizeKey` to derive these; here we pass them explicitly
 * so the iframe can be sized to match).
 */
export async function exportScreenClientSide(
  body: Record<string, unknown>,
  width: number,
  height: number,
): Promise<Blob> {
  const res = await fetch('/api/preview-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, width, height }),
  });
  if (!res.ok) {
    throw new Error(`preview-html failed: ${res.status}`);
  }
  const html = await res.text();

  // Acquire a pool iframe — blocks if all MAX_POOL_SIZE slots are busy.
  // Release in finally so a render error doesn't leak the slot.
  const slot = await acquireIframe(width, height);
  try {
    await prepareIframeForRender(slot.iframe, html);
    const doc = slot.iframe.contentDocument!;
    const domToCanvas = await loadDomToCanvas();
    const canvas = await withTimeout(
      domToCanvas(doc.documentElement, { scale: 1, width, height }),
      RASTERIZE_TIMEOUT_MS,
      'export: rasterize screen',
    );
    // Redraw into a display-p3 canvas so the PNG is tagged Display P3.
    // modern-screenshot creates an sRGB canvas internally; we can't
    // change that without forking, but a one-shot drawImage into a P3
    // canvas preserves the pixels exactly and triggers the browser's
    // automatic iCCP-chunk embedding on PNG export.
    return canvasToPngBlob(ensureDisplayP3Canvas(canvas));
  } finally {
    releaseIframe(slot);
  }
}

/**
 * Render the panoramic wide canvas once, then slice it into per-frame PNGs.
 *
 * The panoramic export produces N App Store screenshots from a single
 * `frameCount * frameWidth` canvas. Server-side, that means N separate
 * Playwright renders. Client-side, it's cheaper: one rasterization plus N
 * canvas crops. Returns N blobs sized exactly `frameWidth × frameHeight`,
 * in order.
 *
 * `body` must be the same shape `/api/panoramic-preview-html` accepts.
 * The function does not mutate it.
 */
export async function exportPanoramicSlicesClientSide(
  body: Record<string, unknown>,
  frameCount: number,
  frameWidth: number,
  frameHeight: number,
): Promise<Blob[]> {
  const totalWidth = frameCount * frameWidth;

  const res = await fetch('/api/panoramic-preview-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`panoramic-preview-html failed: ${res.status}`);
  const html = await res.text();

  const slot = await acquireIframe(totalWidth, frameHeight);
  let wideCanvas: HTMLCanvasElement;
  try {
    await prepareIframeForRender(slot.iframe, html);
    const doc = slot.iframe.contentDocument!;
    const domToCanvas = await loadDomToCanvas();
    wideCanvas = await withTimeout(
      domToCanvas(doc.documentElement, {
        scale: 1,
        width: totalWidth,
        height: frameHeight,
      }),
      RASTERIZE_TIMEOUT_MS,
      'export: rasterize panoramic canvas',
    );
  } finally {
    releaseIframe(slot);
  }

  const slices: Blob[] = [];
  for (let i = 0; i < frameCount; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    // Create the slice in display-p3 so the resulting PNG carries
    // the same colour-profile tag the single-screen path produces.
    // Falls back to sRGB context when colourSpace isn't supported.
    let ctx: CanvasRenderingContext2D | null;
    try {
      ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
    } catch {
      ctx = null;
    }
    if (!ctx) ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('failed to acquire 2d context for slice canvas');
    ctx.drawImage(
      wideCanvas,
      i * frameWidth, 0, frameWidth, frameHeight, // source rect
      0, 0, frameWidth, frameHeight,              // dest rect
    );
    const blob = await canvasToPngBlob(canvas);
    slices.push(blob);
  }
  return slices;
}
