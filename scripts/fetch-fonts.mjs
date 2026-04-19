#!/usr/bin/env node
// Fetches proper static per-weight woff2 files from the @fontsource CDN (jsDelivr).
// Loader parses weight from filename via keyword match, so output pattern is:
//   fonts/<id>/<id>-<weightname>[-italic].woff2
// Hubot Sans isn't on fontsource — fetched separately from its GitHub release.

import { mkdir, rm, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const WEIGHT_NAMES = {
  100: 'thin',
  200: 'extralight',
  300: 'light',
  400: 'regular',
  500: 'medium',
  600: 'semibold',
  700: 'bold',
  800: 'extrabold',
  900: 'black',
};

const CATALOG = [
  { id: 'inter', weights: [400, 500, 600, 700, 800], italicWeights: [400, 500, 600, 700, 800] },
  { id: 'dm-sans', weights: [400, 500, 600, 700], italicWeights: [400, 500, 600, 700] },
  { id: 'space-grotesk', weights: [400, 500, 700], italicWeights: [] },
  { id: 'instrument-sans', weights: [400, 500, 600, 700], italicWeights: [400, 700] },
  { id: 'bebas-neue', weights: [400], italicWeights: [] },
  { id: 'anton', weights: [400], italicWeights: [] },
  { id: 'archivo-black', weights: [400], italicWeights: [] },
  { id: 'barlow-condensed', weights: [300, 400, 500, 600, 700, 800, 900], italicWeights: [] },
  { id: 'bungee', weights: [400], italicWeights: [] },
  { id: 'ultra', weights: [400], italicWeights: [] },
  { id: 'playfair-display', weights: [400, 500, 600, 700, 800], italicWeights: [400, 500, 600, 700, 800] },
  { id: 'fraunces', weights: [400, 500, 600, 700, 800], italicWeights: [400, 600, 700] },
  { id: 'cormorant-garamond', weights: [300, 400, 500, 600, 700], italicWeights: [400, 600, 700] },
  { id: 'zilla-slab', weights: [400, 500, 600, 700], italicWeights: [] },
  { id: 'fredoka', weights: [400, 500, 600, 700], italicWeights: [] },
  { id: 'jetbrains-mono', weights: [400, 500, 600, 700, 800], italicWeights: [] },
  { id: 'caveat', weights: [400, 500, 600, 700], italicWeights: [] },
  { id: 'dancing-script', weights: [400, 500, 600, 700], italicWeights: [] },
  { id: 'great-vibes', weights: [400], italicWeights: [] },
  { id: 'kalam', weights: [300, 400, 700], italicWeights: [] },
  { id: 'permanent-marker', weights: [400], italicWeights: [] },
  { id: 'luckiest-guy', weights: [400], italicWeights: [] },
  { id: 'caprasimo', weights: [400], italicWeights: [] },
  { id: 'rubik-doodle-shadow', weights: [400], italicWeights: [] },
  { id: 'press-start-2p', weights: [400], italicWeights: [] },
  { id: 'staatliches', weights: [400], italicWeights: [] },
];

const ROOT = new URL('..', import.meta.url).pathname;
const FONTS_DIR = join(ROOT, 'fonts');

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchFontsourceFont({ id, weights, italicWeights }) {
  const dir = join(FONTS_DIR, id);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const tasks = [];
  for (const w of weights) {
    tasks.push({ weight: w, style: 'normal' });
  }
  for (const w of italicWeights) {
    tasks.push({ weight: w, style: 'italic' });
  }

  for (const { weight, style } of tasks) {
    const url = `https://cdn.jsdelivr.net/npm/@fontsource/${id}/files/${id}-latin-${weight}-${style}.woff2`;
    const weightName = WEIGHT_NAMES[weight];
    const filename = style === 'italic' ? `${id}-${weightName}-italic.woff2` : `${id}-${weightName}.woff2`;
    try {
      const buf = await fetchBuf(url);
      await writeFile(join(dir, filename), buf);
      process.stdout.write(`  ${filename} (${buf.length} bytes)\n`);
    } catch (err) {
      process.stdout.write(`  FAIL ${filename}: ${err.message}\n`);
    }
  }
}

async function fetchHubotSans() {
  // Hubot Sans is not on fontsource. Pull static per-weight woff2s from the
  // GitHub release. Repo: github/hubot-sans, static files live at webfonts/.
  const id = 'hubot-sans';
  const dir = join(FONTS_DIR, id);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  // Weight names match FONT_CATALOG entry for hubot-sans: 300..900.
  const weights = [
    [300, 'Light'],
    [400, 'Regular'],
    [500, 'Medium'],
    [600, 'SemiBold'],
    [700, 'Bold'],
    [800, 'ExtraBold'],
    [900, 'Black'],
  ];

  for (const [w, pascal] of weights) {
    const url = `https://cdn.jsdelivr.net/gh/github/hubot-sans/webfonts/HubotSans-${pascal}.woff2`;
    const filename = `${id}-${WEIGHT_NAMES[w]}.woff2`;
    try {
      const buf = await fetchBuf(url);
      await writeFile(join(dir, filename), buf);
      process.stdout.write(`  ${filename} (${buf.length} bytes)\n`);
    } catch (err) {
      process.stdout.write(`  FAIL ${filename}: ${err.message}\n`);
    }
  }
}

async function main() {
  // Clean up any now-orphaned font directories (e.g. Hubot older layout).
  const existing = await readdir(FONTS_DIR).catch(() => []);
  const known = new Set([...CATALOG.map((f) => f.id), 'hubot-sans']);
  for (const entry of existing) {
    if (!known.has(entry)) {
      // Skip — preserve anything unrelated (LICENSE.txt, README, etc.)
      if (!entry.startsWith('.') && !entry.includes('.')) {
        process.stdout.write(`note: orphan dir fonts/${entry} (leaving alone)\n`);
      }
    }
  }

  for (const entry of CATALOG) {
    process.stdout.write(`\n=== ${entry.id} ===\n`);
    await fetchFontsourceFont(entry);
  }

  process.stdout.write(`\n=== hubot-sans (from github/hubot-sans) ===\n`);
  await fetchHubotSans();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
