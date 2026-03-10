import { useEffect, useState } from 'react';
import { usePreviewStore } from './store';
import type { FontData, SizeEntry, DeviceFamily } from './store';
import { fetchConfig, fetchFonts, fetchFrames, fetchKoubouDevices, fetchSizes } from './utils/api';
import { TabBar } from './components/Sidebar/TabBar';
import { DesignTab } from './components/Sidebar/DesignTab';
import { DeviceTab } from './components/Sidebar/DeviceTab';
import { TextTab } from './components/Sidebar/TextTab';
import { EffectsTab } from './components/Sidebar/EffectsTab';
import { ExportTab } from './components/Sidebar/ExportTab';
import { PreviewArea } from './components/Preview/PreviewArea';
import { PLATFORM_PREVIEW_SIZES } from './types';
import { Agentation } from 'agentation';

const TAB_PANELS: Record<string, React.ComponentType> = {
  design: DesignTab,
  device: DeviceTab,
  text: TextTab,
  effects: EffectsTab,
  export: ExportTab,
};

export function App() {
  const activeTab = usePreviewStore((s) => s.activeTab);
  const config = usePreviewStore((s) => s.config);
  const initScreens = usePreviewStore((s) => s.initScreens);
  const setPreviewSize = usePreviewStore((s) => s.setPreviewSize);
  const setFonts = usePreviewStore((s) => s.setFonts);
  const setFrames = usePreviewStore((s) => s.setFrames);
  const setDeviceFamilies = usePreviewStore((s) => s.setDeviceFamilies);
  const setKoubouAvailable = usePreviewStore((s) => s.setKoubouAvailable);
  const setSizes = usePreviewStore((s) => s.setSizes);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const screens = usePreviewStore((s) => s.screens);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = screens[selectedScreen];

  useEffect(() => {
    async function init() {
      try {
        const [cfg, fonts, frames] = await Promise.all([
          fetchConfig(),
          fetchFonts(),
          fetchFrames(),
        ]);

        const platform = cfg.app.platforms[0] ?? 'iphone';
        const size = PLATFORM_PREVIEW_SIZES[platform] ?? PLATFORM_PREVIEW_SIZES.iphone!;
        setPreviewSize(size.w, size.h);
        setFonts(fonts as FontData[]);
        setFrames(frames as never[]);
        initScreens(cfg, platform);

        // Fetch koubou devices (non-blocking — may not be available)
        try {
          const koubou = await fetchKoubouDevices();
          const families = koubou.families as DeviceFamily[];
          setDeviceFamilies(families);
          setKoubouAvailable(true);
        } catch {
          setKoubouAvailable(false);
        }

        // Fetch sizes
        try {
          const sizes = await fetchSizes();
          const parsed: Record<string, SizeEntry[]> = {};
          for (const [key, entries] of Object.entries(sizes)) {
            parsed[key] = entries as SizeEntry[];
          }
          setSizes(parsed);
          // Set default export size
          const platSizes = parsed[platform];
          if (platSizes && platSizes.length > 0) {
            setExportSize(platSizes[0]!.key);
          }
        } catch {
          // Sizes are optional for preview
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load config');
      }
    }

    init();
  }, [initScreens, setPreviewSize, setFonts, setFrames, setDeviceFamilies, setKoubouAvailable, setSizes, setExportSize]);

  if (error) {
    return (
      <div className="h-dvh flex items-center justify-center bg-bg text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="h-dvh flex items-center justify-center bg-bg text-text-dim">
        Loading...
      </div>
    );
  }

  const ActivePanel = TAB_PANELS[activeTab] ?? DesignTab;

  return (
    <div className="h-dvh flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 min-w-80 bg-surface border-r border-border flex flex-col">
        <div className="px-5 py-4 border-b border-border">
          <h1 className="text-base font-semibold">appframe</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-text-dim">{config.app.name}</p>
            {currentScreen && (
              <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                {selectedScreen + 1}
              </span>
            )}
          </div>
        </div>
        <TabBar />
        <div className="flex-1 overflow-y-auto">
          <ActivePanel />
        </div>
      </div>

      {/* Preview */}
      <PreviewArea />

      {/* Visual annotation tool for AI agents */}
      <Agentation endpoint="http://localhost:4747" />
    </div>
  );
}
