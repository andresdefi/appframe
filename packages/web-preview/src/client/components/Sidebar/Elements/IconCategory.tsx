import { useEffect, useMemo, useState } from 'react';
import { Section } from '../../Controls/Section';
import { ColorPicker } from '../../Controls/ColorPicker';
import type { CatalogItem, CategoriesPayload, CategoryMeta, IconEntry } from './utils';
import {
  fetchIconCatalog,
  fetchIconCategories,
  fetchIconSvg,
  getCachedCatalog,
  getCachedCategoriesPayload,
  recolorLucideSvg,
  svgToDataUrl,
} from './utils';

// Lucide ships 42 categories. Surface the ones most useful for App Store
// screenshots up front and tuck the rest behind a "More" toggle so the
// sidebar doesn't drown in chip rows.
const PRIORITY_CATEGORY_IDS = [
  'arrows',
  'shapes',
  'devices',
  'communication',
  'people',
  'files',
  'finance',
  'shopping',
  'travel',
  'photography',
  'security',
  'social',
];

interface IconCategoryViewProps {
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

export function IconCategoryView({ onBack, onAdd }: IconCategoryViewProps) {
  const [catalog, setCatalog] = useState<IconEntry[] | null>(getCachedCatalog());
  const [categoriesPayload, setCategoriesPayload] = useState<CategoriesPayload | null>(
    getCachedCategoriesPayload(),
  );
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [color, setColor] = useState('#6366f1');
  const [renderLimit, setRenderLimit] = useState(96);

  useEffect(() => {
    let active = true;
    if (!catalog) {
      fetchIconCatalog()
        .then((entries) => {
          if (active) setCatalog(entries);
        })
        .catch((err: unknown) => {
          if (active) setError(err instanceof Error ? err.message : String(err));
        });
    }
    if (!categoriesPayload) {
      fetchIconCategories()
        .then((payload) => {
          if (active) setCategoriesPayload(payload);
        })
        .catch(() => {
          // Categories are an enhancement — search still works without them.
        });
    }
    return () => {
      active = false;
    };
  }, [catalog, categoriesPayload]);

  const filtered = useMemo(() => {
    if (!catalog) return [];
    const q = query.trim().toLowerCase();
    const iconCategoriesMap = categoriesPayload?.iconCategories ?? {};
    return catalog.filter((entry) => {
      if (activeCategory !== 'all') {
        const cats = iconCategoriesMap[entry.name];
        if (!cats || !cats.includes(activeCategory)) return false;
      }
      if (!q) return true;
      if (entry.name.includes(q)) return true;
      return entry.tags.some((tag) => tag.toLowerCase().includes(q));
    });
  }, [catalog, query, activeCategory, categoriesPayload]);

  // Reset the lazy-render cap when filtering — otherwise switching from a
  // narrow query to no query feels weirdly truncated.
  useEffect(() => {
    setRenderLimit(96);
  }, [query, activeCategory]);

  const handleAdd = async (name: string) => {
    try {
      const rawSvg = await fetchIconSvg(name);
      const colored = recolorLucideSvg(rawSvg, color);
      const dataUrl = svgToDataUrl(colored);
      const item: CatalogItem = {
        id: `lucide-${name}`,
        label: name,
        preview: <span />,
        build: () => ({
          type: 'icon',
          imageDataUrl: dataUrl,
          iconRef: `lucide:${name}`,
          shapeColor: color,
          size: 100,
        }),
      };
      onAdd(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Section title="" defaultCollapsed={false}>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 text-[12px] text-text-dim hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1 transition-transform duration-150 active:scale-[0.97]"
      >
        <span aria-hidden>‹</span>
        <span>Back</span>
      </button>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-text text-balance">Icons</div>
        <div className="text-[10px] text-text-dim">{catalog ? `${filtered.length} / ${catalog.length}` : '…'}</div>
      </div>
      <div className="mb-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 1900+ icons (e.g. camera, lock, heart)"
          className="input-shell w-full text-[12px] py-1.5"
        />
      </div>
      <CategoryChips
        categories={categoriesPayload?.categories ?? []}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
      <div className="mb-3">
        <ColorPicker label="Icon color" value={color} onChange={setColor} />
      </div>

      {error && <p className="text-[11px] text-red-400 mb-2">Failed to load icons: {error}</p>}
      {!catalog && !error && <p className="text-[11px] text-text-dim">Loading icon catalog…</p>}
      {catalog && (
        <>
          <div className="grid grid-cols-4 gap-1.5">
            {filtered.slice(0, renderLimit).map((entry) => (
              <IconTile key={entry.name} name={entry.name} color={color} onClick={() => handleAdd(entry.name)} />
            ))}
          </div>
          {filtered.length > renderLimit && (
            <button
              type="button"
              onClick={() => setRenderLimit((n) => n + 96)}
              className="w-full mt-2 py-1.5 text-[11px] bg-surface-2 surface-card surface-card-hover rounded-lg text-text-dim hover:text-text transition duration-150 active:scale-[0.97]"
            >
              Show more ({filtered.length - renderLimit} remaining)
            </button>
          )}
        </>
      )}
    </Section>
  );
}

function CategoryChips({
  categories,
  activeCategory,
  onChange,
}: {
  categories: CategoryMeta[];
  activeCategory: string;
  onChange: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const priority: CategoryMeta[] = [];
  const rest: CategoryMeta[] = [];
  for (const cat of categories) {
    if (PRIORITY_CATEGORY_IDS.includes(cat.id)) priority.push(cat);
    else rest.push(cat);
  }
  // Stable order: priority list follows PRIORITY_CATEGORY_IDS; the rest
  // are alphabetised by title so the More list reads naturally.
  priority.sort(
    (a, b) => PRIORITY_CATEGORY_IDS.indexOf(a.id) - PRIORITY_CATEGORY_IDS.indexOf(b.id),
  );
  rest.sort((a, b) => a.title.localeCompare(b.title));

  // If the active category is in the hidden set, auto-expand so the user
  // can see what's selected.
  const activeInRest = rest.some((c) => c.id === activeCategory);
  const isExpanded = expanded || activeInRest;

  return (
    <div className="mb-3 flex flex-wrap gap-1">
      <CategoryChip
        label="All"
        isActive={activeCategory === 'all'}
        onClick={() => onChange('all')}
      />
      {priority.map((cat) => (
        <CategoryChip
          key={cat.id}
          label={cat.title}
          isActive={activeCategory === cat.id}
          onClick={() => onChange(cat.id)}
        />
      ))}
      {isExpanded &&
        rest.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.title}
            isActive={activeCategory === cat.id}
            onClick={() => onChange(cat.id)}
          />
        ))}
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="px-2 py-0.5 rounded-full text-[10px] border border-dashed border-border text-text-dim hover:text-text hover:border-accent/30 transition duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {isExpanded ? 'Less' : `+${rest.length} more`}
        </button>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-0.5 rounded-full text-[10px] border transition duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isActive
          ? 'bg-accent/15 border-accent/60 text-text'
          : 'bg-surface-2 border-border text-text-dim hover:text-text hover:border-accent/30'
      }`}
    >
      {label}
    </button>
  );
}

interface IconTileProps {
  name: string;
  color: string;
  onClick: () => void;
}

function IconTile({ name, color, onClick }: IconTileProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchIconSvg(name)
      .then((svg) => {
        if (!active) return;
        setDataUrl(svgToDataUrl(recolorLucideSvg(svg, color)));
      })
      .catch(() => {
        // Tile stays blank on failure; user can search for another icon.
      });
    return () => {
      active = false;
    };
  }, [name, color]);
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className="aspect-square rounded-lg bg-surface-2 surface-card surface-card-hover hover:bg-surface-2/80 transition duration-150 active:scale-[0.97] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {dataUrl ? (
        <img src={dataUrl} alt={name} className="block w-2/3 h-2/3 object-contain thumb-outline rounded-sm" />
      ) : (
        <span className="w-3 h-3 rounded-full bg-border" aria-hidden />
      )}
    </button>
  );
}
