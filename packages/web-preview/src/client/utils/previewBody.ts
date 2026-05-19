import type { LocaleConfig, PanoramicBackground, PanoramicElement, ScreenState } from '../types';

function previewIfMode(url: string | null | undefined, previewMode: boolean): string | undefined {
  if (!previewMode) return url || undefined;
  return toPreviewScreenshotUrl(url);
}

/**
 * Rewrite a screenshot URL to its preview-resolution sibling. Matches
 * `/api/screenshots/<project>/<name>` and inserts `.previews/` before
 * the filename. Data URLs and unrecognised strings pass through
 * unchanged. Used by the in-app iframes (not export) so Safari decodes
 * smaller bitmaps and doesn't trip critical-memory-pressure purges.
 */
export function toPreviewScreenshotUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const m = url.match(/^\/api\/screenshots\/([a-zA-Z0-9_-]+)\/([^/?#]+)$/);
  if (!m) return url;
  return `/api/screenshots/${m[1]}/.previews/${m[2]}`;
}

export function buildScreenRenderBody(
  screen: ScreenState,
  previewW: number,
  previewH: number,
  locale: string,
  localeConfig?: LocaleConfig,
  previewMode = false,
): Record<string, unknown> {
  const preferLocaleText = locale !== 'default';
  const screenshotUrl = previewIfMode(screen.screenshotDataUrl, previewMode);

  return {
    screenIndex: screen.screenIndex,
    screenshotDataUrl: screenshotUrl,
    locale: preferLocaleText ? locale : undefined,
    preferLocaleText: preferLocaleText || undefined,
    localeConfig: preferLocaleText ? localeConfig : undefined,
    isFullscreen: screen.isFullscreen,
    layout: screen.layout,
    headline: screen.headline,
    subtitle: screen.subtitle,
    colors: screen.colors,
    font: screen.font,
    fontWeight: screen.fontWeight,
    headlineFont: screen.headlineFont,
    headlineFontWeight: screen.headlineFontWeight,
    subtitleFont: screen.subtitleFont,
    subtitleFontWeight: screen.subtitleFontWeight,
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
    // Free text — third text slot. Emit positional fields when set so the
    // server's injectTextPositionCSS branch can place it via fixed
    // positioning after drag, same as headline/subtitle.
    freeText: screen.freeTextEnabled ? screen.freeText : undefined,
    freeTextEnabled: screen.freeTextEnabled || undefined,
    freeTextSize: screen.freeTextSize || undefined,
    freeTextFont: screen.freeTextFont,
    freeTextFontWeight: screen.freeTextFontWeight,
    freeTextRotation: screen.freeTextRotation || undefined,
    freeTextLetterSpacing: screen.freeTextLetterSpacing
      ? `${screen.freeTextLetterSpacing / 100}em`
      : undefined,
    freeTextTextTransform: screen.freeTextTextTransform || undefined,
    freeTextColor: screen.colors.freeText || undefined,
    freeTextTop: screen.textPositions.freeText?.y,
    freeTextLeft: screen.textPositions.freeText?.x,
    freeTextWidth: screen.textPositions.freeText?.width,
    composition: screen.composition || 'single',
    headlineGradient: screen.headlineGradient,
    subtitleGradient: screen.subtitleGradient,
    spotlight: screen.spotlight || undefined,
    annotations: screen.annotations.length > 0 ? screen.annotations : undefined,
    backgroundType: screen.backgroundType !== 'preset' ? screen.backgroundType : undefined,
    backgroundColor: screen.backgroundType === 'solid' ? screen.backgroundColor : undefined,
    backgroundGradient: screen.backgroundType === 'gradient' ? screen.backgroundGradient : undefined,
    backgroundImageDataUrl:
      screen.backgroundType === 'image'
        ? previewIfMode(screen.backgroundImageDataUrl, previewMode)
        : undefined,
    backgroundImageFit: screen.backgroundType === 'image' ? screen.backgroundImageFit : undefined,
    backgroundImagePositionX: screen.backgroundType === 'image' ? screen.backgroundImagePositionX : undefined,
    backgroundImagePositionY: screen.backgroundType === 'image' ? screen.backgroundImagePositionY : undefined,
    backgroundImageScale: screen.backgroundType === 'image' ? screen.backgroundImageScale : undefined,
    backgroundOverlay:
      screen.backgroundType === 'image' && screen.backgroundOverlay
        ? screen.backgroundOverlay
        : undefined,
    deviceShadow: screen.deviceShadow || undefined,
    borderSimulation: screen.borderSimulation || undefined,
    cornerRadius: screen.cornerRadius || undefined,
    loupe: screen.loupe || undefined,
    callouts: screen.callouts.length > 0 ? screen.callouts : undefined,
    overlays: screen.overlays.length > 0 ? screen.overlays : undefined,
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
    width: previewW,
    height: previewH,
    extraScreenshots:
      screen.extraDevices.length > 0
        ? screen.extraDevices.map((d) => ({
            screenshotDataUrl: previewIfMode(d.dataUrl, previewMode),
            frameId: d.frameId ?? undefined,
            offsetX: d.offsetX ?? undefined,
            offsetY: d.offsetY ?? undefined,
            scale: d.scale ?? undefined,
            rotation: d.rotation ?? undefined,
            angle: d.angle ?? undefined,
            tilt: d.tilt ?? undefined,
          }))
        : undefined,
  };
}

export function buildPreviewBody(
  screen: ScreenState,
  _platform: string,
  previewW: number,
  previewH: number,
  locale: string,
  localeConfig: LocaleConfig | undefined,
  _deviceFamilies: unknown[],
  previewMode = false,
): Record<string, unknown> {
  return buildScreenRenderBody(screen, previewW, previewH, locale, localeConfig, previewMode);
}

/**
 * Walk a panoramic element tree and return a copy with every screenshot
 * URL rewritten to its preview-resolution sibling. Used by the live
 * panoramic iframe (export still goes through the full-res path).
 * Untouched element types and non-matching URLs pass through without
 * cloning so the result shares structure with the input where possible.
 */
export function rewritePanoramicElementsForPreview(
  elements: PanoramicElement[],
): PanoramicElement[] {
  return elements.map((el) => {
    if (el.type === 'device' || el.type === 'crop') {
      const rewritten = toPreviewScreenshotUrl(el.screenshot);
      if (rewritten && rewritten !== el.screenshot) {
        return { ...el, screenshot: rewritten };
      }
      return el;
    }
    if (el.type === 'image' || el.type === 'logo') {
      const rewritten = toPreviewScreenshotUrl(el.src);
      if (rewritten && rewritten !== el.src) {
        return { ...el, src: rewritten };
      }
      return el;
    }
    if (el.type === 'group') {
      const rewrittenChildren = rewritePanoramicElementsForPreview(el.children);
      // Reference equality across children means nothing changed; skip
      // the clone so React's element-prop comparisons stay cheap.
      if (rewrittenChildren.every((c, i) => c === el.children[i])) return el;
      return { ...el, children: rewrittenChildren };
    }
    return el;
  });
}

/**
 * Background can stack image layers — each gets its URL rewritten the
 * same way. Other layer kinds (solid / gradient / glow) pass through
 * unchanged.
 */
export function rewritePanoramicBackgroundForPreview(
  bg: PanoramicBackground,
): PanoramicBackground {
  if (!bg.layers || bg.layers.length === 0) return bg;
  let changed = false;
  const layers = bg.layers.map((layer) => {
    if (layer.kind !== 'image') return layer;
    const rewritten = toPreviewScreenshotUrl(layer.src);
    if (rewritten && rewritten !== layer.src) {
      changed = true;
      return { ...layer, src: rewritten };
    }
    return layer;
  });
  return changed ? { ...bg, layers } : bg;
}

export function buildExportBody(
  screen: ScreenState,
  options: {
    previewW: number;
    previewH: number;
    locale: string;
    localeConfig?: LocaleConfig;
    sizeKey: string;
  },
): Record<string, unknown> {
  return {
    ...buildScreenRenderBody(
      screen,
      options.previewW,
      options.previewH,
      options.locale,
      options.localeConfig,
    ),
    sizeKey: options.sizeKey,
  };
}
