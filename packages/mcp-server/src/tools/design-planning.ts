import { basename, extname } from 'node:path';
import { execFile as execFileCallback } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import { inflateSync } from 'node:zlib';

const execFile = promisify(execFileCallback);

export interface ScreenshotInput {
  path: string;
  note?: string;
  ocrJsonPath?: string;
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
export type AppCategory = 'finance' | 'health' | 'productivity' | 'social' | 'creative' | 'games' | 'general';
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

export interface ScreenshotTextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence?: number | null;
}

export interface ScreenshotTextInsights {
  source: string;
  text: string;
  lineCount: number;
  totalCoverage: number;
  topCoverage: number;
  roleHint?: ScreenshotRole;
  blocks: ScreenshotTextBlock[];
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
  textInsights?: ScreenshotTextInsights;
}

export interface VariantSetPlan {
  app: {
    name: string;
    description: string;
    category: AppCategory;
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

type ConceptId = 'concept-a' | 'concept-b' | 'concept-c' | 'concept-d' | 'concept-e';
type SequenceStage = 'hero' | 'middle' | 'closing' | 'support';

type PanoramicRequiredElement = PlannedPanoramicCanvasPlan['requiredElements'][number];

interface CategoryConceptSpec {
  name: string;
  style: string;
  recipe: string;
  strategy: string;
  designGoal?: string;
  requiredElements?: PanoramicRequiredElement[];
}

type CategoryRoleWeights = Record<SequenceStage, Partial<Record<ScreenshotRole, number>>>;

const CATEGORY_ROLE_WEIGHTS: Record<AppCategory, CategoryRoleWeights> = {
  finance: {
    hero: { home: 18, detail: 14, workflow: 10, paywall: -18, communication: -12 },
    middle: { detail: 18, workflow: 12, home: 8, settings: 4 },
    closing: { settings: 16, detail: 14, paywall: 10, communication: -4 },
    support: { detail: 14, settings: 10, home: 6, paywall: 4 },
  },
  health: {
    hero: { home: 16, onboarding: 14, workflow: 12, paywall: -12, settings: -4 },
    middle: { workflow: 18, detail: 12, home: 8, feature: 6 },
    closing: { detail: 12, settings: 8, paywall: 4, home: 4 },
    support: { workflow: 12, detail: 10, onboarding: 6, home: 4 },
  },
  productivity: {
    hero: { workflow: 18, home: 16, detail: 10, settings: -4 },
    middle: { workflow: 18, detail: 14, home: 8, feature: 6 },
    closing: { detail: 12, settings: 10, paywall: 4 },
    support: { workflow: 12, detail: 10, home: 6, settings: 4 },
  },
  social: {
    hero: { communication: 26, home: 10, discovery: 10, settings: -10, paywall: -6 },
    middle: { communication: 16, discovery: 14, home: 8, detail: 6 },
    closing: { detail: 12, home: 8, paywall: 4, settings: 2 },
    support: { communication: 14, discovery: 12, home: 6, detail: 4 },
  },
  creative: {
    hero: { discovery: 18, detail: 16, home: 8, settings: -6 },
    middle: { discovery: 18, detail: 16, feature: 10, home: 6 },
    closing: { detail: 12, home: 8, paywall: 4 },
    support: { discovery: 12, detail: 12, feature: 8, home: 4 },
  },
  games: {
    hero: { detail: 16, discovery: 14, onboarding: 12, home: 8, settings: -8 },
    middle: { detail: 18, discovery: 16, feature: 10, home: 6 },
    closing: { paywall: 10, detail: 10, settings: 6, home: 4 },
    support: { detail: 12, discovery: 10, onboarding: 8, paywall: 6 },
  },
  general: {
    hero: { home: 8, workflow: 6, settings: -4 },
    middle: { detail: 8, workflow: 6, feature: 4 },
    closing: { detail: 8, settings: 6, paywall: 4 },
    support: { detail: 6, workflow: 4, home: 4 },
  },
};

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

const ROLE_SIGNAL_PATTERNS: Array<{ role: ScreenshotRole; pattern: RegExp; weight: number }> = [
  { role: 'home', pattern: /\b(home|dashboard|overview|feed|main|today|wallet|balance|activity)\b/g, weight: 10 },
  { role: 'onboarding', pattern: /\b(onboarding|welcome|intro|start|splash|get started|continue|skip|allow)\b/g, weight: 12 },
  { role: 'communication', pattern: /\b(chat|message|messages|inbox|conversation|thread|reply|typing|dm)\b/g, weight: 12 },
  { role: 'discovery', pattern: /\b(search|discover|explore|browse|find|trending|for you)\b/g, weight: 10 },
  { role: 'workflow', pattern: /\b(calendar|plan|task|workflow|schedule|editor|compose|create|checklist|project)\b/g, weight: 10 },
  { role: 'detail', pattern: /\b(detail|profile|report|analytics|stats|insight|summary|progress|revenue|spending|results?)\b/g, weight: 10 },
  { role: 'settings', pattern: /\b(settings|account|preferences|privacy|notifications|security|manage|general)\b/g, weight: 12 },
  { role: 'paywall', pattern: /\b(pricing|upgrade|paywall|subscribe|subscription|checkout|cart|payment|trial|premium|unlock)\b/g, weight: 12 },
  { role: 'feature', pattern: /\b(feature|screen|tab|list)\b/g, weight: 4 },
];

const ROLE_TIEBREAK_ORDER: ScreenshotRole[] = [
  'home',
  'workflow',
  'detail',
  'communication',
  'discovery',
  'onboarding',
  'settings',
  'paywall',
  'feature',
  'unknown',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function countRegexMatches(value: string, pattern: RegExp): number {
  const matches = value.match(pattern);
  return matches?.length ?? 0;
}

function addRoleScores(
  scores: Record<ScreenshotRole, number>,
  haystack: string,
  multiplier: number,
): void {
  for (const signal of ROLE_SIGNAL_PATTERNS) {
    const count = countRegexMatches(haystack, signal.pattern);
    if (count > 0) {
      scores[signal.role] += count * signal.weight * multiplier;
    }
  }
}

function bestRoleFromScores(scores: Record<ScreenshotRole, number>): ScreenshotRole {
  let bestRole: ScreenshotRole = 'unknown';
  let bestScore = 0;

  for (const role of ROLE_TIEBREAK_ORDER) {
    const score = scores[role] ?? 0;
    if (score > bestScore) {
      bestRole = role;
      bestScore = score;
    }
  }

  return bestScore > 0 ? bestRole : 'unknown';
}

function normalizeRoleHint(value: unknown): ScreenshotRole | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = normalizeText(value);
  return ROLE_TIEBREAK_ORDER.find((role) => role === normalized);
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeAxisValue(value: number | null, dimension: number | null): number | null {
  if (value === null) return null;
  if (value >= 0 && value <= 1) return clamp(value * 100, 0, 100);
  if (dimension && dimension > 0) return clamp((value / dimension) * 100, 0, 100);
  return clamp(value, 0, 100);
}

function normalizeAxisLength(
  value: number | null,
  dimension: number | null,
  start: number,
): number | null {
  if (value === null) return null;
  if (value >= 0 && value <= 1) return clamp(value * 100, 0, 100 - start);
  if (dimension && dimension > 0) return clamp((value / dimension) * 100, 0, 100 - start);
  return clamp(value, 0, 100 - start);
}

function normalizeTextBlock(
  value: unknown,
  width: number | null,
  height: number | null,
): ScreenshotTextBlock | null {
  if (!isRecord(value)) return null;

  const rawText = typeof value.text === 'string' ? value.text.trim() : '';
  if (!rawText) return null;

  const nestedBounds = isRecord(value.bbox) ? value.bbox : isRecord(value.bounds) ? value.bounds : null;
  const xValue = toFiniteNumber(value.x) ?? toFiniteNumber(value.left) ?? toFiniteNumber(nestedBounds?.x) ?? toFiniteNumber(nestedBounds?.left);
  const yValue = toFiniteNumber(value.y) ?? toFiniteNumber(value.top) ?? toFiniteNumber(nestedBounds?.y) ?? toFiniteNumber(nestedBounds?.top);
  const widthValue =
    toFiniteNumber(value.width)
    ?? toFiniteNumber(nestedBounds?.width)
    ?? (() => {
      const right = toFiniteNumber(value.right) ?? toFiniteNumber(nestedBounds?.right);
      return right !== null && xValue !== null ? right - xValue : null;
    })();
  const heightValue =
    toFiniteNumber(value.height)
    ?? toFiniteNumber(nestedBounds?.height)
    ?? (() => {
      const bottom = toFiniteNumber(value.bottom) ?? toFiniteNumber(nestedBounds?.bottom);
      return bottom !== null && yValue !== null ? bottom - yValue : null;
    })();

  const x = normalizeAxisValue(xValue, width);
  const y = normalizeAxisValue(yValue, height);
  if (x === null || y === null) return null;

  const normalizedWidth = normalizeAxisLength(widthValue, width, x);
  const normalizedHeight = normalizeAxisLength(heightValue, height, y);
  if (normalizedWidth === null || normalizedHeight === null || normalizedWidth <= 0 || normalizedHeight <= 0) {
    return null;
  }

  const confidence = toFiniteNumber(value.confidence);
  return {
    text: rawText,
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
    width: Number(normalizedWidth.toFixed(1)),
    height: Number(normalizedHeight.toFixed(1)),
    confidence: confidence === null ? undefined : Number(confidence.toFixed(3)),
  };
}

function buildTextInsights(args: {
  source: string;
  roleHint?: ScreenshotRole;
  text?: string;
  blocks: ScreenshotTextBlock[];
}): ScreenshotTextInsights | null {
  const cleanedBlocks = args.blocks
    .map((block) => ({
      ...block,
      text: block.text.trim(),
    }))
    .filter((block) => block.text.length > 0)
    .slice(0, 32);
  const text = typeof args.text === 'string' && args.text.trim().length > 0
    ? args.text.trim()
    : cleanedBlocks.map((block) => block.text).join('\n');
  if (!text && cleanedBlocks.length === 0) return null;

  const totalCoverage = cleanedBlocks.reduce((sum, block) => sum + ((block.width * block.height) / 10_000), 0);
  const topBandHeight = 30;
  const topCoverage = cleanedBlocks.reduce((sum, block) => {
    const overlapHeight = Math.max(0, Math.min(block.y + block.height, topBandHeight) - block.y);
    if (overlapHeight <= 0) return sum;
    return sum + ((block.width * overlapHeight) / (100 * topBandHeight));
  }, 0);

  return {
    source: args.source,
    text,
    lineCount: cleanedBlocks.length > 0
      ? cleanedBlocks.length
      : text.split(/\n+/).map((line) => line.trim()).filter(Boolean).length,
    totalCoverage: Number(Math.min(totalCoverage, 1).toFixed(3)),
    topCoverage: Number(Math.min(topCoverage, 1).toFixed(3)),
    roleHint: args.roleHint,
    blocks: cleanedBlocks,
  };
}

function parseScreenshotTextInsights(
  rawJson: string,
  width: number | null,
  height: number | null,
  fallbackSource: string,
): ScreenshotTextInsights | null {
  const parsed = JSON.parse(rawJson) as unknown;
  const roleHint = isRecord(parsed) ? normalizeRoleHint(parsed.roleHint) : undefined;

  if (Array.isArray(parsed)) {
    return buildTextInsights({
      source: fallbackSource,
      roleHint,
      blocks: parsed
        .map((entry) => normalizeTextBlock(entry, width, height))
        .filter((entry): entry is ScreenshotTextBlock => entry !== null),
    });
  }

  if (!isRecord(parsed)) return null;
  const blockSource = Array.isArray(parsed.blocks) ? parsed.blocks : Array.isArray(parsed.lines) ? parsed.lines : [];
  const blocks = blockSource
    .map((entry) => normalizeTextBlock(entry, width, height))
    .filter((entry): entry is ScreenshotTextBlock => entry !== null);

  return buildTextInsights({
    source: typeof parsed.source === 'string' && parsed.source.trim().length > 0
      ? parsed.source.trim()
      : fallbackSource,
    roleHint,
    text: typeof parsed.text === 'string' ? parsed.text : undefined,
    blocks,
  });
}

function candidateOcrJsonPaths(pathValue: string, explicitPath?: string): string[] {
  const stem = pathValue.slice(0, Math.max(0, pathValue.length - extname(pathValue).length));
  return [
    explicitPath ?? '',
    `${pathValue}.ocr.json`,
    `${pathValue}.vision.json`,
    `${stem}.ocr.json`,
    `${stem}.vision.json`,
  ].filter((value, index, values) => value.length > 0 && values.indexOf(value) === index);
}

async function readScreenshotTextInsightsFromSidecar(args: {
  pathValue: string;
  ocrJsonPath?: string;
  width: number | null;
  height: number | null;
}): Promise<ScreenshotTextInsights | null> {
  for (const candidatePath of candidateOcrJsonPaths(args.pathValue, args.ocrJsonPath)) {
    try {
      const rawJson = await readFile(candidatePath, 'utf8');
      const parsed = parseScreenshotTextInsights(
        rawJson,
        args.width,
        args.height,
        `sidecar:${basename(candidatePath)}`,
      );
      if (parsed) return parsed;
    } catch {
      continue;
    }
  }

  return null;
}

function isTesseractEnabled(): boolean {
  const value = process.env.APPFRAME_ENABLE_TESSERACT_OCR;
  return value === '1' || value === 'true' || value === 'yes';
}

function parseTesseractTsv(
  stdout: string,
  width: number | null,
  height: number | null,
): ScreenshotTextInsights | null {
  const lines = stdout.split(/\r?\n/);
  if (lines.length <= 1) return null;

  const blocks: ScreenshotTextBlock[] = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length < 12) continue;
    const level = Number(parts[0]);
    const confidence = Number(parts[10]);
    const text = parts[11]?.trim();
    if (!text || !Number.isFinite(level) || level < 5) continue;
    if (Number.isFinite(confidence) && confidence < 20) continue;

    const block = normalizeTextBlock({
      text,
      confidence: Number.isFinite(confidence) ? confidence / 100 : undefined,
      left: Number(parts[6]),
      top: Number(parts[7]),
      width: Number(parts[8]),
      height: Number(parts[9]),
    }, width, height);
    if (block) blocks.push(block);
  }

  return buildTextInsights({
    source: 'tesseract',
    blocks,
  });
}

async function readScreenshotTextInsightsFromTesseract(args: {
  pathValue: string;
  width: number | null;
  height: number | null;
}): Promise<ScreenshotTextInsights | null> {
  if (!isTesseractEnabled()) return null;

  try {
    const { stdout } = await execFile(
      process.env.APPFRAME_TESSERACT_BINARY ?? 'tesseract',
      [
        args.pathValue,
        'stdout',
        '-l',
        process.env.APPFRAME_TESSERACT_LANG ?? 'eng',
        '--psm',
        '11',
        'tsv',
      ],
      {
        encoding: 'utf8',
        maxBuffer: 4 * 1024 * 1024,
      },
    );
    return parseTesseractTsv(stdout, args.width, args.height);
  } catch {
    return null;
  }
}

async function readScreenshotTextInsights(args: {
  pathValue: string;
  ocrJsonPath?: string;
  width: number | null;
  height: number | null;
}): Promise<ScreenshotTextInsights | null> {
  return (
    await readScreenshotTextInsightsFromSidecar(args)
    ?? await readScreenshotTextInsightsFromTesseract(args)
  );
}

function inferRole(pathValue: string, note?: string, textInsights?: ScreenshotTextInsights): ScreenshotRole {
  const scores: Record<ScreenshotRole, number> = {
    home: 0,
    onboarding: 0,
    detail: 0,
    communication: 0,
    discovery: 0,
    workflow: 0,
    settings: 0,
    paywall: 0,
    feature: 0,
    unknown: 0,
  };

  addRoleScores(scores, normalizeText(`${humanizeFileStem(pathValue)} ${note ?? ''}`), 1);
  if (textInsights?.text) addRoleScores(scores, normalizeText(textInsights.text), 1.2);
  if (textInsights?.roleHint) scores[textInsights.roleHint] += 24;

  return bestRoleFromScores(scores);
}

function inferDensity(
  role: ScreenshotRole,
  pathValue: string,
  note?: string,
  textInsights?: ScreenshotTextInsights,
): ScreenshotDensity {
  const haystack = normalizeText(`${humanizeFileStem(pathValue)} ${note ?? ''}`);

  if (textInsights) {
    if (textInsights.totalCoverage >= 0.2 || textInsights.lineCount >= 10) return 'dense';
    if (textInsights.totalCoverage <= 0.04 && textInsights.lineCount <= 2) return 'minimal';
  }

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

function maxTextRisk(left: TextRisk, right: TextRisk): TextRisk {
  const order: TextRisk[] = ['low', 'medium', 'high'];
  return order[Math.max(order.indexOf(left), order.indexOf(right))] ?? 'medium';
}

function liftTextRiskFromInsights(
  baseRisk: TextRisk,
  textInsights?: ScreenshotTextInsights,
): TextRisk {
  if (!textInsights) return baseRisk;
  if (
    textInsights.topCoverage >= 0.12
    || textInsights.totalCoverage >= 0.24
    || textInsights.lineCount >= 12
  ) {
    return 'high';
  }
  if (
    textInsights.topCoverage >= 0.04
    || textInsights.totalCoverage >= 0.1
    || textInsights.lineCount >= 4
  ) {
    return maxTextRisk(baseRisk, 'medium');
  }
  return baseRisk;
}

function zoneTextOverlapRatio(
  zone: SafeTextZone,
  textInsights?: ScreenshotTextInsights,
): number {
  if (!textInsights || textInsights.blocks.length === 0) return 0;

  const zoneArea = Math.max(zone.width * zone.height, 1);
  const overlapArea = textInsights.blocks.reduce((sum, block) => {
    const overlapWidth = Math.max(
      0,
      Math.min(zone.x + zone.width, block.x + block.width) - Math.max(zone.x, block.x),
    );
    const overlapHeight = Math.max(
      0,
      Math.min(zone.y + zone.height, block.y + block.height) - Math.max(zone.y, block.y),
    );
    return sum + (overlapWidth * overlapHeight);
  }, 0);

  return overlapArea / zoneArea;
}

function uniqueSafeTextZones(zones: SafeTextZone[]): SafeTextZone[] {
  const seen = new Set<string>();
  return zones.filter((zone) => {
    const key = `${zone.label}:${zone.x}:${zone.y}:${zone.width}:${zone.height}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function filterSafeTextZonesWithText(
  safeTextZones: SafeTextZone[],
  fallbackZones: SafeTextZone[],
  textInsights?: ScreenshotTextInsights,
): SafeTextZone[] {
  if (!textInsights || textInsights.blocks.length === 0) return safeTextZones;

  const candidates = uniqueSafeTextZones([...safeTextZones, ...fallbackZones]);
  const filtered = candidates.filter((zone) => zoneTextOverlapRatio(zone, textInsights) < 0.14);
  if (filtered.length > 0) return filtered.slice(0, Math.max(3, safeTextZones.length));
  return safeTextZones;
}

function hasTopTextCollision(textInsights?: ScreenshotTextInsights): boolean {
  return Boolean(textInsights && (textInsights.topCoverage >= 0.08 || textInsights.lineCount >= 8));
}

function adjustHeroPriorityForText(
  heroPriority: number,
  textInsights?: ScreenshotTextInsights,
): number {
  if (!textInsights) return heroPriority;
  let adjusted = heroPriority;
  if (textInsights.topCoverage >= 0.14) adjusted -= 12;
  else if (textInsights.topCoverage >= 0.08) adjusted -= 6;
  if (textInsights.totalCoverage >= 0.25) adjusted -= 8;
  else if (textInsights.totalCoverage <= 0.03 && textInsights.lineCount <= 1) adjusted += 3;
  return clamp(adjusted, 0, 100);
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
  textInsights?: ScreenshotTextInsights;
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

  if (args.textInsights) {
    if (args.textInsights.roleHint && args.textInsights.roleHint === args.role) {
      reasons.push(`Text enrichment also points to a ${args.role} screen.`);
    }
    if (args.textInsights.topCoverage >= 0.1) {
      reasons.push('OCR/vision text blocks occupy the top band, so overlay copy needs more caution.');
    } else if (args.textInsights.lineCount > 0 && args.textInsights.totalCoverage <= 0.04) {
      reasons.push('OCR/vision enrichment found only light embedded UI text, so the screen stays flexible.');
    }
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

export function inferCategory(appDescription: string, features: string[]): AppCategory {
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
      const [rasterSignals, fileStat, textInsights] = await Promise.all([
        analyzeRasterSignals(input.path),
        stat(input.path).catch(() => null),
        readScreenshotTextInsights({
          pathValue: input.path,
          ocrJsonPath: input.ocrJsonPath,
          width: metadata.width,
          height: metadata.height,
        }),
      ]);
      const resolvedTextInsights = textInsights ?? undefined;
      const role = inferRole(input.path, input.note, resolvedTextInsights);
      const inferredDensity = inferDensity(role, input.path, input.note, resolvedTextInsights);
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
      const baseSafeTextZones = rasterSignals?.safeTextZones?.length
        ? rasterSignals.safeTextZones
        : inferSafeTextZones(role, density);
      const safeTextZones = filterSafeTextZonesWithText(
        baseSafeTextZones,
        inferSafeTextZones(role, density),
        resolvedTextInsights,
      );
      let heroPriority = computeHeroPriority(
        role,
        density,
        metadata.width,
        metadata.height,
        input.path,
        input.note,
      );
      heroPriority = clamp(heroPriority + (rasterSignals?.heroPriorityAdjustment ?? 0), 0, 100);
      heroPriority = adjustHeroPriorityForText(heroPriority, resolvedTextInsights);
      const recommendedUsage = inferRecommendedUsage(role, heroPriority, cropSuitability);
      const textRisk = liftTextRiskFromInsights(
        rasterSignals?.textRisk ?? inferTextRisk(density),
        resolvedTextInsights,
      );
      const unsafeForTextOverlay = rasterSignals
        ? (
            rasterSignals.unsafeForTextOverlay
            || inferUnsafeForTextOverlay(role, density, safeTextZones)
            || hasTopTextCollision(resolvedTextInsights)
          )
        : (
            inferUnsafeForTextOverlay(role, density, safeTextZones)
            || hasTopTextCollision(resolvedTextInsights)
          );

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
          textInsights: resolvedTextInsights,
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
        textInsights: resolvedTextInsights,
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

function categoryRoleBonus(
  category: AppCategory,
  stage: SequenceStage,
  role: ScreenshotRole,
  conceptId: ConceptId,
): number {
  let bonus = CATEGORY_ROLE_WEIGHTS[category][stage][role] ?? 0;

  if (category === 'social' && stage === 'hero' && conceptId === 'concept-b' && role === 'communication') {
    bonus += 30;
  }
  if (category === 'finance' && stage === 'hero' && conceptId === 'concept-a' && role === 'home') {
    bonus += 8;
  }
  if (category === 'creative' && stage === 'hero' && conceptId === 'concept-a' && role === 'discovery') {
    bonus += 10;
  }
  if (category === 'games' && stage === 'hero' && conceptId === 'concept-b' && role === 'detail') {
    bonus += 8;
  }

  return bonus;
}

function heroScoreForConcept(
  analysis: ScreenshotAnalysis,
  conceptId: ConceptId,
  category: AppCategory,
): number {
  const categoryBonus = categoryRoleBonus(category, 'hero', analysis.role, conceptId);
  switch (conceptId) {
    case 'concept-b':
      return analysis.heroPriority
        + (cropRank(analysis.cropSuitability) * 12)
        + (focusStrengthRank(analysis) * 14)
        - (quietRank(analysis) * 2)
        + categoryBonus;
    case 'concept-c':
      return analysis.heroPriority
        + (quietRank(analysis) * 20)
        - (densityRank(analysis.density) * 8)
        + (analysis.unsafeForTextOverlay ? -10 : 6)
        + categoryBonus;
    case 'concept-d':
      return analysis.heroPriority
        + (cropRank(analysis.cropSuitability) * 16)
        + (edgeDensityRank(analysis) * 30)
        + (focusStrengthRank(analysis) * 10)
        + categoryBonus;
    default:
      return analysis.heroPriority
        + (quietRank(analysis) * 12)
        - (densityRank(analysis.density) * 4)
        + categoryBonus;
  }
}

function closingScoreForConcept(
  analysis: ScreenshotAnalysis,
  conceptId: ConceptId,
  category: AppCategory,
): number {
  const orderWeight = analysis.inferredOrder ?? 0;
  const roleBonus =
    analysis.role === 'settings' || analysis.role === 'paywall'
      ? 18
      : analysis.role === 'detail' || analysis.role === 'communication'
        ? 10
        : 0;
  const categoryBonus = categoryRoleBonus(category, 'closing', analysis.role, conceptId);

  switch (conceptId) {
    case 'concept-b':
      return roleBonus
        + (densityRank(analysis.density) * 10)
        + (analysis.unsafeForTextOverlay ? 8 : 0)
        + orderWeight
        + categoryBonus;
    case 'concept-c':
      return roleBonus
        + (quietRank(analysis) * 10)
        + ((100 - analysis.heroPriority) * 0.14)
        + orderWeight
        + categoryBonus;
    case 'concept-d':
      return roleBonus
        + (densityRank(analysis.density) * 12)
        + (cropRank(analysis.cropSuitability) * 6)
        + orderWeight
        + categoryBonus;
    default:
      return roleBonus
        + ((100 - analysis.heroPriority) * 0.18)
        + (analysis.unsafeForTextOverlay ? 8 : 0)
        + orderWeight
        + categoryBonus;
  }
}

function middleScoreForConcept(
  analysis: ScreenshotAnalysis,
  conceptId: ConceptId,
  category: AppCategory,
): number {
  const categoryBonus = categoryRoleBonus(category, 'middle', analysis.role, conceptId);
  switch (conceptId) {
    case 'concept-b':
      return (cropRank(analysis.cropSuitability) * 18)
        + (focusStrengthRank(analysis) * 16)
        + (edgeDensityRank(analysis) * 24)
        + (analysis.heroPriority * 0.12)
        + categoryBonus;
    case 'concept-c':
      return (quietRank(analysis) * 10)
        + (cropRank(analysis.cropSuitability) * 8)
        + ((analysis.inferredOrder ?? 0) * 0.8)
        - (edgeDensityRank(analysis) * 8)
        + categoryBonus;
    case 'concept-d':
      return (cropRank(analysis.cropSuitability) * 16)
        + (edgeDensityRank(analysis) * 28)
        + (densityRank(analysis.density) * 8)
        + (focusStrengthRank(analysis) * 12)
        + categoryBonus;
    default:
      return ((analysis.inferredOrder ?? 0) * 2)
        + (quietRank(analysis) * 4)
        + (analysis.heroPriority * 0.08)
        + categoryBonus;
  }
}

interface CrossConceptAssignmentState {
  heroUsage: Map<string, number>;
  closingUsage: Map<string, number>;
  earlyUsage: Map<string, number>;
  supportUsage: Map<string, number>;
}

function createCrossConceptAssignmentState(): CrossConceptAssignmentState {
  return {
    heroUsage: new Map<string, number>(),
    closingUsage: new Map<string, number>(),
    earlyUsage: new Map<string, number>(),
    supportUsage: new Map<string, number>(),
  };
}

function usageCount(map: Map<string, number>, pathValue: string): number {
  return map.get(pathValue) ?? 0;
}

function incrementUsage(map: Map<string, number>, pathValue: string): void {
  map.set(pathValue, usageCount(map, pathValue) + 1);
}

function arrangeScreensForConcept(
  selected: ScreenshotAnalysis[],
  conceptId: ConceptId,
  category: AppCategory,
  assignmentState?: CrossConceptAssignmentState,
): ScreenshotAnalysis[] {
  const ordered = sortAnalysesByInferredOrder(selected);
  if (ordered.length <= 2) return ordered;
  const heroUsage = assignmentState?.heroUsage ?? new Map<string, number>();
  const closingUsage = assignmentState?.closingUsage ?? new Map<string, number>();
  const earlyUsage = assignmentState?.earlyUsage ?? new Map<string, number>();
  const heroReusePenalty = conceptId === 'concept-d' ? 42 : conceptId === 'concept-c' ? 34 : 28;
  const earlyReusePenalty = conceptId === 'concept-d' ? 18 : 14;
  const unusedLeadBonus = conceptId === 'concept-a' ? 0 : 8;

  const hero = ordered
    .slice()
    .sort((left, right) => {
      const rightScore = heroScoreForConcept(right, conceptId, category)
        - (usageCount(heroUsage, right.path) * heroReusePenalty)
        - (usageCount(earlyUsage, right.path) * earlyReusePenalty)
        - (usageCount(closingUsage, right.path) * 8)
        + (usageCount(heroUsage, right.path) === 0 ? unusedLeadBonus : 0);
      const leftScore = heroScoreForConcept(left, conceptId, category)
        - (usageCount(heroUsage, left.path) * heroReusePenalty)
        - (usageCount(earlyUsage, left.path) * earlyReusePenalty)
        - (usageCount(closingUsage, left.path) * 8)
        + (usageCount(heroUsage, left.path) === 0 ? unusedLeadBonus : 0);
      return rightScore - leftScore;
    })[0]!;
  const remainingAfterHero = ordered.filter((analysis) => analysis.path !== hero.path);
  const closing = remainingAfterHero
    .slice()
    .sort((left, right) => {
      const rightScore = closingScoreForConcept(right, conceptId, category)
        - (usageCount(closingUsage, right.path) * 26)
        - (usageCount(heroUsage, right.path) * 10)
        - (usageCount(earlyUsage, right.path) * 6);
      const leftScore = closingScoreForConcept(left, conceptId, category)
        - (usageCount(closingUsage, left.path) * 26)
        - (usageCount(heroUsage, left.path) * 10)
        - (usageCount(earlyUsage, left.path) * 6);
      return rightScore - leftScore;
    })[0]!;
  const middle = remainingAfterHero
    .filter((analysis) => analysis.path !== closing.path)
    .slice()
    .sort((left, right) => {
      const rightScore = middleScoreForConcept(right, conceptId, category)
        - (usageCount(earlyUsage, right.path) * 12)
        - (usageCount(heroUsage, right.path) * 6);
      const leftScore = middleScoreForConcept(left, conceptId, category)
        - (usageCount(earlyUsage, left.path) * 12)
        - (usageCount(heroUsage, left.path) * 6);
      return rightScore - leftScore;
    });

  const sequence = [hero, ...middle, closing];
  const matchesNaturalOrder = sequence.every((analysis, index) => analysis.path === ordered[index]?.path);
  const finalSequence = conceptId !== 'concept-a' && matchesNaturalOrder && sequence.length >= 3
    ? [sequence[1]!, sequence[0]!, ...sequence.slice(2)]
    : sequence;

  if (assignmentState) {
    incrementUsage(assignmentState.heroUsage, finalSequence[0]!.path);
    incrementUsage(assignmentState.closingUsage, finalSequence[finalSequence.length - 1]!.path);
    finalSequence.slice(0, Math.min(2, finalSequence.length)).forEach((analysis) => {
      incrementUsage(assignmentState.earlyUsage, analysis.path);
    });
  }

  return finalSequence;
}

function supportingScreensForComposition(
  selected: ScreenshotAnalysis[],
  current: ScreenshotAnalysis,
  maxCount: number,
  conceptId: ConceptId,
  category: AppCategory,
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
        const categoryBonus = categoryRoleBonus(category, 'support', analysis.role, conceptId);
        const orderDistance = Math.abs((analysis.inferredOrder ?? 0) - (current.inferredOrder ?? 0));
        const conceptBonus =
          conceptId === 'concept-b'
            ? (edgeDensityRank(analysis) * 20)
            : conceptId === 'concept-a'
              ? (quietRank(analysis) * 8)
              : (cropRank(analysis.cropSuitability) * 6);
        return crop + focus + hero + roleContrast + orderDistance + conceptBonus + categoryBonus - repetitionPenalty;
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
  category: AppCategory;
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

  switch (args.category) {
    case 'finance':
      parts.push('Keep the tone calm, credible, and precise.');
      break;
    case 'health':
      parts.push('Keep the tone encouraging and steady, not intense.');
      break;
    case 'productivity':
      parts.push('Keep the tone decisive and practical.');
      break;
    case 'social':
      parts.push('Make the line feel active, human, and social.');
      break;
    case 'creative':
      parts.push('Make the line feel expressive and visual, not utilitarian.');
      break;
    case 'games':
      parts.push('Let the line feel energetic and immersive.');
      break;
    default:
      break;
  }

  return parts.join(' ');
}

function buildIndividualVariantScreens(args: {
  category: AppCategory;
  conceptId: 'concept-a' | 'concept-b';
  sequence: ScreenshotAnalysis[];
  supportUsage: Map<string, number>;
}): PlannedIndividualScreen[] {
  return args.sequence.map((analysis, index) => {
    const slideRole = buildSlideRole(index, args.sequence.length);
    const maxSupportingScreens =
      args.conceptId === 'concept-b'
        ? (index === 0 || index === args.sequence.length - 1 ? 2 : 1)
        : (index > 0 && analysis.cropSuitability === 'high' ? 1 : 0);
    const supportingScreens = maxSupportingScreens > 0
      ? supportingScreensForComposition(
          args.sequence,
          analysis,
          maxSupportingScreens,
          args.conceptId,
          args.category,
          args.supportUsage,
        )
      : [];
    const composition = args.conceptId === 'concept-b'
      ? chooseDynamicIndividualComposition({
          analysis,
          index,
          total: args.sequence.length,
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
        category: args.category,
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

function buildCategoryGoalLine(category: AppCategory, goals: string[]): string {
  if (goals.length > 0) {
    switch (category) {
      case 'finance':
        return `${goals.join(', ')} with trust-first proof and calm hierarchy.`;
      case 'health':
        return `${goals.join(', ')} with supportive pacing and steady progress cues.`;
      case 'social':
        return `${goals.join(', ')} with community energy and clear interaction moments.`;
      case 'creative':
        return `${goals.join(', ')} with expressive hierarchy and showcase detail.`;
      case 'games':
        return `${goals.join(', ')} with cinematic energy and feature payoff.`;
      default:
        return buildGoalLine(goals);
    }
  }

  switch (category) {
    case 'finance':
      return 'Trust-first panoramic story with clear proof and calm decision-making.';
    case 'health':
      return 'Supportive panoramic story built around routine, progress, and consistency.';
    case 'productivity':
      return 'Focused panoramic story built around flow, clarity, and forward motion.';
    case 'social':
      return 'Connected social story with conversation, community energy, and readable beats.';
    case 'creative':
      return 'Expressive showcase story with stronger detail, atmosphere, and visual hierarchy.';
    case 'games':
      return 'Cinematic panoramic story with strong progression, energy, and payoff.';
    default:
      return 'Clear benefit-led messaging';
  }
}

function defaultEditorialElements(): PanoramicRequiredElement[] {
  return [
    { type: 'text', purpose: 'asymmetric editorial headline blocks' },
    { type: 'device', purpose: 'screen continuity across frame boundaries' },
    { type: 'group', purpose: 'paired crop-and-card systems for supporting proof clusters' },
    { type: 'logo', purpose: 'brand mark or subtle supporting asset' },
  ];
}

function defaultBoldElements(): PanoramicRequiredElement[] {
  return [
    { type: 'text', purpose: 'benefit-led headlines' },
    { type: 'badge', purpose: 'campaign callout or featured-state badge' },
    { type: 'proof-chip', purpose: 'ratings or trust proof chip' },
    { type: 'device', purpose: 'hero and supporting product shots' },
    { type: 'group', purpose: 'floating grouped crop-and-card clusters for momentum and proof' },
    { type: 'logo', purpose: 'brand lockup or supporting graphic asset' },
    { type: 'decoration', purpose: 'motion and depth' },
  ];
}

function buildCategoryConceptSpecs(
  category: AppCategory,
  goals: string[],
): Record<ConceptId, CategoryConceptSpec> {
  const specs: Record<ConceptId, CategoryConceptSpec> = {
    'concept-a': {
      name: 'Clean Hero',
      style: 'minimal',
      recipe: 'clean-hero',
      strategy:
        'Use the clearest hero candidate first, keep layouts centered, and optimize for App Store thumbnail readability.',
    },
    'concept-b': {
      name: 'Dynamic Individual',
      style: 'bold',
      recipe: 'layered-momentum',
      strategy:
        'Use stronger contrast, bolder pacing, and frameless rounded screenshots where they read cleaner than hardware frames.',
    },
    'concept-c': {
      name: 'Editorial Panorama',
      style: 'editorial',
      recipe: 'editorial-panorama',
      strategy:
        'Build a connected editorial story with stronger whitespace, fewer elements, and slower pacing across frames.',
      designGoal: 'Premium, connected sequence with strong hierarchy and intentional whitespace.',
      requiredElements: defaultEditorialElements(),
    },
    'concept-d': {
      name: 'Bold Panorama',
      style: 'branded',
      recipe: 'bold-panorama',
      strategy:
        'Use stronger brand color, bigger transitions, and more cinematic rhythm across the panoramic strip.',
      designGoal: buildCategoryGoalLine(category, goals),
      requiredElements: defaultBoldElements(),
    },
    'concept-e': {
      name: 'Brand Poster',
      style: 'branded',
      recipe: 'brand-poster',
      strategy:
        'Poster-like concept centered on strong brand color, badge/image assets, and direct outcome copy.',
      designGoal: 'Poster-like brand-led sequence with strong color blocking.',
      requiredElements: [
        { type: 'text', purpose: 'benefit headline' },
        { type: 'badge', purpose: 'proof or ratings-style badge' },
        { type: 'proof-chip', purpose: 'compact trust marker or rating chip' },
        { type: 'device', purpose: 'product proof' },
        { type: 'logo', purpose: 'brand lockup or ratings proof' },
      ],
    },
  };

  switch (category) {
    case 'finance':
      specs['concept-a'] = {
        name: 'Trust Hero',
        style: 'clean',
        recipe: 'trust-led-hero',
        strategy:
          'Lead with the clearest trust-building screen, favor calm framing, and keep the hierarchy precise rather than hype-driven.',
      };
      specs['concept-b'] = {
        name: 'Proof Motion',
        style: 'minimal',
        recipe: 'proof-led-momentum',
        strategy:
          'Use detail-heavy proof screens, measured contrast, and supporting crops to show confident money control.',
      };
      specs['concept-c'] = {
        ...specs['concept-c'],
        name: 'Editorial Confidence',
        strategy:
          'Build a premium, trust-led narrative with reporting proof, clean spacing, and a steadier editorial pace.',
        designGoal: 'Premium finance story with calm hierarchy, clear balances, and credible proof moments.',
        requiredElements: [
          { type: 'text', purpose: 'calm, trust-first headline blocks' },
          { type: 'device', purpose: 'clear product proof across the strip' },
          { type: 'group', purpose: 'paired crop-and-card systems for proof and detail clusters' },
          { type: 'logo', purpose: 'brand seal or supporting lockup' },
        ],
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Proof Panorama',
        strategy:
          'Use stronger proof moments, richer contrast, and a confident close while keeping the overall feel credible and controlled.',
        designGoal: buildCategoryGoalLine(category, goals),
      };
      break;
    case 'health':
      specs['concept-a'] = {
        name: 'Calm Hero',
        style: 'minimal',
        recipe: 'calm-hero',
        strategy:
          'Lead with the cleanest routine or progress screen and keep the layout supportive, calm, and easy to scan.',
      };
      specs['concept-b'] = {
        name: 'Routine Momentum',
        style: 'playful',
        recipe: 'routine-momentum',
        strategy:
          'Use gentle movement, supportive contrast, and rounded screenshot groupings to make progress feel approachable.',
      };
      specs['concept-c'] = {
        ...specs['concept-c'],
        name: 'Wellness Panorama',
        strategy:
          'Build a slower, supportive story around routine, progress, and gentle proof instead of raw feature density.',
        designGoal: 'Supportive wellness story with routine cues, progress proof, and generous whitespace.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Progress Panorama',
        strategy:
          'Treat the strip like a momentum arc, using stronger color and pacing while keeping the tone steady and encouraging.',
        designGoal: buildCategoryGoalLine(category, goals),
      };
      break;
    case 'productivity':
      specs['concept-a'] = {
        name: 'Workflow Hero',
        style: 'minimal',
        recipe: 'workflow-hero',
        strategy:
          'Lead with the clearest workflow or overview screen and keep the message decisive, practical, and easy to scan.',
      };
      specs['concept-b'] = {
        name: 'Focused Momentum',
        style: 'bold',
        recipe: 'focused-momentum',
        strategy:
          'Use stronger contrast and faster pacing to sell progress, control, and repeatable workflow moments.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        designGoal: buildCategoryGoalLine(category, goals),
      };
      break;
    case 'social':
      specs['concept-a'] = {
        name: 'Connection Hero',
        style: 'playful',
        recipe: 'connection-hero',
        strategy:
          'Lead with the most social or active screen, keep the hierarchy punchy, and make the concept feel human rather than utility-led.',
      };
      specs['concept-b'] = {
        name: 'Community Momentum',
        style: 'bold',
        recipe: 'community-momentum',
        strategy:
          'Use chat, feed, and discovery moments with faster pacing, contrast, and supporting screenshots to emphasize activity.',
      };
      specs['concept-c'] = {
        ...specs['concept-c'],
        name: 'Conversation Panorama',
        strategy:
          'Thread conversation, feed, and response moments into one connected social story with readable editorial pacing.',
        designGoal: 'Connected social story with conversation, community energy, and readable hierarchy.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Launch Panorama',
        strategy:
          'Treat the strip like a campaign for activity and response, with higher-energy transitions and stronger community proof.',
        designGoal: buildCategoryGoalLine(category, goals),
      };
      break;
    case 'creative':
      specs['concept-a'] = {
        name: 'Showcase Hero',
        style: 'editorial',
        recipe: 'showcase-hero',
        strategy:
          'Lead with the most visual screen and let the hierarchy feel showcase-led, spacious, and brand-conscious.',
      };
      specs['concept-b'] = {
        name: 'Studio Momentum',
        style: 'glow',
        recipe: 'studio-montage',
        strategy:
          'Use richer contrast, layered screenshots, and more visual rhythm so the concept feels expressive instead of utilitarian.',
      };
      specs['concept-c'] = {
        ...specs['concept-c'],
        name: 'Gallery Panorama',
        strategy:
          'Build an expressive editorial strip that treats screenshots like a visual gallery with supporting crop stories.',
        designGoal: 'Expressive showcase story with stronger detail, atmosphere, and visual hierarchy.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Portfolio Panorama',
        strategy:
          'Use stronger contrast, campaign pacing, and visual payoff so the strip feels like a polished launch story.',
        designGoal: buildCategoryGoalLine(category, goals),
      };
      break;
    case 'games':
      specs['concept-a'] = {
        name: 'Gameplay Hero',
        style: 'glow',
        recipe: 'gameplay-hero',
        strategy:
          'Lead with the strongest moment of gameplay or progression and give the opening concept more energy and immediate payoff.',
      };
      specs['concept-b'] = {
        name: 'Action Montage',
        style: 'bold',
        recipe: 'action-montage',
        strategy:
          'Use stronger motion, contrast, and layered screenshot groupings so the concept feels active and cinematic.',
      };
      specs['concept-c'] = {
        ...specs['concept-c'],
        name: 'World Panorama',
        strategy:
          'Build a connected world-and-progression story with moodier whitespace and clearer payoff beats across frames.',
        designGoal: 'Cinematic panoramic story with strong progression, atmosphere, and reward moments.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Cinematic Panorama',
        strategy:
          'Push transitions, contrast, and proof moments harder so the strip reads like a launch campaign for the game.',
        designGoal: buildCategoryGoalLine(category, goals),
      };
      break;
    default:
      specs['concept-d'] = {
        ...specs['concept-d'],
        designGoal: buildCategoryGoalLine(category, goals),
      };
      break;
  }

  return specs;
}

function buildPanoramicCompositionFeatures(args: {
  category: AppCategory;
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

  if (args.category === 'finance' && (args.storyBeat === 'hero' || args.storyBeat === 'differentiator')) {
    features.push('proof-stack');
  }
  if (args.category === 'social' && args.storyBeat === 'hero') {
    features.push('decorative-cluster');
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
  category: AppCategory,
  goals: string[],
  variantCount: number,
): PlannedVariant[] {
  const variants: PlannedVariant[] = [];
  const conceptSpecs = buildCategoryConceptSpecs(category, goals);
  const assignmentState = createCrossConceptAssignmentState();
  const conceptSequences = {
    'concept-a': arrangeScreensForConcept(selected, 'concept-a', category, assignmentState),
    'concept-b': variantCount >= 2
      ? arrangeScreensForConcept(selected, 'concept-b', category, assignmentState)
      : [],
    'concept-c': variantCount >= 3
      ? arrangeScreensForConcept(selected, 'concept-c', category, assignmentState)
      : [],
    'concept-d': variantCount >= 4
      ? arrangeScreensForConcept(selected, 'concept-d', category, assignmentState)
      : [],
  } satisfies Record<'concept-a' | 'concept-b' | 'concept-c' | 'concept-d', ScreenshotAnalysis[]>;
  const conceptA = conceptSpecs['concept-a'];
  const conceptB = conceptSpecs['concept-b'];
  const conceptC = conceptSpecs['concept-c'];
  const conceptD = conceptSpecs['concept-d'];
  const conceptE = conceptSpecs['concept-e'];

  variants.push({
    id: 'concept-a',
    name: conceptA.name,
    currentCapabilityFit: 'supported_now',
    mode: 'individual',
    style: conceptA.style,
    recipe: conceptA.recipe,
    strategy: conceptA.strategy,
    screens: buildIndividualVariantScreens({
      category,
      conceptId: 'concept-a',
      sequence: conceptSequences['concept-a'],
      supportUsage: assignmentState.supportUsage,
    }),
  });

  if (variantCount >= 2) {
    variants.push({
      id: 'concept-b',
      name: conceptB.name,
      currentCapabilityFit: 'supported_now',
      mode: 'individual',
      style: conceptB.style,
      recipe: conceptB.recipe,
      strategy: conceptB.strategy,
      screens: buildIndividualVariantScreens({
        category,
        conceptId: 'concept-b',
        sequence: conceptSequences['concept-b'],
        supportUsage: assignmentState.supportUsage,
      }),
    });
  }

  if (variantCount >= 3) {
    const editorialSequence = conceptSequences['concept-c'];
    variants.push({
      id: 'concept-c',
      name: conceptC.name,
      currentCapabilityFit: 'supported_now',
      mode: 'panoramic',
      style: conceptC.style,
      recipe: conceptC.recipe,
      strategy: conceptC.strategy,
      canvasPlan: {
        frameCount: Math.max(4, selected.length),
        designGoal: conceptC.designGoal ?? 'Premium, connected sequence with strong hierarchy and intentional whitespace.',
        requiredElements: conceptC.requiredElements ?? defaultEditorialElements(),
      },
      frames: editorialSequence.map((analysis, index) => {
        const storyBeat = buildSlideRole(index, editorialSequence.length);
        const compositionFeatures = buildPanoramicCompositionFeatures({
          category,
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
    const boldSequence = conceptSequences['concept-d'];
    variants.push({
      id: 'concept-d',
      name: conceptD.name,
      currentCapabilityFit: 'supported_now',
      mode: 'panoramic',
      style: conceptD.style,
      recipe: conceptD.recipe,
      strategy: conceptD.strategy,
      canvasPlan: {
        frameCount: Math.max(4, selected.length),
        designGoal: conceptD.designGoal ?? buildGoalLine(goals),
        requiredElements: conceptD.requiredElements ?? defaultBoldElements(),
      },
      frames: boldSequence.map((analysis, index) => {
        const storyBeat = buildSlideRole(index, boldSequence.length);
        const compositionFeatures = buildPanoramicCompositionFeatures({
          category,
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
      name: conceptE.name,
      currentCapabilityFit: 'partially_supported',
      mode: 'panoramic',
      style: conceptE.style,
      recipe: conceptE.recipe,
      strategy: conceptE.strategy,
      canvasPlan: {
        frameCount: Math.max(3, selected.length),
        designGoal: conceptE.designGoal ?? 'Poster-like brand-led sequence with strong color blocking.',
        requiredElements: conceptE.requiredElements ?? [],
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
    variants: buildVariantEntries(selected, category, goals, args.variantCount ?? 4),
  };
}
