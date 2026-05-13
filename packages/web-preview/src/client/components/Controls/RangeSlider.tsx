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
  // Local mirror of the controlled value so the thumb and readout move
  // smoothly during drag when onChange is deferred to release. When the
  // parent's value prop changes (e.g., on release, or an external update),
  // sync it back into local state.
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  const displayValue = formatValue ? formatValue(localValue) : String(localValue);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Latest value seen mid-drag — committed to onChange on release when
  // onInstant is wired up, so the canonical state update (and the
  // expensive iframe HTML rewrite it triggers) only fires once per gesture.
  const pendingValueRef = useRef<number | null>(null);

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

  function commitPending() {
    if (pendingValueRef.current === null) return;
    const v = pendingValueRef.current;
    pendingValueRef.current = null;
    onChange(v);
  }

  return (
    <div className={`mb-3${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}>
      <label htmlFor={id} className="block text-xs text-text-dim mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          disabled={disabled}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={localValue}
          aria-valuetext={displayValue}
          className="w-full accent-accent"
          onInput={(e) => {
            const v = Number((e.target as HTMLInputElement).value);
            setLocalValue(v);
            if (onInstant) {
              // Defer the canonical onChange to release so the slider
              // doesn't fight mid-drag server rewrites.
              pendingValueRef.current = v;
              onInstant(v);
            }
          }}
          onChange={(e) => {
            // No instant-patch consumer → emit every step so the debounced
            // server flow can drive visual feedback.
            if (!onInstant) onChange(Number(e.target.value));
          }}
          onPointerUp={commitPending}
          onKeyUp={commitPending}
          onBlur={commitPending}
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
            className="text-xs text-text bg-surface-2 rounded-md px-1.5 py-0.5 min-w-[40px] w-[52px] text-right shrink-0 outline-none focus:ring-2 focus:ring-accent border-0"
          />
        ) : (
          <span
            className={`text-xs text-text-dim min-w-[40px] text-right shrink-0 tabular-nums transition-colors${disabled ? '' : ' cursor-text hover:text-text'}`}
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
