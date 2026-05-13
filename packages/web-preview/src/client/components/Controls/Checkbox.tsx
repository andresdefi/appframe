interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

import { memo } from 'react';

export const Checkbox = memo(function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <div className="mb-3">
      <label className="text-xs text-text-dim cursor-pointer flex items-center gap-2 select-none hover:text-text transition-colors">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-accent w-3.5 h-3.5 cursor-pointer"
        />
        {label}
      </label>
    </div>
  );
});
