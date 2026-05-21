import { useId, useRef, useState } from 'react';
import { ColorPickerPopover } from './ColorPickerPopover';
import { displayP3ToHex, parseDisplayP3 } from '@appframe/core/color/p3';

// Surface a short hex-equivalent label for any colour value, including
// `color(display-p3 ...)` storage form. Falls back to the raw value
// when it isn't a recognised colour.
function labelFor(value: string): string {
  if (parseDisplayP3(value) !== null) {
    return (displayP3ToHex(value) ?? value).toUpperCase();
  }
  return value.toUpperCase();
}

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
  const [open, setOpen] = useState(false);
  const swatchRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <label htmlFor={id} className="text-xs text-text-dim flex-1">{label}</label>
        <div className="relative inline-flex items-center gap-2 bg-surface-2 rounded-full pl-1 pr-3 py-1">
          <button
            id={id}
            ref={swatchRef}
            type="button"
            className="relative w-6 h-6 rounded-full overflow-hidden thumb-outline block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{ background: value }}
            aria-label={`${label} color swatch — click to edit`}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          />
          <span className="text-[11px] text-text-dim font-mono tabular-nums uppercase">{labelFor(value)}</span>
        </div>
      </div>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {presets.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full thumb-outline cursor-pointer hover:scale-110 active:scale-95 transition-transform focus:ring-2 focus:ring-accent focus:outline-none"
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
      {open && (
        <ColorPickerPopover
          triggerRef={swatchRef}
          value={value}
          onChange={onChange}
          onInstant={onInstant}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
