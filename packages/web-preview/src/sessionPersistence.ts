import { validateConfigOrThrow } from '@appframe/core';
import type { AppframeConfig } from '@appframe/core';

export interface SessionSaveVariantInput {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  status?: unknown;
  snapshot?: unknown;
  artifacts?: unknown;
  previewArtifacts?: unknown;
  copyAssignments?: unknown;
  score?: unknown;
  history?: unknown;
  provenance?: unknown;
}

export interface SessionSaveRequestBody {
  activeVariantId?: unknown;
  recommendedVariantId?: unknown;
  recommendationReason?: unknown;
  screenshotAnalysis?: unknown;
  selectedCopySet?: unknown;
  conceptPlan?: unknown;
  reviewControls?: unknown;
  refinementHistory?: unknown;
  variants?: SessionSaveVariantInput[];
}

export interface PersistedSessionRecord {
  activeVariantId: string;
  updatedAt?: string;
  variants: Array<Record<string, unknown> & { id?: string }>;
  autopilot?: Record<string, unknown>;
}

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

export function buildConfigFromEditorState(
  baseConfig: AppframeConfig,
  body: Record<string, unknown>,
): AppframeConfig {
  const next = JSON.parse(JSON.stringify(baseConfig)) as AppframeConfig;
  const mode = body.mode === 'panoramic' || body.isPanoramic === true ? 'panoramic' : 'individual';
  const screens = Array.isArray(body.screens)
    ? body.screens.filter(isRecord)
    : [];
  const locales = isRecord(body.sessionLocales)
    ? body.sessionLocales
    : next.locales;

  next.mode = mode;
  next.locales = locales as AppframeConfig['locales'];

  const firstScreen = screens[0];
  if (firstScreen && mode !== 'panoramic') {
    next.theme = {
      ...next.theme,
      style: (expectOptionalString(firstScreen.style) as AppframeConfig['theme']['style']) ?? next.theme.style,
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
    };

    const colors = isRecord(firstScreen.colors) ? firstScreen.colors : null;
    if (colors) {
      next.theme.colors = {
        primary: expectOptionalString(colors.primary) ?? next.theme.colors.primary,
        secondary: expectOptionalString(colors.secondary) ?? next.theme.colors.secondary,
        background: expectOptionalString(colors.background) ?? next.theme.colors.background,
        text: expectOptionalString(colors.text) ?? next.theme.colors.text,
        subtitle: expectOptionalString(colors.subtitle) ?? next.theme.colors.subtitle,
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
      autoSizeHeadline: true,
      autoSizeSubtitle: false,
      annotations: [],
    };

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
      composition:
        (expectOptionalString(screen.composition) as typeof original.composition)
        ?? original.composition,
      autoSizeHeadline:
        typeof screen.autoSizeHeadline === 'boolean'
          ? screen.autoSizeHeadline
          : original.autoSizeHeadline,
      autoSizeSubtitle:
        typeof screen.autoSizeSubtitle === 'boolean'
          ? screen.autoSizeSubtitle
          : original.autoSizeSubtitle,
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
    };
  });

  return validateConfigOrThrow(next);
}

function getParentVariantId(candidate: unknown): string | undefined {
  if (!isRecord(candidate)) return undefined;
  return typeof candidate.parentVariantId === 'string' ? candidate.parentVariantId : undefined;
}

function getVariantConfig(
  candidate: Record<string, unknown> | undefined,
): AppframeConfig | undefined {
  return isRecord(candidate?.config)
    ? validateConfigOrThrow(candidate.config as AppframeConfig)
    : undefined;
}

function resolveBaseConfig(args: {
  existingVariantMap: Map<string, Record<string, unknown> & { id?: string }>;
  materializedVariantMap: Map<string, Record<string, unknown> & { id?: string }>;
  fallbackConfig: AppframeConfig;
  incoming: SessionSaveVariantInput;
  variantId: string;
}): AppframeConfig {
  const existing = args.existingVariantMap.get(args.variantId);
  const existingConfig = getVariantConfig(existing);
  if (existingConfig) return existingConfig;

  const parentVariantId = getParentVariantId(args.incoming.provenance);
  if (parentVariantId) {
    const materializedParentConfig = getVariantConfig(args.materializedVariantMap.get(parentVariantId));
    if (materializedParentConfig) return materializedParentConfig;

    const persistedParentConfig = getVariantConfig(args.existingVariantMap.get(parentVariantId));
    if (persistedParentConfig) return persistedParentConfig;
  }

  return validateConfigOrThrow(args.fallbackConfig);
}

export function materializeSessionSaveVariants(args: {
  session: PersistedSessionRecord;
  bodyVariants: SessionSaveVariantInput[];
  fallbackConfig: AppframeConfig;
}): Array<Record<string, unknown> & { id?: string }> {
  const existingVariantMap = new Map(
    args.session.variants
      .map((variant) => (typeof variant.id === 'string' ? [variant.id, variant] as const : null))
      .filter((entry): entry is readonly [string, Record<string, unknown> & { id?: string }] => entry !== null),
  );
  const materializedVariantMap = new Map<string, Record<string, unknown> & { id?: string }>();
  const nextVariants: Array<Record<string, unknown> & { id?: string }> = [];

  for (const incoming of args.bodyVariants) {
    const variantId = expectOptionalString(incoming.id);
    if (!variantId) continue;

    const existing = existingVariantMap.get(variantId);
    const nextName = expectOptionalString(incoming.name) || existing?.name || 'Variant';
    const nextStatus = incoming.status === 'approved' ? 'approved' : 'draft';
    const nextDescription = expectOptionalString(incoming.description) || existing?.description || '';
    const snapshot = isRecord(incoming.snapshot) ? incoming.snapshot : null;
    const baseConfig = resolveBaseConfig({
      existingVariantMap,
      materializedVariantMap,
      fallbackConfig: args.fallbackConfig,
      incoming,
      variantId,
    });
    const nextConfig = snapshot
      ? buildConfigFromEditorState(baseConfig, snapshot)
      : baseConfig;

    const nextVariant = {
      ...(existing ?? {}),
      id: variantId,
      name: nextName,
      description: nextDescription,
      status: nextStatus,
      config: nextConfig,
      editorSnapshot: incoming.snapshot ?? existing?.editorSnapshot,
      artifacts: Array.isArray(incoming.artifacts) ? incoming.artifacts : existing?.artifacts ?? [],
      previewArtifacts: Array.isArray(incoming.previewArtifacts)
        ? incoming.previewArtifacts
        : existing?.previewArtifacts ?? [],
      copyAssignments: Array.isArray(incoming.copyAssignments)
        ? incoming.copyAssignments
        : existing?.copyAssignments ?? [],
      score: isRecord(incoming.score) ? incoming.score : existing?.score,
      history: Array.isArray(incoming.history) ? incoming.history : existing?.history ?? [],
      provenance: isRecord(incoming.provenance) ? incoming.provenance : existing?.provenance,
    };

    nextVariants.push(nextVariant);
    materializedVariantMap.set(variantId, nextVariant);
  }

  return nextVariants;
}

export function mergeSessionSaveRequest(args: {
  session: PersistedSessionRecord;
  body: SessionSaveRequestBody;
  fallbackConfig: AppframeConfig;
  updatedAt?: string;
}): PersistedSessionRecord {
  const activeVariantId = expectOptionalString(args.body.activeVariantId);
  if (!activeVariantId) {
    throw new Error('activeVariantId is required');
  }
  if (!Array.isArray(args.body.variants)) {
    throw new Error('variants array is required');
  }

  const updatedAt = args.updatedAt ?? new Date().toISOString();
  const nextSession: PersistedSessionRecord = {
    ...args.session,
    activeVariantId,
    updatedAt,
    variants: materializeSessionSaveVariants({
      session: args.session,
      bodyVariants: args.body.variants,
      fallbackConfig: args.fallbackConfig,
    }),
  };

  if (nextSession.autopilot) {
    nextSession.autopilot = {
      ...nextSession.autopilot,
      recommendedVariantId:
        args.body.recommendedVariantId === null
          ? null
          : expectOptionalString(args.body.recommendedVariantId) || nextSession.autopilot.recommendedVariantId,
      recommendationReason:
        args.body.recommendationReason === null
          ? null
          : expectOptionalString(args.body.recommendationReason) || nextSession.autopilot.recommendationReason,
      screenshotAnalysis: Array.isArray(args.body.screenshotAnalysis)
        ? args.body.screenshotAnalysis
        : nextSession.autopilot.screenshotAnalysis,
      selectedCopySet: isRecord(args.body.selectedCopySet)
        ? args.body.selectedCopySet
        : args.body.selectedCopySet === null
          ? null
          : nextSession.autopilot.selectedCopySet,
      conceptPlan: isRecord(args.body.conceptPlan)
        ? args.body.conceptPlan
        : args.body.conceptPlan === null
          ? null
          : nextSession.autopilot.conceptPlan,
      reviewControls: isRecord(args.body.reviewControls)
        ? args.body.reviewControls
        : args.body.reviewControls === null
          ? null
          : nextSession.autopilot.reviewControls,
      refinementHistory: Array.isArray(args.body.refinementHistory)
        ? args.body.refinementHistory
        : nextSession.autopilot.refinementHistory,
    };
  }

  return nextSession;
}
