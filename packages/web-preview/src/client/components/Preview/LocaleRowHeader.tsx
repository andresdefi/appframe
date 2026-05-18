interface LocaleRowHeaderProps {
  locale: string;
  label: string;
  active: boolean;
  onActivate: () => void;
  onRemove?: () => void;
}

// Minimal centered label above each canvas row. No background pill — the
// rows themselves are the visual content; the header just labels them.
// Click anywhere on the header to activate the locale. Remove × appears
// on hover for non-default locales.
export function LocaleRowHeader({ locale, label, active, onActivate, onRemove }: LocaleRowHeaderProps) {
  return (
    <div className="group flex items-center justify-center gap-2 py-1">
      <button
        className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          active
            ? 'text-text font-medium cursor-default'
            : 'text-text-dim hover:text-text cursor-pointer'
        }`}
        onClick={active ? undefined : onActivate}
        aria-pressed={active}
        type="button"
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
            active ? 'bg-accent' : 'bg-text-dim/50'
          }`}
          aria-hidden="true"
        />
        <span>{label}</span>
        {locale !== 'default' && (
          <span className="text-[9px] uppercase tracking-wider text-text-dim/70 font-normal">
            {locale}
          </span>
        )}
      </button>
      {onRemove && (
        <button
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-text-dim hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title={`Remove ${label}`}
          aria-label={`Remove ${label}`}
          type="button"
        >
          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
