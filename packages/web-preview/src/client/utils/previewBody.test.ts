import { describe, it, expect } from 'vitest';
import type { LocaleConfig, ScreenState } from '../types';
import { buildExportBody, buildPreviewBody } from './previewBody';

function createScreen(overrides: Partial<ScreenState> = {}): ScreenState {
  return {
    screenIndex: 2,
    headline: 'Track smarter',
    subtitle: 'See every expense clearly',
    style: 'minimal',
    layout: 'center',
    font: 'inter',
    fontWeight: 700,
    headlineSize: 88,
    subtitleSize: 36,
    headlineRotation: 5,
    subtitleRotation: -2,
    colors: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      background: '#F8FAFC',
      text: '#0F172A',
      subtitle: '#64748B',
    },
    frameId: 'generic-phone',
    deviceColor: 'Black',
    frameStyle: 'flat',
    composition: 'single',
    deviceScale: 94,
    deviceTop: 16,
    deviceRotation: 12,
    deviceOffsetX: 4,
    deviceAngle: 9,
    deviceTilt: 3,
    headlineGradient: { colors: ['#111111', '#222222'], direction: 45 },
    subtitleGradient: { colors: ['#333333', '#444444'], direction: 90 },
    autoSizeHeadline: true,
    autoSizeSubtitle: true,
    headlineLineHeight: 120,
    headlineLetterSpacing: 8,
    headlineTextTransform: 'uppercase',
    headlineFontStyle: 'italic',
    subtitleOpacity: 85,
    subtitleLetterSpacing: 4,
    subtitleTextTransform: 'capitalize',
    spotlight: { x: 20, y: 30, w: 40, h: 25, shape: 'rectangle', dimOpacity: 0.55, blur: 14 },
    annotations: [
      { id: 'ann-1', shape: 'rectangle', x: 10, y: 20, w: 30, h: 15, strokeColor: '#ff0000', strokeWidth: 4 },
    ],
    textPositions: {
      headline: { x: 11, y: 12, width: 44 },
      subtitle: { x: 14, y: 22, width: 40 },
    },
    screenshotDataUrl: 'data:image/png;base64,AAA',
    screenshotName: 'screen.png',
    screenshotDims: { width: 1290, height: 2796 },
    backgroundType: 'image',
    backgroundColor: '#ffffff',
    backgroundGradient: {
      type: 'linear',
      colors: ['#6366f1', '#ec4899'],
      direction: 135,
      radialPosition: 'center',
    },
    backgroundImageDataUrl: 'data:image/png;base64,BG',
    backgroundOverlay: { color: '#000000', opacity: 0.35 },
    deviceShadow: { opacity: 0.3, blur: 24, color: '#000000', offsetY: 12 },
    borderSimulation: { enabled: true, thickness: 2, color: '#ffffff', radius: 24 },
    cornerRadius: 28,
    loupe: {
      enabled: true,
      width: 0.5,
      height: 0.33,
      sourceX: 0.2,
      sourceY: 0.3,
      scale: 1.2,
      cornerRadius: 12,
      borderWidth: 2,
      borderColor: '#ffffff',
      shadow: true,
      shadowColor: '#000000',
      shadowRadius: 30,
      shadowOffsetX: 0,
      shadowOffsetY: 6,
      xOffset: 10,
      yOffset: 20,
    },
    callouts: [
      {
        id: 'callout-1',
        sourceX: 0.1,
        sourceY: 0.2,
        sourceW: 0.3,
        sourceH: 0.4,
        displayX: 50,
        displayY: 60,
        displayScale: 1.4,
        rotation: 7,
        borderRadius: 12,
        shadow: true,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
    overlays: [
      {
        id: 'overlay-1',
        type: 'shape',
        x: 20,
        y: 24,
        size: 36,
        rotation: 12,
        opacity: 0.85,
        shapeType: 'circle',
        shapeColor: '#00ff88',
        shapeOpacity: 0.4,
        shapeBlur: 8,
      },
    ],
    extraScreenshots: [],
    ...overrides,
  };
}

describe('preview/export payload builders', () => {
  it('keeps export payload aligned with preview payload and adds export-only fields', () => {
    const screen = createScreen();
    const localeConfig: LocaleConfig = {
      screens: [
        {},
        {},
        { headline: 'Sigue mejor', subtitle: 'Ve cada gasto con claridad' },
      ],
    };

    const previewBody = buildPreviewBody(screen, 'iphone', 400, 868, 'es', localeConfig, []);
    const exportBody = buildExportBody(screen, {
      previewW: 400,
      previewH: 868,
      locale: 'es',
      localeConfig,
      sizeKey: 'ios-6.9',
      renderer: 'playwright',
    });

    expect(exportBody).toMatchObject(previewBody);
    expect(exportBody).toMatchObject({
      sizeKey: 'ios-6.9',
      renderer: 'playwright',
      preferLocaleText: true,
      headlineTop: 12,
      subtitleLeft: 14,
      backgroundType: 'image',
      backgroundImageDataUrl: 'data:image/png;base64,BG',
      deviceShadow: screen.deviceShadow,
      borderSimulation: screen.borderSimulation,
      cornerRadius: 28,
      loupe: screen.loupe,
      callouts: screen.callouts,
      overlays: screen.overlays,
      locale: 'es',
      localeConfig,
    });
  });

  it('omits default locale and preset-only background override in both payloads', () => {
    const screen = createScreen({
      backgroundType: 'preset',
      backgroundImageDataUrl: null,
      backgroundOverlay: null,
    });

    const previewBody = buildPreviewBody(screen, 'iphone', 400, 868, 'default', undefined, []);
    const exportBody = buildExportBody(screen, {
      previewW: 400,
      previewH: 868,
      locale: 'default',
      localeConfig: undefined,
      sizeKey: 'ios-6.9',
      renderer: 'koubou',
    });

    expect(previewBody.locale).toBeUndefined();
    expect(exportBody.locale).toBeUndefined();
    expect(previewBody.localeConfig).toBeUndefined();
    expect(exportBody.localeConfig).toBeUndefined();
    expect(previewBody.preferLocaleText).toBeUndefined();
    expect(exportBody.preferLocaleText).toBeUndefined();
    expect(previewBody.backgroundType).toBeUndefined();
    expect(exportBody.backgroundType).toBeUndefined();
    expect(exportBody.renderer).toBe('koubou');
  });
});
