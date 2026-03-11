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
import { PanoramicTab } from './components/Sidebar/PanoramicTab';
import { PreviewArea } from './components/Preview/PreviewArea';
import { PanoramicPreview } from './components/Preview/PanoramicPreview';
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
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const togglePanoramic = usePreviewStore((s) => s.togglePanoramic);
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
  const undo = usePreviewStore((s) => s.undo);
  const redo = usePreviewStore((s) => s.redo);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = screens[selectedScreen];

  // Ctrl+Z / Ctrl+Shift+Z (or Cmd on Mac) keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== 'z') return;
      // Don't intercept when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

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

  const ActivePanel = isPanoramic
    ? (activeTab === 'export' ? ExportTab : PanoramicTab)
    : (TAB_PANELS[activeTab] ?? DesignTab);

  return (
    <div className="h-dvh flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 min-w-80 bg-surface border-r border-border flex flex-col">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold">appframe</h1>
            {/* Mode toggle */}
            <button
              className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border transition-colors ${
                isPanoramic
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text'
              }`}
              onClick={togglePanoramic}
              title={isPanoramic ? 'Switch to individual mode' : 'Switch to panoramic mode'}
            >
              <span className="w-3 h-3 flex items-center justify-center">
                {isPanoramic ? (
                  <svg viewBox="0 0 12 12" fill="none" className="w-full h-full">
                    <rect x="0.5" y="2" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
                    <line x1="3" y1="2" x2="3" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1"/>
                    <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1"/>
                    <line x1="9" y1="2" x2="9" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" fill="none" className="w-full h-full">
                    <rect x="2" y="1" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                )}
              </span>
              {isPanoramic ? 'Panoramic' : 'Individual'}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-text-dim">{config.app.name}</p>
            {!isPanoramic && currentScreen && (
              <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                {selectedScreen + 1}
              </span>
            )}
          </div>
        </div>
        {isPanoramic ? (
          <div className="flex border-b border-border">
            {[
              { id: 'panoramic', label: 'Panoramic' },
              { id: 'export', label: 'Export' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => usePreviewStore.getState().setActiveTab(tab.id)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  (activeTab === tab.id || (tab.id === 'panoramic' && activeTab !== 'export'))
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-dim hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <TabBar />
        )}
        <div className="flex-1 overflow-y-auto">
          <ActivePanel />
        </div>
      </div>

      {/* Preview */}
      {isPanoramic ? <PanoramicPreview /> : <PreviewArea />}

      {/* Visual annotation tool for AI agents */}
      <Agentation endpoint="http://localhost:4747" />
    </div>
  );
}
