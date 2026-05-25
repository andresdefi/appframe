import { memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FontData } from '../../store';
import { ensurePreviewFontsRegistered } from '../../utils/parentFontRegistry';

interface FontPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fonts: FontData[];
}

interface FontGroup {
  label: string;
  fonts: FontData[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'sans-serif': 'Sans Serif',
  serif: 'Serif',
  display: 'Display',
};
const CATEGORY_ORDER = ['sans-serif', 'serif', 'display'] as const;

function groupFonts(fonts: FontData[]): FontGroup[] {
  const buckets: Record<string, FontData[]> = {};
  for (const f of fonts) {
    const cat = f.category ?? 'sans-serif';
    (buckets[cat] ?? (buckets[cat] = [])).push(f);
  }
  return CATEGORY_ORDER.filter((c) => buckets[c]?.length).map((c) => ({
    label: CATEGORY_LABELS[c] ?? c,
    fonts: buckets[c]!,
  }));
}

// Font-family string the browser uses to look up the @font-face rules
// registered via parentFontRegistry.ts. The server emits family names
// matching the human-readable `name` from /api/fonts (e.g. "Inter",
// "Playfair Display"), so we use that field directly with sensible
// generic fallbacks per category for the brief window before the
// font file hits the cache.
function familyFor(font: FontData): string {
  const fallback = font.category === 'serif' ? 'serif' : font.category === 'display' ? 'sans-serif' : 'sans-serif';
  return `"${font.name}", ${fallback}`;
}

/**
 * Font picker with live preview — replaces a native `<select>` for the
 * Font dropdowns in TextTab. Each option's label renders in its own
 * font so the user can compare typefaces at a glance without clicking
 * through one at a time.
 *
 * Font files load lazily: opening the picker registers every catalog
 * id's @font-face on the parent document (idempotent across opens),
 * the browser fetches the woff2 only when a label first paints in
 * that family. After the first open in a session, subsequent opens
 * are instant since both the CSS rules and the file bytes are cached.
 */
export const FontPicker = memo(function FontPicker({ label, value, onChange, fonts }: FontPickerProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => groupFonts(fonts), [fonts]);
  const selected = useMemo(() => fonts.find((f) => f.id === value), [fonts, value]);

  // Register every catalog id's @font-face on the parent document the
  // first time the picker opens. Idempotent — subsequent opens skip
  // network. We register on OPEN rather than mount so projects that
  // never touch the font picker don't pay 37 woff2 fetches up front.
  useEffect(() => {
    if (!open) return;
    void ensurePreviewFontsRegistered(fonts.map((f) => f.id));
  }, [open, fonts]);

  // Close on outside click + Escape. Same pattern as ColorPickerPopover.
  useEffect(() => {
    if (!open) return;
    const handleDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // The setTimeout defers the listener attachment so the same click
    // that opened the picker doesn't immediately close it.
    const t = setTimeout(() => document.addEventListener('mousedown', handleDown), 0);
    document.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="mb-3 relative">
      {label && (
        <label htmlFor={id} className="block text-xs text-text-dim mb-1.5">{label}</label>
      )}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="input-shell w-full text-[13px] cursor-pointer flex items-center justify-between gap-2 text-left"
      >
        <span
          className="truncate"
          style={selected ? { fontFamily: familyFor(selected) } : undefined}
        >
          {selected?.name ?? value}
        </span>
        <span className="text-text-dim text-[10px] shrink-0">▾</span>
      </button>
      {open && (
        <div
          ref={popoverRef}
          role="listbox"
          aria-label={label || 'Fonts'}
          className="absolute z-50 left-0 right-0 mt-1 max-h-[320px] overflow-y-auto rounded-md surface-card bg-surface-2"
        >
          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-dim bg-surface sticky top-0 z-10">
                {group.label}
              </div>
              {group.fonts.map((font) => {
                const isSelected = font.id === value;
                return (
                  <button
                    key={font.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(font.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-[16px] text-text transition-colors hover:bg-surface ${
                      isSelected ? 'bg-surface ring-1 ring-inset ring-accent' : ''
                    }`}
                    style={{
                      fontFamily: familyFor(font),
                      // Normalise the perceived size across families.
                      // `font-size` sets the em-square, but each typeface
                      // uses a different fraction of that square for its
                      // actual glyphs — so without this, pixel fonts like
                      // Tiny5 look microscopic next to tall display fonts
                      // like Bricolage Grotesque at the same font-size.
                      // `font-size-adjust` scales each family so its
                      // x-height matches the requested ratio (0.5 of em
                      // is the rough average across the catalog), producing
                      // visually consistent option heights.
                      fontSizeAdjust: 0.5,
                    }}
                  >
                    {font.name}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
