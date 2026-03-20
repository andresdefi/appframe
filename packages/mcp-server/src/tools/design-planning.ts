import { basename, extname } from 'node:path';
import { readFile, stat } from 'node:fs/promises';

export interface ScreenshotInput {
  path: string;
  note?: string;
}

export type ScreenshotRole =
  | 'home'
  | 'onboarding'
  | 'detail'
  | 'communication'
  | 'discovery'
  | 'workflow'
  | 'settings'
  | 'paywall'
  | 'feature'
  | 'unknown';

export type ScreenshotDensity = 'minimal' | 'balanced' | 'dense';
export type TextRisk = 'low' | 'medium' | 'high';
export type CropSuitability = 'low' | 'medium' | 'high';
export type RecommendedUsage = 'hero-device' | 'secondary-device' | 'crop-card' | 'support-only';
export type OrderingConfidence = 'low' | 'medium' | 'high';
export type PanoramicCompositionFeature =
  | 'layered-detail-extract'
  | 'floating-detail-card'
  | 'decorative-cluster'
  | 'proof-stack';

export interface SafeTextZone {
  x: number;
  y: number;
  width: number;
  height: number;
  label: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface ScreenshotAnalysis {
  path: string;
  note?: string;
  basename: string;
  format: string | null;
  width: number | null;
  height: number | null;
  aspectRatio: number | null;
  role: ScreenshotRole;
  density: ScreenshotDensity;
  textRisk: TextRisk;
  heroPriority: number;
  heroExplanation: string[];
  inferredOrder: number | null;
  orderingConfidence: OrderingConfidence;
  orderingReason: string[];
  focus: string;
  dominantPalette: string[];
  safeTextZones: SafeTextZone[];
  cropSuitability: CropSuitability;
  recommendedUsage: RecommendedUsage;
  unsafeForTextOverlay: boolean;
}

export interface VariantSetPlan {
  app: {
    name: string;
    description: string;
    category: string;
    platforms: string[];
  };
  goals: string[];
  analysisSummary: {
    screenshotCount: number;
    selectedCount: number;
    roles: Record<string, number>;
    topHeroCandidate: string | null;
    topHeroExplanation: string[];
  };
  selectedScreens: Array<{
    path: string;
    role: ScreenshotRole;
    heroPriority: number;
    inferredOrder: number | null;
    focus: string;
    unsafeForTextOverlay: boolean;
  }>;
  variants: PlannedVariant[];
}

export interface PlannedIndividualScreen {
  index: number;
  sourcePath: string;
  sourceRole: ScreenshotRole;
  slideRole: string;
  layout: 'center' | 'angled-left' | 'angled-right';
  composition: 'single';
  backgroundStrategy: string;
  copyDirection: string;
  framing: 'framed' | 'frameless-rounded';
  implementationNote?: string;
}

export interface PlannedPanoramicFrame {
  frame: number;
  sourcePath: string;
  sourceRole: ScreenshotRole;
  cropSuitability: CropSuitability;
  storyBeat: string;
  assetGuidance?: string;
  pacing?: string;
  compositionFeatures?: PanoramicCompositionFeature[];
  compositionNote?: string;
}

export interface PlannedPanoramicCanvasPlan {
  frameCount: number;
  designGoal: string;
  requiredElements: Array<{
    type:
      | 'text'
      | 'device'
      | 'image'
      | 'logo'
      | 'decoration'
      | 'crop'
      | 'card'
      | 'badge'
      | 'proof-chip'
      | 'group';
    purpose: string;
  }>;
}

export interface PlannedIndividualVariant {
  id: string;
  name: string;
  currentCapabilityFit: 'supported_now' | 'partially_supported';
  mode: 'individual';
  style: string;
  recipe: string;
  strategy: string;
  screens: PlannedIndividualScreen[];
}

export interface PlannedPanoramicVariant {
  id: string;
  name: string;
  currentCapabilityFit: 'supported_now' | 'partially_supported';
  mode: 'panoramic';
  style: string;
  recipe: string;
  strategy: string;
  canvasPlan: PlannedPanoramicCanvasPlan;
  frames?: PlannedPanoramicFrame[];
}

export type PlannedVariant = PlannedIndividualVariant | PlannedPanoramicVariant;

interface ImageMetadata {
  format: string | null;
  width: number | null;
  height: number | null;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function humanizeFileStem(pathValue: string): string {
  const stem = basename(pathValue, extname(pathValue))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stem || 'screen';
}

function inferRole(pathValue: string, note?: string): ScreenshotRole {
  const haystack = normalizeText(`${humanizeFileStem(pathValue)} ${note ?? ''}`);

  if (/(home|dashboard|overview|feed|main)/.test(haystack)) return 'home';
  if (/(onboarding|welcome|intro|start|splash)/.test(haystack)) return 'onboarding';
  if (/(chat|message|inbox|conversation|dm)/.test(haystack)) return 'communication';
  if (/(search|discover|explore|browse|find)/.test(haystack)) return 'discovery';
  if (/(calendar|plan|task|workflow|schedule|editor|compose)/.test(haystack)) return 'workflow';
  if (/(detail|profile|report|analytics|stats|insight|summary)/.test(haystack)) return 'detail';
  if (/(settings|account|profile edit|preferences)/.test(haystack)) return 'settings';
  if (/(pricing|upgrade|paywall|subscribe|checkout|cart|payment)/.test(haystack)) return 'paywall';
  if (/(feature|screen|tab|list)/.test(haystack)) return 'feature';
  return 'unknown';
}

function inferDensity(role: ScreenshotRole, pathValue: string, note?: string): ScreenshotDensity {
  const haystack = normalizeText(`${humanizeFileStem(pathValue)} ${note ?? ''}`);

  if (role === 'onboarding') return 'minimal';
  if (role === 'settings' || role === 'communication') return 'dense';
  if (/(list|feed|table|settings|calendar|report|analytics|chat)/.test(haystack)) return 'dense';
  if (/(welcome|splash|intro|hero)/.test(haystack)) return 'minimal';
  return 'balanced';
}

function inferTextRisk(density: ScreenshotDensity): TextRisk {
  if (density === 'minimal') return 'low';
  if (density === 'dense') return 'high';
  return 'medium';
}

function inferFocus(pathValue: string, note?: string, role?: ScreenshotRole): string {
  if (note?.trim()) return note.trim();

  const stem = humanizeFileStem(pathValue);
  if (role && role !== 'unknown') {
    return `${role} flow from ${stem}`;
  }
  return stem;
}

function inferDominantPalette(role: ScreenshotRole, density: ScreenshotDensity): string[] {
  if (role === 'settings') return ['#F8FAFC', '#CBD5E1', '#0F172A'];
  if (role === 'communication') return ['#EFF6FF', '#DBEAFE', '#1D4ED8'];
  if (role === 'paywall') return ['#111827', '#F59E0B', '#FFFFFF'];
  if (density === 'minimal') return ['#FFFFFF', '#E2E8F0', '#0F172A'];
  return ['#F8FAFC', '#94A3B8', '#0F172A'];
}

function inferSafeTextZones(role: ScreenshotRole, density: ScreenshotDensity): SafeTextZone[] {
  if (density === 'dense') {
    return [
      { x: 5, y: 5, width: 90, height: 16, label: 'top' },
      { x: 5, y: 78, width: 90, height: 14, label: 'bottom' },
    ];
  }

  if (role === 'onboarding') {
    return [
      { x: 8, y: 8, width: 84, height: 22, label: 'top' },
      { x: 10, y: 68, width: 80, height: 20, label: 'bottom' },
    ];
  }

  return [
    { x: 6, y: 6, width: 88, height: 20, label: 'top' },
    { x: 6, y: 72, width: 88, height: 16, label: 'bottom' },
    { x: 6, y: 28, width: 26, height: 34, label: 'left' },
  ];
}

function inferCropSuitability(role: ScreenshotRole, density: ScreenshotDensity): CropSuitability {
  if (role === 'detail' || role === 'discovery' || role === 'paywall') return 'high';
  if (density === 'dense') return 'medium';
  return 'low';
}

function inferRecommendedUsage(
  role: ScreenshotRole,
  heroPriority: number,
  cropSuitability: CropSuitability,
): RecommendedUsage {
  if (heroPriority >= 78) return 'hero-device';
  if (cropSuitability === 'high') return 'crop-card';
  if (role === 'settings') return 'support-only';
  return 'secondary-device';
}

function inferUnsafeForTextOverlay(
  role: ScreenshotRole,
  density: ScreenshotDensity,
  safeTextZones: SafeTextZone[],
): boolean {
  const maxZoneArea = Math.max(0, ...safeTextZones.map((zone) => zone.width * zone.height));
  return density === 'dense' || role === 'communication' || role === 'settings' || maxZoneArea < 1200;
}

function computeHeroPriority(
  role: ScreenshotRole,
  density: ScreenshotDensity,
  width: number | null,
  height: number | null,
  pathValue: string,
  note?: string,
): number {
  let score = 40;

  switch (role) {
    case 'home':
      score += 45;
      break;
    case 'workflow':
      score += 32;
      break;
    case 'onboarding':
      score += 28;
      break;
    case 'discovery':
      score += 24;
      break;
    case 'detail':
      score += 20;
      break;
    case 'communication':
      score += 14;
      break;
    case 'feature':
      score += 12;
      break;
    case 'settings':
      score -= 4;
      break;
    case 'paywall':
      score += 6;
      break;
    case 'unknown':
      break;
  }

  if (density === 'minimal') score += 6;
  if (density === 'dense') score -= 4;
  if (width && height && height > width) score += 4;

  const haystack = normalizeText(`${humanizeFileStem(pathValue)} ${note ?? ''}`);
  if (/(main|core|primary|hero|first)/.test(haystack)) score += 8;
  if (/(settings|prefs|debug)/.test(haystack)) score -= 8;

  return Math.max(0, Math.min(100, score));
}

function roleSequenceRank(role: ScreenshotRole): number {
  switch (role) {
    case 'onboarding':
      return 1;
    case 'home':
      return 2;
    case 'discovery':
      return 3;
    case 'workflow':
      return 4;
    case 'detail':
      return 5;
    case 'feature':
      return 6;
    case 'communication':
      return 7;
    case 'paywall':
      return 8;
    case 'settings':
      return 9;
    default:
      return 6;
  }
}

function parseFilenameOrder(pathValue: string): { order: number | null; reason: string | null } {
  const stem = humanizeFileStem(pathValue).toLowerCase();
  const labeledMatch = stem.match(/\b(?:screen|shot|screenshot|slide|step|frame|page)\s*(\d{1,2})\b/);
  if (labeledMatch) {
    const order = Number(labeledMatch[1]);
    return { order, reason: `Filename suggests position ${order}.` };
  }

  const leadingMatch = stem.match(/^(?:0*)(\d{1,2})\b/);
  if (leadingMatch) {
    const order = Number(leadingMatch[1]);
    return { order, reason: `Leading filename number suggests position ${order}.` };
  }

  if (/\b(first|intro|welcome|start)\b/.test(stem)) {
    return { order: 1, reason: 'Filename suggests an opening screen.' };
  }

  if (/\b(final|last|end|summary)\b/.test(stem)) {
    return { order: 99, reason: 'Filename suggests a closing screen.' };
  }

  return { order: null, reason: null };
}

function buildHeroExplanation(args: {
  role: ScreenshotRole;
  density: ScreenshotDensity;
  heroPriority: number;
  width: number | null;
  height: number | null;
  pathValue: string;
  recommendedUsage: RecommendedUsage;
}): string[] {
  const reasons: string[] = [];

  if (args.role === 'home') {
    reasons.push('Home/dashboard content usually makes the clearest opening hero.');
  } else if (args.role === 'workflow') {
    reasons.push('Workflow screens often explain the core value quickly.');
  } else if (args.role === 'onboarding') {
    reasons.push('Onboarding screens often have cleaner whitespace for hero use.');
  }

  if (args.density === 'minimal') {
    reasons.push('Lower UI density leaves more room for readable overlay copy.');
  } else if (args.density === 'dense') {
    reasons.push('Dense UI lowers hero flexibility even if the feature is important.');
  }

  if (args.height && args.width && args.height > args.width) {
    reasons.push('Portrait aspect ratio matches store screenshot framing well.');
  }

  if (/(main|primary|hero|first)/.test(normalizeText(args.pathValue))) {
    reasons.push('Filename hints that this is a primary or first screen.');
  }

  if (args.recommendedUsage === 'hero-device') {
    reasons.push('Recommended usage is hero-device, so it can carry the opening concept directly.');
  }

  reasons.push(`Computed hero priority: ${args.heroPriority}/100.`);
  return reasons;
}

function buildOrderingData(
  analyses: Array<{
    path: string;
    role: ScreenshotRole;
    statMtimeMs: number | null;
  }>,
): Array<{
  inferredOrder: number | null;
  orderingConfidence: OrderingConfidence;
  orderingReason: string[];
}> {
  const orderedByMtime = analyses
    .map((analysis, index) => ({ index, mtimeMs: analysis.statMtimeMs }))
    .filter((entry): entry is { index: number; mtimeMs: number } => entry.mtimeMs !== null)
    .sort((left, right) => left.mtimeMs - right.mtimeMs);
  const mtimeRankByIndex = new Map<number, number>();
  orderedByMtime.forEach((entry, rank) => {
    mtimeRankByIndex.set(entry.index, rank + 1);
  });

  const scored = analyses
    .map((analysis, index) => {
      const filenameOrder = parseFilenameOrder(analysis.path);
      const orderingReason: string[] = [];
      let orderingConfidence: OrderingConfidence = 'low';
      let score = roleSequenceRank(analysis.role) * 100;

      if (filenameOrder.order !== null) {
        score = filenameOrder.order * 100;
        orderingConfidence = filenameOrder.order >= 90 ? 'medium' : 'high';
        if (filenameOrder.reason) orderingReason.push(filenameOrder.reason);
      } else {
        if (mtimeRankByIndex.has(index)) {
          orderingReason.push(`File timestamp places it around position ${mtimeRankByIndex.get(index)}.`);
          score += (mtimeRankByIndex.get(index) ?? 1) * 10;
          orderingConfidence = 'medium';
        }
        orderingReason.push(`Role heuristic places ${analysis.role} around step ${roleSequenceRank(analysis.role)}.`);
      }

      return { index, score, orderingConfidence, orderingReason };
    })
    .sort((left, right) => left.score - right.score);

  const ranked = new Map<number, { inferredOrder: number; orderingConfidence: OrderingConfidence; orderingReason: string[] }>();
  scored.forEach((entry, rank) => {
    ranked.set(entry.index, {
      inferredOrder: rank + 1,
      orderingConfidence: entry.orderingConfidence,
      orderingReason: entry.orderingReason,
    });
  });

  return analyses.map((_analysis, index) => ranked.get(index) ?? {
    inferredOrder: null,
    orderingConfidence: 'low',
    orderingReason: ['No ordering signal was available.'],
  });
}

function parseSvgDimensions(svgText: string): { width: number | null; height: number | null } {
  const widthMatch = svgText.match(/\bwidth=["']?([\d.]+)(px)?["']?/i);
  const heightMatch = svgText.match(/\bheight=["']?([\d.]+)(px)?["']?/i);
  if (widthMatch && heightMatch) {
    return {
      width: Number(widthMatch[1]),
      height: Number(heightMatch[1]),
    };
  }

  const viewBoxMatch = svgText.match(/\bviewBox=["']?([\d.\s-]+)["']?/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1]!.trim().split(/\s+/).map(Number);
    if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
      return {
        width: parts[2] ?? null,
        height: parts[3] ?? null,
      };
    }
  }

  return { width: null, height: null };
}

function readPngDimensions(buffer: Buffer): ImageMetadata | null {
  if (buffer.length < 24) return null;
  if (buffer.toString('ascii', 1, 4) !== 'PNG') return null;
  return {
    format: 'png',
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readGifDimensions(buffer: Buffer): ImageMetadata | null {
  if (buffer.length < 10) return null;
  const header = buffer.toString('ascii', 0, 6);
  if (header !== 'GIF87a' && header !== 'GIF89a') return null;
  return {
    format: 'gif',
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
}

function readWebpDimensions(buffer: Buffer): ImageMetadata | null {
  if (buffer.length < 30) return null;
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }

  const chunkType = buffer.toString('ascii', 12, 16);
  if (chunkType === 'VP8X' && buffer.length >= 30) {
    return {
      format: 'webp',
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunkType === 'VP8 ' && buffer.length >= 30) {
    return {
      format: 'webp',
      width: buffer.readUInt16LE(26),
      height: buffer.readUInt16LE(28),
    };
  }

  if (chunkType === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      format: 'webp',
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return { format: 'webp', width: null, height: null };
}

function readJpegDimensions(buffer: Buffer): ImageMetadata | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    if (!marker) break;
    offset += 2;

    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 1 >= buffer.length) break;

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) break;

    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof && offset + 7 < buffer.length) {
      return {
        format: 'jpeg',
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += segmentLength;
  }

  return { format: 'jpeg', width: null, height: null };
}

export async function readImageMetadata(pathValue: string): Promise<ImageMetadata> {
  try {
    const buffer = await readFile(pathValue);

    const png = readPngDimensions(buffer);
    if (png) return png;

    const gif = readGifDimensions(buffer);
    if (gif) return gif;

    const jpeg = readJpegDimensions(buffer);
    if (jpeg) return jpeg;

    const webp = readWebpDimensions(buffer);
    if (webp) return webp;

    const maybeSvg = buffer.toString('utf8', 0, Math.min(buffer.length, 2048));
    if (/<svg[\s>]/i.test(maybeSvg)) {
      const svg = parseSvgDimensions(maybeSvg);
      return { format: 'svg', ...svg };
    }
  } catch {
    return { format: null, width: null, height: null };
  }

  return { format: null, width: null, height: null };
}

export function inferCategory(appDescription: string, features: string[]): string {
  const haystack = `${appDescription} ${features.join(' ')}`.toLowerCase();
  if (/(money|budget|bank|expense|invoice|finance|invest)/.test(haystack)) return 'finance';
  if (/(workout|health|sleep|fitness|habit|wellness|meditation)/.test(haystack)) return 'health';
  if (/(task|calendar|project|note|todo|schedule|productivity)/.test(haystack))
    return 'productivity';
  if (/(chat|message|social|community|creator|share)/.test(haystack)) return 'social';
  if (/(photo|camera|video|music|edit|creative|design)/.test(haystack)) return 'creative';
  if (/(game|play|quiz|puzzle|multiplayer)/.test(haystack)) return 'games';
  return 'general';
}

export async function analyzeScreenshotSet(
  inputs: ScreenshotInput[],
): Promise<ScreenshotAnalysis[]> {
  const baseAnalyses = await Promise.all(
    inputs.map(async (input) => {
      const metadata = await readImageMetadata(input.path);
      const fileStat = await stat(input.path).catch(() => null);
      const role = inferRole(input.path, input.note);
      const density = inferDensity(role, input.path, input.note);
      const focus = inferFocus(input.path, input.note, role);
      const cropSuitability = inferCropSuitability(role, density);
      const heroPriority = computeHeroPriority(
        role,
        density,
        metadata.width,
        metadata.height,
        input.path,
        input.note,
      );
      const safeTextZones = inferSafeTextZones(role, density);
      const recommendedUsage = inferRecommendedUsage(role, heroPriority, cropSuitability);

      return {
        path: input.path,
        note: input.note,
        basename: basename(input.path),
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        aspectRatio:
          metadata.width && metadata.height
            ? Number((metadata.width / metadata.height).toFixed(3))
            : null,
        role,
        density,
        textRisk: inferTextRisk(density),
        heroPriority,
        heroExplanation: buildHeroExplanation({
          role,
          density,
          heroPriority,
          width: metadata.width,
          height: metadata.height,
          pathValue: input.path,
          recommendedUsage,
        }),
        inferredOrder: null,
        orderingConfidence: 'low' as const,
        orderingReason: [],
        focus,
        dominantPalette: inferDominantPalette(role, density),
        safeTextZones,
        cropSuitability,
        recommendedUsage,
        unsafeForTextOverlay: inferUnsafeForTextOverlay(role, density, safeTextZones),
        statMtimeMs: fileStat?.mtimeMs ?? null,
      };
    }),
  );

  const ordering = buildOrderingData(
    baseAnalyses.map((analysis) => ({
      path: analysis.path,
      role: analysis.role,
      statMtimeMs: analysis.statMtimeMs,
    })),
  );
  const analyses = baseAnalyses.map((analysis, index) => {
    const { statMtimeMs: _statMtimeMs, ...rest } = analysis;
    return {
      ...rest,
      inferredOrder: ordering[index]?.inferredOrder ?? null,
      orderingConfidence: ordering[index]?.orderingConfidence ?? 'low',
      orderingReason: ordering[index]?.orderingReason ?? [],
    } satisfies ScreenshotAnalysis;
  });

  return analyses.sort((a, b) => b.heroPriority - a.heroPriority);
}

function selectScreensForPlan(
  analyses: ScreenshotAnalysis[],
  screenCount: number,
): ScreenshotAnalysis[] {
  const sortByInferredOrder = (items: ScreenshotAnalysis[]): ScreenshotAnalysis[] =>
    items.slice().sort(
      (left, right) =>
        (left.inferredOrder ?? Number.MAX_SAFE_INTEGER) -
        (right.inferredOrder ?? Number.MAX_SAFE_INTEGER),
    );

  if (analyses.length <= screenCount) return sortByInferredOrder(analyses);

  const picked: ScreenshotAnalysis[] = [];
  const seenRoles = new Set<ScreenshotRole>();

  for (const analysis of analyses) {
    if (!seenRoles.has(analysis.role)) {
      picked.push(analysis);
      seenRoles.add(analysis.role);
    }
    if (picked.length === screenCount) return sortByInferredOrder(picked);
  }

  for (const analysis of analyses) {
    if (!picked.includes(analysis)) {
      picked.push(analysis);
    }
    if (picked.length === screenCount) return sortByInferredOrder(picked);
  }

  return sortByInferredOrder(picked);
}

function buildSlideRole(index: number, total: number): string {
  if (index === 0) return 'hero';
  if (index === 1) return 'differentiator';
  if (index === total - 1) return 'summary';
  if (index === total - 2 && total > 3) return 'trust';
  return 'feature';
}

function buildGoalLine(goals: string[]): string {
  if (goals.length === 0) return 'Clear benefit-led messaging';
  return goals.join(', ');
}

function buildPanoramicCompositionFeatures(args: {
  recipe: 'editorial-panorama' | 'bold-panorama';
  analysis: ScreenshotAnalysis;
  storyBeat: string;
  index: number;
}): PanoramicCompositionFeature[] {
  const features: PanoramicCompositionFeature[] = ['floating-detail-card'];

  if (args.analysis.cropSuitability !== 'low') {
    features.push('layered-detail-extract');
  }

  if (
    args.recipe === 'bold-panorama'
    || args.index === 0
    || args.storyBeat === 'trust'
    || args.storyBeat === 'summary'
  ) {
    features.push('decorative-cluster');
  }

  if (args.storyBeat === 'trust' || args.storyBeat === 'summary') {
    features.push('proof-stack');
  }

  return features;
}

function buildPanoramicCompositionNote(args: {
  recipe: 'editorial-panorama' | 'bold-panorama';
  features: PanoramicCompositionFeature[];
  analysis: ScreenshotAnalysis;
  storyBeat: string;
}): string {
  const parts: string[] = [];

  if (args.features.includes('layered-detail-extract')) {
    parts.push('Pull cropped UI details into a layered supporting stack.');
  }

  if (args.features.includes('floating-detail-card')) {
    parts.push(
      args.recipe === 'editorial-panorama'
        ? 'Pair the main device with a quieter floating UI card.'
        : 'Use a floating UI card to keep momentum and readability.',
    );
  }

  if (args.features.includes('decorative-cluster')) {
    parts.push('Anchor the frame with grouped decorative accents instead of loose single shapes.');
  }

  if (args.features.includes('proof-stack')) {
    parts.push('Reserve extra room for proof or trust signals near the close.');
  }

  if (parts.length === 0) {
    parts.push(
      args.analysis.cropSuitability === 'low'
        ? 'Keep the full screenshot dominant and let typography carry the frame.'
        : `Support the ${args.storyBeat} beat with one tighter product detail.`,
    );
  }

  return parts.join(' ');
}

function buildVariantEntries(
  selected: ScreenshotAnalysis[],
  goals: string[],
  variantCount: number,
): PlannedVariant[] {
  const variants: PlannedVariant[] = [];

  variants.push({
    id: 'concept-a',
    name: 'Clean Hero',
    currentCapabilityFit: 'supported_now',
    mode: 'individual',
    style: 'minimal',
    recipe: 'clean-hero',
    strategy:
      'Use the clearest hero candidate first, keep layouts centered, and optimize for App Store thumbnail readability.',
    screens: selected.map((analysis, index) => ({
      index: index + 1,
      sourcePath: analysis.path,
      sourceRole: analysis.role,
      slideRole: buildSlideRole(index, selected.length),
      layout: index % 2 === 1 ? 'angled-right' : 'center',
      composition: 'single',
      backgroundStrategy: index === 0 ? 'primary-tint' : 'consistent-light',
      copyDirection:
        index === 0
          ? 'State the main outcome in 3-5 words.'
          : `Sell ${analysis.focus} in one idea.`,
      framing: 'framed',
    })),
  });

  if (variantCount >= 2) {
    variants.push({
      id: 'concept-b',
      name: 'Dynamic Individual',
      currentCapabilityFit: 'supported_now',
      mode: 'individual',
      style: 'bold',
      recipe: 'layered-momentum',
      strategy:
        'Use stronger contrast, bolder pacing, and frameless rounded screenshots where they read cleaner than hardware frames.',
      screens: selected.map((analysis, index) => ({
        index: index + 1,
        sourcePath: analysis.path,
        sourceRole: analysis.role,
        slideRole: buildSlideRole(index, selected.length),
        layout:
          index === 0 ? 'center' : index % 2 === 0 ? 'angled-left' : 'angled-right',
        composition: 'single',
        backgroundStrategy: index === 0 ? 'high-contrast-hero' : 'contrast-rhythm',
        copyDirection: `Drive energy around ${analysis.focus} without losing readability.`,
        framing: analysis.recommendedUsage === 'crop-card' ? 'frameless-rounded' : 'framed',
      })),
    });
  }

  if (variantCount >= 3) {
    variants.push({
      id: 'concept-c',
      name: 'Editorial Panorama',
      currentCapabilityFit: 'supported_now',
      mode: 'panoramic',
      style: 'editorial',
      recipe: 'editorial-panorama',
      strategy:
        'Build a connected editorial story with stronger whitespace, fewer elements, and slower pacing across frames.',
      canvasPlan: {
        frameCount: Math.max(4, selected.length),
        designGoal: 'Premium, connected sequence with strong hierarchy and intentional whitespace.',
        requiredElements: [
          { type: 'text', purpose: 'asymmetric editorial headline blocks' },
          { type: 'device', purpose: 'screen continuity across frame boundaries' },
          { type: 'group', purpose: 'paired crop-and-card systems for supporting proof clusters' },
          { type: 'logo', purpose: 'brand mark or subtle supporting asset' },
        ],
      },
      frames: selected.map((analysis, index) => {
        const storyBeat = buildSlideRole(index, selected.length);
        const compositionFeatures = buildPanoramicCompositionFeatures({
          recipe: 'editorial-panorama',
          analysis,
          storyBeat,
          index,
        });

        return {
          frame: index + 1,
          sourcePath: analysis.path,
          sourceRole: analysis.role,
          cropSuitability: analysis.cropSuitability,
          storyBeat,
          pacing:
            index === 0
              ? 'open strong'
              : index === selected.length - 1
                ? 'close quietly'
                : 'develop narrative',
          compositionFeatures,
          compositionNote: buildPanoramicCompositionNote({
            recipe: 'editorial-panorama',
            features: compositionFeatures,
            analysis,
            storyBeat,
          }),
        };
      }),
    });
  }

  if (variantCount >= 4) {
    variants.push({
      id: 'concept-d',
      name: 'Bold Panorama',
      currentCapabilityFit: 'supported_now',
      mode: 'panoramic',
      style: 'branded',
      recipe: 'bold-panorama',
      strategy:
        'Use stronger brand color, bigger transitions, and more cinematic rhythm across the panoramic strip.',
      canvasPlan: {
        frameCount: Math.max(4, selected.length),
        designGoal: buildGoalLine(goals),
        requiredElements: [
          { type: 'text', purpose: 'benefit-led headlines' },
          { type: 'badge', purpose: 'campaign callout or featured-state badge' },
          { type: 'proof-chip', purpose: 'ratings or trust proof chip' },
          { type: 'device', purpose: 'hero and supporting product shots' },
          { type: 'group', purpose: 'floating grouped crop-and-card clusters for momentum and proof' },
          { type: 'logo', purpose: 'brand lockup or supporting graphic asset' },
          { type: 'decoration', purpose: 'motion and depth' },
        ],
      },
      frames: selected.map((analysis, index) => {
        const storyBeat = buildSlideRole(index, selected.length);
        const compositionFeatures = buildPanoramicCompositionFeatures({
          recipe: 'bold-panorama',
          analysis,
          storyBeat,
          index,
        });

        return {
          frame: index + 1,
          sourcePath: analysis.path,
          sourceRole: analysis.role,
          cropSuitability: analysis.cropSuitability,
          storyBeat,
          assetGuidance:
            analysis.cropSuitability === 'high'
              ? 'Pair the full screenshot with cropped support details or a floating image asset.'
              : 'Keep the screenshot dominant and let the typography do the extra work.',
          compositionFeatures,
          compositionNote: buildPanoramicCompositionNote({
            recipe: 'bold-panorama',
            features: compositionFeatures,
            analysis,
            storyBeat,
          }),
        };
      }),
    });
  }

  if (variantCount >= 5) {
    variants.push({
      id: 'concept-e',
      name: 'Brand Poster',
      currentCapabilityFit: 'partially_supported',
      mode: 'panoramic',
      style: 'branded',
      recipe: 'brand-poster',
      strategy:
        'Poster-like concept centered on strong brand color, badge/image assets, and direct outcome copy.',
      canvasPlan: {
        frameCount: Math.max(3, selected.length),
        designGoal: 'Poster-like brand-led sequence with strong color blocking.',
        requiredElements: [
          { type: 'text', purpose: 'benefit headline' },
          { type: 'badge', purpose: 'proof or ratings-style badge' },
          { type: 'proof-chip', purpose: 'compact trust marker or rating chip' },
          { type: 'device', purpose: 'product proof' },
          { type: 'logo', purpose: 'brand lockup or ratings proof' },
        ],
      },
    });
  }

  return variants.slice(0, variantCount);
}

export async function buildVariantSetPlan(args: {
  appName: string;
  appDescription: string;
  platforms: string[];
  features: string[];
  screenshots: ScreenshotInput[];
  goals?: string[];
  variantCount?: number;
  screenCount?: number;
}): Promise<VariantSetPlan> {
  const analyses = await analyzeScreenshotSet(args.screenshots);
  const screenCount = Math.max(
    3,
    Math.min(args.screenCount ?? Math.min(5, analyses.length || 5), Math.max(analyses.length, 3)),
  );
  const selected = selectScreensForPlan(
    analyses,
    Math.min(screenCount, analyses.length || screenCount),
  );
  const goals = args.goals ?? [];
  const category = inferCategory(args.appDescription, args.features);

  const roles = selected.reduce<Record<string, number>>((acc, analysis) => {
    acc[analysis.role] = (acc[analysis.role] ?? 0) + 1;
    return acc;
  }, {});

  return {
    app: {
      name: args.appName,
      description: args.appDescription,
      category,
      platforms: args.platforms,
    },
    goals,
    analysisSummary: {
      screenshotCount: analyses.length,
      selectedCount: selected.length,
      roles,
      topHeroCandidate: analyses[0]?.path ?? null,
      topHeroExplanation: analyses[0]?.heroExplanation ?? [],
    },
    selectedScreens: selected.map((analysis) => ({
      path: analysis.path,
      role: analysis.role,
      heroPriority: analysis.heroPriority,
      inferredOrder: analysis.inferredOrder,
      focus: analysis.focus,
      unsafeForTextOverlay: analysis.unsafeForTextOverlay,
    })),
    variants: buildVariantEntries(selected, goals, args.variantCount ?? 4),
  };
}
