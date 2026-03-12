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
    <div className="border border-border rounded-md p-2 mb-1.5 text-[11px]">
      <div className="flex justify-between items-center mb-1.5">
        <button
          className="flex items-center gap-1 font-semibold text-text-dim hover:text-text transition-colors cursor-pointer bg-transparent border-none p-0 text-[11px]"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title}`}
        >
          <span
            className="inline-block transition-transform duration-150 text-[8px]"
            style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          >
            ▼
          </span>
          {title}
        </button>
        <button
          className="text-text-dim hover:text-red-400 text-sm leading-none px-1 transition-colors"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          title={`Remove ${title}`}
        >
          &times;
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
        {children}
      </div>
    </div>
  );
}
