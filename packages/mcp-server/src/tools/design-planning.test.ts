import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { analyzeScreenshotSet, buildVariantSetPlan, readImageMetadata } from './design-planning.js';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function makeSvgFile(name: string, width: number, height: number): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'appframe-design-plan-'));
  tempDirs.push(dir);
  const filePath = join(dir, name);
  await writeFile(
    filePath,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#000"/></svg>`,
    'utf8',
  );
  return filePath;
}

describe('design planning helpers', () => {
  it('reads SVG metadata and infers screenshot roles', async () => {
    const homePath = await makeSvgFile('home-screen.svg', 1290, 2796);
    const detailPath = await makeSvgFile('detail-report.svg', 1290, 2796);

    const metadata = await readImageMetadata(homePath);
    expect(metadata.format).toBe('svg');
    expect(metadata.width).toBe(1290);
    expect(metadata.height).toBe(2796);

    const analysis = await analyzeScreenshotSet([
      { path: homePath, note: 'Main dashboard' },
      { path: detailPath, note: 'Weekly stats' },
    ]);

    expect(analysis[0]?.role).toBe('home');
    expect(analysis[0]?.heroPriority).toBeGreaterThan(analysis[1]?.heroPriority ?? 0);
    expect(analysis[0]?.safeTextZones.length).toBeGreaterThan(0);
    expect(analysis[0]?.recommendedUsage).toBe('hero-device');
    expect(analysis[0]?.heroExplanation.length).toBeGreaterThan(0);
    expect(analysis[1]?.unsafeForTextOverlay).toBe(true);
  });

  it('infers screenshot ordering from filenames and carries it into the plan', async () => {
    const settingsPath = await makeSvgFile('screen-3-settings.svg', 1290, 2796);
    const detailPath = await makeSvgFile('screen-2-detail.svg', 1290, 2796);
    const homePath = await makeSvgFile('screen-1-home.svg', 1290, 2796);

    const analysis = await analyzeScreenshotSet([
      { path: settingsPath, note: 'Settings' },
      { path: detailPath, note: 'Weekly detail' },
      { path: homePath, note: 'Main dashboard' },
    ]);

    const byPath = new Map(analysis.map((entry) => [entry.path, entry]));
    expect(byPath.get(homePath)?.inferredOrder).toBe(1);
    expect(byPath.get(detailPath)?.inferredOrder).toBe(2);
    expect(byPath.get(settingsPath)?.inferredOrder).toBe(3);
    expect(byPath.get(homePath)?.orderingConfidence).toBe('high');

    const plan = await buildVariantSetPlan({
      appName: 'FitFlow',
      appDescription: 'A workout planning app that helps people stay consistent.',
      platforms: ['ios'],
      features: ['Workout plans', 'Progress tracking', 'Weekly routines'],
      screenshots: [
        { path: settingsPath, note: 'Settings' },
        { path: detailPath, note: 'Weekly detail' },
        { path: homePath, note: 'Main dashboard' },
      ],
      goals: ['Show momentum', 'Feel premium'],
      variantCount: 4,
      screenCount: 3,
    });

    expect(plan.selectedScreens.map((screen) => screen.path)).toEqual([
      homePath,
      detailPath,
      settingsPath,
    ]);
    expect(plan.analysisSummary.topHeroExplanation.length).toBeGreaterThan(0);
    expect(plan.selectedScreens[2]?.unsafeForTextOverlay).toBe(true);
  });

  it('builds a variant set plan with current-capability concepts', async () => {
    const homePath = await makeSvgFile('home-screen.svg', 1290, 2796);
    const detailPath = await makeSvgFile('detail-report.svg', 1290, 2796);
    const settingsPath = await makeSvgFile('settings-screen.svg', 1290, 2796);

    const plan = await buildVariantSetPlan({
      appName: 'FitFlow',
      appDescription: 'A workout planning app that helps people stay consistent.',
      platforms: ['ios'],
      features: ['Workout plans', 'Progress tracking', 'Weekly routines'],
      screenshots: [
        { path: homePath, note: 'Main dashboard' },
        { path: detailPath, note: 'Weekly stats' },
        { path: settingsPath, note: 'Settings' },
      ],
      goals: ['Show momentum', 'Feel premium'],
      variantCount: 4,
      screenCount: 3,
    });

    expect(plan.analysisSummary.selectedCount).toBe(3);
    expect(plan.variants).toHaveLength(4);
    expect(plan.variants[0]).toMatchObject({
      id: 'concept-a',
      currentCapabilityFit: 'supported_now',
      mode: 'individual',
    });
    expect(plan.variants[1]).toMatchObject({
      id: 'concept-b',
      mode: 'individual',
      currentCapabilityFit: 'supported_now',
    });
    expect(plan.variants[2]).toMatchObject({
      id: 'concept-c',
      mode: 'panoramic',
      currentCapabilityFit: 'supported_now',
    });
    if (plan.variants[2]?.mode === 'panoramic') {
      expect(plan.variants[2].canvasPlan.requiredElements.some((el) => el.type === 'group')).toBe(true);
      expect(plan.variants[2].canvasPlan.requiredElements.some((el) => el.type === 'logo')).toBe(true);
      expect(plan.variants[2].frames?.every((frame) => frame.cropSuitability)).toBe(true);
    }
    expect(plan.variants[3]).toMatchObject({
      id: 'concept-d',
      mode: 'panoramic',
      currentCapabilityFit: 'supported_now',
    });
    if (plan.variants[3]?.mode === 'panoramic') {
      expect(plan.variants[3].canvasPlan.requiredElements.some((el) => el.type === 'group')).toBe(true);
      expect(plan.variants[3].canvasPlan.requiredElements.some((el) => el.type === 'badge')).toBe(true);
      expect(plan.variants[3].canvasPlan.requiredElements.some((el) => el.type === 'proof-chip')).toBe(true);
    }
  });
});
