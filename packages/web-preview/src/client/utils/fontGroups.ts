import type { FontData } from '../store';

const CATEGORY_LABELS: Record<string, string> = {
  'sans-serif': 'Sans Serif',
  'serif': 'Serif',
  'display': 'Display',
};

const CATEGORY_ORDER = ['sans-serif', 'serif', 'display'];

export function buildFontGroups(fonts: FontData[]) {
  const grouped: Record<string, { value: string; label: string }[]> = {};
  for (const f of fonts) {
    const cat = f.category ?? 'sans-serif';
    const list = grouped[cat] ?? [];
    list.push({ value: f.id, label: f.name });
    grouped[cat] = list;
  }
  return CATEGORY_ORDER
    .filter((cat) => grouped[cat]?.length)
    .map((cat) => ({
      label: CATEGORY_LABELS[cat] ?? cat,
      options: grouped[cat]!,
    }));
}
