import { readFile } from 'node:fs/promises';
import type { Express } from 'express';
import {
  getFrame,
  getDefaultFrame,
  getDeviceFamily,
  getDeviceId,
  getDeviceFramePath,
  COMPOSITION_PRESETS,
  injectEffectsHTML,
  loadFontFacesUrl,
} from '@appframe/core';
import type {
  CompositionPreset,
  FrameDefinition,
  FrameStyle,
  LayoutVariant,
  LocaleConfig,
  Loupe,
} from '@appframe/core';
import type { TemplateContext, DeviceContext, FontFaceMode } from '@appframe/core';
import { buildKoubouPreviewFrame } from '../koubouPreviewFrame.js';
import { isPathInside } from '../utils/pathSafety.js';
import {
  getLocalizedScreenshotPath,
  placeholderSvgDataUrl,
  resolveLocalizedScreenText,
  screenshotToDataUrl,
} from '../previewShared.js';
import {
  expectArray,
  expectBoolean,
  expectNumber,
  expectObject,
  expectString,
} from './utils.js';
import { registerPanoramicPreviewRoute } from './preview-panoramic.js';
import type { RouteContext } from './context.js';

interface PreviewParams {
  screenIndex: number;
  locale: string;
  localeConfig?: LocaleConfig;
  preferLocaleText?: boolean;
  /** When true, the template's framePngUrl is the resize-on-the-fly preview
   * variant (`?preview=1`) so iframes don't decode 17 MB frame bitmaps each.
   * Set by ScreenCard / PanoramicPreview; export pipelines leave it false. */
  previewMode?: boolean;
  isFullscreen?: boolean;
  layout?: LayoutVariant;
  headline?: string;
  subtitle?: string;
  colors?: Record<string, string>;
  font?: string;
  fontWeight?: number;
  headlineSize?: number;
  subtitleSize?: number;
  headlineRotation?: number;
  subtitleRotation?: number;
  frameId?: string;
  fStyle?: FrameStyle;
  width: number;
  height: number;
  deviceTop?: number;
  deviceScale?: number;
  deviceRotation?: number;
  deviceOffsetX?: number;
  deviceAngle?: number;
  deviceTilt?: number;
  headlineTop?: number;
  headlineLeft?: number;
  headlineWidth?: number;
  subtitleTop?: number;
  subtitleLeft?: number;
  subtitleWidth?: number;
  clientScreenshot?: string;
  platform?: string;
  sizeKey?: string;
  composition?: CompositionPreset;
  extraScreenshots?: Array<{
    screenshotUrl?: string;
    frameId?: string;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    rotation?: number;
    angle?: number;
    tilt?: number;
  }>;
  headlineGradient?: { colors: string[]; direction: number };
  subtitleGradient?: { colors: string[]; direction: number };
  spotlight?: {
    x: number;
    y: number;
    w: number;
    h: number;
    shape: 'circle' | 'rectangle';
    dimOpacity: number;
    blur: number;
    borderRadius?: number;
  };
  annotations?: Array<{
    id: string;
    shape: string;
    x: number;
    y: number;
    w: number;
    h: number;
    strokeColor: string;
    strokeWidth: number;
    fillColor?: string;
    borderRadius?: number;
  }>;
  headlineLineHeight?: number;
  headlineLetterSpacing?: string;
  headlineTextTransform?: string;
  headlineFontStyle?: string;
  subtitleOpacity?: number;
  subtitleLetterSpacing?: string;
  subtitleTextTransform?: string;
  // Pre-computed `text-shadow:` CSS values for each text element.
  // Client (buildScreenRenderBody) does the hex→rgba math so the
  // template just emits a ready string.
  headlineShadowCss?: string;
  subtitleShadowCss?: string;
  freeTextShadowCss?: string;
  deviceColor?: string;
  backgroundType?: 'preset' | 'solid' | 'gradient' | 'image';
  backgroundColor?: string;
  backgroundGradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    direction: number;
    radialPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  };
  backgroundImageDataUrl?: string;
  backgroundImageFit?: 'cover' | 'contain' | 'fill';
  backgroundImagePositionX?: number;
  backgroundImagePositionY?: number;
  backgroundImageScale?: number;
  backgroundOverlay?: { color: string; opacity: number };
  deviceShadow?: { opacity: number; blur: number; color: string; offsetY: number };
  borderSimulation?: { enabled: boolean; thickness: number; color: string; radius: number };
  cornerRadius?: number;
  headlineFont?: string;
  headlineFontWeight?: number;
  subtitleFont?: string;
  subtitleFontWeight?: number;
  freeText?: string;
  freeTextEnabled?: boolean;
  freeTextSize?: number;
  freeTextFont?: string;
  freeTextFontWeight?: number;
  freeTextRotation?: number;
  freeTextLetterSpacing?: string;
  freeTextTextTransform?: string;
  freeTextColor?: string;
  freeTextTop?: number;
  freeTextLeft?: number;
  freeTextWidth?: number;
  headlineLayer?: 'behind-device' | 'default' | 'above-overlays';
  subtitleLayer?: 'behind-device' | 'default' | 'above-overlays';
  freeTextLayer?: 'behind-device' | 'default' | 'above-overlays';
  loupe?: Loupe;
  callouts?: Array<{
    id: string;
    sourceX: number;
    sourceY: number;
    sourceW: number;
    sourceH: number;
    displayX: number;
    displayY: number;
    displayScale: number;
    rotation: number;
    borderRadius: number;
    shadow: boolean;
    borderWidth: number;
    borderColor?: string;
  }>;
  overlays?: Array<{
    id: string;
    type: 'icon' | 'badge' | 'star-rating' | 'custom' | 'shape';
    imageDataUrl?: string;
    x: number;
    y: number;
    size: number;
    rotation: number;
    opacity: number;
    shapeType?: 'circle' | 'rectangle' | 'line';
    shapeColor?: string;
    shapeOpacity?: number;
    shapeBlur?: number;
  }>;
}

function parseBody(
  body: Record<string, unknown>,
  defaultWidth = 400,
  defaultHeight = 868,
): PreviewParams {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('Request body must be a JSON object');
  }

  const width = expectNumber(body.width) ?? defaultWidth;
  const height = expectNumber(body.height) ?? defaultHeight;
  const screenIndex = expectNumber(body.screenIndex) ?? 0;

  if (!Number.isInteger(screenIndex) || screenIndex < 0) {
    throw new Error('screenIndex must be a non-negative integer');
  }
  if (width <= 0 || height <= 0) {
    throw new Error('width and height must be positive numbers');
  }

  return {
    screenIndex,
    locale: expectString(body.locale) ?? 'default',
    localeConfig: expectObject(body.localeConfig) as LocaleConfig | undefined,
    preferLocaleText: expectBoolean(body.preferLocaleText),
    previewMode: expectBoolean(body.previewMode),
    isFullscreen: expectBoolean(body.isFullscreen),
    layout: expectString(body.layout) as LayoutVariant | undefined,
    headline: expectString(body.headline),
    subtitle: expectString(body.subtitle),
    colors: expectObject(body.colors) as Record<string, string> | undefined,
    font: expectString(body.font),
    fontWeight: expectNumber(body.fontWeight),
    headlineSize: expectNumber(body.headlineSize),
    subtitleSize: expectNumber(body.subtitleSize),
    headlineRotation: expectNumber(body.headlineRotation),
    subtitleRotation: expectNumber(body.subtitleRotation),
    frameId: expectString(body.frameId),
    fStyle: expectString(body.frameStyle) as FrameStyle | undefined,
    width,
    height,
    deviceTop: expectNumber(body.deviceTop),
    deviceScale: expectNumber(body.deviceScale),
    deviceRotation: expectNumber(body.deviceRotation),
    deviceOffsetX: expectNumber(body.deviceOffsetX),
    deviceAngle: expectNumber(body.deviceAngle),
    deviceTilt: expectNumber(body.deviceTilt),
    headlineTop: expectNumber(body.headlineTop),
    headlineLeft: expectNumber(body.headlineLeft),
    headlineWidth: expectNumber(body.headlineWidth),
    subtitleTop: expectNumber(body.subtitleTop),
    subtitleLeft: expectNumber(body.subtitleLeft),
    subtitleWidth: expectNumber(body.subtitleWidth),
    // Accept both the new name (`screenshotUrl`) and the legacy one
    // (`screenshotDataUrl`) so a stale browser session running pre-rename
    // client code still renders correctly until next hard refresh.
    clientScreenshot: expectString(body.screenshotUrl) ?? expectString(body.screenshotDataUrl),
    platform: expectString(body.platform),
    sizeKey: expectString(body.sizeKey),
    composition: expectString(body.composition) as CompositionPreset | undefined,
    extraScreenshots: expectArray(body.extraScreenshots) as
      | Array<{
          screenshotUrl?: string;
          frameId?: string;
          offsetX?: number;
          offsetY?: number;
          scale?: number;
          rotation?: number;
          angle?: number;
          tilt?: number;
        }>
      | undefined,
    headlineGradient: expectObject(body.headlineGradient) as
      | { colors: string[]; direction: number }
      | undefined,
    subtitleGradient: expectObject(body.subtitleGradient) as
      | { colors: string[]; direction: number }
      | undefined,
    spotlight: expectObject(body.spotlight) as PreviewParams['spotlight'] | undefined,
    annotations: expectArray(body.annotations) as PreviewParams['annotations'] | undefined,
    headlineLineHeight: expectNumber(body.headlineLineHeight),
    headlineLetterSpacing: expectString(body.headlineLetterSpacing),
    headlineTextTransform: expectString(body.headlineTextTransform),
    headlineFontStyle: expectString(body.headlineFontStyle),
    subtitleOpacity: expectNumber(body.subtitleOpacity),
    subtitleLetterSpacing: expectString(body.subtitleLetterSpacing),
    subtitleTextTransform: expectString(body.subtitleTextTransform),
    headlineShadowCss: expectString(body.headlineShadowCss),
    subtitleShadowCss: expectString(body.subtitleShadowCss),
    freeTextShadowCss: expectString(body.freeTextShadowCss),
    deviceColor: expectString(body.deviceColor),
    backgroundType: expectString(body.backgroundType) as PreviewParams['backgroundType'],
    backgroundColor: expectString(body.backgroundColor),
    backgroundGradient: expectObject(
      body.backgroundGradient,
    ) as PreviewParams['backgroundGradient'],
    backgroundImageDataUrl: expectString(body.backgroundImageDataUrl),
    backgroundImageFit: expectString(body.backgroundImageFit) as PreviewParams['backgroundImageFit'],
    backgroundImagePositionX: expectNumber(body.backgroundImagePositionX),
    backgroundImagePositionY: expectNumber(body.backgroundImagePositionY),
    backgroundImageScale: expectNumber(body.backgroundImageScale),
    backgroundOverlay: expectObject(body.backgroundOverlay) as PreviewParams['backgroundOverlay'],
    deviceShadow: expectObject(body.deviceShadow) as PreviewParams['deviceShadow'],
    borderSimulation: expectObject(body.borderSimulation) as PreviewParams['borderSimulation'],
    cornerRadius: expectNumber(body.cornerRadius),
    headlineFont: expectString(body.headlineFont),
    headlineFontWeight: expectNumber(body.headlineFontWeight),
    subtitleFont: expectString(body.subtitleFont),
    subtitleFontWeight: expectNumber(body.subtitleFontWeight),
    freeText: expectString(body.freeText),
    freeTextEnabled: expectBoolean(body.freeTextEnabled),
    freeTextSize: expectNumber(body.freeTextSize),
    freeTextFont: expectString(body.freeTextFont),
    freeTextFontWeight: expectNumber(body.freeTextFontWeight),
    freeTextRotation: expectNumber(body.freeTextRotation),
    freeTextLetterSpacing: expectString(body.freeTextLetterSpacing),
    freeTextTextTransform: expectString(body.freeTextTextTransform),
    freeTextColor: expectString(body.freeTextColor),
    freeTextTop: expectNumber(body.freeTextTop),
    freeTextLeft: expectNumber(body.freeTextLeft),
    freeTextWidth: expectNumber(body.freeTextWidth),
    headlineLayer: expectString(body.headlineLayer) as PreviewParams['headlineLayer'],
    subtitleLayer: expectString(body.subtitleLayer) as PreviewParams['subtitleLayer'],
    freeTextLayer: expectString(body.freeTextLayer) as PreviewParams['freeTextLayer'],
    loupe: expectObject(body.loupe) as PreviewParams['loupe'],
    callouts: expectArray(body.callouts) as PreviewParams['callouts'],
    overlays: expectArray(body.overlays) as PreviewParams['overlays'],
  };
}

function clampPreviewParams(p: PreviewParams): PreviewParams {
  const clamp = (v: number | undefined, min: number, max: number) =>
    v === undefined ? undefined : Math.max(min, Math.min(max, v));
  p.width = Math.max(100, Math.min(10000, p.width));
  p.height = Math.max(100, Math.min(10000, p.height));
  p.deviceScale = clamp(p.deviceScale, 0, 200);
  p.deviceRotation = clamp(p.deviceRotation, -360, 360);
  p.headlineSize = clamp(p.headlineSize, 0, 500);
  p.subtitleSize = clamp(p.subtitleSize, 0, 500);
  p.freeTextSize = clamp(p.freeTextSize, 0, 500);
  return p;
}

async function resolveContext(
  p: PreviewParams,
  ctx: RouteContext,
): Promise<{ context: TemplateContext }> {
  const config = ctx.getConfig();
  const screen = config.screens[p.screenIndex] ?? null;
  const resolvedHeadline =
    resolveLocalizedScreenText(
      config,
      p.screenIndex,
      p.locale,
      p.localeConfig,
      'headline',
      p.headline,
      screen?.headline ?? 'New Screen',
      p.preferLocaleText ?? false,
    ) ?? 'New Screen';
  const resolvedSubtitle = resolveLocalizedScreenText(
    config,
    p.screenIndex,
    p.locale,
    p.localeConfig,
    'subtitle',
    p.subtitle,
    screen?.subtitle,
    p.preferLocaleText ?? false,
  );
  const resolvedFreeText = resolveLocalizedScreenText(
    config,
    p.screenIndex,
    p.locale,
    p.localeConfig,
    'freeText',
    p.freeText,
    undefined,
    p.preferLocaleText ?? false,
  );

  let screenshotUrl: string;
  if (p.clientScreenshot) {
    // Pass upload URLs through unchanged so the iframe loads the image
    // as a normal HTTP resource and the browser caches one copy across
    // all iframes / re-renders. Used to be resolved to a base64 data
    // URL here for legacy Playwright export, but that path is gone.
    screenshotUrl = p.clientScreenshot;
  } else {
    const screenshotPath = screen
      ? getLocalizedScreenshotPath(
          config,
          ctx.configDir,
          p.screenIndex,
          p.locale,
          screen.screenshot,
          p.localeConfig,
        )
      : '';
    if (screenshotPath && !isPathInside(ctx.configDir, screenshotPath)) {
      screenshotUrl = placeholderSvgDataUrl();
    } else {
      screenshotUrl = await screenshotToDataUrl(screenshotPath);
    }
  }

  let frame = p.frameId
    ? await getFrame(p.frameId)
    : await getDefaultFrame((p.platform as 'ios' | 'android') ?? 'ios');
  let frameSvg: string | null = null;
  let framePngUrl: string | undefined;

  // Prefer Koubou PNG frame when available (higher quality than SVG)
  const koubouFamily = p.frameId ? getDeviceFamily(p.frameId) : null;
  if (koubouFamily) {
    // If no SVG frame was found, try the Koubou family's previewFrameId as SVG fallback
    if (!frame && koubouFamily.previewFrameId) {
      frame = await getFrame(koubouFamily.previewFrameId);
    }
    if (koubouFamily?.screenRect && koubouFamily.framePngSize) {
      const deviceColor = p.deviceColor ?? config.frames.deviceColor;
      const koubouId = getDeviceId(koubouFamily.id, deviceColor || undefined);
      const pngExists = koubouId ? await getDeviceFramePath(koubouId) : null;
      if (pngExists && koubouId) {
        // Serve via URL so the browser caches one copy across all iframes.
        // Was inlined as base64 — ~600KB per iframe × 5 iframes blew up
        // browser memory on edit cycles. In preview mode, hit the resize
        // route so each iframe decodes ~3 MB instead of ~17 MB.
        const previewSuffix = p.previewMode ? '&preview=1' : '';
        framePngUrl = `/api/device-frame?id=${encodeURIComponent(koubouId)}${previewSuffix}`;
        frame = buildKoubouPreviewFrame(koubouFamily);
      }
    }
  }
  // Fall back to SVG frame from manifest
  if (!framePngUrl && frame && (p.fStyle ?? config.frames.style) !== 'none') {
    frameSvg = await readFile(frame.framePath, 'utf-8');
  }

  const context: TemplateContext = {
    headline: resolvedHeadline,
    subtitle: resolvedSubtitle,
    screenshotUrl,
    isFullscreen: p.isFullscreen ?? screen?.isFullscreen ?? false,
    colors: p.colors ? { ...config.theme.colors, ...p.colors } : config.theme.colors,
    font: p.font ?? config.theme.font,
    fontWeight: p.fontWeight ?? config.theme.fontWeight,
    headlineSize: p.headlineSize ?? config.theme.headlineSize,
    subtitleSize: p.subtitleSize ?? config.theme.subtitleSize,
    headlineRotation: p.headlineRotation,
    subtitleRotation: p.subtitleRotation,
    layout: p.layout ?? screen?.layout ?? 'center',
    frame: frame ?? null,
    frameStyle: p.fStyle ?? config.frames.style,
    frameSvg,
    framePngUrl,
    canvasWidth: p.width,
    canvasHeight: p.height,
    deviceTop: p.deviceTop,
    deviceScale: p.deviceScale,
    deviceRotation: p.deviceRotation,
    deviceOffsetX: p.deviceOffsetX,
    deviceAngle: p.deviceAngle,
    deviceTilt: p.deviceTilt,
    headlineGradient: p.headlineGradient,
    subtitleGradient: p.subtitleGradient,
    spotlight: p.spotlight,
    annotations: p.annotations,
    headlineLineHeight: p.headlineLineHeight ?? config.theme.headlineLineHeight,
    headlineLetterSpacing: p.headlineLetterSpacing ?? config.theme.headlineLetterSpacing,
    headlineTextTransform: p.headlineTextTransform ?? config.theme.headlineTextTransform,
    headlineFontStyle: p.headlineFontStyle ?? config.theme.headlineFontStyle,
    subtitleOpacity: p.subtitleOpacity ?? config.theme.subtitleOpacity,
    subtitleLetterSpacing: p.subtitleLetterSpacing ?? config.theme.subtitleLetterSpacing,
    subtitleTextTransform: p.subtitleTextTransform ?? config.theme.subtitleTextTransform,
    headlineShadowCss: p.headlineShadowCss,
    subtitleShadowCss: p.subtitleShadowCss,
    freeTextShadowCss: p.freeTextShadowCss,
    backgroundType: p.backgroundType ?? config.theme.backgroundType,
    backgroundColor: p.backgroundColor ?? config.theme.backgroundColor,
    backgroundGradient: p.backgroundGradient
      ? {
          ...p.backgroundGradient,
          radialPosition: p.backgroundGradient.radialPosition ?? 'center',
        }
      : config.theme.backgroundGradient,
    backgroundImageDataUrl: p.backgroundImageDataUrl,
    backgroundImageFit: p.backgroundImageFit,
    backgroundImagePositionX: p.backgroundImagePositionX,
    backgroundImagePositionY: p.backgroundImagePositionY,
    backgroundImageScale: p.backgroundImageScale,
    backgroundOverlay: p.backgroundOverlay ?? config.theme.backgroundOverlay,
    deviceShadow: p.deviceShadow,
    borderSimulation: p.borderSimulation,
    cornerRadius: p.cornerRadius,
    // Per-element font/weight. The client now always sends concrete
    // values (the cascade was removed); these fallbacks only fire for
    // legacy SDK callers / older configs that pre-date the change.
    headlineFont:
      p.headlineFont ??
      screen?.headlineFont ??
      config.theme.headlineFont ??
      config.theme.font ??
      'inter',
    headlineFontWeight:
      p.headlineFontWeight ??
      screen?.headlineFontWeight ??
      config.theme.headlineFontWeight ??
      config.theme.fontWeight ??
      600,
    subtitleFont:
      p.subtitleFont ??
      screen?.subtitleFont ??
      config.theme.subtitleFont ??
      config.theme.font ??
      'inter',
    subtitleFontWeight:
      p.subtitleFontWeight ??
      screen?.subtitleFontWeight ??
      config.theme.subtitleFontWeight ??
      400,
    freeText: resolvedFreeText,
    freeTextEnabled: p.freeTextEnabled,
    freeTextSize: p.freeTextSize,
    freeTextFont:
      p.freeTextFont ?? config.theme.freeTextFont ?? config.theme.font ?? 'inter',
    freeTextFontWeight: p.freeTextFontWeight ?? config.theme.freeTextFontWeight ?? 400,
    freeTextRotation: p.freeTextRotation,
    freeTextLetterSpacing: p.freeTextLetterSpacing,
    freeTextTextTransform: p.freeTextTextTransform,
    freeTextColor: p.freeTextColor,
    // Per-slot stacking tier — drives the dual/tri .text-area trick in
    // templates/universal/base.html. See headlineLayer on
    // screenConfigSchema for the field surface.
    headlineLayer: p.headlineLayer,
    subtitleLayer: p.subtitleLayer,
    freeTextLayer: p.freeTextLayer,
    loupe: p.loupe,
    callouts: p.callouts,
    overlays: p.overlays,
  };

  // Apply composition preset
  const compositionId = p.composition ?? 'single';
  const preset = COMPOSITION_PRESETS[compositionId];

  if (compositionId !== 'single' && preset && preset.deviceCount === 1) {
    // Single-device presets: client applies preset values to sliders on selection,
    // then sends them as regular device values. No server override needed —
    // the user can freely adjust sliders after picking a preset.
  } else if (compositionId !== 'single' && preset && preset.deviceCount > 1) {
    const devices: DeviceContext[] = [];

    for (let i = 0; i < preset.deviceCount; i++) {
      const slot = preset.slots[i]!;
      let slotScreenshotUrl: string;
      let slotFrame = frame ?? null;
      let slotFrameSvg = frameSvg;
      let slotFramePngUrl = framePngUrl;
      let slotOffsetX: number;
      let slotOffsetY: number;
      let slotScale: number;
      let slotRotation: number;
      let slotAngle: number;
      let slotTilt: number;

      if (i === 0) {
        slotScreenshotUrl = screenshotUrl;
        slotOffsetX = p.deviceOffsetX ?? slot.offsetX;
        slotOffsetY = p.deviceTop ?? slot.offsetY;
        slotScale = p.deviceScale ?? slot.scale;
        slotRotation = p.deviceRotation ?? slot.rotation;
        slotAngle = p.deviceAngle ?? slot.angle;
        slotTilt = p.deviceTilt ?? slot.tilt;
      } else {
        const extra = p.extraScreenshots?.[i - 1];
        if (extra?.screenshotUrl) {
          // Pass through as URL — the iframe loads it as a normal
          // resource. (Used to inline as base64 here; not needed since
          // the Playwright export path was removed.)
          slotScreenshotUrl = extra.screenshotUrl;
        } else {
          slotScreenshotUrl = screenshotUrl;
        }
        slotOffsetX = extra?.offsetX ?? slot.offsetX;
        slotOffsetY = extra?.offsetY ?? slot.offsetY;
        slotScale = extra?.scale ?? slot.scale;
        slotRotation = extra?.rotation ?? slot.rotation;
        slotAngle = extra?.angle ?? slot.angle;
        slotTilt = extra?.tilt ?? slot.tilt;
        if (extra?.frameId) {
          const extraFrame = await getFrame(extra.frameId);
          if (extraFrame) {
            slotFrame = extraFrame;
            slotFrameSvg =
              (p.fStyle ?? config.frames.style) !== 'none'
                ? await readFile(extraFrame.framePath, 'utf-8')
                : null;
            slotFramePngUrl = undefined;
          } else {
            const extraKoubou = getDeviceFamily(extra.frameId);
            if (extraKoubou?.screenRect && extraKoubou.framePngSize) {
              const extraKoubouId = getDeviceId(extraKoubou.id);
              const extraPngExists = extraKoubouId
                ? await getDeviceFramePath(extraKoubouId)
                : null;
              if (extraPngExists && extraKoubouId) {
                // Same URL-not-base64 treatment as the primary device.
                const previewSuffix = p.previewMode ? '&preview=1' : '';
                slotFramePngUrl = `/api/device-frame?id=${encodeURIComponent(extraKoubouId)}${previewSuffix}`;
                slotFrame = {
                  id: extraKoubou.id,
                  name: extraKoubou.name,
                  manufacturer: 'Apple',
                  year: extraKoubou.year,
                  platform: 'ios' as const,
                  framePath: '',
                  screenArea: {
                    x: extraKoubou.screenRect.x,
                    y: extraKoubou.screenRect.y,
                    width: extraKoubou.screenRect.width,
                    height: extraKoubou.screenRect.height,
                    borderRadius: extraKoubou.screenBorderRadius ?? 0,
                  },
                  frameSize: {
                    width: extraKoubou.framePngSize.width,
                    height: extraKoubou.framePngSize.height,
                  },
                  screenResolution: extraKoubou.screenResolution,
                  tags: [extraKoubou.category],
                } satisfies FrameDefinition;
                slotFrameSvg = null;
              }
            }
          }
        }
      }

      devices.push({
        screenshotUrl: slotScreenshotUrl,
        frame: slotFrame,
        frameSvg: slotFrameSvg,
        framePngUrl: slotFramePngUrl,
        offsetX: slotOffsetX,
        offsetY: slotOffsetY,
        scale: slotScale,
        rotation: slotRotation,
        angle: slotAngle,
        tilt: slotTilt,
        zIndex: slot.zIndex,
      });
    }

    context.composition = compositionId;
    context.devices = devices;
  }

  return { context };
}

/**
 * Validate an optional `fontFaceMode` body field. Defaults to undefined so
 * the engine falls back to its construction-time default (url or inline).
 */
function parseFontFaceMode(
  raw: unknown,
): FontFaceMode | undefined {
  if (raw === 'inline' || raw === 'url' || raw === 'none') return raw;
  return undefined;
}

function injectTextPositionCSS(
  html: string,
  positions: {
    headlineTop?: number;
    headlineLeft?: number;
    headlineWidth?: number;
    headlineRotation?: number;
    subtitleTop?: number;
    subtitleLeft?: number;
    subtitleWidth?: number;
    subtitleRotation?: number;
    freeTextTop?: number;
    freeTextLeft?: number;
    freeTextWidth?: number;
    freeTextRotation?: number;
  },
): string {
  // Always emits position:fixed. In iframe the containing block is the
  // iframe viewport (= canvas dimensions). In shadow the wrapper has
  // `transform: translateZ(0)`, which CSS Transforms 1 says makes it a
  // containing block for fixed descendants — and the wrapper is also
  // canvas-sized, so top/left % values resolve against the same
  // dimensions in both backends.
  //
  // (An earlier attempt used position:absolute for shadow, but the
  // template's `.text-area` is itself position:absolute and became the
  // headline's containing block — when both texts had saved positions
  // .text-area collapsed and saved percentages resolved against
  // near-zero dimensions, producing 8px-wide headlines and a feedback
  // loop on subsequent drags.)
  const rules: string[] = [];
  const transformWithRotation = (rotation?: number) =>
    rotation ? `translateX(-50%) rotate(${rotation}deg)` : 'translateX(-50%)';
  if (positions.headlineTop !== undefined && positions.headlineLeft !== undefined) {
    const w = positions.headlineWidth !== undefined ? `width: ${positions.headlineWidth}%;` : '';
    rules.push(
      `.headline { position: fixed; top: ${positions.headlineTop}%; left: ${positions.headlineLeft}%; transform: ${transformWithRotation(positions.headlineRotation)}; z-index: 10; margin: 0; ${w} }`,
    );
  }
  if (positions.subtitleTop !== undefined && positions.subtitleLeft !== undefined) {
    const w = positions.subtitleWidth !== undefined ? `width: ${positions.subtitleWidth}%;` : '';
    rules.push(
      `.subtitle { position: fixed; top: ${positions.subtitleTop}%; left: ${positions.subtitleLeft}%; transform: ${transformWithRotation(positions.subtitleRotation)}; z-index: 10; margin: 0; ${w} }`,
    );
  }
  if (positions.freeTextTop !== undefined && positions.freeTextLeft !== undefined) {
    const w = positions.freeTextWidth !== undefined ? `width: ${positions.freeTextWidth}%;` : '';
    rules.push(
      `.free-text { position: fixed; top: ${positions.freeTextTop}%; left: ${positions.freeTextLeft}%; transform: ${transformWithRotation(positions.freeTextRotation)}; z-index: 10; margin: 0; ${w} }`,
    );
  }
  if (rules.length === 0) return html;
  return html.replace('</head>', `<style>${rules.join('\n')}</style>\n</head>`);
}

export function registerPreviewRoutes(app: Express, ctx: RouteContext): void {
  // API: Render HTML only (no Playwright screenshot — used by iframe preview)
  app.post('/api/preview-html', async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;
      const p = clampPreviewParams(parseBody(body));
      const { context } = await resolveContext(p, ctx);

      // Optional override for how @font-face declarations are emitted in
      // the response. Defaults to the engine's construction-time mode
      // (`url` against /preview-fonts/). Phase 3's shadow-DOM client
      // path passes 'none' to skip them — the parent document has the
      // fonts registered already and re-injecting per render wastes work.
      const fontFaceMode = parseFontFaceMode(body.fontFaceMode);

      let html = await ctx.templateEngine.render(context, { fontFaceMode });
      html = injectTextPositionCSS(html, {
        headlineTop: p.headlineTop,
        headlineLeft: p.headlineLeft,
        headlineWidth: p.headlineWidth,
        headlineRotation: p.headlineRotation,
        subtitleTop: p.subtitleTop,
        subtitleLeft: p.subtitleLeft,
        subtitleWidth: p.subtitleWidth,
        subtitleRotation: p.subtitleRotation,
        freeTextTop: p.freeTextTop,
        freeTextLeft: p.freeTextLeft,
        freeTextWidth: p.freeTextWidth,
        freeTextRotation: p.freeTextRotation,
      });
      // Single pass — one </head> + </body> replace for all effects,
      // instead of two per effect. Matters when multiple effects are
      // active on the same screen.
      html = injectEffectsHTML(
        html,
        { spotlight: p.spotlight, annotations: p.annotations },
        p.width,
        p.height,
      );
      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  // GET /api/preview-font-faces?ids=inter,playfair-display
  //
  // Returns URL-mode @font-face CSS for the requested font ids, joined.
  // The shadow-DOM live preview (Phase 3+) calls this so the parent
  // document can register the fonts once instead of having every preview
  // surface inject duplicate @font-face declarations. Unknown ids are
  // dropped silently (an unknown id produces an empty CSS block on the
  // server side too — the loader returns '' when readdir fails).
  app.get('/api/preview-font-faces', async (req, res) => {
    try {
      const idsParam = typeof req.query.ids === 'string' ? req.query.ids : '';
      const ids = idsParam
        .split(',')
        .map((s) => s.trim())
        .filter((s) => /^[a-z0-9-]+$/.test(s));
      if (ids.length === 0) {
        res.set('Content-Type', 'text/css');
        res.send('');
        return;
      }
      const unique = Array.from(new Set(ids));
      const cssParts = await Promise.all(
        unique.map((id) => loadFontFacesUrl(id, '/preview-fonts')),
      );
      res.set('Content-Type', 'text/css');
      // Match the /preview-fonts static cache — font URLs are content-
      // addressed by filename, so the resolved CSS block for an id is
      // stable across server restarts.
      res.set('Cache-Control', 'public, max-age=86400');
      res.send(cssParts.filter((s) => s.length > 0).join('\n\n'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  });

  registerPanoramicPreviewRoute(app, ctx);
}
