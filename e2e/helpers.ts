import type { Page, Locator } from '@playwright/test';

// ─── Layout selectors ───

/** The sidebar panel (left 320px column) */
export function sidebar(page: Page): Locator {
  return page.locator('.w-80');
}

/** The scrollable content area inside the sidebar */
export function sidebarPanel(page: Page): Locator {
  return sidebar(page).locator('.overflow-y-auto');
}

/** The preview area (right side) */
export function preview(page: Page): Locator {
  // The preview is the sibling of the sidebar
  return page.locator('.flex-1.flex.flex-col.overflow-hidden');
}

/** The mode toggle button in the header ("Individual" or "Panoramic") */
export function modeToggle(page: Page): Locator {
  return page.locator('button[title="Switch to Individual"], button[title="Switch to Panoramic"]');
}

// ─── Navigation helpers ───

/** Wait for the preview server to be fully loaded */
export async function waitForApp(page: Page) {
  await page.goto('/');
  await page.locator('h1').filter({ hasText: 'appframe' }).waitFor({ timeout: 10_000 });
  await page.locator('iframe').first().waitFor({ state: 'attached', timeout: 10_000 });
}

/** Get the current mode ("Individual" or "Panoramic") */
export async function getCurrentMode(page: Page): Promise<string> {
  const currentMode = await modeToggle(page).getAttribute('data-current-mode');
  return currentMode?.trim() ?? '';
}

/** Switch to individual mode (no-op if already there) */
export async function switchToIndividual(page: Page) {
  const current = await getCurrentMode(page);
  if (current === 'panoramic') {
    await modeToggle(page).click();
    await page.waitForTimeout(500);
  }
}

/** Switch to panoramic mode (no-op if already there) */
export async function switchToPanoramic(page: Page) {
  const current = await getCurrentMode(page);
  if (current === 'individual') {
    await modeToggle(page).click();
    await page.waitForTimeout(500);
  }
}

// ─── Section helpers ───

/** Get all section titles in the sidebar panel */
export async function getSectionTitles(page: Page): Promise<string[]> {
  const panel = sidebarPanel(page);
  const titles: string[] = [];
  const titleEls = panel.locator('button[aria-expanded] > .text-\\[12px\\]');
  const count = await titleEls.count();
  for (let i = 0; i < count; i++) {
    const text = await titleEls.nth(i).textContent().catch(() => '');
    if (text?.trim() && !titles.includes(text.trim())) {
      titles.push(text.trim());
    }
  }
  return titles;
}

/** Expand a specific section by its title (no-op if already expanded) */
export async function expandSection(page: Page, title: string) {
  const panel = sidebarPanel(page);
  const button = panel.locator('button[aria-expanded]').filter({ hasText: title }).first();
  const expanded = await button.getAttribute('aria-expanded');
  if (expanded === 'false') {
    await button.click();
    await page.waitForTimeout(250);
  }
}

/** Expand all collapsed sections in the current sidebar panel */
export async function expandAllSections(page: Page) {
  const panel = sidebarPanel(page);
  const collapsed = panel.locator('button[aria-expanded="false"]');
  const count = await collapsed.count();
  for (let i = 0; i < count; i++) {
    await collapsed.nth(0).click();
    await page.waitForTimeout(50);
  }
}

// ─── Control interaction helpers ───

/** Get a slider input by its label text */
export function getSlider(panel: Locator, label: string): Locator {
  return panel.locator(`text="${label}"`).locator('..').locator('input[type="range"]');
}

// ─── Audit helpers ───

/** Audit the controls in the current sidebar panel (expands all sections first) */
export async function auditPanel(page: Page) {
  await expandAllSections(page);
  const panel = sidebarPanel(page);

  const counts = {
    sliders: await panel.locator('input[type="range"]').count(),
    selects: await panel.locator('select').count(),
    checkboxes: await panel.locator('input[type="checkbox"]').count(),
    colorPickers: await panel.locator('input[type="color"]').count(),
    radios: await panel.locator('input[type="radio"]').count(),
    textInputs: await panel.locator('textarea, input[type="text"]').count(),
    buttons: await panel.locator('button').count(),
  };

  // Count unlabeled sliders
  const sliders = panel.locator('input[type="range"]');
  let unlabeledSliders = 0;
  for (let i = 0; i < counts.sliders; i++) {
    const parent = sliders.nth(i).locator('..');
    const text = await parent.locator('span').first().textContent().catch(() => '');
    if (!text?.trim()) unlabeledSliders++;
  }

  // Collect section titles from collapsible card headers
  const sectionTitles: string[] = [];
  const titleEls = panel.locator('button[aria-expanded] > .text-\\[12px\\]');
  const titleCount = await titleEls.count();
  for (let i = 0; i < titleCount; i++) {
    const text = await titleEls.nth(i).textContent().catch(() => '');
    if (text?.trim() && !sectionTitles.includes(text.trim())) {
      sectionTitles.push(text.trim());
    }
  }

  return { counts, unlabeledSliders, sectionTitles };
}

/** Collect slider ranges from the current panel (expands all sections first) */
export async function collectSliderRanges(page: Page): Promise<Record<string, { min: string; max: string; value: string }>> {
  await expandAllSections(page);
  const panel = sidebarPanel(page);
  const sliders = panel.locator('input[type="range"]');
  const ranges: Record<string, { min: string; max: string; value: string }> = {};

  const count = await sliders.count();
  for (let i = 0; i < count; i++) {
    const slider = sliders.nth(i);
    const parent = slider.locator('..');
    const label = await parent.locator('span').first().textContent().catch(() => `slider-${i}`);
    const min = await slider.getAttribute('min') ?? '?';
    const max = await slider.getAttribute('max') ?? '?';
    const value = await slider.inputValue();
    ranges[label?.trim() ?? `slider-${i}`] = { min, max, value };
  }
  return ranges;
}

/** Measure preview update latency for an action */
export async function measurePreviewLatency(
  page: Page,
  action: () => Promise<void>,
): Promise<number> {
  const start = Date.now();
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes('/api/preview-html') || r.url().includes('/api/panoramic-preview-html'),
    { timeout: 10_000 },
  );
  await action();
  await responsePromise;
  return Date.now() - start;
}
