interface LocaleRowHeaderProps {
  locale: string;
  label: string;
  active: boolean;
  onActivate: () => void;
  onRemove?: () => void;
}

export function LocaleRowHeader({ locale, label, active, onActivate, onRemove }: LocaleRowHeaderProps) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors ${
        active
          ? 'bg-surface-2/80 surface-card text-text font-medium'
          : 'hover:bg-surface-2/40 text-text-dim hover:text-text'
      }`}
      onClick={onActivate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      aria-pressed={active}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
          active ? 'bg-accent' : 'bg-text-dim/40'
        }`}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
      {locale !== 'default' && (
        <span className="text-[9px] uppercase tracking-wider text-text-dim/70 font-normal">
          {locale}
        </span>
      )}
      {onRemove && (
        <button
          className="ml-auto opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-text-dim hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title={`Remove ${label}`}
          aria-label={`Remove ${label}`}
        >
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
