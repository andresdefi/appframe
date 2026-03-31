import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { deflateSync } from 'node:zlib';
import { parse } from 'yaml';
import { validateConfig } from '@appframe/core';
import { buildVariantSetPlan } from './design-planning.js';
import type { VariantSetPlan } from './design-planning.js';
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

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i] ?? 0;
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

async function makePngFile(
  dir: string,
  name: string,
  width: number,
  height: number,
  pixelAt: (x: number, y: number) => [number, number, number, number],
): Promise<string> {
  const filePath = join(dir, name);
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + (width * 4));
    row[0] = 0;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixelAt(x, y);
      const offset = 1 + (x * 4);
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rows.push(row);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  await writeFile(filePath, Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(Buffer.concat(rows))),
    pngChunk('IEND', Buffer.alloc(0)),
  ]));
  return filePath;
}

describe('plan materializer', () => {
  it('writes valid individual and panoramic configs from a variant plan', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-assets-');
    const outputDir = await makeTempDir('appframe-materializer-output-');

    const homePath = await makePngFile(assetsDir, 'home-screen.png', 120, 200, (x, y) => {
      if (y < 44) return [246, 247, 250, 255];
      if (x > 30 && x < 86 && y > 62 && y < 182) return [37, 99, 235, 255];
      return [132, 56, 255, 255];
    });
    const detailPath = await makePngFile(assetsDir, 'detail-report.png', 120, 200, (x, y) => {
      if (y < 38) return [250, 250, 252, 255];
      if (x > 66 && x < 112 && y > 58 && y < 170) return [16, 185, 129, 255];
      return [241, 245, 249, 255];
    });
    const settingsPath = await makePngFile(assetsDir, 'settings-screen.png', 120, 200, (x, y) => {
      const tone = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0 ? 212 : 164;
      return [tone, tone, tone + 8, 255];
    });
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
        expect(parsed.panoramic.background.layers?.length).toBeGreaterThan(0);
      }
      if (variant.id === 'concept-b') {
        expect(parsed.screens.some((screen: { composition?: string }) => screen.composition && screen.composition !== 'single')).toBe(true);
        expect(parsed.screens.some((screen: { extraDevices?: unknown[] }) => (screen.extraDevices?.length ?? 0) > 0)).toBe(true);
        expect(parsed.screens.some((screen: { cornerRadius?: number }) => (screen.cornerRadius ?? 0) > 0)).toBe(true);
        expect(parsed.screens.some((screen: { overlays?: unknown[] }) => (screen.overlays?.length ?? 0) > 0)).toBe(true);
      }
      if (variant.id === 'concept-c' || variant.id === 'concept-d') {
        expect(parsed.panoramic.elements.some((el: { type: string }) => el.type === 'group')).toBe(true);
        expect(parsed.panoramic.elements.some((el: { type: string }) => el.type === 'badge')).toBe(true);
        expect(parsed.panoramic.elements.some((el: { type: string }) => el.type === 'proof-chip')).toBe(true);
        const groups = parsed.panoramic.elements.filter((el: { type: string }) => el.type === 'group');
        expect(
          groups.some((group: { children?: Array<{ type: string }> }) =>
            (group.children ?? []).filter((child) => child.type === 'crop').length >= 2),
        ).toBe(true);
        expect(
          groups.some((group: { children?: Array<{ type: string }> }) => {
            const childTypes = new Set((group.children ?? []).map((child) => child.type));
            return childTypes.has('card') && (childTypes.has('crop') || childTypes.has('badge'));
          }),
        ).toBe(true);
        expect(
          groups.some((group: { children?: Array<{ type: string }> }) =>
            (group.children ?? []).some((child) => child.type === 'decoration')),
        ).toBe(true);
      }
    }

    const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8')) as {
      variants: Array<{ id: string; configPath: string }>;
    };
    expect(manifest.variants).toHaveLength(3);
  });

  it('materializes crop and frame guidance into the generated configs', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-guidance-assets-');
    const outputDir = await makeTempDir('appframe-materializer-guidance-output-');

    const homePath = await makePngFile(assetsDir, 'money-home.png', 120, 200, (x, y) => {
      if (y < 44) return [248, 250, 252, 255];
      if (x > 20 && x < 98 && y > 60 && y < 176) return [37, 99, 235, 255];
      return [226, 232, 240, 255];
    });
    const detailPath = await makePngFile(assetsDir, 'money-detail.png', 120, 200, (x, y) => {
      if (x > 18 && x < 104 && y > 58 && y < 170) return [16, 185, 129, 255];
      return [241, 245, 249, 255];
    });

    const plan: VariantSetPlan = {
      app: {
        name: 'Ledgerly',
        description: 'Budgeting and cash flow tracking for everyday money decisions.',
        category: 'finance',
        platforms: ['ios'],
      },
      goals: ['Build trust'],
      analysisSummary: {
        screenshotCount: 2,
        selectedCount: 2,
        roles: { home: 1, detail: 1 },
        topHeroCandidate: homePath,
        topHeroExplanation: ['Strong overview screen'],
      },
      selectedScreens: [
        {
          path: homePath,
          role: 'home',
          heroPriority: 92,
          inferredOrder: 1,
          focus: 'Money overview',
          unsafeForTextOverlay: true,
          embeddedTextSample: ['Upgrade to Pro'],
          textOccupiedRegions: ['top'],
        },
        {
          path: detailPath,
          role: 'detail',
          heroPriority: 76,
          inferredOrder: 2,
          focus: 'Budget detail',
          unsafeForTextOverlay: false,
          embeddedTextSample: ['Spending report'],
          textOccupiedRegions: ['left'],
        },
      ],
      variants: [
        {
          id: 'concept-b',
          name: 'Dynamic Ledger',
          currentCapabilityFit: 'supported_now',
          mode: 'individual',
          style: 'clean',
          recipe: 'dynamic-individual',
          strategy: 'Mix anchored devices with cropped support moments.',
          frameStrategy: {
            defaultTreatment: 'mixed',
            framelessAllowedWhen: ['Supporting crops can go frameless.'],
            rationale: 'Keep anchors framed and loosen crop-led support screens.',
          },
          screens: [
            {
              index: 1,
              sourcePath: homePath,
              sourceRole: 'home',
              slideRole: 'hero',
              layout: 'center',
              composition: 'single',
              backgroundStrategy: 'primary-tint',
              copyDirection: 'Lead with clarity',
              cropPlan: {
                usage: 'loupe-detail',
                anchor: 'lower-half',
                avoidRegions: ['top'],
                rationale: 'Bias the detail lower and keep copy away from the top UI.',
              },
              framing: 'framed',
              dominantPalette: ['#F8FAFC'],
            },
            {
              index: 2,
              sourcePath: detailPath,
              sourceRole: 'detail',
              slideRole: 'feature',
              layout: 'center',
              composition: 'duo-split',
              extraScreenshots: [homePath],
              backgroundStrategy: 'contrast-rhythm',
              copyDirection: 'Prove the detailed reporting flow',
              cropPlan: {
                usage: 'supporting-crop',
                anchor: 'right-rail',
                avoidRegions: ['left'],
                rationale: 'Use a support crop to add motion without losing the main screen.',
              },
              framing: 'framed',
              dominantPalette: ['#E2E8F0'],
              implementationNote: 'Keep the support crop lighter than the main device.',
            },
          ],
        },
        {
          id: 'concept-c',
          name: 'Editorial Ledger',
          currentCapabilityFit: 'supported_now',
          mode: 'panoramic',
          style: 'editorial',
          recipe: 'editorial-panorama',
          strategy: 'Alternate anchored devices with supporting editorial cards.',
          frameStrategy: {
            defaultTreatment: 'mixed',
            framelessAllowedWhen: ['Story cards can use frameless crops between anchored devices.'],
            rationale: 'Use crop cards between full devices to keep the strip airy.',
          },
          canvasPlan: {
            frameCount: 2,
            designGoal: 'Keep the sequence readable while varying support emphasis.',
            requiredElements: [
              { type: 'text', purpose: 'story' },
              { type: 'device', purpose: 'product proof' },
              { type: 'group', purpose: 'support card' },
            ],
          },
          frames: [
            {
              frame: 1,
              sourcePath: homePath,
              sourceRole: 'home',
              cropSuitability: 'high',
              storyBeat: 'hero',
              cropPlan: {
                usage: 'full-device',
                anchor: 'lower-half',
                avoidRegions: ['top'],
                rationale: 'Keep the full device and move the text below the busy top UI.',
              },
              compositionFeatures: ['floating-detail-card'],
              compositionNote: 'Keep the hero support card typographic, not crop-led.',
            },
            {
              frame: 2,
              sourcePath: detailPath,
              sourceRole: 'detail',
              cropSuitability: 'high',
              storyBeat: 'feature',
              cropPlan: {
                usage: 'supporting-crop',
                anchor: 'right-rail',
                avoidRegions: [],
                rationale: 'Use a cropped support card to echo the strongest detail.',
              },
              compositionFeatures: ['floating-detail-card'],
              compositionNote: 'Use a cropped detail card for the supporting proof.',
            },
          ],
        },
      ],
    };

    const result = await materializeVariantPlan({
      plan,
      outputDir,
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    const panoramicConfigPath = result.variants.find((variant) => variant.id === 'concept-c')?.configPath;
    expect(individualConfigPath).toBeTruthy();
    expect(panoramicConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    expect(individual.frames.style).toBe('flat');
    expect(individual.screens[0].subtitle).toBe('Turn complex money decisions into one clear story');
    expect(individual.screens[0].loupe.displayY).toBeGreaterThan(70);
    expect(individual.screens[0].loupe.sourceY).toBeGreaterThan(0);
    expect(individual.screens[1].cornerRadius).toBe(24);
    expect(individual.screens[1].extraDevices).toHaveLength(1);

    const panoramic = parse((await readFile(panoramicConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const firstText = panoramic.panoramic.elements.find((element: { type: string }) => element.type === 'text');
    expect(firstText?.y).toBeGreaterThan(6);

    const supportGroups = panoramic.panoramic.elements.filter((element: { type: string; children?: Array<{ type: string }> }) =>
      element.type === 'group' && (element.children ?? []).some((child: { type: string }) => child.type === 'card'),
    );
    expect(supportGroups).toHaveLength(2);
    expect(
      supportGroups.some((group: { children?: Array<{ type: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'card')
        && !(group.children ?? []).some((child) => child.type === 'crop')),
    ).toBe(true);
    expect(
      supportGroups.some((group: { children?: Array<{ type: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'card')
        && (group.children ?? []).some((child) => child.type === 'crop')),
    ).toBe(true);
  });
});
