import { useState, useRef, useEffect } from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  hidden?: boolean;
  tooltip?: string;
  /** @deprecated All sections are now collapsible. Kept for backward compat. */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function Section({ title, children, hidden, tooltip, defaultCollapsed = true }: SectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current && !collapsed) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, collapsed]);

  if (hidden) return null;

  return (
    <div className="mx-3 my-1.5 first:mt-3 last:mb-3">
      {title && (
        <button
          className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-surface-2 border border-border text-left cursor-pointer hover:border-accent/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
        >
          <span className="flex-1 text-[12px] font-medium text-text">{title}</span>
          {tooltip && (
            <span
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border text-[9px] text-text-dim cursor-help leading-none shrink-0"
              title={tooltip}
              onClick={(e) => e.stopPropagation()}
              aria-label={tooltip}
            >
              ?
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 text-text-dim shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: collapsed ? 0 : contentHeight ?? 'none',
          opacity: collapsed ? 0 : 1,
        }}
        aria-hidden={collapsed}
      >
        <div className="px-1 pt-3 pb-1">
          {children}
        </div>
      </div>
    </div>
  );
}
