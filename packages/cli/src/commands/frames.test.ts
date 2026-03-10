import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@appframe/core', () => ({
  listFrames: vi.fn().mockResolvedValue([
    {
      id: 'iphone-16-pro-max',
      name: 'iPhone 16 Pro Max',
      manufacturer: 'apple',
      year: 2024,
      platform: 'ios',
      tags: ['pro', 'max'],
      screenResolution: { width: 1320, height: 2868 },
      frameSize: { width: 1400, height: 3000 },
    },
  ]),
  getDeviceFamilies: vi.fn().mockReturnValue([
    {
      id: 'iphone-16-pro-max',
      name: 'iPhone 16 Pro Max',
      category: 'iphone',
      year: 2024,
      colors: [{ name: 'Natural Titanium', koubouId: 'iPhone 16 Pro Max - Natural Titanium - Portrait' }],
      landscapeColors: [{ name: 'Natural Titanium', koubouId: 'iPhone 16 Pro Max - Natural Titanium - Landscape' }],
      defaultColor: 'Natural Titanium',
      screenResolution: { width: 1320, height: 2868 },
      appStoreSize: 'iPhone6_9',
      previewFrameId: 'generic-phone',
    },
  ]),
}));

vi.mock('chalk', () => ({
  default: {
    blue: (s: string) => s,
    bold: (s: string) => s,
    green: (s: string) => s,
    dim: (s: string) => s,
    yellow: (s: string) => s,
    red: (s: string) => s,
  },
}));

import { framesCommand } from './frames.js';
import { listFrames, getDeviceFamilies } from '@appframe/core';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('frames list', () => {
  it('calls listFrames', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const listCmd = framesCommand.commands.find((c) => c.name() === 'list')!;
    await listCmd.parseAsync(['node', 'test']);
    expect(listFrames).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('frames list --koubou', () => {
  it('calls getDeviceFamilies', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const listCmd = framesCommand.commands.find((c) => c.name() === 'list')!;
    await listCmd.parseAsync(['node', 'test', '--koubou']);
    expect(getDeviceFamilies).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
