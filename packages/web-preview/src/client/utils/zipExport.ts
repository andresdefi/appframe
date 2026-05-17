import JSZip from 'jszip';

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
export async function bundleAsZip(entries: ZipEntry[]): Promise<Blob> {
  const zip = new JSZip();
  // Read each blob into an ArrayBuffer up front. JSZip accepts blobs
  // directly in browsers but its Node Blob detection is flaky in
  // test environments — passing the underlying buffer works
  // identically in both.
  for (const entry of entries) {
    const buf = await entry.blob.arrayBuffer();
    zip.file(entry.relPath, buf);
  }
  return zip.generateAsync({
    type: 'blob',
    // DEFLATE with level 6 — same default as macOS's built-in zipper.
    // PNG bytes are already compressed; level 9 buys ~0% over 6 but
    // doubles CPU.
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
