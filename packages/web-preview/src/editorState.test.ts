import { describe, it, expect } from 'vitest';
import type { AppframeConfig } from '@appframe/core';
import { buildConfigFromEditorState } from './editorState.js';

function baseConfig(): AppframeConfig {
  return {
    mode: 'individual',
    app: {
      name: 'Test App',
      description: 'Testing',
      platforms: ['ios'],
      features: [],
    },
    theme: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        background: '#FFFFFF',
        text: '#000000',
        subtitle: '#666666',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: { style: 'flat' },
    screens: [
      {
        screenshot: 'screenshots/one.png',
        headline: 'Default headline 1',
        subtitle: '',
        layout: 'center',
        composition: 'single',
        annotations: [],
      },
      {
        screenshot: 'screenshots/two.png',
        headline: 'Default headline 2',
        subtitle: '',
        layout: 'center',
        composition: 'single',
        annotations: [],
      },
    ],
    output: { platforms: ['ios'], directory: './output' },
  } as unknown as AppframeConfig;
}

// Minimal editor-state screen shape — the function reads only headline /
// subtitle / a few typed fields, so we don't need to mirror the full
// ScreenState type.
function editorScreen(headline: string) {
  return {
    headline,
    subtitle: '',
    layout: 'center',
    composition: 'single',
  };
}

describe('buildConfigFromEditorState — locale snapshots', () => {
  it('merges localeScreens into next.locales[code].screens with the localized headline', () => {
    const result = buildConfigFromEditorState(baseConfig(), {
      __editorState: true,
      mode: 'individual',
      screens: [editorScreen('Default headline 1'), editorScreen('Default headline 2')],
      sessionLocales: { 'es-ES': { label: 'Spanish' } },
      localeScreens: {
        'es-ES': [editorScreen('Hola mundo'), editorScreen('Adiós mundo')],
      },
    });

    const spanish = result.locales?.['es-ES'];
    expect(spanish?.label).toBe('Spanish');
    expect(spanish?.screens?.[0]?.headline).toBe('Hola mundo');
    expect(spanish?.screens?.[1]?.headline).toBe('Adiós mundo');
  });

  it('merges localePanoramicElements into next.locales[code].panoramic.elements', () => {
    // One element in default + one in the locale override — the
    // schema requires matching counts.
    const defaultElement = {
      type: 'text',
      content: 'Hello world',
      x: 50, y: 50, fontSize: 4, color: '#FFFFFF',
      fontWeight: 700, fontStyle: 'normal',
      textAlign: 'center', lineHeight: 1.2,
      letterSpacing: 0, textTransform: '',
      rotation: 0, z: 10,
    };
    const result = buildConfigFromEditorState(
      {
        ...baseConfig(),
        mode: 'panoramic',
        panoramic: { background: { type: 'solid' }, elements: [defaultElement] },
      } as unknown as AppframeConfig,
      {
        __editorState: true,
        mode: 'panoramic',
        screens: [],
        panoramicFrameCount: 5,
        panoramicBackground: { type: 'solid' },
        panoramicElements: [defaultElement],
        sessionLocales: { 'ja-JP': { label: 'Japanese' } },
        localePanoramicElements: {
          'ja-JP': [{ content: 'こんにちは' }],
        },
      },
    );

    const japanese = result.locales?.['ja-JP'];
    expect(japanese?.label).toBe('Japanese');
    expect(japanese?.panoramic?.elements?.[0]?.content).toBe('こんにちは');
  });

  it('does not blow up when localeScreens or localePanoramicElements are absent', () => {
    const result = buildConfigFromEditorState(baseConfig(), {
      __editorState: true,
      mode: 'individual',
      screens: [editorScreen('Default headline 1'), editorScreen('Default headline 2')],
      sessionLocales: {},
    });
    expect(result.locales).toBeDefined();
  });
});
