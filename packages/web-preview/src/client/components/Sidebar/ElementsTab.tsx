import { useRef, useState } from 'react';
import { useCurrentScreen } from '../../hooks/useCurrentScreen';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { Section } from '../Controls/Section';
import { Select } from '../Controls/Select';
import { RangeSlider } from '../Controls/RangeSlider';
import { ColorPicker } from '../Controls/ColorPicker';
import { CollapsiblePanel } from '../Controls/CollapsiblePanel';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import type { Overlay } from '../../types';

function nextId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

type CategoryId = 'shapes' | 'arrows' | 'icons' | 'decor' | 'blobs' | 'stars';

interface CatalogItem {
  id: string;
  label: string;
  preview: JSX.Element;
  build: () => Partial<Overlay>;
}

// Shared base for a new overlay (size, position, etc.). Catalog items
// override with their type-specific config.
const OVERLAY_BASE: Omit<Overlay, 'id' | 'type'> = {
  x: 45,
  y: 45,
  size: 10,
  rotation: 0,
  opacity: 1,
};

export function ElementsTab() {
  const { screen, update } = useCurrentScreen();
  const { confirm, dialog } = useConfirmDialog();
  const { patchOverlay } = useInstantPatch();
  const [view, setView] = useState<'root' | CategoryId>('root');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const rootFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!screen) return null;

  const updateOverlay = (idx: number, partial: Partial<Overlay>) => {
    const overlays = screen.overlays.map((o, i) => (i === idx ? { ...o, ...partial } : o));
    update({ overlays });
  };

  const removeOverlay = async (idx: number) => {
    const ok = await confirm({
      title: 'Remove Element',
      message: `Remove Element ${idx + 1}? This cannot be undone.`,
    });
    if (!ok) return;
    update({ overlays: screen.overlays.filter((_, i) => i !== idx) });
  };

  const addOverlayFromItem = (item: CatalogItem) => {
    const built = item.build();
    const overlay: Overlay = {
      id: nextId('overlay'),
      type: 'shape',
      ...OVERLAY_BASE,
      ...built,
    } as Overlay;
    update({ overlays: [...screen.overlays, overlay] });
  };

  const instantOverlay = (idx: number, partial: Partial<Overlay>) => {
    const ov = screen.overlays[idx];
    if (!ov) return;
    patchOverlay(idx, { ...ov, ...partial });
  };

  const handleCustomUpload = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateOverlay(idx, { imageDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleRootImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const overlay: Overlay = {
        id: nextId('overlay'),
        type: 'custom',
        imageDataUrl: dataUrl,
        ...OVERLAY_BASE,
        size: 15,
      } as Overlay;
      update({ overlays: [...screen.overlays, overlay] });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {dialog}
      {view === 'root' ? (
        <RootView
          onPickCategory={setView}
          onUploadImage={() => rootFileInputRef.current?.click()}
        />
      ) : (
        <CategoryView
          category={view}
          onBack={() => setView('root')}
          onAdd={addOverlayFromItem}
        />
      )}

      <input
        ref={rootFileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleRootImageUpload(file);
          e.target.value = '';
        }}
      />

      {/* Elements on this frame — always visible regardless of view */}
      <Section
        title={`Elements on this frame (${screen.overlays.length})`}
        tooltip="Edit positioning and styling for each element you've added."
        defaultCollapsed={view !== 'root'}
      >
        {screen.overlays.length === 0 && (
          <p className="text-[10px] text-text-dim mb-2 leading-relaxed">
            No elements yet. Pick one from a category above to add it.
          </p>
        )}
        {screen.overlays.map((ov, idx) => (
          <CollapsiblePanel
            key={ov.id}
            title={titleForOverlay(ov, idx)}
            onRemove={() => removeOverlay(idx)}
          >
            <RangeSlider
              label="Position X"
              value={ov.x}
              min={0}
              max={100}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { x: v })}
              onInstant={(v) => instantOverlay(idx, { x: v })}
            />
            <RangeSlider
              label="Position Y"
              value={ov.y}
              min={0}
              max={100}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { y: v })}
              onInstant={(v) => instantOverlay(idx, { y: v })}
            />
            <RangeSlider
              label="Size"
              value={ov.size}
              min={1}
              max={50}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { size: v })}
              onInstant={(v) => instantOverlay(idx, { size: v })}
            />
            <RangeSlider
              label="Rotation"
              value={ov.rotation}
              min={-180}
              max={180}
              formatValue={(v) => `${v}°`}
              onChange={(v) => updateOverlay(idx, { rotation: v })}
              onInstant={(v) => instantOverlay(idx, { rotation: v })}
            />
            <RangeSlider
              label="Opacity"
              value={Math.round(ov.opacity * 100)}
              min={0}
              max={100}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { opacity: v / 100 })}
              onInstant={(v) => instantOverlay(idx, { opacity: v / 100 })}
            />

            {ov.type === 'shape' && (
              <>
                <Select
                  label="Shape"
                  value={ov.shapeType ?? 'circle'}
                  onChange={(v) =>
                    updateOverlay(idx, { shapeType: v as NonNullable<Overlay['shapeType']> })
                  }
                  options={[
                    { value: 'circle', label: 'Circle' },
                    { value: 'rectangle', label: 'Rectangle' },
                    { value: 'line', label: 'Line' },
                    { value: 'arrow', label: 'Arrow' },
                  ]}
                />
                <ColorPicker
                  label="Color"
                  value={ov.shapeColor ?? '#6366f1'}
                  onChange={(v) => updateOverlay(idx, { shapeColor: v })}
                />
                <RangeSlider
                  label="Fill Opacity"
                  value={Math.round((ov.shapeOpacity ?? 0.5) * 100)}
                  min={0}
                  max={100}
                  formatValue={(v) => `${v}%`}
                  onChange={(v) => updateOverlay(idx, { shapeOpacity: v / 100 })}
                  onInstant={(v) => instantOverlay(idx, { shapeOpacity: v / 100 })}
                />
                <RangeSlider
                  label="Blur"
                  value={ov.shapeBlur ?? 0}
                  min={0}
                  max={50}
                  formatValue={(v) => `${v}px`}
                  onChange={(v) => updateOverlay(idx, { shapeBlur: v })}
                  onInstant={(v) => instantOverlay(idx, { shapeBlur: v })}
                />
              </>
            )}

            {ov.type === 'star-rating' && (
              <ColorPicker
                label="Color"
                value={ov.shapeColor ?? '#f59e0b'}
                onChange={(v) => updateOverlay(idx, { shapeColor: v })}
              />
            )}

            {ov.type === 'custom' && (
              <div className="mt-2">
                {ov.imageDataUrl ? (
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={ov.imageDataUrl}
                      alt="Custom element"
                      className="h-10 w-10 object-contain border border-border rounded bg-surface-2"
                    />
                    <button
                      type="button"
                      className="text-[11px] text-text-dim hover:text-text underline"
                      onClick={() => updateOverlay(idx, { imageDataUrl: undefined })}
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-text-dim mb-2">
                    Upload a PNG, SVG, or JPG to use as this element.
                  </p>
                )}
                <input
                  ref={(el) => {
                    fileInputRefs.current[idx] = el;
                  }}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCustomUpload(idx, file);
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  className="w-full py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
                  onClick={() => fileInputRefs.current[idx]?.click()}
                >
                  {ov.imageDataUrl ? 'Replace image' : 'Choose image'}
                </button>
              </div>
            )}
          </CollapsiblePanel>
        ))}
      </Section>
    </>
  );
}

// ---------- root view: 6 category cards + custom image upload ----------

interface RootViewProps {
  onPickCategory: (id: CategoryId) => void;
  onUploadImage: () => void;
}

function RootView({ onPickCategory, onUploadImage }: RootViewProps) {
  return (
    <Section title="Elements" tooltip="Pick a category, then choose an element to drop onto the canvas." defaultCollapsed={false}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {ROOT_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} onClick={() => onPickCategory(cat.id)} />
        ))}
      </div>
      <button
        type="button"
        className="w-full py-2 text-xs bg-surface-2 border border-border rounded-md text-text-dim hover:text-text hover:border-accent/40"
        onClick={onUploadImage}
      >
        Upload custom image
      </button>
    </Section>
  );
}

interface CategoryDef {
  id: CategoryId;
  label: string;
  // Three preview tiles shown inside the category card.
  preview: JSX.Element[];
}

const ROOT_CATEGORIES: CategoryDef[] = [
  {
    id: 'shapes',
    label: 'Shapes',
    preview: [
      <PreviewCircle key="c" />,
      <PreviewRectangle key="r" />,
      <PreviewArrow key="a" />,
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    preview: [
      <PreviewArrow key="ar" />,
      <PreviewArrow key="ad" rotate={45} />,
      <PreviewArrow key="al" rotate={180} />,
    ],
  },
  {
    id: 'icons',
    label: 'Icons',
    preview: [<PlaceholderTile key="1" />, <PlaceholderTile key="2" />, <PlaceholderTile key="3" />],
  },
  {
    id: 'decor',
    label: 'Decor',
    preview: [<PlaceholderTile key="1" />, <PlaceholderTile key="2" />, <PlaceholderTile key="3" />],
  },
  {
    id: 'blobs',
    label: 'Blobs',
    preview: [<PlaceholderTile key="1" />, <PlaceholderTile key="2" />, <PlaceholderTile key="3" />],
  },
  {
    id: 'stars',
    label: 'Stars',
    preview: [<PreviewStarRating key="1" />, <PreviewStarRating key="2" />, <PreviewStarRating key="3" />],
  },
];

function CategoryCard({ category, onClick }: { category: CategoryDef; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-md border border-border bg-surface-2 p-2.5 hover:border-accent/40 hover:bg-surface-2/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="grid grid-cols-3 gap-1 mb-2">
        {category.preview.map((node, i) => (
          <div
            key={i}
            className="aspect-square rounded bg-surface border border-border/40 flex items-center justify-center text-text-dim"
          >
            {node}
          </div>
        ))}
      </div>
      <div className="text-[12px] font-medium text-text">{category.label}</div>
    </button>
  );
}

// ---------- category drilldown view ----------

interface CategoryViewProps {
  category: CategoryId;
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

function CategoryView({ category, onBack, onAdd }: CategoryViewProps) {
  const items = CATALOGS[category];
  const isComingSoon = items.length === 0;

  return (
    <Section title="" defaultCollapsed={false}>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 text-[12px] text-text-dim hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1"
      >
        <span aria-hidden>‹</span>
        <span>Back</span>
      </button>
      <div className="text-[13px] font-semibold text-text mb-2 capitalize">{category}</div>
      {isComingSoon ? (
        <p className="text-[11px] text-text-dim leading-relaxed">
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
              className="aspect-square rounded-md border border-border bg-surface-2 hover:border-accent/40 hover:bg-surface-2/80 transition-colors flex items-center justify-center text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {item.preview}
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}

// ---------- catalog content ----------

const CATALOGS: Record<CategoryId, CatalogItem[]> = {
  shapes: [
    {
      id: 'circle',
      label: 'Circle',
      preview: <PreviewCircle />,
      build: () => ({ type: 'shape', shapeType: 'circle', shapeColor: '#6366f1', shapeOpacity: 0.5 }),
    },
    {
      id: 'rectangle',
      label: 'Rectangle',
      preview: <PreviewRectangle />,
      build: () => ({ type: 'shape', shapeType: 'rectangle', shapeColor: '#6366f1', shapeOpacity: 0.5 }),
    },
    {
      id: 'line',
      label: 'Line',
      preview: <PreviewLine />,
      build: () => ({ type: 'shape', shapeType: 'line', shapeColor: '#6366f1', shapeOpacity: 0.8 }),
    },
    {
      id: 'arrow',
      label: 'Arrow',
      preview: <PreviewArrow />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1 }),
    },
  ],
  arrows: [
    {
      id: 'arrow-right',
      label: 'Arrow right',
      preview: <PreviewArrow />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: 0 }),
    },
    {
      id: 'arrow-down',
      label: 'Arrow down',
      preview: <PreviewArrow rotate={90} />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: 90 }),
    },
    {
      id: 'arrow-left',
      label: 'Arrow left',
      preview: <PreviewArrow rotate={180} />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: 180 }),
    },
    {
      id: 'arrow-up',
      label: 'Arrow up',
      preview: <PreviewArrow rotate={-90} />,
      build: () => ({ type: 'shape', shapeType: 'arrow', shapeColor: '#6366f1', shapeOpacity: 1, rotation: -90 }),
    },
  ],
  icons: [],
  decor: [],
  blobs: [],
  stars: [
    {
      id: 'star-rating',
      label: 'Star rating',
      preview: <PreviewStarRating />,
      build: () => ({ type: 'star-rating', shapeColor: '#f59e0b', size: 15 }),
    },
  ],
};

// ---------- preview thumbnails ----------

function PreviewCircle() {
  return (
    <svg width="60%" height="60%" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
    </svg>
  );
}

function PreviewRectangle() {
  return (
    <svg width="65%" height="65%" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

function PreviewLine() {
  return (
    <svg width="70%" height="20%" viewBox="0 0 24 4" aria-hidden>
      <rect x="0" y="0" width="24" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}

function PreviewArrow({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      width="65%"
      height="65%"
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <g stroke="currentColor" fill="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="12" x2="17" y2="12" />
        <polygon points="15,7 21,12 15,17" />
      </g>
    </svg>
  );
}

function PreviewStarRating() {
  return (
    <svg width="80%" height="40%" viewBox="0 0 24 6" aria-hidden>
      <g fill="currentColor">
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon
            key={i}
            points={`${i * 5 + 2.5},0.5 ${i * 5 + 3.2},2.2 ${i * 5 + 4.7},2.4 ${i * 5 + 3.5},3.5 ${i * 5 + 3.9},5.2 ${i * 5 + 2.5},4.3 ${i * 5 + 1.1},5.2 ${i * 5 + 1.5},3.5 ${i * 5 + 0.3},2.4 ${i * 5 + 1.8},2.2`}
          />
        ))}
      </g>
    </svg>
  );
}

function PlaceholderTile() {
  return (
    <div className="w-3 h-3 rounded-full bg-border" aria-hidden />
  );
}

function titleForOverlay(ov: Overlay, idx: number): string {
  const label = (() => {
    if (ov.type === 'shape') {
      const t = ov.shapeType ?? 'circle';
      return t.charAt(0).toUpperCase() + t.slice(1);
    }
    if (ov.type === 'star-rating') return 'Star Rating';
    if (ov.type === 'custom') return 'Custom Image';
    return ov.type;
  })();
  return `${idx + 1}. ${label}`;
}
