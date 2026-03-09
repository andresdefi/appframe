interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <div className="mb-2.5">
      <label className="text-xs text-text-dim cursor-pointer flex items-center gap-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-accent"
        />
        {label}
      </label>
    </div>
  );
}
