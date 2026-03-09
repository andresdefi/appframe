import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@appframe/core', () => ({
  loadConfig: vi.fn().mockResolvedValue({
    app: { name: 'Test App', description: 'D', platforms: ['ios'], features: [] },
    theme: { style: 'minimal', colors: { primary: '#2563EB', secondary: '#7C3AED', background: '#F8FAFC', text: '#0F172A' }, font: 'inter', fontWeight: 600 },
    frames: { style: 'flat' },
    screens: [{ screenshot: 'screen-1.png', headline: 'Welcome', layout: 'center', composition: 'single', autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [] }],
    output: { platforms: ['ios'], directory: './output' },
  }),
  generateScreenshots: vi.fn().mockResolvedValue({ screenshots: [], totalTime: 100 }),
  generateWithKoubou: vi.fn().mockResolvedValue({ screenshots: [], totalTime: 100 }),
  detectKoubou: vi.fn().mockResolvedValue({ available: false, binaryPath: null, version: null }),
}));

vi.mock('chalk', () => ({
  default: {
    blue: (s: string) => s,
    bold: (s: string) => s,
    green: (s: string) => s,
    dim: (s: string) => s,
    cyan: (s: string) => s,
    yellow: (s: string) => s,
    red: (s: string) => s,
  },
}));

import { generateCommand } from './generate.js';
import { loadConfig, generateScreenshots, generateWithKoubou, detectKoubou } from '@appframe/core';

const mockLoadConfig = vi.mocked(loadConfig);
const mockGenerateScreenshots = vi.mocked(generateScreenshots);
const mockGenerateWithKoubou = vi.mocked(generateWithKoubou);
const mockDetectKoubou = vi.mocked(detectKoubou);

let consoleSpy: ReturnType<typeof vi.spyOn>;
let stdoutSpy: ReturnType<typeof vi.spyOn>;
let exitSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.clearAllMocks();
  consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => { throw new Error('process.exit'); }) as never);
});

afterEach(() => {
  consoleSpy.mockRestore();
  stdoutSpy.mockRestore();
  exitSpy.mockRestore();
});

describe('generate command', () => {
  it('uses playwright renderer by default when koubou unavailable', async () => {
    await generateCommand.parseAsync(['node', 'test', '-c', '/tmp/appframe.yml', '-r', 'auto']);
    expect(mockGenerateScreenshots).toHaveBeenCalled();
    expect(mockGenerateWithKoubou).not.toHaveBeenCalled();
  });

  it('uses koubou renderer when specified', async () => {
    await generateCommand.parseAsync(['node', 'test', '-c', '/tmp/appframe.yml', '-r', 'koubou']);
    expect(mockGenerateWithKoubou).toHaveBeenCalled();
    expect(mockGenerateScreenshots).not.toHaveBeenCalled();
  });

  it('uses playwright renderer when specified', async () => {
    await generateCommand.parseAsync(['node', 'test', '-c', '/tmp/appframe.yml', '-r', 'playwright']);
    expect(mockGenerateScreenshots).toHaveBeenCalled();
  });

  it('auto selects koubou when available', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' });
    await generateCommand.parseAsync(['node', 'test', '-c', '/tmp/appframe.yml', '-r', 'auto']);
    expect(mockGenerateWithKoubou).toHaveBeenCalled();
  });

  it('handles --dry-run flag', async () => {
    await generateCommand.parseAsync(['node', 'test', '-c', '/tmp/appframe.yml', '--dry-run']);
    expect(mockGenerateScreenshots).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Dry run'));
  });

  it('handles generation error', async () => {
    mockGenerateScreenshots.mockRejectedValue(new Error('render failed'));
    await expect(
      generateCommand.parseAsync(['node', 'test', '-c', '/tmp/appframe.yml', '-r', 'playwright']),
    ).rejects.toThrow('process.exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('handles config load error', async () => {
    mockLoadConfig.mockRejectedValue(new Error('config not found'));
    await expect(
      generateCommand.parseAsync(['node', 'test', '-c', '/nonexistent.yml', '-r', 'playwright']),
    ).rejects.toThrow('process.exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
