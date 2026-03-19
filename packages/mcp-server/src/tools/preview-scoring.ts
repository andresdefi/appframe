import type { AppframeConfig } from '@appframe/core';

export interface VariantScore {
  total: number;
  breakdown: Record<string, number>;
  flags: string[];
  reason: string;
}

export interface ScoredVariant {
  id: string;
  name: string;
  score: VariantScore;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function averageHeadlineWords(config: AppframeConfig): number {
  const headlines = config.mode === 'panoramic'
    ? config.panoramic?.elements.filter((element) => element.type === 'text').map((element) => element.content) ?? []
    : config.screens.map((screen) => screen.headline);

  if (headlines.length === 0) return 0;

  const totalWords = headlines.reduce((sum, headline) => (
    sum + headline.replace(/\n/g, ' ').split(/\s+/).filter(Boolean).length
  ), 0);

  return totalWords / headlines.length;
}

function countStyles(variants: Array<{ config: AppframeConfig }>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const variant of variants) {
    const key = `${variant.config.mode}:${variant.config.theme.style}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function buildScore(args: {
  config: AppframeConfig;
  previewCount: number;
  duplicateCount: number;
}): VariantScore {
  const { config, previewCount, duplicateCount } = args;
  const flags: string[] = [];
  const averageWords = averageHeadlineWords(config);
  const roundedFrameless =
    config.frames.style === 'none'
      ? config.mode === 'panoramic'
        ? Boolean(config.panoramic?.elements.some((element) => (
            element.type === 'device' && (element.cornerRadius ?? 0) > 0
          )))
        : config.screens.every((screen) => (screen.cornerRadius ?? 0) > 0)
      : true;

  const thumbnailReadability = clamp(100 - Math.abs(4 - averageWords) * 12, 35, 100);
  const textCollisionRisk = clamp(
    config.mode === 'panoramic' ? 84 : 88 - Math.max(config.screens.length - 5, 0) * 6,
    50,
    95,
  );
  const hierarchyClarity = clamp(
    config.mode === 'panoramic'
      ? 88
      : config.screens.every((screen) => screen.composition === 'single') ? 90 : 78,
    55,
    95,
  );
  const brandFit = clamp(
    config.theme.colors.primary && config.theme.colors.secondary ? 86 : 72,
    50,
    92,
  );
  const narrativeSequencing = clamp(
    config.mode === 'panoramic'
      ? 90
      : config.screens.length >= 4 ? 84 : 76,
    55,
    94,
  );
  const screenshotUsageQuality = clamp(
    config.mode === 'panoramic'
      ? 86
      : config.frames.style === 'none' && !roundedFrameless ? 62 : 88,
    45,
    95,
  );
  const previewReadiness = clamp(previewCount > 0 ? 92 : 55, 55, 92);
  const conceptDiversity = clamp(92 - Math.max(0, duplicateCount - 1) * 18, 40, 92);

  if (averageWords < 3 || averageWords > 5.5) {
    flags.push('Copy may be hard to read at thumbnail size.');
  }
  if (!roundedFrameless) {
    flags.push('Frameless treatment should use rounded corners.');
  }
  if (duplicateCount > 1) {
    flags.push('Concept is too close to another mode/style pairing.');
  }
  if (previewCount === 0) {
    flags.push('Preview artifacts have not been generated yet.');
  }

  const breakdown = {
    thumbnailReadability,
    textCollisionRisk,
    hierarchyClarity,
    brandFit,
    conceptDiversity,
    screenshotUsageQuality,
    narrativeSequencing,
    previewReadiness,
  };

  const total = Math.round(
    Object.values(breakdown).reduce((sum, value) => sum + value, 0) / Object.keys(breakdown).length,
  );

  const reasonParts = [
    config.mode === 'panoramic' ? 'strong connected storytelling' : 'clear single-screen hierarchy',
    thumbnailReadability >= 82 ? 'readable copy' : 'copy needs tightening',
    conceptDiversity >= 80 ? 'distinct concept language' : 'needs more separation from the other variants',
  ];

  return {
    total,
    breakdown,
    flags,
    reason: `${reasonParts[0]}, ${reasonParts[1]}, ${reasonParts[2]}.`,
  };
}

export function scoreVariantSet(
  variants: Array<{
    id: string;
    name: string;
    config: AppframeConfig;
    previewCount?: number;
  }>,
): {
  scored: ScoredVariant[];
  recommendedVariantId: string | null;
  recommendationReason: string | null;
} {
  const styleCounts = countStyles(variants);
  const scored = variants
    .map((variant) => {
      const duplicateCount = styleCounts.get(`${variant.config.mode}:${variant.config.theme.style}`) ?? 1;
      return {
        id: variant.id,
        name: variant.name,
        score: buildScore({
          config: variant.config,
          previewCount: variant.previewCount ?? 0,
          duplicateCount,
        }),
      };
    })
    .sort((left, right) => right.score.total - left.score.total);

  const top = scored[0];
  return {
    scored,
    recommendedVariantId: top?.id ?? null,
    recommendationReason: top ? `${top.name} leads on quality heuristics: ${top.score.reason}` : null,
  };
}

