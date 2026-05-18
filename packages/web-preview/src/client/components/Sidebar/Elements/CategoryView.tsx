import { Section } from '../../Controls/Section';
import type { CatalogItem, CategoryId } from './utils';
import { CATALOGS } from './catalogs';
import { ShapeCategoryView } from './ShapeCategory';
import { ArrowCategoryView } from './ArrowCategory';
import { BlobCategoryView } from './BlobCategory';
import { IconCategoryView } from './IconCategory';

interface CategoryViewProps {
  category: CategoryId;
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

export function CategoryView({ category, onBack, onAdd }: CategoryViewProps) {
  if (category === 'icons') {
    return <IconCategoryView onBack={onBack} onAdd={onAdd} />;
  }
  if (category === 'shapes') {
    return <ShapeCategoryView onBack={onBack} onAdd={onAdd} />;
  }
  if (category === 'arrows') {
    return <ArrowCategoryView onBack={onBack} onAdd={onAdd} />;
  }
  if (category === 'blobs') {
    return <BlobCategoryView onBack={onBack} onAdd={onAdd} />;
  }
  const items = CATALOGS[category];
  const isComingSoon = items.length === 0;

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
      <div className="text-[13px] font-semibold text-text mb-2 capitalize text-balance">{category}</div>
      {isComingSoon ? (
        <p className="text-[11px] text-text-dim leading-relaxed text-pretty">
          Coming soon. We&apos;re still picking the right library for {category}.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => onAdd(item)}
              className="aspect-square rounded-lg bg-surface-2 surface-card surface-card-hover hover:bg-surface-2/80 transition duration-150 active:scale-[0.97] flex items-center justify-center text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {item.preview}
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}
