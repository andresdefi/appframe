import { create } from 'zustand';
import type {
  ScreenState,
  AppframeConfig,
  LocaleConfig,
  TemplateStyle,
  FrameStyle,
  PanoramicElement,
  PanoramicBackground,
  PanoramicEffects,
} from './types';
import { PLATFORM_DEVICE_DEFAULTS } from './types';
import { syncPanoramicDevicesToPlatform } from './utils/deviceFrames';
import {
  rebuildAutopilotSessionFromReview as rebuildAutopilotSessionFromReviewApi,
  saveSession as saveSessionApi,
  type ReviewedAutopilotRebuildResult,
} from './utils/api';

function getConfiguredLocaleText(
  locales: Record<string, LocaleConfig>,
  index: number,
  locale: string,
  field: 'headline' | 'subtitle',
): string | undefined {
  if (locale === 'default') return undefined;
  return locales[locale]?.screens?.[index]?.[field];
}

export function createScreenState(
  index: number,
  config: AppframeConfig,
  platform: string,
): ScreenState {
  const screen = config.screens[index];
  const pd = PLATFORM_DEVICE_DEFAULTS[platform] ?? PLATFORM_DEVICE_DEFAULTS.iphone!;

  return {
    screenIndex: index,
    eyebrow: screen?.eyebrow ?? '',
    headline: screen ? screen.headline : 'New Frame',
    subtitle: screen ? (screen.subtitle ?? '') : '',
    accentColor: screen?.accentColor ?? '',
    style: 'minimal' as TemplateStyle,
    layout: 'center',
    font: config.theme.font,
    fontWeight: config.theme.fontWeight,
    headlineSize: config.theme.headlineSize ?? 0,
    subtitleSize: config.theme.subtitleSize ?? 0,
    headlineRotation: 0,
    subtitleRotation: 0,
    colors: {
      primary: config.theme.colors.primary,
      secondary: config.theme.colors.secondary,
      background: config.theme.colors.background,
      text: config.theme.colors.text,
      subtitle: config.theme.colors.subtitle ?? '#64748B',
    },
    frameId: config.frames.ios ?? config.frames.android ?? '',
    deviceColor: config.frames.deviceColor ?? '',
    frameStyle: (config.frames.style === '3d' ? 'flat' : config.frames.style) as FrameStyle,
    composition: 'single',
    deviceScale: pd.deviceScale,
    deviceTop: pd.deviceTop,
    deviceRotation: 0,
    deviceOffsetX: 0,
    deviceAngle: pd.deviceAngle,
    deviceTilt: 0,
    headlineGradient: null,
    subtitleGradient: null,
    autoSizeHeadline: true,
    autoSizeSubtitle: false,
    headlineLineHeight: 0,
    headlineLetterSpacing: 0,
    headlineTextTransform: '',
    headlineFontStyle: '',
    subtitleOpacity: 0,
    subtitleLetterSpacing: 0,
    subtitleTextTransform: '',
    spotlight: null,
    annotations: [],
    textPositions: { headline: null, subtitle: null },
    screenshotDataUrl: null,
    screenshotName: screen?.screenshot?.split('/').pop() ?? null,
    screenshotDims: null,
    backgroundType: 'solid',
    backgroundColor: '#ffffff',
    backgroundGradient: {
      type: 'linear',
      colors: ['#6366f1', '#ec4899'],
      direction: 135,
      radialPosition: 'center',
    },
    backgroundImageDataUrl: null,
    backgroundOverlay: null,
    deviceShadow: null,
    borderSimulation: null,
    cornerRadius: 0,
    loupe: null,
    callouts: [],
    overlays: [],
    extraScreenshots: [],
  };
}

// Font info from /api/fonts
export interface FontData {
  id: string;
  name: string;
  weights: number[];
  category?: 'sans-serif' | 'serif' | 'display';
}

// Frame info from /api/frames
export interface FrameData {
  id: string;
  name: string;
  year: number;
  platform?: string;
  tags?: string[];
  screenResolution?: { width: number; height: number };
  screenArea?: { x: number; y: number; width: number; height: number; borderRadius: number };
  frameSize?: { width: number; height: number };
}

// Koubou family info from /api/koubou-devices
export interface DeviceFamily {
  id: string;
  name: string;
  category: string;
  year: number;
  colors: { name: string }[];
  screenResolution: { width: number; height: number };
  previewFrameId?: string;
  screenRect?: unknown;
}

// Size info from /api/sizes
export interface SizeEntry {
  key: string;
  name: string;
  width: number;
  height: number;
}

export type VariantStatus = 'draft' | 'approved';

export interface VariantArtifact {
  id: string;
  kind: 'screens' | 'frames';
  exportedAt: string;
  locale: string;
  mode: 'individual' | 'panoramic';
  sizeKey: string;
  renderer: string;
  fileNames: string[];
  manifestName: string;
  outputDir?: string;
  filePaths?: string[];
  configPath?: string;
}

export interface VariantPreviewArtifact {
  id: string;
  createdAt: string;
  outputDir: string;
  mode: 'individual' | 'panoramic';
  platform: string;
  filePaths: string[];
  thumbnailPath: string | null;
}

export interface VariantScoreSummary {
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

export interface VariantCopyAssignment {
  unitKind: 'screen' | 'frame';
  unitIndex: number;
  slot: 'hero' | 'differentiator' | 'feature' | 'trust' | 'summary';
  headline: string;
  subtitle?: string;
  sourceFeature?: string;
  sourcePath?: string;
  sourceRole?: string;
}

export type RefinementActionId =
  | 'premium'
  | 'shorter-copy'
  | 'frameless'
  | 'lighter'
  | 'darker'
  | 'bigger-text'
  | 'reduce-overlap';

export interface VariantHistoryEntry {
  id: string;
  createdAt: string;
  type: 'created' | 'duplicated' | 'refined' | 'status-change' | 'saved';
  label: string;
  detail?: string;
  actionId?: RefinementActionId;
  sourceVariantId?: string;
}

export interface VariantProvenance {
  origin: 'manual' | 'autopilot' | 'duplicate' | 'refinement';
  parentVariantId?: string;
  parentVariantName?: string;
  branchDepth: number;
  note?: string;
}

export interface AutopilotRefinementHistoryEntry {
  createdAt: string;
  prompt: string;
  detail?: string;
  variantId?: string;
  branchVariantId?: string;
  mode?: 'manual' | 'ai';
  actionId?: RefinementActionId;
  actions?: RefinementActionId[];
  referenceVariantId?: string;
  referenceVariantName?: string;
}

export interface ScreenshotSemanticFlavorAlternative {
  flavor: string;
  score: number;
}

export interface AutopilotScreenshotAnalysis {
  path: string;
  role: string;
  semanticFlavor?: string;
  semanticFlavorConfidence?: string;
  semanticFlavorReason?: string[];
  semanticFlavorAlternatives?: ScreenshotSemanticFlavorAlternative[];
  semanticFlavorNeedsReview?: boolean;
  inferredSemanticFlavor?: string;
  inferredSemanticFlavorConfidence?: string;
  semanticFlavorOverride?: string | null;
  heroPriority: number;
  inferredOrder: number | null;
  focus: string;
  unsafeForTextOverlay: boolean;
  heroExplanation?: string[];
  orderingReason?: string[];
  embeddedTextSample?: string[];
  textOccupiedRegions?: string[];
}

export interface AutopilotCopyCandidate {
  headline: string;
  subtitle?: string;
  sourceFeature?: string;
}

export interface AutopilotSelectedCopySet {
  hero: AutopilotCopyCandidate;
  differentiator: AutopilotCopyCandidate;
  features: AutopilotCopyCandidate[];
  trust?: AutopilotCopyCandidate;
  summary: AutopilotCopyCandidate;
}

export interface AutopilotPlanVariant {
  id: string;
  name: string;
  mode: 'individual' | 'panoramic';
  style: string;
  recipe: string;
  strategy: string;
  artDirection?: {
    surfaceStyle?: string;
    fontFamily?: string;
    deviceLayout?: string;
    textPlacement?: string;
  };
  frameStrategy?: {
    defaultTreatment: string;
    framelessAllowedWhen: string[];
    rationale: string;
  };
  screens?: Array<{
    index: number;
    sourcePath: string;
    sourceRole: string;
    slideRole: string;
    layout: string;
    composition: string;
    backgroundStrategy: string;
    copyDirection: string;
    cropPlan?: {
      usage: string;
      anchor: string;
      avoidRegions: string[];
      rationale: string;
    };
    implementationNote?: string;
  }>;
  canvasPlan?: {
    frameCount: number;
    designGoal: string;
    requiredElements: Array<{
      type: string;
      purpose: string;
    }>;
  };
  frames?: Array<{
    frame: number;
    sourcePath: string;
    sourceRole: string;
    cropSuitability: string;
    storyBeat: string;
    rhythmRole?: string;
    layoutArchetype?: string;
    continuityRule?: string;
    continuityMotif?: string;
    supportSystem?: string;
    transitionIntent?: string;
    cropPlan?: {
      usage: string;
      anchor: string;
      avoidRegions: string[];
      rationale: string;
    };
    compositionFeatures?: string[];
    compositionNote?: string;
  }>;
}

export interface AutopilotConceptPlan {
  analysisSummary?: {
    screenshotCount: number;
    selectedCount: number;
    topHeroCandidate: string | null;
    topHeroExplanation?: string[];
  };
  selectedScreens?: Array<{
    path: string;
    role: string;
    semanticFlavor?: string;
    semanticFlavorConfidence?: string;
    semanticFlavorReason?: string[];
    semanticFlavorAlternatives?: ScreenshotSemanticFlavorAlternative[];
    semanticFlavorNeedsReview?: boolean;
    inferredSemanticFlavor?: string;
    inferredSemanticFlavorConfidence?: string;
    semanticFlavorOverride?: string | null;
    inferredOrder: number | null;
    unsafeForTextOverlay: boolean;
    embeddedTextSample?: string[];
    textOccupiedRegions?: string[];
  }>;
  variants: AutopilotPlanVariant[];
}

export interface AutopilotPanoramicReviewControls {
  recipe?: string | null;
  continuityMotif?: string | null;
  supportSystem?: string | null;
  pacing?: 'calmer' | 'bolder' | null;
  proofDensity?: 'lighter' | 'heavier' | null;
  decorativeIntensity?: 'quieter' | 'bolder' | null;
  surfaceStyle?: 'clean' | 'editorial' | 'bold' | 'branded' | 'playful' | 'glow' | null;
  fontFamily?: 'inter' | 'space-grotesk' | 'plus-jakarta-sans' | 'playfair-display' | 'dm-sans' | null;
  deviceLayout?: 'staggered' | 'poster' | 'split' | null;
  textPlacement?: 'top-left' | 'top-center' | 'mid-left' | null;
  beatOverrides?: Partial<Record<'open' | 'intensify' | 'resolve', {
    layoutArchetype?: string | null;
    supportSystem?: 'quote-stack' | 'metric-ladder' | 'signal-chain' | 'milestone-band' | 'curation-shelf' | 'proof-column' | null;
  } | undefined>>;
}

export type AutopilotReviewControls = Record<string, AutopilotPanoramicReviewControls | undefined>;

export interface VariantSnapshot {
  platform: string;
  previewW: number;
  previewH: number;
  locale: string;
  sessionLocales: Record<string, LocaleConfig>;
  isPanoramic: boolean;
  screens: ScreenState[];
  selectedScreen: number;
  panoramicFrameCount: number;
  panoramicBackground: PanoramicBackground;
  panoramicElements: PanoramicElement[];
  panoramicEffects: PanoramicEffects;
  selectedElementIndex: number | null;
  exportSize: string;
  exportRenderer: string;
}

export interface VariantRecord {
  id: string;
  name: string;
  description?: string;
  status: VariantStatus;
  createdAt: string;
  updatedAt: string;
  snapshot: VariantSnapshot;
  artifacts: VariantArtifact[];
  previewArtifacts: VariantPreviewArtifact[];
  copyAssignments: VariantCopyAssignment[];
  score?: VariantScoreSummary;
  history: VariantHistoryEntry[];
  provenance?: VariantProvenance;
}

export interface PreviewStore {
  // App-level state
  config: AppframeConfig | null;
  sessionLocales: Record<string, LocaleConfig>;
  variants: VariantRecord[];
  activeVariantId: string | null;
  recommendedVariantId: string | null;
  recommendationReason: string | null;
  autopilotAnalysis: AutopilotScreenshotAnalysis[];
  autopilotSelectedCopySet: AutopilotSelectedCopySet | null;
  autopilotConceptPlan: AutopilotConceptPlan | null;
  autopilotReviewControls: AutopilotReviewControls;
  autopilotRefinementHistory: AutopilotRefinementHistoryEntry[];
  sessionSaveBaseline: string | null;
  sessionBacked: boolean;
  platform: string;
  previewW: number;
  previewH: number;
  selectedScreen: number;
  activeTab: string;
  locale: string;
  previewBg: 'dark' | 'light';
  renderVersion: number;

  // Panoramic mode state
  isPanoramic: boolean;
  panoramicFrameCount: number;
  panoramicBackground: PanoramicBackground;
  panoramicElements: PanoramicElement[];
  panoramicEffects: PanoramicEffects;
  selectedElementIndex: number | null;

  // Catalog data
  fonts: FontData[];
  frames: FrameData[];
  deviceFamilies: DeviceFamily[];
  koubouAvailable: boolean;
  sizes: Record<string, SizeEntry[]>;
  exportSize: string;
  exportRenderer: string;

  // Per-screen state
  screens: ScreenState[];

  // Actions
  setConfig: (config: AppframeConfig) => void;
  setPlatform: (platform: string) => void;
  setPreviewSize: (w: number, h: number) => void;
  setSelectedScreen: (index: number) => void;
  setActiveTab: (tab: string) => void;
  setLocale: (locale: string) => void;
  upsertLocaleConfig: (locale: string, localeConfig: LocaleConfig) => void;
  setAutopilotSemanticFlavorOverride: (path: string, semanticFlavor: string | null) => void;
  setAutopilotSemanticFlavorOverrides: (paths: string[], semanticFlavor: string | null) => void;
  resetAutopilotSemanticFlavorOverrides: () => void;
  setAutopilotPanoramicReviewControls: (
    variantId: string,
    controls: Partial<AutopilotPanoramicReviewControls>,
  ) => void;
  createVariant: (name?: string) => void;
  duplicateActiveVariant: () => void;
  applyRefinementToActive: (actionId: RefinementActionId) => void;
  applyAiRefinementPlanToActive: (args: {
    prompt: string;
    label: string;
    detail?: string;
    actions: RefinementActionId[];
    nameSuggestion?: string;
    referenceVariantId?: string;
    referenceVariantName?: string;
  }) => void;
  createVariantSet: () => void;
  selectVariant: (id: string) => void;
  approveVariant: (id: string) => void;
  renameVariant: (id: string, name: string) => void;
  deleteVariant: (id: string) => void;
  setVariantStatus: (id: string, status: VariantStatus) => void;
  recordVariantArtifact: (artifact: Omit<VariantArtifact, 'id' | 'exportedAt'>) => void;
  recordVariantArtifactForVariant: (variantId: string, artifact: Omit<VariantArtifact, 'id' | 'exportedAt'>) => void;
  setPreviewBg: (bg: 'dark' | 'light') => void;
  setExportSize: (size: string) => void;
  setExportRenderer: (renderer: string) => void;
  setFonts: (fonts: FontData[]) => void;
  setFrames: (frames: FrameData[]) => void;
  setDeviceFamilies: (families: DeviceFamily[]) => void;
  setKoubouAvailable: (available: boolean) => void;
  setSizes: (sizes: Record<string, SizeEntry[]>) => void;
  updateScreen: (index: number, partial: Partial<ScreenState>) => void;
  triggerRender: () => void;
  initScreens: (config: AppframeConfig, platform: string) => void;
  hydrateSession: (session: {
    activeVariantId: string;
    variants: Array<{
      id: string;
      name: string;
      description?: string;
      status: string;
      config: AppframeConfig;
      artifacts?: unknown[];
      previewArtifacts?: VariantPreviewArtifact[];
      copyAssignments?: VariantCopyAssignment[];
      score?: VariantScoreSummary;
      history?: VariantHistoryEntry[];
      provenance?: VariantProvenance;
    }>;
    autopilot?: {
      recommendedVariantId?: string | null;
      recommendationReason?: string | null;
      screenshotAnalysis?: AutopilotScreenshotAnalysis[];
      selectedCopySet?: AutopilotSelectedCopySet;
      conceptPlan?: AutopilotConceptPlan;
      reviewControls?: AutopilotReviewControls;
      refinementHistory?: AutopilotRefinementHistoryEntry[];
    };
  }) => void;
  addScreen: () => void;
  removeScreen: (index: number) => void;
  moveScreen: (from: number, to: number) => void;

  // Panoramic actions
  togglePanoramic: () => void;
  setSelectedElement: (index: number | null) => void;
  updatePanoramicBackground: (bg: Partial<PanoramicBackground>) => void;
  updatePanoramicElement: (index: number, partial: Partial<PanoramicElement>) => void;
  syncPanoramicDevicesForPlatform: (platform: string) => void;
  addPanoramicElement: (element: PanoramicElement) => void;
  removePanoramicElement: (index: number) => void;
  setPanoramicFrameCount: (count: number) => void;
  updatePanoramicEffects: (partial: Partial<PanoramicEffects>) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;
  saveSession: () => Promise<void>;
  rebuildAutopilotSessionFromReview: (options?: {
    refreshPreviews?: boolean;
    branchVariants?: boolean;
  }) => Promise<ReviewedAutopilotRebuildResult>;
  isSavingSession: boolean;
}

// Simple undo/redo history for screen and panoramic state
interface HistoryEntry {
  screens: ScreenState[];
  panoramicElements: PanoramicElement[];
  panoramicBackground: PanoramicBackground;
  panoramicEffects: PanoramicEffects;
  selectedScreen: number;
  selectedElementIndex: number | null;
}

const MAX_HISTORY = 50;
let _undoStack: HistoryEntry[] = [];
let _redoStack: HistoryEntry[] = [];
let _skipSnapshot = false;

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const SEMANTIC_FLAVOR_NONE = 'none';

type SemanticFlavorReviewState = {
  semanticFlavor?: string;
  semanticFlavorConfidence?: string;
  inferredSemanticFlavor?: string;
  inferredSemanticFlavorConfidence?: string;
  semanticFlavorOverride?: string | null;
};

function normalizeSemanticFlavorReview<T extends SemanticFlavorReviewState>(entry: T): T {
  const inferredSemanticFlavor = entry.inferredSemanticFlavor ?? entry.semanticFlavor;
  const inferredSemanticFlavorConfidence =
    entry.inferredSemanticFlavorConfidence ?? entry.semanticFlavorConfidence;
  const semanticFlavorOverride =
    typeof entry.semanticFlavorOverride === 'string'
      ? entry.semanticFlavorOverride
      : null;

  if (semanticFlavorOverride === SEMANTIC_FLAVOR_NONE) {
    return {
      ...entry,
      semanticFlavor: undefined,
      semanticFlavorConfidence: undefined,
      inferredSemanticFlavor,
      inferredSemanticFlavorConfidence,
      semanticFlavorOverride,
    };
  }

  if (
    semanticFlavorOverride
    && (!inferredSemanticFlavor || semanticFlavorOverride !== inferredSemanticFlavor)
  ) {
    return {
      ...entry,
      semanticFlavor: semanticFlavorOverride,
      semanticFlavorConfidence: undefined,
      inferredSemanticFlavor,
      inferredSemanticFlavorConfidence,
      semanticFlavorOverride,
    };
  }

  return {
    ...entry,
    semanticFlavor: inferredSemanticFlavor,
    semanticFlavorConfidence: inferredSemanticFlavorConfidence,
    inferredSemanticFlavor,
    inferredSemanticFlavorConfidence,
    semanticFlavorOverride: null,
  };
}

function applySemanticFlavorOverride<T extends SemanticFlavorReviewState>(
  entry: T,
  semanticFlavor: string | null,
): T {
  const normalized = normalizeSemanticFlavorReview(entry);
  if (semanticFlavor === null) {
    return normalizeSemanticFlavorReview({
      ...normalized,
      semanticFlavorOverride: null,
    });
  }

  return normalizeSemanticFlavorReview({
    ...normalized,
    semanticFlavorOverride: semanticFlavor || SEMANTIC_FLAVOR_NONE,
  });
}

function normalizeAutopilotAnalysis(
  analysis: AutopilotScreenshotAnalysis[],
): AutopilotScreenshotAnalysis[] {
  return analysis.map((entry) => normalizeSemanticFlavorReview(entry));
}

function normalizeAutopilotConceptPlan(
  conceptPlan: AutopilotConceptPlan | null,
): AutopilotConceptPlan | null {
  if (!conceptPlan?.selectedScreens?.length) return conceptPlan;
  return {
    ...conceptPlan,
    selectedScreens: conceptPlan.selectedScreens.map((entry) => normalizeSemanticFlavorReview(entry)),
  };
}

function normalizeAutopilotPanoramicReviewControlsEntry(
  controls: AutopilotPanoramicReviewControls | null | undefined,
): AutopilotPanoramicReviewControls | undefined {
  if (!controls) return undefined;
  const normalized: AutopilotPanoramicReviewControls = {};
  if (typeof controls.recipe === 'string' && controls.recipe.trim().length > 0) {
    normalized.recipe = controls.recipe.trim();
  }
  if (typeof controls.continuityMotif === 'string' && controls.continuityMotif.trim().length > 0) {
    normalized.continuityMotif = controls.continuityMotif.trim();
  }
  if (typeof controls.supportSystem === 'string' && controls.supportSystem.trim().length > 0) {
    normalized.supportSystem = controls.supportSystem.trim();
  }
  if (controls.pacing === 'calmer' || controls.pacing === 'bolder') {
    normalized.pacing = controls.pacing;
  }
  if (controls.proofDensity === 'lighter' || controls.proofDensity === 'heavier') {
    normalized.proofDensity = controls.proofDensity;
  }
  if (controls.decorativeIntensity === 'quieter' || controls.decorativeIntensity === 'bolder') {
    normalized.decorativeIntensity = controls.decorativeIntensity;
  }
  if (
    controls.surfaceStyle === 'clean'
    || controls.surfaceStyle === 'editorial'
    || controls.surfaceStyle === 'bold'
    || controls.surfaceStyle === 'branded'
    || controls.surfaceStyle === 'playful'
    || controls.surfaceStyle === 'glow'
  ) {
    normalized.surfaceStyle = controls.surfaceStyle;
  }
  if (
    controls.fontFamily === 'inter'
    || controls.fontFamily === 'space-grotesk'
    || controls.fontFamily === 'plus-jakarta-sans'
    || controls.fontFamily === 'playfair-display'
    || controls.fontFamily === 'dm-sans'
  ) {
    normalized.fontFamily = controls.fontFamily;
  }
  if (
    controls.deviceLayout === 'staggered'
    || controls.deviceLayout === 'poster'
    || controls.deviceLayout === 'split'
  ) {
    normalized.deviceLayout = controls.deviceLayout;
  }
  if (
    controls.textPlacement === 'top-left'
    || controls.textPlacement === 'top-center'
    || controls.textPlacement === 'mid-left'
  ) {
    normalized.textPlacement = controls.textPlacement;
  }
  if (isRecord(controls.beatOverrides)) {
    const beatOverrides: NonNullable<AutopilotPanoramicReviewControls['beatOverrides']> = {};
    for (const role of ['open', 'intensify', 'resolve'] as const) {
      const beatOverride = controls.beatOverrides[role];
      if (!isRecord(beatOverride)) continue;

      const normalizedBeatOverride: NonNullable<NonNullable<AutopilotPanoramicReviewControls['beatOverrides']>[typeof role]> = {};
      if (
        typeof beatOverride.layoutArchetype === 'string'
        && beatOverride.layoutArchetype.trim().length > 0
      ) {
        normalizedBeatOverride.layoutArchetype = beatOverride.layoutArchetype.trim();
      }
      if (
        beatOverride.supportSystem === 'quote-stack'
        || beatOverride.supportSystem === 'metric-ladder'
        || beatOverride.supportSystem === 'signal-chain'
        || beatOverride.supportSystem === 'milestone-band'
        || beatOverride.supportSystem === 'curation-shelf'
        || beatOverride.supportSystem === 'proof-column'
      ) {
        normalizedBeatOverride.supportSystem = beatOverride.supportSystem;
      }
      if (Object.keys(normalizedBeatOverride).length > 0) {
        beatOverrides[role] = normalizedBeatOverride;
      }
    }
    if (Object.keys(beatOverrides).length > 0) {
      normalized.beatOverrides = beatOverrides;
    }
  }
  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function mergeAutopilotPanoramicReviewControls(
  current: AutopilotPanoramicReviewControls | undefined,
  incoming: Partial<AutopilotPanoramicReviewControls>,
): AutopilotPanoramicReviewControls | undefined {
  const mergedBeatOverrides = { ...(current?.beatOverrides ?? {}) };
  if (incoming.beatOverrides) {
    for (const role of ['open', 'intensify', 'resolve'] as const) {
      const beatOverride = incoming.beatOverrides[role];
      if (!beatOverride) continue;
      mergedBeatOverrides[role] = {
        ...(current?.beatOverrides?.[role] ?? {}),
        ...beatOverride,
      };
    }
  }

  return normalizeAutopilotPanoramicReviewControlsEntry({
    ...(current ?? {}),
    ...incoming,
    ...(incoming.beatOverrides ? { beatOverrides: mergedBeatOverrides } : {}),
  });
}

function normalizeAutopilotReviewControls(
  controls: unknown,
): AutopilotReviewControls {
  if (!isRecord(controls)) return {};
  const normalized: AutopilotReviewControls = {};
  for (const [variantId, value] of Object.entries(controls)) {
    const entry = normalizeAutopilotPanoramicReviewControlsEntry(
      isRecord(value) ? value as AutopilotPanoramicReviewControls : undefined,
    );
    if (entry) normalized[variantId] = entry;
  }
  return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeHistoryEntry(
  type: VariantHistoryEntry['type'],
  label: string,
  extras: Omit<VariantHistoryEntry, 'id' | 'createdAt' | 'type' | 'label'> = {},
): VariantHistoryEntry {
  return {
    id: makeId('history'),
    createdAt: new Date().toISOString(),
    type,
    label,
    ...extras,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function shiftHexColor(hex: string | undefined, amount: number): string | undefined {
  if (!hex || !/^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) return hex;
  const value = hex.slice(1);
  const rgb = value.slice(0, 6);
  const alpha = value.length === 8 ? value.slice(6) : '';
  const next = [0, 2, 4]
    .map((offset) => clamp(parseInt(rgb.slice(offset, offset + 2), 16) + amount, 0, 255))
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('');
  return `#${next}${alpha}`;
}

function shortenTextValue(value: string, maxWords: number): string {
  const normalized = value
    .replace(/\n/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (normalized.length <= maxWords) return value;
  return normalized.slice(0, maxWords).join(' ');
}

function mapPanoramicElementTree(
  elements: PanoramicElement[],
  mapper: (element: PanoramicElement) => PanoramicElement,
): PanoramicElement[] {
  return elements.map((element) => {
    const mapped = mapper(element);
    if (mapped.type === 'group') {
      return {
        ...mapped,
        children: mapPanoramicElementTree(mapped.children, mapper) as Extract<PanoramicElement, { type: 'group' }>['children'],
      };
    }
    return mapped;
  });
}

export function getRefinementLabel(actionId: RefinementActionId): string {
  switch (actionId) {
    case 'premium':
      return 'Make more premium';
    case 'shorter-copy':
      return 'Shorten copy';
    case 'frameless':
      return 'Use frameless devices';
    case 'lighter':
      return 'Make lighter';
    case 'darker':
      return 'Make darker';
    case 'bigger-text':
      return 'Increase text size';
    case 'reduce-overlap':
      return 'Reduce overlap';
  }
}

function applyRefinementToSnapshot(snapshot: VariantSnapshot, actionId: RefinementActionId): VariantSnapshot {
  const next = deepCopy(snapshot);

  if (!next.isPanoramic) {
    next.screens = next.screens.map((screen) => {
      switch (actionId) {
        case 'premium':
          return {
            ...screen,
            style: 'editorial',
            fontWeight: Math.max(screen.fontWeight, 700),
            frameStyle: 'none',
            cornerRadius: Math.max(screen.cornerRadius, 24),
            colors: {
              ...screen.colors,
              background: '#F5F0E8',
              text: '#2C2416',
              subtitle: '#7A7062',
              primary: '#8B7355',
              secondary: '#C1B08B',
            },
          };
        case 'shorter-copy':
          return {
            ...screen,
            headline: shortenTextValue(screen.headline, 4),
            subtitle: screen.subtitle ? shortenTextValue(screen.subtitle, 7) : screen.subtitle,
          };
        case 'frameless':
          return {
            ...screen,
            frameStyle: 'none',
            cornerRadius: Math.max(screen.cornerRadius, 24),
          };
        case 'lighter':
          return {
            ...screen,
            colors: {
              ...screen.colors,
              background: shiftHexColor(screen.colors.background, 18) ?? screen.colors.background,
              primary: shiftHexColor(screen.colors.primary, 12) ?? screen.colors.primary,
              secondary: shiftHexColor(screen.colors.secondary, 12) ?? screen.colors.secondary,
              text: '#1C1917',
              subtitle: '#57534E',
            },
            backgroundColor: shiftHexColor(screen.backgroundColor, 16) ?? screen.backgroundColor,
          };
        case 'darker':
          return {
            ...screen,
            colors: {
              ...screen.colors,
              background: shiftHexColor(screen.colors.background, -26) ?? screen.colors.background,
              primary: shiftHexColor(screen.colors.primary, -8) ?? screen.colors.primary,
              secondary: shiftHexColor(screen.colors.secondary, -8) ?? screen.colors.secondary,
              text: '#F8FAFC',
              subtitle: '#CBD5E1',
            },
            backgroundColor: shiftHexColor(screen.backgroundColor, -20) ?? screen.backgroundColor,
          };
        case 'bigger-text':
          return {
            ...screen,
            headlineSize: Math.min((screen.headlineSize || 0) + 6, 72),
            subtitleSize: Math.min((screen.subtitleSize || 0) + 4, 48),
          };
        case 'reduce-overlap':
          return {
            ...screen,
            deviceTop: Math.min(screen.deviceTop + 4, 40),
            deviceScale: Math.max(screen.deviceScale - 6, 72),
          };
      }
    });
    return next;
  }

  if (actionId === 'premium') {
    next.panoramicBackground = {
      ...next.panoramicBackground,
      color: '#F5F0E8',
      layers: next.panoramicBackground.layers?.map((layer) => ({
        ...layer,
        opacity: clamp((layer.opacity ?? 1) * 0.9, 0, 1),
      })),
    };
  }

  if (actionId === 'lighter' || actionId === 'darker') {
    const amount = actionId === 'lighter' ? 18 : -24;
    next.panoramicBackground = {
      ...next.panoramicBackground,
      color: shiftHexColor(next.panoramicBackground.color, amount) ?? next.panoramicBackground.color,
      layers: next.panoramicBackground.layers?.map((layer) => ({
        ...layer,
        color: shiftHexColor(layer.color, amount) ?? layer.color,
        colors: layer.colors?.map((color) => shiftHexColor(color, amount) ?? color),
      })),
    };
  }

  next.panoramicElements = mapPanoramicElementTree(next.panoramicElements, (element) => {
    switch (actionId) {
      case 'premium':
        if (element.type === 'text') {
          return { ...element, fontSize: Math.min(element.fontSize + 0.2, 6), color: '#2C2416', fontWeight: 700 };
        }
        if (element.type === 'label') {
          return { ...element, color: '#7A7062' };
        }
        if (element.type === 'device') {
          return { ...element, frameStyle: 'none', cornerRadius: Math.max(element.cornerRadius ?? 0, 24) };
        }
        return element;
      case 'shorter-copy':
        if (element.type === 'text' || element.type === 'label' || element.type === 'badge') {
          return { ...element, content: shortenTextValue(element.content, element.type === 'text' ? 5 : 4) };
        }
        if (element.type === 'card') {
          return {
            ...element,
            title: element.title ? shortenTextValue(element.title, 4) : element.title,
            body: element.body ? shortenTextValue(element.body, 7) : element.body,
          };
        }
        if (element.type === 'proof-chip') {
          return {
            ...element,
            value: shortenTextValue(element.value, 4),
            detail: element.detail ? shortenTextValue(element.detail, 5) : element.detail,
          };
        }
        return element;
      case 'frameless':
        if (element.type === 'device') {
          return { ...element, frameStyle: 'none', cornerRadius: Math.max(element.cornerRadius ?? 0, 24) };
        }
        return element;
      case 'lighter':
      case 'darker': {
        const amount = actionId === 'lighter' ? 18 : -24;
        if (element.type === 'text' || element.type === 'label') {
          return {
            ...element,
            color: shiftHexColor(element.color, amount) ?? element.color,
            backgroundColor: 'backgroundColor' in element
              ? shiftHexColor(element.backgroundColor, amount) ?? element.backgroundColor
              : undefined,
          };
        }
        if (element.type === 'card' || element.type === 'badge' || element.type === 'proof-chip' || element.type === 'logo') {
          return {
            ...element,
            backgroundColor: shiftHexColor(element.backgroundColor, amount) ?? element.backgroundColor,
            borderColor: shiftHexColor(element.borderColor, amount) ?? element.borderColor,
            color: 'color' in element ? shiftHexColor(element.color, amount) ?? element.color : undefined,
            titleColor: 'titleColor' in element ? shiftHexColor(element.titleColor, amount) ?? element.titleColor : undefined,
            bodyColor: 'bodyColor' in element ? shiftHexColor(element.bodyColor, amount) ?? element.bodyColor : undefined,
            eyebrowColor: 'eyebrowColor' in element ? shiftHexColor(element.eyebrowColor, amount) ?? element.eyebrowColor : undefined,
            mutedColor: 'mutedColor' in element ? shiftHexColor(element.mutedColor, amount) ?? element.mutedColor : undefined,
          };
        }
        if (element.type === 'decoration') {
          return { ...element, color: shiftHexColor(element.color, amount) ?? element.color };
        }
        return element;
      }
      case 'bigger-text':
        if (element.type === 'text') {
          return { ...element, fontSize: Math.min(element.fontSize + 0.45, 8), y: Math.max(element.y - 1, 1) };
        }
        if (element.type === 'label') {
          return { ...element, fontSize: Math.min(element.fontSize + 0.2, 3.5) };
        }
        if (element.type === 'card') {
          return {
            ...element,
            titleSize: Math.min(element.titleSize + 0.4, 10),
            bodySize: Math.min(element.bodySize + 0.2, 6),
            eyebrowSize: Math.min(element.eyebrowSize + 0.1, 3),
          };
        }
        if (element.type === 'badge') {
          return { ...element, fontSize: Math.min(element.fontSize + 0.15, 4) };
        }
        if (element.type === 'proof-chip') {
          return {
            ...element,
            valueSize: Math.min(element.valueSize + 0.2, 6),
            detailSize: Math.min(element.detailSize + 0.1, 4),
          };
        }
        return element;
      case 'reduce-overlap':
        if (element.type === 'device') {
          return { ...element, y: Math.min(element.y + 3.5, 34), width: Math.max(element.width - 1, 10.5) };
        }
        if (element.type === 'text') {
          return { ...element, y: Math.max(element.y - 1, 2), maxWidth: Math.min((element.maxWidth ?? 18) + 2, 28) };
        }
        if (element.type === 'group' || element.type === 'proof-chip' || element.type === 'badge' || element.type === 'card') {
          return { ...element, y: Math.min(element.y + 4, 84) };
        }
        return element;
    }
  });

  return next;
}

function applyRefinementSequenceToSnapshot(
  snapshot: VariantSnapshot,
  actionIds: RefinementActionId[],
): VariantSnapshot {
  return actionIds.reduce(
    (currentSnapshot, actionId) => applyRefinementToSnapshot(currentSnapshot, actionId),
    deepCopy(snapshot),
  );
}

function buildRefinementBranchName(baseName: string, label: string, nameSuggestion?: string): string {
  if (nameSuggestion && nameSuggestion.trim().length > 0) {
    return nameSuggestion.trim();
  }
  const suffix = label
    .replace(/^AI refinement:\s*/i, '')
    .replace(/^Make /, '')
    .replace(/^Use /, '')
    .replace(/^Increase /, '')
    .replace(/^Shorten /, '')
    .replace(/^Reduce /, '')
    .trim();
  return suffix ? `${baseName} ${suffix}` : `${baseName} Refined`;
}

export function variantSnapshotFromState(
  state: Pick<
    PreviewStore,
    | 'platform'
    | 'previewW'
    | 'previewH'
    | 'locale'
    | 'sessionLocales'
    | 'isPanoramic'
    | 'screens'
    | 'selectedScreen'
    | 'panoramicFrameCount'
    | 'panoramicBackground'
    | 'panoramicElements'
    | 'panoramicEffects'
    | 'selectedElementIndex'
    | 'exportSize'
    | 'exportRenderer'
  >,
): VariantSnapshot {
  return {
    platform: state.platform,
    previewW: state.previewW,
    previewH: state.previewH,
    locale: state.locale,
    sessionLocales: deepCopy(state.sessionLocales),
    isPanoramic: state.isPanoramic,
    screens: deepCopy(state.screens),
    selectedScreen: state.selectedScreen,
    panoramicFrameCount: state.panoramicFrameCount,
    panoramicBackground: deepCopy(state.panoramicBackground),
    panoramicElements: deepCopy(state.panoramicElements),
    panoramicEffects: deepCopy(state.panoramicEffects),
    selectedElementIndex: state.selectedElementIndex,
    exportSize: state.exportSize,
    exportRenderer: state.exportRenderer,
  };
}

function applyVariantSnapshot(
  snapshot: VariantSnapshot,
): Pick<
  PreviewStore,
  | 'platform'
  | 'previewW'
  | 'previewH'
  | 'locale'
  | 'sessionLocales'
  | 'isPanoramic'
  | 'screens'
  | 'selectedScreen'
  | 'panoramicFrameCount'
  | 'panoramicBackground'
  | 'panoramicElements'
  | 'panoramicEffects'
  | 'selectedElementIndex'
  | 'exportSize'
  | 'exportRenderer'
> {
  return {
    platform: snapshot.platform,
    previewW: snapshot.previewW,
    previewH: snapshot.previewH,
    locale: snapshot.locale,
    sessionLocales: deepCopy(snapshot.sessionLocales),
    isPanoramic: snapshot.isPanoramic,
    screens: deepCopy(snapshot.screens),
    selectedScreen: snapshot.selectedScreen,
    panoramicFrameCount: snapshot.panoramicFrameCount,
    panoramicBackground: deepCopy(snapshot.panoramicBackground),
    panoramicElements: deepCopy(snapshot.panoramicElements),
    panoramicEffects: deepCopy(snapshot.panoramicEffects),
    selectedElementIndex: snapshot.selectedElementIndex,
    exportSize: snapshot.exportSize,
    exportRenderer: snapshot.exportRenderer,
  };
}

function coerceVariantSnapshot(
  candidate: unknown,
  fallback: VariantSnapshot,
): VariantSnapshot {
  if (!candidate || typeof candidate !== 'object') return fallback;
  const snapshot = candidate as Partial<VariantSnapshot>;
  if (!Array.isArray(snapshot.screens) || !Array.isArray(snapshot.panoramicElements)) {
    return fallback;
  }

  return {
    ...fallback,
    ...snapshot,
    locale: typeof snapshot.locale === 'string' ? snapshot.locale : fallback.locale,
    sessionLocales:
      snapshot.sessionLocales && typeof snapshot.sessionLocales === 'object'
        ? deepCopy(snapshot.sessionLocales as Record<string, LocaleConfig>)
        : fallback.sessionLocales,
    screens: deepCopy(snapshot.screens as ScreenState[]),
    panoramicBackground: deepCopy(
      (snapshot.panoramicBackground ?? fallback.panoramicBackground) as PanoramicBackground,
    ),
    panoramicElements: deepCopy(snapshot.panoramicElements as PanoramicElement[]),
    panoramicEffects: deepCopy(
      (snapshot.panoramicEffects ?? fallback.panoramicEffects) as PanoramicEffects,
    ),
    exportSize: typeof snapshot.exportSize === 'string' ? snapshot.exportSize : fallback.exportSize,
    exportRenderer:
      typeof snapshot.exportRenderer === 'string'
        ? snapshot.exportRenderer
        : fallback.exportRenderer,
  };
}

function syncActiveVariantRecord(
  variants: VariantRecord[],
  activeVariantId: string | null,
  state: Pick<
    PreviewStore,
    | 'platform'
    | 'previewW'
    | 'previewH'
    | 'locale'
    | 'sessionLocales'
    | 'isPanoramic'
    | 'screens'
    | 'selectedScreen'
    | 'panoramicFrameCount'
    | 'panoramicBackground'
    | 'panoramicElements'
    | 'panoramicEffects'
    | 'selectedElementIndex'
    | 'exportSize'
    | 'exportRenderer'
  >,
): VariantRecord[] {
  if (!activeVariantId) return variants;

  const snapshot = variantSnapshotFromState(state);
  const updatedAt = new Date().toISOString();
  return variants.map((variant) =>
    variant.id === activeVariantId ? { ...variant, snapshot, updatedAt } : variant,
  );
}

function buildVariantRecord(
  name: string,
  state: Pick<
    PreviewStore,
    | 'platform'
    | 'previewW'
    | 'previewH'
    | 'locale'
    | 'sessionLocales'
    | 'isPanoramic'
    | 'screens'
    | 'selectedScreen'
    | 'panoramicFrameCount'
    | 'panoramicBackground'
    | 'panoramicElements'
    | 'panoramicEffects'
    | 'selectedElementIndex'
    | 'exportSize'
    | 'exportRenderer'
  >,
  options: {
    description?: string;
    provenance?: VariantProvenance;
    history?: VariantHistoryEntry[];
  } = {},
): VariantRecord {
  const timestamp = new Date().toISOString();
  return {
    id: makeId('variant'),
    name,
    description: options.description,
    status: 'draft',
    createdAt: timestamp,
    updatedAt: timestamp,
    snapshot: variantSnapshotFromState(state),
    artifacts: [],
    previewArtifacts: [],
    copyAssignments: [],
    history: options.history ?? [makeHistoryEntry('created', 'Variant created')],
    provenance: options.provenance ?? { origin: 'manual', branchDepth: 0 },
  };
}

function cloneVariantRecord(
  source: VariantRecord,
  snapshot: VariantSnapshot,
  options: {
    name: string;
    description?: string;
    provenance: VariantProvenance;
    historyEntry: VariantHistoryEntry;
  },
): VariantRecord {
  const timestamp = new Date().toISOString();
  return {
    ...source,
    id: makeId('variant'),
    name: options.name,
    description: options.description ?? source.description,
    status: 'draft',
    createdAt: timestamp,
    updatedAt: timestamp,
    snapshot,
    artifacts: [],
    previewArtifacts: [],
    score: undefined,
    history: [options.historyEntry, ...source.history],
    provenance: options.provenance,
  };
}

function coerceVariantArtifact(candidate: unknown): VariantArtifact | null {
  if (!isRecord(candidate)) return null;

  const mode = candidate.mode === 'panoramic' ? 'panoramic' : 'individual';
  const filePaths = Array.isArray(candidate.filePaths)
    ? candidate.filePaths.filter((entry): entry is string => typeof entry === 'string')
    : [];
  const fileNames = Array.isArray(candidate.fileNames)
    ? candidate.fileNames.filter((entry): entry is string => typeof entry === 'string')
    : filePaths.map((entry) => entry.split('/').pop() ?? entry);

  return {
    id: typeof candidate.id === 'string' ? candidate.id : makeId('artifact'),
    kind: candidate.kind === 'frames' ? 'frames' : mode === 'panoramic' ? 'frames' : 'screens',
    exportedAt: typeof candidate.exportedAt === 'string' ? candidate.exportedAt : new Date().toISOString(),
    locale: typeof candidate.locale === 'string' ? candidate.locale : 'default',
    mode,
    sizeKey: typeof candidate.sizeKey === 'string' ? candidate.sizeKey : '',
    renderer: typeof candidate.renderer === 'string' ? candidate.renderer : 'playwright',
    fileNames,
    manifestName: typeof candidate.manifestName === 'string' ? candidate.manifestName : '',
    outputDir: typeof candidate.outputDir === 'string' ? candidate.outputDir : undefined,
    filePaths,
    configPath: typeof candidate.configPath === 'string' ? candidate.configPath : undefined,
  };
}

function coerceVariantHistory(candidate: unknown): VariantHistoryEntry[] {
  if (!Array.isArray(candidate)) return [];
  return candidate
    .filter(isRecord)
    .map((entry) => ({
      id: typeof entry.id === 'string' ? entry.id : makeId('history'),
      createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString(),
      type:
        entry.type === 'created'
        || entry.type === 'duplicated'
        || entry.type === 'refined'
        || entry.type === 'status-change'
        || entry.type === 'saved'
          ? entry.type
          : 'created',
      label: typeof entry.label === 'string' ? entry.label : 'Variant updated',
      detail: typeof entry.detail === 'string' ? entry.detail : undefined,
      actionId:
        entry.actionId === 'premium'
        || entry.actionId === 'shorter-copy'
        || entry.actionId === 'frameless'
        || entry.actionId === 'lighter'
        || entry.actionId === 'darker'
        || entry.actionId === 'bigger-text'
        || entry.actionId === 'reduce-overlap'
          ? entry.actionId
          : undefined,
      sourceVariantId: typeof entry.sourceVariantId === 'string' ? entry.sourceVariantId : undefined,
    }));
}

function coerceVariantProvenance(candidate: unknown): VariantProvenance | undefined {
  if (!isRecord(candidate)) return undefined;
  const origin =
    candidate.origin === 'manual'
    || candidate.origin === 'autopilot'
    || candidate.origin === 'duplicate'
    || candidate.origin === 'refinement'
      ? candidate.origin
      : 'manual';
  return {
    origin,
    parentVariantId: typeof candidate.parentVariantId === 'string' ? candidate.parentVariantId : undefined,
    parentVariantName: typeof candidate.parentVariantName === 'string' ? candidate.parentVariantName : undefined,
    branchDepth: typeof candidate.branchDepth === 'number' ? candidate.branchDepth : 0,
    note: typeof candidate.note === 'string' ? candidate.note : undefined,
  };
}

function serializeSaveVariant(variant: VariantRecord) {
  return {
    id: variant.id,
    name: variant.name,
    description: variant.description,
    status: variant.status,
    snapshot: deepCopy(variant.snapshot),
    artifacts: deepCopy(variant.artifacts),
    previewArtifacts: deepCopy(variant.previewArtifacts),
    copyAssignments: deepCopy(variant.copyAssignments),
    score: variant.score ? deepCopy(variant.score) : undefined,
    history: deepCopy(variant.history),
    provenance: variant.provenance ? deepCopy(variant.provenance) : undefined,
  };
}

export function buildSessionSavePayload(args: {
  activeVariantId: string;
  recommendedVariantId: string | null;
  recommendationReason: string | null;
  autopilotAnalysis: AutopilotScreenshotAnalysis[];
  autopilotSelectedCopySet: AutopilotSelectedCopySet | null;
  autopilotConceptPlan: AutopilotConceptPlan | null;
  autopilotReviewControls: AutopilotReviewControls;
  autopilotRefinementHistory: AutopilotRefinementHistoryEntry[];
  variants: VariantRecord[];
}) {
  return {
    activeVariantId: args.activeVariantId,
    recommendedVariantId: args.recommendedVariantId,
    recommendationReason: args.recommendationReason,
    screenshotAnalysis: deepCopy(args.autopilotAnalysis),
    selectedCopySet: args.autopilotSelectedCopySet ? deepCopy(args.autopilotSelectedCopySet) : null,
    conceptPlan: args.autopilotConceptPlan ? deepCopy(args.autopilotConceptPlan) : null,
    reviewControls: deepCopy(args.autopilotReviewControls),
    refinementHistory: deepCopy(args.autopilotRefinementHistory),
    variants: args.variants.map((variant) => serializeSaveVariant(variant)),
  };
}

function nextVariantName(variants: VariantRecord[], prefix = 'Variant'): string {
  let index = variants.length + 1;
  let candidate = `${prefix} ${index}`;
  const taken = new Set(variants.map((variant) => variant.name));
  while (taken.has(candidate)) {
    index += 1;
    candidate = `${prefix} ${index}`;
  }
  return candidate;
}

function pushSnapshot(state: {
  screens: ScreenState[];
  panoramicElements: PanoramicElement[];
  panoramicBackground: PanoramicBackground;
  panoramicEffects: PanoramicEffects;
  selectedScreen: number;
  selectedElementIndex: number | null;
}) {
  if (_skipSnapshot) return;
  _undoStack.push({
    screens: deepCopy(state.screens),
    panoramicElements: deepCopy(state.panoramicElements),
    panoramicBackground: deepCopy(state.panoramicBackground),
    panoramicEffects: deepCopy(state.panoramicEffects),
    selectedScreen: state.selectedScreen,
    selectedElementIndex: state.selectedElementIndex,
  });
  _redoStack = [];
  if (_undoStack.length > MAX_HISTORY) _undoStack.shift();
}

export const usePreviewStore = create<PreviewStore>((set, get) => ({
  config: null,
  variants: [],
  activeVariantId: null,
  recommendedVariantId: null,
  recommendationReason: null,
  autopilotAnalysis: [],
  autopilotSelectedCopySet: null,
  autopilotConceptPlan: null,
  autopilotReviewControls: {},
  autopilotRefinementHistory: [],
  sessionSaveBaseline: null,
  sessionBacked: false,
  platform: 'iphone',
  previewW: 400,
  previewH: 868,
  selectedScreen: 0,
  activeTab: 'background',
  locale: 'default',
  previewBg: 'dark',
  renderVersion: 0,
  isPanoramic: false,
  panoramicFrameCount: 5,
  panoramicBackground: { type: 'solid', color: '#ffffff', layers: [] } as PanoramicBackground,
  panoramicElements: [] as PanoramicElement[],
  panoramicEffects: { spotlight: null, annotations: [], overlays: [] } as PanoramicEffects,
  selectedElementIndex: null,
  fonts: [],
  frames: [],
  deviceFamilies: [],
  koubouAvailable: false,
  sizes: {},
  exportSize: '',
  exportRenderer: 'playwright',
  screens: [],
  sessionLocales: {},
  isSavingSession: false,

  setConfig: (config) => set({ config }),
  setPlatform: (platform) => set({ platform }),
  setPreviewSize: (w, h) => set({ previewW: w, previewH: h }),
  setSelectedScreen: (index) => set({ selectedScreen: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLocale: (locale) => set({ locale }),
  upsertLocaleConfig: (locale, localeConfig) =>
    set((state) => ({
      sessionLocales: {
        ...state.sessionLocales,
        [locale]: localeConfig,
      },
    })),
  setAutopilotSemanticFlavorOverride: (path, semanticFlavor) =>
    get().setAutopilotSemanticFlavorOverrides([path], semanticFlavor),
  setAutopilotSemanticFlavorOverrides: (paths, semanticFlavor) =>
    set((state) => {
      if (paths.length === 0) return state;
      const pathSet = new Set(paths);
      let changed = false;
      const autopilotAnalysis = state.autopilotAnalysis.map((entry) => {
        if (!pathSet.has(entry.path)) return entry;
        changed = true;
        return applySemanticFlavorOverride(entry, semanticFlavor);
      });

      const autopilotConceptPlan = state.autopilotConceptPlan?.selectedScreens?.some((entry) => pathSet.has(entry.path))
        ? {
            ...state.autopilotConceptPlan,
            selectedScreens: state.autopilotConceptPlan.selectedScreens.map((entry) =>
              pathSet.has(entry.path) ? applySemanticFlavorOverride(entry, semanticFlavor) : entry),
          }
        : state.autopilotConceptPlan;

      return changed ? { autopilotAnalysis, autopilotConceptPlan } : state;
    }),
  resetAutopilotSemanticFlavorOverrides: () =>
    set((state) => {
      const overridePaths = state.autopilotAnalysis
        .filter((entry) => entry.semanticFlavorOverride)
        .map((entry) => entry.path);
      if (overridePaths.length === 0) return state;
      const pathSet = new Set(overridePaths);
      return {
        autopilotAnalysis: state.autopilotAnalysis.map((entry) =>
          pathSet.has(entry.path) ? applySemanticFlavorOverride(entry, null) : entry),
        autopilotConceptPlan: state.autopilotConceptPlan?.selectedScreens?.some((entry) => pathSet.has(entry.path))
          ? {
              ...state.autopilotConceptPlan,
              selectedScreens: state.autopilotConceptPlan.selectedScreens.map((entry) =>
                pathSet.has(entry.path) ? applySemanticFlavorOverride(entry, null) : entry),
            }
          : state.autopilotConceptPlan,
      };
    }),
  setAutopilotPanoramicReviewControls: (variantId, controls) =>
    set((state) => {
      const current = state.autopilotReviewControls[variantId];
      const nextEntry = mergeAutopilotPanoramicReviewControls(current, controls);
      if (!nextEntry && !current) return state;

      const autopilotReviewControls = { ...state.autopilotReviewControls };
      if (nextEntry) autopilotReviewControls[variantId] = nextEntry;
      else delete autopilotReviewControls[variantId];
      return { autopilotReviewControls };
    }),
  createVariant: (name) =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const variant = buildVariantRecord(name ?? nextVariantName(variants), state, {
        history: [makeHistoryEntry('created', 'Variant created manually')],
        provenance: { origin: 'manual', branchDepth: 0 },
      });
      return {
        variants: [...variants, variant],
        activeVariantId: variant.id,
        ...applyVariantSnapshot(variant.snapshot),
      };
    }),
  duplicateActiveVariant: () =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const activeVariant = variants.find((variant) => variant.id === state.activeVariantId);
      const baseSnapshot = variantSnapshotFromState(state);
      const variant = activeVariant
        ? cloneVariantRecord(activeVariant, baseSnapshot, {
            name: `${activeVariant.name} Branch`,
            provenance: {
              origin: 'duplicate',
              parentVariantId: activeVariant.id,
              parentVariantName: activeVariant.name,
              branchDepth: (activeVariant.provenance?.branchDepth ?? 0) + 1,
              note: 'Branched from the active concept.',
            },
            historyEntry: makeHistoryEntry('duplicated', 'Branched from active variant', {
              sourceVariantId: activeVariant.id,
            }),
          })
        : buildVariantRecord(nextVariantName(variants), state, {
            history: [makeHistoryEntry('created', 'Variant created manually')],
            provenance: { origin: 'manual', branchDepth: 0 },
          });
      return {
        variants: [...variants, variant],
        activeVariantId: variant.id,
        ...applyVariantSnapshot(variant.snapshot),
      };
    }),
  applyRefinementToActive: (actionId) =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const activeVariant = variants.find((variant) => variant.id === state.activeVariantId);
      if (!activeVariant) return state;

      const refinedSnapshot = applyRefinementToSnapshot(activeVariant.snapshot, actionId);
      const refinementLabel = getRefinementLabel(actionId);
      const branch = cloneVariantRecord(activeVariant, refinedSnapshot, {
        name: buildRefinementBranchName(activeVariant.name, refinementLabel),
        description: activeVariant.description,
        provenance: {
          origin: 'refinement',
          parentVariantId: activeVariant.id,
          parentVariantName: activeVariant.name,
          branchDepth: (activeVariant.provenance?.branchDepth ?? 0) + 1,
          note: refinementLabel,
        },
        historyEntry: makeHistoryEntry('refined', refinementLabel, {
          detail: `Prompt: ${refinementLabel}\nActions: ${refinementLabel}`,
          actionId,
          sourceVariantId: activeVariant.id,
        }),
      });
      const refinementHistoryEntry: AutopilotRefinementHistoryEntry = {
        createdAt: branch.createdAt,
        prompt: refinementLabel,
        detail: 'Applied a safe local refinement branch.',
        variantId: activeVariant.id,
        branchVariantId: branch.id,
        mode: 'manual',
        actionId,
        actions: [actionId],
      };

      return {
        variants: [...variants, branch],
        activeVariantId: branch.id,
        autopilotRefinementHistory: [refinementHistoryEntry, ...state.autopilotRefinementHistory],
        ...applyVariantSnapshot(branch.snapshot),
      };
    }),
  applyAiRefinementPlanToActive: (args) =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const activeVariant = variants.find((variant) => variant.id === state.activeVariantId);
      if (!activeVariant || args.actions.length === 0) return state;

      const refinedSnapshot = applyRefinementSequenceToSnapshot(activeVariant.snapshot, args.actions);
      const branch = cloneVariantRecord(activeVariant, refinedSnapshot, {
        name: buildRefinementBranchName(activeVariant.name, args.label, args.nameSuggestion),
        description: activeVariant.description,
        provenance: {
          origin: 'refinement',
          parentVariantId: activeVariant.id,
          parentVariantName: activeVariant.name,
          branchDepth: (activeVariant.provenance?.branchDepth ?? 0) + 1,
          note: args.label,
        },
        historyEntry: makeHistoryEntry('refined', args.label, {
          detail: [
            `Prompt: ${args.prompt}`,
            args.detail ? `Why: ${args.detail}` : null,
            `Actions: ${args.actions.map((actionId) => getRefinementLabel(actionId)).join(', ')}`,
            args.referenceVariantName ? `Reference: ${args.referenceVariantName}` : null,
          ].filter((value): value is string => Boolean(value)).join('\n'),
          actionId: args.actions.length === 1 ? args.actions[0] : undefined,
          sourceVariantId: activeVariant.id,
        }),
      });

      const refinementHistoryEntry: AutopilotRefinementHistoryEntry = {
        createdAt: branch.createdAt,
        prompt: args.prompt,
        detail: args.detail ?? args.label,
        variantId: activeVariant.id,
        branchVariantId: branch.id,
        mode: 'ai',
        actionId: args.actions.length === 1 ? args.actions[0] : undefined,
        actions: deepCopy(args.actions),
        referenceVariantId: args.referenceVariantId,
        referenceVariantName: args.referenceVariantName,
      };

      return {
        variants: [...variants, branch],
        activeVariantId: branch.id,
        autopilotRefinementHistory: [refinementHistoryEntry, ...state.autopilotRefinementHistory],
        ...applyVariantSnapshot(branch.snapshot),
      };
    }),
  createVariantSet: () =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const baseState = variantSnapshotFromState(state);

      if (variants.length === 1 && state.activeVariantId) {
        const conceptA = variants[0];
        if (!conceptA) return state;
        const renamed = {
          ...conceptA,
          name: 'Concept A',
          snapshot: baseState,
          updatedAt: new Date().toISOString(),
        };
        const conceptB = buildVariantRecord('Concept B', state, {
          history: [makeHistoryEntry('created', 'Concept created manually')],
          provenance: { origin: 'manual', branchDepth: 0 },
        });
        const conceptC = buildVariantRecord('Concept C', state, {
          history: [makeHistoryEntry('created', 'Concept created manually')],
          provenance: { origin: 'manual', branchDepth: 0 },
        });
        const conceptD = buildVariantRecord('Concept D', state, {
          history: [makeHistoryEntry('created', 'Concept created manually')],
          provenance: { origin: 'manual', branchDepth: 0 },
        });
        return {
          variants: [renamed, conceptB, conceptC, conceptD],
          activeVariantId: renamed.id,
          ...applyVariantSnapshot(renamed.snapshot),
        };
      }

      const conceptA = buildVariantRecord(nextVariantName(variants, 'Concept'), state, {
        history: [makeHistoryEntry('created', 'Concept created manually')],
        provenance: { origin: 'manual', branchDepth: 0 },
      });
      const conceptB = buildVariantRecord(
        nextVariantName([...variants, conceptA], 'Concept'),
        state,
        { history: [makeHistoryEntry('created', 'Concept created manually')], provenance: { origin: 'manual', branchDepth: 0 } },
      );
      const conceptC = buildVariantRecord(
        nextVariantName([...variants, conceptA, conceptB], 'Concept'),
        state,
        { history: [makeHistoryEntry('created', 'Concept created manually')], provenance: { origin: 'manual', branchDepth: 0 } },
      );
      const conceptD = buildVariantRecord(
        nextVariantName([...variants, conceptA, conceptB, conceptC], 'Concept'),
        state,
        { history: [makeHistoryEntry('created', 'Concept created manually')], provenance: { origin: 'manual', branchDepth: 0 } },
      );
      return {
        variants: [...variants, conceptA, conceptB, conceptC, conceptD],
        activeVariantId: conceptA.id,
        ...applyVariantSnapshot(conceptA.snapshot),
      };
    }),
  selectVariant: (id) =>
    set((state) => {
      if (id === state.activeVariantId) return state;
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const nextVariant = variants.find((variant) => variant.id === id);
      if (!nextVariant) return state;
      return {
        variants,
        activeVariantId: id,
        ...applyVariantSnapshot(nextVariant.snapshot),
      };
    }),
  approveVariant: (id) =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const nextVariant = variants.find((variant) => variant.id === id);
      if (!nextVariant) return state;
      const updatedAt = new Date().toISOString();
      return {
        variants: variants.map((variant) => ({
          ...variant,
          status: variant.id === id ? 'approved' : 'draft',
          updatedAt,
          history:
            variant.id === id
              ? [makeHistoryEntry('status-change', 'Variant approved'), ...variant.history]
              : variant.history,
        })),
        activeVariantId: id,
        ...applyVariantSnapshot(nextVariant.snapshot),
      };
    }),
  renameVariant: (id, name) =>
    set((state) => ({
      variants: state.variants.map((variant) =>
        variant.id === id
          ? { ...variant, name: name.trim() || variant.name, updatedAt: new Date().toISOString() }
          : variant,
      ),
    })),
  deleteVariant: (id) =>
    set((state) => {
      if (state.variants.length <= 1) return state;

      if (id !== state.activeVariantId) {
        return { variants: state.variants.filter((variant) => variant.id !== id) };
      }

      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state).filter(
        (variant) => variant.id !== id,
      );
      const nextVariant = variants[0];
      if (!nextVariant) return state;
      return {
        variants,
        activeVariantId: nextVariant.id,
        ...applyVariantSnapshot(nextVariant.snapshot),
      };
    }),
  setVariantStatus: (id, status) =>
    set((state) => ({
      variants: state.variants.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              status,
              updatedAt: new Date().toISOString(),
              history: [
                makeHistoryEntry('status-change', status === 'approved' ? 'Variant approved' : 'Variant moved to draft'),
                ...variant.history,
              ],
            }
          : variant,
      ),
    })),
  recordVariantArtifact: (artifact) =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      if (!state.activeVariantId) return { variants };
      const nextArtifact: VariantArtifact = {
        ...artifact,
        id: makeId('artifact'),
        exportedAt: new Date().toISOString(),
      };
      return {
        variants: variants.map((variant) =>
          variant.id === state.activeVariantId
            ? {
                ...variant,
                updatedAt: nextArtifact.exportedAt,
                artifacts: [nextArtifact, ...variant.artifacts],
              }
            : variant,
        ),
      };
    }),
  recordVariantArtifactForVariant: (variantId, artifact) =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const nextArtifact: VariantArtifact = {
        ...artifact,
        id: makeId('artifact'),
        exportedAt: new Date().toISOString(),
      };
      return {
        variants: variants.map((variant) =>
          variant.id === variantId
            ? {
                ...variant,
                updatedAt: nextArtifact.exportedAt,
                artifacts: [nextArtifact, ...variant.artifacts],
              }
            : variant,
        ),
      };
    }),
  setPreviewBg: (bg) => set({ previewBg: bg }),
  setExportSize: (size) => set({ exportSize: size }),
  setExportRenderer: (renderer) => set({ exportRenderer: renderer }),
  setFonts: (fonts) => set({ fonts }),
  setFrames: (frames) => set({ frames }),
  setDeviceFamilies: (families) => set({ deviceFamilies: families }),
  setKoubouAvailable: (available) => set({ koubouAvailable: available }),
  setSizes: (sizes) => set({ sizes }),

  updateScreen: (index, partial) =>
    set((state) => {
      const screens = [...state.screens];
      const current = screens[index];
      if (!current) return state;
      pushSnapshot(state);
      screens[index] = { ...current, ...partial };
      return { screens };
    }),

  triggerRender: () => set((state) => ({ renderVersion: state.renderVersion + 1 })),

  initScreens: (config, platform) => {
    const isPanoramic = config.mode === 'panoramic';
    const currentState = get();
    const currentLocale = currentState.locale;
    const nextLocale =
      currentLocale !== 'default' && config.locales?.[currentLocale] ? currentLocale : 'default';
    const sessionLocales = deepCopy(config.locales ?? {});

    // Always build individual screens if the config has them
    const screens =
      config.screens.length > 0
        ? config.screens.map((_screen, i) => createScreenState(i, config, platform))
        : [];

    // Always populate panoramic state if the config has it
    const panoramicUpdate = config.panoramic
      ? {
          panoramicFrameCount: config.frameCount ?? 5,
          panoramicBackground: config.panoramic.background,
          panoramicElements: config.panoramic.elements,
        }
      : {
          panoramicFrameCount: currentState.panoramicFrameCount,
          panoramicBackground: currentState.panoramicBackground,
          panoramicElements: currentState.panoramicElements,
        };

    const baseVariant = buildVariantRecord('Concept A', {
      platform,
      previewW: currentState.previewW,
      previewH: currentState.previewH,
      locale: nextLocale,
      sessionLocales,
      isPanoramic,
      screens,
      selectedScreen: 0,
      panoramicFrameCount: panoramicUpdate.panoramicFrameCount,
      panoramicBackground: panoramicUpdate.panoramicBackground,
      panoramicElements: panoramicUpdate.panoramicElements,
      panoramicEffects: currentState.panoramicEffects,
      selectedElementIndex: null,
      exportSize: currentState.exportSize,
      exportRenderer: currentState.exportRenderer,
    }, {
      history: [makeHistoryEntry('created', 'Concept created from loaded config')],
      provenance: { origin: 'manual', branchDepth: 0, note: 'Initialized from the current config.' },
    });

    set({
      config,
      sessionLocales,
      variants: [baseVariant],
      activeVariantId: baseVariant.id,
      recommendedVariantId: null,
      recommendationReason: null,
      autopilotAnalysis: [],
      autopilotSelectedCopySet: null,
      autopilotConceptPlan: null,
      autopilotReviewControls: {},
      autopilotRefinementHistory: [],
      sessionSaveBaseline: null,
      sessionBacked: false,
      isPanoramic,
      locale: nextLocale,
      screens,
      selectedScreen: 0,
      selectedElementIndex: null,
      ...panoramicUpdate,
    });
  },

  hydrateSession: (session) => {
    const state = get();
    const { platform } = state;

    const variants: VariantRecord[] = session.variants.map((sv) => {
      const variantConfig = sv.config;
      const isPanoramic = variantConfig.mode === 'panoramic';
      const sessionLocales = deepCopy(variantConfig.locales ?? {});
      const screens = variantConfig.screens.length > 0
        ? variantConfig.screens.map((_s, i) => createScreenState(i, variantConfig, platform))
        : [];
      const panoramicState = variantConfig.panoramic
        ? {
            panoramicFrameCount: variantConfig.frameCount ?? 5,
            panoramicBackground: variantConfig.panoramic.background,
            panoramicElements: variantConfig.panoramic.elements,
          }
        : {
            panoramicFrameCount: state.panoramicFrameCount,
            panoramicBackground: state.panoramicBackground,
            panoramicElements: state.panoramicElements,
          };

      const timestamp = new Date().toISOString();
      const fallbackSnapshot: VariantSnapshot = {
        platform,
        previewW: state.previewW,
        previewH: state.previewH,
        locale: 'default',
        sessionLocales,
        isPanoramic,
        screens,
        selectedScreen: 0,
        ...panoramicState,
        panoramicEffects: state.panoramicEffects,
        selectedElementIndex: null,
        exportSize: state.exportSize,
        exportRenderer: state.exportRenderer,
      };
      return {
        id: sv.id,
        name: sv.name,
        description: sv.description,
        status: (sv.status === 'approved' ? 'approved' : 'draft') as VariantStatus,
        createdAt: timestamp,
        updatedAt: timestamp,
        snapshot: coerceVariantSnapshot(
          (sv as { editorSnapshot?: unknown }).editorSnapshot,
          fallbackSnapshot,
        ),
        artifacts: Array.isArray(sv.artifacts)
          ? sv.artifacts
              .map((artifact) => coerceVariantArtifact(artifact))
              .filter((artifact): artifact is VariantArtifact => artifact !== null)
          : [],
        previewArtifacts: sv.previewArtifacts ?? [],
        copyAssignments: sv.copyAssignments ?? [],
        score: sv.score,
        history: coerceVariantHistory((sv as { history?: unknown }).history),
        provenance: coerceVariantProvenance((sv as { provenance?: unknown }).provenance),
      };
    });

    if (variants.length === 0) return;

    const activeId = session.activeVariantId && variants.some((v) => v.id === session.activeVariantId)
      ? session.activeVariantId
      : variants[0]!.id;
    const active = variants.find((v) => v.id === activeId)!;
    const autopilotAnalysis = normalizeAutopilotAnalysis(session.autopilot?.screenshotAnalysis ?? []);
    const autopilotConceptPlan = normalizeAutopilotConceptPlan(session.autopilot?.conceptPlan ?? null);
    const autopilotReviewControls = normalizeAutopilotReviewControls(session.autopilot?.reviewControls);

    const sessionSaveBaseline = JSON.stringify(buildSessionSavePayload({
      activeVariantId: activeId,
      recommendedVariantId: session.autopilot?.recommendedVariantId ?? null,
      recommendationReason: session.autopilot?.recommendationReason ?? null,
      autopilotAnalysis,
      autopilotSelectedCopySet: session.autopilot?.selectedCopySet ?? null,
      autopilotConceptPlan,
      autopilotReviewControls,
      autopilotRefinementHistory: session.autopilot?.refinementHistory ?? [],
      variants,
    }));

    set({
      variants,
      activeVariantId: activeId,
      recommendedVariantId: session.autopilot?.recommendedVariantId ?? null,
      recommendationReason: session.autopilot?.recommendationReason ?? null,
      autopilotAnalysis,
      autopilotSelectedCopySet: session.autopilot?.selectedCopySet ?? null,
      autopilotConceptPlan,
      autopilotReviewControls,
      autopilotRefinementHistory: session.autopilot?.refinementHistory ?? [],
      sessionSaveBaseline,
      sessionBacked: true,
      ...applyVariantSnapshot(active.snapshot),
    });
  },

  addScreen: () =>
    set((state) => {
      const { screens, config, platform } = state;
      if (!config) return state;
      pushSnapshot(state);

      const last = screens[screens.length - 1];
      const newState = createScreenState(0, config, platform);
      newState.screenIndex = screens.length;
      newState.headline = `Frame ${screens.length + 1}`;
      newState.subtitle = '';

      if (last) {
        newState.style = last.style;
        newState.layout = last.layout;
        newState.font = last.font;
        newState.fontWeight = last.fontWeight;
        newState.colors = { ...last.colors };
        newState.frameId = last.frameId;
        newState.deviceColor = last.deviceColor;
        newState.frameStyle = last.frameStyle;
        newState.composition = last.composition;
        newState.deviceScale = last.deviceScale;
        newState.deviceTop = last.deviceTop;
      }

      return {
        screens: [...screens, newState],
        selectedScreen: screens.length,
      };
    }),

  removeScreen: (index) =>
    set((state) => {
      if (state.screens.length <= 1) return state;
      pushSnapshot(state);
      const screens = state.screens
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, screenIndex: i }));
      let selectedScreen = state.selectedScreen;
      if (selectedScreen >= screens.length) {
        selectedScreen = screens.length - 1;
      } else if (selectedScreen > index) {
        selectedScreen--;
      }
      return { screens, selectedScreen };
    }),

  moveScreen: (from, to) =>
    set((state) => {
      if (to < 0 || to >= state.screens.length) return state;
      pushSnapshot(state);
      const screens = [...state.screens];
      const [item] = screens.splice(from, 1);
      if (!item) return state;
      screens.splice(to, 0, item);
      return {
        screens: screens.map((s, i) => ({ ...s, screenIndex: i })),
        selectedScreen: to,
      };
    }),

  // Panoramic actions
  togglePanoramic: () =>
    set((state) => {
      if (state.isPanoramic) {
        // Switching to individual — ensure screens exist
        if (state.screens.length === 0 && state.config) {
          const platform = state.platform;
          // If config had screens, restore them; otherwise create a default
          if (state.config.screens.length > 0) {
            return {
              isPanoramic: false,
              screens: state.config.screens.map((_s, i) =>
                createScreenState(i, state.config!, platform),
              ),
              selectedScreen: 0,
            };
          }
          const defaultScreen = createScreenState(0, state.config, platform);
          return { isPanoramic: false, screens: [defaultScreen], selectedScreen: 0 };
        }
        return { isPanoramic: false };
      }
      // Switching to panoramic — auto-populate from individual screens if empty
      const updates: Partial<PreviewStore> = {
        isPanoramic: true,
        selectedElementIndex: null,
      };

      if (state.panoramicElements.length === 0 && state.config && state.screens.length > 0) {
        const c = state.config.theme.colors;
        const screenCount = state.screens.length;
        const locale = state.locale;
        const sessionLocales = state.sessionLocales;

        // Set frame count to match screen count
        updates.panoramicFrameCount = screenCount;

        // Set solid white background (matches individual layout default)
        updates.panoramicBackground = {
          type: 'solid',
          color: '#ffffff',
          layers: [],
        };

        // Build elements from individual screens
        const elements: PanoramicElement[] = [];
        for (let i = 0; i < screenCount; i++) {
          const screen = state.screens[i]!;
          const frameSliceStart = (i / screenCount) * 100;
          const frameCenter = frameSliceStart + 100 / screenCount / 2;

          // Device element — centered in this frame's slice
          elements.push({
            type: 'device',
            screenshot: state.config.screens[i]?.screenshot ?? `screenshots/screen-${i + 1}.png`,
            localeSourceScreen: i,
            frame: screen.frameId || undefined,
            x: frameCenter - 6,
            y: 20,
            width: 12,
            rotation: screen.deviceRotation || 0,
            z: 5,
          } as PanoramicElement);

          // Text element — headline above device
          if (screen.headline) {
            elements.push({
              type: 'text',
              content:
                getConfiguredLocaleText(sessionLocales, i, locale, 'headline') ?? screen.headline,
              localeSourceScreen: i,
              localeSourceField: 'headline',
              x: frameSliceStart + 2,
              y: 3,
              fontSize: 3,
              color: c.text ?? '#FFFFFF',
              fontWeight: state.config.theme.fontWeight ?? 700,
              fontStyle: 'normal',
              textAlign: 'left',
              lineHeight: 1.15,
              maxWidth: Math.floor(100 / screenCount) - 4,
              z: 10,
            } as PanoramicElement);
          }
        }

        updates.panoramicElements = elements;
      } else if (
        state.panoramicElements.length === 0 &&
        state.config &&
        state.panoramicBackground.type === 'solid' &&
        (!state.panoramicBackground.color || state.panoramicBackground.color === '#000000')
      ) {
        // No screens either — set solid white background (matches individual layout default)
        updates.panoramicBackground = {
          type: 'solid',
          color: '#ffffff',
        };
      }
      return updates;
    }),

  setSelectedElement: (index) => set({ selectedElementIndex: index }),

  updatePanoramicBackground: (partial) =>
    set((state) => {
      pushSnapshot(state);
      return {
        panoramicBackground: { ...state.panoramicBackground, ...partial } as PanoramicBackground,
      };
    }),

  updatePanoramicElement: (index, partial) =>
    set((state) => {
      const elements = [...state.panoramicElements];
      const current = elements[index];
      if (!current) return state;
      pushSnapshot(state);
      elements[index] = { ...current, ...partial } as PanoramicElement;
      return { panoramicElements: elements };
    }),

  syncPanoramicDevicesForPlatform: (platform) =>
    set((state) => {
      const panoramicElements = syncPanoramicDevicesToPlatform(
        state.panoramicElements,
        platform,
        state.deviceFamilies,
      );

      const changed = panoramicElements.some((element, index) => {
        const current = state.panoramicElements[index];
        return current !== element;
      });
      if (!changed) return state;

      pushSnapshot(state);
      return { panoramicElements };
    }),

  addPanoramicElement: (element) =>
    set((state) => {
      pushSnapshot(state);
      return {
        panoramicElements: [...state.panoramicElements, element],
        selectedElementIndex: state.panoramicElements.length,
      };
    }),

  removePanoramicElement: (index) =>
    set((state) => {
      pushSnapshot(state);
      const elements = state.panoramicElements.filter((_, i) => i !== index);
      let selectedElementIndex = state.selectedElementIndex;
      if (selectedElementIndex !== null) {
        if (selectedElementIndex === index) selectedElementIndex = null;
        else if (selectedElementIndex > index) selectedElementIndex--;
      }
      return { panoramicElements: elements, selectedElementIndex };
    }),

  setPanoramicFrameCount: (count) =>
    set((state) => {
      const oldCount = state.panoramicFrameCount;
      if (oldCount === count) return state;
      pushSnapshot(state);
      // Rescale element x and width so they stay in the same frame-relative position.
      // Coordinates are stored as % of totalCanvasWidth (= previewW * frameCount).
      // When frameCount changes, multiply x-axis values by oldCount/newCount.
      const scale = oldCount / count;
      const elements = state.panoramicElements.map((el) => {
        const base = { ...el, x: el.x * scale };
        if (el.type === 'device') {
          return { ...base, width: el.width * scale };
        }
        if (
          el.type === 'image' ||
          el.type === 'logo' ||
          el.type === 'crop' ||
          el.type === 'card' ||
          el.type === 'badge' ||
          el.type === 'proof-chip' ||
          el.type === 'group'
        ) {
          return { ...base, width: el.width * scale };
        }
        if (el.type === 'text' && el.maxWidth) {
          return { ...base, maxWidth: el.maxWidth * scale };
        }
        if (el.type === 'decoration') {
          return { ...base, width: el.width * scale };
        }
        return base;
      }) as typeof state.panoramicElements;
      return { panoramicFrameCount: count, panoramicElements: elements };
    }),

  updatePanoramicEffects: (partial) =>
    set((state) => {
      pushSnapshot(state);
      return {
        panoramicEffects: { ...state.panoramicEffects, ...partial },
      };
    }),

  // Undo/redo
  undo: () => {
    if (_undoStack.length === 0) return;
    const state = get();
    _redoStack.push({
      screens: deepCopy(state.screens),
      panoramicElements: deepCopy(state.panoramicElements),
      panoramicBackground: deepCopy(state.panoramicBackground),
      panoramicEffects: deepCopy(state.panoramicEffects),
      selectedScreen: state.selectedScreen,
      selectedElementIndex: state.selectedElementIndex,
    });
    const entry = _undoStack.pop()!;
    _skipSnapshot = true;
    set({
      screens: deepCopy(entry.screens),
      panoramicElements: deepCopy(entry.panoramicElements),
      panoramicBackground: deepCopy(entry.panoramicBackground),
      panoramicEffects: deepCopy(entry.panoramicEffects),
      selectedScreen: entry.selectedScreen,
      selectedElementIndex: entry.selectedElementIndex,
    });
    _skipSnapshot = false;
  },

  redo: () => {
    if (_redoStack.length === 0) return;
    const state = get();
    _undoStack.push({
      screens: deepCopy(state.screens),
      panoramicElements: deepCopy(state.panoramicElements),
      panoramicBackground: deepCopy(state.panoramicBackground),
      panoramicEffects: deepCopy(state.panoramicEffects),
      selectedScreen: state.selectedScreen,
      selectedElementIndex: state.selectedElementIndex,
    });
    const entry = _redoStack.pop()!;
    _skipSnapshot = true;
    set({
      screens: deepCopy(entry.screens),
      panoramicElements: deepCopy(entry.panoramicElements),
      panoramicBackground: deepCopy(entry.panoramicBackground),
      panoramicEffects: deepCopy(entry.panoramicEffects),
      selectedScreen: entry.selectedScreen,
      selectedElementIndex: entry.selectedElementIndex,
    });
    _skipSnapshot = false;
  },

  saveSession: async () => {
    const state = get();
    if (!state.sessionBacked || !state.activeVariantId) return;

    set({ isSavingSession: true });
    try {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const payload = buildSessionSavePayload({
        activeVariantId: state.activeVariantId,
        recommendedVariantId: state.recommendedVariantId,
        recommendationReason: state.recommendationReason,
        autopilotAnalysis: state.autopilotAnalysis,
        autopilotSelectedCopySet: state.autopilotSelectedCopySet,
        autopilotConceptPlan: state.autopilotConceptPlan,
        autopilotReviewControls: state.autopilotReviewControls,
        autopilotRefinementHistory: state.autopilotRefinementHistory,
        variants,
      });
      await saveSessionApi(payload);
      set({ variants });
      set({ sessionSaveBaseline: JSON.stringify(payload) });
    } catch (err) {
      console.error('Failed to save session:', err);
      throw err;
    } finally {
      set({ isSavingSession: false });
    }
  },

  rebuildAutopilotSessionFromReview: async (options) => {
    const state = get();
    if (!state.sessionBacked || !state.activeVariantId) {
      throw new Error('Reviewed rebuild requires a file-backed session.');
    }

    await get().saveSession();
    const result = await rebuildAutopilotSessionFromReviewApi(options);
    if (!result.session || !Array.isArray((result.session as { variants?: unknown[] }).variants)) {
      throw new Error('Reviewed rebuild returned an invalid session payload.');
    }
    get().hydrateSession(result.session as Parameters<PreviewStore['hydrateSession']>[0]);
    return result;
  },
}));
