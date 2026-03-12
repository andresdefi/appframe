/**
 * UX Audit Tests
 *
 * Measures UX quality beyond "does it work?":
 * - Cross-mode feature parity (panoramic vs individual)
 * - Control discoverability and labeling
 * - Interaction latency
 * - Consistency of control patterns
 * - Accessibility basics
 * - Task completion friction
 *
 * Run: pnpm test:ux
 */
import { test, expect } from '@playwright/test';
import {
  waitForApp, sidebar, sidebarPanel, preview, modeToggle,
  switchToIndividual, switchToPanoramic, getSectionTitles,
  expandSection, expandAllSections,
  auditPanel, collectSliderRanges, measurePreviewLatency,
} from './helpers';

// ═══════════════════════════════════════════════════
// CROSS-MODE PARITY
// ═══════════════════════════════════════════════════

test.describe('Cross-Mode Parity', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test('panoramic exposes same core section categories', async ({ page }) => {
    await switchToIndividual(page);
    const indSections = await getSectionTitles(page);

    await switchToPanoramic(page);
    const panSections = await getSectionTitles(page);

    console.log('\n📋 Section Comparison:');
    console.log(`  Individual: ${indSections.join(', ')}`);
    console.log(`  Panoramic:  ${panSections.join(', ')}`);

    // Panoramic must have these core sections
    expect(panSections.some((s) => s.includes('Spotlight'))).toBe(true);
    expect(panSections).toContain('Export');
    expect(panSections).toContain('Canvas');
  });

  test('Background: panoramic has same type options as individual', async ({ page }) => {
    // Individual
    await switchToIndividual(page);
    await expandSection(page, 'Background');
    const indRadios = sidebarPanel(page).locator('input[type="radio"][name="bg-type"]');
    const indTypes: string[] = [];
    for (let i = 0; i < await indRadios.count(); i++) {
      const label = await indRadios.nth(i).locator('..').textContent();
      indTypes.push(label?.trim() ?? '');
    }

    // Panoramic
    await switchToPanoramic(page);
    await expandSection(page, 'Background');
    // Background type radios in panoramic panel
    const panRadioLabels: string[] = [];
    const allRadios = sidebarPanel(page).locator('input[type="radio"]');
    const count = await allRadios.count();
    for (let i = 0; i < count; i++) {
      const val = await allRadios.nth(i).getAttribute('value');
      if (['solid', 'gradient', 'image', 'preset'].includes(val ?? '')) {
        const label = await allRadios.nth(i).locator('..').textContent();
        panRadioLabels.push(label?.trim() ?? '');
      }
    }

    console.log('\n🎨 Background types:');
    console.log(`  Individual: ${indTypes.join(', ')}`);
    console.log(`  Panoramic:  ${panRadioLabels.join(', ')}`);

    for (const type of ['Solid', 'Gradient', 'Image', 'Preset']) {
      const panHas = panRadioLabels.some((t) => t.includes(type));
      expect(panHas, `Panoramic should have "${type}" background type`).toBe(true);
    }
  });

  test('Effects: panoramic covers same core sections as individual', async ({ page }) => {
    await switchToIndividual(page);
    await expandAllSections(page);
    const indAudit = await auditPanel(page);

    await switchToPanoramic(page);
    await expandAllSections(page);
    const panAudit = await auditPanel(page);

    // Filter to effects-related sections
    const effectsSections = ['Spotlight', 'Annotations', 'Overlays'];
    const indEffects = indAudit.sectionTitles.filter((s) => effectsSections.some((e) => s.includes(e)));
    const panEffects = panAudit.sectionTitles.filter((s) => effectsSections.some((e) => s.includes(e)));

    console.log('\n✨ Effects sections:');
    console.log(`  Individual: ${indEffects.join(', ')}`);
    console.log(`  Panoramic:  ${panEffects.join(', ')}`);

    for (const section of effectsSections) {
      const panHas = panAudit.sectionTitles.some((s) => s.includes(section));
      if (!panHas) console.log(`  ⚠️  "${section}" missing in panoramic`);
      expect(panHas, `Panoramic should have "${section}" section`).toBe(true);
    }
  });

  test('Export: both modes have output size selector', async ({ page }) => {
    await switchToIndividual(page);
    await expandSection(page, 'Export');
    const indHas = await sidebarPanel(page).locator('label', { hasText: 'Output Size' }).isVisible();

    await switchToPanoramic(page);
    await expandSection(page, 'Export');
    const panHas = await sidebarPanel(page).locator('label', { hasText: 'Output Size' }).isVisible();

    console.log('\n📦 Export: Output Size present?');
    console.log(`  Individual: ${indHas}  Panoramic: ${panHas}`);

    expect(indHas).toBe(true);
    expect(panHas).toBe(true);
  });
});

// ═══════════════════════════════════════════════════
// CONTROL QUALITY
// ═══════════════════════════════════════════════════

test.describe('Control Quality', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
    await switchToIndividual(page);
  });

  test('every slider has a visible label', async ({ page }) => {
    const issues: string[] = [];

    await expandAllSections(page);
    const sliders = sidebarPanel(page).locator('input[type="range"]');
    const count = await sliders.count();
    for (let i = 0; i < count; i++) {
      const parent = sliders.nth(i).locator('..');
      const text = await parent.locator('span').first().textContent().catch(() => '');
      if (!text?.trim()) {
        issues.push(`slider #${i + 1} has no label`);
      }
    }

    console.log('\n🏷️  Slider labels:');
    if (issues.length === 0) console.log('  ✅ All sliders labeled');
    else issues.forEach((i) => console.log(`  ⚠️  ${i}`));
    expect(issues).toHaveLength(0);
  });

  test('sidebar has multiple titled sections', async ({ page }) => {
    const titles = await getSectionTitles(page);

    console.log('\n📑 Sections in individual mode:');
    console.log(`  ${titles.join(', ')}`);

    // Should have sections from all former "tabs"
    expect(titles.length, 'Should have many sections').toBeGreaterThan(5);
    expect(titles).toContain('Background');
    expect(titles).toContain('Platform');
    expect(titles).toContain('Text');
    expect(titles.some((t) => t.includes('Spotlight'))).toBe(true);
    expect(titles).toContain('Export');
  });

  test('slider ranges are reasonable', async ({ page }) => {
    await expandAllSections(page);
    const ranges = await collectSliderRanges(page);

    console.log('\n📏 Slider ranges:');
    for (const [label, r] of Object.entries(ranges)) {
      const span = parseFloat(r.max) - parseFloat(r.min);
      const flag = span > 1000 ? ' ⚠️  WIDE' : '';
      console.log(`  ${label}: ${r.min}–${r.max} (val: ${r.value})${flag}`);
    }
  });
});

// ═══════════════════════════════════════════════════
// PERFORMANCE
// ═══════════════════════════════════════════════════

test.describe('Performance', () => {
  test('individual preview responds < 2s', async ({ page }) => {
    await waitForApp(page);
    await switchToIndividual(page);
    await expandSection(page, 'Background');

    const elapsed = await measurePreviewLatency(page, async () => {
      await sidebarPanel(page).locator('input[type="radio"][value="gradient"]').check();
    });

    console.log(`\n⚡ Individual preview latency: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(2000);
  });

  test('panoramic preview responds < 3s', async ({ page }) => {
    await waitForApp(page);
    await switchToPanoramic(page);
    await expandSection(page, 'Canvas');

    const slider = sidebarPanel(page).locator('text=Frame Count').locator('..').locator('input[type="range"]');
    const elapsed = await measurePreviewLatency(page, async () => {
      await slider.fill('4');
    });

    console.log(`\n⚡ Panoramic preview latency: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(3000);
  });
});

// ═══════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test('all iframes have title attributes', async ({ page }) => {
    const iframes = page.locator('iframe');
    const count = await iframes.count();
    const issues: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await iframes.nth(i).getAttribute('title');
      if (!title) issues.push(`iframe #${i + 1} missing title`);
    }

    console.log('\n♿ Iframe titles:');
    if (issues.length === 0) console.log('  ✅ All iframes titled');
    else issues.forEach((i) => console.log(`  ⚠️  ${i}`));
    expect(issues).toHaveLength(0);
  });

  test('color pickers have associated labels', async ({ page }) => {
    await switchToIndividual(page);
    await expandSection(page, 'Background');
    await sidebarPanel(page).locator('input[type="radio"][value="solid"]').check();
    await page.waitForTimeout(200);

    const colorInputs = sidebarPanel(page).locator('input[type="color"]');
    const count = await colorInputs.count();
    let labeled = 0;

    for (let i = 0; i < count; i++) {
      const parent = colorInputs.nth(i).locator('..');
      const text = await parent.textContent();
      if (text && text.trim().length > 1) labeled++;
    }

    console.log(`\n♿ Color pickers: ${labeled}/${count} labeled`);
    if (count > 0) expect(labeled).toBe(count);
  });
});

// ═══════════════════════════════════════════════════
// TASK COMPLETION FRICTION
// ═══════════════════════════════════════════════════

test.describe('Task Completion Friction', () => {
  test('change to gradient: same effort in both modes', async ({ page }) => {
    await waitForApp(page);

    // Individual: expand Background section → Gradient radio
    await switchToIndividual(page);
    let indClicks = 0;
    await expandSection(page, 'Background'); indClicks++;
    await sidebarPanel(page).locator('input[type="radio"][value="gradient"]').check(); indClicks++;
    await expect(sidebarPanel(page).locator('text=Direction')).toBeVisible();

    // Panoramic: expand Background section → Gradient radio
    await switchToPanoramic(page);
    let panClicks = 0;
    await expandSection(page, 'Background'); panClicks++;
    await sidebarPanel(page).locator('input[type="radio"][value="gradient"]').check(); panClicks++;

    console.log(`\n🎯 "Change to gradient": individual=${indClicks} clicks, panoramic=${panClicks} clicks`);
    expect(Math.abs(panClicks - indClicks)).toBeLessThanOrEqual(1);
  });

  test('enable spotlight: same effort in both modes', async ({ page }) => {
    await waitForApp(page);

    // Individual
    await switchToIndividual(page);
    let indClicks = 0;
    await expandSection(page, 'Spotlight / Dimming'); indClicks++;
    await sidebarPanel(page).locator('label').filter({ hasText: 'Enable Spotlight' }).click(); indClicks++;

    // Panoramic
    await switchToPanoramic(page);
    let panClicks = 0;
    await expandSection(page, 'Spotlight / Dimming'); panClicks++;
    await sidebarPanel(page).locator('label').filter({ hasText: 'Enable Spotlight' }).click(); panClicks++;

    console.log(`\n🎯 "Enable spotlight": individual=${indClicks} clicks, panoramic=${panClicks} clicks`);
    expect(Math.abs(panClicks - indClicks)).toBeLessThanOrEqual(1);
  });

  test('add annotation: same effort in both modes', async ({ page }) => {
    await waitForApp(page);

    // Individual
    await switchToIndividual(page);
    let indClicks = 0;
    await expandSection(page, 'Annotations'); indClicks++;
    await sidebarPanel(page).locator('button').filter({ hasText: '+ Add Annotation' }).click(); indClicks++;
    await expect(sidebarPanel(page).locator('text=Annotation 1')).toBeVisible();

    // Panoramic
    await switchToPanoramic(page);
    let panClicks = 0;
    await expandSection(page, 'Annotations'); panClicks++;
    await sidebarPanel(page).locator('button').filter({ hasText: '+ Add Annotation' }).click(); panClicks++;
    await expect(sidebarPanel(page).locator('text=Annotation 1')).toBeVisible();

    console.log(`\n🎯 "Add annotation": individual=${indClicks} clicks, panoramic=${panClicks} clicks`);
  });
});

// ═══════════════════════════════════════════════════
// COMPREHENSIVE AUDIT REPORT
// ═══════════════════════════════════════════════════

test.describe('Full UX Audit Report', () => {
  test('generate comprehensive audit', async ({ page }) => {
    await waitForApp(page);

    console.log('\n' + '═'.repeat(60));
    console.log('  APPFRAME UX AUDIT REPORT');
    console.log('═'.repeat(60));

    // ─── Individual mode ───
    console.log('\n📱 INDIVIDUAL MODE');
    await switchToIndividual(page);
    const indAudit = await auditPanel(page);
    const cI = indAudit.counts;
    const totalInd = cI.sliders + cI.selects + cI.checkboxes + cI.colorPickers + cI.textInputs;
    console.log(`  Controls: ${totalInd} (${cI.sliders}s ${cI.selects}sel ${cI.checkboxes}cb ${cI.colorPickers}clr)`);
    if (indAudit.unlabeledSliders > 0) console.log(`  ⚠️  ${indAudit.unlabeledSliders} unlabeled sliders`);
    console.log(`  Sections: ${indAudit.sectionTitles.join(', ') || 'none'}`);

    // ─── Panoramic mode ───
    console.log('\n🖼️  PANORAMIC MODE');
    await switchToPanoramic(page);
    const panAudit = await auditPanel(page);
    const cP = panAudit.counts;
    const totalPan = cP.sliders + cP.selects + cP.checkboxes + cP.colorPickers + cP.textInputs;
    console.log(`  Controls: ${totalPan} (${cP.sliders}s ${cP.selects}sel ${cP.checkboxes}cb ${cP.colorPickers}clr)`);
    if (panAudit.unlabeledSliders > 0) console.log(`  ⚠️  ${panAudit.unlabeledSliders} unlabeled sliders`);
    console.log(`  Sections: ${panAudit.sectionTitles.join(', ') || 'none'}`);

    // ─── Parity ───
    const ratio = totalPan / Math.max(totalInd, 1);
    console.log('\n📊 PARITY');
    console.log(`  Individual: ${totalInd} | Panoramic: ${totalPan} | Ratio: ${(ratio * 100).toFixed(0)}%`);
    if (ratio < 0.5) console.log('  ⚠️  Major feature gap — panoramic has <50% of individual controls');
    else if (ratio < 0.7) console.log('  ⚠️  Moderate gap — panoramic has <70% of individual controls');
    else console.log('  ✅ Reasonable parity');

    console.log('\n' + '═'.repeat(60) + '\n');
  });
});
