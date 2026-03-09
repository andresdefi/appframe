interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
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

export function Select({ label, value, onChange, options, groups, hidden }: SelectProps) {
  if (hidden) return null;
  return (
    <div className="mb-2.5">
      <label className="block text-xs text-text-dim mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-2 bg-surface-2 border border-border rounded-md text-text text-[13px] font-inherit outline-none focus:border-accent"
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
        {groups?.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
