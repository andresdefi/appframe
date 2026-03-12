import { test, expect } from '@playwright/test';
import {
  waitForApp, sidebar, sidebarPanel, preview, modeToggle,
  switchToIndividual, switchToPanoramic, getSectionTitles,
  expandSection, expandAllSections,
} from './helpers';

// ─── Navigation ───

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
    await switchToIndividual(page);
  });

  test('app loads with sidebar and preview', async ({ page }) => {
    await expect(sidebar(page)).toBeVisible();
    await expect(preview(page)).toBeVisible();
    const iframes = page.locator('iframe');
    expect(await iframes.count()).toBeGreaterThanOrEqual(1);
  });

  test('individual mode shows expected sections', async ({ page }) => {
    const titles = await getSectionTitles(page);
    for (const expected of ['Background', 'Platform', 'Text', 'Spotlight / Dimming', 'Export']) {
      expect(titles, `Should contain "${expected}" section`).toContain(expected);
    }
  });

  test('all sections are expandable', async ({ page }) => {
    const panel = sidebarPanel(page);
    const sections = panel.locator('button[aria-expanded]');
    const count = await sections.count();
    expect(count).toBeGreaterThan(5);
    // Expand one and verify content appears
    await expandSection(page, 'Background');
    await expect(panel.locator('input[type="radio"][name="bg-type"]').first()).toBeVisible();
  });

  test('switching to panoramic shows panoramic sections', async ({ page }) => {
    await switchToPanoramic(page);
    const titles = await getSectionTitles(page);
    expect(titles).toContain('Canvas');
    expect(titles).toContain('Spotlight / Dimming');
    expect(titles).toContain('Export');
  });

  test('switching back to individual restores individual sections', async ({ page }) => {
    await switchToPanoramic(page);
    await switchToIndividual(page);
    const titles = await getSectionTitles(page);
    expect(titles).toContain('Background');
    expect(titles).toContain('Platform');
    expect(titles).toContain('Text');
  });
});

// ─── Individual Mode Controls ───

test.describe('Individual Mode', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
    await switchToIndividual(page);
  });

  test('Background section has 4 type options', async ({ page }) => {
    await expandSection(page, 'Background');
    const radios = sidebarPanel(page).locator('input[type="radio"][name="bg-type"]');
    await expect(radios).toHaveCount(4);
  });

  test('Device sections have at least one select', async ({ page }) => {
    await expandAllSections(page);
    const selects = sidebarPanel(page).locator('select');
    expect(await selects.count()).toBeGreaterThanOrEqual(1);
  });

  test('Text section has headline input', async ({ page }) => {
    await expandSection(page, 'Text');
    const inputs = sidebarPanel(page).locator('textarea, input[type="text"]');
    expect(await inputs.count()).toBeGreaterThanOrEqual(1);
  });

  test('Effects section has spotlight toggle', async ({ page }) => {
    await expandSection(page, 'Spotlight / Dimming');
    await expect(sidebarPanel(page).locator('label').filter({ hasText: 'Enable Spotlight' })).toBeVisible();
  });

  test('Export section has output size selector', async ({ page }) => {
    await expandSection(page, 'Export');
    await expect(sidebarPanel(page).locator('label', { hasText: 'Output Size' })).toBeVisible();
  });

  test('zoom slider exists in preview area', async ({ page }) => {
    await expect(preview(page).locator('input[type="range"]')).toBeVisible();
  });

  test('adding a screen creates a new iframe', async ({ page }) => {
    const before = await page.locator('iframe').count();
    await page.locator('button').filter({ hasText: '+ Add Screen' }).click();
    await page.waitForTimeout(1500);
    const after = await page.locator('iframe').count();
    expect(after).toBe(before + 1);
  });
});

// ─── Panoramic Mode Controls ───

test.describe('Panoramic Mode', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
    await switchToPanoramic(page);
  });

  test('Canvas section shows Platform and Frame Count', async ({ page }) => {
    await expandSection(page, 'Canvas');
    const panel = sidebarPanel(page);
    await expect(panel.locator('text=Platform')).toBeVisible();
    await expect(panel.locator('text=Frame Count')).toBeVisible();
  });

  test('Background section is visible', async ({ page }) => {
    const titles = await getSectionTitles(page);
    expect(titles).toContain('Background');
  });

  test('frame count slider changes value', async ({ page }) => {
    await expandSection(page, 'Canvas');
    const slider = sidebarPanel(page).locator('text=Frame Count').locator('..').locator('input[type="range"]');
    await slider.fill('3');
    expect(await slider.inputValue()).toBe('3');
  });

  test('Effects sections have spotlight, annotations, overlays', async ({ page }) => {
    const titles = await getSectionTitles(page);
    expect(titles.some((t) => t.includes('Spotlight'))).toBe(true);
    expect(titles).toContain('Annotations');
    expect(titles).toContain('Overlays');
  });

  test('Export section has panoramic export buttons', async ({ page }) => {
    await expandSection(page, 'Export');
    const panel = sidebarPanel(page);
    await expect(panel.locator('button').filter({ hasText: /Export All/ })).toBeVisible();
    await expect(panel.locator('button').filter({ hasText: 'Export Full Canvas' })).toBeVisible();
  });

  test('panoramic preview has zoom slider', async ({ page }) => {
    await expect(preview(page).locator('input[type="range"]')).toBeVisible();
  });
});

// ─── Preview Updates ───

test.describe('Preview Responsiveness', () => {
  test('individual: changing bg type triggers preview update', async ({ page }) => {
    await waitForApp(page);
    await switchToIndividual(page);
    await expandSection(page, 'Background');

    const resp = page.waitForResponse(
      (r) => r.url().includes('/api/preview-html') && r.status() === 200,
      { timeout: 10_000 },
    );
    await sidebarPanel(page).locator('input[type="radio"][value="gradient"]').check();
    expect((await resp).status()).toBe(200);
  });

  test('panoramic: changing frame count triggers preview update', async ({ page }) => {
    await waitForApp(page);
    await switchToPanoramic(page);
    await expandSection(page, 'Canvas');

    const slider = sidebarPanel(page).locator('text=Frame Count').locator('..').locator('input[type="range"]');
    const resp = page.waitForResponse(
      (r) => r.url().includes('/api/panoramic-preview-html') && r.status() === 200,
      { timeout: 10_000 },
    );
    await slider.fill('4');
    expect((await resp).status()).toBe(200);
  });
});

// ─── Undo/Redo ───

test.describe('Undo/Redo', () => {
  test.skip('Ctrl+Z undoes a background change', async ({ page }) => {
    await waitForApp(page);
    await switchToIndividual(page);
    await expandSection(page, 'Background');

    // Switch to gradient
    await sidebarPanel(page).locator('label').filter({ hasText: 'Gradient' }).click();
    await page.waitForTimeout(300);

    const gradientRadio = sidebarPanel(page).locator('label').filter({ hasText: 'Gradient' }).locator('input[type="radio"]');
    await expect(gradientRadio).toBeChecked();

    // Undo
    await page.keyboard.press('Meta+z');
    await page.waitForTimeout(300);

    const solidRadio = sidebarPanel(page).locator('label').filter({ hasText: 'Solid' }).locator('input[type="radio"]');
    await expect(solidRadio).toBeChecked();
  });
});
