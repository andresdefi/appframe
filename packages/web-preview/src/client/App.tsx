import { useEffect, useRef, useState } from 'react';
import { usePreviewStore } from './store';
import type { FontData, SizeEntry, DeviceFamily } from './store';
import { fetchProject, fetchFonts, fetchFrames, fetchKoubouDevices, fetchSizes, fetchSession, putLiveConfig, loadProject, fetchProjects, touchProject } from './utils/api';
import { useProjectAutosave } from './hooks/useProjectAutosave';
import { ProjectPicker } from './components/ProjectPicker';
import { HeaderBar } from './components/HeaderBar';
import { DesignTab } from './components/Sidebar/DesignTab';
import { DeviceTab } from './components/Sidebar/DeviceTab';
import { TextTab } from './components/Sidebar/TextTab';
import { EffectsTab } from './components/Sidebar/EffectsTab';
import { ElementsTab } from './components/Sidebar/ElementsTab';
import { ExportTab } from './components/Sidebar/ExportTab';
import { VariantsTab } from './components/Sidebar/VariantsTab';
import { PanoramicBackgroundContent, PanoramicDeviceContent, PanoramicTextContent } from './components/Sidebar/PanoramicTab';
import { PanoramicEffectsTab } from './components/Sidebar/PanoramicEffectsTab';
import { PreviewArea } from './components/Preview/PreviewArea';
import { PanoramicPreview } from './components/Preview/PanoramicPreview';
import { getDefaultExportSizeKey, getPlatformPreviewSize } from './utils/platformSelection';

export function App() {
  const config = usePreviewStore((s) => s.config);
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const initScreens = usePreviewStore((s) => s.initScreens);
  const hydrateSession = usePreviewStore((s) => s.hydrateSession);
  const hydrateProjectSnapshot = usePreviewStore((s) => s.hydrateProjectSnapshot);
  const activeProject = usePreviewStore((s) => s.activeProject);
  const setActiveProject = usePreviewStore((s) => s.setActiveProject);
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  useProjectAutosave({ enabled: autosaveEnabled, project: activeProject });

  const switchToProject = async (name: string) => {
    if (name === activeProject) {
      setPickerOpen(false);
      return;
    }
    // Temporarily disable autosave so the upcoming hydration doesn't echo
    // straight back to disk for the new project. Re-enable after the swap.
    setAutosaveEnabled(false);
    try {
      const result = await loadProject(name);
      if (result.kind === 'corrupt' || result.kind === 'futureSchema') {
        setError(`Could not open "${name}": ${result.message}`);
        return;
      }
      if (result.kind === 'loaded') {
        hydrateProjectSnapshot(result.envelope.data);
      } else {
        // Missing file (e.g. brand-new project) — leave the store as it is;
        // the autosave hook will create the file on first edit.
      }
      // Look up the display name from the project list so the header chip
      // shows the human-readable label rather than the slug.
      let displayName = name;
      try {
        const list = await fetchProjects();
        const found = list.find((p) => p.name === name);
        if (found) displayName = found.displayName;
      } catch {
        // best effort
      }
      setActiveProject(name, displayName);
      setPickerOpen(false);
    } finally {
      setAutosaveEnabled(true);
    }
  };
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
  const [isNarrow, setIsNarrow] = useState(initialNarrow);
  const [sidebarOpen, setSidebarOpen] = useState(!initialNarrow);

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
        // Fetch device families alongside project/fonts/frames so
        // `deviceFamilies` is set before `initScreens` runs. Without this,
        // ScreenCard's render effect fires twice on boot — once on initial
        // mount and again when setDeviceFamilies updates the store, since
        // `deviceFamilies` is in that effect's dep array. The koubou fetch
        // can still fail when the Python package isn't installed; handle
        // that as a resolved-but-empty result via Promise.allSettled.
        const [cfgRes, fontsRes, framesRes, koubouRes] = await Promise.allSettled([
          fetchProject(),
          fetchFonts(),
          fetchFrames(),
          fetchKoubouDevices(),
        ]);
        if (cfgRes.status !== 'fulfilled') throw cfgRes.reason;
        if (fontsRes.status !== 'fulfilled') throw fontsRes.reason;
        if (framesRes.status !== 'fulfilled') throw framesRes.reason;
        const cfg = cfgRes.value;
        const fonts = fontsRes.value;
        const frames = framesRes.value;

        const platform = cfg.app.platforms[0] ?? 'iphone';
        const size = getPlatformPreviewSize(platform);
        setPreviewSize(size.w, size.h);
        setFonts(fonts as FontData[]);
        setFrames(frames as never[]);
        if (koubouRes.status === 'fulfilled') {
          setDeviceFamilies(koubouRes.value.families as DeviceFamily[]);
          setKoubouAvailable(true);
        } else {
          setKoubouAvailable(false);
        }
        initScreens(cfg, platform);

        // Hydrate variants from session file if server was started with --session
        try {
          const session = await fetchSession() as Parameters<typeof hydrateSession>[0] | null;
          if (session && Array.isArray(session.variants) && session.variants.length > 0) {
            hydrateSession(session);
          }
        } catch {
          // No session — use default single variant
        }

        // Phase 3: auto-resume the most-recently-opened project on boot.
        // The picker (HeaderBar button) lets the user switch / create /
        // rename / delete later. The store has valid defaults from
        // initScreens above, so a hydration that's missing fields still
        // produces a usable view.
        let resumeProject = 'default';
        let resumeDisplayName = 'default';
        try {
          const projects = await fetchProjects();
          if (projects.length > 0) {
            resumeProject = projects[0]!.name; // sorted by lastOpenedAt desc
            resumeDisplayName = projects[0]!.displayName;
          }
        } catch (err) {
          console.warn('Project listing failed', err);
        }

        try {
          const result = await loadProject(resumeProject);
          if (result.kind === 'loaded') {
            hydrateProjectSnapshot(result.envelope.data);
            setActiveProject(resumeProject, resumeDisplayName);
            // Best-effort: bump lastOpenedAt so subsequent boots resume
            // this project. Failing here shouldn't block the UI.
            touchProject(resumeProject).catch(() => {});
          } else if (result.kind === 'corrupt' || result.kind === 'futureSchema') {
            // Don't silently destroy the file — surface so the user can decide.
            setError(`Could not restore the saved project: ${result.message}`);
            return;
          } else {
            // No saved project on disk — keep activeProject='default'.
            // The autosave hook will create the file on first edit.
          }
        } catch (err) {
          console.warn('Project restore failed', err);
        }
        setAutosaveEnabled(true);

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
        setError(err instanceof Error ? err.message : 'Failed to load project');
      }
    }

    init();
  }, [initScreens, hydrateSession, hydrateProjectSnapshot, setActiveProject, setPreviewSize, setFonts, setFrames, setDeviceFamilies, setKoubouAvailable, setSizes, setExportSize]);

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

  const isFirstSyncRef = useRef(true);
  const screens = usePreviewStore((s) => s.screens);
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const panoramicFrameCount = usePreviewStore((s) => s.panoramicFrameCount);
  const panoramicBackground = usePreviewStore((s) => s.panoramicBackground);
  const panoramicElements = usePreviewStore((s) => s.panoramicElements);

  useEffect(() => {
    if (!config) return;
    if (isFirstSyncRef.current) {
      isFirstSyncRef.current = false;
      return;
    }
    const controller = new AbortController();
    const handle = window.setTimeout(() => {
      putLiveConfig(
        {
          mode: isPanoramic ? 'panoramic' : 'individual',
          sessionLocales,
          screens,
          panoramicFrameCount,
          panoramicBackground,
          panoramicElements,
        },
        controller.signal,
      ).catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.warn('Live config sync failed', err);
      });
    }, 300);
    return () => {
      window.clearTimeout(handle);
      controller.abort();
    };
  }, [config, isPanoramic, screens, sessionLocales, panoramicFrameCount, panoramicBackground, panoramicElements]);

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
      {activeTab === 'variants' && <VariantsTab />}
      {activeTab === 'background' && <PanoramicBackgroundContent />}
      {activeTab === 'device' && <PanoramicDeviceContent />}
      {activeTab === 'text' && <PanoramicTextContent />}
      {activeTab === 'extras' && <PanoramicEffectsTab />}
      {activeTab === 'elements' && <ElementsTab />}
      {activeTab === 'export' && <ExportTab />}
    </>
  ) : (
    <>
      {activeTab === 'variants' && <VariantsTab />}
      {activeTab === 'background' && <DesignTab />}
      {activeTab === 'device' && <DeviceTab />}
      {activeTab === 'text' && <TextTab />}
      {activeTab === 'extras' && <EffectsTab />}
      {activeTab === 'elements' && <ElementsTab />}
      {activeTab === 'export' && <ExportTab />}
    </>
  );

  return (
    <div className="h-dvh flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar — runs full height on desktop, collapsible above the
          preview on mobile. No border; bg-surface alone separates it
          from the canvas. */}
      <div
        id="editor-sidebar"
        className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-80 md:min-w-80 max-h-[45vh] md:max-h-none bg-surface flex-col shrink-0 order-2 md:order-1 md:rounded-r-3xl overflow-hidden`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto">
          {sidebarContent}
        </div>
      </div>

      {/* Right pane: transparent header + preview. The header only spans
          the canvas width on desktop, so it doesn't collide with the
          sidebar. */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 order-1 md:order-2">
        <HeaderBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          showSidebarToggle={isNarrow}
          onOpenProjectPicker={() => setPickerOpen(true)}
        />
        {isPanoramic ? <PanoramicPreview /> : <PreviewArea />}
      </div>
      {pickerOpen && (
        <ProjectPicker
          activeProject={activeProject}
          onSelect={(name) => {
            void switchToProject(name);
          }}
          onDismiss={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
