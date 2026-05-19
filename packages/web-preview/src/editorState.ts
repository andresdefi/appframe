import { validateConfigOrThrow } from '@appframe/core';
import type { AppframeConfig } from '@appframe/core';

function expectOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildBackgroundString(screen: Record<string, unknown>, fallback?: string): string | undefined {
  const backgroundType = expectOptionalString(screen.backgroundType);
  if (backgroundType === 'solid') {
    return expectOptionalString(screen.backgroundColor) ?? fallback;
  }
  if (backgroundType === 'gradient') {
    const gradient = screen.backgroundGradient;
    if (!isRecord(gradient) || !Array.isArray(gradient.colors) || gradient.colors.length < 2) {
      return fallback;
    }
    const colors = gradient.colors.map((entry) => String(entry)).join(', ');
    if (gradient.type === 'radial') {
      return `radial-gradient(circle at ${String(gradient.radialPosition ?? 'center')}, ${colors})`;
    }
    return `linear-gradient(${Number(gradient.direction ?? 135)}deg, ${colors})`;
  }
  if (backgroundType === 'preset') return undefined;
  return fallback;
}

function normalizeScreenshotPath(
  original: string | undefined,
  nextName: unknown,
  index: number,
): string {
  if (!original) {
    return typeof nextName === 'string' && nextName
      ? `screenshots/${nextName}`
      : `screenshots/screen-${index + 1}.png`;
  }
  if (typeof nextName !== 'string' || !nextName || original.endsWith(nextName)) {
    return original;
  }
  const parts = original.split('/');
  parts[parts.length - 1] = nextName;
  return parts.join('/');
}

type ScreenConfig = AppframeConfig['screens'][number];

// Build a single ScreenConfig from the editor's ScreenState shape.
// Used for the top-level `screens` array and each locale's screens
// override. The locale path uses a synthetic default original since
// locales don't carry their own base ScreenConfig templates.
function buildScreenConfig(
  screen: Record<string, unknown>,
  original: ScreenConfig,
  index: number,
): ScreenConfig {
  const backgroundType = expectOptionalString(screen.backgroundType) as typeof original.backgroundType;
  const backgroundColor = expectOptionalString(screen.backgroundColor);
  const backgroundGradient = isRecord(screen.backgroundGradient)
    ? screen.backgroundGradient as typeof original.backgroundGradient
    : undefined;
  const backgroundImage = expectOptionalString(screen.backgroundImageDataUrl);
  const backgroundImageFit = expectOptionalString(screen.backgroundImageFit) as typeof original.backgroundImageFit;
  const backgroundImagePositionX = typeof screen.backgroundImagePositionX === 'number' ? screen.backgroundImagePositionX : undefined;
  const backgroundImagePositionY = typeof screen.backgroundImagePositionY === 'number' ? screen.backgroundImagePositionY : undefined;
  const backgroundImageScale = typeof screen.backgroundImageScale === 'number' ? screen.backgroundImageScale : undefined;
  const backgroundOverlay = isRecord(screen.backgroundOverlay)
    ? screen.backgroundOverlay as typeof original.backgroundOverlay
    : undefined;

  return {
    ...original,
    screenshot: normalizeScreenshotPath(original.screenshot, screen.screenshotName, index),
    headline: expectOptionalString(screen.headline) ?? original.headline,
    subtitle: expectOptionalString(screen.subtitle),
    layout:
      (expectOptionalString(screen.layout) as typeof original.layout)
      ?? original.layout,
    device: expectOptionalString(screen.frameId) ?? original.device,
    background: buildBackgroundString(screen, original.background),
    ...(backgroundType && backgroundType !== 'preset' ? { backgroundType } : {}),
    ...(backgroundType === 'solid' && backgroundColor ? { backgroundColor } : {}),
    ...(backgroundType === 'gradient' && backgroundGradient ? { backgroundGradient } : {}),
    ...(backgroundType === 'image' && backgroundImage ? { backgroundImage } : {}),
    ...(backgroundType === 'image' && backgroundImageFit ? { backgroundImageFit } : {}),
    ...(backgroundType === 'image' && backgroundImagePositionX != null ? { backgroundImagePositionX } : {}),
    ...(backgroundType === 'image' && backgroundImagePositionY != null ? { backgroundImagePositionY } : {}),
    ...(backgroundType === 'image' && backgroundImageScale != null ? { backgroundImageScale } : {}),
    ...(backgroundOverlay ? { backgroundOverlay } : {}),
    composition:
      (expectOptionalString(screen.composition) as typeof original.composition)
      ?? original.composition,
    spotlight: isRecord(screen.spotlight)
      ? screen.spotlight as typeof original.spotlight
      : original.spotlight,
    annotations: Array.isArray(screen.annotations)
      ? screen.annotations as typeof original.annotations
      : original.annotations ?? [],
    deviceShadow: isRecord(screen.deviceShadow)
      ? screen.deviceShadow as typeof original.deviceShadow
      : original.deviceShadow,
    borderSimulation: isRecord(screen.borderSimulation)
      ? screen.borderSimulation as typeof original.borderSimulation
      : original.borderSimulation,
    cornerRadius:
      typeof screen.cornerRadius === 'number'
        ? screen.cornerRadius
        : original.cornerRadius,
    loupe: isRecord(screen.loupe)
      ? screen.loupe as typeof original.loupe
      : original.loupe,
    callouts: Array.isArray(screen.callouts)
      ? screen.callouts as typeof original.callouts
      : original.callouts,
    overlays: Array.isArray(screen.overlays)
      ? screen.overlays as typeof original.overlays
      : original.overlays,
    ...(expectOptionalString(screen.headlineFont)
      ? { headlineFont: expectOptionalString(screen.headlineFont) as typeof original.headlineFont }
      : {}),
    ...(typeof screen.headlineFontWeight === 'number'
      ? { headlineFontWeight: screen.headlineFontWeight }
      : {}),
    ...(expectOptionalString(screen.subtitleFont)
      ? { subtitleFont: expectOptionalString(screen.subtitleFont) as typeof original.subtitleFont }
      : {}),
    ...(typeof screen.subtitleFontWeight === 'number'
      ? { subtitleFontWeight: screen.subtitleFontWeight }
      : {}),
    ...(typeof screen.freeTextEnabled === 'boolean'
      ? { freeTextEnabled: screen.freeTextEnabled }
      : {}),
    ...(expectOptionalString(screen.freeText)
      ? { freeText: expectOptionalString(screen.freeText) as string }
      : {}),
    ...(typeof screen.freeTextSize === 'number' && screen.freeTextSize > 0
      ? { freeTextSize: screen.freeTextSize }
      : {}),
    ...(expectOptionalString(screen.freeTextFont)
      ? { freeTextFont: expectOptionalString(screen.freeTextFont) as typeof original.freeTextFont }
      : {}),
    ...(typeof screen.freeTextFontWeight === 'number'
      ? { freeTextFontWeight: screen.freeTextFontWeight }
      : {}),
    ...(typeof screen.freeTextRotation === 'number' && screen.freeTextRotation !== 0
      ? { freeTextRotation: screen.freeTextRotation }
      : {}),
    ...(typeof screen.freeTextLetterSpacing === 'number' && screen.freeTextLetterSpacing !== 0
      ? { freeTextLetterSpacing: `${screen.freeTextLetterSpacing / 100}em` }
      : {}),
    ...(expectOptionalString(screen.freeTextTextTransform)
      ? {
          freeTextTextTransform:
            expectOptionalString(screen.freeTextTextTransform) as typeof original.freeTextTextTransform,
        }
      : {}),
  };
}

export function buildConfigFromEditorState(
  baseConfig: AppframeConfig,
  body: Record<string, unknown>,
): AppframeConfig {
  const next = JSON.parse(JSON.stringify(baseConfig)) as AppframeConfig;
  const mode = body.mode === 'panoramic' || body.isPanoramic === true ? 'panoramic' : 'individual';
  const screens = Array.isArray(body.screens)
    ? body.screens.filter(isRecord)
    : [];
  const sessionLocales = isRecord(body.sessionLocales) ? body.sessionLocales : {};
  const localeScreens = isRecord(body.localeScreens) ? body.localeScreens : {};
  const localePanoramicElements = isRecord(body.localePanoramicElements)
    ? body.localePanoramicElements
    : {};

  next.mode = mode;
  // Merge per-locale snapshots into the locales map so the live
  // /api/config reflects the editor's full state. Without this, agents
  // polling /api/config see locale labels but no localized screen
  // edits — both branches below copy through sessionLocales[code] as
  // the metadata + screens / panoramic.elements layered on top.
  const mergedLocales: Record<string, unknown> = {};
  const allLocaleCodes = new Set<string>([
    ...Object.keys(sessionLocales),
    ...Object.keys(localeScreens),
    ...Object.keys(localePanoramicElements),
  ]);
  for (const code of allLocaleCodes) {
    const meta = isRecord(sessionLocales[code]) ? sessionLocales[code] : {};
    const entry: Record<string, unknown> = { ...meta };
    const localeScreenStates = localeScreens[code];
    if (Array.isArray(localeScreenStates)) {
      entry.screens = localeScreenStates
        .filter(isRecord)
        .map((screen, index) =>
          buildScreenConfig(
            screen,
            (next.screens[index] ?? {
              screenshot: `screenshots/screen-${index + 1}.png`,
              headline: `Screen ${index + 1}`,
              layout: 'center' as const,
              composition: 'single' as const,
              annotations: [],
            }) as ScreenConfig,
            index,
          ),
        );
    }
    const localeElements = localePanoramicElements[code];
    if (Array.isArray(localeElements)) {
      entry.panoramic = { elements: localeElements };
    }
    mergedLocales[code] = entry;
  }
  next.locales = mergedLocales as AppframeConfig['locales'];

  const firstScreen = screens[0];
  if (firstScreen && mode !== 'panoramic') {
    next.theme = {
      ...next.theme,
      font: expectOptionalString(firstScreen.font) ?? next.theme.font,
      fontWeight:
        typeof firstScreen.fontWeight === 'number'
          ? firstScreen.fontWeight
          : next.theme.fontWeight,
      headlineSize:
        typeof firstScreen.headlineSize === 'number' && firstScreen.headlineSize > 0
          ? firstScreen.headlineSize
          : undefined,
      subtitleSize:
        typeof firstScreen.subtitleSize === 'number' && firstScreen.subtitleSize > 0
          ? firstScreen.subtitleSize
          : undefined,
      headlineGradient: isRecord(firstScreen.headlineGradient)
        ? firstScreen.headlineGradient as AppframeConfig['theme']['headlineGradient']
        : undefined,
      subtitleGradient: isRecord(firstScreen.subtitleGradient)
        ? firstScreen.subtitleGradient as AppframeConfig['theme']['subtitleGradient']
        : undefined,
      headlineLineHeight:
        typeof firstScreen.headlineLineHeight === 'number' && firstScreen.headlineLineHeight > 0
          ? firstScreen.headlineLineHeight / 100
          : undefined,
      headlineLetterSpacing:
        typeof firstScreen.headlineLetterSpacing === 'number' && firstScreen.headlineLetterSpacing !== 0
          ? `${firstScreen.headlineLetterSpacing / 100}em`
          : undefined,
      headlineTextTransform:
        (expectOptionalString(firstScreen.headlineTextTransform) as AppframeConfig['theme']['headlineTextTransform'])
        ?? undefined,
      headlineFontStyle:
        (expectOptionalString(firstScreen.headlineFontStyle) as AppframeConfig['theme']['headlineFontStyle'])
        ?? undefined,
      subtitleOpacity:
        typeof firstScreen.subtitleOpacity === 'number' && firstScreen.subtitleOpacity > 0
          ? firstScreen.subtitleOpacity / 100
          : undefined,
      subtitleLetterSpacing:
        typeof firstScreen.subtitleLetterSpacing === 'number' && firstScreen.subtitleLetterSpacing !== 0
          ? `${firstScreen.subtitleLetterSpacing / 100}em`
          : undefined,
      subtitleTextTransform:
        (expectOptionalString(firstScreen.subtitleTextTransform) as AppframeConfig['theme']['subtitleTextTransform'])
        ?? undefined,
      headlineFont:
        (expectOptionalString(firstScreen.headlineFont) as AppframeConfig['theme']['headlineFont'])
        ?? undefined,
      headlineFontWeight:
        typeof firstScreen.headlineFontWeight === 'number' ? firstScreen.headlineFontWeight : undefined,
      subtitleFont:
        (expectOptionalString(firstScreen.subtitleFont) as AppframeConfig['theme']['subtitleFont'])
        ?? undefined,
      subtitleFontWeight:
        typeof firstScreen.subtitleFontWeight === 'number' ? firstScreen.subtitleFontWeight : undefined,
      freeTextFont:
        (expectOptionalString(firstScreen.freeTextFont) as AppframeConfig['theme']['freeTextFont'])
        ?? undefined,
      freeTextFontWeight:
        typeof firstScreen.freeTextFontWeight === 'number' ? firstScreen.freeTextFontWeight : undefined,
    };

    const colors = isRecord(firstScreen.colors) ? firstScreen.colors : null;
    if (colors) {
      next.theme.colors = {
        primary: expectOptionalString(colors.primary) ?? next.theme.colors.primary,
        secondary: expectOptionalString(colors.secondary) ?? next.theme.colors.secondary,
        background: expectOptionalString(colors.background) ?? next.theme.colors.background,
        text: expectOptionalString(colors.text) ?? next.theme.colors.text,
        subtitle: expectOptionalString(colors.subtitle) ?? next.theme.colors.subtitle,
        freeText: expectOptionalString(colors.freeText) ?? next.theme.colors.freeText,
      };
    }

    next.frames = {
      ...next.frames,
      style:
        (expectOptionalString(firstScreen.frameStyle) as AppframeConfig['frames']['style'])
        ?? next.frames.style,
      deviceColor: expectOptionalString(firstScreen.deviceColor) ?? next.frames.deviceColor,
    };
  }

  if (mode === 'panoramic') {
    const fallbackPanoramic = next.panoramic;
    next.frameCount =
      typeof body.panoramicFrameCount === 'number'
        ? body.panoramicFrameCount
        : next.frameCount ?? 5;
    next.panoramic = {
      background: isRecord(body.panoramicBackground)
        ? body.panoramicBackground as NonNullable<AppframeConfig['panoramic']>['background']
        : fallbackPanoramic?.background ?? { type: 'solid' },
      elements: Array.isArray(body.panoramicElements)
        ? body.panoramicElements as NonNullable<AppframeConfig['panoramic']>['elements']
        : fallbackPanoramic?.elements ?? [],
    };
    return validateConfigOrThrow(next);
  }

  next.screens = screens.map((screen, index) => {
    const original = next.screens[index] ?? {
      screenshot: `screenshots/screen-${index + 1}.png`,
      headline: `Screen ${index + 1}`,
      layout: 'center' as const,
      composition: 'single' as const,
      annotations: [],
    };
    return buildScreenConfig(screen, original as ScreenConfig, index);
  });

  return validateConfigOrThrow(next);
}
