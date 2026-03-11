import { useState, useRef, useEffect } from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
  onInstant?: (value: number) => void;
  disabled?: boolean;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  onChange,
  onInstant,
  disabled,
}: RangeSliderProps) {
  const displayValue = formatValue ? formatValue(value) : String(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.select();
    }
  }, [editing]);

  function commitEdit() {
    setEditing(false);
    const parsed = parseFloat(draft);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.min(max, Math.max(min, parsed));
    const stepped = Math.round(clamped / step) * step;
    onChange(stepped);
  }

  return (
    <div className="mb-2.5">
      <label className="block text-xs text-text-dim mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          className="w-full accent-accent"
          onInput={(e) => {
            const v = Number((e.target as HTMLInputElement).value);
            onInstant?.(v);
          }}
          onChange={(e) => {
            onChange(Number(e.target.value));
          }}
        />
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit();
              if (e.key === 'Escape') setEditing(false);
            }}
            className="text-xs text-text bg-surface border border-border rounded px-1 py-0 min-w-[40px] w-[48px] text-right shrink-0 outline-none focus:border-accent"
          />
        ) : (
          <span
            className="text-xs text-text-dim min-w-[40px] text-right shrink-0 cursor-text hover:text-text transition-colors"
            tabIndex={disabled ? undefined : 0}
            role="button"
            aria-label={`Edit ${label} value`}
            onClick={() => {
              if (disabled) return;
              setDraft(String(value));
              setEditing(true);
            }}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDraft(String(value));
                setEditing(true);
              }
            }}
          >
            {displayValue}
          </span>
        )}
      </div>
    </div>
  );
}
