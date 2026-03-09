import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:child_process', () => ({
  execFile: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockResolvedValue(Buffer.from('PNG')),
  mkdir: vi.fn().mockResolvedValue(undefined),
  stat: vi.fn().mockResolvedValue({ isDirectory: () => false, size: 1000 }),
  readdir: vi.fn().mockResolvedValue([]),
  unlink: vi.fn().mockResolvedValue(undefined),
  rename: vi.fn().mockResolvedValue(undefined),
  rm: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('node:util', () => ({
  promisify: (fn: unknown) => fn,
}));

vi.mock('./detector.js', () => ({
  detectKoubou: vi.fn(),
}));

vi.mock('../config/loader.js', () => ({
  loadConfig: vi.fn(),
}));

// yaml is not mocked — real stringify works fine with the translator output

import { generateKoubouConfig, generateWithKoubou, renderSingleScreenWithKoubou } from './pipeline.js';
import { detectKoubou } from './detector.js';
import { loadConfig } from '../config/loader.js';
import { execFile } from 'node:child_process';
import { readdir, stat, readFile } from 'node:fs/promises';
import { createMinimalConfig, mockScreenshotDataUrl } from '../test-utils.js';
import type { KoubouDetectionResult } from './types.js';

const mockDetectKoubou = vi.mocked(detectKoubou);
const mockLoadConfig = vi.mocked(loadConfig);
const mockExecFile = vi.mocked(execFile);
const mockReaddir = vi.mocked(readdir);
const mockStat = vi.mocked(stat);
const mockReadFile = vi.mocked(readFile);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('generateKoubouConfig', () => {
  it('returns valid YAML string', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());
    const result = await generateKoubouConfig('/tmp/appframe.yml');
    expect(typeof result).toBe('string');
  });

  it('filters by screenIndex', async () => {
    const config = createMinimalConfig({
      screens: [
        { screenshot: 's1.png', headline: 'S1', layout: 'center', composition: 'single', autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [] },
        { screenshot: 's2.png', headline: 'S2', layout: 'center', composition: 'single', autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [] },
      ],
    });
    mockLoadConfig.mockResolvedValue(config);
    const result = await generateKoubouConfig('/tmp/appframe.yml', undefined, 0);
    expect(typeof result).toBe('string');
  });

  it('throws for out-of-range screenIndex', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());
    await expect(generateKoubouConfig('/tmp/appframe.yml', undefined, 5)).rejects.toThrow('out of range');
  });

  it('uses localization path when config has localization', async () => {
    const config = createMinimalConfig({
      localization: { baseLanguage: 'en', languages: ['en', 'es'], xcstringsPath: 'Localizable.xcstrings' },
    });
    mockLoadConfig.mockResolvedValue(config);
    const result = await generateKoubouConfig('/tmp/appframe.yml');
    expect(result).toContain('base_language');
    expect(result).toContain('en');
  });

  it('accepts explicit outputSize', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());
    const result = await generateKoubouConfig('/tmp/appframe.yml', 'iPhone6_9');
    expect(result).toContain('iPhone6_9');
  });

  it('negative screenIndex throws', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());
    await expect(generateKoubouConfig('/tmp/appframe.yml', undefined, -1)).rejects.toThrow('out of range');
  });
});

describe('generateWithKoubou', () => {
  it('throws when Koubou not installed', async () => {
    mockDetectKoubou.mockResolvedValue({ available: false, binaryPath: null, version: null });
    mockLoadConfig.mockResolvedValue(createMinimalConfig());

    await expect(generateWithKoubou({ configPath: '/tmp/appframe.yml' })).rejects.toThrow('not found');
  });

  it('throws for Android platform', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockLoadConfig.mockResolvedValue(createMinimalConfig());

    await expect(
      generateWithKoubou({ configPath: '/tmp/appframe.yml', platform: 'android' }),
    ).rejects.toThrow('only supports iOS');
  });

  it('runs kou binary and collects output files on success', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockLoadConfig.mockResolvedValue(createMinimalConfig());
    mockExecFile.mockResolvedValue({ stdout: '', stderr: '' } as never);
    // collectOutputFiles: readdir returns PNG, stat says not directory
    mockReaddir.mockResolvedValue(['screen_1_welcome.png'] as unknown as Awaited<ReturnType<typeof readdir>>);
    mockStat.mockResolvedValue({ isDirectory: () => false, size: 12345 } as Awaited<ReturnType<typeof stat>>);

    const result = await generateWithKoubou({ configPath: '/tmp/appframe.yml' });
    // 2 iOS sizes * 1 screen * 1 output file per run = 2
    expect(result.screenshots.length).toBe(2);
    expect(result.screenshots[0]!.fileSize).toBe(12345);
    expect(result.totalTime).toBeGreaterThanOrEqual(0);
  });

  it('calls onProgress callback', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockLoadConfig.mockResolvedValue(createMinimalConfig());
    mockExecFile.mockResolvedValue({ stdout: '', stderr: '' } as never);
    mockReaddir.mockResolvedValue([] as unknown as Awaited<ReturnType<typeof readdir>>);

    const onProgress = vi.fn();
    await generateWithKoubou({ configPath: '/tmp/appframe.yml', onProgress });
    expect(onProgress).toHaveBeenCalled();
  });

  it('throws when kou binary fails', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockLoadConfig.mockResolvedValue(createMinimalConfig());
    mockExecFile.mockRejectedValue(new Error('kou crashed'));

    await expect(generateWithKoubou({ configPath: '/tmp/appframe.yml' })).rejects.toThrow('Koubou generation failed');
  });

  it('generates with inline locales', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockLoadConfig.mockResolvedValue(createMinimalConfig({
      locales: { es: { screens: [{ headline: 'Hola' }] } },
    }));
    mockExecFile.mockResolvedValue({ stdout: '', stderr: '' } as never);
    mockReaddir.mockResolvedValue(['out.png'] as unknown as Awaited<ReturnType<typeof readdir>>);
    mockStat.mockResolvedValue({ isDirectory: () => false, size: 5000 } as Awaited<ReturnType<typeof stat>>);

    const result = await generateWithKoubou({ configPath: '/tmp/appframe.yml' });
    // 2 sizes * 2 locales (default + es) * 1 output = 4
    expect(result.screenshots.length).toBe(4);
  });

  it('generates with native localization (xcstrings)', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockLoadConfig.mockResolvedValue(createMinimalConfig({
      localization: { baseLanguage: 'en', languages: ['en', 'es'], xcstringsPath: 'Localizable.xcstrings' },
    }));
    mockExecFile.mockResolvedValue({ stdout: '', stderr: '' } as never);
    // readdir for language subdirs returns PNGs
    mockReaddir.mockResolvedValue(['out.png'] as unknown as Awaited<ReturnType<typeof readdir>>);
    mockStat.mockResolvedValue({ isDirectory: () => false, size: 5000 } as Awaited<ReturnType<typeof stat>>);

    const result = await generateWithKoubou({ configPath: '/tmp/appframe.yml' });
    // 2 sizes * 2 languages * 1 output = 4
    expect(result.screenshots.length).toBe(4);
  });

  it('filters by screenIndex', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockLoadConfig.mockResolvedValue(createMinimalConfig({
      screens: [
        { screenshot: 's1.png', headline: 'S1', layout: 'center', composition: 'single', autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [] },
        { screenshot: 's2.png', headline: 'S2', layout: 'center', composition: 'single', autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [] },
      ],
    }));
    mockExecFile.mockResolvedValue({ stdout: '', stderr: '' } as never);
    mockReaddir.mockResolvedValue(['out.png'] as unknown as Awaited<ReturnType<typeof readdir>>);
    mockStat.mockResolvedValue({ isDirectory: () => false, size: 5000 } as Awaited<ReturnType<typeof stat>>);

    const result = await generateWithKoubou({ configPath: '/tmp/appframe.yml', screenIndex: 0 });
    expect(result.screenshots.length).toBe(2); // 2 sizes, 1 screen
  });
});

describe('renderSingleScreenWithKoubou', () => {
  it('throws when Koubou not installed', async () => {
    mockDetectKoubou.mockResolvedValue({ available: false, binaryPath: null, version: null });

    await expect(
      renderSingleScreenWithKoubou({
        screenshotData: mockScreenshotDataUrl(),
        headline: 'Test',
        style: 'minimal',
        colors: { primary: '#FFF', secondary: '#FFF', background: '#FFF', text: '#000' },
        font: 'inter',
        fontWeight: 600,
        layout: 'center',
        frameStyle: 'flat',
        outputSize: 'iPhone6_7',
      }),
    ).rejects.toThrow('not found');
  });

  it('throws for invalid data URL', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);

    await expect(
      renderSingleScreenWithKoubou({
        screenshotData: 'not-a-data-url',
        headline: 'Test',
        style: 'minimal',
        colors: { primary: '#FFF', secondary: '#FFF', background: '#FFF', text: '#000' },
        font: 'inter',
        fontWeight: 600,
        layout: 'center',
        frameStyle: 'flat',
        outputSize: 'iPhone6_7',
      }),
    ).rejects.toThrow('Invalid screenshot data URL');
  });

  it('writes temp screenshot, runs kou, and returns PNG buffer', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockExecFile.mockResolvedValue({ stdout: '', stderr: '' } as never);
    // readdir returns a single output file
    mockReaddir.mockResolvedValue(['output.png'] as unknown as Awaited<ReturnType<typeof readdir>>);
    mockStat.mockResolvedValue({ isDirectory: () => false, size: 5000 } as Awaited<ReturnType<typeof stat>>);
    mockReadFile.mockResolvedValue(Buffer.from('PNG-OUTPUT'));

    const result = await renderSingleScreenWithKoubou({
      screenshotData: mockScreenshotDataUrl(),
      headline: 'Test',
      style: 'minimal',
      colors: { primary: '#FFF', secondary: '#FFF', background: '#FFF', text: '#000' },
      font: 'inter',
      fontWeight: 600,
      layout: 'center',
      frameStyle: 'flat',
      outputSize: 'iPhone6_7',
    });
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it('throws when Koubou produces no output', async () => {
    mockDetectKoubou.mockResolvedValue({ available: true, binaryPath: '/usr/bin/kou', version: '1.0.0' } as KoubouDetectionResult);
    mockExecFile.mockResolvedValue({ stdout: '', stderr: '' } as never);
    mockReaddir.mockResolvedValue([] as unknown as Awaited<ReturnType<typeof readdir>>);

    await expect(
      renderSingleScreenWithKoubou({
        screenshotData: mockScreenshotDataUrl(),
        headline: 'Test',
        style: 'minimal',
        colors: { primary: '#FFF', secondary: '#FFF', background: '#FFF', text: '#000' },
        font: 'inter',
        fontWeight: 600,
        layout: 'center',
        frameStyle: 'flat',
        outputSize: 'iPhone6_7',
      }),
    ).rejects.toThrow('no output files');
  });
});
