import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import {
  loadIndividualFixtures,
  loadPanoramicFixtures,
  mountFixture,
  type FixtureMeta,
  type PreviewBackend,
} from './helpers';

// Parity harness for the parent-document rendering migration (Option C).
// See docs/parent-doc-rendering-plan.md §"Parity Testing First".
//
// Phase 0: only the iframe backend is exercised. The shadow backend lands
// in Phase 3 — tests that target it are currently skipped with a TODO so
// the harness shape is ready when the renderer arrives.

const BACKENDS: PreviewBackend[] = ['iframe', 'shadow'];

const SNAPSHOT_DIR = fileURLToPath(new URL('./snapshots', import.meta.url));
mkdirSync(join(SNAPSHOT_DIR, 'iframe'), { recursive: true });
mkdirSync(join(SNAPSHOT_DIR, 'shadow'), { recursive: true });

const individualFixtures = loadIndividualFixtures();
const panoramicFixtures = loadPanoramicFixtures();

for (const backend of BACKENDS) {
  test.describe(`parity / ${backend} backend`, () => {
    for (const fixture of [...individualFixtures, ...panoramicFixtures]) {
      const title = `${fixture.name}`;
      test(title, async ({ page, baseURL }, testInfo) => {
        // Phase 3 lands the shadow backend for individual mode only.
        // Panoramic stays on iframe until Phase 5.
        if (backend === 'shadow' && fixture.endpoint === '/api/panoramic-preview-html') {
          test.skip(true, 'panoramic shadow backend lands in Phase 5');
          return;
        }
        if (!baseURL) throw new Error('baseURL must be set in playwright.config.ts');

        await runFixture(page, fixture, backend, baseURL, testInfo);
      });
    }
  });
}

async function runFixture(
  page: import('@playwright/test').Page,
  fixture: FixtureMeta,
  backend: PreviewBackend,
  baseURL: string,
  testInfo: import('@playwright/test').TestInfo,
) {
  const { iframeSelector } = await mountFixture(page, fixture, backend, baseURL);

  const handle = await page.locator(iframeSelector).elementHandle();
  if (!handle) throw new Error('preview iframe disappeared between mount and screenshot');

  const buffer = await handle.screenshot({ type: 'png' });
  expect(buffer.byteLength).toBeGreaterThan(500);

  await testInfo.attach(`${backend}-${fixture.name}.png`, {
    body: buffer,
    contentType: 'image/png',
  });

  // Also persist next to the spec so it's easy to diff manually before
  // the pixelmatch harness lands. Per-backend subfolder keeps phase-3
  // diffing trivial (iframe/<name>.png vs shadow/<name>.png).
  const fs = await import('node:fs/promises');
  await fs.writeFile(join(SNAPSHOT_DIR, backend, `${fixture.name}.png`), buffer);
}
