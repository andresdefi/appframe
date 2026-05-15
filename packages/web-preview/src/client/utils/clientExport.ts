/**
 * Phase 2 of the client-side export migration. Single-screen rasterization
 * that runs entirely in the user's browser, alongside (not replacing) the
 * existing server-side Playwright path.
 *
 * Behind a localStorage feature flag (`appframe.clientExport === '1'`) so it
 * can be enabled per browser without rolling out to everyone. Once Phase 3
 * (batch / locales / sizes) lands and visual parity is confirmed across the
 * full export corpus, the flag goes away and the server endpoint gets
 * deleted in Phase 4.
 */

import { domToPng } from 'modern-screenshot';

export const CLIENT_EXPORT_FLAG = 'appframe.clientExport';

export function isClientExportEnabled(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(CLIENT_EXPORT_FLAG) === '1';
  } catch {
    return false;
  }
}

/**
 * Render a single screen to PNG entirely on the client. The body must be the
 * same shape that /api/preview-html accepts — i.e. what `buildPreviewBody`
 * produces — but with `width`/`height` already set to the final export
 * resolution (the server uses `sizeKey` to derive these, but here we pass
 * them explicitly so the iframe can be sized to match).
 *
 * The flow:
 *   1. POST the body to /api/preview-html and get back an HTML string.
 *   2. Mount the HTML in a hidden iframe sized to the export resolution.
 *   3. Wait for fonts and a brief settle window so the rasterizer sees
 *      the final layout.
 *   4. Rasterize the iframe's documentElement to a PNG data URL via
 *      modern-screenshot, then convert to a Blob for the download.
 *
 * The iframe is detached from the DOM after the rasterization completes so
 * we don't leak memory across multiple exports.
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

  const iframe = document.createElement('iframe');
  iframe.style.cssText = `position: fixed; top: 0; left: -99999px; width: ${width}px; height: ${height}px; border: none;`;
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error('iframe has no contentDocument');
    doc.open();
    doc.write(html);
    doc.close();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (doc as any).fonts?.ready;
    } catch {
      // fonts API may be unavailable; render proceeds, layout may use fallbacks.
    }
    // 200ms is what the server-side Renderer.render also waits for after
    // setContent / fonts.ready — keep the two paths comparable.
    await new Promise((r) => setTimeout(r, 200));

    const dataUrl = await domToPng(doc.documentElement, { scale: 1, width, height });
    const blob = await dataUrlToBlob(dataUrl);
    return blob;
  } finally {
    iframe.remove();
  }
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
 * canvas crops. This function does the single render and returns N blobs
 * sized exactly `frameWidth × frameHeight`, in order.
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

  const iframe = document.createElement('iframe');
  iframe.style.cssText = `position: fixed; top: 0; left: -99999px; width: ${totalWidth}px; height: ${frameHeight}px; border: none;`;
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error('iframe has no contentDocument');
    doc.open();
    doc.write(html);
    doc.close();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (doc as any).fonts?.ready;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 200));

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
  } finally {
    iframe.remove();
  }
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
