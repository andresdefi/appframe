import { useState, useRef, useEffect } from 'react';

interface CollapsiblePanelProps {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function CollapsiblePanel({ title, onRemove, children, defaultCollapsed = false }: CollapsiblePanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, collapsed]);

  return (
    <div className="surface-card rounded-2xl p-3 mb-2 text-[11px]">
      <div className="flex justify-between items-center gap-2">
        <button
          className="group flex items-center gap-1.5 font-medium text-text-dim hover:text-text transition-colors bg-transparent border-0 p-0 text-[11px] flex-1 min-w-0"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title}`}
        >
          <svg
            className={`w-3 h-3 text-text-dim group-hover:text-text shrink-0 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="truncate text-left">{title}</span>
        </button>
        <button
          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-text-dim hover:text-red-400 hover:bg-surface-2 transition-colors shrink-0"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          title={`Remove ${title}`}
        >
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" aria-hidden="true">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-150 ease-in-out"
        style={{
          maxHeight: collapsed ? 0 : contentHeight ?? 'none',
          opacity: collapsed ? 0 : 1,
        }}
        aria-hidden={collapsed}
      >
        <div className="pt-2.5">
          {children}
        </div>
      </div>
    </div>
  );
}
