import { usePreviewStore } from '../../store';

const TABS = [
  { id: 'design', label: 'Design' },
  { id: 'device', label: 'Device' },
  { id: 'text', label: 'Text' },
  { id: 'effects', label: 'Effects' },
  { id: 'export', label: 'Export' },
] as const;

export function TabBar() {
  const activeTab = usePreviewStore((s) => s.activeTab);
  const setActiveTab = usePreviewStore((s) => s.setActiveTab);

  return (
    <div className="flex border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-dim hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
