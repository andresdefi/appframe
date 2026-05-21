const CANVAS_TO_BLOB_TIMEOUT_MS = 5000;

/**
 * Redraw the source canvas into a fresh `display-p3` canvas of the
 * same size. When the resulting canvas is encoded as PNG via
 * `toBlob('image/png')`, Chromium- and WebKit-based browsers embed an
 * `iCCP` chunk that tags the file as Display P3 — so opening it on a
 * P3 display (or in any colour-managed app like Preview.app) renders
 * the wider gamut correctly. The drawImage step preserves the source
 * pixels exactly when the source canvas is sRGB — only the output's
 * declared colour space changes — so existing sRGB-only screenshots
 * look the same on sRGB displays and on P3 displays.
 *
 * Falls back to the source canvas when the runtime doesn't accept the
 * `colorSpace` option (older WebKit / Firefox). Export still works,
 * just without the P3 tag.
 */
export function ensureDisplayP3Canvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const doc = source.ownerDocument ?? globalThis.document;
  if (!doc) return source;
  const canvas = doc.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
  } catch {
    // Older engines throw on the unknown option.
    ctx = null;
  }
  if (!ctx) return source;
  ctx.drawImage(source, 0, 0);
  return canvas;
}

/**
 * The export iframe lives in its own JavaScript realm. A canvas created
 * inside it (modern-screenshot's domToCanvas) is an iframe-realm
 * HTMLCanvasElement; its .toBlob() yields an iframe-realm Blob, and
 * blob.arrayBuffer() yields an iframe-realm ArrayBuffer. Parent-realm
 * `instanceof Blob` / `instanceof ArrayBuffer` checks return false on
 * those values — Safari has bitten us here (JSZip then errors with
 * "Can't read the data of X.png"; Chrome is more lenient and didn't
 * surface it). Re-wrapping the bytes into a same-realm Blob makes every
 * downstream consumer realm-portable.
 */
async function asParentRealmBlob(blob: Blob, type: string): Promise<Blob> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf.byteLength);
  bytes.set(new Uint8Array(buf));
  return new Blob([bytes], { type });
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    let settled = false;
    const timeoutId = globalThis.setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        resolve(canvasToPngBlobViaDataUrl(canvas));
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    }, CANVAS_TO_BLOB_TIMEOUT_MS);

    try {
      canvas.toBlob((blob) => {
        if (settled) return;
        settled = true;
        globalThis.clearTimeout(timeoutId);

        if (blob) {
          asParentRealmBlob(blob, 'image/png').then(resolve, (err) =>
            reject(err instanceof Error ? err : new Error(String(err))),
          );
          return;
        }

        try {
          resolve(canvasToPngBlobViaDataUrl(canvas));
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      }, 'image/png');
    } catch (err) {
      if (settled) return;
      settled = true;
      globalThis.clearTimeout(timeoutId);
      try {
        resolve(canvasToPngBlobViaDataUrl(canvas));
      } catch {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    }
  });
}

function canvasToPngBlobViaDataUrl(canvas: HTMLCanvasElement): Blob {
  const [header, base64] = canvas.toDataURL('image/png').split(',');
  if (!base64) throw new Error('canvas.toDataURL returned an invalid PNG data URL');

  const type = header?.match(/data:(.+);/)?.[1] ?? 'image/png';
  const decoded = globalThis.atob(base64);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return new Blob([bytes], { type });
}
