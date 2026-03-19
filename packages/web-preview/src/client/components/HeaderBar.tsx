import { usePreviewStore } from '../store';

interface HeaderBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  showSidebarToggle: boolean;
  agentMode: boolean;
  onToggleAgentMode: () => void;
}

const TABS = [
  { id: 'variants', label: 'Variants' },
  { id: 'background', label: 'Background' },
  { id: 'device', label: 'Device' },
  { id: 'text', label: 'Text' },
  { id: 'extras', label: 'Extras' },
  { id: 'export', label: 'Download' },
] as const;

export function HeaderBar({
  sidebarOpen,
  onToggleSidebar,
  showSidebarToggle,
  agentMode,
  onToggleAgentMode,
}: HeaderBarProps) {
  const config = usePreviewStore((s) => s.config);
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);
  const togglePanoramic = usePreviewStore((s) => s.togglePanoramic);
  const activeTab = usePreviewStore((s) => s.activeTab);
  const setActiveTab = usePreviewStore((s) => s.setActiveTab);
  const activeVariantId = usePreviewStore((s) => s.activeVariantId);
  const variants = usePreviewStore((s) => s.variants);
  const selectedScreen = usePreviewStore((s) => s.selectedScreen);
  const screens = usePreviewStore((s) => s.screens);
  const currentMode = isPanoramic ? 'Panoramic' : 'Individual';
  const modeToggleLabel = isPanoramic ? 'Switch to Individual' : 'Switch to Panoramic';
  const activeVariant = variants.find((variant) => variant.id === activeVariantId);

  return (
    <div className="w-full min-h-11 px-3 py-2 md:px-4 flex flex-wrap items-center gap-2 md:gap-4 border-b border-border bg-surface shrink-0">
      {/* Left: branding */}
      <div className="flex items-center gap-2 min-w-0">
        {showSidebarToggle && (
          <button
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              sidebarOpen
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text'
            }`}
            onClick={onToggleSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="editor-sidebar"
          >
            {sidebarOpen ? 'Hide Controls' : 'Show Controls'}
          </button>
        )}
        <span className="text-sm font-semibold whitespace-nowrap">appframe</span>
        {config && (
          <span className="text-xs text-text-dim truncate">{config.app.name}</span>
        )}
        {activeVariant && (
          <span className="hidden sm:inline-flex text-[10px] text-text-dim bg-surface-2 px-1.5 py-0.5 rounded whitespace-nowrap">
            {activeVariant.name}
          </span>
        )}
        <span className="hidden sm:inline-flex text-[10px] text-text-dim bg-surface-2 px-1.5 py-0.5 rounded whitespace-nowrap">
          {currentMode}
        </span>
        {!isPanoramic && screens.length > 0 && (
          <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded whitespace-nowrap">
            {selectedScreen + 1}/{screens.length}
          </span>
        )}
      </div>

      {/* Center: tabs */}
      <div className="order-3 md:order-none basis-full md:basis-auto flex items-center gap-1 md:mx-auto overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`text-[11px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === tab.id
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-text-dim hover:text-text hover:bg-surface-2'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <button
          className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            agentMode
              ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
              : 'border-border bg-bg text-text-dim hover:border-emerald-400/30 hover:text-text'
          }`}
          onClick={onToggleAgentMode}
          aria-pressed={agentMode}
          title="Toggle the Agentation annotation overlay"
        >
          {agentMode ? 'Agentation On' : 'Agentation Off'}
        </button>

        <button
          className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            isPanoramic
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-border bg-bg text-text-dim hover:border-accent/30 hover:text-text'
          }`}
          onClick={togglePanoramic}
          title={modeToggleLabel}
          aria-label={`${modeToggleLabel}. Current mode: ${currentMode}.`}
          data-current-mode={currentMode.toLowerCase()}
        >
          <span className="w-3 h-3 flex items-center justify-center" aria-hidden="true">
            {isPanoramic ? (
              <svg viewBox="0 0 12 12" fill="none" className="w-full h-full" aria-hidden="true">
                <rect x="0.5" y="2" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
                <line x1="3" y1="2" x2="3" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1"/>
                <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1"/>
                <line x1="9" y1="2" x2="9" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1"/>
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" fill="none" className="w-full h-full" aria-hidden="true">
                <rect x="2" y="1" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1"/>
              </svg>
            )}
          </span>
          {modeToggleLabel}
        </button>
      </div>
    </div>
  );
}
