import { create } from 'zustand';
import type {
  ScreenState,
  AppframeConfig,
  LocaleConfig,
  FrameStyle,
  PanoramicElement,
  PanoramicBackground,
  PanoramicEffects,
} from './types';
import { PLATFORM_DEVICE_DEFAULTS } from './types';
import { syncPanoramicDevicesToPlatform } from './utils/deviceFrames';
import { MAX_SCREENS_PER_PROJECT } from './utils/platformSelection';
import { fattenScreen } from './utils/screenSerialization';

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
    id: crypto.randomUUID(),
    screenIndex: index,
    headline: screen ? screen.headline : 'New Frame',
    subtitle: screen ? (screen.subtitle ?? '') : '',
    isFullscreen: screen?.isFullscreen ?? false,
    layout: 'center',
    font: config.theme.font,
    fontWeight: config.theme.fontWeight,
    headlineFont:
      screen?.headlineFont ?? config.theme.headlineFont ?? config.theme.font ?? 'inter',
    headlineFontWeight:
      screen?.headlineFontWeight ??
      config.theme.headlineFontWeight ??
      config.theme.fontWeight ??
      600,
    subtitleFont:
      screen?.subtitleFont ?? config.theme.subtitleFont ?? config.theme.font ?? 'inter',
    subtitleFontWeight:
      screen?.subtitleFontWeight ?? config.theme.subtitleFontWeight ?? 400,
    headlineSize: config.theme.headlineSize ?? 0,
    subtitleSize: config.theme.subtitleSize ?? 0,
    headlineRotation: 0,
    subtitleRotation: 0,
    freeText: '',
    freeTextEnabled: false,
    freeTextSize: 0,
    freeTextFont: config.theme.freeTextFont ?? config.theme.font ?? 'inter',
    freeTextFontWeight: config.theme.freeTextFontWeight ?? 400,
    freeTextRotation: 0,
    freeTextLetterSpacing: 0,
    freeTextTextTransform: '',
    colors: {
      primary: config.theme.colors.primary,
      secondary: config.theme.colors.secondary,
      background: config.theme.colors.background,
      text: config.theme.colors.text,
      subtitle: config.theme.colors.subtitle ?? '#64748B',
      freeText: config.theme.colors.freeText ?? config.theme.colors.subtitle ?? '#64748B',
    },
    frameId: config.frames.ios ?? config.frames.android ?? '',
    deviceColor: config.frames.deviceColor ?? '',
    frameStyle: config.frames.style as FrameStyle,
    composition: 'single',
    deviceScale: pd.deviceScale,
    deviceTop: pd.deviceTop,
    deviceRotation: 0,
    deviceOffsetX: 0,
    deviceAngle: pd.deviceAngle,
    deviceTilt: 0,
    headlineGradient: config.theme.headlineGradient ?? null,
    subtitleGradient: config.theme.subtitleGradient ?? null,
    headlineLineHeight: 0,
    headlineLetterSpacing: 0,
    headlineTextTransform: '',
    headlineFontStyle: '',
    subtitleOpacity: 0,
    subtitleLetterSpacing: 0,
    subtitleTextTransform: '',
    spotlight: null,
    annotations: [],
    textPositions: { headline: null, subtitle: null, freeText: null },
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
    backgroundImageFit: 'cover',
    backgroundImagePositionX: 50,
    backgroundImagePositionY: 50,
    backgroundImageScale: 100,
    backgroundOverlay: null,
    deviceShadow: null,
    borderSimulation: null,
    cornerRadius: 0,
    loupe: null,
    callouts: [],
    overlays: [],
    extraDevices: [],
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

export interface VariantHistoryEntry {
  id: string;
  createdAt: string;
  type: 'created' | 'duplicated' | 'status-change' | 'saved';
  label: string;
  detail?: string;
  sourceVariantId?: string;
}

export interface VariantProvenance {
  origin: 'manual' | 'duplicate';
  parentVariantId?: string;
  parentVariantName?: string;
  branchDepth: number;
  note?: string;
}

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
}

/**
 * What the autosave hook writes to disk. Wraps VariantSnapshot (the
 * currently-displayed state) with the variants list so the user can pick
 * up variant work where they left off. Each VariantRecord carries its
 * own per-variant snapshot internally.
 */
export interface ProjectSnapshot extends VariantSnapshot {
  variants: VariantRecord[];
  activeVariantId: string | null;
  recommendedVariantId: string | null;
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
  /** Active project slug, drives the autosave / load endpoints. */
  activeProject: string;
  /** Human-readable name of the active project, shown in the header. */
  activeProjectDisplayName: string;
  platform: string;
  previewW: number;
  previewH: number;
  selectedScreen: number;
  activeTab: string;
  locale: string;
  theme: 'dark' | 'light';
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

  // Per-screen state
  screens: ScreenState[];

  // Actions
  setConfig: (config: AppframeConfig) => void;
  setPlatform: (platform: string) => void;
  setPreviewSize: (w: number, h: number) => void;
  setSelectedScreen: (index: number) => void;
  setActiveTab: (tab: string) => void;
  setActiveProject: (project: string, displayName?: string) => void;
  setLocale: (locale: string) => void;
  upsertLocaleConfig: (locale: string, localeConfig: LocaleConfig) => void;
  createVariant: (name?: string) => void;
  duplicateActiveVariant: () => void;
  createVariantSet: () => void;
  selectVariant: (id: string) => void;
  approveVariant: (id: string) => void;
  renameVariant: (id: string, name: string) => void;
  deleteVariant: (id: string) => void;
  setVariantStatus: (id: string, status: VariantStatus) => void;
  recordVariantArtifact: (artifact: Omit<VariantArtifact, 'id' | 'exportedAt'>) => void;
  recordVariantArtifactForVariant: (variantId: string, artifact: Omit<VariantArtifact, 'id' | 'exportedAt'>) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setExportSize: (size: string) => void;
  setFonts: (fonts: FontData[]) => void;
  setFrames: (frames: FrameData[]) => void;
  setDeviceFamilies: (families: DeviceFamily[]) => void;
  setKoubouAvailable: (available: boolean) => void;
  setSizes: (sizes: Record<string, SizeEntry[]>) => void;
  updateScreen: (index: number, partial: Partial<ScreenState>) => void;
  triggerRender: () => void;
  initScreens: (config: AppframeConfig, platform: string) => void;
  hydrateProjectSnapshot: (snapshot: unknown) => void;
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

// Cap on the undo stack. Each entry is a deep-copy of the screen state;
// at 25 entries the retained memory is small now that images are URLs
// (not inline base64), and users almost never hit beyond ~10 undos in
// practice. Was 50 — halved as a low-risk memory trim.
const MAX_HISTORY = 25;
const _undoStack: HistoryEntry[] = [];
let _redoStack: HistoryEntry[] = [];
let _skipSnapshot = false;

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// What a brand-new project looks like client-side. Mirrors the server's
// createDefaultConfig (server.ts) but trimmed to 3 placeholder screens
// — a totally empty canvas is too intimidating to start from, and 5
// placeholders is overkill for a fresh project.
function createFreshProjectConfig(): AppframeConfig {
  return {
    mode: 'individual',
    app: {
      name: 'My App',
      description: 'App Store screenshot preview',
      platforms: ['ios'],
      features: [],
    },
    theme: {
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        background: '#F8FAFC',
        text: '#0F172A',
        subtitle: '#64748B',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: { style: 'flat' },
    screens: [
      {
        screenshot: '__placeholder__',
        headline: 'Your headline here',
        subtitle: 'Add a subtitle for extra context',
        layout: 'center',
        composition: 'single',
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Highlight a key feature',
        subtitle: 'Describe what makes it special',
        layout: 'angled-right',
        composition: 'single',
        annotations: [],
      },
      {
        screenshot: '__placeholder__',
        headline: 'Show your app in action',
        subtitle: '',
        layout: 'center',
        composition: 'single',
        annotations: [],
      },
    ],
    output: {
      platforms: ['ios'],
      directory: './output',
    },
  } as AppframeConfig;
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
  };
}

export function projectSnapshotFromState(
  state: Parameters<typeof variantSnapshotFromState>[0] &
    Pick<PreviewStore, 'variants' | 'activeVariantId' | 'recommendedVariantId'>,
): ProjectSnapshot {
  // syncActiveVariantRecord refreshes the active variant's snapshot field
  // from the current state before serializing, so a save always captures
  // the user's latest edits in the active variant's record.
  const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
  return {
    ...variantSnapshotFromState(state),
    variants: deepCopy(variants),
    activeVariantId: state.activeVariantId,
    recommendedVariantId: state.recommendedVariantId,
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
> {
  return {
    platform: snapshot.platform,
    previewW: snapshot.previewW,
    previewH: snapshot.previewH,
    locale: snapshot.locale,
    sessionLocales: deepCopy(snapshot.sessionLocales),
    isPanoramic: snapshot.isPanoramic,
    // Backfill stable id for older snapshots that pre-date the field.
    // Also backfill the freeText fields for snapshots saved before that
    // feature shipped — defaults match createScreenState.
    //
    // Slimming at save time strips fields that match STATIC_SCREEN_DEFAULTS
    // (see utils/screenSerialization). fattenScreen re-injects those
    // defaults here so consumers downstream still see a full ScreenState.
    // The ad-hoc backfills below remain for theme-derived fields that
    // aren't part of the static-defaults set.
    screens: deepCopy(snapshot.screens).map((rawScreen) => {
      const s = fattenScreen(rawScreen) as ScreenState;
      const fallbackFont = s.font ?? 'inter';
      const next: ScreenState = {
        ...s,
        id: s.id ?? crypto.randomUUID(),
        headlineFont: s.headlineFont ?? fallbackFont,
        headlineFontWeight: s.headlineFontWeight ?? s.fontWeight ?? 600,
        subtitleFont: s.subtitleFont ?? fallbackFont,
        subtitleFontWeight: s.subtitleFontWeight ?? 400,
        freeText: s.freeText ?? '',
        freeTextEnabled: s.freeTextEnabled ?? false,
        freeTextSize: s.freeTextSize ?? 0,
        freeTextFont: s.freeTextFont ?? fallbackFont,
        freeTextFontWeight: s.freeTextFontWeight ?? 400,
        freeTextRotation: s.freeTextRotation ?? 0,
        freeTextLetterSpacing: s.freeTextLetterSpacing ?? 0,
        freeTextTextTransform: s.freeTextTextTransform ?? '',
        colors: {
          ...s.colors,
          freeText: s.colors?.freeText ?? s.colors?.subtitle ?? '#64748B',
        },
        textPositions: {
          headline: s.textPositions?.headline ?? null,
          subtitle: s.textPositions?.subtitle ?? null,
          freeText: s.textPositions?.freeText ?? null,
        },
      };
      return next;
    }),
    selectedScreen: snapshot.selectedScreen,
    panoramicFrameCount: snapshot.panoramicFrameCount,
    panoramicBackground: deepCopy(snapshot.panoramicBackground),
    panoramicElements: deepCopy(snapshot.panoramicElements),
    panoramicEffects: deepCopy(snapshot.panoramicEffects),
    selectedElementIndex: snapshot.selectedElementIndex,
    exportSize: snapshot.exportSize,
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
  // Empty until App.tsx's init() resumes the most-recent project or
  // auto-creates the first one. Reading this before init completes is
  // a bug — autosave + uploads both require a real project name.
  activeProject: '',
  activeProjectDisplayName: '',
  platform: 'iphone',
  previewW: 400,
  previewH: 868,
  selectedScreen: 0,
  activeTab: (() => {
    if (typeof window === 'undefined') return 'background';
    return window.localStorage.getItem('appframe.activeTab') ?? 'background';
  })(),
  locale: 'default',
  theme: (() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('appframe.theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  })(),
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
  screens: [],
  sessionLocales: {},

  setConfig: (config) => set({ config }),
  setPlatform: (platform) => set({ platform }),
  setPreviewSize: (w, h) => set({ previewW: w, previewH: h }),
  setSelectedScreen: (index) => set({ selectedScreen: index }),
  setActiveTab: (tab) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('appframe.activeTab', tab);
    }
    set({ activeTab: tab });
  },
  setActiveProject: (project, displayName) =>
    set({ activeProject: project, activeProjectDisplayName: displayName ?? project }),
  setLocale: (locale) => set({ locale }),
  upsertLocaleConfig: (locale, localeConfig) =>
    set((state) => ({
      sessionLocales: {
        ...state.sessionLocales,
        [locale]: localeConfig,
      },
    })),
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
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('appframe.theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },
  setExportSize: (size) => set({ exportSize: size }),
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
      isPanoramic,
      locale: nextLocale,
      screens,
      selectedScreen: 0,
      selectedElementIndex: null,
      ...panoramicUpdate,
    });
  },

  hydrateProjectSnapshot: (snapshot) => {
    const state = get();
    // Brand-new projects are persisted as literal `{}` on the server
    // (see projectStorage.ts:createProject). Treat empty/incomplete
    // snapshots as a fresh-project signal: reset to canonical defaults
    // and seed a default Concept A variant. Without this, falling back
    // to current state would leak the previous project's screens /
    // panoramic / variants / etc. into the new project.
    const isFresh =
      !isRecord(snapshot) ||
      (!('screens' in snapshot) &&
        !('panoramicElements' in snapshot) &&
        !('variants' in snapshot));

    if (isFresh) {
      // Reuse initScreens — it already handles the full reset (screens
      // from the synthetic config, panoramic defaults, a fresh Concept A
      // variant, locale, etc.). Default the platform to iphone for a
      // fresh project so the user starts from a canonical setup
      // regardless of what platform the previous project used.
      get().initScreens(createFreshProjectConfig(), 'iphone');
      return;
    }

    const fallback = variantSnapshotFromState(state);
    const coerced = coerceVariantSnapshot(snapshot, fallback);
    const candidate = isRecord(snapshot) ? snapshot : {};
    const variants = Array.isArray(candidate.variants)
      ? (deepCopy(candidate.variants) as VariantRecord[])
      : [];
    const activeVariantId =
      typeof candidate.activeVariantId === 'string' ? candidate.activeVariantId : null;
    const recommendedVariantId =
      typeof candidate.recommendedVariantId === 'string' ? candidate.recommendedVariantId : null;
    set({
      ...applyVariantSnapshot(coerced),
      variants,
      activeVariantId,
      recommendedVariantId,
      renderVersion: state.renderVersion + 1,
    });
  },

  addScreen: () =>
    set((state) => {
      const { screens, config, platform } = state;
      if (!config) return state;
      // Defense-in-depth: the UI also disables the Add Screen button at
      // the cap, but the action refuses too so it can't be bypassed via
      // keyboard shortcuts, agent calls, or future entry points.
      if (screens.length >= MAX_SCREENS_PER_PROJECT) return state;
      pushSnapshot(state);

      const last = screens[screens.length - 1];
      const newState = createScreenState(0, config, platform);
      newState.screenIndex = screens.length;
      newState.headline = `Screen ${screens.length + 1}`;
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

}));
