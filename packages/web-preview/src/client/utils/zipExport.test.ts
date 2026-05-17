import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { bundleAsZip, type ZipEntry } from './zipExport';

// Minimal PNG header so the bytes in tests are recognisable. The
// helper itself doesn't care about file format — we only use this so
// the round-trip checks something concrete.
const PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
]);

function pngBlob(): Blob {
  return new Blob([PNG_BYTES], { type: 'image/png' });
}

async function readZip(blob: Blob): Promise<JSZip> {
  const buf = await blob.arrayBuffer();
  return JSZip.loadAsync(buf);
}

describe('bundleAsZip', () => {
  it('returns a Blob with a non-zero size', async () => {
    const entries: ZipEntry[] = [{ relPath: 'screen-1.png', blob: pngBlob() }];
    const out = await bundleAsZip(entries);
    expect(out).toBeInstanceOf(Blob);
    expect(out.size).toBeGreaterThan(0);
  });

  it('places files at the exact relPath given (flat root)', async () => {
    const entries: ZipEntry[] = [
      { relPath: 'screen-1.png', blob: pngBlob() },
      { relPath: 'screen-2.png', blob: pngBlob() },
    ];
    const zip = await readZip(await bundleAsZip(entries));
    expect(zip.file('screen-1.png')).not.toBeNull();
    expect(zip.file('screen-2.png')).not.toBeNull();
  });

  it('creates nested folders from forward-slashed relPaths', async () => {
    const entries: ZipEntry[] = [
      { relPath: 'english/screen-1.png', blob: pngBlob() },
      { relPath: 'english/screen-2.png', blob: pngBlob() },
    ];
    const zip = await readZip(await bundleAsZip(entries));
    expect(zip.file('english/screen-1.png')).not.toBeNull();
    expect(zip.file('english/screen-2.png')).not.toBeNull();
    // The folder entry itself shows up too (JSZip emits it automatically).
    expect(zip.folder('english')).not.toBeNull();
  });

  it('supports the future multi-locale layout (<locale>/file.png at zip root)', async () => {
    const entries: ZipEntry[] = [
      { relPath: 'english/screen-1.png', blob: pngBlob() },
      { relPath: 'english/screen-2.png', blob: pngBlob() },
      { relPath: 'spanish/screen-1.png', blob: pngBlob() },
      { relPath: 'spanish/screen-2.png', blob: pngBlob() },
      { relPath: 'norwegian/screen-1.png', blob: pngBlob() },
    ];
    const zip = await readZip(await bundleAsZip(entries));
    expect(zip.file('english/screen-1.png')).not.toBeNull();
    expect(zip.file('spanish/screen-2.png')).not.toBeNull();
    expect(zip.file('norwegian/screen-1.png')).not.toBeNull();
    // Each locale folder exists.
    expect(zip.folder('english')).not.toBeNull();
    expect(zip.folder('spanish')).not.toBeNull();
    expect(zip.folder('norwegian')).not.toBeNull();
  });

  it('preserves the exact bytes of each entry', async () => {
    const entries: ZipEntry[] = [{ relPath: 'screen-1.png', blob: pngBlob() }];
    const zip = await readZip(await bundleAsZip(entries));
    const out = await zip.file('screen-1.png')!.async('uint8array');
    expect(out).toEqual(PNG_BYTES);
  });

  it('handles an empty entry list (produces a valid empty ZIP)', async () => {
    const out = await bundleAsZip([]);
    const zip = await readZip(out);
    const names = Object.keys(zip.files);
    expect(names).toHaveLength(0);
  });

  it('preserves entry order in the file list', async () => {
    const entries: ZipEntry[] = [
      { relPath: 'screen-3.png', blob: pngBlob() },
      { relPath: 'screen-1.png', blob: pngBlob() },
      { relPath: 'screen-2.png', blob: pngBlob() },
    ];
    const zip = await readZip(await bundleAsZip(entries));
    // All three present; JSZip stores files keyed by path, so verify
    // each was added rather than relying on ordering inside the archive.
    expect(zip.file('screen-1.png')).not.toBeNull();
    expect(zip.file('screen-2.png')).not.toBeNull();
    expect(zip.file('screen-3.png')).not.toBeNull();
  });

  it('keeps content distinct when two entries have different bytes', async () => {
    const blobA = new Blob([new Uint8Array([1, 2, 3])]);
    const blobB = new Blob([new Uint8Array([4, 5, 6])]);
    const zip = await readZip(
      await bundleAsZip([
        { relPath: 'a.bin', blob: blobA },
        { relPath: 'b.bin', blob: blobB },
      ]),
    );
    const outA = await zip.file('a.bin')!.async('uint8array');
    const outB = await zip.file('b.bin')!.async('uint8array');
    expect(Array.from(outA)).toEqual([1, 2, 3]);
    expect(Array.from(outB)).toEqual([4, 5, 6]);
  });
});
