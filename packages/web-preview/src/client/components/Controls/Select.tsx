import { memo, useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  title?: string;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  hidden?: boolean;
}

export const Select = memo(function Select({ label, value, onChange, options, groups, hidden }: SelectProps) {
  const id = useId();
  if (hidden) return null;
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="block text-xs text-text-dim mb-1.5">{label}</label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label || undefined}
        className="input-shell w-full text-[13px] font-inherit cursor-pointer"
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled} title={opt.title}>
            {opt.label}
          </option>
        ))}
        {groups?.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} title={opt.title}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
});
