import { useEffect, useState } from 'react';
import { usePreviewStore } from './store';
import type { FontData, SizeEntry, DeviceFamily } from './store';
import { fetchConfig, fetchFonts, fetchFrames, fetchKoubouDevices, fetchSizes } from './utils/api';
import { HeaderBar } from './components/HeaderBar';
import { DesignTab } from './components/Sidebar/DesignTab';
import { DeviceTab } from './components/Sidebar/DeviceTab';
import { TextTab } from './components/Sidebar/TextTab';
import { EffectsTab } from './components/Sidebar/EffectsTab';
import { ExportTab } from './components/Sidebar/ExportTab';
import { PanoramicBackgroundContent, PanoramicDeviceContent, PanoramicTextContent } from './components/Sidebar/PanoramicTab';
import { PanoramicEffectsTab } from './components/Sidebar/PanoramicEffectsTab';
import { PreviewArea } from './components/Preview/PreviewArea';
import { PanoramicPreview } from './components/Preview/PanoramicPreview';
import { getDefaultExportSizeKey, getPlatformPreviewSize } from './utils/platformSelection';
import { Agentation } from 'agentation';

export function App() {
  const config = usePreviewStore((s) => s.config);
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const initScreens = usePreviewStore((s) => s.initScreens);
  const setPreviewSize = usePreviewStore((s) => s.setPreviewSize);
  const setFonts = usePreviewStore((s) => s.setFonts);
  const setFrames = usePreviewStore((s) => s.setFrames);
  const setDeviceFamilies = usePreviewStore((s) => s.setDeviceFamilies);
  const setKoubouAvailable = usePreviewStore((s) => s.setKoubouAvailable);
  const setSizes = usePreviewStore((s) => s.setSizes);
  const setExportSize = usePreviewStore((s) => s.setExportSize);
  const activeTab = usePreviewStore((s) => s.activeTab);
  const undo = usePreviewStore((s) => s.undo);
  const redo = usePreviewStore((s) => s.redo);
  const [error, setError] = useState<string | null>(null);
  const initialNarrow = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const initialAgentMode = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('agentation') === '1'
      || window.localStorage.getItem('appframe:agentation') === '1'
    : false;
  const [isNarrow, setIsNarrow] = useState(initialNarrow);
  const [sidebarOpen, setSidebarOpen] = useState(!initialNarrow);
  const [agentMode, setAgentMode] = useState(initialAgentMode);

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
        const size = getPlatformPreviewSize(platform);
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
          const defaultExportSize = getDefaultExportSizeKey(parsed, platform);
          if (defaultExportSize) setExportSize(defaultExportSize);
        } catch {
          // Sizes are optional for preview
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load config');
      }
    }

    init();
  }, [initScreens, setPreviewSize, setFonts, setFrames, setDeviceFamilies, setKoubouAvailable, setSizes, setExportSize]);

  useEffect(() => {
    const syncLayout = () => {
      const narrow = window.innerWidth < 768;
      setIsNarrow(narrow);
      if (!narrow) setSidebarOpen(true);
    };

    syncLayout();
    window.addEventListener('resize', syncLayout);
    return () => window.removeEventListener('resize', syncLayout);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('appframe:agentation', agentMode ? '1' : '0');
  }, [agentMode]);

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
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  const sidebarContent = isPanoramic ? (
    <>
      {activeTab === 'background' && <PanoramicBackgroundContent />}
      {activeTab === 'device' && <PanoramicDeviceContent />}
      {activeTab === 'text' && <PanoramicTextContent />}
      {activeTab === 'extras' && <PanoramicEffectsTab />}
      {activeTab === 'export' && <ExportTab />}
    </>
  ) : (
    <>
      {activeTab === 'background' && <DesignTab />}
      {activeTab === 'device' && <DeviceTab />}
      {activeTab === 'text' && <TextTab />}
      {activeTab === 'extras' && <EffectsTab />}
      {activeTab === 'export' && <ExportTab />}
    </>
  );

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <HeaderBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        showSidebarToggle={isNarrow}
        agentMode={agentMode}
        onToggleAgentMode={() => setAgentMode((enabled) => !enabled)}
      />
      <div className="flex-1 flex overflow-hidden min-h-0 flex-col md:flex-row">
        {/* Sidebar */}
        <div
          id="editor-sidebar"
          className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-80 md:min-w-80 max-h-[45vh] md:max-h-none bg-surface border-b md:border-b-0 md:border-r border-border flex-col shrink-0`}
        >
          <div className="flex-1 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>

        {/* Preview */}
        {isPanoramic ? <PanoramicPreview /> : <PreviewArea />}
      </div>

      {/* Visual annotation tool for AI agents */}
      {agentMode && <Agentation endpoint="http://localhost:4747" />}
    </div>
  );
}
