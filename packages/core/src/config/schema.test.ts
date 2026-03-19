import { describe, it, expect } from 'vitest';
import {
  appframeConfigSchema,
  appConfigSchema,
  themeConfigSchema,
  frameConfigSchema,
  screenConfigSchema,
  spotlightConfigSchema,
  annotationSchema,
  localizationConfigSchema,
  outputConfigSchema,
  platformSchema,
  templateStyleSchema,
  frameStyleSchema,
  layoutVariantSchema,
  compositionPresetSchema,
  colorConfigSchema,
} from './schema.js';

describe('hex color validation', () => {
  it('accepts 3-digit hex', () => {
    expect(
      colorConfigSchema.safeParse({
        primary: '#FFF',
        secondary: '#000',
        background: '#ABC',
        text: '#123',
      }).success,
    ).toBe(true);
  });

  it('accepts 6-digit hex', () => {
    expect(
      colorConfigSchema.safeParse({
        primary: '#FF0000',
        secondary: '#00FF00',
        background: '#0000FF',
        text: '#ABCDEF',
      }).success,
    ).toBe(true);
  });

  it('accepts 8-digit hex (with alpha)', () => {
    expect(
      colorConfigSchema.safeParse({
        primary: '#FF0000FF',
        secondary: '#00FF0080',
        background: '#0000FF00',
        text: '#ABCDEFCC',
      }).success,
    ).toBe(true);
  });

  it('rejects invalid hex', () => {
    expect(
      colorConfigSchema.safeParse({
        primary: 'red',
        secondary: '#00',
        background: '#GGGGGG',
        text: '#12345',
      }).success,
    ).toBe(false);
  });
});

describe('platformSchema', () => {
  it('accepts ios and android', () => {
    expect(platformSchema.safeParse('ios').success).toBe(true);
    expect(platformSchema.safeParse('android').success).toBe(true);
  });

  it('rejects unknown', () => {
    expect(platformSchema.safeParse('web').success).toBe(false);
  });
});

describe('templateStyleSchema', () => {
  it('accepts all valid styles', () => {
    for (const s of [
      'minimal',
      'bold',
      'glow',
      'playful',
      'clean',
      'branded',
      'editorial',
      'fullscreen',
    ]) {
      expect(templateStyleSchema.safeParse(s).success).toBe(true);
    }
  });

  it('rejects unknown', () => {
    expect(templateStyleSchema.safeParse('neon').success).toBe(false);
  });
});

describe('frameStyleSchema', () => {
  it('accepts all valid frame styles', () => {
    for (const s of ['flat', '3d', 'none']) {
      expect(frameStyleSchema.safeParse(s).success).toBe(true);
    }
  });

  it('rejects unknown', () => {
    expect(frameStyleSchema.safeParse('glossy').success).toBe(false);
  });
});

describe('layoutVariantSchema', () => {
  it('accepts all valid layouts', () => {
    for (const l of ['center', 'angled-left', 'angled-right']) {
      expect(layoutVariantSchema.safeParse(l).success).toBe(true);
    }
  });

  it('rejects unknown', () => {
    expect(layoutVariantSchema.safeParse('stacked').success).toBe(false);
  });
});

describe('compositionPresetSchema', () => {
  it('accepts all valid presets', () => {
    for (const p of ['single', 'duo-overlap', 'duo-split', 'hero-tilt', 'fanned-cards']) {
      expect(compositionPresetSchema.safeParse(p).success).toBe(true);
    }
  });

  it('rejects unknown', () => {
    expect(compositionPresetSchema.safeParse('triple').success).toBe(false);
  });
});

describe('appConfigSchema', () => {
  it('accepts valid input', () => {
    const result = appConfigSchema.safeParse({
      name: 'App',
      description: 'Desc',
      platforms: ['ios'],
    });
    expect(result.success).toBe(true);
  });

  it('fills features default', () => {
    const result = appConfigSchema.safeParse({
      name: 'App',
      description: 'Desc',
      platforms: ['ios'],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.features).toEqual([]);
  });

  it('rejects empty name', () => {
    expect(
      appConfigSchema.safeParse({ name: '', description: 'Desc', platforms: ['ios'] }).success,
    ).toBe(false);
  });

  it('rejects empty platforms', () => {
    expect(
      appConfigSchema.safeParse({ name: 'App', description: 'Desc', platforms: [] }).success,
    ).toBe(false);
  });
});

describe('themeConfigSchema', () => {
  it('accepts valid input with defaults', () => {
    const result = themeConfigSchema.safeParse({
      style: 'minimal',
      colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.font).toBe('inter');
      expect(result.data.fontWeight).toBe(600);
    }
  });

  it('rejects fontWeight outside range', () => {
    expect(
      themeConfigSchema.safeParse({
        style: 'minimal',
        colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' },
        fontWeight: 1000,
      }).success,
    ).toBe(false);
  });
});

describe('frameConfigSchema', () => {
  it('fills default style', () => {
    const result = frameConfigSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.style).toBe('flat');
  });
});

describe('screenConfigSchema', () => {
  it('accepts valid input with defaults', () => {
    const result = screenConfigSchema.safeParse({ screenshot: 'test.png', headline: 'Hi' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.layout).toBe('center');
      expect(result.data.composition).toBe('single');
      expect(result.data.annotations).toEqual([]);
    }
  });

  it('rejects empty screenshot', () => {
    expect(screenConfigSchema.safeParse({ screenshot: '', headline: 'Hi' }).success).toBe(false);
  });

  it('rejects empty headline', () => {
    expect(screenConfigSchema.safeParse({ screenshot: 'test.png', headline: '' }).success).toBe(
      false,
    );
  });
});

describe('spotlightConfigSchema', () => {
  it('fills defaults', () => {
    const result = spotlightConfigSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.shape).toBe('rectangle');
      expect(result.data.dimOpacity).toBe(0.6);
    }
  });

  it('rejects out-of-range values', () => {
    expect(spotlightConfigSchema.safeParse({ x: 200 }).success).toBe(false);
    expect(spotlightConfigSchema.safeParse({ dimOpacity: 2 }).success).toBe(false);
  });
});

describe('annotationSchema', () => {
  it('fills defaults', () => {
    const result = annotationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.shape).toBe('rounded-rect');
      expect(result.data.strokeColor).toBe('#FF3B30');
    }
  });

  it('rejects strokeWidth outside range', () => {
    expect(annotationSchema.safeParse({ strokeWidth: 25 }).success).toBe(false);
  });
});

describe('localizationConfigSchema', () => {
  it('accepts valid input', () => {
    const result = localizationConfigSchema.safeParse({
      baseLanguage: 'en',
      languages: ['en', 'es'],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.xcstringsPath).toBe('Localizable.xcstrings');
  });

  it('rejects empty languages', () => {
    expect(localizationConfigSchema.safeParse({ baseLanguage: 'en', languages: [] }).success).toBe(
      false,
    );
  });
});

describe('outputConfigSchema', () => {
  it('fills defaults', () => {
    const result = outputConfigSchema.safeParse({ platforms: ['ios'] });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.directory).toBe('./output');
  });

  it('rejects empty platforms', () => {
    expect(outputConfigSchema.safeParse({ platforms: [] }).success).toBe(false);
  });
});

describe('appframeConfigSchema refinements', () => {
  const validBase = {
    app: { name: 'App', description: 'D', platforms: ['ios'] },
    theme: {
      style: 'minimal',
      colors: { primary: '#FFF', secondary: '#000', background: '#FFF', text: '#000' },
    },
    screens: [{ screenshot: 'test.png', headline: 'Hi' }],
    output: { platforms: ['ios'] },
  };

  it('rejects mismatched locale/screen counts', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      locales: { es: { screens: [{ headline: 'Hola' }, { headline: 'Extra' }] } },
    });
    expect(result.success).toBe(false);
  });

  it('rejects individual locale configs without matching screen entries', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      locales: { es: {} },
    });
    expect(result.success).toBe(false);
  });

  it('accepts panoramic locale overrides with matching element counts', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      mode: 'panoramic',
      screens: [],
      frameCount: 2,
      panoramic: {
        background: { type: 'solid', color: '#ffffff' },
        elements: [
          { type: 'text', content: 'Hello', x: 5, y: 5, fontSize: 3 },
          { type: 'device', screenshot: 'screen.png', x: 20, y: 20, width: 15 },
        ],
      },
      locales: {
        es: {
          panoramic: {
            elements: [{ content: 'Hola' }, { screenshot: 'screen-es.png' }],
          },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects panoramic locale overrides with mismatched element counts', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      mode: 'panoramic',
      screens: [],
      frameCount: 2,
      panoramic: {
        background: { type: 'solid', color: '#ffffff' },
        elements: [
          { type: 'text', content: 'Hello', x: 5, y: 5, fontSize: 3 },
          { type: 'device', screenshot: 'screen.png', x: 20, y: 20, width: 15 },
        ],
      },
      locales: {
        es: {
          panoramic: {
            elements: [{ content: 'Hola' }],
          },
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects both locales and localization', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      locales: { es: { screens: [{ headline: 'Hola' }] } },
      localization: { baseLanguage: 'en', languages: ['en', 'es'] },
    });
    expect(result.success).toBe(false);
  });

  it('rejects baseLanguage not in languages array', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      localization: { baseLanguage: 'fr', languages: ['en', 'es'] },
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid localization config', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      localization: { baseLanguage: 'en', languages: ['en', 'es'] },
    });
    expect(result.success).toBe(true);
  });

  it('accepts panoramic image elements', () => {
    const result = appframeConfigSchema.safeParse({
      ...validBase,
      mode: 'panoramic',
      screens: [],
      frameCount: 3,
      panoramic: {
        background: { type: 'solid', color: '#ffffff' },
        elements: [
          {
            type: 'image',
            src: 'assets/logo.png',
            x: 5,
            y: 10,
            width: 12,
            height: 8,
            fit: 'contain',
          },
          { type: 'text', content: 'Hello', x: 20, y: 20, fontSize: 3 },
        ],
      },
    });
    expect(result.success).toBe(true);
  });
});
