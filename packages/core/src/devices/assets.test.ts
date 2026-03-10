import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

import { resolveLocalizedAsset } from './assets.js';
import { existsSync } from 'node:fs';

const mockExistsSync = vi.mocked(existsSync);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('resolveLocalizedAsset', () => {
  it('returns locale-specific path when it exists', () => {
    mockExistsSync.mockReturnValue(true);

    const result = resolveLocalizedAsset('screenshots/screen1.png', 'es', 'en', '/config');
    expect(result).toContain('/es/');
    expect(result).toContain('screen1.png');
  });

  it('falls back to base language when locale-specific not found', () => {
    mockExistsSync.mockImplementation((path) => {
      if (typeof path === 'string' && path.includes('/es/')) return false;
      if (typeof path === 'string' && path.includes('/en/')) return true;
      return false;
    });

    const result = resolveLocalizedAsset('screenshots/screen1.png', 'es', 'en', '/config');
    expect(result).toContain('/en/');
    expect(result).toContain('screen1.png');
  });

  it('falls back to original path when neither locale nor base exists', () => {
    mockExistsSync.mockReturnValue(false);

    const result = resolveLocalizedAsset('screenshots/screen1.png', 'es', 'en', '/config');
    expect(result).toBe('/config/screenshots/screen1.png');
  });

  it('skips base language fallback when locale equals base language', () => {
    mockExistsSync.mockReturnValue(false);

    const result = resolveLocalizedAsset('screenshots/screen1.png', 'en', 'en', '/config');
    // Should go directly from locale to original path (no double-check for base)
    expect(result).toBe('/config/screenshots/screen1.png');
    // existsSync should only be called once (for locale path), not for base
    expect(mockExistsSync).toHaveBeenCalledTimes(1);
  });
});
