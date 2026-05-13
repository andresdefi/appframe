import { memo } from 'react';
import type { ReactNode } from 'react';

interface TileOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TileGridProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: TileOption[];
  columns?: 2 | 3 | 4;
  hidden?: boolean;
}

const COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
} as const;

export const TileGrid = memo(function TileGrid({
  label,
  value,
  onChange,
  options,
  columns = 3,
  hidden,
}: TileGridProps) {
  if (hidden) return null;
  return (
    <div className="mb-3">
      {label && <div className="block text-xs text-text-dim mb-1.5">{label}</div>}
      <div className={`grid gap-1.5 ${COLS[columns]}`}>
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              disabled={opt.disabled}
              aria-pressed={isActive}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-[11px] font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? 'bg-accent text-accent-fg'
                  : 'bg-surface-2 text-text-dim hover:text-text'
              }`}
            >
              {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
              <span className="text-balance">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
