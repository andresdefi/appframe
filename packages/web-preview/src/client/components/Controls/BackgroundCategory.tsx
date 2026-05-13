import { useState } from 'react';
import type { ReactNode } from 'react';

interface BackgroundCategoryProps<T> {
  name: string;
  items: T[];
  /** Tiles visible in the first row before the chevron. Default 5 (matches 6-col grid). */
  initialCount?: number;
  /** Render a single tile for an item; the click handler is wired by the parent. */
  renderTile: (item: T, idx: number) => ReactNode;
}

export function BackgroundCategory<T>({
  name,
  items,
  initialCount = 5,
  renderTile,
}: BackgroundCategoryProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = items.length > initialCount;
  const firstRowItems = items.slice(0, initialCount);
  const extraItems = items.slice(initialCount);

  return (
    <div className="mb-5">
      <div className="text-sm font-semibold text-text mb-2 px-1">{name}</div>
      <div className="grid grid-cols-6 gap-1.5">
        {/* Row 1: first N tiles, then chevron (if expandable) */}
        {firstRowItems.map((item, i) => renderTile(item, i))}
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="aspect-square flex items-center justify-center rounded-md bg-surface-2 text-text-dim hover:text-text hover:bg-surface-2/80 transition-all duration-150 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={expanded ? `Collapse ${name}` : `Show all ${items.length} ${name} presets`}
            aria-expanded={expanded}
          >
            <svg
              viewBox="0 0 16 16"
              className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {/* Remaining tiles flow into subsequent rows when expanded */}
        {expanded && extraItems.map((item, i) => renderTile(item, i + initialCount))}
      </div>
    </div>
  );
}
