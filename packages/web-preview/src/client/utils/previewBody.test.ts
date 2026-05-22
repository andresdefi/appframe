import { describe, it, expect } from 'vitest';
import type { LocaleConfig, PanoramicBackground, PanoramicElement, ScreenState } from '../types';
import {
  buildExportBody,
  buildPreviewBody,
  rewritePanoramicBackgroundForPreview,
  rewritePanoramicElementsForPreview,
  toPreviewScreenshotUrl,
} from './previewBody';

function createScreen(overrides: Partial<ScreenState> = {}): ScreenState {
  return {
    id: 'screen-2',
    screenIndex: 2,
    headline: 'Track smarter',
    subtitle: 'See every expense clearly',
    isFullscreen: false,
    layout: 'center',
    font: 'inter',
    fontWeight: 700,
    headlineFont: 'inter',
    headlineFontWeight: 700,
    subtitleFont: 'inter',
    subtitleFontWeight: 400,
    headlineSize: 88,
    subtitleSize: 36,
    headlineRotation: 5,
    subtitleRotation: -2,
    freeText: '',
    freeTextEnabled: false,
    freeTextSize: 0,
    freeTextFont: 'inter',
    freeTextFontWeight: 400,
    freeTextRotation: 0,
    freeTextLetterSpacing: 0,
    freeTextTextTransform: '',
    colors: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      background: '#F8FAFC',
      text: '#0F172A',
      subtitle: '#64748B',
      freeText: '#64748B',
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
    headlineLineHeight: 120,
    headlineLetterSpacing: 8,
    headlineTextTransform: 'uppercase',
    headlineFontStyle: 'italic',
    subtitleOpacity: 85,
    subtitleLetterSpacing: 4,
    subtitleTextTransform: 'capitalize',
    spotlightEnabled: true,
    spotlight: { x: 20, y: 30, w: 40, h: 25, shape: 'rectangle', dimOpacity: 0.55, blur: 14, borderRadius: 0 },
    annotations: [
      { id: 'ann-1', shape: 'rectangle', x: 10, y: 20, w: 30, h: 15, strokeColor: '#ff0000', strokeWidth: 4, borderRadius: 0 },
    ],
    textPositions: {
      headline: { x: 11, y: 12, width: 44 },
      subtitle: { x: 14, y: 22, width: 40 },
      freeText: null,
    },
    screenshotUrl: 'data:image/png;base64,AAA',
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
    backgroundImageFit: 'cover',
    backgroundImagePositionX: 50,
    backgroundImagePositionY: 50,
    backgroundImageScale: 100,
    backgroundOverlay: { color: '#000000', opacity: 0.35 },
    deviceShadow: { opacity: 0.3, blur: 24, color: '#000000', offsetY: 12 },
    borderSimulation: { enabled: true, thickness: 2, color: '#ffffff', radius: 24 },
    cornerRadius: 28,
    loupeEnabled: true,
    loupe: {
      width: 0.5,
      height: 0.33,
      sourceX: 0.2,
      sourceY: 0.3,
      zoom: 2.5,
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
    extraDevices: [],
    headlineShadow: { enabled: false, offsetX: 0, offsetY: 4, blur: 8, color: '#000000', opacity: 50 },
    subtitleShadow: { enabled: false, offsetX: 0, offsetY: 4, blur: 8, color: '#000000', opacity: 50 },
    freeTextShadow: { enabled: false, offsetX: 0, offsetY: 4, blur: 8, color: '#000000', opacity: 50 },
    headlineLayer: 'default',
    subtitleLayer: 'default',
    freeTextLayer: 'default',
    ...overrides,
  };
}

describe('preview/export payload builders', () => {
  it('keeps export payload aligned with preview payload and adds export-only fields', () => {
    const screen = createScreen();
    const localeConfig: LocaleConfig = {
      screens: [
        { headline: 'Placeholder 1' },
        { headline: 'Placeholder 2' },
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
    });

    expect(exportBody).toMatchObject(previewBody);
    expect(exportBody).toMatchObject({
      sizeKey: 'ios-6.9',
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

  it('rewrites screenshot URLs to .previews/ when previewMode is true', () => {
    const screen = createScreen({
      screenshotUrl: '/api/screenshots/my-project/screen1.png',
      backgroundType: 'image',
      backgroundImageDataUrl: '/api/screenshots/my-project/bg.jpg',
      extraDevices: [
        {
          dataUrl: '/api/screenshots/my-project/extra.png',
          name: 'extra.png',
          frameId: 'iphone-15',
          offsetX: 100,
          offsetY: 50,
          scale: 0.8,
          rotation: 0,
          angle: 0,
          tilt: 0,
        },
      ],
    });

    const preview = buildPreviewBody(screen, 'iphone', 400, 868, 'default', undefined, [], true);
    const exportBody = buildExportBody(screen, {
      previewW: 400,
      previewH: 868,
      locale: 'default',
      sizeKey: 'ios-6.9',
    });

    expect(preview.screenshotUrl).toBe('/api/screenshots/my-project/.previews/screen1.png');
    expect(preview.backgroundImageDataUrl).toBe('/api/screenshots/my-project/.previews/bg.jpg');
    expect((preview.extraScreenshots as Array<Record<string, unknown>>)[0]?.screenshotUrl).toBe(
      '/api/screenshots/my-project/.previews/extra.png',
    );

    // Export pipeline (previewMode defaults to false) keeps full-res URLs.
    expect(exportBody.screenshotUrl).toBe('/api/screenshots/my-project/screen1.png');
    expect(exportBody.backgroundImageDataUrl).toBe('/api/screenshots/my-project/bg.jpg');
  });

  it('leaves data URLs and unmatched strings alone in previewMode', () => {
    expect(toPreviewScreenshotUrl('data:image/png;base64,AAA')).toBe('data:image/png;base64,AAA');
    expect(toPreviewScreenshotUrl('https://example.com/x.png')).toBe('https://example.com/x.png');
    expect(toPreviewScreenshotUrl('')).toBeUndefined();
    expect(toPreviewScreenshotUrl(null)).toBeUndefined();
    expect(toPreviewScreenshotUrl(undefined)).toBeUndefined();
  });

  it('rewrites panoramic device + crop + image + logo screenshots, recursing into groups', () => {
    const elements: PanoramicElement[] = [
      {
        type: 'device',
        x: 10, y: 10, width: 20, rotation: 0, z: 1,
        screenshot: '/api/screenshots/my-project/d1.png',
        frame: 'iphone-15',
        frameStyle: 'flat',
        deviceScale: 92, deviceTop: 15, deviceOffsetX: 0, deviceAngle: 8, deviceTilt: 0,
        cornerRadius: 0, fullscreenScreenshot: false,
      },
      {
        type: 'crop',
        x: 30, y: 10, width: 20, height: 20, rotation: 0, z: 2,
        screenshot: '/api/screenshots/my-project/c1.png',
        focusX: 50, focusY: 50, zoom: 1, borderRadius: 0,
      },
      {
        type: 'image',
        x: 0, y: 0, width: 10, height: 10, rotation: 0, opacity: 1, z: 3,
        src: '/api/screenshots/my-project/img1.png',
        fit: 'cover', borderRadius: 0,
      },
      {
        type: 'logo',
        x: 0, y: 0, width: 10, height: 10, rotation: 0, opacity: 1, z: 4,
        src: '/api/screenshots/my-project/logo.png',
        fit: 'contain', borderRadius: 0, padding: 0,
      },
      {
        type: 'group',
        x: 0, y: 50, width: 30, height: 30, rotation: 0, opacity: 1, z: 5,
        children: [
          {
            type: 'device',
            x: 0, y: 0, width: 100, rotation: 0, z: 1,
            screenshot: '/api/screenshots/my-project/d2.png',
            frame: 'iphone-15',
            frameStyle: 'flat',
            deviceScale: 92, deviceTop: 15, deviceOffsetX: 0, deviceAngle: 8, deviceTilt: 0,
            cornerRadius: 0, fullscreenScreenshot: false,
          },
        ],
      },
    ];

    const out = rewritePanoramicElementsForPreview(elements);
    expect((out[0] as { screenshot: string }).screenshot).toBe(
      '/api/screenshots/my-project/.previews/d1.png',
    );
    expect((out[1] as { screenshot: string }).screenshot).toBe(
      '/api/screenshots/my-project/.previews/c1.png',
    );
    expect((out[2] as { src: string }).src).toBe('/api/screenshots/my-project/.previews/img1.png');
    expect((out[3] as { src: string }).src).toBe('/api/screenshots/my-project/.previews/logo.png');
    const groupChildren = (out[4] as { children: PanoramicElement[] }).children;
    expect((groupChildren[0] as { screenshot: string }).screenshot).toBe(
      '/api/screenshots/my-project/.previews/d2.png',
    );
  });

  it('panoramic rewriter preserves reference equality when nothing changes', () => {
    const elements: PanoramicElement[] = [
      {
        type: 'text',
        x: 0, y: 0, rotation: 0, z: 0,
        content: 'hello', color: '#fff', fontSize: 5, fontWeight: 400,
        textAlign: 'center', lineHeight: 1.2, fontStyle: 'normal',
        letterSpacing: 0, textTransform: '',
      },
      {
        type: 'device',
        x: 10, y: 10, width: 20, rotation: 0, z: 1,
        screenshot: 'data:image/png;base64,XYZ',
        frame: 'iphone-15',
        frameStyle: 'flat',
        deviceScale: 92, deviceTop: 15, deviceOffsetX: 0, deviceAngle: 8, deviceTilt: 0,
        cornerRadius: 0, fullscreenScreenshot: false,
      },
    ];
    const out = rewritePanoramicElementsForPreview(elements);
    expect(out[0]).toBe(elements[0]);
    expect(out[1]).toBe(elements[1]);
  });

  it('rewrites image-layer URLs in panoramic background, leaves other layer kinds alone', () => {
    const bg: PanoramicBackground = {
      layers: [
        { kind: 'solid', color: '#000000', opacity: 1 },
        { kind: 'image', image: '/api/screenshots/my-project/bg.jpg', fit: 'cover', opacity: 1 },
        { kind: 'glow', color: '#ff00ff', x: 50, y: 50, radius: 30, intensity: 0.7 },
      ],
    } as PanoramicBackground;

    const out = rewritePanoramicBackgroundForPreview(bg);
    expect(out.layers?.[0]).toBe(bg.layers?.[0]);
    expect((out.layers?.[1] as { image: string }).image).toBe(
      '/api/screenshots/my-project/.previews/bg.jpg',
    );
    expect(out.layers?.[2]).toBe(bg.layers?.[2]);
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
    });

    expect(previewBody.locale).toBeUndefined();
    expect(exportBody.locale).toBeUndefined();
    expect(previewBody.localeConfig).toBeUndefined();
    expect(exportBody.localeConfig).toBeUndefined();
    expect(previewBody.preferLocaleText).toBeUndefined();
    expect(exportBody.preferLocaleText).toBeUndefined();
    expect(previewBody.backgroundType).toBeUndefined();
    expect(exportBody.backgroundType).toBeUndefined();
  });
});
