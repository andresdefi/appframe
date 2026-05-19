import { test, expect } from '@playwright/test';
import { waitForApp, switchToIndividual } from './helpers';

// Guards the client-side export path. Background: a recent change
// swapped modern-screenshot's domToPng for domToBlob in clientExport.ts
// and the export silently hung on the first "Rendering..." status —
// nothing in lint / typecheck / vitest caught it because the bug lives
// in browser DOM/canvas code. This spec drives the actual Download
// button to ground future changes to that path against a real Chromium.

test.describe('Export', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
    await switchToIndividual(page);
  });

  test('Download all N screens produces a ZIP', async ({ page }) => {
    // Switch to the Download tab — the export controls live there.
    await page.getByRole('button', { name: 'Download' }).first().click();

    // The big primary action is "Download all N screens" (single locale)
    // or "Download X screens (Y locales)" when multiple locales are
    // checked. Match either shape so the test survives whatever locale
    // state the editor loaded with.
    const downloadButton = page
      .getByRole('button', {
        name: /Download (all \d+ screens?|\d+ screens? \(\d+ locales?\))/,
      })
      .first();
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toBeEnabled();

    // The export pipeline is fully client-side now (modern-screenshot
    // rasterizing the iframe), so the deliverable is a browser
    // `download` event — not an HTTP response — for a `.zip`.
    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });
});
