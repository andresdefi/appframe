import { useMemo, useState } from 'react';
import { LOCALE_CATALOG, getLocaleLabel } from '@appframe/core/locales';
import { usePreviewStore } from '../../store';
import { Section } from '../Controls/Section';

export function LocalesTab() {
  const sessionLocales = usePreviewStore((s) => s.sessionLocales);
  const localeScreensMap = usePreviewStore((s) => s.localeScreens);
  const localePanoramicMap = usePreviewStore((s) => s.localePanoramicElements);
  const activeLocale = usePreviewStore((s) => s.locale);
  const setLocale = usePreviewStore((s) => s.setLocale);
  const addLocale = usePreviewStore((s) => s.addLocale);
  const removeLocale = usePreviewStore((s) => s.removeLocale);
  const isPanoramic = usePreviewStore((s) => s.isPanoramic);

  const [pickerOpen, setPickerOpen] = useState(false);

  // A locale appears in this mode's list when it has its own snapshot
  // for this mode. Snapshot model: `localeScreens[code]` = Individual,
  // `localePanoramicElements[code]` = Panoramic. Independent per mode.
  const addedCodes = useMemo(
    () => Object.keys(isPanoramic ? localePanoramicMap : localeScreensMap),
    [isPanoramic, localePanoramicMap, localeScreensMap],
  );
  const totalCount = addedCodes.length + 1; // Default + added

  return (
    <>
      <Section
        title={`Locales (${totalCount})`}
        defaultCollapsed={false}
        tooltip="Add locales to ship localized screenshot sets. Each locale gets its own canvas row. Default is canonical; locales only carry text + optional screenshots."
      >
        <div className="flex flex-col gap-1">
          <LocaleRow
            label="Default"
            code="default"
            active={activeLocale === 'default'}
            onClick={() => setLocale('default')}
          />
          {addedCodes.map((code) => (
            <LocaleRow
              key={code}
              label={sessionLocales[code]?.label ?? getLocaleLabel(code)}
              code={code}
              active={activeLocale === code}
              onClick={() => setLocale(code)}
              onRemove={() => {
                if (window.confirm(`Remove locale "${getLocaleLabel(code)}"? Its text and uploaded screenshots will be discarded.`)) {
                  removeLocale(code);
                }
              }}
            />
          ))}
          <button
            className="mt-2 inline-flex items-center justify-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-2/80 text-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setPickerOpen(true)}
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" aria-hidden="true">
              <path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            Add Locale
          </button>
        </div>
      </Section>

      {pickerOpen && (
        <LocalePicker
          excludeCodes={new Set(addedCodes)}
          onCancel={() => setPickerOpen(false)}
          onPick={(code, label, copyImages) => {
            addLocale(code, { label, copyImages });
            setPickerOpen(false);
          }}
        />
      )}
    </>
  );
}

interface LocaleRowProps {
  label: string;
  code: string;
  active: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

function LocaleRow({ label, code, active, onClick, onRemove }: LocaleRowProps) {
  return (
    <div
      className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] transition-colors ${
        active ? 'bg-surface-2 surface-card text-text font-medium' : 'hover:bg-surface-2/60 text-text-dim hover:text-text'
      }`}
    >
      <button
        className="flex-1 min-w-0 text-left flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
        onClick={onClick}
        aria-pressed={active}
      >
        <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-accent' : 'bg-text-dim/40'}`} aria-hidden="true" />
        <span className="truncate">{label}</span>
        {code !== 'default' && (
          <span className="text-[9px] uppercase tracking-wider text-text-dim/70 font-normal">{code}</span>
        )}
      </button>
      {onRemove && (
        <button
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-text-dim hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-1"
          onClick={onRemove}
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

interface LocalePickerProps {
  excludeCodes: Set<string>;
  onCancel: () => void;
  onPick: (code: string, label: string, copyImages: boolean) => void;
}

function LocalePicker({ excludeCodes, onCancel, onPick }: LocalePickerProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<{ code: string; label: string } | null>(null);
  const [copyImages, setCopyImages] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LOCALE_CATALOG.filter((entry) => {
      if (excludeCodes.has(entry.code)) return false;
      if (!q) return true;
      return (
        entry.code.toLowerCase().includes(q) ||
        entry.label.toLowerCase().includes(q) ||
        entry.nativeLabel.toLowerCase().includes(q)
      );
    });
  }, [query, excludeCodes]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add locale"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-md max-h-[80vh] bg-surface surface-card rounded-2xl flex flex-col overflow-hidden">
        {!selected ? (
          <>
            <div className="px-4 py-3 border-b border-surface-2/60">
              <h2 className="text-sm font-semibold text-text mb-2">Add Locale</h2>
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by code or language..."
                className="w-full bg-surface-2 rounded-md px-3 py-1.5 text-xs text-text placeholder:text-text-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="text-text-dim text-xs px-4 py-6 text-center">No matches.</div>
              ) : (
                filtered.map((entry) => (
                  <button
                    key={entry.code}
                    className="w-full text-left px-4 py-2 hover:bg-surface-2/80 focus:bg-surface-2/80 transition-colors focus:outline-none flex items-center justify-between gap-3"
                    onClick={() => setSelected({ code: entry.code, label: entry.label })}
                  >
                    <span className="flex flex-col min-w-0">
                      <span className="text-xs text-text truncate">{entry.label}</span>
                      <span className="text-[10px] text-text-dim truncate">{entry.nativeLabel}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-text-dim shrink-0">
                      {entry.code}
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-surface-2/60 flex justify-end">
              <button
                className="text-[11px] text-text-dim hover:text-text px-3 py-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-text mb-1">Add {selected.label}</h2>
              <p className="text-[11px] text-text-dim">
                The default screens' headlines and subtitles will be copied into this locale. You can edit them after.
              </p>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={copyImages}
                onChange={(e) => setCopyImages(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-[11px] text-text">
                Reuse the default screenshots
                <span className="block text-text-dim mt-0.5">
                  Uncheck to start with empty screenshots and upload localized ones later.
                </span>
              </span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                className="text-[11px] text-text-dim hover:text-text px-3 py-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => setSelected(null)}
              >
                Back
              </button>
              <button
                className="btn-primary text-[11px] px-3 py-1.5"
                onClick={() => onPick(selected.code, selected.label, copyImages)}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
