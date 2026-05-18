import type { Overlay } from '../../../types';

export function nextId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export type CategoryId = 'shapes' | 'arrows' | 'icons' | 'decor' | 'blobs' | 'stars';

export interface CatalogItem {
  id: string;
  label: string;
  preview: JSX.Element;
  build: () => Partial<Overlay>;
}

// Shared base for a new overlay (position, rotation, opacity). Catalog
// items override `size` (raw px) and type-specific config.
export const OVERLAY_BASE: Omit<Overlay, 'id' | 'type'> = {
  x: 45,
  y: 45,
  size: 100,
  rotation: 0,
  opacity: 1,
};

// ---------- Icons category (Lucide via /api/elements/icons) ----------

export interface IconEntry {
  name: string;
  tags: string[];
}

export interface CategoryMeta {
  id: string;
  title: string;
}

export interface CategoriesPayload {
  categories: CategoryMeta[];
  iconCategories: Record<string, string[]>;
}

let cachedCategoriesPayload: CategoriesPayload | null = null;

export async function fetchIconCategories(): Promise<CategoriesPayload> {
  if (cachedCategoriesPayload) return cachedCategoriesPayload;
  const res = await fetch('/api/elements/icons/categories');
  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
  cachedCategoriesPayload = (await res.json()) as CategoriesPayload;
  return cachedCategoriesPayload;
}

export function getCachedCategoriesPayload(): CategoriesPayload | null {
  return cachedCategoriesPayload;
}

let cachedCatalog: IconEntry[] | null = null;
const svgFetchCache = new Map<string, Promise<string>>();

export async function fetchIconCatalog(): Promise<IconEntry[]> {
  if (cachedCatalog) return cachedCatalog;
  const res = await fetch('/api/elements/icons/catalog');
  if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`);
  const json = await res.json();
  cachedCatalog = (json.icons ?? []) as IconEntry[];
  return cachedCatalog;
}

export function getCachedCatalog(): IconEntry[] | null {
  return cachedCatalog;
}

export function fetchIconSvg(name: string): Promise<string> {
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
export function recolorLucideSvg(svg: string, color: string): string {
  return svg.replaceAll('currentColor', color);
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ---------- Geometric shape primitives (Shapes category) ----------
// Regular polygons + a handful of common decorative primitives, all
// generated from math. No asset files — the SVG is the same shape on every
// call, so quality control is trivial. Each generator returns the SVG
// markup inside a 100×100 viewBox; the wrapper applies the chosen colour.

export function regularPolygonPoints(sides: number, rotateDeg = -90, radius = 45): string {
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

export function starPoints(points: number, outerR = 45, innerR = 20): string {
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

export interface ShapeDef {
  id: string;
  label: string;
  inner: () => string;
}

export const SHAPE_LIBRARY: ShapeDef[] = [
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
    inner: () => `<polygon points="5,20 70,20 95,50 70,80 5,80"/>`,
  },
];

export const SHAPE_LIBRARY_BY_ID: Record<string, ShapeDef> = Object.fromEntries(
  SHAPE_LIBRARY.map((s) => [s.id, s]),
);

export function buildShapeSvg(id: string, color: string): string | null {
  const def = SHAPE_LIBRARY_BY_ID[id];
  if (!def) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="${color}">${def.inner()}</svg>`;
}

// ---------- Arrows category (curated SVG packs) ----------

export interface ArrowEntry {
  name: string;
  v: number; // Cache-bust version stamp (file mtime), from catalog.
}

export interface ArrowSourceDef {
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

export async function fetchArrowsCatalog(): Promise<ArrowSourceDef[]> {
  if (cachedArrowsCatalog) return cachedArrowsCatalog;
  const res = await fetch('/api/elements/arrows/catalog');
  if (!res.ok) throw new Error(`Arrows catalog fetch failed: ${res.status}`);
  const json = await res.json();
  const sources = (json.sources ?? []) as ArrowSourceDef[];
  cachedArrowsCatalog = sources;
  for (const src of sources) {
    for (const entry of src.arrows) {
      arrowVersionMap.set(`${src.id}/${entry.name}`, entry.v);
    }
  }
  return sources;
}

export function getCachedArrowsCatalog(): ArrowSourceDef[] | null {
  return cachedArrowsCatalog;
}

export function fetchArrowSvg(source: string, name: string): Promise<string> {
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

// ---------- Blobs category (curated SVG packs) ----------

export interface BlobEntry {
  name: string;
  v: number;
}

export interface BlobSourceDef {
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

export async function fetchBlobsCatalog(): Promise<BlobSourceDef[]> {
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

export function getCachedBlobsCatalog(): BlobSourceDef[] | null {
  return cachedBlobsCatalog;
}

export function fetchBlobSvg(source: string, name: string): Promise<string> {
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

export function titleForOverlay(ov: Overlay, idx: number): string {
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
