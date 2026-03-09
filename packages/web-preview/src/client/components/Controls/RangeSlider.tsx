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
        <span className="text-xs text-text-dim min-w-[40px] text-right shrink-0">
          {displayValue}
        </span>
      </div>
    </div>
  );
}
