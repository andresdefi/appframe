#!/usr/bin/env node
/**
 * Downloads the handyarrows.com hand-drawn arrow set (185 SVGs,
 * CC-BY 4.0 by Eren Cana Arica) into packages/web-preview/data/arrows/
 * handyarrows/. Re-run if upstream adds new arrows or to refresh the
 * snapshot.
 *
 * Usage:
 *   node scripts/sync-handyarrows.mjs
 *
 * Attribution requirement (CC-BY 4.0): the Arrows picker in
 * appframe must surface credit to Eren Cana Arica with a link to
 * handyarrows.com. See packages/web-preview/src/client/components/
 * Sidebar/ElementsTab.tsx for the displayed attribution.
 */
import { mkdirSync, writeFileSync, statSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DIR = join(
  REPO_ROOT,
  'packages',
  'web-preview',
  'data',
  'arrows',
  'handyarrows',
);
const BASE_URL = 'https://handyarrows.com/static/arrows';
// Snapshot count — verified by probing the site at sync time. The
// landing page lists more image refs than actually resolve, so we cap
// at the highest known-good ID. Future runs may need to bump this if
// upstream adds new arrows; the script will simply skip any 404s.
const EXPECTED_COUNT = 140;

mkdirSync(OUT_DIR, { recursive: true });

function alreadyDownloaded(idx) {
  const path = join(OUT_DIR, `arrow-${idx}.svg`);
  return existsSync(path) && statSync(path).size > 0;
}

async function tryUrl(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  if (!text.includes('<svg')) return null;
  return text;
}

// handyarrows.com SVGs are inconsistent: some use fill="currentColor"
// (recolorable as-is), others bake in fill="black"/stroke="black". Normalize
// the latter to currentColor so the recolour pipeline in ElementsTab works
// uniformly across the whole set.
function normalizeColors(svg) {
  return svg
    .replaceAll('fill="black"', 'fill="currentColor"')
    .replaceAll("fill='black'", "fill='currentColor'")
    .replaceAll('stroke="black"', 'stroke="currentColor"')
    .replaceAll("stroke='black'", "stroke='currentColor'");
}

async function downloadOne(idx) {
  // handyarrows.com uses two URL patterns: "arrow-N.svg" for the first
  // 45 and "N.svg" for 46–185. Try both so we don't miss either set.
  const candidates = [
    `${BASE_URL}/arrow-${idx}.svg`,
    `${BASE_URL}/${idx}.svg`,
  ];
  for (const url of candidates) {
    const svg = await tryUrl(url);
    if (svg) {
      writeFileSync(join(OUT_DIR, `arrow-${idx}.svg`), normalizeColors(svg));
      return { idx, ok: true };
    }
  }
  return { idx, ok: false, status: '404' };
}

async function run() {
  console.log(`Syncing ${EXPECTED_COUNT} arrows to ${OUT_DIR}`);
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  for (let i = 1; i <= EXPECTED_COUNT; i++) {
    if (alreadyDownloaded(i)) {
      skipped++;
      continue;
    }
    const result = await downloadOne(i);
    if (result.ok) {
      downloaded++;
      if (downloaded % 25 === 0) console.log(`  ${downloaded} downloaded…`);
    } else {
      failed++;
      console.warn(`  arrow-${i} skipped (${result.status})`);
    }
  }
  const total = readdirSync(OUT_DIR).filter((f) => f.endsWith('.svg')).length;
  console.log(`Done. ${downloaded} new, ${skipped} already present, ${failed} failed.`);
  console.log(`${total} SVGs total in ${OUT_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
