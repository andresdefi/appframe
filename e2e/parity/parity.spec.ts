import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import {
  loadIndividualFixtures,
  loadPanoramicFixtures,
  mountFixture,
  type FixtureMeta,
} from './helpers';

// Snapshot harness for the shadow-DOM preview path.
// See docs/parent-doc-rendering-plan.md. The iframe alternative
// existed through Phase 6 alongside shadow; Phase 7 removed it.

const SNAPSHOT_DIR = fileURLToPath(new URL('./snapshots', import.meta.url));
mkdirSync(SNAPSHOT_DIR, { recursive: true });

const individualFixtures = loadIndividualFixtures();
const panoramicFixtures = loadPanoramicFixtures();

test.describe('parity / shadow backend', () => {
  for (const fixture of [...individualFixtures, ...panoramicFixtures]) {
    test(`${fixture.name}`, async ({ page, baseURL }, testInfo) => {
      if (!baseURL) throw new Error('baseURL must be set in playwright.config.ts');
      await runFixture(page, fixture, baseURL, testInfo);
    });
  }
});

async function runFixture(
  page: import('@playwright/test').Page,
  fixture: FixtureMeta,
  baseURL: string,
  testInfo: import('@playwright/test').TestInfo,
) {
  const { iframeSelector } = await mountFixture(page, fixture, baseURL);

  const handle = await page.locator(iframeSelector).elementHandle();
  if (!handle) throw new Error('preview host disappeared between mount and screenshot');

  const buffer = await handle.screenshot({ type: 'png' });
  expect(buffer.byteLength).toBeGreaterThan(500);

  await testInfo.attach(`${fixture.name}.png`, {
    body: buffer,
    contentType: 'image/png',
  });

  const fs = await import('node:fs/promises');
  await fs.writeFile(join(SNAPSHOT_DIR, `${fixture.name}.png`), buffer);
}
