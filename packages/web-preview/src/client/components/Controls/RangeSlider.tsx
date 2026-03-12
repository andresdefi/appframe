import { useState, useRef, useEffect, useId } from 'react';

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
  const id = useId();
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
    <div className={`mb-2.5${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}>
      <label htmlFor={id} className="block text-xs text-text-dim mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
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
            aria-label={`Edit ${label} value`}
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
            className={`text-xs text-text-dim min-w-[40px] text-right shrink-0 transition-colors${disabled ? '' : ' cursor-text hover:text-text'}`}
            tabIndex={disabled ? undefined : 0}
            role="spinbutton"
            aria-label={`${label}: ${displayValue}. Click to edit`}
            aria-valuenow={value}
            aria-valuetext={displayValue}
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
