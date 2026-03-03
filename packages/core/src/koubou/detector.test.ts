import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:child_process', () => ({
  execFile: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  access: vi.fn(),
}));

vi.mock('node:util', () => ({
  promisify: (fn: unknown) => fn,
}));

import { detectKoubou } from './detector.js';
import { execFile } from 'node:child_process';
import { access } from 'node:fs/promises';

const mockExecFile = vi.mocked(execFile);
const mockAccess = vi.mocked(access);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('detectKoubou', () => {
  it('returns available: false when no binary found', async () => {
    mockExecFile.mockRejectedValue(new Error('not found'));
    mockAccess.mockRejectedValue(new Error('no access'));

    const result = await detectKoubou();
    expect(result.available).toBe(false);
    expect(result.binaryPath).toBeNull();
    expect(result.version).toBeNull();
  });

  it('returns available: true when which kou succeeds', async () => {
    // First call: which kou → success
    mockExecFile.mockImplementation((...args: unknown[]) => {
      const cmd = args[0] as string;
      if (cmd === 'which') {
        return Promise.resolve({ stdout: '/usr/local/bin/kou\n', stderr: '' });
      }
      // Second call: kou --version
      return Promise.resolve({ stdout: 'kou v1.2.3\n', stderr: '' });
    });

    const result = await detectKoubou();
    expect(result.available).toBe(true);
    expect(result.binaryPath).toBe('/usr/local/bin/kou');
    expect(result.version).toBe('1.2.3');
  });

  it('checks fallback paths when which fails', async () => {
    // which fails
    mockExecFile.mockImplementation((...args: unknown[]) => {
      const cmd = args[0] as string;
      if (cmd === 'which') {
        return Promise.reject(new Error('not found'));
      }
      // version call
      return Promise.resolve({ stdout: 'v2.0.0', stderr: '' });
    });

    // First N fallback paths fail, then one succeeds
    let accessCallCount = 0;
    mockAccess.mockImplementation(() => {
      accessCallCount++;
      if (accessCallCount < 3) {
        return Promise.reject(new Error('not found'));
      }
      return Promise.resolve(undefined);
    });

    const result = await detectKoubou();
    expect(result.available).toBe(true);
    expect(result.binaryPath).toBeTruthy();
  });

  it('handles version command failure gracefully', async () => {
    mockExecFile.mockImplementation((...args: unknown[]) => {
      const cmd = args[0] as string;
      if (cmd === 'which') {
        return Promise.resolve({ stdout: '/usr/local/bin/kou\n', stderr: '' });
      }
      // version command fails
      return Promise.reject(new Error('version failed'));
    });

    const result = await detectKoubou();
    expect(result.available).toBe(true);
    expect(result.binaryPath).toBe('/usr/local/bin/kou');
    expect(result.version).toBeNull();
  });
});
