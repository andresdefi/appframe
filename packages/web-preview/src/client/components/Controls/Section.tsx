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
  // The inner unconstrained wrapper — observed for size changes.
  // The outer (clip) wrapper has maxHeight bound to contentHeight, so its
  // own size doesn't react to inner growth and observing it would never fire.
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (collapsed || !innerRef.current) return;
    const el = innerRef.current;
    setContentHeight(el.scrollHeight);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsed, children]);

  if (hidden) return null;

  return (
    <div className="mx-3 mt-5 mb-1 first:mt-4 last:mb-4">
      {title && (
        <button
          className="group w-full flex items-center gap-2 px-2 py-1.5 mb-1.5 -mx-1 text-left cursor-pointer transition-colors hover:bg-surface-2/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
        >
          <span className="flex-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-dim group-hover:text-text transition-colors text-balance">{title}</span>
          {tooltip && (
            <span
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-surface-2 text-[9px] text-text-dim cursor-help leading-none shrink-0"
              title={tooltip}
              onClick={(e) => e.stopPropagation()}
              aria-label={tooltip}
            >
              ?
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 text-text-dim group-hover:text-text shrink-0 transition-all duration-200 ${collapsed ? '' : 'rotate-180'}`}
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: collapsed ? 0 : contentHeight ?? 'none',
          opacity: collapsed ? 0 : 1,
        }}
        aria-hidden={collapsed}
      >
        <div ref={innerRef} className="px-1 pb-1">
          {children}
        </div>
      </div>
    </div>
  );
}
