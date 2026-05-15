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

import { domToPng } from 'modern-screenshot';

// Reuse a single hidden iframe across renders instead of create + destroy
// per export. doc.open() / doc.write() implicitly wipes the previous
// document, so reusing the element is safe and skips the layout cost of
// inserting a fresh iframe into the DOM each time. Cuts ~30-80ms per
// export — measurable during batch + panoramic flows.
let exportIframe: HTMLIFrameElement | null = null;

function getExportIframe(width: number, height: number): HTMLIFrameElement {
  if (typeof document === 'undefined') {
    throw new Error('client export requires a document');
  }
  if (!exportIframe || !exportIframe.isConnected) {
    exportIframe = document.createElement('iframe');
    exportIframe.setAttribute('aria-hidden', 'true');
    exportIframe.setAttribute('title', 'appframe export');
    exportIframe.style.cssText = 'position: fixed; top: 0; left: -99999px; border: none;';
    document.body.appendChild(exportIframe);
  }
  exportIframe.style.width = `${width}px`;
  exportIframe.style.height = `${height}px`;
  return exportIframe;
}

async function prepareIframeForRender(html: string, width: number, height: number): Promise<HTMLIFrameElement> {
  const iframe = getExportIframe(width, height);
  const doc = iframe.contentDocument;
  if (!doc) throw new Error('iframe has no contentDocument');
  doc.open();
  doc.write(html);
  doc.close();
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (doc as any).fonts?.ready;
  } catch {
    // fonts API may be unavailable; layout may use fallbacks.
  }
  // 200ms settle window — matches the historical wait the server-side
  // Renderer used after setContent. Long enough for layout + image decode
  // to finish on slower machines, short enough to not feel laggy.
  await new Promise((r) => setTimeout(r, 200));
  return iframe;
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

  const iframe = await prepareIframeForRender(html, width, height);
  const doc = iframe.contentDocument!;
  const dataUrl = await domToPng(doc.documentElement, { scale: 1, width, height });
  return dataUrlToBlob(dataUrl);
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  // fetch() can resolve data URLs in modern browsers and yields a Blob with
  // the right mime type set, saving us a manual base64 decode.
  const res = await fetch(dataUrl);
  return res.blob();
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

  const iframe = await prepareIframeForRender(html, totalWidth, frameHeight);
  const doc = iframe.contentDocument!;
  const dataUrl = await domToPng(doc.documentElement, {
    scale: 1,
    width: totalWidth,
    height: frameHeight,
  });

  // Load the rasterized wide canvas as an Image so we can crop it.
  const img = await loadImage(dataUrl);

  const slices: Blob[] = [];
  for (let i = 0; i < frameCount; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('failed to acquire 2d context for slice canvas');
    ctx.drawImage(
      img,
      i * frameWidth, 0, frameWidth, frameHeight, // source rect
      0, 0, frameWidth, frameHeight,              // dest rect
    );
    const blob = await canvasToPngBlob(canvas);
    slices.push(blob);
  }
  return slices;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = src;
  });
}

async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas.toBlob returned null'));
    }, 'image/png');
  });
}
