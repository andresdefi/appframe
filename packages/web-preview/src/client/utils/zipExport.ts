// jszip is ~100 KB in the main bundle; we only need it at Download click.
// Dynamic-import keeps it in its own lazy chunk so first-paint stays small.
// Static `import type` is fine — types are erased at build time.
import type JSZipType from 'jszip';

export interface ZipEntry {
  /**
   * Path of the file inside the ZIP, relative to the archive root.
   * Forward slashes (`/`) define the folder structure — JSZip creates
   * intermediate folders automatically. Examples:
   *   "screen-1.png"
   *   "output/screen-1.png"
   *   "output/english/screen-1.png"
   */
  relPath: string;
  /** Raw bytes for the file. Anything Blob-compatible. */
  blob: Blob;
}

/**
 * Bundle a list of in-memory blobs into a single ZIP blob using the
 * given folder structure. Used by the "Download all screens" flow
 * so the user gets one download with everything laid out (instead of
 * N separate browser downloads dumped flat into ~/Downloads).
 *
 * Forward-compatible with multi-locale: today the relPath prefix is
 * `output/`, once multi-locale ships it becomes `output/<locale>/`
 * and no other code in this module needs to change.
 */
// PNG and JPEG bytes are already DEFLATE/Huffman-compressed internally —
// re-deflating them costs CPU for ~0% size benefit. Store them raw and
// reserve DEFLATE for anything else (text manifests, JSON, etc.).
function isAlreadyCompressed(relPath: string): boolean {
  const lower = relPath.toLowerCase();
  return (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp')
  );
}

export async function bundleAsZip(entries: ZipEntry[]): Promise<Blob> {
  const { default: JSZip } = await import('jszip');
  const zip: JSZipType = new JSZip();
  // Read each blob into an ArrayBuffer up front. JSZip accepts blobs
  // directly in browsers but its Node Blob detection is flaky in
  // test environments — passing the underlying buffer works
  // identically in both.
  for (const entry of entries) {
    const buf = await entry.blob.arrayBuffer();
    zip.file(entry.relPath, buf, {
      compression: isAlreadyCompressed(entry.relPath) ? 'STORE' : 'DEFLATE',
    });
  }
  return zip.generateAsync({
    type: 'blob',
    // Fallback compression for entries that didn't override it above.
    // Level 6 matches macOS's default zipper.
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
