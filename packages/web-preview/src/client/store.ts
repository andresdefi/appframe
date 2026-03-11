import { create } from 'zustand';
import type {
  ScreenState,
  AppframeConfig,
  TemplateStyle,
  FrameStyle,
  PanoramicElement,
  PanoramicBackground,
} from './types';
import { PLATFORM_DEVICE_DEFAULTS } from './types';

export function createScreenState(
  index: number,
  config: AppframeConfig,
  platform: string,
): ScreenState {
  const screen = config.screens[index];
  const pd = PLATFORM_DEVICE_DEFAULTS[platform] ?? PLATFORM_DEVICE_DEFAULTS.iphone!;

  return {
    screenIndex: index,
    headline: screen ? screen.headline : 'New Screen',
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
  name: string;
  weights: number[];
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

export interface PreviewStore {
  // App-level state
  config: AppframeConfig | null;
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
  addScreen: () => void;
  removeScreen: (index: number) => void;
  moveScreen: (from: number, to: number) => void;

  // Panoramic actions
  togglePanoramic: () => void;
  setSelectedElement: (index: number | null) => void;
  updatePanoramicBackground: (bg: Partial<PanoramicBackground>) => void;
  updatePanoramicElement: (index: number, partial: Partial<PanoramicElement>) => void;
  addPanoramicElement: (element: PanoramicElement) => void;
  removePanoramicElement: (index: number) => void;
  setPanoramicFrameCount: (count: number) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;
}

// Simple undo/redo history for screen and panoramic state
interface HistoryEntry {
  screens: ScreenState[];
  panoramicElements: PanoramicElement[];
  panoramicBackground: PanoramicBackground;
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

function pushSnapshot(state: { screens: ScreenState[]; panoramicElements: PanoramicElement[]; panoramicBackground: PanoramicBackground; selectedScreen: number; selectedElementIndex: number | null }) {
  if (_skipSnapshot) return;
  _undoStack.push({
    screens: deepCopy(state.screens),
    panoramicElements: deepCopy(state.panoramicElements),
    panoramicBackground: deepCopy(state.panoramicBackground),
    selectedScreen: state.selectedScreen,
    selectedElementIndex: state.selectedElementIndex,
  });
  _redoStack = [];
  if (_undoStack.length > MAX_HISTORY) _undoStack.shift();
}

export const usePreviewStore = create<PreviewStore>((set, get) => ({
  config: null,
  platform: 'iphone',
  previewW: 400,
  previewH: 868,
  selectedScreen: 0,
  activeTab: 'design',
  locale: 'default',
  previewBg: 'dark',
  renderVersion: 0,
  isPanoramic: false,
  panoramicFrameCount: 5,
  panoramicBackground: { type: 'solid', color: '#000000' } as PanoramicBackground,
  panoramicElements: [] as PanoramicElement[],
  selectedElementIndex: null,
  fonts: [],
  frames: [],
  deviceFamilies: [],
  koubouAvailable: false,
  sizes: {},
  exportSize: '',
  exportRenderer: 'playwright',
  screens: [],

  setConfig: (config) => set({ config }),
  setPlatform: (platform) => set({ platform }),
  setPreviewSize: (w, h) => set({ previewW: w, previewH: h }),
  setSelectedScreen: (index) => set({ selectedScreen: index }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLocale: (locale) => set({ locale }),
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

  triggerRender: () =>
    set((state) => ({ renderVersion: state.renderVersion + 1 })),

  initScreens: (config, platform) => {
    const isPanoramic = config.mode === 'panoramic';

    // Always build individual screens if the config has them
    const screens = config.screens.length > 0
      ? config.screens.map((_screen, i) => createScreenState(i, config, platform))
      : [];

    // Always populate panoramic state if the config has it
    const panoramicUpdate = config.panoramic
      ? {
          panoramicFrameCount: config.frameCount ?? 5,
          panoramicBackground: config.panoramic.background,
          panoramicElements: config.panoramic.elements,
        }
      : {};

    set({
      config,
      isPanoramic,
      screens,
      selectedScreen: 0,
      selectedElementIndex: null,
      ...panoramicUpdate,
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

        // Set frame count to match screen count
        updates.panoramicFrameCount = screenCount;

        // Set gradient background from theme
        updates.panoramicBackground = {
          type: 'gradient',
          gradient: {
            type: 'linear',
            colors: [c.primary, c.secondary ?? c.background],
            direction: 135,
            radialPosition: 'center',
          },
        };

        // Build elements from individual screens
        const elements: PanoramicElement[] = [];
        for (let i = 0; i < screenCount; i++) {
          const screen = state.screens[i]!;
          const frameSliceStart = (i / screenCount) * 100;
          const frameCenter = frameSliceStart + (100 / screenCount) / 2;

          // Device element — centered in this frame's slice
          elements.push({
            type: 'device',
            screenshot: state.config.screens[i]?.screenshot ?? `screenshots/screen-${i + 1}.png`,
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
              content: screen.headline,
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
        // No screens either — just set a nice gradient background
        const c = state.config.theme.colors;
        updates.panoramicBackground = {
          type: 'gradient',
          gradient: {
            type: 'linear',
            colors: [c.primary, c.secondary ?? c.background],
            direction: 135,
            radialPosition: 'center',
          },
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

  setPanoramicFrameCount: (count) => set({ panoramicFrameCount: count }),

  // Undo/redo
  undo: () => {
    if (_undoStack.length === 0) return;
    const state = get();
    _redoStack.push({
      screens: deepCopy(state.screens),
      panoramicElements: deepCopy(state.panoramicElements),
      panoramicBackground: deepCopy(state.panoramicBackground),
      selectedScreen: state.selectedScreen,
      selectedElementIndex: state.selectedElementIndex,
    });
    const entry = _undoStack.pop()!;
    _skipSnapshot = true;
    set({
      screens: deepCopy(entry.screens),
      panoramicElements: deepCopy(entry.panoramicElements),
      panoramicBackground: deepCopy(entry.panoramicBackground),
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
      selectedScreen: state.selectedScreen,
      selectedElementIndex: state.selectedElementIndex,
    });
    const entry = _redoStack.pop()!;
    _skipSnapshot = true;
    set({
      screens: deepCopy(entry.screens),
      panoramicElements: deepCopy(entry.panoramicElements),
      panoramicBackground: deepCopy(entry.panoramicBackground),
      selectedScreen: entry.selectedScreen,
      selectedElementIndex: entry.selectedElementIndex,
    });
    _skipSnapshot = false;
  },
}));
