// Factory for fresh ScreenState. Extracted from store.ts because it's a
// big pure function with no need to live alongside the Zustand actions.
// Tested directly in storeFactory.test.ts.

import type { AppframeConfig, FrameStyle } from './types';
import type { ScreenState } from './types';
import { PLATFORM_DEVICE_DEFAULTS } from './types';

export function createScreenState(
  index: number,
  config: AppframeConfig,
  platform: string,
): ScreenState {
  const screen = config.screens[index];
  const pd = PLATFORM_DEVICE_DEFAULTS[platform] ?? PLATFORM_DEVICE_DEFAULTS.iphone!;

  return {
    id: crypto.randomUUID(),
    screenIndex: index,
    headline: screen ? screen.headline : 'New Frame',
    subtitle: screen ? (screen.subtitle ?? '') : '',
    isFullscreen: screen?.isFullscreen ?? false,
    layout: 'center',
    font: config.theme.font,
    fontWeight: config.theme.fontWeight,
    headlineFont:
      screen?.headlineFont ?? config.theme.headlineFont ?? config.theme.font ?? 'inter',
    headlineFontWeight:
      screen?.headlineFontWeight ??
      config.theme.headlineFontWeight ??
      config.theme.fontWeight ??
      600,
    subtitleFont:
      screen?.subtitleFont ?? config.theme.subtitleFont ?? config.theme.font ?? 'inter',
    subtitleFontWeight:
      screen?.subtitleFontWeight ?? config.theme.subtitleFontWeight ?? 400,
    headlineSize: config.theme.headlineSize ?? 110,
    subtitleSize: config.theme.subtitleSize ?? 55,
    headlineRotation: 0,
    subtitleRotation: 0,
    freeText: '',
    freeTextEnabled: false,
    freeTextSize: 55,
    freeTextFont: config.theme.freeTextFont ?? config.theme.font ?? 'inter',
    freeTextFontWeight: config.theme.freeTextFontWeight ?? 400,
    freeTextRotation: 0,
    freeTextLetterSpacing: 0,
    freeTextTextTransform: '',
    colors: {
      primary: config.theme.colors.primary,
      secondary: config.theme.colors.secondary,
      background: config.theme.colors.background,
      text: config.theme.colors.text,
      subtitle: config.theme.colors.subtitle ?? '#64748B',
      freeText: config.theme.colors.freeText ?? config.theme.colors.subtitle ?? '#64748B',
    },
    frameId: config.frames.ios ?? config.frames.android ?? '',
    deviceColor: config.frames.deviceColor ?? '',
    frameStyle: config.frames.style as FrameStyle,
    composition: 'single',
    deviceScale: pd.deviceScale,
    deviceTop: pd.deviceTop,
    deviceRotation: 0,
    deviceOffsetX: 0,
    deviceAngle: pd.deviceAngle,
    deviceTilt: 0,
    headlineGradient: config.theme.headlineGradient ?? null,
    subtitleGradient: config.theme.subtitleGradient ?? null,
    headlineLineHeight: 0,
    headlineLetterSpacing: 0,
    headlineTextTransform: '',
    headlineFontStyle: '',
    subtitleOpacity: 0,
    subtitleLetterSpacing: 0,
    subtitleTextTransform: '',
    spotlight: null,
    annotations: [],
    textPositions: { headline: null, subtitle: null, freeText: null },
    screenshotUrl: null,
    screenshotName: screen?.screenshot?.split('/').pop() ?? null,
    screenshotDims: null,
    backgroundType: 'solid',
    backgroundColor: '#ffffff',
    backgroundGradient: {
      type: 'linear',
      colors: ['#6366f1', '#ec4899'],
      direction: 135,
      radialPosition: 'center',
    },
    backgroundImageDataUrl: null,
    backgroundImageFit: 'cover',
    backgroundImagePositionX: 50,
    backgroundImagePositionY: 50,
    backgroundImageScale: 100,
    backgroundOverlay: null,
    deviceShadow: null,
    borderSimulation: null,
    cornerRadius: 0,
    loupe: null,
    callouts: [],
    overlays: [],
    extraDevices: [],
  };
}
