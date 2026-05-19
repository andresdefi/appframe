const CANVAS_TO_BLOB_TIMEOUT_MS = 5000;

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
          resolve(blob);
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
