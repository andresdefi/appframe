// Filename slug for downloaded ZIPs and single-screen PNGs. Always
// leads with the project identity; appends the active variant's slug
// only when there are 2+ variants — i.e. only when there's actually
// something to disambiguate. New projects ship with a single auto-
// generated "Concept A" variant (see store.ts initScreens), so without
// this rule every export would carry a meaningless "-concept-a"
// suffix.

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'variant';
}

export function composeExportSlug(
  projectDisplayName: string | null | undefined,
  activeVariantName: string | null | undefined,
  variantCount: number,
): string {
  const projectSlug = slugify(projectDisplayName || 'project');
  if (!activeVariantName || variantCount <= 1) return projectSlug;
  return `${projectSlug}-${slugify(activeVariantName)}`;
}
