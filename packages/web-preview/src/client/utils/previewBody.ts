import type { ScreenState } from '../types';

export function buildPreviewBody(
  screen: ScreenState,
  _platform: string,
  previewW: number,
  previewH: number,
  locale: string,
  _deviceFamilies: unknown[],
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    screenIndex: screen.screenIndex,
    screenshotDataUrl: screen.screenshotDataUrl || undefined,
    locale: locale !== 'default' ? locale : undefined,
    style: screen.style,
    layout: screen.layout,
    headline: screen.headline,
    subtitle: screen.subtitle || undefined,
    colors: screen.colors,
    font: screen.font,
    fontWeight: screen.fontWeight,
    headlineSize: screen.headlineSize || undefined,
    subtitleSize: screen.subtitleSize || undefined,
    headlineRotation: screen.headlineRotation || undefined,
    subtitleRotation: screen.subtitleRotation || undefined,
    frameId: screen.frameId,
    deviceColor: screen.deviceColor || undefined,
    frameStyle: screen.frameStyle,
    deviceScale: screen.deviceScale,
    deviceTop: screen.deviceTop,
    deviceRotation: screen.deviceRotation,
    deviceOffsetX: screen.deviceOffsetX,
    deviceAngle: screen.deviceAngle,
    deviceTilt: screen.deviceTilt,
    headlineTop: screen.textPositions.headline?.y,
    headlineLeft: screen.textPositions.headline?.x,
    headlineWidth: screen.textPositions.headline?.width,
    subtitleTop: screen.textPositions.subtitle?.y,
    subtitleLeft: screen.textPositions.subtitle?.x,
    subtitleWidth: screen.textPositions.subtitle?.width,
    composition: screen.composition || 'single',
    headlineGradient: screen.headlineGradient || undefined,
    subtitleGradient: screen.subtitleGradient || undefined,
    autoSizeHeadline: screen.autoSizeHeadline || undefined,
    autoSizeSubtitle: screen.autoSizeSubtitle || undefined,
    spotlight: screen.spotlight || undefined,
    annotations: screen.annotations.length > 0 ? screen.annotations : undefined,
    // Background overrides
    backgroundType: screen.backgroundType !== 'preset' ? screen.backgroundType : undefined,
    backgroundColor: screen.backgroundType === 'solid' ? screen.backgroundColor : undefined,
    backgroundGradient: screen.backgroundType === 'gradient' ? screen.backgroundGradient : undefined,
    backgroundImageDataUrl: screen.backgroundType === 'image' ? screen.backgroundImageDataUrl : undefined,
    backgroundOverlay:
      screen.backgroundType === 'image' && screen.backgroundOverlay
        ? screen.backgroundOverlay
        : undefined,
    // Device enhancements
    deviceShadow: screen.deviceShadow || undefined,
    borderSimulation: screen.borderSimulation || undefined,
    cornerRadius: screen.cornerRadius || undefined,
    // Effects
    loupe: screen.loupe || undefined,
    callouts: screen.callouts.length > 0 ? screen.callouts : undefined,
    overlays: screen.overlays.length > 0 ? screen.overlays : undefined,
    // Typography overrides
    headlineLineHeight: screen.headlineLineHeight ? screen.headlineLineHeight / 100 : undefined,
    headlineLetterSpacing: screen.headlineLetterSpacing
      ? `${screen.headlineLetterSpacing / 100}em`
      : undefined,
    headlineTextTransform: screen.headlineTextTransform || undefined,
    headlineFontStyle: screen.headlineFontStyle || undefined,
    subtitleOpacity: screen.subtitleOpacity ? screen.subtitleOpacity / 100 : undefined,
    subtitleLetterSpacing: screen.subtitleLetterSpacing
      ? `${screen.subtitleLetterSpacing / 100}em`
      : undefined,
    subtitleTextTransform: screen.subtitleTextTransform || undefined,
    // Dimensions
    width: previewW,
    height: previewH,
  };

  return body;
}
