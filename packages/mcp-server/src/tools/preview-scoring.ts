import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import type { AppframeConfig, PanoramicElement } from '@appframe/core';

export interface ModelAssistedVisualRanking {
  variantId: string;
  score?: number;
  rank?: number;
  confidence?: number;
  reason?: string;
}

export interface VariantScore {
  total: number;
  breakdown: Record<string, number>;
  flags: string[];
  reason: string;
  highlights?: string[];
  issues?: string[];
  modelRanking?: {
    score: number;
    confidence: number;
    rank?: number;
    reason?: string;
    source: 'visual-model';
  };
}

export interface ScoredVariant {
  id: string;
  name: string;
  score: VariantScore;
}

interface DecodedPng {
  width: number;
  height: number;
  data: Uint8Array;
}

interface PreviewImageMetrics {
  format: 'png';
  width: number;
  height: number;
  contrastScore: number;
  textZoneSafetyScore: number;
  emptySpaceBalanceScore: number;
  clutterControlScore: number;
  continuityScore: number;
  edgeDensity: number;
  topEdgeDensity: number;
  emptySpaceRatio: number;
  topQuietRatio: number;
  seamDifference: number | null;
}

interface PreviewSummary {
  metrics: PreviewImageMetrics | null;
  flags: string[];
}

interface HeadlineWordStats {
  average: number;
  min: number;
  max: number;
}

interface ConceptProfile {
  id: string;
  name: string;
  mode: AppframeConfig['mode'];
  style: AppframeConfig['theme']['style'];
  frameStyle: AppframeConfig['frames']['style'];
  screenCount: number;
  roundedFrameless: boolean;
  averageWords: number;
  layoutSignature: string;
  structureSignature: string;
  recipeSpecificity: number;
  visualSignature: {
    contrast: number;
    textZoneSafety: number;
    whitespaceBalance: number;
    clutterControl: number;
    continuityQuality: number;
    edgeDensity: number;
    emptySpaceRatio: number;
  } | null;
}

interface PairwiseComparison {
  distance: number;
  overlaps: string[];
}

interface ConceptDiversityAssessment {
  score: number;
  nearestVariantId: string | null;
  nearestVariantName: string | null;
  nearestDistance: number;
  averageDistance: number;
  issue: string | null;
  strength: string | null;
}

interface NormalizedModelRanking {
  score: number;
  confidence: number;
  rank?: number;
  reason?: string;
}

interface StructureAssessment {
  score: number;
  signature: string;
  issue: string | null;
  strength: string | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatNumber(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  return `${rounded}`;
}

function listJoin(parts: string[]): string {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!;
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

function getHeadlineContents(config: AppframeConfig): string[] {
  return config.mode === 'panoramic'
    ? config.panoramic?.elements.filter((element) => element.type === 'text').map((element) => element.content) ?? []
    : config.screens.map((screen) => screen.headline);
}

function getHeadlineWordStats(config: AppframeConfig): HeadlineWordStats {
  const wordCounts = getHeadlineContents(config)
    .map((headline) => headline.replace(/\n/g, ' ').split(/\s+/).filter(Boolean).length)
    .filter((count) => count > 0);

  if (wordCounts.length === 0) {
    return { average: 0, min: 0, max: 0 };
  }

  const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
  return {
    average: totalWords / wordCounts.length,
    min: Math.min(...wordCounts),
    max: Math.max(...wordCounts),
  };
}

function usesRoundedFrameless(config: AppframeConfig): boolean {
  if (config.frames.style !== 'none') return true;
  if (config.mode === 'panoramic') {
    return Boolean(config.panoramic?.elements.some((element) => (
      element.type === 'device' && (element.cornerRadius ?? 0) > 0
    )));
  }
  return config.screens.every((screen) => (screen.cornerRadius ?? 0) > 0);
}

function collectPanoramicElementTypes(elements: PanoramicElement[] | undefined, acc = new Set<string>()): Set<string> {
  for (const element of elements ?? []) {
    acc.add(element.type);
    if (element.type === 'group') {
      collectPanoramicElementTypes(element.children, acc);
    }
  }
  return acc;
}

function collectPanoramicElementsByType<T extends PanoramicElement['type']>(
  elements: PanoramicElement[] | undefined,
  type: T,
  acc: Array<Extract<PanoramicElement, { type: T }>> = [],
): Array<Extract<PanoramicElement, { type: T }>> {
  for (const element of elements ?? []) {
    if (element.type === type) {
      acc.push(element as Extract<PanoramicElement, { type: T }>);
    }
    if (element.type === 'group') {
      collectPanoramicElementsByType(element.children as PanoramicElement[] | undefined, type, acc);
    }
  }
  return acc;
}

function groupStructureSignature(group: Extract<PanoramicElement, { type: 'group' }>): string {
  const counts = new Map<string, number>();
  for (const child of group.children ?? []) {
    counts.set(child.type, (counts.get(child.type) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([type, count]) => `${type}:${count}`)
    .join('|');
}

function bucket(value: number, size: number): string {
  return `${Math.round(value / size) * size}`;
}

function assessStructureSpecificity(config: AppframeConfig): StructureAssessment {
  if (config.mode === 'panoramic') {
    const elements = config.panoramic?.elements;
    const groups = collectPanoramicElementsByType(elements, 'group').length;
    const badges = collectPanoramicElementsByType(elements, 'badge').length;
    const proofChips = collectPanoramicElementsByType(elements, 'proof-chip').length;
    const cards = collectPanoramicElementsByType(elements, 'card').length;
    const crops = collectPanoramicElementsByType(elements, 'crop').length;
    const devices = collectPanoramicElementsByType(elements, 'device');
    const groupSignatures = collectPanoramicElementsByType(elements, 'group').map(groupStructureSignature);
    const uniqueGroupSignatureCount = new Set(groupSignatures).size;
    const dominantGroupSignatureCount = groupSignatures.reduce((best, signature) => {
      const count = groupSignatures.filter((value) => value === signature).length;
      return Math.max(best, count);
    }, 0);
    const layerCount = config.panoramic?.background.layers?.length ?? 0;
    const rhythmSignature = devices
      .slice(0, 4)
      .map((device) => `${bucket(device.x, 4)}-${bucket(device.width, 2)}`)
      .join('.');
    const uniqueRhythmCount = new Set(
      devices.map((device) => `${bucket(device.x, 4)}-${bucket(device.width, 2)}`),
    ).size;
    const supportSystems = groups + badges + proofChips + cards + crops;
    const score = clamp(
      54
        + Math.min(18, layerCount * 5)
        + Math.min(18, supportSystems * 2)
        + Math.min(12, uniqueRhythmCount * 4)
        + Math.min(12, uniqueGroupSignatureCount * 3)
        + (supportSystems >= 6 ? 6 : 0)
        + (uniqueGroupSignatureCount >= 3 ? 4 : 0)
        - (supportSystems <= 2 ? 14 : 0)
        - (uniqueRhythmCount <= 1 && devices.length >= 3 ? 10 : 0)
        - (dominantGroupSignatureCount >= 3 ? 10 : 0),
      36,
      98,
    );

    return {
      score,
      signature: `panoramic:${Math.min(layerCount, 4)}:${Math.min(supportSystems, 9)}:${Math.min(uniqueGroupSignatureCount, 5)}:${rhythmSignature}`,
      issue:
        supportSystems <= 2
          ? 'the strip relies on too few support systems, so it risks reading like repeated device-plus-headline panels'
          : dominantGroupSignatureCount >= 3
            ? 'too many support groups reuse the same child structure, so the strip still falls into repeated support-card rhythm'
          : uniqueRhythmCount <= 1 && devices.length >= 3
            ? 'device rhythm barely changes across frames, so the panoramic pacing feels generic'
            : null,
      strength:
        supportSystems >= 6 && uniqueRhythmCount >= 3 && uniqueGroupSignatureCount >= 3
          ? 'recipe structure stays specific with distinct support systems, varied support-group shapes, and changing frame rhythm'
          : layerCount >= 3
            ? 'background and support systems create a stronger panoramic recipe identity'
            : null,
    };
  }

  const uniqueCompositions = new Set(config.screens.map((screen) => screen.composition ?? 'single')).size;
  const uniqueLayouts = new Set(config.screens.map((screen) => screen.layout ?? 'center')).size;
  const extraDeviceScreens = config.screens.filter((screen) => (screen.extraDevices?.length ?? 0) > 0).length;
  const loupeScreens = config.screens.filter((screen) => Boolean(screen.loupe)).length;
  const overlayScreens = config.screens.filter((screen) => (screen.overlays?.length ?? 0) > 0).length;
  const score = clamp(
    56
      + (uniqueCompositions * 8)
      + (uniqueLayouts * 4)
      + (extraDeviceScreens * 6)
      + (loupeScreens * 5)
      + (overlayScreens * 4)
      - (uniqueCompositions === 1 && uniqueLayouts === 1 && extraDeviceScreens === 0 && loupeScreens === 0 ? 16 : 0),
    38,
    96,
  );

  return {
    score,
    signature: `individual:${uniqueCompositions}:${uniqueLayouts}:${extraDeviceScreens}:${loupeScreens}:${overlayScreens}`,
    issue:
      uniqueCompositions === 1 && uniqueLayouts === 1 && extraDeviceScreens === 0 && loupeScreens === 0
        ? 'too many screens reuse the same centered-device rhythm, so the concept feels generic'
        : null,
    strength:
      uniqueCompositions >= 2 && (extraDeviceScreens > 0 || loupeScreens > 0 || overlayScreens > 0)
        ? 'screen rhythm varies enough to feel recipe-led instead of template-flat'
        : null,
  };
}

function getLayoutSignature(config: AppframeConfig): string {
  if (config.mode === 'panoramic') {
    const elementTypes = Array.from(collectPanoramicElementTypes(config.panoramic?.elements)).sort();
    const layerCount = config.panoramic?.background.layers?.length ?? 0;
    const frameCount = config.frameCount ?? 0;
    return [
      `frames:${frameCount}`,
      `layers:${Math.min(layerCount, 3)}`,
      `elements:${elementTypes.join('+')}`,
    ].join('|');
  }

  const layouts = Array.from(new Set(config.screens.map((screen) => screen.layout ?? 'center'))).sort();
  const compositions = Array.from(new Set(config.screens.map((screen) => screen.composition ?? 'single'))).sort();
  return [
    `layouts:${layouts.join('+')}`,
    `compositions:${compositions.join('+')}`,
    `screens:${config.screens.length}`,
  ].join('|');
}

function buildConceptProfile(args: {
  id: string;
  name: string;
  config: AppframeConfig;
  previewSummary: PreviewSummary;
}): ConceptProfile {
  const headlineWords = getHeadlineWordStats(args.config);
  const metrics = args.previewSummary.metrics;
  const structureAssessment = assessStructureSpecificity(args.config);

  return {
    id: args.id,
    name: args.name,
    mode: args.config.mode,
    style: args.config.theme.style,
    frameStyle: args.config.frames.style,
    screenCount: args.config.mode === 'panoramic'
      ? args.config.frameCount ?? Math.max(args.config.screens.length, 1)
      : args.config.screens.length,
    roundedFrameless: usesRoundedFrameless(args.config),
    averageWords: headlineWords.average,
    layoutSignature: getLayoutSignature(args.config),
    structureSignature: structureAssessment.signature,
    recipeSpecificity: structureAssessment.score,
    visualSignature: metrics
      ? {
          contrast: metrics.contrastScore,
          textZoneSafety: metrics.textZoneSafetyScore,
          whitespaceBalance: metrics.emptySpaceBalanceScore,
          clutterControl: metrics.clutterControlScore,
          continuityQuality: metrics.continuityScore,
          edgeDensity: metrics.edgeDensity,
          emptySpaceRatio: metrics.emptySpaceRatio,
        }
      : null,
  };
}

function pushUnique(target: string[], value: string): void {
  if (!target.includes(value)) target.push(value);
}

function addCategoricalDistance(
  left: string | number | boolean,
  right: string | number | boolean,
  weight: number,
  overlapLabel: string,
  state: { weightedDistance: number; totalWeight: number; overlaps: string[] },
): void {
  state.totalWeight += weight;
  if (left === right) {
    pushUnique(state.overlaps, overlapLabel);
    return;
  }
  state.weightedDistance += weight;
}

function addNumericDistance(
  left: number,
  right: number,
  maxDifference: number,
  weight: number,
  overlapLabel: string,
  state: { weightedDistance: number; totalWeight: number; overlaps: string[] },
): void {
  state.totalWeight += weight;
  const difference = clamp(Math.abs(left - right) / maxDifference, 0, 1);
  state.weightedDistance += difference * weight;
  if (difference <= 0.14) {
    pushUnique(state.overlaps, overlapLabel);
  }
}

function compareConceptProfiles(left: ConceptProfile, right: ConceptProfile): PairwiseComparison {
  const state = {
    weightedDistance: 0,
    totalWeight: 0,
    overlaps: [] as string[],
  };

  addCategoricalDistance(left.mode, right.mode, 0.22, 'presentation mode', state);
  addCategoricalDistance(left.style, right.style, 0.18, 'theme style', state);
  addCategoricalDistance(left.frameStyle, right.frameStyle, 0.08, 'frame treatment', state);
  addCategoricalDistance(left.roundedFrameless, right.roundedFrameless, 0.05, 'frameless corner treatment', state);
  addCategoricalDistance(left.layoutSignature, right.layoutSignature, 0.16, left.mode === 'panoramic' ? 'panoramic structure' : 'screen layout rhythm', state);
  addCategoricalDistance(left.structureSignature, right.structureSignature, 0.08, 'recipe structure', state);
  addNumericDistance(left.screenCount, right.screenCount, 6, 0.08, 'screen count', state);
  addNumericDistance(left.averageWords, right.averageWords, 8, 0.08, 'copy pacing', state);
  addNumericDistance(left.recipeSpecificity, right.recipeSpecificity, 100, 0.06, 'recipe specificity', state);

  if (left.visualSignature && right.visualSignature) {
    addNumericDistance(left.visualSignature.contrast, right.visualSignature.contrast, 100, 0.05, 'contrast profile', state);
    addNumericDistance(left.visualSignature.textZoneSafety, right.visualSignature.textZoneSafety, 100, 0.05, 'text-zone spacing', state);
    addNumericDistance(left.visualSignature.whitespaceBalance, right.visualSignature.whitespaceBalance, 100, 0.03, 'whitespace balance', state);
    addNumericDistance(left.visualSignature.clutterControl, right.visualSignature.clutterControl, 100, 0.04, 'visual density', state);
    addNumericDistance(left.visualSignature.edgeDensity, right.visualSignature.edgeDensity, 0.35, 0.03, 'edge density', state);
    addNumericDistance(left.visualSignature.emptySpaceRatio, right.visualSignature.emptySpaceRatio, 0.6, 0.03, 'empty-space ratio', state);
    if (left.mode === 'panoramic' && right.mode === 'panoramic') {
      addNumericDistance(
        left.visualSignature.continuityQuality,
        right.visualSignature.continuityQuality,
        100,
        0.06,
        'panoramic continuity',
        state,
      );
    }
  }

  return {
    distance: state.totalWeight > 0 ? state.weightedDistance / state.totalWeight : 0,
    overlaps: state.overlaps,
  };
}

function describeOverlap(overlaps: string[]): string {
  const unique = Array.from(new Set(overlaps)).slice(0, 3);
  return unique.length > 0 ? listJoin(unique) : 'overall presentation';
}

function assessConceptDiversity(profile: ConceptProfile, profiles: ConceptProfile[]): ConceptDiversityAssessment {
  const comparisons = profiles
    .filter((other) => other.id !== profile.id)
    .map((other) => ({ other, comparison: compareConceptProfiles(profile, other) }));

  if (comparisons.length === 0) {
    return {
      score: 92,
      nearestVariantId: null,
      nearestVariantName: null,
      nearestDistance: 1,
      averageDistance: 1,
      issue: null,
      strength: 'it is the only concept in the set',
    };
  }

  const nearest = comparisons.reduce((best, current) => (
    current.comparison.distance < best.comparison.distance ? current : best
  ));
  const averageDistance = comparisons.reduce((sum, entry) => sum + entry.comparison.distance, 0) / comparisons.length;
  const nearestDistance = nearest.comparison.distance;
  const score = clamp(Math.round(46 + (averageDistance * 26) + (nearestDistance * 34)), 38, 96);

  let issue: string | null = null;
  let strength: string | null = null;

  if (nearestDistance < 0.3) {
    issue = `it sits too close to ${nearest.other.name} on ${describeOverlap(nearest.comparison.overlaps)}`;
  } else if (nearestDistance < 0.44) {
    issue = `it still overlaps a bit with ${nearest.other.name} on ${describeOverlap(nearest.comparison.overlaps)}`;
  }

  if (averageDistance >= 0.6) {
    strength = 'it stays visually distinct from the rest of the set';
  } else if (nearestDistance >= 0.48) {
    strength = 'it avoids crowding the nearest competing concept';
  }

  return {
    score,
    nearestVariantId: nearest.other.id,
    nearestVariantName: nearest.other.name,
    nearestDistance,
    averageDistance,
    issue,
    strength,
  };
}

function normalizeModelRanking(
  signal: ModelAssistedVisualRanking | undefined,
  variantCount: number,
): NormalizedModelRanking | null {
  if (!signal) return null;

  const rankedScore = typeof signal.rank === 'number' && Number.isFinite(signal.rank)
    ? variantCount <= 1
      ? 100
      : clamp(100 - (((signal.rank - 1) / Math.max(variantCount - 1, 1)) * 50), 50, 100)
    : null;
  const directScore = typeof signal.score === 'number' && Number.isFinite(signal.score)
    ? clamp(signal.score, 0, 100)
    : null;

  const score = directScore !== null && rankedScore !== null
    ? Math.round((directScore * 0.75) + (rankedScore * 0.25))
    : Math.round(directScore ?? rankedScore ?? 70);
  const confidence = clamp(signal.confidence ?? 0.7, 0.35, 1);

  return {
    score,
    confidence,
    rank: typeof signal.rank === 'number' && Number.isFinite(signal.rank) ? signal.rank : undefined,
    reason: typeof signal.reason === 'string' && signal.reason.trim().length > 0 ? signal.reason.trim() : undefined,
  };
}

function getPngStride(width: number, colorType: number): number {
  switch (colorType) {
    case 0:
      return width;
    case 2:
      return width * 3;
    case 6:
      return width * 4;
    default:
      throw new Error(`Unsupported PNG color type: ${colorType}`);
  }
}

function paethPredictor(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(filePath: string): DecodedPng {
  const source = readFileSync(filePath);
  const pngSignature = '89504e470d0a1a0a';

  if (source.subarray(0, 8).toString('hex') !== pngSignature) {
    throw new Error(`Unsupported preview format for ${filePath}. Expected PNG.`);
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatParts: Buffer[] = [];

  while (offset < source.length) {
    const length = source.readUInt32BE(offset);
    offset += 4;
    const type = source.subarray(offset, offset + 4).toString('ascii');
    offset += 4;
    const chunk = source.subarray(offset, offset + length);
    offset += length + 4;

    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8] ?? 0;
      colorType = chunk[9] ?? 0;
      const interlace = chunk[12] ?? 0;
      if (bitDepth !== 8) {
        throw new Error(`Unsupported PNG bit depth ${bitDepth} for ${filePath}.`);
      }
      if (interlace !== 0) {
        throw new Error(`Unsupported interlaced PNG for ${filePath}.`);
      }
    } else if (type === 'IDAT') {
      idatParts.push(chunk);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (width <= 0 || height <= 0) {
    throw new Error(`PNG ${filePath} is missing a valid IHDR chunk.`);
  }

  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : 0;
  if (bytesPerPixel === 0) {
    throw new Error(`Unsupported PNG color type ${colorType} for ${filePath}.`);
  }

  const inflated = inflateSync(Buffer.concat(idatParts));
  const stride = getPngStride(width, colorType);
  const expectedLength = height * (stride + 1);
  if (inflated.length < expectedLength) {
    throw new Error(`PNG ${filePath} is truncated.`);
  }

  const unfiltered = Buffer.alloc(stride * height);
  let inOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inOffset] ?? 0;
    inOffset += 1;
    const rowStart = y * stride;
    const prevRowStart = (y - 1) * stride;

    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[inOffset + x] ?? 0;
      const left = x >= bytesPerPixel ? unfiltered[rowStart + x - bytesPerPixel] ?? 0 : 0;
      const up = y > 0 ? unfiltered[prevRowStart + x] ?? 0 : 0;
      const upLeft = y > 0 && x >= bytesPerPixel
        ? unfiltered[prevRowStart + x - bytesPerPixel] ?? 0
        : 0;

      switch (filter) {
        case 0:
          unfiltered[rowStart + x] = raw;
          break;
        case 1:
          unfiltered[rowStart + x] = (raw + left) & 0xff;
          break;
        case 2:
          unfiltered[rowStart + x] = (raw + up) & 0xff;
          break;
        case 3:
          unfiltered[rowStart + x] = (raw + Math.floor((left + up) / 2)) & 0xff;
          break;
        case 4:
          unfiltered[rowStart + x] = (raw + paethPredictor(left, up, upLeft)) & 0xff;
          break;
        default:
          throw new Error(`Unsupported PNG filter type ${filter} for ${filePath}.`);
      }
    }

    inOffset += stride;
  }

  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0, out = 0; i < unfiltered.length; i += bytesPerPixel, out += 4) {
    if (colorType === 6) {
      rgba[out] = unfiltered[i] ?? 0;
      rgba[out + 1] = unfiltered[i + 1] ?? 0;
      rgba[out + 2] = unfiltered[i + 2] ?? 0;
      rgba[out + 3] = unfiltered[i + 3] ?? 255;
    } else if (colorType === 2) {
      rgba[out] = unfiltered[i] ?? 0;
      rgba[out + 1] = unfiltered[i + 1] ?? 0;
      rgba[out + 2] = unfiltered[i + 2] ?? 0;
      rgba[out + 3] = 255;
    } else {
      const value = unfiltered[i] ?? 0;
      rgba[out] = value;
      rgba[out + 1] = value;
      rgba[out + 2] = value;
      rgba[out + 3] = 255;
    }
  }

  return { width, height, data: rgba };
}

function percentileFromHistogram(histogram: number[], total: number, percentile: number): number {
  const target = total * percentile;
  let seen = 0;
  for (let index = 0; index < histogram.length; index += 1) {
    seen += histogram[index] ?? 0;
    if (seen >= target) return index;
  }
  return histogram.length - 1;
}

function analyzePreviewImage(args: {
  filePath: string;
  mode: AppframeConfig['mode'];
  frameCount: number;
}): PreviewImageMetrics {
  const image = decodePng(args.filePath);
  const blockColumns = 12;
  const blockRows = 12;
  const topBandLimit = Math.max(1, Math.floor(image.height * 0.32));
  const step = Math.max(1, Math.floor(Math.sqrt((image.width * image.height) / 250_000)));

  const histogram = new Array<number>(256).fill(0);
  const blockEdgeCounts = new Array<number>(blockColumns * blockRows).fill(0);
  const blockEdgeComparisons = new Array<number>(blockColumns * blockRows).fill(0);
  let sampleCount = 0;
  let luminanceSum = 0;
  let luminanceSquaredSum = 0;
  let edgeCount = 0;
  let edgeComparisons = 0;
  let topEdgeCount = 0;
  let topEdgeComparisons = 0;

  const luminanceAt = (x: number, y: number): number => {
    const index = (y * image.width + x) * 4;
    const r = image.data[index] ?? 0;
    const g = image.data[index + 1] ?? 0;
    const b = image.data[index + 2] ?? 0;
    return Math.round((0.2126 * r) + (0.7152 * g) + (0.0722 * b));
  };

  for (let y = 0; y < image.height; y += step) {
    for (let x = 0; x < image.width; x += step) {
      const luminance = luminanceAt(x, y);
      histogram[luminance] = (histogram[luminance] ?? 0) + 1;
      sampleCount += 1;
      luminanceSum += luminance;
      luminanceSquaredSum += luminance * luminance;

      if (x + step < image.width) {
        const horizontalDifference = Math.abs(luminance - luminanceAt(x + step, y));
        const blockIndex = Math.min(blockRows - 1, Math.floor((y / image.height) * blockRows)) * blockColumns
          + Math.min(blockColumns - 1, Math.floor((x / image.width) * blockColumns));
        blockEdgeComparisons[blockIndex] = (blockEdgeComparisons[blockIndex] ?? 0) + 1;
        edgeComparisons += 1;
        if (horizontalDifference >= 24) {
          blockEdgeCounts[blockIndex] = (blockEdgeCounts[blockIndex] ?? 0) + 1;
          edgeCount += 1;
        }
        if (y < topBandLimit) {
          topEdgeComparisons += 1;
          if (horizontalDifference >= 24) topEdgeCount += 1;
        }
      }
    }
  }

  const luminanceMean = sampleCount > 0 ? luminanceSum / sampleCount : 0;
  const luminanceStd = sampleCount > 0
    ? Math.sqrt(Math.max(0, (luminanceSquaredSum / sampleCount) - (luminanceMean ** 2)))
    : 0;
  const p05 = percentileFromHistogram(histogram, sampleCount, 0.05);
  const p95 = percentileFromHistogram(histogram, sampleCount, 0.95);
  const dynamicRange = p95 - p05;
  const edgeDensity = edgeComparisons > 0 ? edgeCount / edgeComparisons : 0;
  const topEdgeDensity = topEdgeComparisons > 0 ? topEdgeCount / topEdgeComparisons : edgeDensity;

  const blockEdgeDensities = blockEdgeCounts.map((count, index) => {
    const comparisons = blockEdgeComparisons[index] ?? 0;
    return comparisons > 0 ? count / comparisons : 0;
  });
  const emptySpaceRatio = blockEdgeDensities.filter((density) => density < 0.03).length / blockEdgeDensities.length;

  const topRows = Math.max(1, Math.round(blockRows * 0.33));
  let topQuietBlocks = 0;
  let topBlockCount = 0;
  for (let row = 0; row < topRows; row += 1) {
    for (let column = 0; column < blockColumns; column += 1) {
      topBlockCount += 1;
      if ((blockEdgeDensities[row * blockColumns + column] ?? 0) < 0.03) {
        topQuietBlocks += 1;
      }
    }
  }
  const topQuietRatio = topBlockCount > 0 ? topQuietBlocks / topBlockCount : 0;

  let seamDifference: number | null = null;
  if (args.mode === 'panoramic' && args.frameCount > 1) {
    const seamDifferences: number[] = [];
    for (let seam = 1; seam < args.frameCount; seam += 1) {
      const seamX = Math.round((image.width * seam) / args.frameCount);
      if (seamX <= 2 || seamX >= image.width - 2) continue;

      let seamSamples = 0;
      let seamTotal = 0;
      for (let y = 0; y < image.height; y += Math.max(1, step * 2)) {
        seamSamples += 1;
        seamTotal += Math.abs(luminanceAt(seamX - 1, y) - luminanceAt(seamX + 1, y)) / 255;
      }
      if (seamSamples > 0) {
        seamDifferences.push(seamTotal / seamSamples);
      }
    }
    seamDifference = seamDifferences.length > 0
      ? seamDifferences.reduce((sum, value) => sum + value, 0) / seamDifferences.length
      : null;
  }

  const contrastScore = clamp(20 + (dynamicRange * 0.3) + (luminanceStd * 0.6), 35, 98);
  const textZoneSafetyScore = clamp(35 + (topQuietRatio * 110) - (topEdgeDensity * 80), 25, 98);
  const emptyTarget = args.mode === 'panoramic' ? 0.18 : 0.22;
  const emptySpaceBalanceScore = clamp(100 - (Math.abs(emptySpaceRatio - emptyTarget) * 170), 35, 98);
  const clutterTarget = args.mode === 'panoramic' ? 0.1 : 0.08;
  const clutterControlScore = clamp(100 - (Math.abs(edgeDensity - clutterTarget) * 280), 35, 98);
  const continuityScore = args.mode === 'panoramic'
    ? clamp(100 - ((seamDifference ?? 0.18) * 220), 40, 98)
    : 88;

  return {
    format: 'png',
    width: image.width,
    height: image.height,
    contrastScore: Math.round(contrastScore),
    textZoneSafetyScore: Math.round(textZoneSafetyScore),
    emptySpaceBalanceScore: Math.round(emptySpaceBalanceScore),
    clutterControlScore: Math.round(clutterControlScore),
    continuityScore: Math.round(continuityScore),
    edgeDensity,
    topEdgeDensity,
    emptySpaceRatio,
    topQuietRatio,
    seamDifference,
  };
}

function summarizePreviewMetrics(args: {
  filePaths: string[];
  config: AppframeConfig;
}): PreviewSummary {
  if (args.filePaths.length === 0) {
    return { metrics: null, flags: ['Preview artifacts have not been generated yet.'] };
  }

  const flags: string[] = [];
  const metricsList: PreviewImageMetrics[] = [];

  for (const filePath of args.filePaths) {
    try {
      metricsList.push(analyzePreviewImage({
        filePath,
        mode: args.config.mode,
        frameCount: args.config.frameCount ?? Math.max(args.config.screens.length, 1),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      flags.push(`Could not analyze rendered preview ${filePath}: ${message}`);
    }
  }

  if (metricsList.length === 0) {
    return { metrics: null, flags };
  }

  const averageMetric = <T extends number>(selector: (metrics: PreviewImageMetrics) => T): number => (
    metricsList.reduce((sum, metrics) => sum + selector(metrics), 0) / metricsList.length
  );

  return {
    metrics: {
      format: 'png',
      width: Math.round(averageMetric((metrics) => metrics.width)),
      height: Math.round(averageMetric((metrics) => metrics.height)),
      contrastScore: Math.round(averageMetric((metrics) => metrics.contrastScore)),
      textZoneSafetyScore: Math.round(averageMetric((metrics) => metrics.textZoneSafetyScore)),
      emptySpaceBalanceScore: Math.round(averageMetric((metrics) => metrics.emptySpaceBalanceScore)),
      clutterControlScore: Math.round(averageMetric((metrics) => metrics.clutterControlScore)),
      continuityScore: Math.round(averageMetric((metrics) => metrics.continuityScore)),
      edgeDensity: averageMetric((metrics) => metrics.edgeDensity),
      topEdgeDensity: averageMetric((metrics) => metrics.topEdgeDensity),
      emptySpaceRatio: averageMetric((metrics) => metrics.emptySpaceRatio),
      topQuietRatio: averageMetric((metrics) => metrics.topQuietRatio),
      seamDifference: args.config.mode === 'panoramic'
        ? averageMetric((metrics) => metrics.seamDifference ?? 0.18)
        : null,
    },
    flags,
  };
}

function buildScore(args: {
  config: AppframeConfig;
  previewCount: number;
  previewSummary: PreviewSummary;
  diversity: ConceptDiversityAssessment;
  modelRanking: NormalizedModelRanking | null;
}): VariantScore {
  const { config, previewCount, previewSummary, diversity, modelRanking } = args;
  const flags = [...previewSummary.flags];
  const wordStats = getHeadlineWordStats(config);
  const roundedFrameless = usesRoundedFrameless(config);
  const structureAssessment = assessStructureSpecificity(config);

  const thumbnailReadability = clamp(100 - Math.abs(4 - wordStats.average) * 12, 35, 100);
  const configTextCollisionRisk = clamp(
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
  const conceptDiversity = diversity.score;

  const renderedContrast = previewSummary.metrics?.contrastScore ?? 56;
  const renderedTextZoneSafety = previewSummary.metrics?.textZoneSafetyScore ?? 52;
  const renderedWhitespaceBalance = previewSummary.metrics?.emptySpaceBalanceScore ?? 58;
  const renderedClutterControl = previewSummary.metrics?.clutterControlScore ?? 56;
  const renderedContinuityQuality = previewSummary.metrics?.continuityScore ?? (config.mode === 'panoramic' ? 58 : 88);

  const baseBreakdown: Record<string, number> = {
    thumbnailReadability: Math.round(thumbnailReadability),
    textCollisionRisk: Math.round(configTextCollisionRisk),
    hierarchyClarity: Math.round(hierarchyClarity),
    brandFit: Math.round(brandFit),
    conceptDiversity: Math.round(conceptDiversity),
    screenshotUsageQuality: Math.round(screenshotUsageQuality),
    narrativeSequencing: Math.round(narrativeSequencing),
    recipeSpecificity: Math.round(structureAssessment.score),
    previewReadiness: Math.round(previewReadiness),
    renderedContrast,
    renderedTextZoneSafety,
    renderedWhitespaceBalance,
    renderedClutterControl,
    renderedContinuityQuality,
  };

  const heuristicTotal = Math.round(
    Object.values(baseBreakdown).reduce((sum, value) => sum + value, 0) / Object.keys(baseBreakdown).length,
  );

  const breakdown = modelRanking
    ? {
        ...baseBreakdown,
        modelVisualRanking: modelRanking.score,
      }
    : baseBreakdown;

  const total = modelRanking
    ? Math.round((heuristicTotal * (1 - (0.12 + (modelRanking.confidence * 0.18)))) + (modelRanking.score * (0.12 + (modelRanking.confidence * 0.18))))
    : heuristicTotal;

  if (wordStats.average < 3) {
    flags.push(`Headline copy averages ${formatNumber(wordStats.average)} words, which is short for a clear thumbnail hook.`);
  } else if (wordStats.average > 5.5) {
    flags.push(`Headline copy averages ${formatNumber(wordStats.average)} words, which is dense for thumbnail reading.`);
  }
  if (wordStats.max - wordStats.min >= 3) {
    flags.push(`Copy pacing swings from ${wordStats.min} to ${wordStats.max} words across the concept.`);
  }
  if (!roundedFrameless) {
    flags.push('Frameless treatment should use rounded corners.');
  }
  if (structureAssessment.issue) {
    flags.push(`Recipe structure is generic: ${structureAssessment.issue}.`);
  }
  if (diversity.issue) {
    flags.push(`Concept diversity is weak: ${diversity.issue}.`);
  }
  if (previewSummary.metrics) {
    const emptyTarget = config.mode === 'panoramic' ? 0.18 : 0.22;
    const clutterTarget = config.mode === 'panoramic' ? 0.1 : 0.08;

    if (previewSummary.metrics.contrastScore < 65) {
      flags.push(`Rendered contrast is soft (${previewSummary.metrics.contrastScore}/100), so the concept may read flat at thumbnail size.`);
    }
    if (previewSummary.metrics.textZoneSafetyScore < 62) {
      flags.push(`Top headline space is busy with only ${formatPercent(previewSummary.metrics.topQuietRatio)} quiet blocks in the text band.`);
    }
    if (previewSummary.metrics.emptySpaceBalanceScore < 60) {
      const direction = previewSummary.metrics.emptySpaceRatio < emptyTarget ? 'crowded' : 'too sparse';
      flags.push(
        `Layout feels ${direction}: empty-space ratio is ${formatPercent(previewSummary.metrics.emptySpaceRatio)} versus the ${formatPercent(emptyTarget)} target.`,
      );
    }
    if (previewSummary.metrics.clutterControlScore < 60) {
      const direction = previewSummary.metrics.edgeDensity > clutterTarget ? 'too dense' : 'too loose';
      flags.push(`Rendered density is ${direction} at ${formatPercent(previewSummary.metrics.edgeDensity)} edge coverage.`);
    }
    if (config.mode === 'panoramic' && previewSummary.metrics.continuityScore < 64) {
      flags.push(
        `Panoramic seams shift abruptly with an average seam delta of ${formatNumber(previewSummary.metrics.seamDifference ?? 0.18, 2)}.`,
      );
    }
  }
  if (modelRanking?.reason) {
    flags.push(`Visual model note: ${modelRanking.reason}`);
  }

  const highlights: string[] = [];
  const issues: string[] = [];

  if (renderedContrast >= 78) highlights.push(`contrast stays strong at ${renderedContrast}/100`);
  else if (renderedContrast < 65) issues.push(`contrast drops to ${renderedContrast}/100`);

  if (previewSummary.metrics && renderedTextZoneSafety >= 76) {
    highlights.push(`the headline band stays clear with ${formatPercent(previewSummary.metrics.topQuietRatio)} quiet blocks`);
  } else if (previewSummary.metrics && renderedTextZoneSafety < 62) {
    issues.push(`the headline band stays noisy with only ${formatPercent(previewSummary.metrics.topQuietRatio)} quiet blocks`);
  }

  if (previewSummary.metrics && renderedWhitespaceBalance >= 74) {
    highlights.push(`spacing lands near the target at ${formatPercent(previewSummary.metrics.emptySpaceRatio)} empty area`);
  } else if (previewSummary.metrics && renderedWhitespaceBalance < 60) {
    issues.push(`spacing drifts to ${formatPercent(previewSummary.metrics.emptySpaceRatio)} empty area`);
  }

  if (renderedClutterControl >= 74) highlights.push(`visual density stays controlled at ${formatPercent(previewSummary.metrics?.edgeDensity ?? 0)}`);
  else if (renderedClutterControl < 60) issues.push(`visual density lands at ${formatPercent(previewSummary.metrics?.edgeDensity ?? 0)}`);

  if (config.mode === 'panoramic') {
    if (previewSummary.metrics && renderedContinuityQuality >= 74) {
      highlights.push(`panoramic seams stay smooth across frames`);
    } else if (previewSummary.metrics && renderedContinuityQuality < 64) {
      issues.push(`panoramic seams break with a ${formatNumber(previewSummary.metrics.seamDifference ?? 0.18, 2)} luminance delta`);
    }
  } else if (hierarchyClarity >= 86) {
    highlights.push('the single-screen hierarchy stays easy to scan');
  }

  if (wordStats.average < 3) {
    issues.push(`headline copy runs short at ${formatNumber(wordStats.average)} words`);
  } else if (wordStats.average > 5.5) {
    issues.push(`headline copy runs long at ${formatNumber(wordStats.average)} words`);
  }

  if (wordStats.max - wordStats.min >= 3) {
    issues.push(`copy pacing jumps from ${wordStats.min} to ${wordStats.max} words`);
  }

  if (structureAssessment.strength) highlights.push(structureAssessment.strength);
  if (structureAssessment.issue) issues.push(structureAssessment.issue);
  if (diversity.strength) highlights.push(diversity.strength);
  if (diversity.issue) issues.push(diversity.issue);

  if (modelRanking?.reason) {
    highlights.push(`the visual model favored it for ${modelRanking.reason.toLowerCase()}`);
  }

  const positiveSummary = highlights.slice(0, 2);
  const copyIssues = issues.filter((issue) => issue.includes('headline copy') || issue.includes('copy pacing'));
  const layoutIssues = issues.filter((issue) => !copyIssues.includes(issue));
  const issueSummary = Array.from(new Set(
    copyIssues.length > 0 && layoutIssues.length > 0
      ? [layoutIssues[0], copyIssues[0]]
      : issues.slice(0, 2),
  )).filter((value): value is string => typeof value === 'string');
  const reasonLead = positiveSummary.length > 0
    ? `${positiveSummary[0]}${positiveSummary[1] ? ` and ${positiveSummary[1]}` : ''}`
    : 'baseline layout heuristics hold together';
  const reasonTail = issueSummary.length > 0
    ? `, but ${issueSummary[0]}${issueSummary[1] ? ` and ${issueSummary[1]}` : ''}`
    : '';

  return {
    total,
    breakdown,
    flags,
    reason: `${reasonLead}${reasonTail}.`,
    highlights,
    issues,
    modelRanking: modelRanking
      ? {
          ...modelRanking,
          source: 'visual-model',
        }
      : undefined,
  };
}

export function scoreVariantSet(
  variants: Array<{
    id: string;
    name: string;
    config: AppframeConfig;
    previewCount?: number;
    previewFilePaths?: string[];
  }>,
  options?: {
    visualRanking?: ModelAssistedVisualRanking[];
  },
): {
  scored: ScoredVariant[];
  recommendedVariantId: string | null;
  recommendationReason: string | null;
} {
  const previews = variants.map((variant) => ({
    ...variant,
    previewSummary: summarizePreviewMetrics({
      filePaths: variant.previewFilePaths ?? [],
      config: variant.config,
    }),
  }));
  const profiles = previews.map((variant) => buildConceptProfile({
    id: variant.id,
    name: variant.name,
    config: variant.config,
    previewSummary: variant.previewSummary,
  }));
  const rankingByVariantId = new Map(
    (options?.visualRanking ?? []).map((entry) => [entry.variantId, entry]),
  );

  const scored = previews
    .map((variant) => {
      const diversity = assessConceptDiversity(
        profiles.find((profile) => profile.id === variant.id)!,
        profiles,
      );
      const modelRanking = normalizeModelRanking(rankingByVariantId.get(variant.id), variants.length);

      return {
        id: variant.id,
        name: variant.name,
        score: buildScore({
          config: variant.config,
          previewCount: variant.previewCount ?? 0,
          previewSummary: variant.previewSummary,
          diversity,
          modelRanking,
        }),
      };
    })
    .sort((left, right) => right.score.total - left.score.total);

  const top = scored[0];
  const usedModelRanking = Boolean(options?.visualRanking?.length);

  return {
    scored,
    recommendedVariantId: top?.id ?? null,
    recommendationReason: top
      ? `${top.name} leads on ${usedModelRanking ? 'blended heuristic and visual-model ranking' : 'rendered-preview and layout heuristics'}: ${top.score.reason}`
      : null,
  };
}
