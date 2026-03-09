import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/loader.js', () => ({
  loadConfig: vi.fn(),
}));

vi.mock('../frames/loader.js', () => ({
  loadFrameManifest: vi.fn().mockResolvedValue(undefined),
  getFrame: vi.fn().mockResolvedValue(undefined),
  getDefaultFrame: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../templates/engine.js', () => {
  return {
    TemplateEngine: class {
      render = vi.fn().mockResolvedValue('<html><head></head><body>mock</body></html>');
    },
  };
});

vi.mock('./renderer.js', () => {
  return {
    Renderer: class {
      init = vi.fn().mockResolvedValue(undefined);
      render = vi.fn().mockImplementation((opts: { outputPath: string; width: number; height: number }) =>
        Promise.resolve({ outputPath: opts.outputPath, width: opts.width * 2, height: opts.height * 2, fileSize: 50000 }),
      );
      close = vi.fn().mockResolvedValue(undefined);
    },
  };
});

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(Buffer.from('PNG')),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

import { generateScreenshots } from './pipeline.js';
import { loadConfig } from '../config/loader.js';
import { createMinimalConfig } from '../test-utils.js';

const mockLoadConfig = vi.mocked(loadConfig);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('generateScreenshots', () => {
  it('produces correct file count for single screen', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml' });
    expect(result.screenshots.length).toBe(2); // default iOS: 6.7 + 6.5
    expect(result.totalTime).toBeGreaterThanOrEqual(0);
  });

  it('respects platform filter', async () => {
    const config = createMinimalConfig({
      output: { platforms: ['ios', 'android'], directory: './output' },
    });
    mockLoadConfig.mockResolvedValue(config);

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml', platform: 'ios' });
    for (const s of result.screenshots) {
      expect(s.outputPath).toContain('ios');
    }
  });

  it('respects screen filter', async () => {
    const config = createMinimalConfig({
      screens: [
        { screenshot: 's1.png', headline: 'S1', layout: 'center', composition: 'single', autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [] },
        { screenshot: 's2.png', headline: 'S2', layout: 'center', composition: 'single', autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [] },
      ],
    });
    mockLoadConfig.mockResolvedValue(config);

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml', screenIndex: 0 });
    // Only screen 0 generated across 2 iOS sizes
    expect(result.screenshots.length).toBe(2);
  });

  it('calls onProgress', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());

    const progress = vi.fn();
    await generateScreenshots({ configPath: '/tmp/appframe.yml', onProgress: progress });
    expect(progress).toHaveBeenCalled();
    expect(progress.mock.calls[0]![0]).toBe(1); // current step
  });

  it('follows naming convention', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml' });
    for (const s of result.screenshots) {
      expect(s.outputPath).toMatch(/test_app.*\.png$/);
    }
  });

  it('generates for inline locales (default + locale)', async () => {
    const config = createMinimalConfig({
      locales: {
        es: { screens: [{ headline: 'Hola' }] },
      },
    });
    mockLoadConfig.mockResolvedValue(config);

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml' });
    // 2 sizes * 2 locales (default + es) * 1 screen = 4
    expect(result.screenshots.length).toBe(4);
  });

  it('generates for xcstrings localization mode', async () => {
    const config = createMinimalConfig({
      localization: { baseLanguage: 'en', languages: ['en', 'es'], xcstringsPath: 'Localizable.xcstrings' },
    });
    mockLoadConfig.mockResolvedValue(config);

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml' });
    // 2 sizes * 2 languages * 1 screen = 4
    expect(result.screenshots.length).toBe(4);
  });

  it('respects locale filter', async () => {
    const config = createMinimalConfig({
      locales: {
        es: { screens: [{ headline: 'Hola' }] },
        fr: { screens: [{ headline: 'Bonjour' }] },
      },
    });
    mockLoadConfig.mockResolvedValue(config);

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml', locale: 'es' });
    // 2 sizes * 1 locale * 1 screen = 2
    expect(result.screenshots.length).toBe(2);
  });

  it('renders with templateOverride', async () => {
    mockLoadConfig.mockResolvedValue(createMinimalConfig());

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml', templateOverride: 'bold' });
    expect(result.screenshots.length).toBe(2);
  });

  it('handles screens with spotlight, annotations, and zoom callouts', async () => {
    const config = createMinimalConfig({
      screens: [{
        screenshot: 'test.png', headline: 'Hi', layout: 'center', composition: 'single',
        autoSizeHeadline: false, autoSizeSubtitle: false,
        spotlight: { x: 50, y: 50, w: 30, h: 30, shape: 'rectangle' as const, dimOpacity: 0.6, blur: 0 },
        annotations: [{ id: 'a1', shape: 'circle' as const, x: 10, y: 10, w: 20, h: 20, strokeColor: '#F00', strokeWidth: 3 }],
      }],
    });
    mockLoadConfig.mockResolvedValue(config);

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml' });
    expect(result.screenshots.length).toBe(2);
  });

  it('generates for android platform', async () => {
    const config = createMinimalConfig({
      app: { name: 'Test App', description: 'D', platforms: ['android'], features: [] },
      output: { platforms: ['android'], directory: './output' },
    });
    mockLoadConfig.mockResolvedValue(config);

    const result = await generateScreenshots({ configPath: '/tmp/appframe.yml' });
    // Android default: 'phone' size only
    expect(result.screenshots.length).toBe(1);
  });
});
