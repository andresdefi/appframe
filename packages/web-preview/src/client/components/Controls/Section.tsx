interface SectionProps {
  title: string;
  children: React.ReactNode;
  hidden?: boolean;
}

export function Section({ title, children, hidden }: SectionProps) {
  if (hidden) return null;
  return (
    <div className="px-5 py-4 border-b border-border">
      <div className="text-[11px] uppercase tracking-wide text-text-dim mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}
