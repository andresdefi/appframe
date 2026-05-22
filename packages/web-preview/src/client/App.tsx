import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { flushSync } from 'react-dom';
import { usePreviewStore } from './store';
import type { FontData, SizeEntry, DeviceFamily } from './store';
import { fetchProject, fetchFonts, fetchFrames, fetchKoubouDevices, fetchSizes, putLiveConfig, loadProject, fetchProjects, touchProject, createProject as createProjectApi, setServerActiveProject } from './utils/api';
import { useProjectAutosave } from './hooks/useProjectAutosave';
import { HeaderBar } from './components/HeaderBar';
import { setupConsoleCapture } from './utils/consoleCapture';
import { setupRecentActionsRecorder } from './utils/recentActions';
import { subscribeToServerEvents } from './utils/events';
import { handleRenderRequest } from './utils/renderRequest';

// Boot-time. Module-level so the patches install once before the
// rest of the app subscribes to anything. Both are idempotent.
setupConsoleCapture();
setupRecentActionsRecorder();
// Eager imports: tabs that the user sees first and most often.
import { DesignTab } from './components/Sidebar/DesignTab';
import { DeviceTab } from './components/Sidebar/DeviceTab';
import { EffectsTab } from './components/Sidebar/EffectsTab';
import { ExportTab } from './components/Sidebar/ExportTab';
import { PreviewArea } from './components/Preview/PreviewArea';
import { getDefaultExportSizeKey, getPlatformPreviewSize } from './utils/platformSelection';

// Lazy imports: heavy / sometimes-used components that don't need to ship
// in the initial bundle. Each becomes its own JS chunk fetched on demand.
// Cuts main bundle size; first open of these tabs incurs a small fetch.
const ElementsTab = lazy(() =>
  import('./components/Sidebar/ElementsTab').then((m) => ({ default: m.ElementsTab })),
);
const LocalesTab = lazy(() =>
  import('./components/Sidebar/LocalesTab').then((m) => ({ default: m.LocalesTab })),
);
const VariantsTab = lazy(() =>
  import('./components/Sidebar/VariantsTab').then((m) => ({ default: m.VariantsTab })),
);
// TextTab pulls Tiptap + ProseMirror (~150 KB minified), the heaviest
// editor-only dependency in the tree. Lazy-loading it keeps that out
// of the initial chunk; the user pays a small fetch on the first
// Text-tab open, instant on every subsequent open thanks to the
// browser cache.
const TextTab = lazy(() =>
  import('./components/Sidebar/TextTab').then((m) => ({ default: m.TextTab })),
);
const ProjectPicker = lazy(() =>
  import('./components/ProjectPicker').then((m) => ({ default: m.ProjectPicker })),
);
const PanoramicBackgroundContent = lazy(() =>
  import('./components/Sidebar/PanoramicTab').then((m) => ({ default: m.PanoramicBackgroundContent })),
);
const PanoramicDeviceContent = lazy(() =>
  import('./components/Sidebar/PanoramicTab').then((m) => ({ default: m.PanoramicDeviceContent })),
);
const PanoramicTextContent = lazy(() =>
  import('./components/Sidebar/PanoramicTab').then((m) => ({ default: m.PanoramicTextContent })),
);
const PanoramicEffectsTab = lazy(() =>
  import('./components/Sidebar/PanoramicEffectsTab').then((m) => ({ default: m.PanoramicEffectsTab })),
);
const PanoramicPreview = lazy(() =>
  import('./components/Preview/PanoramicPreview').then((m) => ({ default: m.PanoramicPreview })),
);

function LazyFallback() {
  return (
    <div className="flex items-center justify-center h-full text-text-dim text-xs">
      <svg className="animate-spin h-3 w-3 mr-2 text-accent" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading…
    </div>
  );
}

export function App() {
  const config = usePreviewStore((s) => s.config);
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const initScreens = usePreviewStore((s) => s.initScreens);
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
    // flushSync forces the autosave effect's cleanup to run synchronously
    // here. The cleanup flushes any pending save with the CURRENT
    // (pre-hydrate) state to the OLD project's URL. Without flushSync,
    // the cleanup would defer to the next React commit and end up
    // running AFTER hydrate — at which point it would read post-hydrate
    // state and write it to the OLD project URL, corrupting the OLD
    // project on every switch.
    flushSync(() => setAutosaveEnabled(false));
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

        // Phase 3: auto-resume the most-recently-opened project on boot.
        // First-launch (zero projects exist): auto-create one named
        // "Untitled 1" so the user lands in a real, named project from
        // the start instead of a magic 'default' slug. Subsequent boots
        // resume whatever was most recently opened.
        let resumeProject = '';
        let resumeDisplayName = '';
        try {
          const projects = await fetchProjects();
          if (projects.length > 0) {
            resumeProject = projects[0]!.name; // sorted by lastOpenedAt desc
            resumeDisplayName = projects[0]!.displayName;
          } else {
            // No projects yet — first launch. The server's createProject
            // handles collision-avoidance (Untitled 1 → Untitled 1-2 if
            // already taken) so we can ask for the same name confidently.
            const meta = await createProjectApi('Untitled 1');
            resumeProject = meta.name;
            resumeDisplayName = meta.displayName;
          }
        } catch (err) {
          console.warn('Project listing / first-launch creation failed', err);
        }

        if (resumeProject) {
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
              // Missing — autosave will create the file on first edit.
              setActiveProject(resumeProject, resumeDisplayName);
            }
          } catch (err) {
            console.warn('Project restore failed', err);
          }
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
          // Only seed exportSize when nothing's been persisted yet. If
          // hydrateProjectSnapshot just restored a saved value, leave
          // it alone — otherwise the just-fixed autosave (which catches
          // every real state change after subscribe) will persist this
          // default and silently overwrite the user's choice on next
          // save.
          const currentExportSize = usePreviewStore.getState().exportSize;
          if (!currentExportSize) {
            const defaultExportSize = getDefaultExportSizeKey(parsed, platform);
            if (defaultExportSize) setExportSize(defaultExportSize);
          }
        } catch {
          // Sizes are optional for preview
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      }
    }

    init();
  }, [initScreens, hydrateProjectSnapshot, setActiveProject, setPreviewSize, setFonts, setFrames, setDeviceFamilies, setKoubouAvailable, setSizes, setExportSize]);

  // Mirror activeProject to the server so MCP agents hitting
  // /api/active-project can target the right envelope. Subscribing on
  // the store rather than inlining at every setActiveProject call site
  // keeps every code path (boot resume, project picker switch, fallback
  // for missing project) covered automatically.
  useEffect(() => {
    void setServerActiveProject(activeProject || null);
    return usePreviewStore.subscribe((state, prev) => {
      if (state.activeProject === prev.activeProject) return;
      void setServerActiveProject(state.activeProject || null);
    });
  }, [activeProject]);

  // Listen for out-of-band project events from /api/events.
  // - `project-changed`: an MCP agent wrote to the currently-active
  //   project. Refetch + hydrate via the same restore path the project
  //   picker uses. Browser's own writes don't broadcast (see gating in
  //   routes/projectPatch.ts and routes/config.ts).
  // - `project-switched`: an agent explicitly asked the browser to
  //   switch to a different project (e.g. after `create_project` +
  //   `switch_project`). Routes through `switchToProject` which flushes
  //   the autosave-of-old-slug first so editing doesn't corrupt the
  //   previous project's file.
  useEffect(() => {
    return subscribeToServerEvents(async (event) => {
      if (event.type === 'project-changed') {
        const slug = usePreviewStore.getState().activeProject;
        if (!slug) return;
        try {
          const result = await loadProject<unknown>(slug);
          if (result.kind === 'loaded') {
            hydrateProjectSnapshot(result.envelope.data);
          }
        } catch (err) {
          console.warn('[appframe] live reload failed', err);
        }
        return;
      }
      if (event.type === 'project-switched') {
        const targetSlug = typeof event.slug === 'string' ? event.slug : '';
        if (!targetSlug) return;
        if (targetSlug === usePreviewStore.getState().activeProject) return;
        await switchToProject(targetSlug);
        return;
      }
      if (event.type === 'render-request') {
        // The server is asking us to capture a PNG of one of the
        // screens and POST it back. Ephemeral round-trip — see
        // routes/renderPreview.ts for the server side. Fires off
        // async so a slow capture doesn't block other events. The
        // handler does its own runtime validation of payload fields,
        // so the cast is safe even though TS can't narrow from the
        // loose SSE event shape.
        void handleRenderRequest(
          event as { type: 'render-request' } & Record<string, unknown>,
          { getState: usePreviewStore.getState },
        );
      }
    });
  // switchToProject is recreated each render but reads activeProject from
  // its closure; the SSE callback is async so we want the latest version.
  // Re-subscribing per render is acceptable here — events are rare and
  // the SSE channel is cheap to reopen. Deps intentionally include the
  // store mutators that switchToProject reads.
  }, [hydrateProjectSnapshot, activeProject, setActiveProject]);

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
  const localeScreens = usePreviewStore((s) => s.localeScreens);
  const localePanoramicElements = usePreviewStore((s) => s.localePanoramicElements);
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
          // Tell the server this is an editor-state diff, not a full
          // AppframeConfig. Without the flag the server overwrites its
          // in-memory config with the partial shape below, leaving fields
          // like config.app.platforms undefined for the next GET.
          __editorState: true,
          mode: isPanoramic ? 'panoramic' : 'individual',
          sessionLocales,
          // Per-locale snapshots. Agents polling /api/config saw locale
          // labels but no localized screen edits without these.
          // buildConfigFromEditorState merges them into next.locales[code]
          // alongside sessionLocales' label metadata.
          localeScreens,
          localePanoramicElements,
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
  }, [
    config,
    isPanoramic,
    screens,
    sessionLocales,
    localeScreens,
    localePanoramicElements,
    panoramicFrameCount,
    panoramicBackground,
    panoramicElements,
  ]);

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
    <Suspense fallback={<LazyFallback />}>
      {activeTab === 'variants' && <VariantsTab />}
      {activeTab === 'background' && <PanoramicBackgroundContent />}
      {activeTab === 'device' && <PanoramicDeviceContent />}
      {activeTab === 'text' && <PanoramicTextContent />}
      {activeTab === 'extras' && <PanoramicEffectsTab />}
      {activeTab === 'elements' && <ElementsTab />}
      {activeTab === 'locales' && <LocalesTab />}
      {activeTab === 'export' && <ExportTab />}
    </Suspense>
  ) : (
    <Suspense fallback={<LazyFallback />}>
      {activeTab === 'variants' && <VariantsTab />}
      {activeTab === 'background' && <DesignTab />}
      {activeTab === 'device' && <DeviceTab />}
      {activeTab === 'text' && <TextTab />}
      {activeTab === 'extras' && <EffectsTab />}
      {activeTab === 'elements' && <ElementsTab />}
      {activeTab === 'locales' && <LocalesTab />}
      {activeTab === 'export' && <ExportTab />}
    </Suspense>
  );

  return (
    <div className="h-dvh flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar — runs full height on desktop, collapsible above the
          preview on mobile. No border: the canvas (bg) sits a step
          below the sidebar (surface) so the tonal break separates
          them on its own. */}
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
        {isPanoramic ? (
          <Suspense fallback={<LazyFallback />}>
            <PanoramicPreview />
          </Suspense>
        ) : (
          <PreviewArea />
        )}
      </div>
      {pickerOpen && (
        <Suspense fallback={null}>
          <ProjectPicker
            activeProject={activeProject}
            onSelect={(name) => {
              void switchToProject(name);
            }}
            onDismiss={() => setPickerOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
