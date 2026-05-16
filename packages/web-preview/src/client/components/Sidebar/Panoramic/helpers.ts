import type { DeviceFamily, FrameData } from '../../../store';
import type { PanoramicBackgroundLayer, PanoramicElement } from '../../../types';

export const ELEMENT_TYPE_LABELS: Record<string, string> = {
  device: 'Device',
  text: 'Text',
  label: 'Label',
  decoration: 'Decoration',
  image: 'Image',
  logo: 'Logo',
  crop: 'Crop',
  card: 'Card',
  badge: 'Badge',
  'proof-chip': 'Proof Chip',
  group: 'Group',
};

export const BLEND_MODE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'darken', label: 'Darken' },
] as const;

export const PLATFORM_OPTIONS = [
  { value: 'iphone', label: 'iPhone' },
  { value: 'ipad', label: 'iPad' },
  { value: 'mac', label: 'Mac' },
  { value: 'watch', label: 'Apple Watch' },
  { value: 'android', label: 'Android' },
];

const PLATFORM_CATEGORIES: Record<string, string[]> = {
  iphone: ['iphone'],
  android: ['iphone'],
  ipad: ['ipad'],
  mac: ['mac'],
  watch: ['watch'],
};

const PLATFORM_SVG_TAGS: Record<string, string[]> = {
  iphone: ['default-ios', 'default-android'],
  android: ['default-ios', 'default-android'],
  ipad: ['default-ipad', 'fallback-tablet'],
  mac: [],
  watch: [],
};

export function buildFrameGroups(
  deviceFamilies: DeviceFamily[],
  frames: FrameData[],
  platform?: string,
) {
  const allowedCategories = platform ? (PLATFORM_CATEGORIES[platform] ?? ['iphone']) : null;
  const allowedSvgTags = platform ? (PLATFORM_SVG_TAGS[platform] ?? []) : null;

  const grouped: Record<string, { value: string; label: string }[]> = {};
  for (const f of deviceFamilies) {
    const cat = f.category || 'other';
    if (allowedCategories && !allowedCategories.includes(cat)) continue;
    const list = grouped[cat] ?? [];
    list.push({ value: f.id, label: f.name });
    grouped[cat] = list;
  }
  const groups = Object.entries(grouped).map(([label, options]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    options,
  }));

  const svgFrames: { value: string; label: string }[] = [];
  for (const fr of frames) {
    if (allowedSvgTags && allowedSvgTags.length > 0) {
      const frameTags = fr.tags ?? [];
      if (!frameTags.some((t) => allowedSvgTags.includes(t))) continue;
    } else if (allowedSvgTags && allowedSvgTags.length === 0) {
      continue;
    }
    svgFrames.push({ value: fr.id, label: fr.name });
  }
  if (svgFrames.length > 0) {
    groups.push({ label: 'SVG Frames', options: svgFrames });
  }
  return groups;
}

/**
 * Compute the sorted index for an element (since the template sorts by z-index).
 * This maps the store's element index to the data-index in the rendered HTML.
 */
export function getSortedIndex(elements: PanoramicElement[], storeIndex: number): number {
  const sorted = elements.map((el, i) => ({ z: el.z, i })).sort((a, b) => a.z - b.z);
  return sorted.findIndex((s) => s.i === storeIndex);
}

export function getElementSummary(element: PanoramicElement): string | null {
  if (element.type === 'text' || element.type === 'label') {
    return element.content.slice(0, 20);
  }
  if (element.type === 'badge') {
    return element.content.slice(0, 20);
  }
  if (element.type === 'proof-chip') {
    return element.value.slice(0, 20);
  }
  if (element.type === 'card') {
    return (element.title ?? element.body ?? 'Card').slice(0, 20);
  }
  if (element.type === 'logo') {
    return 'Brand mark';
  }
  if (element.type === 'group') {
    return `${element.children.length} items`;
  }
  return null;
}

export function buildDefaultGroupElement(
  screenshot: string,
  x: number,
  y: number,
  rotation: number,
): PanoramicElement {
  return {
    type: 'group',
    x,
    y,
    width: 18,
    height: 28,
    rotation,
    opacity: 1,
    z: 8,
    children: [
      {
        type: 'crop',
        screenshot,
        x: 0,
        y: 0,
        width: 100,
        height: 62,
        focusX: 50,
        focusY: 40,
        zoom: 1.6,
        rotation: rotation > 0 ? -6 : 6,
        borderRadius: 24,
        z: 1,
      },
      {
        type: 'card',
        x: 10,
        y: 54,
        width: 82,
        height: 36,
        eyebrow: 'Highlight',
        title: 'Support detail',
        body: 'Grouped proof card.',
        align: 'left',
        backgroundColor: '#FFFFFF',
        opacity: 0.96,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 24,
        padding: 2,
        rotation: 0,
        eyebrowColor: '#64748B',
        titleColor: '#0F172A',
        bodyColor: '#475569',
        eyebrowSize: 3.5,
        titleSize: 7.5,
        bodySize: 4.2,
        z: 2,
      },
    ],
  };
}

export function getBackgroundLayerLabel(layer: PanoramicBackgroundLayer): string {
  switch (layer.kind) {
    case 'gradient':
      return layer.gradientType === 'mesh' ? 'Mesh Gradient' : `${layer.gradientType} Gradient`;
    case 'image':
      return layer.fit === 'tile' ? 'Texture Layer' : 'Image Layer';
    case 'glow':
      return 'Glow Layer';
    case 'solid':
      return 'Solid Layer';
  }
}
