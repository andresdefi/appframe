import { describe, it, expect } from 'vitest';
import { mapSizeToKoubou, mapDeviceToKoubou, translateConfig, translateConfigWithLocale, translateConfigWithLocalization } from './translator.js';
import { createMinimalConfig } from '../test-utils.js';
import type { AppframeConfig } from '../config/schema.js';

describe('mapSizeToKoubou', () => {
  it.each([
    ['6.9', 'iPhone6_9'],
    ['6.7', 'iPhone6_7'],
    ['6.5', 'iPhone6_5'],
    ['6.1', 'iPhone6_1'],
    ['5.5', 'iPhone5_5'],
    ['ipad-12.9', 'iPadPro12_9'],
    ['ipad-11', 'iPadPro11'],
    ['ipad-13', 'iPadPro13'],
  ])('maps %s to %s', (input, expected) => {
    expect(mapSizeToKoubou(input)).toBe(expected);
  });

  it('returns null for unknown size', () => {
    expect(mapSizeToKoubou('99.9')).toBeNull();
  });
});

describe('mapDeviceToKoubou', () => {
  it('maps known device with color', () => {
    const result = mapDeviceToKoubou('ipad-pro-13-m4', 'Space Gray');
    expect(result).toBe('iPad Pro 13 - M4 - Space Gray - Portrait');
  });

  it('maps known device without color (uses default)', () => {
    const result = mapDeviceToKoubou('iphone-17-pro-max');
    expect(result).toBe('local:apple/iphone-17-pro-max/frame');
  });

  it('returns null for unknown device', () => {
    expect(mapDeviceToKoubou('nonexistent')).toBeNull();
  });
});

describe('translateConfig', () => {
  const baseConfig = createMinimalConfig();

  it('returns a valid KoubouConfig structure', () => {
    const result = translateConfig({
      config: baseConfig,
      configDir: '/tmp/test',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/output',
    });

    expect(result.project.name).toBe('Test App');
    expect(result.project.output_size).toBe('iPhone6_7');
    expect(result.project.output_dir).toBe('/tmp/output');
    expect(result.project.device).toBeTruthy();
    expect(result.defaults?.background).toBeDefined();
    expect(Object.keys(result.screenshots).length).toBe(1);
  });

  it('maps solid background for minimal style', () => {
    const result = translateConfig({
      config: createMinimalConfig({ theme: { ...baseConfig.theme, style: 'minimal' } }),
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    expect(result.defaults?.background?.type).toBe('solid');
  });

  it('maps linear background for glow style', () => {
    const result = translateConfig({
      config: createMinimalConfig({ theme: { ...baseConfig.theme, style: 'glow' } }),
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    expect(result.defaults?.background?.type).toBe('linear');
  });

  it('maps radial background for bold style', () => {
    const result = translateConfig({
      config: createMinimalConfig({ theme: { ...baseConfig.theme, style: 'bold' } }),
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    expect(result.defaults?.background?.type).toBe('radial');
  });

  it('maps radial background for playful style', () => {
    const result = translateConfig({
      config: createMinimalConfig({ theme: { ...baseConfig.theme, style: 'playful' } }),
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    expect(result.defaults?.background?.type).toBe('radial');
  });

  it('maps solid primary for branded style', () => {
    const result = translateConfig({
      config: createMinimalConfig({ theme: { ...baseConfig.theme, style: 'branded' } }),
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    expect(result.defaults?.background?.type).toBe('solid');
    expect(result.defaults?.background?.color).toBe('#2563EB');
  });

  it('maps solid black for fullscreen style', () => {
    const result = translateConfig({
      config: createMinimalConfig({ theme: { ...baseConfig.theme, style: 'fullscreen' } }),
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    expect(result.defaults?.background?.type).toBe('solid');
    expect(result.defaults?.background?.color).toBe('#000000');
  });

  it('maps solid background for clean and editorial', () => {
    for (const style of ['clean', 'editorial'] as const) {
      const result = translateConfig({
        config: createMinimalConfig({ theme: { ...baseConfig.theme, style } }),
        configDir: '/tmp',
        outputSize: 'iPhone6_7',
        outputDir: '/tmp/out',
      });
      expect(result.defaults?.background?.type).toBe('solid');
      expect(result.defaults?.background?.color).toBe('#F8FAFC');
    }
  });

  it('includes headline text element for non-fullscreen', () => {
    const result = translateConfig({
      config: baseConfig,
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    const screen = Object.values(result.screenshots)[0]!;
    const textElements = screen.content.filter((e) => e.type === 'text');
    expect(textElements.length).toBeGreaterThanOrEqual(1);
    expect(textElements[0]!).toMatchObject({ type: 'text', content: 'Welcome' });
  });

  it('includes subtitle when provided', () => {
    const config = createMinimalConfig({
      screens: [
        {
          screenshot: 's.png',
          headline: 'Hi',
          subtitle: 'Sub text',
          layout: 'center',
          composition: 'single',
          autoSizeHeadline: false,
          autoSizeSubtitle: false,
          annotations: [],
          
        },
      ],
    });
    const result = translateConfig({
      config,
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    const screen = Object.values(result.screenshots)[0]!;
    const texts = screen.content.filter((e) => e.type === 'text');
    expect(texts.length).toBe(2);
    expect(texts[1]!).toMatchObject({ type: 'text', content: 'Sub text' });
  });

  it('omits text elements for fullscreen style', () => {
    const config = createMinimalConfig({ theme: { ...baseConfig.theme, style: 'fullscreen' } });
    const result = translateConfig({
      config,
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    const screen = Object.values(result.screenshots)[0]!;
    const texts = screen.content.filter((e) => e.type === 'text');
    expect(texts.length).toBe(0);
  });

  it('includes image element', () => {
    const result = translateConfig({
      config: baseConfig,
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    const screen = Object.values(result.screenshots)[0]!;
    const images = screen.content.filter((e) => e.type === 'image');
    expect(images.length).toBe(1);
  });

  it('resolves font name from catalog', () => {
    const result = translateConfig({
      config: baseConfig,
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    const screen = Object.values(result.screenshots)[0]!;
    const text = screen.content.find((e) => e.type === 'text');
    expect(text).toBeDefined();
    if (text && 'font' in text) {
      expect(text.font).toBe('Inter');
    }
  });

  it('sanitizes screen names', () => {
    const result = translateConfig({
      config: baseConfig,
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    const keys = Object.keys(result.screenshots);
    expect(keys[0]).toMatch(/^screen_\d+_\w+$/);
  });

  it('handles duo-overlap composition with extra devices', () => {
    const config: AppframeConfig = {
      ...baseConfig,
      screens: [
        {
          screenshot: 'main.png',
          headline: 'Hello',
          layout: 'center',
          composition: 'duo-overlap',
          extraDevices: [{ screenshot: 'extra.png' }],
          autoSizeHeadline: false,
          autoSizeSubtitle: false,
          annotations: [],
          
        },
      ],
    };
    const result = translateConfig({
      config,
      configDir: '/tmp',
      outputSize: 'iPhone6_7',
      outputDir: '/tmp/out',
    });
    const screen = Object.values(result.screenshots)[0]!;
    const images = screen.content.filter((e) => e.type === 'image');
    expect(images.length).toBe(2);
  });
});

describe('translateConfig — spotlight, annotations, zoom callouts', () => {
  it('includes spotlight element when screen has spotlight', () => {
    const config = createMinimalConfig({
      screens: [{
        screenshot: 's.png', headline: 'Hi', layout: 'center', composition: 'single',
        autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [],
        spotlight: { x: 50, y: 50, w: 30, h: 30, shape: 'circle', dimOpacity: 0.6, blur: 5 },
      }],
    });
    const result = translateConfig({ config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out' });
    const screen = Object.values(result.screenshots)[0]!;
    const spotlights = screen.content.filter((e) => e.type === 'spotlight');
    expect(spotlights).toHaveLength(1);
    expect(spotlights[0]).toMatchObject({ type: 'spotlight', shape: 'circle' });
  });

  it('includes highlight elements for annotations', () => {
    const config = createMinimalConfig({
      screens: [{
        screenshot: 's.png', headline: 'Hi', layout: 'center', composition: 'single',
        autoSizeHeadline: false, autoSizeSubtitle: false, 
        annotations: [
          { id: 'a1', shape: 'circle', x: 10, y: 20, w: 30, h: 30, strokeColor: '#FF0000', strokeWidth: 4 },
          { id: 'a2', shape: 'rectangle', x: 50, y: 50, w: 20, h: 20, strokeColor: '#00FF00', strokeWidth: 2, fillColor: '#0000FF' },
        ],
      }],
    });
    const result = translateConfig({ config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out' });
    const screen = Object.values(result.screenshots)[0]!;
    const highlights = screen.content.filter((e) => e.type === 'highlight');
    expect(highlights).toHaveLength(2);
    expect(highlights[0]).toMatchObject({ type: 'highlight', shape: 'circle', color: '#FF0000' });
    expect(highlights[1]).toMatchObject({ type: 'highlight', fill_color: '#0000FF' });
  });

  it('includes per-screen background override', () => {
    const config = createMinimalConfig({
      screens: [{
        screenshot: 's.png', headline: 'Hi', layout: 'center', composition: 'single',
        autoSizeHeadline: false, autoSizeSubtitle: false, annotations: [],
        background: '#FF0000',
      }],
    });
    const result = translateConfig({ config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out' });
    const screen = Object.values(result.screenshots)[0]!;
    expect(screen.background).toMatchObject({ type: 'solid', color: '#FF0000' });
  });

  it('resolves device via frames.ios config', () => {
    const config = createMinimalConfig({
      frames: { style: 'flat', ios: 'iphone-16-pro-max' },
    });
    const result = translateConfig({ config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out' });
    expect(result.project.device).toContain('iPhone 16 Pro Max');
  });

  it('uses frame: false when frameStyle is none', () => {
    const config = createMinimalConfig({ frames: { style: 'none' } });
    const result = translateConfig({ config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out' });
    const screen = Object.values(result.screenshots)[0]!;
    const images = screen.content.filter((e) => e.type === 'image');
    expect(images[0]).toMatchObject({ frame: false });
  });

  it('uses canvas width from KOUBOU_DIMENSIONS for font sizing', () => {
    const config = createMinimalConfig();
    // iPhone6_9 has width 1320
    const result = translateConfig({ config, configDir: '/tmp', outputSize: 'iPhone6_9', outputDir: '/tmp/out' });
    const screen = Object.values(result.screenshots)[0]!;
    const text = screen.content.find((e) => e.type === 'text');
    expect(text).toBeDefined();
    if (text && 'size' in text) {
      // 1320 * 0.075 = 99
      expect(text.size).toBe(99);
    }
  });
});

describe('translateConfigWithLocale', () => {
  it('overrides headline and subtitle from locale', () => {
    const config = createMinimalConfig();
    const result = translateConfigWithLocale(
      { config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out' },
      'es',
      [{ headline: 'Hola', subtitle: 'Subtítulo' }],
    );
    const screen = Object.values(result.screenshots)[0]!;
    const texts = screen.content.filter((e) => e.type === 'text');
    expect(texts[0]!).toMatchObject({ content: 'Hola' });
    expect(texts[1]!).toMatchObject({ content: 'Subtítulo' });
  });

  it('overrides screenshot path when provided', () => {
    const config = createMinimalConfig();
    const result = translateConfigWithLocale(
      { config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out' },
      'es',
      [{ headline: 'Hola', screenshot: 'es-screen.png' }],
    );
    const screen = Object.values(result.screenshots)[0]!;
    const images = screen.content.filter((e) => e.type === 'image');
    expect(images[0]).toBeDefined();
    if ('asset' in images[0]!) {
      expect(images[0]!.asset).toContain('es-screen.png');
    }
  });
});

describe('translateConfigWithLocalization', () => {
  it('adds localization block to config', () => {
    const config = createMinimalConfig({
      localization: { baseLanguage: 'en', languages: ['en', 'es', 'fr'], xcstringsPath: 'Localizable.xcstrings' },
    });
    const result = translateConfigWithLocalization({
      config, configDir: '/tmp/project', outputSize: 'iPhone6_7', outputDir: '/tmp/out',
    });
    expect(result.localization).toBeDefined();
    expect(result.localization!.base_language).toBe('en');
    expect(result.localization!.languages).toEqual(['en', 'es', 'fr']);
    expect(result.localization!.xcstrings_path).toContain('Localizable.xcstrings');
  });

  it('throws when config.localization is not set', () => {
    const config = createMinimalConfig();
    expect(() => translateConfigWithLocalization({
      config, configDir: '/tmp', outputSize: 'iPhone6_7', outputDir: '/tmp/out',
    })).toThrow('requires config.localization');
  });
});
