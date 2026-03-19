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
import { saveSession as saveSessionApi } from './utils/api';

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
    headline: screen ? screen.headline : 'New Frame',
    subtitle: screen ? (screen.subtitle ?? '') : '',
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
}

export interface VariantCopyAssignment {
  unitKind: 'screen' | 'frame';
  unitIndex: number;
  slot: 'hero' | 'differentiator' | 'feature' | 'trust' | 'summary';
  headline: string;
  sourceFeature?: string;
  sourcePath?: string;
  sourceRole?: string;
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
}

export interface PreviewStore {
  // App-level state
  config: AppframeConfig | null;
  sessionLocales: Record<string, LocaleConfig>;
  variants: VariantRecord[];
  activeVariantId: string | null;
  recommendedVariantId: string | null;
  recommendationReason: string | null;
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
    }>;
    autopilot?: {
      recommendedVariantId?: string | null;
      recommendationReason?: string | null;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
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
): VariantRecord {
  const timestamp = new Date().toISOString();
  return {
    id: makeId('variant'),
    name,
    status: 'draft',
    createdAt: timestamp,
    updatedAt: timestamp,
    snapshot: variantSnapshotFromState(state),
    artifacts: [],
    previewArtifacts: [],
    copyAssignments: [],
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
  panoramicBackground: { type: 'solid', color: '#ffffff' } as PanoramicBackground,
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
  createVariant: (name) =>
    set((state) => {
      const variants = syncActiveVariantRecord(state.variants, state.activeVariantId, state);
      const variant = buildVariantRecord(name ?? nextVariantName(variants), state);
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
      const variant = buildVariantRecord(
        activeVariant ? `${activeVariant.name} Copy` : nextVariantName(variants),
        state,
      );
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
        const conceptB = buildVariantRecord('Concept B', state);
        const conceptC = buildVariantRecord('Concept C', state);
        const conceptD = buildVariantRecord('Concept D', state);
        return {
          variants: [renamed, conceptB, conceptC, conceptD],
          activeVariantId: renamed.id,
          ...applyVariantSnapshot(renamed.snapshot),
        };
      }

      const conceptA = buildVariantRecord(nextVariantName(variants, 'Concept'), state);
      const conceptB = buildVariantRecord(
        nextVariantName([...variants, conceptA], 'Concept'),
        state,
      );
      const conceptC = buildVariantRecord(
        nextVariantName([...variants, conceptA, conceptB], 'Concept'),
        state,
      );
      const conceptD = buildVariantRecord(
        nextVariantName([...variants, conceptA, conceptB, conceptC], 'Concept'),
        state,
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
        variant.id === id ? { ...variant, status, updatedAt: new Date().toISOString() } : variant,
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
    });

    set({
      config,
      sessionLocales,
      variants: [baseVariant],
      activeVariantId: baseVariant.id,
      recommendedVariantId: null,
      recommendationReason: null,
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
      };
    });

    if (variants.length === 0) return;

    const activeId = session.activeVariantId && variants.some((v) => v.id === session.activeVariantId)
      ? session.activeVariantId
      : variants[0]!.id;
    const active = variants.find((v) => v.id === activeId)!;

    set({
      variants,
      activeVariantId: activeId,
      recommendedVariantId: session.autopilot?.recommendedVariantId ?? null,
      recommendationReason: session.autopilot?.recommendationReason ?? null,
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
      await saveSessionApi({
        activeVariantId: state.activeVariantId,
        recommendedVariantId: state.recommendedVariantId,
        recommendationReason: state.recommendationReason,
        variants: variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          status: variant.status,
          snapshot: variant.snapshot,
        })),
      });
      set({ variants });
    } catch (err) {
      console.error('Failed to save session:', err);
      throw err;
    } finally {
      set({ isSavingSession: false });
    }
  },
}));
