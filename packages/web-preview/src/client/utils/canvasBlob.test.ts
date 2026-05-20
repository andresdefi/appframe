import { afterEach, describe, expect, it, vi } from 'vitest';
import { canvasToPngBlob } from './canvasBlob';

function fakeCanvas(
  toBlob: HTMLCanvasElement['toBlob'],
  toDataURL: HTMLCanvasElement['toDataURL'] = () => 'data:image/png;base64,QUJD',
): HTMLCanvasElement {
  return { toBlob, toDataURL } as HTMLCanvasElement;
}

describe('canvasToPngBlob', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves a parent-realm blob with the same bytes as canvas.toBlob', async () => {
    // The blob returned by canvas.toBlob inside the hidden export iframe
    // is realm-bound to that iframe; JSZip's instanceof checks fail on
    // it (Safari is strict). canvasToPngBlob now copies the bytes into
    // a parent-realm Blob — the test asserts identity is NOT preserved
    // (the wrap happened) and that the contents match byte-for-byte.
    const source = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
    const toDataURL = vi.fn(() => 'data:image/png;base64,QUJD');
    const canvas = fakeCanvas((callback) => callback(source), toDataURL);

    const out = await canvasToPngBlob(canvas);
    expect(out).not.toBe(source);
    expect(out.type).toBe('image/png');
    expect(out.size).toBe(3);
    expect(new Uint8Array(await out.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
    expect(toDataURL).not.toHaveBeenCalled();
  });

  it('falls back to a data URL when canvas.toBlob returns null', async () => {
    const canvas = fakeCanvas((callback) => callback(null));

    const blob = await canvasToPngBlob(canvas);

    expect(blob.type).toBe('image/png');
    await expect(blob.text()).resolves.toBe('ABC');
  });

  it('falls back to a data URL when canvas.toBlob never calls back', async () => {
    vi.useFakeTimers();
    const canvas = fakeCanvas(() => undefined);

    const promise = canvasToPngBlob(canvas);
    await vi.advanceTimersByTimeAsync(5000);
    const blob = await promise;

    expect(blob.type).toBe('image/png');
    await expect(blob.text()).resolves.toBe('ABC');
  });

  it('falls back to a data URL when canvas.toBlob throws synchronously', async () => {
    const canvas = fakeCanvas(() => {
      throw new Error('toBlob failed');
    });

    const blob = await canvasToPngBlob(canvas);

    expect(blob.type).toBe('image/png');
    await expect(blob.text()).resolves.toBe('ABC');
  });
});
