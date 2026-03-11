interface SectionProps {
  title: string;
  children: React.ReactNode;
  hidden?: boolean;
  tooltip?: string;
}

export function Section({ title, children, hidden, tooltip }: SectionProps) {
  if (hidden) return null;
  return (
    <div className="px-5 py-4 border-b border-border">
      <div className="text-[11px] uppercase tracking-wide text-text-dim mb-3 flex items-center gap-1.5">
        {title}
        {tooltip && (
          <span className="relative group">
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border text-[9px] text-text-dim cursor-help leading-none">
              ?
            </span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 px-2.5 py-1.5 text-[10px] normal-case tracking-normal text-text bg-surface-2 border border-border rounded-md shadow-lg z-50 pointer-events-none">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
