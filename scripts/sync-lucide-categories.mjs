#!/usr/bin/env node
/**
 * Regenerates packages/web-preview/src/server-data/lucide-categories.json
 * from the Lucide GitHub repo. Re-run when bumping lucide-static so the
 * icon picker's category filters stay aligned with upstream Lucide.
 *
 * Usage:
 *   node scripts/sync-lucide-categories.mjs
 */
import { mkdtempSync, readFileSync, readdirSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(
  REPO_ROOT,
  'packages',
  'web-preview',
  'src',
  'server-data',
  'lucide-categories.json',
);
const TARBALL_URL = 'https://github.com/lucide-icons/lucide/archive/refs/heads/main.tar.gz';

function run(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited with status ${result.status}`);
  }
}

const tmp = mkdtempSync(join(tmpdir(), 'lucide-sync-'));
try {
  console.log(`Downloading ${TARBALL_URL}…`);
  run('curl', ['-sL', TARBALL_URL, '-o', join(tmp, 'lucide.tar.gz')]);
  run('tar', ['-xzf', join(tmp, 'lucide.tar.gz'), '-C', tmp]);

  const repoDir = join(tmp, 'lucide-main');
  const iconsDir = join(repoDir, 'icons');
  const catsDir = join(repoDir, 'categories');

  const categories = [];
  for (const file of readdirSync(catsDir).filter((n) => n.endsWith('.json'))) {
    const json = JSON.parse(readFileSync(join(catsDir, file), 'utf-8'));
    categories.push({ id: file.replace(/\.json$/, ''), title: json.title });
  }

  const iconCategories = {};
  for (const file of readdirSync(iconsDir).filter((n) => n.endsWith('.json'))) {
    const name = file.replace(/\.json$/, '');
    const json = JSON.parse(readFileSync(join(iconsDir, file), 'utf-8'));
    iconCategories[name] = json.categories || [];
  }

  const out = { categories, iconCategories };
  writeFileSync(OUTPUT_PATH, JSON.stringify(out));
  const size = (statSync(OUTPUT_PATH).size / 1024).toFixed(1);
  console.log(`Wrote ${OUTPUT_PATH} (${size} KB)`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Icons indexed: ${Object.keys(iconCategories).length}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
