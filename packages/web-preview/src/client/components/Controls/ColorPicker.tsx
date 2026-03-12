import { useId } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onInstant?: (value: string) => void;
  presets?: string[];
  onPresetClick?: (color: string) => void;
}

export function ColorPicker({
  label,
  value,
  onChange,
  onInstant,
  presets,
  onPresetClick,
}: ColorPickerProps) {
  const id = useId();
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-xs text-text-dim flex-1">{label}</label>
        <input
          id={id}
          type="color"
          value={value}
          aria-label={label}
          className="w-8 h-8 border border-border rounded-md cursor-pointer bg-transparent p-0.5"
          onInput={(e) => {
            onInstant?.((e.target as HTMLInputElement).value);
          }}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </div>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {presets.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded border border-border cursor-pointer hover:scale-110 transition-transform focus:ring-2 focus:ring-accent focus:outline-none"
              style={{ background: color }}
              title={color}
              aria-label={`Select color ${color}`}
              onClick={() => {
                onPresetClick?.(color);
                onChange(color);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
