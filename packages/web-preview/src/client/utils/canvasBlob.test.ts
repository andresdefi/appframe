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

  it('resolves the blob returned by canvas.toBlob', async () => {
    const expected = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
    const toDataURL = vi.fn(() => 'data:image/png;base64,QUJD');
    const canvas = fakeCanvas((callback) => callback(expected), toDataURL);

    await expect(canvasToPngBlob(canvas)).resolves.toBe(expected);
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
