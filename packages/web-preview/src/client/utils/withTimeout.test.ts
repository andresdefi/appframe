import { describe, it, expect } from 'vitest';
import { withTimeout } from './withTimeout';

describe('withTimeout', () => {
  it('resolves when the inner promise settles before the deadline', async () => {
    const inner = new Promise<string>((resolve) => {
      setTimeout(() => resolve('done'), 5);
    });
    await expect(withTimeout(inner, 1000, 'test')).resolves.toBe('done');
  });

  it('rejects with a descriptive error when the deadline passes first', async () => {
    // Inner stays pending forever; the timeout wins.
    const stuck = new Promise<string>(() => {});
    await expect(withTimeout(stuck, 20, 'fonts-ready')).rejects.toThrow(
      'fonts-ready timed out after 20ms',
    );
  });

  it('propagates inner rejection without waiting for the timeout', async () => {
    const failed = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('boom')), 5);
    });
    await expect(withTimeout(failed, 5000, 'test')).rejects.toThrow('boom');
  });

  it('wraps non-Error rejection values into Error', async () => {
    const failed = new Promise<never>((_, reject) => {
      setTimeout(() => reject('plain-string'), 5);
    });
    await expect(withTimeout(failed, 5000, 'test')).rejects.toThrow('plain-string');
  });
});
