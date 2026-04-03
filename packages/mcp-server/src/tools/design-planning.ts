import { basename, extname } from 'node:path';
import { execFile as execFileCallback } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import { inflateSync } from 'node:zlib';
import {
  defaultPanoramicSupportSystem,
  getPanoramicRecipeProfile,
  panoramicContinuityMotifLabel,
  panoramicRecipeArchetype,
  panoramicRecipeFamily,
  panoramicSupportSystemLabel,
  resolvePanoramicLayoutArchetype,
  resolvePanoramicRhythmRole,
  type PanoramicContinuityMotif,
  type PanoramicRhythmRole,
  type PanoramicSupportSystem,
} from './panoramic-recipe-system.js';

const execFile = promisify(execFileCallback);

export type {
  PanoramicContinuityMotif,
  PanoramicRecipeArchetype,
  PanoramicRecipeFamily,
  PanoramicRhythmRole,
  PanoramicSupportSystem,
} from './panoramic-recipe-system.js';

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
export type CropAnchor = 'focal-point' | 'upper-half' | 'lower-half' | 'left-rail' | 'right-rail' | 'center';
export type PlannedCropUsage = 'full-device' | 'loupe-detail' | 'supporting-crop' | 'layered-extract';
export type PlannedFrameTreatment = 'framed' | 'frameless' | 'mixed';
export type PanoramicCompositionFeature =
  | 'layered-detail-extract'
  | 'floating-detail-card'
  | 'decorative-cluster'
  | 'proof-stack'
  | 'activity-wave'
  | 'folio-stack'
  | 'toolbar-ribbon'
  | 'profile-orbit'
  | 'browse-strip'
  | 'route-arc'
  | 'media-marquee'
  | 'capture-focus'
  | 'timeline-band'
  | 'checkout-lane'
  | 'trust-shield'
  | 'support-beacon'
  | 'reward-ribbon';

const PANORAMIC_RHYTHM_ROLES: PanoramicRhythmRole[] = ['open', 'intensify', 'resolve'];
const PANORAMIC_SUPPORT_SYSTEMS: PanoramicSupportSystem[] = [
  'quote-stack',
  'metric-ladder',
  'signal-chain',
  'milestone-band',
  'curation-shelf',
  'proof-column',
];
const PANORAMIC_CONTINUITY_MOTIFS: PanoramicContinuityMotif[] = [
  'text-rail',
  'proof-lane',
  'signal-wave',
  'progress-track',
  'curation-run',
  'poster-anchor',
];

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
  semanticFlavor?: ScreenshotSemanticFlavor;
  semanticFlavorConfidence?: OrderingConfidence;
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
  occupiedRegions: SafeTextZone['label'][];
  focalPoint?: FocalPoint;
  pixelMetrics?: ScreenshotPixelMetrics;
  cropSuitability: CropSuitability;
  recommendedUsage: RecommendedUsage;
  unsafeForTextOverlay: boolean;
  textInsights?: ScreenshotTextInsights;
}

export interface PlannedFrameStrategy {
  defaultTreatment: PlannedFrameTreatment;
  framelessAllowedWhen: string[];
  rationale: string;
}

export interface PlannedCropPlan {
  usage: PlannedCropUsage;
  anchor: CropAnchor;
  avoidRegions: SafeTextZone['label'][];
  rationale: string;
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
    semanticFlavor?: ScreenshotSemanticFlavor;
    semanticFlavorConfidence?: OrderingConfidence;
    heroPriority: number;
    inferredOrder: number | null;
    focus: string;
    unsafeForTextOverlay: boolean;
    embeddedTextSample?: string[];
    textOccupiedRegions?: SafeTextZone['label'][];
  }>;
  variants: PlannedVariant[];
}

export interface CopyPlanningSignal {
  slot: 'hero' | 'differentiator' | 'feature' | 'trust' | 'summary';
  path: string;
  role: ScreenshotRole;
  density: ScreenshotDensity;
  focus: string;
  textRisk: TextRisk;
  embeddedText?: string[];
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
  cropPlan?: PlannedCropPlan;
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
  rhythmRole?: PanoramicRhythmRole;
  inferredRhythmRole?: PanoramicRhythmRole;
  layoutArchetype?: string;
  continuityRule?: string;
  continuityMotif?: PanoramicContinuityMotif;
  inferredContinuityMotif?: PanoramicContinuityMotif;
  supportSystem?: PanoramicSupportSystem;
  inferredSupportSystem?: PanoramicSupportSystem;
  artDirectionOverrides?: PanoramicFrameArtDirectionOverrides;
  transitionIntent?: string;
  cropPlan?: PlannedCropPlan;
  assetGuidance?: string;
  pacing?: string;
  compositionFeatures?: PanoramicCompositionFeature[];
  compositionNote?: string;
}

export interface PanoramicFrameArtDirectionOverrides {
  rhythmRole?: PanoramicRhythmRole;
  continuityMotif?: PanoramicContinuityMotif;
  supportSystem?: PanoramicSupportSystem;
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
  frameStrategy?: PlannedFrameStrategy;
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
  frameStrategy?: PlannedFrameStrategy;
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
  { role: 'discovery', pattern: /\b(search|discover|explore|browse|find|trending|for you|template|templates|library|libraries|map|maps|nearby|location|locations|places)\b/g, weight: 12 },
  { role: 'workflow', pattern: /\b(calendar|plan|task|workflow|schedule|editor|compose|create|checklist|project)\b/g, weight: 10 },
  { role: 'detail', pattern: /\b(detail|profile|report|analytics|stats|insight|summary|progress|revenue|spending|results?|player|playlist|album|episode|podcast|video|stream|lyrics)\b/g, weight: 10 },
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

interface TextSemanticSignals {
  onboardingSignalCount: number;
  paywallSignalCount: number;
  settingsSignalCount: number;
  communicationSignalCount: number;
  workflowSignalCount: number;
  discoverySignalCount: number;
  dashboardSignalCount: number;
  reportingSignalCount: number;
  numericTokenCount: number;
  shortLabelCount: number;
  leftRailLabelCount: number;
  alternatingConversationColumns: boolean;
}

export type ScreenshotSemanticFlavor =
  | 'activity'
  | 'profile'
  | 'editor'
  | 'catalog'
  | 'document'
  | 'map'
  | 'media'
  | 'capture'
  | 'schedule'
  | 'commerce'
  | 'security'
  | 'support'
  | 'reward';

type SemanticFlavor = ScreenshotSemanticFlavor;

interface SemanticFlavorSignals {
  activitySignalCount: number;
  profileSignalCount: number;
  editorSignalCount: number;
  catalogSignalCount: number;
  documentSignalCount: number;
  mapSignalCount: number;
  mediaSignalCount: number;
  captureSignalCount: number;
  scheduleSignalCount: number;
  commerceSignalCount: number;
  securitySignalCount: number;
  supportSignalCount: number;
  rewardSignalCount: number;
  communicationConflictCount: number;
  settingsConflictCount: number;
  paywallConflictCount: number;
  onboardingConflictCount: number;
  reportingConflictCount: number;
  mediaConflictCount: number;
}

const SEMANTIC_FLAVOR_ROLE_HINTS: Record<SemanticFlavor, ScreenshotRole[]> = {
  activity: ['discovery', 'home', 'communication'],
  profile: ['detail', 'communication', 'discovery'],
  editor: ['workflow', 'detail'],
  catalog: ['discovery', 'home', 'detail'],
  document: ['detail', 'workflow'],
  map: ['discovery', 'home', 'detail'],
  media: ['detail', 'discovery', 'communication'],
  capture: ['workflow', 'detail', 'home'],
  schedule: ['workflow', 'home', 'detail'],
  commerce: ['detail', 'workflow', 'discovery', 'home'],
  security: ['onboarding', 'detail', 'settings'],
  support: ['detail', 'communication', 'settings'],
  reward: ['detail', 'discovery', 'home'],
};

function countNumericTokens(value: string): number {
  return value.match(/\b[$€£]?\d+(?:[.,]\d+)?%?\b/g)?.length ?? 0;
}

function deriveTextSemanticSignals(
  textInsights?: ScreenshotTextInsights,
): TextSemanticSignals {
  const normalized = normalizeText(textInsights?.text ?? '');
  const blocks = textInsights?.blocks ?? [];
  const shortLabelCount = blocks.filter((block) => compactTextPhrase(block.text).split(' ').filter(Boolean).length <= 4).length;
  const leftRailLabelCount = blocks.filter((block) =>
    block.x <= 28 && compactTextPhrase(block.text).split(' ').filter(Boolean).length <= 4).length;
  const leftColumnCount = blocks.filter((block) => block.x <= 26).length;
  const rightColumnCount = blocks.filter((block) => block.x >= 44).length;

  return {
    onboardingSignalCount: countRegexMatches(
      normalized,
      /\b(onboarding|welcome|intro|start|continue|next|skip|allow|enable|permission|permissions|notifications|camera|location|contacts|microphone|tracking)\b/g,
    ),
    paywallSignalCount: countRegexMatches(
      normalized,
      /\b(upgrade|premium|pro|subscribe|subscription|trial|yearly|monthly|month|year|plan|plans|billing|restore|unlock)\b/g,
    ),
    settingsSignalCount: countRegexMatches(
      normalized,
      /\b(settings|account|profile|preferences|privacy|notifications|security|appearance|theme|language|devices|billing|help|support|manage)\b/g,
    ),
    communicationSignalCount: countRegexMatches(
      normalized,
      /\b(chat|message|messages|reply|typing|thread|threads|inbox|send|voice note|call|channel|channels|members|group|dm|unread)\b/g,
    ),
    workflowSignalCount: countRegexMatches(
      normalized,
      /\b(calendar|plan|planner|task|tasks|workflow|schedule|scheduled|editor|compose|create|creator|draft|publish|checklist|project|projects)\b/g,
    ),
    discoverySignalCount: countRegexMatches(
      normalized,
      /\b(search|discover|discovery|explore|browse|find|trending|for you|categories|collections|popular|template|templates|library|libraries|map|maps|nearby|near me|location|locations|places)\b/g,
    ),
    dashboardSignalCount: countRegexMatches(
      normalized,
      /\b(home|dashboard|overview|summary|today|activity|wallet|balance)\b/g,
    ),
    reportingSignalCount: countRegexMatches(
      normalized,
      /\b(report|reports|analytics|stats|insight|insights|trend|trends|revenue|spending|expense|expenses|cash flow|performance|conversion)\b/g,
    ),
    numericTokenCount: countNumericTokens(normalized),
    shortLabelCount,
    leftRailLabelCount,
    alternatingConversationColumns: leftColumnCount >= 2 && rightColumnCount >= 1,
  };
}

function buildSemanticHaystack(
  pathValue: string,
  note?: string,
  textInsights?: ScreenshotTextInsights,
): string {
  return normalizeText(`${humanizeFileStem(pathValue)} ${note ?? ''} ${textInsights?.text ?? ''}`);
}

function deriveSemanticFlavorSignals(haystack: string): SemanticFlavorSignals {
  return {
    activitySignalCount: countRegexMatches(
      haystack,
      /\b(activity|activities|updates|update|posts|post|stories|story|comments|comment|likes|like|reactions|reaction|following|followers|social pulse|community pulse)\b/g,
    ),
    profileSignalCount: countRegexMatches(
      haystack,
      /\b(profile|creator|creators|community|communities|followers|following|member|members|bio|audience|channel|supporters?)\b/g,
    ),
    editorSignalCount: countRegexMatches(
      haystack,
      /\b(editor|editing|edit|canvas|timeline|layer|layers|workspace|storyboard|scene|draft|remix|studio|tool|tools|filter|filters|adjust)\b/g,
    ),
    catalogSignalCount: countRegexMatches(
      haystack,
      /\b(shop|store|catalog|collection|collections|product|products|item|items|listing|listings|wishlist|marketplace|featured|price|prices)\b/g,
    ),
    documentSignalCount: countRegexMatches(
      haystack,
      /\b(document|documents|doc|docs|pdf|invoice|invoices|statement|statements|contract|contracts|file|files|reader|reading|review|approvals|signature|signatures|record|records|page|pages)\b/g,
    ),
    mapSignalCount: countRegexMatches(
      haystack,
      /\b(map|maps|route|routes|navigation|navigate|directions|trip|trips|ride|rides|nearby|near me|location|locations|places|delivery|travel|journey)\b/g,
    ),
    mediaSignalCount: countRegexMatches(
      haystack,
      /\b(player|playlist|playlists|album|albums|song|songs|artist|artists|podcast|podcasts|episode|episodes|listen|listening|watch|video|videos|stream|streaming|queue|lyrics|mix|radio)\b/g,
    ),
    captureSignalCount: countRegexMatches(
      haystack,
      /\b(camera|capture|captured|scanner|scan|scanning|record|recording|lens|photo|photos|selfie|snapshot|snap|viewfinder|shutter|barcode|qr|receipt|receipts|document scan|live preview)\b/g,
    ),
    scheduleSignalCount: countRegexMatches(
      haystack,
      /\b(calendar|agenda|schedule|scheduled|event|events|booking|bookings|appointment|appointments|availability|itinerary|reservation|reservations|shift|shifts|planner|timeline|time slots?|run of show)\b/g,
    ),
    commerceSignalCount: countRegexMatches(
      haystack,
      /\b(cart|bag|basket|checkout|order|orders|shipping|shipment|shipments|delivery|deliveries|merchant|merchants|purchase|purchases|buy|storefront|fulfillment|tracking order|track order)\b/g,
    ),
    securitySignalCount: countRegexMatches(
      haystack,
      /\b(login|log in|sign in|signin|password|passwords|passcode|passcodes|passkey|passkeys|authentication|authenticate|auth|security|secure|vault|biometric|face id|touch id|verification|verify|verified|otp|2fa|identity)\b/g,
    ),
    supportSignalCount: countRegexMatches(
      haystack,
      /\b(help|help center|helpdesk|support|support center|support hub|faq|faqs|knowledge base|ticket|tickets|case|cases|troubleshoot|troubleshooting|resolution|resolve|issue status)\b/g,
    ),
    rewardSignalCount: countRegexMatches(
      haystack,
      /\b(reward|rewards|loyalty|points|perk|perks|cashback|cash back|redeem|redemption|bonus|bonuses|membership|member benefits|member perks|tier|tiers)\b/g,
    ),
    communicationConflictCount: countRegexMatches(
      haystack,
      /\b(chat|message|messages|inbox|thread|threads|reply|replies|typing|dm|call|calls)\b/g,
    ),
    settingsConflictCount: countRegexMatches(
      haystack,
      /\b(settings|preferences|privacy|security|notifications|billing|manage)\b/g,
    ),
    paywallConflictCount: countRegexMatches(
      haystack,
      /\b(premium|upgrade|subscription|trial|checkout|payment|unlock)\b/g,
    ),
    onboardingConflictCount: countRegexMatches(
      haystack,
      /\b(onboarding|welcome|intro|continue|skip|allow|enable|permission|permissions|notifications|location|contacts|microphone|tracking)\b/g,
    ),
    reportingConflictCount: countRegexMatches(
      haystack,
      /\b(report|reports|analytics|stats|insight|insights|trend|trends|performance|conversion|revenue|spending)\b/g,
    ),
    mediaConflictCount: countRegexMatches(
      haystack,
      /\b(player|playlist|playlists|album|albums|song|songs|artist|artists|podcast|podcasts|episode|episodes|listen|listening|watch|video|videos|stream|streaming|queue|lyrics|mix|radio)\b/g,
    ),
  };
}

function semanticFlavorSignalCount(
  signals: SemanticFlavorSignals,
  flavor: SemanticFlavor,
): number {
  switch (flavor) {
    case 'activity':
      return signals.activitySignalCount;
    case 'profile':
      return signals.profileSignalCount;
    case 'editor':
      return signals.editorSignalCount;
    case 'catalog':
      return signals.catalogSignalCount;
    case 'document':
      return signals.documentSignalCount;
    case 'map':
      return signals.mapSignalCount;
    case 'media':
      return signals.mediaSignalCount;
    case 'capture':
      return signals.captureSignalCount;
    case 'schedule':
      return signals.scheduleSignalCount;
    case 'commerce':
      return signals.commerceSignalCount;
    case 'security':
      return signals.securitySignalCount;
    case 'support':
      return signals.supportSignalCount;
    case 'reward':
      return signals.rewardSignalCount;
  }
}

function semanticFlavorMatchesRole(
  flavor: SemanticFlavor,
  role?: ScreenshotRole,
): boolean {
  if (!role || role === 'unknown' || role === 'feature') return true;
  return (SEMANTIC_FLAVOR_ROLE_HINTS[flavor] ?? []).includes(role);
}

function rasterFlavorBonus(score = 0): number {
  if (score >= 6) return 4;
  if (score >= 5) return 3;
  if (score >= 4) return 2;
  if (score >= 3) return 1;
  return 0;
}

function inferSemanticFlavorDetails(args: {
  pathValue: string;
  note?: string;
  textInsights?: ScreenshotTextInsights;
  role?: ScreenshotRole;
  rasterSemanticSignals?: RasterSemanticSignals;
}): {
  flavor?: SemanticFlavor;
  confidence?: OrderingConfidence;
} {
  const haystack = buildSemanticHaystack(args.pathValue, args.note, args.textInsights);
  const signals = deriveSemanticFlavorSignals(haystack);
  const hasTextInsights = Boolean(
    args.textInsights && (args.textInsights.blocks.length > 0 || args.textInsights.text.trim().length > 0),
  );
  const rasterSemanticSignals = args.rasterSemanticSignals;
  const activityScore = signals.activitySignalCount > 0
    ? (signals.activitySignalCount * 2)
      + (args.role === 'discovery' || args.role === 'home' ? 2 : args.role === 'communication' ? 1 : 0)
      + (signals.profileSignalCount >= 1 ? 1 : 0)
      - Math.min(2, signals.communicationConflictCount)
      - Math.min(1, signals.settingsConflictCount)
      - Math.min(1, signals.paywallConflictCount)
    : 0;
  const profileScore = (signals.profileSignalCount * 2)
    + (args.role === 'detail' || args.role === 'communication' || args.role === 'discovery' ? 1 : 0)
    - (signals.settingsConflictCount >= 2 ? 3 : signals.settingsConflictCount);
  const editorScore = (signals.editorSignalCount * 2)
    + (args.role === 'workflow' ? 2 : args.role === 'detail' ? 1 : 0)
    + rasterFlavorBonus(rasterSemanticSignals?.editorFlavorScore)
    + ((rasterSemanticSignals?.editorFlavorScore ?? 0) > (rasterSemanticSignals?.documentFlavorScore ?? 0) ? 1 : 0)
    - Math.min(2, signals.settingsConflictCount)
    - Math.min(2, signals.paywallConflictCount);
  const catalogScore = (signals.catalogSignalCount * 2)
    + (args.role === 'discovery' ? 2 : args.role === 'home' ? 1 : 0)
    + rasterFlavorBonus(rasterSemanticSignals?.catalogFlavorScore)
    - (signals.paywallConflictCount >= 2 ? 4 : signals.paywallConflictCount);
  const documentScore = signals.documentSignalCount > 0
    ? (signals.documentSignalCount * 2)
      + (args.role === 'detail' ? 2 : args.role === 'workflow' ? 1 : 0)
      + rasterFlavorBonus(rasterSemanticSignals?.documentFlavorScore)
      + (signals.scheduleSignalCount >= 1 ? 1 : 0)
      - Math.min(2, signals.reportingConflictCount)
      - Math.min(1, signals.editorSignalCount)
      - ((rasterSemanticSignals?.editorFlavorScore ?? 0) > (rasterSemanticSignals?.documentFlavorScore ?? 0) ? 2 : 0)
      - (signals.captureSignalCount > signals.documentSignalCount ? 2 : 0)
      - Math.min(1, signals.paywallConflictCount)
    : ((args.role === 'detail' ? 2 : args.role === 'workflow' ? 1 : 0)
      + rasterFlavorBonus(rasterSemanticSignals?.documentFlavorScore)
      - ((rasterSemanticSignals?.editorFlavorScore ?? 0) > (rasterSemanticSignals?.documentFlavorScore ?? 0) ? 2 : 0));
  const mapScore = (signals.mapSignalCount * 2)
    + (args.role === 'discovery' || args.role === 'home' ? 2 : args.role === 'detail' ? 1 : 0)
    + rasterFlavorBonus(rasterSemanticSignals?.mapFlavorScore)
    - Math.min(2, signals.settingsConflictCount)
    - Math.min(2, signals.paywallConflictCount);
  const mediaScore = (signals.mediaSignalCount * 2)
    + (args.role === 'detail' ? 2 : args.role === 'discovery' || args.role === 'communication' ? 1 : 0)
    + rasterFlavorBonus(rasterSemanticSignals?.mediaFlavorScore)
    - Math.min(2, signals.settingsConflictCount)
    - Math.min(2, signals.paywallConflictCount);
  const commerceScore = (signals.commerceSignalCount * 2)
    + (args.role === 'detail' || args.role === 'workflow' ? 2 : args.role === 'discovery' || args.role === 'home' ? 1 : 0)
    + (signals.catalogSignalCount >= 1 ? 1 : 0)
    - (signals.paywallConflictCount > signals.commerceSignalCount ? 2 : 0)
    - Math.min(1, signals.settingsConflictCount);
  const securityScore = signals.securitySignalCount > 0
    ? (signals.securitySignalCount * 2)
      + (args.role === 'onboarding' ? 2 : args.role === 'detail' || args.role === 'settings' ? 1 : 0)
      + Math.min(1, signals.onboardingConflictCount)
      - Math.min(2, signals.paywallConflictCount)
      - Math.min(1, signals.catalogSignalCount)
    : 0;
  const supportScore = signals.supportSignalCount > 0
    ? (signals.supportSignalCount * 2)
      + (args.role === 'communication' ? 2 : args.role === 'detail' || args.role === 'settings' ? 1 : 0)
      - Math.min(2, signals.settingsConflictCount)
      - Math.min(1, signals.onboardingConflictCount)
    : 0;
  const rewardScore = signals.rewardSignalCount > 0
    ? (signals.rewardSignalCount * 2)
      + (args.role === 'detail' || args.role === 'discovery' ? 2 : args.role === 'home' ? 1 : 0)
      + (signals.commerceSignalCount >= 1 ? 1 : 0)
      - (signals.paywallConflictCount > signals.rewardSignalCount ? 2 : 0)
      - Math.min(1, signals.settingsConflictCount)
      - Math.min(1, signals.profileSignalCount)
    : 0;
  const captureScore = (signals.captureSignalCount * 2)
    + (args.role === 'workflow' || args.role === 'detail' ? 2 : args.role === 'home' ? 1 : 0)
    + rasterFlavorBonus(rasterSemanticSignals?.captureFlavorScore)
    + ((rasterSemanticSignals?.captureFlavorScore ?? 0) >= 6 ? 2 : (rasterSemanticSignals?.captureFlavorScore ?? 0) >= 5 ? 1 : 0)
    + ((rasterSemanticSignals?.captureFlavorScore ?? 0) > (rasterSemanticSignals?.mediaFlavorScore ?? 0) ? 1 : 0)
    - Math.min(2, signals.mediaConflictCount)
    - Math.min(2, signals.settingsConflictCount)
    - ((args.role === 'paywall' || (rasterSemanticSignals?.paywallScore ?? 0) >= 4) ? 4 : 0)
    - (args.role === 'onboarding' ? 4 : Math.min(2, signals.onboardingConflictCount));
  const scheduleScore = (signals.scheduleSignalCount * 2)
    + (args.role === 'workflow' ? 2 : args.role === 'home' || args.role === 'detail' ? 1 : 0)
    - Math.min(2, signals.reportingConflictCount)
    - Math.min(1, signals.settingsConflictCount)
    - Math.min(2, signals.editorSignalCount);
  const ranked: Array<{ flavor: SemanticFlavor; score: number }> = [
    { flavor: 'activity', score: activityScore },
    { flavor: 'commerce', score: commerceScore },
    { flavor: 'security', score: securityScore },
    { flavor: 'support', score: supportScore },
    { flavor: 'reward', score: rewardScore },
    { flavor: 'document', score: documentScore },
    { flavor: 'capture', score: captureScore },
    { flavor: 'schedule', score: scheduleScore },
    { flavor: 'editor', score: editorScore },
    { flavor: 'catalog', score: catalogScore },
    { flavor: 'profile', score: profileScore },
    { flavor: 'map', score: mapScore },
    { flavor: 'media', score: mediaScore },
  ];
  ranked.sort((left, right) => right.score - left.score);
  const best = ranked[0];
  const runnerUp = ranked[1];

  if (!best || best.score < 3) return {};

  const signalCount = semanticFlavorSignalCount(signals, best.flavor);
  const margin = best.score - (runnerUp?.score ?? 0);
  const roleAligned = semanticFlavorMatchesRole(best.flavor, args.role);
  let minScore = 3;
  let minMargin = 0;

  if (!hasTextInsights) {
    minScore = 4;
    minMargin = 2;
    if (signalCount <= 1) minScore += 1;
  }
  if (!roleAligned) {
    minScore += 1;
    minMargin += 1;
  }

  if (
    !hasTextInsights
    && args.role === 'settings'
    && (best.flavor === 'security' || best.flavor === 'support')
    && signals.settingsConflictCount > signalCount
  ) {
    return {};
  }

  if (
    !hasTextInsights
    && args.role === 'paywall'
    && (best.flavor === 'commerce' || best.flavor === 'reward')
    && signalCount <= Math.max(2, signals.paywallConflictCount)
    && (rasterSemanticSignals?.paywallScore ?? 0) >= 4
    && (rasterSemanticSignals?.discoveryScore ?? 0) <= 4
  ) {
    return {};
  }

  if (best.score < minScore || margin < minMargin) return {};

  const confidence: OrderingConfidence =
    best.score >= (hasTextInsights ? 7 : 8) && margin >= 3 && signalCount >= 2
      ? 'high'
      : best.score >= (hasTextInsights ? 4 : 5) && margin >= (hasTextInsights ? 1 : 2)
        ? 'medium'
        : 'low';

  if (!hasTextInsights && confidence === 'low') return {};

  return {
    flavor: best.flavor,
    confidence,
  };
}

function inferSemanticFlavor(args: {
  pathValue: string;
  note?: string;
  textInsights?: ScreenshotTextInsights;
  role?: ScreenshotRole;
}): SemanticFlavor | undefined {
  return inferSemanticFlavorDetails(args).flavor;
}

function analysisSemanticFlavor(analysis: Pick<
  ScreenshotAnalysis,
  'semanticFlavor' | 'path' | 'note' | 'textInsights' | 'role'
>): SemanticFlavor | undefined {
  return analysis.semanticFlavor ?? inferSemanticFlavor({
    pathValue: analysis.path,
    note: analysis.note,
    textInsights: analysis.textInsights,
    role: analysis.role,
  });
}

function isLikelyOnboardingScreen(
  signals: TextSemanticSignals,
  textInsights?: ScreenshotTextInsights,
): boolean {
  if (!textInsights) return false;
  return signals.onboardingSignalCount >= 2 && textInsights.lineCount <= 6 && textInsights.totalCoverage <= 0.16;
}

function isLikelyPaywallScreen(signals: TextSemanticSignals): boolean {
  return signals.paywallSignalCount >= 2;
}

function isLikelySettingsScreen(signals: TextSemanticSignals): boolean {
  return signals.settingsSignalCount >= 2 || signals.leftRailLabelCount >= 4;
}

function isLikelyCommunicationScreen(
  signals: TextSemanticSignals,
  textInsights?: ScreenshotTextInsights,
): boolean {
  if (!textInsights) return false;
  return signals.communicationSignalCount >= 2
    || (signals.alternatingConversationColumns && textInsights.blocks.length >= 4);
}

function isLikelyWorkflowScreen(signals: TextSemanticSignals): boolean {
  return signals.workflowSignalCount >= 2
    && signals.settingsSignalCount <= 1
    && signals.discoverySignalCount <= 1;
}

function isLikelyDiscoveryScreen(signals: TextSemanticSignals): boolean {
  return signals.discoverySignalCount >= 2
    && signals.communicationSignalCount <= 1;
}

function isLikelyDataHeavyDashboard(signals: TextSemanticSignals): boolean {
  return signals.dashboardSignalCount >= 1 && signals.numericTokenCount >= 4;
}

function isLikelyReportingScreen(signals: TextSemanticSignals): boolean {
  return signals.reportingSignalCount >= 1 && signals.numericTokenCount >= 4;
}

function applySemanticFlavorRoleScores(
  scores: Record<ScreenshotRole, number>,
  pathValue: string,
  note?: string,
  textInsights?: ScreenshotTextInsights,
): void {
  const haystack = buildSemanticHaystack(pathValue, note, textInsights);
  const signals = deriveSemanticFlavorSignals(haystack);

  if (signals.activitySignalCount >= 2 && signals.communicationConflictCount <= 1) {
    scores.discovery += 12;
    scores.home += 8;
    scores.communication += 4;
    scores.settings = Math.max(0, scores.settings - 8);
    scores.paywall = Math.max(0, scores.paywall - 4);
  }

  if (signals.profileSignalCount >= 2 && signals.settingsConflictCount <= 1) {
    scores.detail += 14;
    scores.communication += 4;
    scores.settings = Math.max(0, scores.settings - 8);
  }

  if (signals.editorSignalCount >= 2) {
    scores.workflow += 12;
    scores.detail += 3;
    scores.settings = Math.max(0, scores.settings - 6);
    scores.home = Math.max(0, scores.home - 3);
  }

  if (signals.catalogSignalCount >= 2 && signals.paywallConflictCount <= 1) {
    scores.discovery += 18;
    scores.home += 3;
    scores.settings = Math.max(0, scores.settings - 8);
    scores.paywall = Math.max(0, scores.paywall - 8);
  }

  if (signals.documentSignalCount >= 2) {
    scores.detail += 14;
    scores.workflow += 6;
    scores.settings = Math.max(0, scores.settings - 6);
    scores.paywall = Math.max(0, scores.paywall - 4);
  }

  if (signals.mapSignalCount >= 2 && signals.settingsConflictCount <= 1) {
    scores.discovery += 16;
    scores.home += 6;
    scores.detail += 4;
    scores.settings = Math.max(0, scores.settings - 6);
    scores.paywall = Math.max(0, scores.paywall - 4);
  }

  if (signals.mediaSignalCount >= 2 && signals.paywallConflictCount <= 1) {
    scores.detail += 14;
    scores.discovery += 6;
    scores.communication += 2;
    scores.settings = Math.max(0, scores.settings - 6);
  }

  if (signals.commerceSignalCount >= 2) {
    scores.detail += 12;
    scores.workflow += 8;
    scores.discovery += 6;
    scores.paywall = Math.max(0, scores.paywall - 14);
    scores.settings = Math.max(0, scores.settings - 6);
  }

  if (signals.securitySignalCount >= 2) {
    scores.onboarding += 10;
    scores.detail += 8;
    scores.settings += 4;
    scores.paywall = Math.max(0, scores.paywall - 6);
  }

  if (signals.supportSignalCount >= 2) {
    scores.detail += 10;
    scores.communication += 8;
    scores.settings = Math.max(0, scores.settings - 12);
    scores.onboarding = Math.max(0, scores.onboarding - 4);
  }

  if (signals.rewardSignalCount >= 2) {
    scores.detail += 10;
    scores.discovery += 8;
    scores.home += 2;
    scores.paywall = Math.max(0, scores.paywall - 12);
    scores.settings = Math.max(0, scores.settings - 6);
  }
}

function applySemanticRoleScores(
  scores: Record<ScreenshotRole, number>,
  textInsights?: ScreenshotTextInsights,
): void {
  if (!textInsights) return;

  const signals = deriveTextSemanticSignals(textInsights);
  const dashboardLike = isLikelyDataHeavyDashboard(signals);
  const reportingLike = isLikelyReportingScreen(signals);

  if (isLikelyOnboardingScreen(signals, textInsights)) {
    scores.onboarding += 26;
  }
  if (isLikelyPaywallScreen(signals)) {
    scores.paywall += 24 + Math.min(12, signals.paywallSignalCount * 2);
  }
  if (isLikelySettingsScreen(signals)) {
    scores.settings += 22;
  }
  if (isLikelyCommunicationScreen(signals, textInsights)) {
    scores.communication += 20;
  }
  if (isLikelyWorkflowScreen(signals)) {
    scores.workflow += 18;
  }
  if (isLikelyDiscoveryScreen(signals)) {
    scores.discovery += 18;
  }
  if (dashboardLike) {
    scores.home += 18 + (signals.dashboardSignalCount >= signals.reportingSignalCount ? 4 : 0);
  }
  if (reportingLike) {
    scores.detail += dashboardLike && signals.dashboardSignalCount >= signals.reportingSignalCount ? 10 : 22;
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

function compactTextPhrase(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 4)
    .join(' ');
}

function sampleEmbeddedTextPhrases(
  textInsights?: ScreenshotTextInsights,
  limit = 2,
): string[] {
  if (!textInsights) return [];

  const rankedBlocks = [...textInsights.blocks]
    .sort((left, right) => {
      const leftScore = (left.width * left.height) * (left.confidence ?? 1);
      const rightScore = (right.width * right.height) * (right.confidence ?? 1);
      return rightScore - leftScore;
    })
    .map((block) => block.text);
  const fallbackLines = textInsights.text.split(/\n+/).map((line) => line.trim());
  const seen = new Set<string>();

  return [...rankedBlocks, ...fallbackLines]
    .map((value) => compactTextPhrase(value))
    .filter((value) => /[a-z]/i.test(value) && value.length >= 4)
    .filter((value) => {
      const normalized = normalizeText(value);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .slice(0, limit);
}

function inferTextOccupiedRegions(textInsights?: ScreenshotTextInsights): SafeTextZone['label'][] {
  if (!textInsights || textInsights.blocks.length === 0) return [];

  const seen = new Set<SafeTextZone['label']>();
  for (const block of textInsights.blocks) {
    const centerX = block.x + (block.width / 2);
    const centerY = block.y + (block.height / 2);

    if (block.y < 30 || centerY < 22) seen.add('top');
    if (block.y + block.height > 70 || centerY > 78) seen.add('bottom');
    if (block.x < 24 || centerX < 22) seen.add('left');
    if (block.x + block.width > 76 || centerX > 78) seen.add('right');
    if (centerX >= 28 && centerX <= 72 && centerY >= 24 && centerY <= 76) seen.add('center');
  }

  return ['top', 'bottom', 'left', 'right', 'center'].filter((label) => seen.has(label as SafeTextZone['label'])) as SafeTextZone['label'][];
}

function mergeOccupiedRegions(
  ...regions: Array<SafeTextZone['label'][] | undefined>
): SafeTextZone['label'][] {
  const seen = new Set<SafeTextZone['label']>();
  for (const list of regions) {
    for (const label of list ?? []) {
      seen.add(label);
    }
  }

  return ['top', 'bottom', 'left', 'right', 'center'].filter((label) =>
    seen.has(label as SafeTextZone['label'])) as SafeTextZone['label'][];
}

function scoreDominates(
  score: number,
  competitors: number[],
  minMargin = 1,
): boolean {
  return score >= 4 && score >= (Math.max(0, ...competitors) + minMargin);
}

function applyRasterRoleScores(
  scores: Record<ScreenshotRole, number>,
  semanticSignals?: RasterSemanticSignals,
): void {
  if (!semanticSignals) return;

  if (scoreDominates(
    semanticSignals.onboardingScore,
    [semanticSignals.paywallScore, semanticSignals.workflowScore, semanticSignals.settingsScore],
  )) {
    scores.onboarding += 10;
  }
  if (scoreDominates(
    semanticSignals.paywallScore,
    [semanticSignals.onboardingScore, semanticSignals.workflowScore, semanticSignals.discoveryScore],
  )) {
    scores.paywall += 24;
  }
  if (scoreDominates(
    semanticSignals.settingsScore,
    [semanticSignals.communicationScore, semanticSignals.dashboardScore, semanticSignals.discoveryScore],
  )) {
    scores.settings += 18;
  }
  if (scoreDominates(
    semanticSignals.communicationScore,
    [semanticSignals.settingsScore, semanticSignals.discoveryScore],
  )) {
    scores.communication += 20;
  }
  if (scoreDominates(
    semanticSignals.workflowScore,
    [semanticSignals.onboardingScore, semanticSignals.paywallScore, semanticSignals.settingsScore],
  )) {
    scores.workflow += 22;
  }
  if (scoreDominates(
    semanticSignals.discoveryScore,
    [semanticSignals.dashboardScore, semanticSignals.communicationScore, semanticSignals.settingsScore],
  )) {
    scores.discovery += 18;
  }
  if (scoreDominates(
    semanticSignals.dashboardScore,
    [
      semanticSignals.reportingScore,
      semanticSignals.discoveryScore,
      semanticSignals.settingsScore,
      semanticSignals.workflowScore,
    ],
    semanticSignals.reportingScore >= semanticSignals.dashboardScore ? 2 : 1,
  )) {
    scores.home += 18;
  }
  if (scoreDominates(
    semanticSignals.reportingScore,
    [
      semanticSignals.dashboardScore,
      semanticSignals.discoveryScore,
      semanticSignals.workflowScore,
      semanticSignals.paywallScore,
    ],
  )) {
    scores.detail += 20;
  }
}

function inferRole(
  pathValue: string,
  note?: string,
  textInsights?: ScreenshotTextInsights,
  rasterSemanticSignals?: RasterSemanticSignals,
): ScreenshotRole {
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
  applySemanticFlavorRoleScores(scores, pathValue, note, textInsights);
  applySemanticRoleScores(scores, textInsights);
  applyRasterRoleScores(scores, rasterSemanticSignals);
  if (textInsights?.roleHint) scores[textInsights.roleHint] += 24;

  return bestRoleFromScores(scores);
}

function inferDensity(
  role: ScreenshotRole,
  pathValue: string,
  note?: string,
  textInsights?: ScreenshotTextInsights,
  rasterSemanticSignals?: RasterSemanticSignals,
): ScreenshotDensity {
  const haystack = normalizeText(`${humanizeFileStem(pathValue)} ${note ?? ''}`);
  const semanticSignals = deriveTextSemanticSignals(textInsights);

  if (textInsights) {
    if (isLikelyOnboardingScreen(semanticSignals, textInsights)) return 'minimal';
    if (isLikelySettingsScreen(semanticSignals) || isLikelyCommunicationScreen(semanticSignals, textInsights)) return 'dense';
    if (isLikelyWorkflowScreen(semanticSignals) || isLikelyDiscoveryScreen(semanticSignals)) return 'balanced';
    if (isLikelyDataHeavyDashboard(semanticSignals) || isLikelyReportingScreen(semanticSignals)) return 'dense';
    if (isLikelyPaywallScreen(semanticSignals)) {
      return textInsights.totalCoverage >= 0.14 || textInsights.lineCount >= 6 ? 'dense' : 'balanced';
    }
    if (textInsights.totalCoverage >= 0.2 || textInsights.lineCount >= 10) return 'dense';
    if (textInsights.totalCoverage <= 0.04 && textInsights.lineCount <= 2) return 'minimal';
  }

  if (rasterSemanticSignals) {
    if (rasterSemanticSignals.onboardingScore >= 4) return 'minimal';
    if (rasterSemanticSignals.settingsScore >= 4 || rasterSemanticSignals.communicationScore >= 4) return 'dense';
    if (rasterSemanticSignals.workflowScore >= 5 || rasterSemanticSignals.discoveryScore >= 5) return 'balanced';
    if (rasterSemanticSignals.dashboardScore >= 4 || rasterSemanticSignals.reportingScore >= 4) return 'dense';
    if (rasterSemanticSignals.paywallScore >= 4) return role === 'paywall' ? 'balanced' : 'dense';
  }

  if (role === 'onboarding') return 'minimal';
  if (role === 'settings' || role === 'communication') return 'dense';
  if (role === 'workflow' || role === 'discovery') return 'balanced';
  if (/(list|feed|table|settings|calendar|report|analytics|chat)/.test(haystack)) return 'dense';
  if (/(welcome|splash|intro|hero)/.test(haystack)) return 'minimal';
  return 'balanced';
}

function inferTextRisk(density: ScreenshotDensity): TextRisk {
  if (density === 'minimal') return 'low';
  if (density === 'dense') return 'high';
  return 'medium';
}

function mergeDensitySignals(
  rasterDensity: ScreenshotDensity | undefined,
  inferredDensity: ScreenshotDensity,
): ScreenshotDensity {
  if (!rasterDensity) return inferredDensity;
  if (rasterDensity === 'dense' || inferredDensity === 'dense') return 'dense';
  if (rasterDensity === 'minimal' && inferredDensity === 'minimal') return 'minimal';
  return inferredDensity === 'balanced' ? 'balanced' : rasterDensity;
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
  if (role === 'settings') return 'low';
  if (role === 'workflow') return density === 'dense' ? 'medium' : 'high';
  if (role === 'detail' || role === 'discovery' || role === 'paywall') return 'high';
  if (density === 'dense') return 'medium';
  return 'low';
}

function inferRecommendedUsage(
  role: ScreenshotRole,
  heroPriority: number,
  cropSuitability: CropSuitability,
): RecommendedUsage {
  if (role === 'onboarding' && heroPriority >= 70) return 'hero-device';
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
  return density === 'dense'
    || role === 'communication'
    || role === 'settings'
    || role === 'paywall'
    || maxZoneArea < 1200;
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
  occupiedRegions?: SafeTextZone['label'][],
): SafeTextZone[] {
  const candidates = uniqueSafeTextZones([...safeTextZones, ...fallbackZones]);
  const filteredByOccupied = candidates.filter((zone) => !(occupiedRegions ?? []).includes(zone.label));
  const filtered = filteredByOccupied.filter((zone) => {
    if (!textInsights || textInsights.blocks.length === 0) return true;
    return zoneTextOverlapRatio(zone, textInsights) < 0.14;
  });
  if (filtered.length > 0) return filtered.slice(0, Math.max(3, safeTextZones.length));
  if (filteredByOccupied.length > 0) return filteredByOccupied.slice(0, Math.max(3, safeTextZones.length));
  return safeTextZones;
}

function hasTopTextCollision(
  textInsights?: ScreenshotTextInsights,
  occupiedRegions?: SafeTextZone['label'][],
): boolean {
  return (occupiedRegions ?? []).includes('top')
    || Boolean(textInsights && (textInsights.topCoverage >= 0.08 || textInsights.lineCount >= 8));
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
  semanticFlavor?: ScreenshotSemanticFlavor;
  density: ScreenshotDensity;
  heroPriority: number;
  width: number | null;
  height: number | null;
  pathValue: string;
  note?: string;
  recommendedUsage: RecommendedUsage;
  topQuietRatio?: number;
  focusStrength?: number;
  textInsights?: ScreenshotTextInsights;
  occupiedRegions?: SafeTextZone['label'][];
  rasterSemanticSignals?: RasterSemanticSignals;
}): string[] {
  const reasons: string[] = [];
  const semanticFlavor = args.semanticFlavor ?? inferSemanticFlavor({
    pathValue: args.pathValue,
    note: args.note,
    textInsights: args.textInsights,
    role: args.role,
  });

  if (args.role === 'home') {
    reasons.push('Home/dashboard content usually makes the clearest opening hero.');
  } else if (args.role === 'workflow') {
    reasons.push('Workflow screens often explain the core value quickly.');
  } else if (args.role === 'discovery') {
    reasons.push('Discovery screens can sell breadth and exploration when the layout stays readable.');
  } else if (args.role === 'onboarding') {
    reasons.push('Onboarding screens often have cleaner whitespace for hero use.');
  } else if (args.role === 'communication') {
    reasons.push('Communication screens can carry social energy, but they usually need shorter overlay copy.');
  } else if (args.role === 'settings') {
    reasons.push('Settings screens usually work better as support or closing proof than the opening claim.');
  } else if (args.role === 'paywall') {
    reasons.push('Paywall screens are better at framing premium value late in the story than opening the set.');
  }

  if (semanticFlavor === 'profile') {
    reasons.push('Profile/community screens can sell identity, trust, and social proof when treated like a focused spotlight.');
  } else if (semanticFlavor === 'activity') {
    reasons.push('Activity/feed screens can sell live momentum and community energy when the cadence stays readable.');
  } else if (semanticFlavor === 'editor') {
    reasons.push('Editor/canvas screens can sell hands-on creation when the main workspace stays readable.');
  } else if (semanticFlavor === 'catalog') {
    reasons.push('Catalog/store screens can sell range and curation when the layout reads like a browse story.');
  } else if (semanticFlavor === 'document') {
    reasons.push('Document/review screens can sell clarity and record confidence when the core page or approval state stays focused.');
  } else if (semanticFlavor === 'commerce') {
    reasons.push('Checkout/order screens can sell purchase confidence and follow-through when the transactional path stays clear.');
  } else if (semanticFlavor === 'security') {
    reasons.push('Secure access screens can sell trust and verification confidence when the identity step stays focused.');
  } else if (semanticFlavor === 'support') {
    reasons.push('Support/help screens can sell reassurance and fast resolution when the answer or ticket state stays structured.');
  } else if (semanticFlavor === 'reward') {
    reasons.push('Rewards/loyalty screens can sell earned value and member payoff when the perks or points surface stays clear.');
  } else if (semanticFlavor === 'map') {
    reasons.push('Map/navigation screens can sell immediacy and real-world coverage when the route or nearby context stays readable.');
  } else if (semanticFlavor === 'media') {
    reasons.push('Media/player screens can sell mood and ongoing engagement when playback focus stays prominent.');
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
    const semanticSignals = deriveTextSemanticSignals(args.textInsights);
    if (args.textInsights.roleHint && args.textInsights.roleHint === args.role) {
      reasons.push(`Text enrichment also points to a ${args.role} screen.`);
    }
    if (args.textInsights.topCoverage >= 0.1) {
      reasons.push('OCR/vision text blocks occupy the top band, so overlay copy needs more caution.');
    } else if (args.textInsights.lineCount > 0 && args.textInsights.totalCoverage <= 0.04) {
      reasons.push('OCR/vision enrichment found only light embedded UI text, so the screen stays flexible.');
    }
    if (isLikelyWorkflowScreen(semanticSignals)) {
      reasons.push('OCR/vision text suggests a workflow or creator screen, so copy should foreground the action or progress payoff.');
    }
    if (isLikelyDiscoveryScreen(semanticSignals)) {
      reasons.push('OCR/vision text suggests a discovery or browse surface, so copy should sell breadth instead of repeating category labels.');
    }
    if (isLikelyReportingScreen(semanticSignals) || isLikelyDataHeavyDashboard(semanticSignals)) {
      reasons.push('OCR/vision text suggests a data-heavy reporting view, so crop-led proof is stronger than oversized overlay copy.');
    }
  } else if (args.rasterSemanticSignals) {
    if (args.rasterSemanticSignals.onboardingScore >= 4) {
      reasons.push('Raster layout suggests an onboarding-style screen with a quiet top band and a staged CTA.');
    }
    if (args.rasterSemanticSignals.communicationScore >= 4) {
      reasons.push('Raster layout suggests a chat-style screen, so copy should stay brief and off the busiest message lanes.');
    }
    if (args.rasterSemanticSignals.settingsScore >= 4) {
      reasons.push('Raster layout suggests a settings/list screen, which is better used as supporting proof than a wide-open hero.');
    }
    if (args.rasterSemanticSignals.workflowScore >= 5) {
      reasons.push('Raster layout suggests a workflow-style screen with one primary action path, so copy should sell the completed action rather than every control.');
    }
    if (args.rasterSemanticSignals.discoveryScore >= 5) {
      reasons.push('Raster layout suggests a browse/discovery surface, so broader category copy works better than literal UI labels.');
    }
    if (args.rasterSemanticSignals.dashboardScore >= 4 || args.rasterSemanticSignals.reportingScore >= 4) {
      reasons.push('Raster layout suggests dashboard/reporting structure, so tighter proof crops are stronger than oversized claims.');
    }
  }

  if ((args.occupiedRegions ?? []).includes('top') && !args.textInsights) {
    reasons.push('Raster analysis found occupied structure near the top band, so overlay copy needs more caution even without OCR.');
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

interface RasterSemanticSignals {
  occupiedRegions: SafeTextZone['label'][];
  onboardingScore: number;
  paywallScore: number;
  settingsScore: number;
  communicationScore: number;
  workflowScore: number;
  discoveryScore: number;
  dashboardScore: number;
  reportingScore: number;
  editorFlavorScore: number;
  catalogFlavorScore: number;
  documentFlavorScore: number;
  mapFlavorScore: number;
  mediaFlavorScore: number;
  captureFlavorScore: number;
}

interface RasterSignals {
  dominantPalette: string[];
  safeTextZones: SafeTextZone[];
  occupiedRegions: SafeTextZone['label'][];
  focalPoint: FocalPoint;
  density: ScreenshotDensity;
  textRisk: TextRisk;
  cropSuitability: CropSuitability;
  unsafeForTextOverlay: boolean;
  heroPriorityAdjustment: number;
  pixelMetrics: ScreenshotPixelMetrics;
  semanticSignals: RasterSemanticSignals;
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

function segmentColumns(
  rowDensities: number[],
  threshold: number,
): Array<{ start: number; end: number; width: number }> {
  const segments: Array<{ start: number; end: number; width: number }> = [];
  let start: number | null = null;

  rowDensities.forEach((density, column) => {
    if (density >= threshold) {
      if (start === null) start = column;
      return;
    }
    if (start !== null) {
      segments.push({ start, end: column - 1, width: column - start });
      start = null;
    }
  });

  if (start !== null) {
    segments.push({ start, end: rowDensities.length - 1, width: rowDensities.length - start });
  }

  return segments;
}

function inferRasterSemanticSignals(args: {
  blockColumns: number;
  blockRows: number;
  blockDensities: number[];
  blockLuminances: number[];
  averageEdgeDensity: number;
  topQuietRatio: number;
  focusStrength: number;
  averageLuminance: number;
}): RasterSemanticSignals {
  const rowAverages = new Array<number>(args.blockRows).fill(0);
  const rowSegments: Array<Array<{ start: number; end: number; width: number }>> = [];
  const activeThreshold = Math.max(args.averageEdgeDensity * 1.05, 0.075);
  let topDenseRows = 0;
  let bottomDenseRows = 0;
  let leftRailRows = 0;
  let rightRailRows = 0;
  let splitRows = 0;
  let centeredPanelRows = 0;
  let fullWidthRows = 0;
  let cardGridRows = 0;
  let wideCenterRows = 0;
  let lowerCtaRows = 0;
  let alternatingConversationRows = 0;
  let lowerHalfDenseRows = 0;
  let topInsetBarRows = 0;
  let previousBubbleSide: 'left' | 'right' | null = null;

  for (let row = 0; row < args.blockRows; row += 1) {
    const rowValues = args.blockDensities.slice(
      row * args.blockColumns,
      (row + 1) * args.blockColumns,
    );
    const rowLuminances = args.blockLuminances.slice(
      row * args.blockColumns,
      (row + 1) * args.blockColumns,
    );
    const rowContrastValues = rowLuminances.map((value) => Math.abs(value - args.averageLuminance) / 255);
    const rowAverage = rowValues.reduce((sum, value) => sum + value, 0) / Math.max(rowValues.length, 1);
    const segments = segmentColumns(rowValues, activeThreshold);
    const contrastSegments = segmentColumns(rowContrastValues, 0.09);
    const combinedSegments = [...segments, ...contrastSegments];
    rowAverages[row] = rowAverage;
    rowSegments[row] = segments;

    const rowCenter = (row + 0.5) / args.blockRows;
    if (rowCenter <= 0.26 && rowAverage >= activeThreshold) topDenseRows += 1;
    if (rowCenter >= 0.72 && rowAverage >= activeThreshold) bottomDenseRows += 1;
    if (rowCenter >= 0.48 && rowAverage >= activeThreshold) lowerHalfDenseRows += 1;

    if (segments.length >= 2) splitRows += 1;

    const hasWideCenterSegment = combinedSegments.some((segment) =>
      segment.width >= 5 && segment.start <= 3 && segment.end >= args.blockColumns - 4);
    if (hasWideCenterSegment) {
      wideCenterRows += 1;
      if (rowCenter >= 0.34 && rowCenter <= 0.84) fullWidthRows += 1;
    }

    const centeredSegment = combinedSegments.some((segment) => {
      const center = (segment.start + segment.end + 1) / 2;
      return center >= 4 && center <= 8 && segment.width >= 4 && segment.width <= 8;
    });
    if (centeredSegment) centeredPanelRows += 1;

    const insetTopBar = combinedSegments.some((segment) => {
      const center = (segment.start + segment.end + 1) / 2;
      return center >= 4 && center <= 8 && segment.width >= 3 && segment.width <= 9;
    });
    if (insetTopBar && rowCenter >= 0.12 && rowCenter <= 0.28) topInsetBarRows += 1;

    const hasCardPair = segments.length >= 2 && segments.every((segment) => segment.width >= 2 && segment.width <= 4);
    if (hasCardPair && rowCenter >= 0.22 && rowCenter <= 0.7) cardGridRows += 1;

    const leftRail = combinedSegments.some((segment) =>
      segment.start <= 1 && segment.width >= 2 && segment.width <= 8);
    const rightRail = combinedSegments.some((segment) =>
      segment.end >= args.blockColumns - 2 && segment.width >= 2 && segment.width <= 8);
    if (leftRail && rowCenter >= 0.14 && rowCenter <= 0.82) leftRailRows += 1;
    if (rightRail && rowCenter >= 0.14 && rowCenter <= 0.82) rightRailRows += 1;

    if (rowCenter >= 0.7) {
      const centeredBottomSegment = combinedSegments.some((segment) => {
        const center = (segment.start + segment.end + 1) / 2;
        return center >= 3.8 && center <= 8.2 && segment.width >= 3 && segment.width <= 9;
      });
      if (centeredBottomSegment) lowerCtaRows += 1;
    }

    const bubbleSegments = combinedSegments.filter((segment) => segment.width >= 2 && segment.width <= 8);
    if (bubbleSegments.length === 1 && rowCenter >= 0.2 && rowCenter <= 0.82) {
      const bubbleCenter = (bubbleSegments[0]!.start + bubbleSegments[0]!.end + 1) / 2;
      const bubbleSide = bubbleCenter < args.blockColumns / 2 ? 'left' : 'right';
      if (previousBubbleSide && previousBubbleSide !== bubbleSide) {
        alternatingConversationRows += 1;
      }
      previousBubbleSide = bubbleSide;
    }
  }

  const occupiedRegions = mergeOccupiedRegions(
    topDenseRows >= 2 && args.topQuietRatio < 0.56 ? ['top'] : [],
    bottomDenseRows >= 2 || lowerCtaRows >= 1 ? ['bottom'] : [],
    leftRailRows >= 3 || alternatingConversationRows >= 2 ? ['left'] : [],
    rightRailRows >= 3 || alternatingConversationRows >= 2 ? ['right'] : [],
    centeredPanelRows >= 4 || wideCenterRows >= 3 ? ['center'] : [],
  );

  const onboardingScore = (
    (args.topQuietRatio >= 0.66 && args.averageLuminance >= 150 ? 2 : 0)
    + (centeredPanelRows >= 4 ? 2 : 0)
    + (lowerCtaRows >= 1 ? 2 : 0)
    + (splitRows <= 1 && fullWidthRows <= 2 ? 1 : 0)
    + (args.focusStrength >= 0.42 ? 1 : 0)
    + (args.averageLuminance >= 165 ? 1 : 0)
  );
  const paywallScore = (
    (lowerCtaRows >= 1 ? 1 : 0)
    + (centeredPanelRows >= 4 ? 1 : 0)
    + (args.averageLuminance <= 148 ? 2 : 0)
    + (args.focusStrength >= 0.48 ? 1 : 0)
    + (args.topQuietRatio <= 0.6 ? 1 : 0)
  );
  const settingsScore = (
    (leftRailRows >= 3 ? 2 : 0)
    + (fullWidthRows >= 5 && centeredPanelRows <= 2 && topInsetBarRows === 0 && cardGridRows <= 1 ? 3 : 0)
    + (splitRows <= 2 ? 1 : 0)
    + (args.topQuietRatio <= 0.46 ? 1 : 0)
    + (centeredPanelRows <= 2 ? 1 : 0)
  );
  const communicationScore = (
    (alternatingConversationRows >= 2 ? 2 : 0)
    + (leftRailRows >= 2 ? 1 : 0)
    + (rightRailRows >= 2 ? 1 : 0)
    + (splitRows >= 3 ? 1 : 0)
  );
  const workflowScore = (
    (centeredPanelRows >= 4 ? 2 : 0)
    + (topInsetBarRows >= 1 ? 1 : 0)
    + (lowerCtaRows >= 1 ? 1 : 0)
    + (splitRows <= 2 ? 1 : 0)
    + (fullWidthRows <= 3 ? 1 : 0)
    + (lowerHalfDenseRows >= 3 ? 1 : 0)
  );
  const discoveryScore = (
    (topInsetBarRows >= 1 ? 1 : 0)
    + (cardGridRows >= 2 ? 2 : 0)
    + (splitRows >= 3 ? 1 : 0)
    + (fullWidthRows <= 2 ? 1 : 0)
    + (leftRailRows <= 2 && rightRailRows <= 2 ? 1 : 0)
    + (lowerCtaRows === 0 ? 1 : 0)
  );
  const dashboardScore = (
    (cardGridRows >= 2 ? 2 : 0)
    + (cardGridRows >= 4 ? 1 : 0)
    + (splitRows >= 2 ? 1 : 0)
    + (centeredPanelRows >= 2 ? 1 : 0)
    + (lowerHalfDenseRows >= 3 ? 1 : 0)
    + (topInsetBarRows === 0 ? 1 : 0)
  );
  const reportingScore = (
    (wideCenterRows >= 3 ? 2 : 0)
    + (fullWidthRows >= 4 ? 1 : 0)
    + (splitRows <= 1 ? 1 : 0)
    + (lowerHalfDenseRows >= 3 ? 1 : 0)
    + (args.focusStrength >= 0.5 ? 1 : 0)
  );
  const editorFlavorScore = (
    (centeredPanelRows >= 4 ? 2 : centeredPanelRows >= 3 ? 1 : 0)
    + (topInsetBarRows >= 1 ? 1 : 0)
    + (lowerCtaRows >= 1 ? 1 : 0)
    + (splitRows <= 2 ? 1 : 0)
    + (fullWidthRows <= 3 ? 1 : 0)
    + (wideCenterRows >= 2 ? 1 : 0)
  );
  const catalogFlavorScore = (
    (cardGridRows >= 3 ? 2 : cardGridRows >= 2 ? 1 : 0)
    + (cardGridRows >= 5 ? 1 : 0)
    + (splitRows >= 3 ? 1 : 0)
    + (fullWidthRows <= 2 ? 1 : 0)
    + (lowerCtaRows === 0 ? 1 : 0)
  );
  const documentFlavorScore = (
    (wideCenterRows >= 3 ? 2 : 0)
    + (centeredPanelRows >= 3 ? 1 : 0)
    + (splitRows <= 2 ? 1 : 0)
    + (args.averageLuminance >= 168 ? 1 : 0)
    + (cardGridRows <= 1 ? 1 : 0)
  );
  const mapFlavorScore = (
    (wideCenterRows >= 5 ? 2 : wideCenterRows >= 4 ? 1 : 0)
    + (bottomDenseRows >= 2 ? 1 : 0)
    + (lowerCtaRows >= 1 ? 1 : 0)
    + (topInsetBarRows >= 1 ? 1 : 0)
    + (centeredPanelRows <= 2 ? 1 : 0)
    + (splitRows <= 2 ? 1 : 0)
  );
  const mediaFlavorScore = (
    (args.averageLuminance <= 122 ? 2 : args.averageLuminance <= 145 ? 1 : 0)
    + (centeredPanelRows >= 3 ? 1 : 0)
    + (bottomDenseRows >= 2 ? 1 : 0)
    + (lowerCtaRows >= 1 ? 1 : 0)
    + (wideCenterRows >= 2 ? 1 : 0)
  );
  const captureFlavorScore = (
    (lowerCtaRows >= 1 ? 2 : 0)
    + (topInsetBarRows >= 1 ? 1 : 0)
    + (centeredPanelRows >= 3 ? 1 : 0)
    + (bottomDenseRows >= 2 ? 1 : 0)
    + (splitRows <= 2 ? 1 : 0)
    + (args.averageLuminance <= 150 ? 1 : 0)
  );

  return {
    occupiedRegions,
    onboardingScore,
    paywallScore,
    settingsScore,
    communicationScore,
    workflowScore,
    discoveryScore,
    dashboardScore,
    reportingScore,
    editorFlavorScore,
    catalogFlavorScore,
    documentFlavorScore,
    mapFlavorScore,
    mediaFlavorScore,
    captureFlavorScore,
  };
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
    const blockLuminanceTotals = new Array<number>(blockColumns * blockRows).fill(0);
    const blockLuminanceSamples = new Array<number>(blockColumns * blockRows).fill(0);
    const colorCounts = new Map<string, { count: number; r: number; g: number; b: number; saturation: number }>();
    let edgeCount = 0;
    let edgeComparisons = 0;
    let weightedFocusX = 0;
    let focusWeightTotal = 0;
    let luminanceTotal = 0;
    let luminanceSamples = 0;

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
        blockLuminanceTotals[blockIndex] = (blockLuminanceTotals[blockIndex] ?? 0) + luminance;
        blockLuminanceSamples[blockIndex] = (blockLuminanceSamples[blockIndex] ?? 0) + 1;
        luminanceTotal += luminance;
        luminanceSamples += 1;

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
    const blockAverageLuminances = blockLuminanceTotals.map((total, index) => {
      const samples = blockLuminanceSamples[index] ?? 0;
      return samples > 0 ? total / samples : 0;
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
    const averageLuminance = luminanceTotal / Math.max(luminanceSamples, 1);
    const semanticSignals = inferRasterSemanticSignals({
      blockColumns,
      blockRows,
      blockDensities,
      blockLuminances: blockAverageLuminances,
      averageEdgeDensity,
      topQuietRatio,
      focusStrength,
      averageLuminance,
    });

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
    const unsafeForTextOverlay = topQuietRatio < 0.46
      || (safeTextZones.length === 0 && density === 'dense')
      || semanticSignals.occupiedRegions.includes('top');

    let heroPriorityAdjustment = 0;
    if (topQuietRatio >= 0.72) heroPriorityAdjustment += 8;
    else if (topQuietRatio <= 0.42) heroPriorityAdjustment -= 8;
    if (density === 'minimal') heroPriorityAdjustment += 4;
    else if (density === 'dense') heroPriorityAdjustment -= 4;
    if (focusStrength >= 0.48) heroPriorityAdjustment += 3;
    if (semanticSignals.onboardingScore >= 4) heroPriorityAdjustment += 4;
    if (semanticSignals.workflowScore >= 5) heroPriorityAdjustment += 2;
    if (semanticSignals.discoveryScore >= 5) heroPriorityAdjustment += 1;
    if (semanticSignals.paywallScore >= 4 || semanticSignals.settingsScore >= 4) heroPriorityAdjustment -= 6;
    if (semanticSignals.dashboardScore >= 4 || semanticSignals.reportingScore >= 4) heroPriorityAdjustment -= 4;

    return {
      dominantPalette: dominantPalette.length > 0 ? dominantPalette : ['#F8FAFC', '#94A3B8', '#0F172A'],
      safeTextZones: safeTextZones.length > 0 ? safeTextZones : zoneScores.slice(0, 2).map((entry) => entry.zone),
      occupiedRegions: semanticSignals.occupiedRegions,
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
      semanticSignals,
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
      const semanticSignals = deriveTextSemanticSignals(resolvedTextInsights);
      const textOccupiedRegions = inferTextOccupiedRegions(resolvedTextInsights);
      const occupiedRegions = textOccupiedRegions.length > 0
        ? textOccupiedRegions
        : mergeOccupiedRegions(textOccupiedRegions, rasterSignals?.occupiedRegions);
      const role = inferRole(
        input.path,
        input.note,
        resolvedTextInsights,
        rasterSignals?.semanticSignals,
      );
      const semanticFlavorDetails = inferSemanticFlavorDetails({
        pathValue: input.path,
        note: input.note,
        textInsights: resolvedTextInsights,
        role,
        rasterSemanticSignals: rasterSignals?.semanticSignals,
      });
      const inferredDensity = inferDensity(
        role,
        input.path,
        input.note,
        resolvedTextInsights,
        rasterSignals?.semanticSignals,
      );
      const density = resolvedTextInsights
        ? mergeDensitySignals(rasterSignals?.density, inferredDensity)
        : (rasterSignals?.density ?? inferredDensity);
      const focus = inferFocus(input.path, input.note, role);
      const inferredCropSuitability = isLikelyReportingScreen(semanticSignals) || isLikelyDataHeavyDashboard(semanticSignals)
        ? 'high'
        : inferCropSuitability(role, density);
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
        occupiedRegions,
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
            || hasTopTextCollision(resolvedTextInsights, occupiedRegions)
          )
        : (
            inferUnsafeForTextOverlay(role, density, safeTextZones)
            || hasTopTextCollision(resolvedTextInsights, occupiedRegions)
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
        semanticFlavor: semanticFlavorDetails.flavor,
        semanticFlavorConfidence: semanticFlavorDetails.confidence,
        density,
        textRisk,
        heroPriority,
        heroExplanation: buildHeroExplanation({
          role,
          semanticFlavor: semanticFlavorDetails.flavor,
          density,
          heroPriority,
          width: metadata.width,
          height: metadata.height,
          pathValue: input.path,
          note: input.note,
          recommendedUsage,
          topQuietRatio: rasterSignals?.pixelMetrics.topQuietRatio,
          focusStrength: rasterSignals?.focalPoint.strength,
          textInsights: resolvedTextInsights,
          occupiedRegions,
          rasterSemanticSignals: rasterSignals?.semanticSignals,
        }),
        inferredOrder: null,
        orderingConfidence: 'low' as const,
        orderingReason: [],
        focus,
        dominantPalette: rasterSignals?.dominantPalette ?? inferDominantPalette(role, density),
        safeTextZones,
        occupiedRegions,
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
    textRisk: analysis.textRisk,
    embeddedText: sampleEmbeddedTextPhrases(analysis.textInsights, 3),
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

function inferCropAnchor(analysis: ScreenshotAnalysis): CropAnchor {
  const occupiedRegions = analysis.occupiedRegions;

  if (analysis.focalPoint && analysis.cropSuitability !== 'low') return 'focal-point';
  if (occupiedRegions.includes('top')) return 'lower-half';
  if (quietRank(analysis) >= 0.68) return 'upper-half';
  if (occupiedRegions.includes('left') && !occupiedRegions.includes('right')) return 'right-rail';
  if (occupiedRegions.includes('right') && !occupiedRegions.includes('left')) return 'left-rail';
  return 'center';
}

function buildCropPlan(args: {
  analysis: ScreenshotAnalysis;
  composition?: PlannedIndividualScreen['composition'];
  storyBeat?: string;
  compositionFeatures?: PanoramicCompositionFeature[];
}): PlannedCropPlan {
  const occupiedRegions = args.analysis.occupiedRegions;
  const anchor = inferCropAnchor(args.analysis);
  let usage: PlannedCropUsage = 'full-device';

  if (args.compositionFeatures?.includes('layered-detail-extract')) {
    usage = 'layered-extract';
  } else if (
    args.composition
    && args.composition !== 'single'
    && args.analysis.cropSuitability !== 'low'
  ) {
    usage = 'supporting-crop';
  } else if (args.analysis.focalPoint && args.analysis.cropSuitability !== 'low') {
    usage = 'loupe-detail';
  }

  const reasons: string[] = [];
  if (usage === 'full-device') {
    reasons.push('Keep the full screenshot readable as the dominant device.');
  } else if (usage === 'loupe-detail') {
    reasons.push('Use one tighter crop or loupe to pull forward a specific product detail.');
  } else if (usage === 'supporting-crop') {
    reasons.push('Use supporting crops to widen the frame without losing the main device.');
  } else {
    reasons.push('Extract one layered detail so the panorama can reuse UI without duplicating the full device.');
  }

  if (anchor === 'focal-point' && args.analysis.focalPoint) {
    reasons.push(
      `Bias the crop toward ${Math.round(args.analysis.focalPoint.x)}%/${Math.round(args.analysis.focalPoint.y)}%.`,
    );
  } else if (anchor === 'lower-half') {
    reasons.push('Bias the crop lower because OCR-detected UI text already occupies the top band.');
  } else if (anchor === 'upper-half') {
    reasons.push('Favor the upper half because the screenshot leaves cleaner copy space there.');
  }

  if (occupiedRegions.length > 0) {
    reasons.push(`Avoid text-heavy regions: ${occupiedRegions.join(', ')}.`);
  }

  if (args.storyBeat === 'trust' || args.storyBeat === 'summary') {
    reasons.push('Leave extra room for close-out proof or summary copy.');
  }

  return {
    usage,
    anchor,
    avoidRegions: occupiedRegions,
    rationale: reasons.join(' '),
  };
}

function buildConceptFrameStrategy(args: {
  conceptId: ConceptId;
  mode: 'individual' | 'panoramic';
  sequence: ScreenshotAnalysis[];
}): PlannedFrameStrategy {
  const cropFriendlyCount = args.sequence.filter((analysis) =>
    analysis.cropSuitability === 'high' || analysis.recommendedUsage === 'crop-card').length;
  const topTextCount = args.sequence.filter((analysis) =>
    analysis.occupiedRegions.includes('top')).length;

  switch (args.conceptId) {
    case 'concept-a':
      return {
        defaultTreatment: 'framed',
        framelessAllowedWhen: [],
        rationale: 'Keep every screen framed so the clean hero concept stays stable and store-legible.',
      };
    case 'concept-b':
      return {
        defaultTreatment: cropFriendlyCount > 0 ? 'mixed' : 'framed',
        framelessAllowedWhen: cropFriendlyCount > 0
          ? [
              'Detail-led screens with high crop suitability can go frameless to add motion.',
              ...(topTextCount > 0
                ? ['Screens with embedded top-band UI text can move copy outside the device silhouette.']
                : []),
            ]
          : [],
        rationale: cropFriendlyCount > 0
          ? 'Use framed anchors for clarity, then loosen detail-led supporting screens where tighter crops create momentum.'
          : 'Keep the sequence framed because the current screenshots do not support tighter frameless crops cleanly.',
      };
    case 'concept-c':
      return {
        defaultTreatment: 'mixed',
        framelessAllowedWhen: [
          'Editorial support crops and floating detail cards can go frameless between anchored hero devices.',
          ...(topTextCount > 0
            ? ['Frames with embedded top text should keep typography outside the device and use frameless extracts instead.']
            : []),
        ],
        rationale: 'Editorial panoramas should alternate dominant framed devices with quieter frameless extracts to keep the strip airy.',
      };
    case 'concept-d':
      return {
        defaultTreatment: 'mixed',
        framelessAllowedWhen: [
          'High-energy detail punches and proof moments can go frameless to increase contrast.',
          ...(topTextCount > 0
            ? ['Frames with embedded UI text near the top can shift to frameless crops so campaign copy stays clear.']
            : []),
        ],
        rationale: 'Bold panoramas work best when framed hero devices are broken up by frameless detail layers and proof moments.',
      };
    default:
      return {
        defaultTreatment: args.mode === 'panoramic' ? 'mixed' : 'framed',
        framelessAllowedWhen: cropFriendlyCount > 0
          ? ['Use frameless crops only when the screenshot has clear focal detail worth isolating.']
          : [],
        rationale: 'Default to framed devices unless the screenshot set clearly supports cleaner isolated crops.',
      };
  }
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

function semanticFlavorStageBonus(
  analysis: ScreenshotAnalysis,
  conceptId: ConceptId,
  stage: SequenceStage,
): number {
  const semanticFlavor = analysisSemanticFlavor(analysis);

  switch (semanticFlavor) {
    case 'activity':
      if (stage === 'hero') return conceptId === 'concept-d' ? 16 : conceptId === 'concept-b' ? 10 : conceptId === 'concept-c' ? 4 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 12 : 4;
      if (stage === 'closing') return conceptId === 'concept-c' ? -4 : conceptId === 'concept-d' ? 4 : 0;
      return 0;
    case 'editor':
      if (stage === 'hero') return conceptId === 'concept-b' ? 12 : conceptId === 'concept-c' ? 6 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 10 : 4;
      if (stage === 'closing') return conceptId === 'concept-c' ? -4 : 0;
      return 0;
    case 'catalog':
      if (stage === 'hero') return conceptId === 'concept-d' ? 8 : conceptId === 'concept-b' ? 4 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 12 : 4;
      return 0;
    case 'document':
      if (stage === 'hero') return conceptId === 'concept-c' ? 10 : conceptId === 'concept-a' ? 4 : conceptId === 'concept-b' ? 2 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 8 : 4;
      if (stage === 'closing') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 12 : 6;
      return 0;
    case 'profile':
      if (stage === 'hero') return conceptId === 'concept-a' ? 4 : -2;
      if (stage === 'middle') return conceptId === 'concept-c' ? 6 : 0;
      if (stage === 'closing') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 14 : 8;
      return 0;
    case 'commerce':
      if (stage === 'hero') return conceptId === 'concept-d' ? 18 : conceptId === 'concept-b' ? 12 : conceptId === 'concept-c' ? 4 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 12 : 6;
      if (stage === 'closing') return conceptId === 'concept-c' ? 10 : conceptId === 'concept-d' ? 8 : 4;
      return 0;
    case 'security':
      if (stage === 'hero') return conceptId === 'concept-b' ? 10 : conceptId === 'concept-a' ? 6 : conceptId === 'concept-c' ? 4 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 8 : 4;
      if (stage === 'closing') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 14 : 6;
      return 0;
    case 'support':
      if (stage === 'hero') return conceptId === 'concept-c' ? -4 : conceptId === 'concept-d' ? 2 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 8 : 4;
      if (stage === 'closing') return conceptId === 'concept-c' ? 16 : conceptId === 'concept-d' ? 12 : 6;
      return 0;
    case 'reward':
      if (stage === 'hero') return conceptId === 'concept-d' ? 14 : conceptId === 'concept-b' ? 8 : conceptId === 'concept-c' ? 2 : 0;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 10 : 4;
      if (stage === 'closing') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 8 : 4;
      return 0;
    case 'map':
      if (stage === 'hero') return conceptId === 'concept-c' ? 28 : conceptId === 'concept-b' ? 14 : 6;
      if (stage === 'middle') return conceptId === 'concept-d' ? 10 : 4;
      if (stage === 'closing') return -6;
      return 0;
    case 'media':
      if (stage === 'hero') return conceptId === 'concept-d' ? 18 : conceptId === 'concept-b' ? 10 : conceptId === 'concept-c' ? -4 : 4;
      if (stage === 'middle') return conceptId === 'concept-c' ? 16 : 6;
      if (stage === 'closing') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 4 : 0;
      return 0;
    case 'capture':
      if (stage === 'hero') return conceptId === 'concept-d' ? 22 : conceptId === 'concept-b' ? 16 : conceptId === 'concept-c' ? 6 : 4;
      if (stage === 'middle') return conceptId === 'concept-d' ? 10 : conceptId === 'concept-b' ? 8 : 2;
      if (stage === 'closing') return conceptId === 'concept-c' ? -6 : -2;
      return 0;
    case 'schedule':
      if (stage === 'hero') return conceptId === 'concept-b' ? 8 : conceptId === 'concept-c' ? 4 : 2;
      if (stage === 'middle') return conceptId === 'concept-c' || conceptId === 'concept-d' ? 14 : 8;
      if (stage === 'closing') return conceptId === 'concept-c' ? 12 : conceptId === 'concept-d' ? 8 : 4;
      return 0;
    default:
      return 0;
  }
}

function heroScoreForConcept(
  analysis: ScreenshotAnalysis,
  conceptId: ConceptId,
  category: AppCategory,
): number {
  const categoryBonus = categoryRoleBonus(category, 'hero', analysis.role, conceptId);
  const semanticBonus = semanticFlavorStageBonus(analysis, conceptId, 'hero');
  switch (conceptId) {
    case 'concept-b':
      return analysis.heroPriority
        + (cropRank(analysis.cropSuitability) * 12)
        + (focusStrengthRank(analysis) * 14)
        - (quietRank(analysis) * 2)
        + categoryBonus
        + semanticBonus;
    case 'concept-c':
      return analysis.heroPriority
        + (quietRank(analysis) * 20)
        - (densityRank(analysis.density) * 8)
        + (analysis.unsafeForTextOverlay ? -10 : 6)
        + categoryBonus
        + semanticBonus;
    case 'concept-d':
      return analysis.heroPriority
        + (cropRank(analysis.cropSuitability) * 16)
        + (edgeDensityRank(analysis) * 30)
        + (focusStrengthRank(analysis) * 10)
        + categoryBonus
        + semanticBonus;
    default:
      return analysis.heroPriority
        + (quietRank(analysis) * 12)
        - (densityRank(analysis.density) * 4)
        + categoryBonus
        + semanticBonus;
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
  const semanticBonus = semanticFlavorStageBonus(analysis, conceptId, 'closing');

  switch (conceptId) {
    case 'concept-b':
      return roleBonus
        + (densityRank(analysis.density) * 10)
        + (analysis.unsafeForTextOverlay ? 8 : 0)
        + orderWeight
        + categoryBonus
        + semanticBonus;
    case 'concept-c':
      return roleBonus
        + (quietRank(analysis) * 10)
        + ((100 - analysis.heroPriority) * 0.14)
        + orderWeight
        + categoryBonus
        + semanticBonus;
    case 'concept-d':
      return roleBonus
        + (densityRank(analysis.density) * 12)
        + (cropRank(analysis.cropSuitability) * 6)
        + orderWeight
        + categoryBonus
        + semanticBonus;
    default:
      return roleBonus
        + ((100 - analysis.heroPriority) * 0.18)
        + (analysis.unsafeForTextOverlay ? 8 : 0)
        + orderWeight
        + categoryBonus
        + semanticBonus;
  }
}

function middleScoreForConcept(
  analysis: ScreenshotAnalysis,
  conceptId: ConceptId,
  category: AppCategory,
): number {
  const categoryBonus = categoryRoleBonus(category, 'middle', analysis.role, conceptId);
  const semanticBonus = semanticFlavorStageBonus(analysis, conceptId, 'middle');
  switch (conceptId) {
    case 'concept-b':
      return (cropRank(analysis.cropSuitability) * 18)
        + (focusStrengthRank(analysis) * 16)
        + (edgeDensityRank(analysis) * 24)
        + (analysis.heroPriority * 0.12)
        + categoryBonus
        + semanticBonus;
    case 'concept-c':
      return (quietRank(analysis) * 10)
        + (cropRank(analysis.cropSuitability) * 8)
        + ((analysis.inferredOrder ?? 0) * 0.8)
        - (edgeDensityRank(analysis) * 8)
        + categoryBonus
        + semanticBonus;
    case 'concept-d':
      return (cropRank(analysis.cropSuitability) * 16)
        + (edgeDensityRank(analysis) * 28)
        + (densityRank(analysis.density) * 8)
        + (focusStrengthRank(analysis) * 12)
        + categoryBonus
        + semanticBonus;
    default:
      return ((analysis.inferredOrder ?? 0) * 2)
        + (quietRank(analysis) * 4)
        + (analysis.heroPriority * 0.08)
        + categoryBonus
        + semanticBonus;
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
  const heroReusePenalty = conceptId === 'concept-d' ? 52 : conceptId === 'concept-c' ? 42 : 32;
  const earlyReusePenalty = conceptId === 'concept-d' ? 18 : 14;
  const unusedLeadBonus = conceptId === 'concept-a' ? 0 : 20;

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
  recipe: string;
  analysis: ScreenshotAnalysis;
  index: number;
  total: number;
  supportingScreens: string[];
}): PlannedIndividualScreen['composition'] {
  const semanticFlavor = analysisSemanticFlavor(args.analysis);

  if (semanticFlavor === 'editor' && args.supportingScreens.length >= 1) return 'hero-tilt';
  if (semanticFlavor === 'activity' && args.supportingScreens.length >= 2) return 'fanned-cards';
  if (semanticFlavor === 'activity' && args.supportingScreens.length >= 1) return 'duo-overlap';
  if (semanticFlavor === 'support' && args.supportingScreens.length >= 1) return 'duo-split';
  if (semanticFlavor === 'reward' && args.supportingScreens.length >= 2) return 'fanned-cards';
  if (semanticFlavor === 'reward' && args.supportingScreens.length >= 1) return 'duo-overlap';
  if (semanticFlavor === 'commerce' && args.supportingScreens.length >= 2) return 'fanned-cards';
  if (semanticFlavor === 'commerce' && args.supportingScreens.length >= 1) return args.index === 0 ? 'hero-tilt' : 'duo-overlap';
  if (semanticFlavor === 'document' && args.supportingScreens.length >= 2) return args.index === 0 ? 'hero-tilt' : 'duo-split';
  if (semanticFlavor === 'document' && args.supportingScreens.length >= 1) return 'duo-split';
  if (semanticFlavor === 'security' && args.supportingScreens.length >= 1) return 'duo-split';
  if (semanticFlavor === 'capture' && args.supportingScreens.length >= 2) return 'hero-tilt';
  if (semanticFlavor === 'capture' && args.supportingScreens.length >= 1) return args.index === 0 ? 'hero-tilt' : 'duo-overlap';
  if (semanticFlavor === 'schedule' && args.supportingScreens.length >= 1) return 'duo-split';
  if (semanticFlavor === 'map' && args.supportingScreens.length >= 2) return 'hero-tilt';
  if (semanticFlavor === 'map' && args.supportingScreens.length >= 1) return 'duo-split';
  if (semanticFlavor === 'media' && args.supportingScreens.length >= 2) return 'fanned-cards';
  if (semanticFlavor === 'media' && args.supportingScreens.length >= 1) return 'hero-tilt';
  if (semanticFlavor === 'catalog' && args.supportingScreens.length >= 2) return 'fanned-cards';
  if (semanticFlavor === 'catalog' && args.supportingScreens.length >= 1) return 'duo-overlap';
  if (semanticFlavor === 'profile' && args.supportingScreens.length >= 1) return 'duo-overlap';
  if (args.analysis.role === 'communication' && args.supportingScreens.length >= 2) return 'fanned-cards';
  if (args.analysis.role === 'communication' && args.supportingScreens.length >= 1) return 'duo-overlap';
  if (args.analysis.role === 'discovery' && args.supportingScreens.length >= 2) return 'fanned-cards';
  if (args.analysis.role === 'discovery' && args.supportingScreens.length >= 1) return 'duo-overlap';
  if (args.analysis.role === 'workflow' && args.supportingScreens.length >= 1) return 'duo-split';
  if (args.analysis.role === 'settings' && args.supportingScreens.length >= 1) return 'duo-split';
  if (args.analysis.role === 'onboarding' && args.index === 0 && args.supportingScreens.length >= 1) return 'hero-tilt';
  if (args.analysis.role === 'paywall' && args.supportingScreens.length >= 1) return 'hero-tilt';
  if (args.recipe === 'proof-led-momentum') {
    if (args.supportingScreens.length >= 2) return args.index === 0 ? 'duo-split' : 'duo-overlap';
    if (args.supportingScreens.length >= 1) return 'duo-split';
  }
  if (args.recipe === 'routine-momentum') {
    if (args.supportingScreens.length >= 2) return args.index === 0 ? 'duo-split' : 'duo-overlap';
    if (args.supportingScreens.length >= 1) return 'duo-split';
  }
  if (args.recipe === 'focused-momentum') {
    if (args.supportingScreens.length >= 2) return args.index === 0 ? 'hero-tilt' : 'duo-split';
    if (args.supportingScreens.length >= 1) return args.analysis.role === 'workflow' ? 'duo-split' : 'hero-tilt';
  }
  if (args.recipe === 'community-momentum') {
    if (args.supportingScreens.length >= 2) return 'fanned-cards';
    if (args.supportingScreens.length >= 1) return 'duo-overlap';
  }
  if (args.recipe === 'studio-montage') {
    if (args.supportingScreens.length >= 2) return args.index === 0 ? 'hero-tilt' : 'fanned-cards';
    if (args.supportingScreens.length >= 1) return 'hero-tilt';
  }
  if (args.recipe === 'action-montage') {
    if (args.supportingScreens.length >= 2) return args.index === args.total - 1 ? 'fanned-cards' : 'hero-tilt';
    if (args.supportingScreens.length >= 1) return 'hero-tilt';
  }
  if (args.supportingScreens.length >= 2 && args.index === 0) return 'hero-tilt';
  if (args.supportingScreens.length >= 2 && args.index === args.total - 1) return 'fanned-cards';
  if (args.supportingScreens.length >= 2 && args.analysis.cropSuitability === 'high') return 'fanned-cards';
  if (args.supportingScreens.length >= 1 && args.analysis.cropSuitability === 'high') return 'duo-overlap';
  if (args.supportingScreens.length >= 1) return args.index % 2 === 0 ? 'duo-split' : 'hero-tilt';
  return 'single';
}

function buildIndividualImplementationNote(args: {
  recipe: string;
  analysis: ScreenshotAnalysis;
  composition: PlannedIndividualScreen['composition'];
  supportingScreens: string[];
}): string | undefined {
  const parts: string[] = [];
  const semanticFlavor = analysisSemanticFlavor(args.analysis);

  if (args.composition !== 'single') {
    parts.push(`Use ${args.composition} to widen the concept beyond a single centered device.`);
  }
  if (args.supportingScreens.length > 0) {
    parts.push(`Pull in ${args.supportingScreens.length} supporting screenshot${args.supportingScreens.length === 1 ? '' : 's'} for extra rhythm.`);
  }
  if (args.recipe === 'proof-led-momentum') {
    parts.push('Keep the support system measured so the concept reads like proof-led polish, not hype.');
  } else if (args.recipe === 'routine-momentum') {
    parts.push('Keep the rhythm gentle and repeatable so the concept feels supportive rather than urgent.');
  } else if (args.recipe === 'focused-momentum') {
    parts.push('Make the support layout feel task-forward, with one clear action path per frame.');
  } else if (args.recipe === 'community-momentum') {
    parts.push('Let the support rhythm feel lively and communal instead of like isolated message bubbles.');
  } else if (args.recipe === 'studio-montage') {
    parts.push('Use the support layout like a showcase montage, not a flat utility stack.');
  } else if (args.recipe === 'action-montage') {
    parts.push('Keep the support rhythm punchy so the concept feels like a launch cut rather than a static feature list.');
  }
  if (args.analysis.focalPoint && args.analysis.cropSuitability !== 'low') {
    parts.push(`Bias any detail zoom toward ${Math.round(args.analysis.focalPoint.x)}%/${Math.round(args.analysis.focalPoint.y)}%.`);
  }
  if (args.analysis.role === 'communication') {
    parts.push('Keep message lanes readable by staggering support crops away from the densest chat columns.');
  } else if (args.analysis.role === 'discovery') {
    parts.push('Let the supporting screenshots feel like browse cards so the frame sells breadth instead of one isolated tile.');
  } else if (args.analysis.role === 'workflow') {
    parts.push('Use the supporting screenshot to reinforce the action path or outcome instead of duplicating one form state.');
  } else if (args.analysis.role === 'settings') {
    parts.push('Treat the settings screen like supporting proof, not the loudest visual beat.');
  } else if (args.analysis.role === 'onboarding' || args.analysis.role === 'paywall') {
    parts.push('Leave enough breathing room around the CTA-driven portion of the screen.');
  }
  if (semanticFlavor === 'profile') {
    parts.push('Let the support screenshot reinforce identity, community, or creator proof instead of generic profile chrome.');
  } else if (semanticFlavor === 'activity') {
    parts.push('Let the support screenshots reinforce live updates, reactions, or post cadence so the frame feels active instead of chat-like.');
  } else if (semanticFlavor === 'editor') {
    parts.push('Keep the main workspace dominant and use support details to echo tools, layers, or output state.');
  } else if (semanticFlavor === 'catalog') {
    parts.push('Make the supporting screenshots feel like a curated assortment so the concept sells choice without visual clutter.');
  } else if (semanticFlavor === 'document') {
    parts.push('Keep the main page or approval state clear and use support details to echo review steps, records, or signed proof without cluttering the page.');
  } else if (semanticFlavor === 'support') {
    parts.push('Keep the answer path or resolution state clear and use support details for FAQ depth, ticket status, or guided next steps.');
  } else if (semanticFlavor === 'reward') {
    parts.push('Treat the earned-value surface like a member payoff and use support details for tiers, redemptions, or perk proof.');
  } else if (semanticFlavor === 'commerce') {
    parts.push('Keep the purchase path legible and let support details reinforce cart, offer, or delivery momentum instead of generic storefront chrome.');
  } else if (semanticFlavor === 'security') {
    parts.push('Keep the verification step or trusted identity signal clear and use support details for recovery, passkeys, or proof of protection.');
  } else if (semanticFlavor === 'capture') {
    parts.push('Keep the live preview or subject area clear and let support details reinforce scan confirmation, framing, or captured output.');
  } else if (semanticFlavor === 'schedule') {
    parts.push('Preserve the chronological rhythm so the supporting screenshot reinforces timing, status, or the next planned moment.');
  } else if (semanticFlavor === 'map') {
    parts.push('Keep the route or nearby context legible and use support details for destination, pickup, or coverage proof.');
  } else if (semanticFlavor === 'media') {
    parts.push('Keep the now-playing surface prominent and use support details to echo queue, episode, or listening momentum.');
  }
  return parts.length > 0 ? parts.join(' ') : undefined;
}

function buildScreenCopyDirection(args: {
  category: AppCategory;
  conceptId: ConceptId;
  recipe: string;
  slideRole: string;
  analysis: ScreenshotAnalysis;
  composition: PlannedIndividualScreen['composition'];
}): string {
  const parts: string[] = [];
  const embeddedText = sampleEmbeddedTextPhrases(args.analysis.textInsights, 2);
  const occupiedRegions = args.analysis.occupiedRegions;
  const semanticFlavor = analysisSemanticFlavor(args.analysis);

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

  if (args.recipe === 'trust-led-hero' || args.recipe === 'proof-led-momentum') {
    parts.push('Keep the wording measured, credible, and proof-first instead of hype-led.');
  } else if (args.recipe === 'calm-hero' || args.recipe === 'routine-momentum') {
    parts.push('Keep the wording gentle and steady rather than urgent.');
  } else if (args.recipe === 'workflow-hero' || args.recipe === 'focused-momentum') {
    parts.push('Make the line feel practical and decisive rather than abstract.');
  } else if (args.recipe === 'connection-hero' || args.recipe === 'community-momentum') {
    parts.push('Make the line feel live and communal, not just functional.');
  } else if (args.recipe === 'showcase-hero' || args.recipe === 'studio-montage') {
    parts.push('Make the line feel crafted and showcase-led instead of operational.');
  } else if (args.recipe === 'gameplay-hero' || args.recipe === 'action-montage') {
    parts.push('Keep the line punchy and payoff-first.');
  }

  switch (args.analysis.role) {
    case 'home':
      parts.push('Lead with the clearest overview or system state, not a raw dashboard label.');
      break;
    case 'onboarding':
      parts.push('Sell the first promised outcome, not the permission or tutorial UI itself.');
      break;
    case 'workflow':
      parts.push('Anchor the line in the main action the user completes here.');
      break;
    case 'detail':
      parts.push('Turn the result or reporting proof into one clear insight, not a metric list.');
      break;
    case 'discovery':
      parts.push('Make the line feel exploratory and broad, not mechanical.');
      break;
    case 'communication':
      parts.push('Keep the message social and immediate instead of naming inbox chrome or reply UI.');
      break;
    case 'settings':
      parts.push('Sell control, privacy, or personalization instead of enumerating toggles.');
      break;
    case 'paywall':
      parts.push('Frame the premium outcome clearly instead of describing plans, trials, or pricing UI.');
      break;
    default:
      break;
  }

  if (semanticFlavor === 'profile') {
    parts.push('Focus on identity, trust, or community momentum instead of naming follower counts or profile chrome.');
  } else if (semanticFlavor === 'activity') {
    parts.push('Sell live activity, updates, or social momentum instead of naming feed tabs, likes, comment counts, or notification chrome.');
  } else if (semanticFlavor === 'editor') {
    parts.push('Sell creative control or making progress, not toolbar labels, layers, or editing chrome.');
  } else if (semanticFlavor === 'catalog') {
    parts.push('Sell range, curation, or choice instead of naming prices, tabs, or product tiles.');
  } else if (semanticFlavor === 'document') {
    parts.push('Sell clarity, review confidence, or record readiness instead of naming PDFs, invoices, pages, or approval chrome.');
  } else if (semanticFlavor === 'support') {
    parts.push('Sell reassurance, guided help, or fast resolution instead of naming FAQ rows, ticket numbers, or support chrome.');
  } else if (semanticFlavor === 'reward') {
    parts.push('Sell earned value, perks, or loyalty payoff instead of naming points balances, badges, or redemption chrome.');
  } else if (semanticFlavor === 'commerce') {
    parts.push('Sell purchase confidence, cart momentum, or order follow-through instead of naming prices, checkout buttons, or storefront chrome.');
  } else if (semanticFlavor === 'security') {
    parts.push('Sell trusted access, privacy, or verification confidence instead of naming passwords, passkeys, toggles, or login chrome.');
  } else if (semanticFlavor === 'capture') {
    parts.push('Sell capturing, scanning, or live framing confidence instead of naming shutter buttons, scan controls, or camera chrome.');
  } else if (semanticFlavor === 'schedule') {
    parts.push('Sell timing, readiness, or the next planned moment instead of naming dates, slots, or calendar chrome.');
  } else if (semanticFlavor === 'map') {
    parts.push('Sell guidance, proximity, or real-world confidence instead of naming pins, tabs, or map chrome.');
  } else if (semanticFlavor === 'media') {
    parts.push('Sell mood, momentum, or what is playing instead of naming controls, playlists, or player chrome.');
  }

  const semanticSignals = deriveTextSemanticSignals(args.analysis.textInsights);
  if (isLikelyReportingScreen(semanticSignals) || isLikelyDataHeavyDashboard(semanticSignals)) {
    parts.push('Translate the numbers into a decision-ready payoff instead of stacking more metrics in the headline.');
  }

  if (args.analysis.unsafeForTextOverlay || args.analysis.density === 'dense') {
    parts.push('Keep it extra short because the UI is already busy.');
  } else if (quietRank(args.analysis) >= 0.66) {
    parts.push('Use a clean top-led statement because the screenshot has open copy space.');
  }

  if (embeddedText.length > 0) {
    parts.push(`Avoid reusing embedded UI text like "${embeddedText.join('" or "')}".`);
  }

  if (occupiedRegions.includes('top')) {
    parts.push('Keep headline copy away from the occupied top band.');
  }
  if (occupiedRegions.includes('bottom')) {
    parts.push('Do not lean on bottom-anchored copy because the lower UI already carries important structure.');
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

function buildIndividualBackgroundStrategy(args: {
  conceptId: 'concept-a' | 'concept-b';
  recipe: string;
  analysis: ScreenshotAnalysis;
  index: number;
}): string {
  const semanticFlavor = analysisSemanticFlavor(args.analysis);

  if (args.conceptId === 'concept-b') {
    if (args.recipe === 'proof-led-momentum') {
      if (args.index === 0) return 'quiet-surface';
      if (args.analysis.role === 'detail' || args.analysis.role === 'workflow') return 'proof-grid';
    }
    if (args.recipe === 'routine-momentum') {
      return args.index === 0 ? 'airy-spotlight' : 'care-surface';
    }
    if (args.recipe === 'focused-momentum' && args.analysis.role === 'workflow') {
      return 'workflow-surface';
    }
    if (
      args.recipe === 'studio-montage'
      && args.analysis.role !== 'settings'
      && semanticFlavor !== 'capture'
      && semanticFlavor !== 'schedule'
      && semanticFlavor !== 'map'
      && semanticFlavor !== 'media'
    ) {
      return 'studio-surface';
    }
    if (args.recipe === 'action-montage') {
      return args.index === 0 ? 'high-contrast-hero' : 'contrast-rhythm';
    }
  }

  if (semanticFlavor === 'profile') {
    return args.conceptId === 'concept-b' ? 'community-spotlight' : 'proof-tint';
  }
  if (semanticFlavor === 'activity') {
    return args.conceptId === 'concept-b' ? 'signal-burst' : 'proof-tint';
  }
  if (semanticFlavor === 'editor') {
    return args.conceptId === 'concept-b' ? 'studio-surface' : 'proof-tint';
  }
  if (semanticFlavor === 'catalog') {
    return args.conceptId === 'concept-b' ? 'catalog-glow' : 'proof-tint';
  }
  if (semanticFlavor === 'document') {
    return args.conceptId === 'concept-b' ? 'folio-surface' : 'proof-tint';
  }
  if (semanticFlavor === 'support') {
    return args.conceptId === 'concept-b' ? 'care-surface' : 'proof-tint';
  }
  if (semanticFlavor === 'reward') {
    return args.conceptId === 'concept-b' ? 'perk-glow' : 'proof-tint';
  }
  if (semanticFlavor === 'commerce') {
    return args.conceptId === 'concept-b' ? 'checkout-lane' : 'proof-tint';
  }
  if (semanticFlavor === 'security') {
    return args.conceptId === 'concept-b' ? 'vault-glow' : 'proof-tint';
  }
  if (semanticFlavor === 'capture') {
    return args.conceptId === 'concept-b' ? 'capture-stage' : 'proof-tint';
  }
  if (semanticFlavor === 'schedule') {
    return args.conceptId === 'concept-b' ? 'timeline-surface' : 'proof-tint';
  }
  if (semanticFlavor === 'map') {
    return args.conceptId === 'concept-b' ? 'route-glow' : 'proof-tint';
  }
  if (semanticFlavor === 'media') {
    return args.conceptId === 'concept-b' ? 'playback-stage' : 'proof-tint';
  }
  if (args.analysis.role === 'settings') return 'quiet-surface';
  if (args.analysis.role === 'onboarding' && args.index === 0) return 'airy-spotlight';
  if (args.analysis.role === 'paywall') {
    return args.conceptId === 'concept-b' ? 'premium-spotlight' : 'proof-tint';
  }
  if (args.analysis.role === 'workflow') {
    return args.conceptId === 'concept-b' ? 'workflow-surface' : 'proof-tint';
  }
  if (args.analysis.role === 'discovery') {
    return args.conceptId === 'concept-b' ? 'discovery-glow' : 'proof-tint';
  }
  if (args.analysis.role === 'communication' && args.conceptId === 'concept-b') {
    return 'conversation-glow';
  }
  if (
    (args.analysis.role === 'home' || args.analysis.role === 'detail')
    && args.analysis.cropSuitability === 'high'
  ) {
    return args.conceptId === 'concept-b' ? 'proof-grid' : 'proof-tint';
  }

  if (args.conceptId === 'concept-a') {
    return args.index === 0 ? 'primary-tint' : 'consistent-light';
  }

  return args.index === 0 ? 'high-contrast-hero' : 'contrast-rhythm';
}

function buildIndividualVariantScreens(args: {
  category: AppCategory;
  conceptId: 'concept-a' | 'concept-b';
  recipe: string;
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
          recipe: args.recipe,
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
      backgroundStrategy: buildIndividualBackgroundStrategy({
        conceptId: args.conceptId,
        recipe: args.recipe,
        analysis,
        index,
      }),
      copyDirection: buildScreenCopyDirection({
        category: args.category,
        conceptId: args.conceptId,
        recipe: args.recipe,
        slideRole,
        analysis,
        composition,
      }),
      cropPlan: buildCropPlan({
        analysis,
        composition,
        storyBeat: slideRole,
      }),
      framing:
        args.conceptId === 'concept-b' && analysis.recommendedUsage === 'crop-card'
          ? 'frameless-rounded'
          : 'framed',
      dominantPalette: analysis.dominantPalette,
      focalPoint: analysis.focalPoint,
      implementationNote: buildIndividualImplementationNote({
        recipe: args.recipe,
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

function buildPanoramicSupportSystem(args: {
  category: AppCategory;
  recipe: string;
  analysis: ScreenshotAnalysis;
  storyBeat: string;
  index: number;
  total: number;
  rhythmRole: PanoramicRhythmRole;
}): PanoramicSupportSystem {
  const profile = getPanoramicRecipeProfile(args.recipe);
  const semanticFlavor = analysisSemanticFlavor(args.analysis);
  const fallback = defaultPanoramicSupportSystem(args);

  if (
    semanticFlavor === 'activity'
    || semanticFlavor === 'profile'
    || args.analysis.role === 'communication'
    || profile.archetype === 'conversation'
  ) {
    return 'signal-chain';
  }
  if (
    args.analysis.role === 'workflow'
    || semanticFlavor === 'schedule'
    || profile.archetype === 'workflow'
    || profile.archetype === 'wellness'
  ) {
    return args.storyBeat === 'trust' ? 'metric-ladder' : 'milestone-band';
  }
  if (
    semanticFlavor === 'catalog'
    || semanticFlavor === 'media'
    || semanticFlavor === 'editor'
    || args.analysis.role === 'discovery'
    || profile.archetype === 'gallery'
    || profile.archetype === 'world'
  ) {
    return 'curation-shelf';
  }
  if (semanticFlavor === 'document' || semanticFlavor === 'commerce') {
    return args.rhythmRole === 'resolve' ? 'proof-column' : fallback === 'quote-stack' ? 'metric-ladder' : fallback;
  }
  if (
    semanticFlavor === 'support'
    || semanticFlavor === 'security'
    || semanticFlavor === 'reward'
  ) {
    return 'proof-column';
  }
  if (args.category === 'finance' || args.analysis.role === 'detail') {
    return args.rhythmRole === 'resolve' ? 'proof-column' : 'metric-ladder';
  }

  return fallback;
}

function buildPanoramicContinuityMotif(args: {
  recipe: string;
  analysis: ScreenshotAnalysis;
  supportSystem: PanoramicSupportSystem;
}): PanoramicContinuityMotif {
  const profile = getPanoramicRecipeProfile(args.recipe);
  const semanticFlavor = analysisSemanticFlavor(args.analysis);

  if (
    semanticFlavor === 'activity'
    || semanticFlavor === 'profile'
    || args.analysis.role === 'communication'
    || args.supportSystem === 'signal-chain'
  ) {
    return 'signal-wave';
  }
  if (
    args.analysis.role === 'workflow'
    || semanticFlavor === 'schedule'
    || args.supportSystem === 'milestone-band'
  ) {
    return 'progress-track';
  }
  if (
    semanticFlavor === 'catalog'
    || semanticFlavor === 'media'
    || semanticFlavor === 'editor'
    || args.analysis.role === 'discovery'
    || args.supportSystem === 'curation-shelf'
  ) {
    return profile.archetype === 'world' ? 'poster-anchor' : 'curation-run';
  }
  if (
    semanticFlavor === 'document'
    || semanticFlavor === 'commerce'
    || semanticFlavor === 'security'
    || semanticFlavor === 'support'
    || semanticFlavor === 'reward'
    || args.supportSystem === 'proof-column'
    || args.supportSystem === 'metric-ladder'
  ) {
    return 'proof-lane';
  }

  return profile.defaultContinuityMotif;
}

function buildPanoramicTransitionIntent(args: {
  supportSystem: PanoramicSupportSystem;
  continuityMotif: PanoramicContinuityMotif;
  rhythmRole: PanoramicRhythmRole;
  storyBeat: string;
  index: number;
  total: number;
}): string {
  const systemLabel = panoramicSupportSystemLabel(args.supportSystem);
  const motifLabel = panoramicContinuityMotifLabel(args.continuityMotif);

  if (args.rhythmRole === 'open' || args.index === 0) {
    return `Open with a ${systemLabel} and a ${motifLabel} so the strip establishes a clearer recipe before devices start repeating.`;
  }
  if (args.rhythmRole === 'resolve' || args.storyBeat === 'summary' || args.index === args.total - 1) {
    return `Resolve through a ${systemLabel} and a ${motifLabel} so the strip lands on payoff instead of another repeated support card.`;
  }
  if (args.storyBeat === 'trust') {
    return `Turn the middle seam into a ${systemLabel} while the ${motifLabel} carries forward so proof feels escalated rather than recycled from the opener.`;
  }
  return `Pivot the relay beat into a ${systemLabel} and keep the ${motifLabel} moving so the support treatment changes shape across the seam.`;
}

function buildPanoramicLayoutArchetype(args: {
  recipe: string;
  storyBeat: string;
  index: number;
  total: number;
}): string {
  return resolvePanoramicLayoutArchetype(args);
}

function buildPanoramicContinuityRule(args: {
  recipe: string;
  rhythmRole: PanoramicRhythmRole;
  layoutArchetype: string;
  continuityMotif: PanoramicContinuityMotif;
  supportSystem: PanoramicSupportSystem;
  analysis: ScreenshotAnalysis;
  storyBeat: string;
  index: number;
  total: number;
}): string {
  const family = panoramicRecipeFamily(args.recipe);
  const semanticFlavor = analysisSemanticFlavor(args.analysis);
  const rules: string[] = [];

  if (family === 'editorial') {
    rules.push('Keep one clear text rail and let support cards alternate around it instead of repeating centered frames.');
  } else {
    rules.push('Let the dominant device step across the strip while badges and proof systems repeat with intent.');
  }

  rules.push(`Carry the ${panoramicSupportSystemLabel(args.supportSystem)} rhythm across the seam instead of resetting to the same generic support card.`);
  switch (args.continuityMotif) {
    case 'text-rail':
      rules.push('Keep the headline rail marching across adjacent frames so the sequence feels intentionally editorial.');
      break;
    case 'proof-lane':
      rules.push('Maintain a proof lane across adjacent frames so the strip escalates evidence instead of reintroducing it.');
      break;
    case 'signal-wave':
      rules.push('Let signal clusters rise and fall across seams so adjacent frames feel connected instead of isolated.');
      break;
    case 'progress-track':
      rules.push('Carry a visible progress track across seams so each frame advances the workflow instead of restating it.');
      break;
    case 'curation-run':
      rules.push('Repeat curated shelf moments in short bursts so the strip feels selective rather than grid-like.');
      break;
    case 'poster-anchor':
      rules.push('Keep one poster-like anchor per beat so the strip holds atmosphere without flattening into repeated cards.');
      break;
  }

  if (args.layoutArchetype.includes('opener')) {
    rules.push('Make the opening feel poster-led with a single dominant silhouette.');
  } else if (args.layoutArchetype.includes('relay')) {
    rules.push('Change the support-card height or crop emphasis from the previous frame so the middle beats do not flatten out.');
  } else if (args.layoutArchetype.includes('close') || args.layoutArchetype.includes('punch')) {
    rules.push('Tighten the close by giving proof and payoff more visual weight than another feature card.');
  }

  if (semanticFlavor === 'activity') {
    rules.push('Keep feed/support elements alternating high and low so the strip reads like active momentum, not repeated chat tiles.');
  } else if (semanticFlavor === 'document') {
    rules.push('Carry a review/proof lane across seams so the record story feels progressive instead of static.');
  } else if (args.analysis.role === 'workflow') {
    rules.push('Preserve a left-to-right sense of progress so each frame advances the task instead of restating it.');
  } else if (semanticFlavor === 'catalog') {
    rules.push('Let curated strip elements recur in shorter bursts so range reads clearly without turning every frame into a grid.');
  } else if (semanticFlavor === 'media') {
    rules.push('Repeat playback cues sparingly so the strip feels continuous without collapsing into identical player frames.');
  }

  if (args.rhythmRole === 'resolve' || args.storyBeat === 'summary' || args.index === args.total - 1) {
    rules.push('Land on the cleanest payoff frame and reduce supporting noise near the end.');
  }

  return rules.join(' ');
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
        recipe: 'editorial-confidence',
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
        recipe: 'proof-panorama',
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
        recipe: 'wellness-panorama',
        strategy:
          'Build a slower, supportive story around routine, progress, and gentle proof instead of raw feature density.',
        designGoal: 'Supportive wellness story with routine cues, progress proof, and generous whitespace.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Progress Panorama',
        recipe: 'progress-panorama',
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
      specs['concept-c'] = {
        ...specs['concept-c'],
        recipe: 'workflow-panorama',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        recipe: 'momentum-panorama',
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
        recipe: 'conversation-panorama',
        strategy:
          'Thread conversation, feed, and response moments into one connected social story with readable editorial pacing.',
        designGoal: 'Connected social story with conversation, community energy, and readable hierarchy.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Launch Panorama',
        recipe: 'launch-panorama',
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
        recipe: 'gallery-panorama',
        strategy:
          'Build an expressive editorial strip that treats screenshots like a visual gallery with supporting crop stories.',
        designGoal: 'Expressive showcase story with stronger detail, atmosphere, and visual hierarchy.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Portfolio Panorama',
        recipe: 'portfolio-panorama',
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
        recipe: 'world-panorama',
        strategy:
          'Build a connected world-and-progression story with moodier whitespace and clearer payoff beats across frames.',
        designGoal: 'Cinematic panoramic story with strong progression, atmosphere, and reward moments.',
      };
      specs['concept-d'] = {
        ...specs['concept-d'],
        name: 'Cinematic Panorama',
        recipe: 'cinematic-panorama',
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
  recipe: string;
  supportSystem: PanoramicSupportSystem;
  analysis: ScreenshotAnalysis;
  storyBeat: string;
  index: number;
}): PanoramicCompositionFeature[] {
  const recipeFamily = panoramicRecipeFamily(args.recipe);
  const features: PanoramicCompositionFeature[] = ['floating-detail-card'];
  const semanticFlavor = analysisSemanticFlavor(args.analysis);

  if (args.analysis.cropSuitability !== 'low') {
    features.push('layered-detail-extract');
  }

  if (
    recipeFamily === 'bold'
    || args.index === 0
    || args.storyBeat === 'trust'
    || args.storyBeat === 'summary'
  ) {
    features.push('decorative-cluster');
  }

  if (args.storyBeat === 'trust' || args.storyBeat === 'summary') {
    features.push('proof-stack');
  }

  if (args.supportSystem === 'quote-stack' || args.supportSystem === 'proof-column' || args.supportSystem === 'metric-ladder') {
    features.push('proof-stack');
  }
  if (args.supportSystem === 'signal-chain' || args.supportSystem === 'curation-shelf') {
    features.push('decorative-cluster');
  }

  if (args.analysis.role === 'paywall') {
    features.push('proof-stack');
    features.push('decorative-cluster');
  }
  if (args.analysis.role === 'communication') {
    features.push('decorative-cluster');
  }
  if (args.analysis.role === 'discovery') {
    features.push('decorative-cluster');
  }
  if (args.analysis.role === 'workflow' && args.storyBeat !== 'summary') {
    features.push('proof-stack');
  }
  if (args.analysis.role === 'settings' && args.storyBeat !== 'hero') {
    features.push('proof-stack');
  }
  if (args.category === 'finance' && (args.storyBeat === 'hero' || args.storyBeat === 'differentiator')) {
    features.push('proof-stack');
  }
  if (args.category === 'social' && args.storyBeat === 'hero') {
    features.push('decorative-cluster');
  }
  if (semanticFlavor === 'activity') {
    features.push('activity-wave');
    features.push('decorative-cluster');
    if (args.storyBeat === 'hero' || args.storyBeat === 'summary') {
      features.push('proof-stack');
    }
  }
  if (semanticFlavor === 'editor') {
    features.push('toolbar-ribbon');
  }
  if (semanticFlavor === 'profile') {
    features.push('profile-orbit');
    features.push('proof-stack');
  }
  if (semanticFlavor === 'catalog') {
    features.push('browse-strip');
    features.push('decorative-cluster');
  }
  if (semanticFlavor === 'document') {
    features.push('folio-stack');
    features.push('proof-stack');
    if (args.storyBeat !== 'hero') {
      features.push('decorative-cluster');
    }
  }
  if (semanticFlavor === 'support') {
    features.push('support-beacon');
    features.push('proof-stack');
  }
  if (semanticFlavor === 'reward') {
    features.push('reward-ribbon');
    features.push('decorative-cluster');
    if (args.storyBeat === 'trust' || args.storyBeat === 'summary') {
      features.push('proof-stack');
    }
  }
  if (semanticFlavor === 'commerce') {
    features.push('checkout-lane');
    features.push('proof-stack');
    if (args.storyBeat !== 'summary') {
      features.push('decorative-cluster');
    }
  }
  if (semanticFlavor === 'security') {
    features.push('trust-shield');
    features.push('proof-stack');
  }
  if (semanticFlavor === 'capture') {
    features.push('capture-focus');
    features.push('decorative-cluster');
  }
  if (semanticFlavor === 'schedule') {
    features.push('timeline-band');
    if (args.storyBeat !== 'hero') {
      features.push('proof-stack');
    }
  }
  if (semanticFlavor === 'map') {
    features.push('route-arc');
    features.push('decorative-cluster');
  }
  if (semanticFlavor === 'media') {
    features.push('media-marquee');
    features.push('decorative-cluster');
  }

  return [...new Set(features)];
}

function buildPanoramicCompositionNote(args: {
  recipe: string;
  supportSystem: PanoramicSupportSystem;
  continuityMotif?: PanoramicContinuityMotif;
  transitionIntent?: string;
  features: PanoramicCompositionFeature[];
  analysis: ScreenshotAnalysis;
  storyBeat: string;
  layoutArchetype?: string;
  continuityRule?: string;
}): string {
  const parts: string[] = [];
  const recipeFamily = panoramicRecipeFamily(args.recipe);

  switch (args.supportSystem) {
    case 'quote-stack':
      parts.push('Use a quote-stack support system so the frame can carry editorial proof without repeating another crop-card block.');
      break;
    case 'metric-ladder':
      parts.push('Use a metric-ladder support system so proof climbs in short steps instead of flattening into one static badge row.');
      break;
    case 'signal-chain':
      parts.push('Use a signal-chain support system so the frame reads like linked activity beats instead of isolated support chips.');
      break;
    case 'milestone-band':
      parts.push('Use a milestone-band support system so the frame shows progression and checkpoint rhythm across the strip.');
      break;
    case 'curation-shelf':
      parts.push('Use a curation-shelf support system so the frame sells breadth and selective range without repeating a generic card stack.');
      break;
    case 'proof-column':
      parts.push('Use a proof-column support system so the frame stacks endorsement and trust cues with more vertical contrast than a floating card alone.');
      break;
  }

  if (args.continuityMotif) {
    parts.push(`Carry a ${panoramicContinuityMotifLabel(args.continuityMotif)} between adjacent frames so the strip does not reset its visual intent at every seam.`);
  }

  if (args.features.includes('layered-detail-extract')) {
    parts.push('Pull cropped UI details into a layered supporting stack.');
  }

  if (args.features.includes('floating-detail-card')) {
    parts.push(
      recipeFamily === 'editorial'
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
  if (args.features.includes('activity-wave')) {
    parts.push('Run an activity-wave treatment so the frame reads like live updates and momentum instead of isolated chat bubbles or dashboard rows.');
  }
  if (args.features.includes('folio-stack')) {
    parts.push('Use a folio-stack treatment so the frame reads like document review and record clarity instead of generic reporting or editor chrome.');
  }
  if (args.features.includes('toolbar-ribbon')) {
    parts.push('Echo the editor surface with a restrained tool-ribbon treatment instead of generic ornament.');
  }
  if (args.features.includes('profile-orbit')) {
    parts.push('Frame the moment like a creator/profile spotlight with identity and community cues.');
  }
  if (args.features.includes('browse-strip')) {
    parts.push('Mirror the browse experience with a curated strip so the frame sells range without duplicating every tile.');
  }
  if (args.features.includes('support-beacon')) {
    parts.push('Use a support-beacon treatment so the frame reads like guided help and resolution instead of generic settings or chat chrome.');
  }
  if (args.features.includes('reward-ribbon')) {
    parts.push('Add a reward-ribbon treatment so the frame reads like earned perks and member value instead of a generic promo strip.');
  }
  if (args.features.includes('checkout-lane')) {
    parts.push('Run a checkout-lane treatment so the frame reads like confident purchase momentum instead of a generic catalog or paywall panel.');
  }
  if (args.features.includes('trust-shield')) {
    parts.push('Use a trust-shield treatment so the frame reads like secure access and verification confidence instead of generic settings chrome.');
  }
  if (args.features.includes('capture-focus')) {
    parts.push('Use a viewfinder-like capture-focus treatment so the frame reads like a live scan or camera moment instead of generic dark chrome.');
  }
  if (args.features.includes('timeline-band')) {
    parts.push('Run a timeline band through the frame so the sequence reads like scheduled momentum rather than a flat workflow list.');
  }
  if (args.features.includes('route-arc')) {
    parts.push('Echo the navigation moment with a route-arc treatment so the frame reads like guided movement instead of a generic card stack.');
  }
  if (args.features.includes('media-marquee')) {
    parts.push('Add a playback marquee so the frame reads like an active listening or watching moment instead of static artwork.');
  }

  if (parts.length === 0) {
    parts.push(
      args.analysis.cropSuitability === 'low'
        ? 'Keep the full screenshot dominant and let typography carry the frame.'
        : `Support the ${args.storyBeat} beat with one tighter product detail.`,
    );
  }

  if (args.layoutArchetype) {
    parts.push(`Shape the frame like a ${args.layoutArchetype.replace(/-/g, ' ')} instead of repeating the previous panel.`);
  }

  if (args.transitionIntent) {
    parts.push(args.transitionIntent);
  }

  if (args.analysis.role === 'communication') {
    parts.push('Preserve the alternating message rhythm instead of flattening it into one generic crop.');
  } else if (args.analysis.role === 'discovery') {
    parts.push('Treat the supporting crops like browse cards so the frame still feels expansive and exploratory.');
  } else if (args.analysis.role === 'workflow') {
    parts.push('Keep the action path legible so the frame reads like one decisive workflow, not scattered utility UI.');
  } else if (args.analysis.role === 'settings') {
    parts.push('Use settings rows as structured proof panels, not as noisy decoration.');
  } else if (args.analysis.role === 'onboarding') {
    parts.push('Keep the onboarding frame open so the benefit and CTA hierarchy still read clearly.');
  } else if (args.analysis.role === 'paywall') {
    parts.push('Treat the premium moment like a focused offer with stronger contrast and proof cues.');
  } else if (args.analysis.role === 'detail' && args.features.includes('checkout-lane')) {
    parts.push('Keep the transaction proof legible so the frame sells confident completion, not just another product tile.');
  }

  if (args.continuityRule) {
    parts.push(args.continuityRule);
  }

  return parts.join(' ');
}

function buildPanoramicPacing(args: {
  recipe: string;
  analysis: ScreenshotAnalysis;
  storyBeat: string;
  rhythmRole: PanoramicRhythmRole;
  continuityMotif?: PanoramicContinuityMotif;
  conceptId: 'concept-c' | 'concept-d';
  index: number;
  total: number;
  layoutArchetype?: string;
}): string {
  const archetype = panoramicRecipeArchetype(args.recipe);
  const semanticFlavor = analysisSemanticFlavor(args.analysis);

  if (semanticFlavor === 'activity') {
    if (args.storyBeat === 'hero') {
      return archetype === 'conversation' ? 'open with live social motion' : 'open with live momentum';
    }
    if (args.storyBeat === 'summary' || args.index === args.total - 1) {
      return archetype === 'conversation' ? 'land on community payoff' : 'land on follow-through';
    }
    return archetype === 'conversation' ? 'alternate social proof and response beats' : 'keep the feed cadence moving';
  }
  if (semanticFlavor === 'document') {
    if (args.storyBeat === 'hero') {
      return archetype === 'confidence' ? 'open with proof-led clarity' : 'open with focused proof';
    }
    if (args.storyBeat === 'summary' || args.index === args.total - 1) {
      return archetype === 'confidence' ? 'close on verified readiness' : 'close on review confidence';
    }
    return archetype === 'workflow' ? 'step through review state with calm progress' : 'develop a readable record story';
  }
  if (semanticFlavor === 'support') {
    return args.storyBeat === 'summary' || args.index === args.total - 1
      ? 'close on resolved proof'
      : 'build guided reassurance';
  }
  if (semanticFlavor === 'reward') {
    return args.storyBeat === 'summary' || args.index === args.total - 1
      ? 'close on payoff'
      : 'build toward member value';
  }
  if (semanticFlavor === 'commerce') {
    return args.storyBeat === 'summary' || args.index === args.total - 1
      ? 'close on confident handoff'
      : 'build purchase momentum';
  }
  if (semanticFlavor === 'security') {
    return args.storyBeat === 'summary' || args.index === args.total - 1
      ? 'close on verified trust'
      : 'build trusted access';
  }
  if (args.analysis.role === 'workflow') {
    if (args.storyBeat === 'hero') return archetype === 'workflow' ? 'open with decisive control' : 'open with clear task flow';
    if (args.storyBeat === 'summary' || args.index === args.total - 1) {
      return archetype === 'workflow' ? 'close on control and follow-through' : 'close on completed flow';
    }
    return archetype === 'workflow' ? 'stagger progress and proof beats' : 'step the task forward';
  }
  if (semanticFlavor === 'catalog') {
    return args.storyBeat === 'summary' || args.index === args.total - 1
      ? 'close on curated confidence'
      : 'keep the assortment feeling selective';
  }
  if (semanticFlavor === 'media') {
    return args.storyBeat === 'summary' || args.index === args.total - 1
      ? 'close on listening payoff'
      : 'keep playback cues moving';
  }

  if (args.rhythmRole === 'open' || args.index === 0) {
    switch (archetype) {
      case 'wellness':
        return 'open with calm presence';
      case 'workflow':
        return 'open with decisive structure';
      case 'conversation':
        return 'open with immediate social proof';
      case 'gallery':
        return 'open like a curated poster';
      case 'world':
        return 'open with atmosphere and scale';
      default:
        return 'open strong';
    }
  }
  if (args.rhythmRole === 'resolve' || args.index === args.total - 1) {
    switch (archetype) {
      case 'confidence':
        return 'close on proof and confidence';
      case 'wellness':
        return 'close on steady payoff';
      case 'workflow':
        return 'close on control and follow-through';
      case 'conversation':
        return 'close on collective payoff';
      case 'gallery':
        return 'close on polished output';
      case 'world':
        return 'close on cinematic reward';
      default:
        return args.conceptId === 'concept-c' ? 'close quietly' : 'close with payoff';
    }
  }
  if (args.continuityMotif === 'proof-lane') return 'intensify the proof lane without repeating the opener';
  if (args.continuityMotif === 'signal-wave') return 'keep the signal rhythm moving';
  if (args.continuityMotif === 'progress-track') return 'step the progress track forward';
  if (args.continuityMotif === 'curation-run') return 'extend the curated run without flattening it';
  if (args.continuityMotif === 'poster-anchor') return 'hold atmosphere while the strip keeps moving';
  if (args.layoutArchetype?.includes('relay')) return 'alternate dense proof and open breathing room';
  return 'develop narrative';
}

function hasPanoramicFrameArtDirectionOverrides(
  overrides: PanoramicFrameArtDirectionOverrides | undefined,
): overrides is PanoramicFrameArtDirectionOverrides {
  return Boolean(
    overrides?.rhythmRole
    || overrides?.supportSystem
    || overrides?.continuityMotif,
  );
}

function sanitizePanoramicFrameArtDirectionOverrides(
  frame: Partial<PlannedPanoramicFrame> | null | undefined,
): PanoramicFrameArtDirectionOverrides | undefined {
  const candidate = frame?.artDirectionOverrides;
  const overrides: PanoramicFrameArtDirectionOverrides = {};

  if (candidate?.rhythmRole && PANORAMIC_RHYTHM_ROLES.includes(candidate.rhythmRole)) {
    overrides.rhythmRole = candidate.rhythmRole;
  }
  if (candidate?.supportSystem && PANORAMIC_SUPPORT_SYSTEMS.includes(candidate.supportSystem)) {
    overrides.supportSystem = candidate.supportSystem;
  }
  if (candidate?.continuityMotif && PANORAMIC_CONTINUITY_MOTIFS.includes(candidate.continuityMotif)) {
    overrides.continuityMotif = candidate.continuityMotif;
  }

  return hasPanoramicFrameArtDirectionOverrides(overrides) ? overrides : undefined;
}

function buildPanoramicFramePlan(args: {
  category: AppCategory;
  recipe: string;
  conceptId: 'concept-c' | 'concept-d';
  analysis: ScreenshotAnalysis;
  storyBeat: string;
  index: number;
  total: number;
  overrides?: PanoramicFrameArtDirectionOverrides;
}): PlannedPanoramicFrame {
  const inferredRhythmRole = resolvePanoramicRhythmRole({
    storyBeat: args.storyBeat,
    index: args.index,
    total: args.total,
  });
  const rhythmRole = args.overrides?.rhythmRole ?? inferredRhythmRole;
  const layoutArchetype = buildPanoramicLayoutArchetype({
    recipe: args.recipe,
    storyBeat: args.storyBeat,
    index: args.index,
    total: args.total,
  });
  const inferredSupportSystem = buildPanoramicSupportSystem({
    category: args.category,
    recipe: args.recipe,
    analysis: args.analysis,
    storyBeat: args.storyBeat,
    index: args.index,
    total: args.total,
    rhythmRole: inferredRhythmRole,
  });
  const autoSupportSystem = args.overrides?.rhythmRole
    ? buildPanoramicSupportSystem({
        category: args.category,
        recipe: args.recipe,
        analysis: args.analysis,
        storyBeat: args.storyBeat,
        index: args.index,
        total: args.total,
        rhythmRole,
      })
    : inferredSupportSystem;
  const supportSystem = args.overrides?.supportSystem ?? autoSupportSystem;
  const inferredContinuityMotif = buildPanoramicContinuityMotif({
    recipe: args.recipe,
    analysis: args.analysis,
    supportSystem: inferredSupportSystem,
  });
  const autoContinuityMotif = args.overrides?.rhythmRole || args.overrides?.supportSystem
    ? buildPanoramicContinuityMotif({
        recipe: args.recipe,
        analysis: args.analysis,
        supportSystem,
      })
    : inferredContinuityMotif;
  const continuityMotif = args.overrides?.continuityMotif ?? autoContinuityMotif;
  const compositionFeatures = buildPanoramicCompositionFeatures({
    category: args.category,
    recipe: args.recipe,
    supportSystem,
    analysis: args.analysis,
    storyBeat: args.storyBeat,
    index: args.index,
  });
  const transitionIntent = buildPanoramicTransitionIntent({
    supportSystem,
    continuityMotif,
    rhythmRole,
    storyBeat: args.storyBeat,
    index: args.index,
    total: args.total,
  });
  const continuityRule = buildPanoramicContinuityRule({
    recipe: args.recipe,
    rhythmRole,
    layoutArchetype,
    continuityMotif,
    supportSystem,
    analysis: args.analysis,
    storyBeat: args.storyBeat,
    index: args.index,
    total: args.total,
  });

  return {
    frame: args.index + 1,
    sourcePath: args.analysis.path,
    sourceRole: args.analysis.role,
    dominantPalette: args.analysis.dominantPalette,
    focalPoint: args.analysis.focalPoint,
    cropSuitability: args.analysis.cropSuitability,
    storyBeat: args.storyBeat,
    rhythmRole,
    inferredRhythmRole,
    layoutArchetype,
    continuityRule,
    continuityMotif,
    inferredContinuityMotif,
    supportSystem,
    inferredSupportSystem,
    artDirectionOverrides: hasPanoramicFrameArtDirectionOverrides(args.overrides)
      ? args.overrides
      : undefined,
    transitionIntent,
    cropPlan: buildCropPlan({
      analysis: args.analysis,
      storyBeat: args.storyBeat,
      compositionFeatures,
    }),
    pacing: buildPanoramicPacing({
      recipe: args.recipe,
      analysis: args.analysis,
      storyBeat: args.storyBeat,
      rhythmRole,
      continuityMotif,
      conceptId: args.conceptId,
      index: args.index,
      total: args.total,
      layoutArchetype,
    }),
    compositionFeatures,
    compositionNote: buildPanoramicCompositionNote({
      recipe: args.recipe,
      supportSystem,
      continuityMotif,
      transitionIntent,
      features: compositionFeatures,
      analysis: args.analysis,
      storyBeat: args.storyBeat,
      layoutArchetype,
      continuityRule,
    }),
  };
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
  const conceptAFrameStrategy = buildConceptFrameStrategy({
    conceptId: 'concept-a',
    mode: 'individual',
    sequence: conceptSequences['concept-a'],
  });
  const conceptBFrameStrategy = buildConceptFrameStrategy({
    conceptId: 'concept-b',
    mode: 'individual',
    sequence: conceptSequences['concept-b'],
  });
  const conceptCFrameStrategy = buildConceptFrameStrategy({
    conceptId: 'concept-c',
    mode: 'panoramic',
    sequence: conceptSequences['concept-c'],
  });
  const conceptDFrameStrategy = buildConceptFrameStrategy({
    conceptId: 'concept-d',
    mode: 'panoramic',
    sequence: conceptSequences['concept-d'],
  });
  const conceptEFrameStrategy = buildConceptFrameStrategy({
    conceptId: 'concept-e',
    mode: 'panoramic',
    sequence: selected,
  });

  variants.push({
    id: 'concept-a',
    name: conceptA.name,
    currentCapabilityFit: 'supported_now',
    mode: 'individual',
    style: conceptA.style,
    recipe: conceptA.recipe,
    strategy: conceptA.strategy,
    frameStrategy: conceptAFrameStrategy,
    screens: buildIndividualVariantScreens({
      category,
      conceptId: 'concept-a',
      recipe: conceptA.recipe,
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
      frameStrategy: conceptBFrameStrategy,
      screens: buildIndividualVariantScreens({
        category,
        conceptId: 'concept-b',
        recipe: conceptB.recipe,
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
      frameStrategy: conceptCFrameStrategy,
      canvasPlan: {
        frameCount: Math.max(4, selected.length),
        designGoal: conceptC.designGoal ?? 'Premium, connected sequence with strong hierarchy and intentional whitespace.',
        requiredElements: conceptC.requiredElements ?? defaultEditorialElements(),
      },
      frames: editorialSequence.map((analysis, index) =>
        buildPanoramicFramePlan({
          category,
          recipe: conceptC.recipe,
          conceptId: 'concept-c',
          analysis,
          storyBeat: buildSlideRole(index, editorialSequence.length),
          index,
          total: editorialSequence.length,
        })),
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
      frameStrategy: conceptDFrameStrategy,
      canvasPlan: {
        frameCount: Math.max(4, selected.length),
        designGoal: conceptD.designGoal ?? buildGoalLine(goals),
        requiredElements: conceptD.requiredElements ?? defaultBoldElements(),
      },
      frames: boldSequence.map((analysis, index) => ({
        ...buildPanoramicFramePlan({
          category,
          recipe: conceptD.recipe,
          conceptId: 'concept-d',
          analysis,
          storyBeat: buildSlideRole(index, boldSequence.length),
          index,
          total: boldSequence.length,
        }),
        assetGuidance:
          analysis.cropSuitability === 'high'
            ? 'Pair the full screenshot with cropped support details or a floating image asset.'
            : 'Keep the screenshot dominant and let the typography do the extra work.',
      })),
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
      frameStrategy: conceptEFrameStrategy,
      canvasPlan: {
        frameCount: Math.max(3, selected.length),
        designGoal: conceptE.designGoal ?? 'Poster-like brand-led sequence with strong color blocking.',
        requiredElements: conceptE.requiredElements ?? [],
      },
    });
  }

  return variants.slice(0, variantCount);
}

function isPanoramicConceptId(value: string): value is 'concept-c' | 'concept-d' {
  return value === 'concept-c' || value === 'concept-d';
}

export function applyReviewedPlanArtDirectionOverrides(args: {
  plan: VariantSetPlan;
  analysis: ScreenshotAnalysis[];
  reviewedPlan?: {
    variants?: Array<{
      id?: string;
      frames?: Array<Partial<PlannedPanoramicFrame>>;
    }>;
  } | null;
}): VariantSetPlan {
  if (!args.reviewedPlan?.variants?.length) return args.plan;

  const analysisByPath = new Map(args.analysis.map((entry) => [entry.path, entry]));
  const reviewedVariants = new Map(
    args.reviewedPlan.variants
      .flatMap((variant) => (
        typeof variant.id === 'string'
          ? [[variant.id, variant] as const]
          : []
      )),
  );

  let changed = false;
  const variants = args.plan.variants.map((variant) => {
    if (variant.mode !== 'panoramic' || !variant.frames?.length || !isPanoramicConceptId(variant.id)) {
      return variant;
    }
    const conceptId = variant.id;

    const reviewedVariant = reviewedVariants.get(variant.id);
    if (!reviewedVariant?.frames?.length) return variant;

    const reviewedFrames = new Map(
      reviewedVariant.frames.flatMap((frame) => {
        const key = typeof frame.frame === 'number'
          ? `${frame.frame}`
          : typeof frame.sourcePath === 'string'
            ? frame.sourcePath
            : null;
        return key ? [[key, frame] as const] : [];
      }),
    );

    const frames = variant.frames.map((frame, index) => {
      const reviewedFrame = reviewedFrames.get(`${frame.frame}`) ?? reviewedFrames.get(frame.sourcePath);
      const overrides = sanitizePanoramicFrameArtDirectionOverrides(reviewedFrame);
      if (!overrides) return frame;

      const analysis = analysisByPath.get(frame.sourcePath);
      if (!analysis) return frame;

      changed = true;
      const rebuiltFrame = buildPanoramicFramePlan({
        category: args.plan.app.category,
        recipe: variant.recipe,
        conceptId,
        analysis,
        storyBeat: frame.storyBeat,
        index,
        total: variant.frames!.length,
        overrides,
      });

      return frame.assetGuidance
        ? { ...rebuiltFrame, assetGuidance: frame.assetGuidance }
        : rebuiltFrame;
    });

    return { ...variant, frames };
  });

  return changed ? { ...args.plan, variants } : args.plan;
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
  return buildVariantSetPlanFromAnalysis({
    appName: args.appName,
    appDescription: args.appDescription,
    platforms: args.platforms,
    analysis: analyses,
    goals: args.goals,
    variantCount: args.variantCount,
    screenCount: args.screenCount,
    category: inferCategory(args.appDescription, args.features),
  });
}

export function buildVariantSetPlanFromAnalysis(args: {
  appName: string;
  appDescription: string;
  platforms: string[];
  analysis: ScreenshotAnalysis[];
  goals?: string[];
  variantCount?: number;
  screenCount?: number;
  category?: AppCategory;
}): VariantSetPlan {
  const analyses = args.analysis;
  const screenCount = Math.max(
    3,
    Math.min(args.screenCount ?? Math.min(5, analyses.length || 5), Math.max(analyses.length, 3)),
  );
  const selected = selectScreensForPlan(
    analyses,
    Math.min(screenCount, analyses.length || screenCount),
  );
  const goals = args.goals ?? [];
  const category = args.category ?? inferCategory(args.appDescription, []);

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
      semanticFlavor: analysis.semanticFlavor,
      semanticFlavorConfidence: analysis.semanticFlavorConfidence,
      heroPriority: analysis.heroPriority,
      inferredOrder: analysis.inferredOrder,
      focus: analysis.focus,
      unsafeForTextOverlay: analysis.unsafeForTextOverlay,
      embeddedTextSample: sampleEmbeddedTextPhrases(analysis.textInsights, 2),
      textOccupiedRegions: analysis.occupiedRegions,
    })),
    variants: buildVariantEntries(selected, category, goals, args.variantCount ?? 4),
  };
}
