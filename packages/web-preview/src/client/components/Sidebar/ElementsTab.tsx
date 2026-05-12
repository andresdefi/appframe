import { useEffect, useMemo, useRef, useState } from 'react';
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

// Shared base for a new overlay (position, rotation, opacity). Catalog
// items override `size` (raw px) and type-specific config.
const OVERLAY_BASE: Omit<Overlay, 'id' | 'type'> = {
  x: 45,
  y: 45,
  size: 100,
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
        size: 100,
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
              min={-50}
              max={150}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { x: v })}
              onInstant={(v) => instantOverlay(idx, { x: v })}
            />
            <RangeSlider
              label="Position Y"
              value={ov.y}
              min={-50}
              max={150}
              formatValue={(v) => `${v}%`}
              onChange={(v) => updateOverlay(idx, { y: v })}
              onInstant={(v) => instantOverlay(idx, { y: v })}
            />
            <RangeSlider
              label="Size"
              value={ov.size}
              min={50}
              max={600}
              step={5}
              formatValue={(v) => `${v}px`}
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
            <Select
              label="Layer"
              value={ov.layer ?? 'default'}
              onChange={(v) =>
                updateOverlay(idx, { layer: v as NonNullable<Overlay['layer']> })
              }
              options={[
                { value: 'front', label: 'Front (above everything)' },
                { value: 'default', label: 'Default (above text)' },
                { value: 'behind-text', label: 'Behind text' },
                { value: 'behind-device', label: 'Behind device' },
              ]}
            />
            <Select
              label="Blend mode"
              value={ov.blendMode ?? 'normal'}
              onChange={(v) =>
                updateOverlay(idx, { blendMode: v as NonNullable<Overlay['blendMode']> })
              }
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'multiply', label: 'Multiply (darken through)' },
                { value: 'screen', label: 'Screen (lighten through)' },
                { value: 'overlay', label: 'Overlay' },
                { value: 'soft-light', label: 'Soft light' },
                { value: 'hard-light', label: 'Hard light' },
                { value: 'darken', label: 'Darken' },
                { value: 'lighten', label: 'Lighten' },
                { value: 'color-dodge', label: 'Color dodge' },
                { value: 'color-burn', label: 'Color burn' },
                { value: 'difference', label: 'Difference' },
                { value: 'exclusion', label: 'Exclusion' },
              ]}
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

            {ov.type === 'icon' && ov.iconRef && (
              <ColorPicker
                label="Color"
                value={ov.shapeColor ?? '#6366f1'}
                onChange={async (v) => {
                  const ref = ov.iconRef;
                  if (!ref) {
                    updateOverlay(idx, { shapeColor: v });
                    return;
                  }
                  // iconRef format: "<source>:<name>". Lucide icons need a
                  // server fetch + recolour; geometric shapes regenerate
                  // locally.
                  const [source, name] = ref.split(':');
                  if (source === 'shape' && name) {
                    const svg = buildShapeSvg(name, v);
                    if (svg) {
                      updateOverlay(idx, { shapeColor: v, imageDataUrl: svgToDataUrl(svg) });
                      return;
                    }
                  }
                  // Library-fed sources route through their own fetchers
                  // so recolours hit the right /api/elements/<kind>/svg/...
                  // endpoint. The data URL gets rebuilt with the new colour.
                  if (source && name && source !== 'lucide') {
                    const fetcher =
                      source === 'figma-blobs' ? fetchBlobSvg : fetchArrowSvg;
                    try {
                      const rawSvg = await fetcher(source, name);
                      const colored = recolorLucideSvg(rawSvg, v);
                      const dataUrl = svgToDataUrl(colored);
                      updateOverlay(idx, { shapeColor: v, imageDataUrl: dataUrl });
                      return;
                    } catch {
                      updateOverlay(idx, { shapeColor: v });
                      return;
                    }
                  }
                  if (source !== 'lucide' || !name) {
                    updateOverlay(idx, { shapeColor: v });
                    return;
                  }
                  try {
                    const rawSvg = await fetchIconSvg(name);
                    const colored = recolorLucideSvg(rawSvg, v);
                    const dataUrl = svgToDataUrl(colored);
                    updateOverlay(idx, { shapeColor: v, imageDataUrl: dataUrl });
                  } catch {
                    // Keep the colour change even if the SVG refetch fails;
                    // a later retry (or render) will refresh the data URL.
                    updateOverlay(idx, { shapeColor: v });
                  }
                }}
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
      <ShapePreviewTile key="circle" shapeId="circle" />,
      <ShapePreviewTile key="hexagon" shapeId="hexagon" />,
      <ShapePreviewTile key="star-5" shapeId="star-5" />,
      <ShapePreviewTile key="pentagon" shapeId="pentagon" />,
      <ShapePreviewTile key="starburst-8" shapeId="starburst-8" />,
      <ShapePreviewTile key="rounded-square" shapeId="rounded-square" />,
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    preview: [
      <HandyArrowPreviewTile key="1" name="arrow-1" />,
      <HandyArrowPreviewTile key="3" name="arrow-3" />,
      <HandyArrowPreviewTile key="10" name="arrow-10" />,
      <HandyArrowPreviewTile key="50" name="arrow-50" />,
      <HandyArrowPreviewTile key="80" name="arrow-80" />,
      <HandyArrowPreviewTile key="120" name="arrow-120" />,
    ],
  },
  {
    id: 'icons',
    label: 'Icons',
    preview: [
      <LucidePreviewTile key="camera" name="camera" />,
      <LucidePreviewTile key="heart" name="heart" />,
      <LucidePreviewTile key="bell" name="bell" />,
      <LucidePreviewTile key="star" name="star" />,
      <LucidePreviewTile key="search" name="search" />,
      <LucidePreviewTile key="settings" name="settings" />,
    ],
  },
  {
    id: 'decor',
    label: 'Decor',
    preview: [
      <PlaceholderTile key="1" />,
      <PlaceholderTile key="2" />,
      <PlaceholderTile key="3" />,
      <PlaceholderTile key="4" />,
      <PlaceholderTile key="5" />,
      <PlaceholderTile key="6" />,
    ],
  },
  {
    id: 'blobs',
    label: 'Blobs',
    preview: [
      <BlobPreviewTile key="1" name="blob-1" />,
      <BlobPreviewTile key="3" name="blob-3" />,
      <BlobPreviewTile key="7" name="blob-7" />,
      <BlobPreviewTile key="11" name="blob-11" />,
      <BlobPreviewTile key="15" name="blob-15" />,
      <BlobPreviewTile key="19" name="blob-19" />,
    ],
  },
  {
    id: 'stars',
    label: 'Stars',
    preview: [
      <PreviewStarRating key="1" />,
      <PreviewStarRating key="2" />,
      <PreviewStarRating key="3" />,
      <PreviewStarRating key="4" />,
      <PreviewStarRating key="5" />,
      <PreviewStarRating key="6" />,
    ],
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
            className="aspect-square flex items-center justify-center text-text-dim"
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

// ---------- Icons category (Lucide via /api/elements/icons) ----------

interface IconEntry {
  name: string;
  tags: string[];
}

// Lucide's real category metadata, served by /api/elements/icons/categories.
// Generated once from the Lucide repo and shipped as a snapshot — see
// scripts/sync-lucide-categories.mjs for the refresh path.
interface CategoryMeta {
  id: string;
  title: string;
}
interface CategoriesPayload {
  categories: CategoryMeta[];
  iconCategories: Record<string, string[]>;
}

let cachedCategoriesPayload: CategoriesPayload | null = null;

async function fetchIconCategories(): Promise<CategoriesPayload> {
  if (cachedCategoriesPayload) return cachedCategoriesPayload;
  const res = await fetch('/api/elements/icons/categories');
  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
  cachedCategoriesPayload = (await res.json()) as CategoriesPayload;
  return cachedCategoriesPayload;
}

let cachedCatalog: IconEntry[] | null = null;
const svgFetchCache = new Map<string, Promise<string>>();

async function fetchIconCatalog(): Promise<IconEntry[]> {
  if (cachedCatalog) return cachedCatalog;
  const res = await fetch('/api/elements/icons/catalog');
  if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`);
  const json = await res.json();
  cachedCatalog = (json.icons ?? []) as IconEntry[];
  return cachedCatalog;
}

function fetchIconSvg(name: string): Promise<string> {
  const existing = svgFetchCache.get(name);
  if (existing) return existing;
  const promise = fetch(`/api/elements/icons/svg/${name}`).then((r) => {
    if (!r.ok) throw new Error(`Icon ${name} fetch failed: ${r.status}`);
    return r.text();
  });
  svgFetchCache.set(name, promise);
  return promise;
}

// Replace Lucide's stroke="currentColor" with a concrete hex so the SVG
// renders with the user's chosen colour even inside an `<img>` (which
// doesn't resolve currentColor against the parent CSS).
function recolorLucideSvg(svg: string, color: string): string {
  return svg.replaceAll('currentColor', color);
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ---------- Geometric shape primitives (Shapes category) ----------
// Regular polygons + a handful of common decorative primitives, all
// generated from math. No asset files — the SVG is the same shape on every
// call, so quality control is trivial. Each generator returns the SVG
// markup inside a 100×100 viewBox; the wrapper applies the chosen colour.

function regularPolygonPoints(sides: number, rotateDeg = -90, radius = 45): string {
  const cx = 50;
  const cy = 50;
  const rotateRad = (rotateDeg * Math.PI) / 180;
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides + rotateRad;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function starPoints(points: number, outerR = 45, innerR = 20): string {
  const cx = 50;
  const cy = 50;
  const total = points * 2;
  const start = -Math.PI / 2;
  const pts: string[] = [];
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = start + (Math.PI * 2 * i) / total;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface ShapeDef {
  id: string;
  label: string;
  // The SVG markup inside the wrapper. `fill="currentColor"` so the
  // outer template/styling can recolour without rewriting paths.
  inner: () => string;
}

const SHAPE_LIBRARY: ShapeDef[] = [
  { id: 'circle', label: 'Circle', inner: () => `<circle cx="50" cy="50" r="45"/>` },
  { id: 'square', label: 'Square', inner: () => `<rect x="5" y="5" width="90" height="90"/>` },
  {
    id: 'rounded-square',
    label: 'Rounded square',
    inner: () => `<rect x="5" y="5" width="90" height="90" rx="14"/>`,
  },
  {
    id: 'pill',
    label: 'Pill',
    inner: () => `<rect x="5" y="32" width="90" height="36" rx="18"/>`,
  },
  {
    id: 'ellipse',
    label: 'Ellipse',
    inner: () => `<ellipse cx="50" cy="50" rx="45" ry="28"/>`,
  },
  {
    id: 'triangle',
    label: 'Triangle',
    inner: () => `<polygon points="${regularPolygonPoints(3)}"/>`,
  },
  {
    id: 'diamond',
    label: 'Diamond',
    inner: () => `<polygon points="${regularPolygonPoints(4)}"/>`,
  },
  {
    id: 'pentagon',
    label: 'Pentagon',
    inner: () => `<polygon points="${regularPolygonPoints(5)}"/>`,
  },
  {
    id: 'hexagon',
    label: 'Hexagon',
    inner: () => `<polygon points="${regularPolygonPoints(6)}"/>`,
  },
  {
    id: 'heptagon',
    label: 'Heptagon',
    inner: () => `<polygon points="${regularPolygonPoints(7)}"/>`,
  },
  {
    id: 'octagon',
    label: 'Octagon',
    inner: () => `<polygon points="${regularPolygonPoints(8)}"/>`,
  },
  {
    id: 'star-4',
    label: '4-point star',
    inner: () => `<polygon points="${starPoints(4, 45, 18)}"/>`,
  },
  {
    id: 'star-5',
    label: '5-point star',
    inner: () => `<polygon points="${starPoints(5)}"/>`,
  },
  {
    id: 'star-6',
    label: '6-point star',
    inner: () => `<polygon points="${starPoints(6, 45, 22)}"/>`,
  },
  {
    id: 'starburst-8',
    label: '8-point burst',
    inner: () => `<polygon points="${starPoints(8, 45, 28)}"/>`,
  },
  {
    id: 'starburst-12',
    label: '12-point burst',
    inner: () => `<polygon points="${starPoints(12, 45, 32)}"/>`,
  },
  {
    id: 'plus',
    label: 'Plus',
    // Cross of two rectangles meeting in the middle.
    inner: () => `<path d="M40 5h20v35h35v20h-35v35h-20v-35h-35v-20h35z"/>`,
  },
  {
    id: 'heart',
    label: 'Heart',
    inner: () =>
      `<path d="M50 88 C 8 60 8 22 30 22 C 42 22 50 32 50 32 C 50 32 58 22 70 22 C 92 22 92 60 50 88 Z"/>`,
  },
  {
    id: 'speech-bubble',
    label: 'Speech bubble',
    inner: () =>
      `<path d="M10 18 H90 A6 6 0 0 1 96 24 V60 A6 6 0 0 1 90 66 H40 L24 84 V66 H10 A6 6 0 0 1 4 60 V24 A6 6 0 0 1 10 18 Z"/>`,
  },
  {
    id: 'arrow-tag',
    label: 'Arrow tag',
    // Rectangle with a notch cut out of the right side — quick "ribbon" look.
    inner: () => `<polygon points="5,20 70,20 95,50 70,80 5,80"/>`,
  },
];

const SHAPE_LIBRARY_BY_ID: Record<string, ShapeDef> = Object.fromEntries(
  SHAPE_LIBRARY.map((s) => [s.id, s]),
);

function buildShapeSvg(id: string, color: string): string | null {
  const def = SHAPE_LIBRARY_BY_ID[id];
  if (!def) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="${color}">${def.inner()}</svg>`;
}

interface ShapeCategoryViewProps {
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

function ShapeCategoryView({ onBack, onAdd }: ShapeCategoryViewProps) {
  const [color, setColor] = useState('#6366f1');

  const handleAdd = (shape: ShapeDef) => {
    const svg = buildShapeSvg(shape.id, color);
    if (!svg) return;
    const dataUrl = svgToDataUrl(svg);
    const item: CatalogItem = {
      id: `shape-${shape.id}`,
      label: shape.label,
      preview: <span />,
      build: () => ({
        type: 'icon',
        imageDataUrl: dataUrl,
        iconRef: `shape:${shape.id}`,
        shapeColor: color,
        size: 100,
      }),
    };
    onAdd(item);
  };

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
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-text">Shapes</div>
        <div className="text-[10px] text-text-dim">{SHAPE_LIBRARY.length} primitives</div>
      </div>
      <div className="mb-3">
        <ColorPicker label="Shape color" value={color} onChange={setColor} />
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {SHAPE_LIBRARY.map((shape) => (
          <ShapeTile key={shape.id} shape={shape} color={color} onClick={() => handleAdd(shape)} />
        ))}
      </div>
    </Section>
  );
}

// ---------- Arrows category (curated SVG packs) ----------

interface ArrowEntry {
  name: string;
  v: number; // Cache-bust version stamp (file mtime), from catalog.
}

interface ArrowSourceDef {
  id: string;
  title: string;
  attribution: string;
  attributionUrl: string;
  license: string;
  arrows: ArrowEntry[];
}

let cachedArrowsCatalog: ArrowSourceDef[] | null = null;
const arrowSvgFetchCache = new Map<string, Promise<string>>();
// Maps "<source>/<name>" → latest known version stamp so per-tile fetches
// can bust cache when an arrow's source file changes upstream.
const arrowVersionMap = new Map<string, number>();

async function fetchArrowsCatalog(): Promise<ArrowSourceDef[]> {
  if (cachedArrowsCatalog) return cachedArrowsCatalog;
  const res = await fetch('/api/elements/arrows/catalog');
  if (!res.ok) throw new Error(`Arrows catalog fetch failed: ${res.status}`);
  const json = await res.json();
  const sources = (json.sources ?? []) as ArrowSourceDef[];
  cachedArrowsCatalog = sources;
  // Populate the version map from the catalog so any later fetch by
  // (source, name) can apply the right cache-buster.
  for (const src of sources) {
    for (const entry of src.arrows) {
      arrowVersionMap.set(`${src.id}/${entry.name}`, entry.v);
    }
  }
  return sources;
}

function fetchArrowSvg(source: string, name: string): Promise<string> {
  const key = `${source}/${name}`;
  const existing = arrowSvgFetchCache.get(key);
  if (existing) return existing;
  const v = arrowVersionMap.get(key);
  const url = v
    ? `/api/elements/arrows/svg/${source}/${name}?v=${v}`
    : `/api/elements/arrows/svg/${source}/${name}`;
  const promise = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Arrow ${key} fetch failed: ${r.status}`);
    return r.text();
  });
  arrowSvgFetchCache.set(key, promise);
  return promise;
}

interface ArrowCategoryViewProps {
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

function ArrowCategoryView({ onBack, onAdd }: ArrowCategoryViewProps) {
  const [catalog, setCatalog] = useState<ArrowSourceDef[] | null>(cachedArrowsCatalog);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState('#111111');
  const [renderLimit, setRenderLimit] = useState(96);

  useEffect(() => {
    if (catalog) return;
    let active = true;
    fetchArrowsCatalog()
      .then((sources) => {
        if (active) setCatalog(sources);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      active = false;
    };
  }, [catalog]);

  const totalCount = (catalog ?? []).reduce((n, s) => n + s.arrows.length, 0);

  const handleAdd = async (source: string, name: string) => {
    try {
      const rawSvg = await fetchArrowSvg(source, name);
      const colored = recolorLucideSvg(rawSvg, color);
      const dataUrl = svgToDataUrl(colored);
      const item: CatalogItem = {
        id: `arrow-${source}-${name}`,
        label: name,
        preview: <span />,
        build: () => ({
          type: 'icon',
          imageDataUrl: dataUrl,
          iconRef: `${source}:${name}`,
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
        className="mb-3 inline-flex items-center gap-1 text-[12px] text-text-dim hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1"
      >
        <span aria-hidden>‹</span>
        <span>Back</span>
      </button>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-text">Arrows</div>
        <div className="text-[10px] text-text-dim">{catalog ? `${totalCount} total` : '…'}</div>
      </div>
      <div className="mb-3">
        <ColorPicker label="Arrow color" value={color} onChange={setColor} />
      </div>

      {error && <p className="text-[11px] text-red-400 mb-2">Failed to load arrows: {error}</p>}
      {!catalog && !error && <p className="text-[11px] text-text-dim">Loading arrows…</p>}
      {catalog && (
        <>
          {catalog.map((source) => {
            const visible = source.arrows.slice(0, renderLimit);
            return (
              <div key={source.id} className="mb-4">
                <div className="text-[11px] font-medium text-text-dim mb-1.5">{source.title}</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {visible.map((entry) => (
                    <ArrowTile
                      key={`${source.id}-${entry.name}`}
                      source={source.id}
                      name={entry.name}
                      color={color}
                      onClick={() => handleAdd(source.id, entry.name)}
                    />
                  ))}
                </div>
                {source.arrows.length > renderLimit && (
                  <button
                    type="button"
                    onClick={() => setRenderLimit((n) => n + 96)}
                    className="w-full mt-2 py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
                  >
                    Show more ({source.arrows.length - renderLimit} remaining)
                  </button>
                )}
                <div className="text-[10px] text-text-dim mt-1.5 leading-snug">
                  By{' '}
                  <a
                    href={source.attributionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-text"
                  >
                    {source.attribution}
                  </a>{' '}
                  · {source.license}
                </div>
              </div>
            );
          })}
        </>
      )}
    </Section>
  );
}

interface ArrowTileProps {
  source: string;
  name: string;
  color: string;
  onClick: () => void;
}

function ArrowTile({ source, name, color, onClick }: ArrowTileProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchArrowSvg(source, name)
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, color)));
      })
      .catch(() => {
        // Tile stays blank on failure.
      });
    return () => {
      active = false;
    };
  }, [source, name, color]);
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className="aspect-square rounded-md border border-border bg-surface-2 hover:border-accent/40 hover:bg-surface-2/80 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {dataUrl ? (
        <img src={dataUrl} alt={name} className="block w-2/3 h-2/3 object-contain" />
      ) : (
        <span className="w-3 h-3 rounded-full bg-border" aria-hidden />
      )}
    </button>
  );
}

// ---------- Blobs category (curated SVG packs) ----------

interface BlobEntry {
  name: string;
  v: number;
}

interface BlobSourceDef {
  id: string;
  title: string;
  attribution: string;
  attributionUrl: string;
  license: string;
  blobs: BlobEntry[];
}

let cachedBlobsCatalog: BlobSourceDef[] | null = null;
const blobSvgFetchCache = new Map<string, Promise<string>>();
const blobVersionMap = new Map<string, number>();

async function fetchBlobsCatalog(): Promise<BlobSourceDef[]> {
  if (cachedBlobsCatalog) return cachedBlobsCatalog;
  const res = await fetch('/api/elements/blobs/catalog');
  if (!res.ok) throw new Error(`Blobs catalog fetch failed: ${res.status}`);
  const json = await res.json();
  const sources = (json.sources ?? []) as BlobSourceDef[];
  cachedBlobsCatalog = sources;
  for (const src of sources) {
    for (const entry of src.blobs) {
      blobVersionMap.set(`${src.id}/${entry.name}`, entry.v);
    }
  }
  return sources;
}

function fetchBlobSvg(source: string, name: string): Promise<string> {
  const key = `${source}/${name}`;
  const existing = blobSvgFetchCache.get(key);
  if (existing) return existing;
  const v = blobVersionMap.get(key);
  const url = v
    ? `/api/elements/blobs/svg/${source}/${name}?v=${v}`
    : `/api/elements/blobs/svg/${source}/${name}`;
  const promise = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Blob ${key} fetch failed: ${r.status}`);
    return r.text();
  });
  blobSvgFetchCache.set(key, promise);
  return promise;
}

interface BlobCategoryViewProps {
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

function BlobCategoryView({ onBack, onAdd }: BlobCategoryViewProps) {
  const [catalog, setCatalog] = useState<BlobSourceDef[] | null>(cachedBlobsCatalog);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState('#6366f1');
  const [renderLimit, setRenderLimit] = useState(96);

  useEffect(() => {
    if (catalog) return;
    let active = true;
    fetchBlobsCatalog()
      .then((sources) => {
        if (active) setCatalog(sources);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      active = false;
    };
  }, [catalog]);

  const totalCount = (catalog ?? []).reduce((n, s) => n + s.blobs.length, 0);

  const handleAdd = async (source: string, name: string) => {
    try {
      const rawSvg = await fetchBlobSvg(source, name);
      const colored = recolorLucideSvg(rawSvg, color);
      const dataUrl = svgToDataUrl(colored);
      const item: CatalogItem = {
        id: `blob-${source}-${name}`,
        label: name,
        preview: <span />,
        build: () => ({
          type: 'icon',
          imageDataUrl: dataUrl,
          iconRef: `${source}:${name}`,
          shapeColor: color,
          size: 250,
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
        className="mb-3 inline-flex items-center gap-1 text-[12px] text-text-dim hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1"
      >
        <span aria-hidden>‹</span>
        <span>Back</span>
      </button>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-text">Blobs</div>
        <div className="text-[10px] text-text-dim">{catalog ? `${totalCount} total` : '…'}</div>
      </div>
      <div className="mb-3">
        <ColorPicker label="Blob color" value={color} onChange={setColor} />
      </div>

      {error && <p className="text-[11px] text-red-400 mb-2">Failed to load blobs: {error}</p>}
      {!catalog && !error && <p className="text-[11px] text-text-dim">Loading blobs…</p>}
      {catalog && (
        <>
          {catalog.map((source) => {
            const visible = source.blobs.slice(0, renderLimit);
            return (
              <div key={source.id} className="mb-4">
                <div className="text-[11px] font-medium text-text-dim mb-1.5">{source.title}</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {visible.map((entry) => (
                    <BlobTile
                      key={`${source.id}-${entry.name}`}
                      source={source.id}
                      name={entry.name}
                      color={color}
                      onClick={() => handleAdd(source.id, entry.name)}
                    />
                  ))}
                </div>
                {source.blobs.length > renderLimit && (
                  <button
                    type="button"
                    onClick={() => setRenderLimit((n) => n + 96)}
                    className="w-full mt-2 py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
                  >
                    Show more ({source.blobs.length - renderLimit} remaining)
                  </button>
                )}
                <div className="text-[10px] text-text-dim mt-1.5 leading-snug">
                  By{' '}
                  <a
                    href={source.attributionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-text"
                  >
                    {source.attribution}
                  </a>{' '}
                  · {source.license}
                </div>
              </div>
            );
          })}
        </>
      )}
    </Section>
  );
}

interface BlobTileProps {
  source: string;
  name: string;
  color: string;
  onClick: () => void;
}

function BlobTile({ source, name, color, onClick }: BlobTileProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchBlobSvg(source, name)
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, color)));
      })
      .catch(() => {
        // Tile stays blank on failure.
      });
    return () => {
      active = false;
    };
  }, [source, name, color]);
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className="aspect-square rounded-md border border-border bg-surface-2 hover:border-accent/40 hover:bg-surface-2/80 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {dataUrl ? (
        <img src={dataUrl} alt={name} className="block w-2/3 h-2/3 object-contain" />
      ) : (
        <span className="w-3 h-3 rounded-full bg-border" aria-hidden />
      )}
    </button>
  );
}

function ShapeTile({ shape, color, onClick }: { shape: ShapeDef; color: string; onClick: () => void }) {
  const dataUrl = svgToDataUrl(buildShapeSvg(shape.id, color) ?? '');
  return (
    <button
      type="button"
      onClick={onClick}
      title={shape.label}
      className="aspect-square rounded-md border border-border bg-surface-2 hover:border-accent/40 hover:bg-surface-2/80 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <img src={dataUrl} alt={shape.label} className="block w-2/3 h-2/3 object-contain" />
    </button>
  );
}

interface IconCategoryViewProps {
  onBack: () => void;
  onAdd: (item: CatalogItem) => void;
}

function IconCategoryView({ onBack, onAdd }: IconCategoryViewProps) {
  const [catalog, setCatalog] = useState<IconEntry[] | null>(cachedCatalog);
  const [categoriesPayload, setCategoriesPayload] = useState<CategoriesPayload | null>(
    cachedCategoriesPayload,
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
        className="mb-3 inline-flex items-center gap-1 text-[12px] text-text-dim hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1"
      >
        <span aria-hidden>‹</span>
        <span>Back</span>
      </button>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-text">Icons</div>
        <div className="text-[10px] text-text-dim">{catalog ? `${filtered.length} / ${catalog.length}` : '…'}</div>
      </div>
      <div className="mb-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 1900+ icons (e.g. camera, lock, heart)"
          className="w-full px-2.5 py-1.5 bg-surface-2 border border-border rounded-md text-text text-[12px] outline-none focus:border-accent"
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

      {error && (
        <p className="text-[11px] text-red-400 mb-2">Failed to load icons: {error}</p>
      )}
      {!catalog && !error && (
        <p className="text-[11px] text-text-dim">Loading icon catalog…</p>
      )}
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
              className="w-full mt-2 py-1.5 text-[11px] bg-surface-2 border border-border rounded-md text-text-dim hover:text-text"
            >
              Show more ({filtered.length - renderLimit} remaining)
            </button>
          )}
        </>
      )}
    </Section>
  );
}

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
          className="px-2 py-0.5 rounded-full text-[10px] border border-dashed border-border text-text-dim hover:text-text hover:border-accent/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
      className={`px-2 py-0.5 rounded-full text-[10px] border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
      className="aspect-square rounded-md border border-border bg-surface-2 hover:border-accent/40 hover:bg-surface-2/80 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {dataUrl ? (
        <img src={dataUrl} alt={name} className="block w-2/3 h-2/3 object-contain" />
      ) : (
        <span className="w-3 h-3 rounded-full bg-border" aria-hidden />
      )}
    </button>
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
      build: () => ({ type: 'star-rating', shapeColor: '#f59e0b', size: 100 }),
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

// Mini preview of a geometric shape primitive on the root Shapes card.
function ShapePreviewTile({ shapeId }: { shapeId: string }) {
  const svg = buildShapeSvg(shapeId, '#94a3b8');
  if (!svg) return <PlaceholderTile />;
  return <img src={svgToDataUrl(svg)} alt={shapeId} className="block w-3/5 h-3/5 object-contain" />;
}

// Mini preview of a Figma-sourced blob on the root Blobs card.
function BlobPreviewTile({ name }: { name: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    // Catalog provides the version stamp; pre-warm it so the cache-bust
    // query string is applied on the first render.
    fetchBlobsCatalog()
      .then(() => fetchBlobSvg('figma-blobs', name))
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, '#94a3b8')));
      })
      .catch(() => {
        // Tile stays as the placeholder dot on failure.
      });
    return () => {
      active = false;
    };
  }, [name]);
  return dataUrl ? (
    <img src={dataUrl} alt={name} className="block w-3/5 h-3/5 object-contain" />
  ) : (
    <PlaceholderTile />
  );
}

// Mini preview of a handyarrows arrow on the root Arrows card.
function HandyArrowPreviewTile({ name }: { name: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchArrowSvg('handyarrows', name)
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, '#94a3b8')));
      })
      .catch(() => {
        // Tile stays as the placeholder dot on failure.
      });
    return () => {
      active = false;
    };
  }, [name]);
  return dataUrl ? (
    <img src={dataUrl} alt={name} className="block w-3/5 h-3/5 object-contain" />
  ) : (
    <PlaceholderTile />
  );
}

// Tiny tile that fetches a single Lucide icon and renders it as a preview.
// Used inside category cards on the root view.
function LucidePreviewTile({ name }: { name: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchIconSvg(name)
      .then((svg) => {
        if (active) setDataUrl(svgToDataUrl(recolorLucideSvg(svg, '#94a3b8')));
      })
      .catch(() => {
        // Tile stays as the placeholder dot on failure.
      });
    return () => {
      active = false;
    };
  }, [name]);
  return dataUrl ? (
    <img src={dataUrl} alt={name} className="block w-3/5 h-3/5 object-contain" />
  ) : (
    <PlaceholderTile />
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
