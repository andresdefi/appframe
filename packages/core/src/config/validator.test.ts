import { describe, it, expect } from 'vitest';
import { validateConfig, validateConfigOrThrow } from './validator.js';

function makeValidConfig(overrides?: Record<string, unknown>) {
  return {
    app: {
      name: 'Test App',
      description: 'A test application',
      platforms: ['ios'],
    },
    theme: {
      style: 'minimal',
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        background: '#F8FAFC',
        text: '#0F172A',
      },
    },
    screens: [
      { screenshot: 'screen-1.png', headline: 'Welcome' },
    ],
    output: {
      platforms: ['ios'],
    },
    ...overrides,
  };
}

describe('validateConfig', () => {
  it('accepts a valid minimal config', () => {
    const result = validateConfig(makeValidConfig());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.config.app.name).toBe('Test App');
    }
  });

  it('fills defaults for optional fields', () => {
    const result = validateConfig(makeValidConfig());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.config.theme.font).toBe('inter');
      expect(result.config.theme.fontWeight).toBe(600);
      expect(result.config.frames.style).toBe('flat');
      expect(result.config.screens[0]!.layout).toBe('center');
    }
  });

  it('rejects missing app name', () => {
    const config = makeValidConfig({
      app: { name: '', description: 'test', platforms: ['ios'] },
    });
    const result = validateConfig(config);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.message.includes('App name is required'))).toBe(true);
    }
  });

  it('rejects empty platforms', () => {
    const config = makeValidConfig({
      app: { name: 'Test', description: 'test', platforms: [] },
    });
    const result = validateConfig(config);
    expect(result.success).toBe(false);
  });

  it('rejects invalid hex colors', () => {
    const config = makeValidConfig({
      theme: {
        style: 'minimal',
        colors: {
          primary: 'not-a-color',
          secondary: '#7C3AED',
          background: '#F8FAFC',
          text: '#0F172A',
        },
      },
    });
    const result = validateConfig(config);
    expect(result.success).toBe(false);
  });

  it('accepts valid hex colors (3, 6, and 8 digit)', () => {
    for (const color of ['#FFF', '#FF0000', '#FF0000FF']) {
      const config = makeValidConfig({
        theme: {
          style: 'minimal',
          colors: {
            primary: color,
            secondary: '#7C3AED',
            background: '#F8FAFC',
            text: '#0F172A',
          },
        },
      });
      const result = validateConfig(config);
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid template style', () => {
    const config = makeValidConfig({
      theme: {
        style: 'neon',
        colors: { primary: '#FFF', secondary: '#FFF', background: '#FFF', text: '#FFF' },
      },
    });
    const result = validateConfig(config);
    expect(result.success).toBe(false);
  });

  it('accepts all valid template styles', () => {
    for (const style of ['minimal', 'bold', 'dark', 'playful']) {
      const config = makeValidConfig({
        theme: {
          style,
          colors: { primary: '#FFF', secondary: '#FFF', background: '#FFF', text: '#FFF' },
        },
      });
      expect(validateConfig(config).success).toBe(true);
    }
  });

  it('rejects locale with mismatched screen count', () => {
    const config = makeValidConfig({
      locales: {
        es: {
          screens: [
            { headline: 'Hola' },
            { headline: 'Extra' },
          ],
        },
      },
    });
    const result = validateConfig(config);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.message.includes('same number of screens'))).toBe(true);
    }
  });

  it('accepts locale with matching screen count', () => {
    const config = makeValidConfig({
      locales: {
        es: { screens: [{ headline: 'Bienvenido' }] },
      },
    });
    const result = validateConfig(config);
    expect(result.success).toBe(true);
  });

  it('validates all layout variants', () => {
    const layouts = ['center', 'left', 'right', 'angled-left', 'angled-right', 'floating', 'side-by-side'];
    for (const layout of layouts) {
      const config = makeValidConfig({
        screens: [{ screenshot: 's.png', headline: 'Test', layout }],
      });
      expect(validateConfig(config).success).toBe(true);
    }
  });
});

describe('validateConfigOrThrow', () => {
  it('returns config on valid input', () => {
    const config = validateConfigOrThrow(makeValidConfig());
    expect(config.app.name).toBe('Test App');
  });

  it('throws with formatted message on invalid input', () => {
    expect(() => validateConfigOrThrow({})).toThrow('Invalid appframe config');
  });
});
