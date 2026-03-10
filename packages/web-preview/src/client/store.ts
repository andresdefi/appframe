import { create } from 'zustand';
import type {
  ScreenState,
  AppframeConfig,
  TemplateStyle,
  FrameStyle,
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
    style: config.theme.style as TemplateStyle,
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
    autoSizeHeadline: false,
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
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  config: null,
  platform: 'iphone',
  previewW: 400,
  previewH: 868,
  selectedScreen: 0,
  activeTab: 'design',
  locale: 'default',
  previewBg: 'dark',
  renderVersion: 0,
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
      screens[index] = { ...current, ...partial };
      return { screens };
    }),

  triggerRender: () =>
    set((state) => ({ renderVersion: state.renderVersion + 1 })),

  initScreens: (config, platform) => {
    const screens = config.screens.map((_screen, i) =>
      createScreenState(i, config, platform),
    );
    set({ screens, config, selectedScreen: 0 });
  },

  addScreen: () =>
    set((state) => {
      const { screens, config, platform } = state;
      if (!config) return state;

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
      const screens = [...state.screens];
      const [item] = screens.splice(from, 1);
      if (!item) return state;
      screens.splice(to, 0, item);
      return {
        screens: screens.map((s, i) => ({ ...s, screenIndex: i })),
        selectedScreen: to,
      };
    }),
}));
