import { basename, extname } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

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

export interface FocalPoint {
  x: number;
  y: number;
  strength: number;
}

export interface ScreenshotPixelMetrics {
  source: 'png' | 'heuristic';
  edgeDensity: number;
  topQuietRatio: number;
  quietZoneCoverage: number;
  focusStrength: number;
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
  focalPoint?: FocalPoint;
  pixelMetrics?: ScreenshotPixelMetrics;
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

export interface CopyPlanningSignal {
  slot: 'hero' | 'differentiator' | 'feature' | 'trust' | 'summary';
  path: string;
  role: ScreenshotRole;
  density: ScreenshotDensity;
  focus: string;
  unsafeForTextOverlay: boolean;
  topQuietRatio: number;
  focusStrength: number;
}

export interface PlannedIndividualScreen {
  index: number;
  sourcePath: string;
  sourceRole: ScreenshotRole;
  slideRole: string;
  layout: 'center' | 'angled-left' | 'angled-right';
  composition: 'single' | 'duo-overlap' | 'duo-split' | 'hero-tilt' | 'fanned-cards';
  extraScreenshots?: string[];
  backgroundStrategy: string;
  copyDirection: string;
  framing: 'framed' | 'frameless-rounded';
  dominantPalette?: string[];
  focalPoint?: FocalPoint;
  implementationNote?: string;
}

export interface PlannedPanoramicFrame {
  frame: number;
  sourcePath: string;
  sourceRole: ScreenshotRole;
  dominantPalette?: string[];
  focalPoint?: FocalPoint;
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
  topQuietRatio?: number;
  focusStrength?: number;
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

  if (typeof args.topQuietRatio === 'number') {
    if (args.topQuietRatio >= 0.68) {
      reasons.push('Pixel analysis found a quiet top band that can hold overlay copy.');
    } else if (args.topQuietRatio <= 0.42) {
      reasons.push('Pixel analysis found a busy top band, which lowers hero flexibility.');
    }
  }

  if (typeof args.focusStrength === 'number' && args.focusStrength >= 0.5) {
    reasons.push('The screenshot has a strong focal region for tighter crops or supporting detail treatments.');
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

interface DecodedPng {
  width: number;
  height: number;
  data: Uint8Array;
}

interface RasterSignals {
  dominantPalette: string[];
  safeTextZones: SafeTextZone[];
  focalPoint: FocalPoint;
  density: ScreenshotDensity;
  textRisk: TextRisk;
  cropSuitability: CropSuitability;
  unsafeForTextOverlay: boolean;
  heroPriorityAdjustment: number;
  pixelMetrics: ScreenshotPixelMetrics;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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

function decodePngBuffer(buffer: Buffer): DecodedPng | null {
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    return null;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatParts: Buffer[] = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.subarray(offset, offset + 4).toString('ascii');
    offset += 4;
    const chunk = buffer.subarray(offset, offset + length);
    offset += length + 4;

    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8] ?? 0;
      colorType = chunk[9] ?? 0;
      const interlace = chunk[12] ?? 0;
      if (bitDepth !== 8 || interlace !== 0) return null;
    } else if (type === 'IDAT') {
      idatParts.push(chunk);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (width <= 0 || height <= 0) return null;
  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : 0;
  if (bytesPerPixel === 0) return null;

  const inflated = inflateSync(Buffer.concat(idatParts));
  const stride = getPngStride(width, colorType);
  if (inflated.length < height * (stride + 1)) return null;

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
          return null;
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

function quantizeColor(channel: number): number {
  return Math.round(channel / 32) * 32;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => clamp(value, 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

function colorSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function zoneCandidates(): SafeTextZone[] {
  return [
    { x: 6, y: 6, width: 88, height: 20, label: 'top' },
    { x: 6, y: 74, width: 88, height: 16, label: 'bottom' },
    { x: 6, y: 28, width: 24, height: 36, label: 'left' },
    { x: 70, y: 28, width: 24, height: 36, label: 'right' },
    { x: 24, y: 30, width: 52, height: 24, label: 'center' },
  ];
}

function rankZonesByQuietScore(args: {
  blockColumns: number;
  blockRows: number;
  blockDensities: number[];
}): Array<{ zone: SafeTextZone; quietScore: number }> {
  return zoneCandidates().map((zone) => {
    const startColumn = clamp(Math.floor((zone.x / 100) * args.blockColumns), 0, args.blockColumns - 1);
    const endColumn = clamp(Math.ceil(((zone.x + zone.width) / 100) * args.blockColumns), startColumn + 1, args.blockColumns);
    const startRow = clamp(Math.floor((zone.y / 100) * args.blockRows), 0, args.blockRows - 1);
    const endRow = clamp(Math.ceil(((zone.y + zone.height) / 100) * args.blockRows), startRow + 1, args.blockRows);
    let count = 0;
    let total = 0;

    for (let row = startRow; row < endRow; row += 1) {
      for (let column = startColumn; column < endColumn; column += 1) {
        total += args.blockDensities[row * args.blockColumns + column] ?? 0;
        count += 1;
      }
    }

    const averageDensity = count > 0 ? total / count : 1;
    return {
      zone,
      quietScore: clamp(1 - (averageDensity * 6), 0, 1),
    };
  }).sort((left, right) => right.quietScore - left.quietScore);
}

async function analyzeRasterSignals(pathValue: string): Promise<RasterSignals | null> {
  try {
    const buffer = await readFile(pathValue);
    const decoded = decodePngBuffer(buffer);
    if (!decoded) return null;

    const blockColumns = 12;
    const blockRows = 18;
    const step = Math.max(1, Math.floor(Math.sqrt((decoded.width * decoded.height) / 220_000)));
    const blockEdgeCounts = new Array<number>(blockColumns * blockRows).fill(0);
    const blockEdgeComparisons = new Array<number>(blockColumns * blockRows).fill(0);
    const colorCounts = new Map<string, { count: number; r: number; g: number; b: number; saturation: number }>();
    let edgeCount = 0;
    let edgeComparisons = 0;
    let weightedFocusX = 0;
    let focusWeightTotal = 0;

    const luminanceAt = (x: number, y: number): number => {
      const index = (y * decoded.width + x) * 4;
      const r = decoded.data[index] ?? 0;
      const g = decoded.data[index + 1] ?? 0;
      const b = decoded.data[index + 2] ?? 0;
      return Math.round((0.2126 * r) + (0.7152 * g) + (0.0722 * b));
    };

    for (let y = 0; y < decoded.height; y += step) {
      for (let x = 0; x < decoded.width; x += step) {
        const index = (y * decoded.width + x) * 4;
        const r = decoded.data[index] ?? 0;
        const g = decoded.data[index + 1] ?? 0;
        const b = decoded.data[index + 2] ?? 0;
        const alpha = decoded.data[index + 3] ?? 255;
        if (alpha < 16) continue;

        const qR = quantizeColor(r);
        const qG = quantizeColor(g);
        const qB = quantizeColor(b);
        const colorKey = `${qR}-${qG}-${qB}`;
        const saturation = colorSaturation(r, g, b);
        const existing = colorCounts.get(colorKey);
        colorCounts.set(colorKey, {
          count: (existing?.count ?? 0) + 1,
          r: qR,
          g: qG,
          b: qB,
          saturation,
        });

        const blockIndex = Math.min(blockRows - 1, Math.floor((y / decoded.height) * blockRows)) * blockColumns
          + Math.min(blockColumns - 1, Math.floor((x / decoded.width) * blockColumns));
        const luminance = luminanceAt(x, y);

        if (x + step < decoded.width) {
          const difference = Math.abs(luminance - luminanceAt(x + step, y));
          blockEdgeComparisons[blockIndex] = (blockEdgeComparisons[blockIndex] ?? 0) + 1;
          edgeComparisons += 1;
          if (difference >= 22) {
            blockEdgeCounts[blockIndex] = (blockEdgeCounts[blockIndex] ?? 0) + 1;
            edgeCount += 1;
          }
        }
        if (y + step < decoded.height) {
          const difference = Math.abs(luminance - luminanceAt(x, y + step));
          blockEdgeComparisons[blockIndex] = (blockEdgeComparisons[blockIndex] ?? 0) + 1;
          edgeComparisons += 1;
          if (difference >= 22) {
            blockEdgeCounts[blockIndex] = (blockEdgeCounts[blockIndex] ?? 0) + 1;
            edgeCount += 1;
          }
        }
      }
    }

    const blockDensities = blockEdgeCounts.map((count, index) => {
      const comparisons = blockEdgeComparisons[index] ?? 0;
      return comparisons > 0 ? count / comparisons : 0;
    });
    const averageEdgeDensity = edgeComparisons > 0 ? edgeCount / edgeComparisons : 0;
    const focusThreshold = Math.max(averageEdgeDensity * 0.85, 0.03);
    const rowFocusScores = new Array<number>(blockRows).fill(0);

    let maxBlockDensity = 0;
    for (let row = 0; row < blockRows; row += 1) {
      let rowDensitySum = 0;
      let activeColumns = 0;
      for (let column = 0; column < blockColumns; column += 1) {
        const density = blockDensities[row * blockColumns + column] ?? 0;
        const rowCenter = (row + 0.5) / blockRows;
        // Header/status-bar transitions create strong horizontal edges but rarely
        // represent the content users should focus on or crop around.
        const headerSuppression = rowCenter < 0.22 ? 0.28 : 1;
        const weight = (density ** 2) * headerSuppression;
        weightedFocusX += ((column + 0.5) / blockColumns) * weight;
        focusWeightTotal += weight;
        rowDensitySum += density;
        if (density >= focusThreshold) activeColumns += 1;
        if (density > maxBlockDensity) maxBlockDensity = density;
      }
      const rowCenter = (row + 0.5) / blockRows;
      const rowHeaderSuppression = rowCenter < 0.28 ? 0.3 : 1;
      const rowConcentration = clamp(1.18 - ((activeColumns / blockColumns) * 0.8), 0.32, 1.18);
      rowFocusScores[row] = rowDensitySum * rowConcentration * rowHeaderSuppression;
    }

    const zoneScores = rankZonesByQuietScore({
      blockColumns,
      blockRows,
      blockDensities,
    });
    const safeTextZones = zoneScores
      .filter((entry) => entry.quietScore >= 0.56)
      .slice(0, 3)
      .map((entry) => entry.zone);
    const topZoneScore = zoneScores.find((entry) => entry.zone.label === 'top');
    if (
      topZoneScore
      && topZoneScore.quietScore >= 0.5
      && !safeTextZones.some((zone) => zone.label === 'top')
    ) {
      safeTextZones.unshift(topZoneScore.zone);
      if (safeTextZones.length > 3) safeTextZones.length = 3;
    }
    const quietZoneCoverage = zoneScores
      .slice(0, 3)
      .reduce((sum, entry) => sum + entry.quietScore, 0) / Math.max(Math.min(zoneScores.length, 3), 1);
    const topQuietRatio = topZoneScore?.quietScore ?? 0;
    const focusStrength = clamp(
      averageEdgeDensity > 0 ? maxBlockDensity / Math.max(averageEdgeDensity * 2.2, 0.01) : 0,
      0,
      1,
    );

    const dominantPalette = Array.from(colorCounts.values())
      .sort((left, right) => {
        const leftWeight = left.count * (0.8 + left.saturation);
        const rightWeight = right.count * (0.8 + right.saturation);
        return rightWeight - leftWeight;
      })
      .map((entry) => rgbToHex(entry.r, entry.g, entry.b))
      .filter((value, index, list) => list.indexOf(value) === index)
      .slice(0, 3);

    const rowFocusWeightTotal = rowFocusScores.reduce((sum, value) => sum + value, 0);
    const focalPoint: FocalPoint = {
      x: Number((((weightedFocusX / Math.max(focusWeightTotal, 0.0001)) || 0.5) * 100).toFixed(1)),
      y: Number((
        ((rowFocusScores.reduce((sum, score, row) => sum + ((((row + 0.5) / blockRows) * score)), 0)
          / Math.max(rowFocusWeightTotal, 0.0001)) || 0.45) * 100
      ).toFixed(1)),
      strength: Number(focusStrength.toFixed(2)),
    };
    if (topZoneScore && topZoneScore.quietScore >= 0.62) {
      focalPoint.y = Number(Math.max(
        focalPoint.y,
        Math.min(82, topZoneScore.zone.y + topZoneScore.zone.height + 10),
      ).toFixed(1));
    }

    const density: ScreenshotDensity = averageEdgeDensity < 0.07
      ? 'minimal'
      : averageEdgeDensity > 0.14
        ? 'dense'
        : 'balanced';
    const textRisk: TextRisk = topQuietRatio >= 0.68 ? 'low' : topQuietRatio >= 0.48 ? 'medium' : 'high';
    const cropSuitability: CropSuitability = focusStrength >= 0.52
      ? 'high'
      : focusStrength >= 0.3
        ? 'medium'
        : 'low';
    const unsafeForTextOverlay = topQuietRatio < 0.46 || (safeTextZones.length === 0 && density === 'dense');

    let heroPriorityAdjustment = 0;
    if (topQuietRatio >= 0.72) heroPriorityAdjustment += 8;
    else if (topQuietRatio <= 0.42) heroPriorityAdjustment -= 8;
    if (density === 'minimal') heroPriorityAdjustment += 4;
    else if (density === 'dense') heroPriorityAdjustment -= 4;
    if (focusStrength >= 0.48) heroPriorityAdjustment += 3;

    return {
      dominantPalette: dominantPalette.length > 0 ? dominantPalette : ['#F8FAFC', '#94A3B8', '#0F172A'],
      safeTextZones: safeTextZones.length > 0 ? safeTextZones : zoneScores.slice(0, 2).map((entry) => entry.zone),
      focalPoint,
      density,
      textRisk,
      cropSuitability,
      unsafeForTextOverlay,
      heroPriorityAdjustment,
      pixelMetrics: {
        source: 'png',
        edgeDensity: Number(averageEdgeDensity.toFixed(3)),
        topQuietRatio: Number(topQuietRatio.toFixed(2)),
        quietZoneCoverage: Number(quietZoneCoverage.toFixed(2)),
        focusStrength: Number(focusStrength.toFixed(2)),
      },
    };
  } catch {
    return null;
  }
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
      const rasterSignals = await analyzeRasterSignals(input.path);
      const fileStat = await stat(input.path).catch(() => null);
      const role = inferRole(input.path, input.note);
      const inferredDensity = inferDensity(role, input.path, input.note);
      const density = rasterSignals?.density ?? inferredDensity;
      const focus = inferFocus(input.path, input.note, role);
      const inferredCropSuitability = inferCropSuitability(role, density);
      const cropSuitability = rasterSignals
        ? (rasterSignals.cropSuitability === 'high' || inferredCropSuitability === 'high'
            ? 'high'
            : rasterSignals.cropSuitability === 'medium' || inferredCropSuitability === 'medium'
              ? 'medium'
              : 'low')
        : inferredCropSuitability;
      const safeTextZones = rasterSignals?.safeTextZones?.length
        ? rasterSignals.safeTextZones
        : inferSafeTextZones(role, density);
      let heroPriority = computeHeroPriority(
        role,
        density,
        metadata.width,
        metadata.height,
        input.path,
        input.note,
      );
      heroPriority = clamp(heroPriority + (rasterSignals?.heroPriorityAdjustment ?? 0), 0, 100);
      const recommendedUsage = inferRecommendedUsage(role, heroPriority, cropSuitability);
      const textRisk = rasterSignals?.textRisk
        ?? inferTextRisk(density);
      const unsafeForTextOverlay = rasterSignals
        ? (rasterSignals.unsafeForTextOverlay || inferUnsafeForTextOverlay(role, density, safeTextZones))
        : inferUnsafeForTextOverlay(role, density, safeTextZones);

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
        textRisk,
        heroPriority,
        heroExplanation: buildHeroExplanation({
          role,
          density,
          heroPriority,
          width: metadata.width,
          height: metadata.height,
          pathValue: input.path,
          recommendedUsage,
          topQuietRatio: rasterSignals?.pixelMetrics.topQuietRatio,
          focusStrength: rasterSignals?.focalPoint.strength,
        }),
        inferredOrder: null,
        orderingConfidence: 'low' as const,
        orderingReason: [],
        focus,
        dominantPalette: rasterSignals?.dominantPalette ?? inferDominantPalette(role, density),
        safeTextZones,
        focalPoint: rasterSignals?.focalPoint,
        pixelMetrics: rasterSignals?.pixelMetrics ?? {
          source: 'heuristic',
          edgeDensity: density === 'dense' ? 0.16 : density === 'minimal' ? 0.05 : 0.1,
          topQuietRatio: density === 'minimal' ? 0.72 : density === 'dense' ? 0.34 : 0.55,
          quietZoneCoverage: safeTextZones.length > 1 ? 0.6 : 0.42,
          focusStrength: cropSuitability === 'high' ? 0.55 : cropSuitability === 'medium' ? 0.36 : 0.22,
        },
        cropSuitability,
        recommendedUsage,
        unsafeForTextOverlay,
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

function sortAnalysesByInferredOrder(items: ScreenshotAnalysis[]): ScreenshotAnalysis[] {
  return items.slice().sort(
    (left, right) =>
      (left.inferredOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.inferredOrder ?? Number.MAX_SAFE_INTEGER),
  );
}

function selectScreensForPlan(
  analyses: ScreenshotAnalysis[],
  screenCount: number,
): ScreenshotAnalysis[] {
  if (analyses.length <= screenCount) return sortAnalysesByInferredOrder(analyses);

  const picked: ScreenshotAnalysis[] = [];
  const seenRoles = new Set<ScreenshotRole>();

  for (const analysis of analyses) {
    if (!seenRoles.has(analysis.role)) {
      picked.push(analysis);
      seenRoles.add(analysis.role);
    }
    if (picked.length === screenCount) return sortAnalysesByInferredOrder(picked);
  }

  for (const analysis of analyses) {
    if (!picked.includes(analysis)) {
      picked.push(analysis);
    }
    if (picked.length === screenCount) return sortAnalysesByInferredOrder(picked);
  }

  return sortAnalysesByInferredOrder(picked);
}

function buildSlideRole(index: number, total: number): string {
  if (index === 0) return 'hero';
  if (index === 1) return 'differentiator';
  if (index === total - 1) return 'summary';
  if (index === total - 2 && total > 3) return 'trust';
  return 'feature';
}

export function buildCopyPlanningSignals(
  analyses: ScreenshotAnalysis[],
  screenCount: number,
): CopyPlanningSignal[] {
  const selected = selectScreensForPlan(
    analyses,
    Math.min(Math.max(screenCount, 1), analyses.length || screenCount),
  );

  return selected.map((analysis, index) => ({
    slot: buildSlideRole(index, selected.length) as CopyPlanningSignal['slot'],
    path: analysis.path,
    role: analysis.role,
    density: analysis.density,
    focus: analysis.focus,
    unsafeForTextOverlay: analysis.unsafeForTextOverlay,
    topQuietRatio: analysis.pixelMetrics?.topQuietRatio ?? (analysis.density === 'minimal' ? 0.72 : 0.5),
    focusStrength: analysis.pixelMetrics?.focusStrength ?? analysis.focalPoint?.strength ?? 0.3,
  }));
}

type ConceptId = 'concept-a' | 'concept-b' | 'concept-c' | 'concept-d' | 'concept-e';

function cropRank(value: CropSuitability): number {
  if (value === 'high') return 2;
  if (value === 'medium') return 1;
  return 0;
}

function densityRank(value: ScreenshotDensity): number {
  if (value === 'dense') return 2;
  if (value === 'balanced') return 1;
  return 0;
}

function quietRank(analysis: ScreenshotAnalysis): number {
  return analysis.pixelMetrics?.topQuietRatio ?? (analysis.density === 'minimal' ? 0.72 : analysis.density === 'dense' ? 0.36 : 0.54);
}

function focusStrengthRank(analysis: ScreenshotAnalysis): number {
  return analysis.pixelMetrics?.focusStrength ?? analysis.focalPoint?.strength ?? 0.3;
}

function edgeDensityRank(analysis: ScreenshotAnalysis): number {
  return analysis.pixelMetrics?.edgeDensity ?? (analysis.density === 'dense' ? 0.16 : analysis.density === 'minimal' ? 0.05 : 0.1);
}

function heroScoreForConcept(analysis: ScreenshotAnalysis, conceptId: ConceptId): number {
  switch (conceptId) {
    case 'concept-b':
      return analysis.heroPriority + (cropRank(analysis.cropSuitability) * 12) + (focusStrengthRank(analysis) * 14) - (quietRank(analysis) * 2);
    case 'concept-c':
      return analysis.heroPriority + (quietRank(analysis) * 20) - (densityRank(analysis.density) * 8) + (analysis.unsafeForTextOverlay ? -10 : 6);
    case 'concept-d':
      return analysis.heroPriority + (cropRank(analysis.cropSuitability) * 16) + (edgeDensityRank(analysis) * 30) + (focusStrengthRank(analysis) * 10);
    default:
      return analysis.heroPriority + (quietRank(analysis) * 12) - (densityRank(analysis.density) * 4);
  }
}

function closingScoreForConcept(analysis: ScreenshotAnalysis, conceptId: ConceptId): number {
  const orderWeight = analysis.inferredOrder ?? 0;
  const roleBonus =
    analysis.role === 'settings' || analysis.role === 'paywall'
      ? 18
      : analysis.role === 'detail' || analysis.role === 'communication'
        ? 10
        : 0;

  switch (conceptId) {
    case 'concept-b':
      return roleBonus + (densityRank(analysis.density) * 10) + (analysis.unsafeForTextOverlay ? 8 : 0) + orderWeight;
    case 'concept-c':
      return roleBonus + (quietRank(analysis) * 10) + ((100 - analysis.heroPriority) * 0.14) + orderWeight;
    case 'concept-d':
      return roleBonus + (densityRank(analysis.density) * 12) + (cropRank(analysis.cropSuitability) * 6) + orderWeight;
    default:
      return roleBonus + ((100 - analysis.heroPriority) * 0.18) + (analysis.unsafeForTextOverlay ? 8 : 0) + orderWeight;
  }
}

function middleScoreForConcept(analysis: ScreenshotAnalysis, conceptId: ConceptId): number {
  switch (conceptId) {
    case 'concept-b':
      return (cropRank(analysis.cropSuitability) * 18) + (focusStrengthRank(analysis) * 16) + (edgeDensityRank(analysis) * 24) + (analysis.heroPriority * 0.12);
    case 'concept-c':
      return (quietRank(analysis) * 10) + (cropRank(analysis.cropSuitability) * 8) + ((analysis.inferredOrder ?? 0) * 0.8) - (edgeDensityRank(analysis) * 8);
    case 'concept-d':
      return (cropRank(analysis.cropSuitability) * 16) + (edgeDensityRank(analysis) * 28) + (densityRank(analysis.density) * 8) + (focusStrengthRank(analysis) * 12);
    default:
      return ((analysis.inferredOrder ?? 0) * 2) + (quietRank(analysis) * 4) + (analysis.heroPriority * 0.08);
  }
}

function arrangeScreensForConcept(
  selected: ScreenshotAnalysis[],
  conceptId: ConceptId,
): ScreenshotAnalysis[] {
  const ordered = sortAnalysesByInferredOrder(selected);
  if (ordered.length <= 2) return ordered;

  const hero = ordered.slice().sort((left, right) => heroScoreForConcept(right, conceptId) - heroScoreForConcept(left, conceptId))[0]!;
  const remainingAfterHero = ordered.filter((analysis) => analysis.path !== hero.path);
  const closing = remainingAfterHero
    .slice()
    .sort((left, right) => closingScoreForConcept(right, conceptId) - closingScoreForConcept(left, conceptId))[0]!;
  const middle = remainingAfterHero
    .filter((analysis) => analysis.path !== closing.path)
    .slice()
    .sort((left, right) => middleScoreForConcept(right, conceptId) - middleScoreForConcept(left, conceptId));

  const sequence = [hero, ...middle, closing];
  const matchesNaturalOrder = sequence.every((analysis, index) => analysis.path === ordered[index]?.path);
  if (conceptId !== 'concept-a' && matchesNaturalOrder && sequence.length >= 3) {
    return [sequence[1]!, sequence[0]!, ...sequence.slice(2)];
  }

  return sequence;
}

function supportingScreensForComposition(
  selected: ScreenshotAnalysis[],
  current: ScreenshotAnalysis,
  maxCount: number,
  conceptId: ConceptId,
  usageCounts: Map<string, number>,
): string[] {
  return selected
    .filter((analysis) => analysis.path !== current.path && analysis.recommendedUsage !== 'support-only')
    .sort((left, right) => {
      const supportScore = (analysis: ScreenshotAnalysis): number => {
        const crop = cropRank(analysis.cropSuitability) * 14;
        const focus = focusStrengthRank(analysis) * 10;
        const hero = analysis.heroPriority * 0.05;
        const repetitionPenalty = (usageCounts.get(analysis.path) ?? 0) * 12;
        const roleContrast = analysis.role === current.role ? -8 : 6;
        const orderDistance = Math.abs((analysis.inferredOrder ?? 0) - (current.inferredOrder ?? 0));
        const conceptBonus =
          conceptId === 'concept-b'
            ? (edgeDensityRank(analysis) * 20)
            : conceptId === 'concept-a'
              ? (quietRank(analysis) * 8)
              : (cropRank(analysis.cropSuitability) * 6);
        return crop + focus + hero + roleContrast + orderDistance + conceptBonus - repetitionPenalty;
      };

      return supportScore(right) - supportScore(left);
    })
    .slice(0, maxCount)
    .map((analysis) => {
      usageCounts.set(analysis.path, (usageCounts.get(analysis.path) ?? 0) + 1);
      return analysis.path;
    });
}

function chooseDynamicIndividualComposition(args: {
  analysis: ScreenshotAnalysis;
  index: number;
  total: number;
  supportingScreens: string[];
}): PlannedIndividualScreen['composition'] {
  if (args.supportingScreens.length >= 2 && args.index === 0) return 'hero-tilt';
  if (args.supportingScreens.length >= 2 && args.index === args.total - 1) return 'fanned-cards';
  if (args.supportingScreens.length >= 2 && args.analysis.cropSuitability === 'high') return 'fanned-cards';
  if (args.supportingScreens.length >= 1 && args.analysis.cropSuitability === 'high') return 'duo-overlap';
  if (args.supportingScreens.length >= 1) return args.index % 2 === 0 ? 'duo-split' : 'hero-tilt';
  return 'single';
}

function buildIndividualImplementationNote(args: {
  analysis: ScreenshotAnalysis;
  composition: PlannedIndividualScreen['composition'];
  supportingScreens: string[];
}): string | undefined {
  const parts: string[] = [];
  if (args.composition !== 'single') {
    parts.push(`Use ${args.composition} to widen the concept beyond a single centered device.`);
  }
  if (args.supportingScreens.length > 0) {
    parts.push(`Pull in ${args.supportingScreens.length} supporting screenshot${args.supportingScreens.length === 1 ? '' : 's'} for extra rhythm.`);
  }
  if (args.analysis.focalPoint && args.analysis.cropSuitability !== 'low') {
    parts.push(`Bias any detail zoom toward ${Math.round(args.analysis.focalPoint.x)}%/${Math.round(args.analysis.focalPoint.y)}%.`);
  }
  return parts.length > 0 ? parts.join(' ') : undefined;
}

function buildScreenCopyDirection(args: {
  conceptId: ConceptId;
  slideRole: string;
  analysis: ScreenshotAnalysis;
  composition: PlannedIndividualScreen['composition'];
}): string {
  const parts: string[] = [];

  switch (args.slideRole) {
    case 'hero':
      parts.push(
        args.conceptId === 'concept-b'
          ? 'Write a campaign-style hook in 3-5 words.'
          : 'State the main outcome in 3-5 words.',
      );
      break;
    case 'differentiator':
      parts.push('Name what makes this screen feel distinct from the category default.');
      break;
    case 'trust':
      parts.push('Use proof-oriented copy, not another feature label.');
      break;
    case 'summary':
      parts.push('Close with a concise umbrella benefit rather than repeating the hero.');
      break;
    default:
      parts.push('Sell one product moment, not a list of controls.');
      break;
  }

  switch (args.analysis.role) {
    case 'workflow':
      parts.push('Anchor the line in the main action the user completes here.');
      break;
    case 'detail':
      parts.push('Call out the result or proof shown inside the screen.');
      break;
    case 'discovery':
      parts.push('Make the line feel exploratory and broad, not mechanical.');
      break;
    case 'communication':
      parts.push('Keep the message social and immediate.');
      break;
    case 'paywall':
      parts.push('Frame the value clearly instead of describing pricing UI.');
      break;
    default:
      break;
  }

  if (args.analysis.unsafeForTextOverlay || args.analysis.density === 'dense') {
    parts.push('Keep it extra short because the UI is already busy.');
  } else if (quietRank(args.analysis) >= 0.66) {
    parts.push('Use a clean top-led statement because the screenshot has open copy space.');
  }

  if (args.composition !== 'single') {
    parts.push('Let the wording feel broader than a literal feature caption because multiple screenshots share the frame.');
  }

  return parts.join(' ');
}

function buildIndividualVariantScreens(args: {
  conceptId: 'concept-a' | 'concept-b';
  selected: ScreenshotAnalysis[];
}): PlannedIndividualScreen[] {
  const sequence = arrangeScreensForConcept(args.selected, args.conceptId);
  const supportUsage = new Map<string, number>();

  return sequence.map((analysis, index) => {
    const slideRole = buildSlideRole(index, sequence.length);
    const maxSupportingScreens =
      args.conceptId === 'concept-b'
        ? (index === 0 || index === sequence.length - 1 ? 2 : 1)
        : (index > 0 && analysis.cropSuitability === 'high' ? 1 : 0);
    const supportingScreens = maxSupportingScreens > 0
      ? supportingScreensForComposition(
          sequence,
          analysis,
          maxSupportingScreens,
          args.conceptId,
          supportUsage,
        )
      : [];
    const composition = args.conceptId === 'concept-b'
      ? chooseDynamicIndividualComposition({
          analysis,
          index,
          total: sequence.length,
          supportingScreens,
        })
      : index === 0
        ? 'single'
        : supportingScreens.length > 0 && analysis.cropSuitability === 'high'
          ? 'duo-split'
          : 'single';

    return {
      index: index + 1,
      sourcePath: analysis.path,
      sourceRole: analysis.role,
      slideRole,
      layout:
        composition === 'single'
          ? args.conceptId === 'concept-a'
            ? index % 2 === 1 ? 'angled-right' : 'center'
            : index === 0 ? 'center' : index % 2 === 0 ? 'angled-left' : 'angled-right'
          : 'center',
      composition,
      extraScreenshots: composition === 'single'
        ? []
        : supportingScreens.slice(0, composition === 'fanned-cards' ? 2 : 1),
      backgroundStrategy:
        args.conceptId === 'concept-a'
          ? index === 0 ? 'primary-tint' : 'consistent-light'
          : index === 0 ? 'high-contrast-hero' : 'contrast-rhythm',
      copyDirection: buildScreenCopyDirection({
        conceptId: args.conceptId,
        slideRole,
        analysis,
        composition,
      }),
      framing:
        args.conceptId === 'concept-b' && analysis.recommendedUsage === 'crop-card'
          ? 'frameless-rounded'
          : 'framed',
      dominantPalette: analysis.dominantPalette,
      focalPoint: analysis.focalPoint,
      implementationNote: buildIndividualImplementationNote({
        analysis,
        composition,
        supportingScreens,
      }),
    };
  });
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
    screens: buildIndividualVariantScreens({
      conceptId: 'concept-a',
      selected,
    }),
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
      screens: buildIndividualVariantScreens({
        conceptId: 'concept-b',
        selected,
      }),
    });
  }

  if (variantCount >= 3) {
    const editorialSequence = arrangeScreensForConcept(selected, 'concept-c');
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
      frames: editorialSequence.map((analysis, index) => {
        const storyBeat = buildSlideRole(index, editorialSequence.length);
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
          dominantPalette: analysis.dominantPalette,
          focalPoint: analysis.focalPoint,
          cropSuitability: analysis.cropSuitability,
          storyBeat,
          pacing:
            index === 0
              ? 'open strong'
              : index === editorialSequence.length - 1
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
    const boldSequence = arrangeScreensForConcept(selected, 'concept-d');
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
      frames: boldSequence.map((analysis, index) => {
        const storyBeat = buildSlideRole(index, boldSequence.length);
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
          dominantPalette: analysis.dominantPalette,
          focalPoint: analysis.focalPoint,
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
