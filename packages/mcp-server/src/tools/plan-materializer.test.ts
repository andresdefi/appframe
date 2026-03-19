import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parse } from 'yaml';
import { validateConfig } from '@appframe/core';
import { buildVariantSetPlan } from './design-planning.js';
import { materializeVariantPlan } from './plan-materializer.js';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function makeTempDir(prefix: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

async function makeSvgFile(
  dir: string,
  name: string,
  width: number,
  height: number,
): Promise<string> {
  const filePath = join(dir, name);
  await writeFile(
    filePath,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#000"/></svg>`,
    'utf8',
  );
  return filePath;
}

describe('plan materializer', () => {
  it('writes valid individual and panoramic configs from a variant plan', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-assets-');
    const outputDir = await makeTempDir('appframe-materializer-output-');

    const homePath = await makeSvgFile(assetsDir, 'home-screen.svg', 1290, 2796);
    const detailPath = await makeSvgFile(assetsDir, 'detail-report.svg', 1290, 2796);
    const settingsPath = await makeSvgFile(assetsDir, 'settings-screen.svg', 1290, 2796);
    const logoPath = await makeSvgFile(assetsDir, 'brand-logo.svg', 240, 240);

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
      variantCount: 3,
      screenCount: 3,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      assetImagePath: logoPath,
      primaryColor: '#2563EB',
      secondaryColor: '#7C3AED',
    });

    expect(result.variants).toHaveLength(3);

    for (const variant of result.variants) {
      const yamlText = await readFile(variant.configPath, 'utf8');
      const parsed = parse(yamlText.replace(/^#.*\n/, ''));
      const validation = validateConfig(parsed);
      expect(validation.success).toBe(true);

      if (variant.id === 'concept-c') {
        expect(parsed.panoramic.elements.some((el: { type: string }) => el.type === 'group')).toBe(true);
        expect(parsed.panoramic.elements.some((el: { type: string }) => el.type === 'logo')).toBe(true);
      }
      if (variant.id === 'concept-c' || variant.id === 'concept-d') {
        expect(parsed.panoramic.elements.some((el: { type: string }) => el.type === 'group')).toBe(true);
        expect(parsed.panoramic.elements.some((el: { type: string }) => el.type === 'badge')).toBe(true);
      }
    }

    const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8')) as {
      variants: Array<{ id: string; configPath: string }>;
    };
    expect(manifest.variants).toHaveLength(3);
  });
});
