import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:fs/promises', () => ({
  access: vi.fn(),
}));

import { getKoubouFramesDir, getDeviceFramePath } from './frames.js';
import { access } from 'node:fs/promises';

const mockAccess = vi.mocked(access);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getKoubouFramesDir', () => {
  it('returns path when found at first candidate location', async () => {
    let callCount = 0;
    mockAccess.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve(undefined);
      return Promise.reject(new Error('not found'));
    });

    const result = await getKoubouFramesDir();
    expect(result).toBeTruthy();
  });

  it('returns null when no candidate directory exists', async () => {
    mockAccess.mockRejectedValue(new Error('not found'));
    const result = await getKoubouFramesDir();
    expect(result).toBeNull();
  });
});

describe('getDeviceFramePath', () => {
  it('returns null when no candidate frames dir exists', async () => {
    mockAccess.mockRejectedValue(new Error('not found'));
    const result = await getDeviceFramePath('MacBook Air 2022');
    expect(result).toBeNull();
  });

  it('returns PNG path when Koubou frames dir + file exist', async () => {
    mockAccess.mockResolvedValue(undefined);
    const result = await getDeviceFramePath('MacBook Air 2022');
    expect(result).toBeTruthy();
    expect(result).toContain('MacBook Air 2022.png');
  });

  it('resolves local: prefix to bundled frames dir without probing Koubou', async () => {
    mockAccess.mockResolvedValue(undefined);
    const result = await getDeviceFramePath('local:apple/iphone-17-pro/frame');
    expect(result).toBeTruthy();
    expect(result).toContain('frames/apple/iphone-17-pro/frame.png');
  });
});
