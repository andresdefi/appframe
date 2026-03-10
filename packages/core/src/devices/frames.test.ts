import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./detector.js', () => ({
  detectKoubou: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  access: vi.fn(),
}));

import { getKoubouFramesDir, getDeviceFramePath } from './frames.js';
import { detectKoubou } from './detector.js';
import { access } from 'node:fs/promises';

const mockDetectKoubou = vi.mocked(detectKoubou);
const mockAccess = vi.mocked(access);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getKoubouFramesDir', () => {
  it('returns null when Koubou not detected', async () => {
    mockDetectKoubou.mockResolvedValue({ available: false, binaryPath: null, version: null });
    const result = await getKoubouFramesDir();
    expect(result).toBeNull();
  });

  it('returns path when found at known location', async () => {
    mockDetectKoubou.mockResolvedValue({
      available: true,
      binaryPath: '/Users/test/Library/Python/3.12/bin/kou',
      version: '1.0.0',
    });

    let callCount = 0;
    mockAccess.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve(undefined); // first candidate found
      return Promise.reject(new Error('not found'));
    });

    const result = await getKoubouFramesDir();
    expect(result).toBeTruthy();
  });

  it('returns null when no frames dir found', async () => {
    mockDetectKoubou.mockResolvedValue({
      available: true,
      binaryPath: '/usr/local/bin/kou',
      version: '1.0.0',
    });
    mockAccess.mockRejectedValue(new Error('not found'));

    const result = await getKoubouFramesDir();
    expect(result).toBeNull();
  });
});

describe('getDeviceFramePath', () => {
  it('returns null when frames dir not available', async () => {
    mockDetectKoubou.mockResolvedValue({ available: false, binaryPath: null, version: null });
    const result = await getDeviceFramePath('MacBook Air 2022');
    expect(result).toBeNull();
  });

  it('returns PNG path when file exists', async () => {
    mockDetectKoubou.mockResolvedValue({
      available: true,
      binaryPath: '/Users/test/Library/Python/3.12/bin/kou',
      version: '1.0.0',
    });
    mockAccess.mockResolvedValue(undefined);

    const result = await getDeviceFramePath('MacBook Air 2022');
    expect(result).toBeTruthy();
    expect(result).toContain('MacBook Air 2022.png');
  });
});
