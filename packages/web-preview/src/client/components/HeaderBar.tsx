import { useEffect } from 'react';
import { usePreviewStore } from '../store';

interface HeaderBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  showSidebarToggle: boolean;
  onOpenProjectPicker: () => void;
}

const TABS = [
  { id: 'variants', label: 'Variants', structural: true },
  { id: 'background', label: 'Background', structural: true },
  { id: 'device', label: 'Device', structural: true },
  { id: 'text', label: 'Text', structural: false },
  { id: 'extras', label: 'Extras', structural: true },
  { id: 'elements', label: 'Elements', structural: true },
  { id: 'locales', label: 'Locales', structural: false },
  { id: 'export', label: 'Download', structural: false },
] as const;

export function HeaderBar({
  sidebarOpen,
  onToggleSidebar,
  showSidebarToggle,
  onOpenProjectPicker,
}: HeaderBarProps) {
  const config = usePreviewStore((s) => s.config);
  const activeProjectDisplayName = usePreviewStore((s) => s.activeProjectDisplayName);
  const autosaveStatus = usePreviewStore((s) => s.autosaveStatus);
  const autosaveLastError = usePreviewStore((s) => s.autosaveLastError);
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const togglePanoramic = usePreviewStore((s) => s.togglePanoramic);
  const undo = usePreviewStore((s) => s.undo);
  const redo = usePreviewStore((s) => s.redo);
  const activeTab = usePreviewStore((s) => s.activeTab);
  const setActiveTab = usePreviewStore((s) => s.setActiveTab);
  const activeLocale = usePreviewStore((s) => s.locale);
  const structuralLocked = activeLocale !== 'default';

  // If the user switches to a non-default locale while on a structural
  // tab, bounce them to Text — that's the only relevant editable surface
  // for non-default locales. Without this they'd see a tab they can't
  // interact with after switching locale via the canvas row.
  useEffect(() => {
    if (!structuralLocked) return;
    const tab = TABS.find((t) => t.id === activeTab);
    if (tab?.structural) {
      setActiveTab('text');
    }
  }, [structuralLocked, activeTab, setActiveTab]);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const variants = usePreviewStore((s) => s.variants);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const screens = usePreviewStore((s) => s.screens);
  const theme = usePreviewStore((s) => s.theme);
  const setTheme = usePreviewStore((s) => s.setTheme);
  const currentMode = isPanoramic ? 'Panoramic' : 'Individual';
  const modeToggleLabel = isPanoramic ? 'Switch to Individual' : 'Switch to Panoramic';
  const activeVariant = variants.find((variant) => variant.id === activeVariantId);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const themeToggleLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <div className="w-full min-h-11 px-3 py-2 md:px-4 flex flex-wrap items-center gap-2 md:gap-4 shrink-0">
      {/* Left: branding */}
      <div className="flex items-center gap-2 min-w-0">
        {showSidebarToggle && (
          <button
            className={`inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              sidebarOpen
                ? 'bg-surface-2 text-text font-medium surface-card'
                : 'bg-surface text-text-dim hover:text-text hover:bg-surface-2'
            }`}
            onClick={onToggleSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="editor-sidebar"
          >
            {sidebarOpen ? 'Hide Controls' : 'Show Controls'}
          </button>
        )}
        <span className="text-sm font-semibold whitespace-nowrap">appframe</span>
        <button
          className="inline-flex items-center gap-1 text-[11px] text-text-dim hover:text-text bg-surface-2 hover:bg-surface px-2 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent max-w-[140px]"
          onClick={onOpenProjectPicker}
          title="Switch project"
          aria-label={`Project: ${activeProjectDisplayName}. Click to switch.`}
        >
          <span className="truncate">{activeProjectDisplayName}</span>
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 shrink-0" fill="none" aria-hidden="true">
            <path d="M3 4.5 6 7.5l3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {autosaveStatus !== 'idle' && (
          <span
            className={`text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded-md ${
              autosaveStatus === 'saving'
                ? 'text-text-dim bg-surface-2'
                : autosaveStatus === 'saved'
                  ? 'text-emerald-300 bg-emerald-500/10'
                  : 'text-red-300 bg-red-500/10'
            }`}
            title={autosaveStatus === 'error' && autosaveLastError ? autosaveLastError : undefined}
            aria-live="polite"
          >
            {autosaveStatus === 'saving'
              ? 'Saving...'
              : autosaveStatus === 'saved'
                ? 'Saved'
                : 'Save failed'}
          </span>
        )}
        {config && (
          <span className="text-xs text-text-dim truncate">{config.app.name}</span>
        )}
        {activeVariant && (
          <span className="hidden sm:inline-flex text-[10px] text-text-dim bg-surface-2 px-2 py-0.5 rounded-md whitespace-nowrap">
            {activeVariant.name}
          </span>
        )}
        {!isPanoramic && screens.length > 0 && (
          <span className="text-[10px] text-text-dim bg-surface-2 px-2 py-0.5 rounded-md whitespace-nowrap tabular-nums">
            {selectedScreen + 1}/{screens.length}
          </span>
        )}
      </div>

      {/* Center: segmented pill tabs */}
      <div className="order-3 md:order-none basis-full md:basis-auto md:mx-auto overflow-x-auto">
        <div className="inline-flex items-center gap-0.5 bg-surface rounded-full p-1">
          {TABS.map((tab) => {
            const disabled = structuralLocked && tab.structural;
            return (
              <button
                key={tab.id}
                disabled={disabled}
                title={
                  disabled
                    ? 'Switch to the Default locale to edit structural settings'
                    : undefined
                }
                className={`text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeTab === tab.id
                    ? 'bg-surface-2 text-text font-medium surface-card'
                    : disabled
                      ? 'text-text-dim/40 cursor-not-allowed'
                      : 'text-text-dim hover:text-text'
                }`}
                onClick={() => {
                  if (disabled) return;
                  setActiveTab(tab.id);
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <button
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface text-text-dim hover:text-text hover:bg-surface-2 transition duration-150 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={undo}
          title="Undo (⌘Z)"
          aria-label="Undo last change"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
            <path
              d="M3.5 7.5h6.5a3.5 3.5 0 0 1 0 7H7"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 4.5 3 7.5l3 3"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface text-text-dim hover:text-text hover:bg-surface-2 transition duration-150 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={redo}
          title="Redo (⌘⇧Z)"
          aria-label="Redo last undone change"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
            <path
              d="M12.5 7.5H6a3.5 3.5 0 0 0 0 7H9"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m10 4.5 3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface text-text-dim hover:text-text hover:bg-surface-2 transition duration-150 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setTheme(nextTheme)}
          title={themeToggleLabel}
          aria-label={themeToggleLabel}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="3" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
                <line x1="8" y1="1.5" x2="8" y2="3" />
                <line x1="8" y1="13" x2="8" y2="14.5" />
                <line x1="1.5" y1="8" x2="3" y2="8" />
                <line x1="13" y1="8" x2="14.5" y2="8" />
                <line x1="3.4" y1="3.4" x2="4.5" y2="4.5" />
                <line x1="11.5" y1="11.5" x2="12.6" y2="12.6" />
                <line x1="3.4" y1="12.6" x2="4.5" y2="11.5" />
                <line x1="11.5" y1="4.5" x2="12.6" y2="3.4" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
              <path d="M13 9.5A6 6 0 1 1 6.5 3a5 5 0 0 0 6.5 6.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface text-text-dim hover:text-text hover:bg-surface-2 transition duration-150 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={togglePanoramic}
          title={modeToggleLabel}
          aria-label={`${modeToggleLabel}. Current mode: ${currentMode}.`}
          data-current-mode={currentMode.toLowerCase()}
        >
          {isPanoramic ? (
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
              <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
              <line x1="4.5" y1="3" x2="4.5" y2="13" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.25 1.25"/>
              <line x1="8" y1="3" x2="8" y2="13" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.25 1.25"/>
              <line x1="11.5" y1="3" x2="11.5" y2="13" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.25 1.25"/>
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
              <rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
