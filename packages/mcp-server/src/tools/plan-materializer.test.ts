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
      selectedCopySet: {
        hero: {
          id: 'hero-1',
          slot: 'hero',
          headline: 'See your\nmoney clearly',
          subtitle: 'See balances budgets and spending in one calmer view',
          wordCount: 4,
          subtitleWordCount: 9,
          score: 94,
          rationale: [],
          issues: [],
        },
        differentiator: {
          id: 'diff-1',
          slot: 'differentiator',
          headline: 'Budgets with\ncontext',
          subtitle: 'Use the second beat to prove control context and confidence together',
          wordCount: 3,
          subtitleWordCount: 11,
          score: 90,
          rationale: [],
          issues: [],
        },
        features: [
          {
            id: 'feature-1',
            slot: 'feature',
            headline: 'Track every\nbudget',
            subtitle: 'Zoom in on budget detail so the proof feels trustworthy',
            sourceFeature: 'Budget tracking',
            wordCount: 3,
            subtitleWordCount: 10,
            score: 88,
            rationale: [],
            issues: [],
          },
        ],
        trust: {
          id: 'trust-1',
          slot: 'trust',
          headline: 'Built for\ndaily trust',
          subtitle: 'Reassure with reliable history and steady proof',
          wordCount: 4,
          subtitleWordCount: 7,
          score: 85,
          rationale: [],
          issues: [],
        },
        summary: {
          id: 'summary-1',
          slot: 'summary',
          headline: 'Everything that\nmatters',
          subtitle: 'Close on the broader money story not another feature',
          wordCount: 3,
          subtitleWordCount: 9,
          score: 86,
          rationale: [],
          issues: [],
        },
      },
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    const panoramicConfigPath = result.variants.find((variant) => variant.id === 'concept-c')?.configPath;
    expect(individualConfigPath).toBeTruthy();
    expect(panoramicConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    expect(individual.frames.style).toBe('flat');
    expect(individual.screens[0].subtitle).toBe('See balances budgets and spending in one calmer view');
    expect(individual.screens[0].autoSizeSubtitle).toBe(true);
    expect(individual.screens[0].loupe.displayY).toBeGreaterThan(70);
    expect(individual.screens[0].loupe.sourceY).toBeGreaterThan(0);
    expect(individual.screens[1].cornerRadius).toBe(24);
    expect(individual.screens[1].extraDevices).toHaveLength(1);
    expect(individual.screens[1].deviceShadow).toMatchObject({ opacity: 0.18, blur: 28 });
    expect(individual.screens[1].borderSimulation).toMatchObject({ enabled: true, thickness: 3 });
    expect(individual.screens[1].background).toBe('#E2E8F0');

    const panoramic = parse((await readFile(panoramicConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const firstText = panoramic.panoramic.elements.find((element: { type: string }) => element.type === 'text');
    expect(firstText?.y).toBeGreaterThan(6);
    expect(firstText?.x).toBe(4);

    const panoramicDevices = panoramic.panoramic.elements.filter((element: { type: string }) => element.type === 'device');
    expect(panoramicDevices[0]?.frameStyle).toBe('flat');
    expect(panoramicDevices[1]?.frameStyle).toBe('none');
    expect(panoramicDevices[1]?.borderSimulation).toMatchObject({ enabled: true, thickness: 3 });

    const supportGroups = panoramic.panoramic.elements.filter((element: { type: string; children?: Array<{ type: string }> }) =>
      element.type === 'group' && (element.children ?? []).some((child: { type: string }) => child.type === 'card'),
    );
    expect(supportGroups).toHaveLength(2);
    expect(
      supportGroups.some((group: {
        children?: Array<{ type: string; body?: string }>;
      }) => (group.children ?? []).some((child) => child.type === 'card' && child.body === 'See balances budgets and spending in one calmer view')),
    ).toBe(true);
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

  it('materializes role-aware background strategies for richer individual concepts', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-role-assets-');
    const outputDir = await makeTempDir('appframe-materializer-role-output-');

    const onboardingPath = await makePngFile(assetsDir, 'welcome-flow.png', 120, 200, (x, y) => {
      if (y < 54) return [250, 250, 252, 255];
      if (x > 26 && x < 94 && y > 64 && y < 146) return [99, 102, 241, 255];
      if (x > 24 && x < 96 && y > 162 && y < 184) return [16, 185, 129, 255];
      return [241, 245, 249, 255];
    });
    const paywallPath = await makePngFile(assetsDir, 'premium-offer.png', 120, 200, (x, y) => {
      if (x > 14 && x < 106 && y > 42 && y < 166) return [79, 70, 229, 255];
      if (x > 24 && x < 96 && y > 170 && y < 190) return [245, 158, 11, 255];
      return [15, 23, 42, 255];
    });
    const chatPath = await makePngFile(assetsDir, 'chat-thread.png', 120, 200, (x, y) => {
      if (y < 32) return [244, 246, 248, 255];
      if ((x > 8 && x < 74 && y > 48 && y < 66)
        || (x > 44 && x < 112 && y > 78 && y < 98)
        || (x > 10 && x < 72 && y > 114 && y < 132)
        || (x > 46 && x < 110 && y > 146 && y < 164)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const settingsPath = await makePngFile(assetsDir, 'controls-screen.png', 120, 200, (x, y) => {
      if (y < 30) return [244, 246, 248, 255];
      const inRow = y > 42 && y < 182 && y % 22 < 12;
      if (inRow && x > 10 && x < 110) return [203, 213, 225, 255];
      return [226, 232, 240, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'Pulse+',
      appDescription: 'A premium social app for creator communities and shared conversations.',
      platforms: ['ios'],
      features: ['Onboarding', 'Premium chat', 'Settings'],
      screenshots: [
        { path: onboardingPath },
        { path: paywallPath },
        { path: chatPath },
        { path: settingsPath },
      ],
      goals: ['Feel premium', 'Stay readable'],
      variantCount: 2,
      screenCount: 4,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      primaryColor: '#2563EB',
      secondaryColor: '#7C3AED',
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    expect(individualConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const backgrounds = individual.screens.map((screen: { background?: string }) => screen.background).filter(Boolean);

    expect(backgrounds.length).toBeGreaterThan(0);
    expect(new Set(backgrounds).size).toBeGreaterThan(1);
    expect(backgrounds).not.toContain('#FFFFFF');
  });

  it('materializes workflow and discovery-aware backgrounds for raster-only productivity screenshots', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-workflow-assets-');
    const outputDir = await makeTempDir('appframe-materializer-workflow-output-');

    const workflowPath = await makePngFile(assetsDir, 'workflow-builder.png', 120, 200, (x, y) => {
      if (x > 18 && x < 74 && y > 10 && y < 22) return [148, 163, 184, 255];
      if (y < 28) return [241, 245, 249, 255];
      if (x > 22 && x < 98 && y > 34 && y < 48) return [203, 213, 225, 255];
      if (x > 34 && x < 86 && y > 60 && y < 148) return [99, 102, 241, 255];
      if ((x > 40 && x < 80 && y > 76 && y < 90) || (x > 40 && x < 80 && y > 100 && y < 114)) return [165, 180, 252, 255];
      if (x > 26 && x < 94 && y > 164 && y < 186) return [16, 185, 129, 255];
      return [226, 232, 240, 255];
    });
    const discoveryPath = await makePngFile(assetsDir, 'discover-feed.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if (x > 16 && x < 104 && y > 34 && y < 48) return [226, 232, 240, 255];
      const inCardRow =
        ((x > 10 && x < 54) || (x > 66 && x < 110))
        && ((y > 58 && y < 92) || (y > 104 && y < 138) || (y > 150 && y < 184));
      if (inCardRow) return [59, 130, 246, 255];
      return [241, 245, 249, 255];
    });
    const reportPath = await makePngFile(assetsDir, 'screen-23.png', 120, 200, (x, y) => {
      if (y < 32) return [244, 246, 248, 255];
      if ((x > 16 && x < 104 && y > 54 && y < 78)
        || (x > 16 && x < 104 && y > 96 && y < 124)
        || (x > 18 && x < 102 && y > 138 && y < 176)) {
        return [16, 185, 129, 255];
      }
      return [203, 213, 225, 255];
    });
    const homePath = await makePngFile(assetsDir, 'screen-24.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 52 && y < 88)
        || (x > 68 && x < 108 && y > 52 && y < 88)
        || (x > 12 && x < 52 && y > 104 && y < 140)
        || (x > 68 && x < 108 && y > 104 && y < 140)) {
        return [37, 99, 235, 255];
      }
      if (x > 16 && x < 104 && y > 154 && y < 180) return [16, 185, 129, 255];
      return [226, 232, 240, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'Flowboard',
      appDescription: 'A productivity app for planning work, browsing templates, and tracking progress.',
      platforms: ['ios'],
      features: ['Project planning', 'Template discovery', 'Progress reporting'],
      screenshots: [
        { path: workflowPath, note: 'Project workflow' },
        { path: discoveryPath, note: 'Template discovery feed' },
        { path: reportPath },
        { path: homePath },
      ],
      goals: ['Feel focused', 'Show breadth'],
      variantCount: 2,
      screenCount: 4,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      primaryColor: '#2563EB',
      secondaryColor: '#7C3AED',
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    expect(individualConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const workflowScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('workflow-builder.png'));
    const discoveryScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('discover-feed.png'));

    expect(workflowScreen?.background).toBeTruthy();
    expect(discoveryScreen?.background).toBeTruthy();
    expect(workflowScreen?.background).not.toBe(discoveryScreen?.background);
    expect([workflowScreen?.background, discoveryScreen?.background]).not.toContain('#FFFFFF');
  });

  it('materializes family-aware local cue treatments for editor, catalog, and profile screenshots', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-family-assets-');
    const outputDir = await makeTempDir('appframe-materializer-family-output-');

    const editorPath = await makePngFile(assetsDir, 'template-editor-canvas.png', 120, 200, (x, y) => {
      if (y < 26) return [241, 245, 249, 255];
      if (x > 22 && x < 98 && y > 34 && y < 156) return [99, 102, 241, 255];
      if (x > 26 && x < 94 && y > 166 && y < 186) return [203, 213, 225, 255];
      return [226, 232, 240, 255];
    });
    const catalogPath = await makePngFile(assetsDir, 'shop-catalog-grid.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      const inCardRow =
        ((x > 10 && x < 54) || (x > 66 && x < 110))
        && ((y > 54 && y < 92) || (y > 102 && y < 140) || (y > 150 && y < 188));
      if (inCardRow) return [59, 130, 246, 255];
      return [241, 245, 249, 255];
    });
    const profilePath = await makePngFile(assetsDir, 'creator-profile-community.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });
    const homePath = await makePngFile(assetsDir, 'main-dashboard.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 52 && y < 88)
        || (x > 68 && x < 108 && y > 52 && y < 88)
        || (x > 12 && x < 52 && y > 104 && y < 140)
        || (x > 68 && x < 108 && y > 104 && y < 140)) {
        return [37, 99, 235, 255];
      }
      return [226, 232, 240, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'CreatorKit',
      appDescription: 'A creative app for editing templates, browsing kits, and sharing creator profiles.',
      platforms: ['ios'],
      features: ['Template editor', 'Kit catalog', 'Creator profiles'],
      screenshots: [
        { path: editorPath, note: 'Template editor canvas with layers and tools' },
        { path: catalogPath, note: 'Product catalog collection with featured items' },
        { path: profilePath, note: 'Creator profile for community members and followers' },
        { path: homePath, note: 'Main dashboard' },
      ],
      goals: ['Feel polished', 'Show breadth'],
      variantCount: 4,
      screenCount: 4,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      primaryColor: '#2563EB',
      secondaryColor: '#EC4899',
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    const panoramicConfigPath = result.variants.find((variant) => variant.id === 'concept-c')?.configPath;
    expect(individualConfigPath).toBeTruthy();
    expect(panoramicConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const editorScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('template-editor-canvas.png'));
    const catalogScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('shop-catalog-grid.png'));
    const profileScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('creator-profile-community.png'));

    expect(editorScreen?.background).toBeTruthy();
    expect(catalogScreen?.background).toBeTruthy();
    expect(profileScreen?.background).toBeTruthy();
    expect(new Set([editorScreen?.background, catalogScreen?.background, profileScreen?.background]).size).toBeGreaterThan(1);

    const panoramic = parse((await readFile(panoramicConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const panoramicGroups = panoramic.panoramic.elements.filter((element: { type: string }) => element.type === 'group');

    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Tool ribbon')),
    ).toBe(true);
    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Curated')),
    ).toBe(true);
    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) =>
          child.type === 'badge' && (child.content === 'Creator card' || child.content === 'Community card')),
    )).toBe(true);
    expect((panoramic.panoramic.background.layers?.length ?? 0)).toBeGreaterThan(2);
  });

  it('materializes family-aware local cue treatments for map and media screenshots', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-map-media-assets-');
    const outputDir = await makeTempDir('appframe-materializer-map-media-output-');

    const mapPath = await makePngFile(assetsDir, 'nearby-route-map.png', 120, 200, (x, y) => {
      if (y < 26) return [248, 250, 252, 255];
      if (x > 18 && x < 102 && y > 36 && y < 168) return [134, 239, 172, 255];
      if (x > 28 && x < 92 && y > 150 && y < 182) return [226, 232, 240, 255];
      return [219, 234, 254, 255];
    });
    const mediaPath = await makePngFile(assetsDir, 'now-playing-audio-queue.png', 120, 200, (x, y) => {
      if (y < 24) return [15, 23, 42, 255];
      if (x > 18 && x < 102 && y > 34 && y < 122) return [217, 70, 239, 255];
      if (x > 24 && x < 96 && y > 136 && y < 184) return [148, 163, 184, 255];
      return [30, 41, 59, 255];
    });
    const homePath = await makePngFile(assetsDir, 'city-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 92)
        || (x > 68 && x < 108 && y > 54 && y < 92)
        || (x > 12 && x < 52 && y > 106 && y < 144)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const profilePath = await makePngFile(assetsDir, 'guide-profile.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'GuideWave',
      appDescription: 'A city guide app for nearby routes, local pickup planning, and audio tours.',
      platforms: ['ios'],
      features: ['Nearby routes', 'Audio guide player', 'Creator tours'],
      screenshots: [
        { path: mapPath, note: 'Nearby map for routes, pickups, and city locations' },
        { path: mediaPath, note: 'Now playing audio queue with playlists and episodes' },
        { path: homePath, note: 'City guide home' },
        { path: profilePath, note: 'Guide creator profile' },
      ],
      goals: ['Feel polished', 'Show movement'],
      variantCount: 4,
      screenCount: 4,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      primaryColor: '#2563EB',
      secondaryColor: '#EC4899',
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    const panoramicConfigPath = result.variants.find((variant) => variant.id === 'concept-c')?.configPath;
    expect(individualConfigPath).toBeTruthy();
    expect(panoramicConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const mapScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('nearby-route-map.png'));
    const mediaScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('now-playing-audio-queue.png'));

    expect(mapScreen?.background).toBeTruthy();
    expect(mediaScreen?.background).toBeTruthy();
    expect(mapScreen?.background).not.toBe(mediaScreen?.background);

    const panoramic = parse((await readFile(panoramicConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const panoramicGroups = panoramic.panoramic.elements.filter((element: { type: string }) => element.type === 'group');

    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Route arc')),
    ).toBe(true);
    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Now playing')),
    ).toBe(true);
    expect((panoramic.panoramic.background.layers?.length ?? 0)).toBeGreaterThan(2);
  });

  it('materializes family-aware local cue treatments for capture and schedule screenshots', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-capture-schedule-assets-');
    const outputDir = await makeTempDir('appframe-materializer-capture-schedule-output-');

    const capturePath = await makePngFile(assetsDir, 'receipt-camera-capture.png', 120, 200, (x, y) => {
      if (y < 26) return [15, 23, 42, 255];
      if (x > 20 && x < 100 && y > 34 && y < 160) return [30, 41, 59, 255];
      if (x > 42 && x < 78 && y > 168 && y < 190) return [248, 250, 252, 255];
      return [51, 65, 85, 255];
    });
    const schedulePath = await makePngFile(assetsDir, 'team-calendar-agenda.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if (x < 28 && y > 38 && y < 184 && y % 28 < 18) return [203, 213, 225, 255];
      if (x > 34 && x < 104 && y > 42 && y < 182 && y % 28 < 16) return [96, 165, 250, 255];
      return [241, 245, 249, 255];
    });
    const homePath = await makePngFile(assetsDir, 'team-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 52 && y < 88)
        || (x > 68 && x < 108 && y > 52 && y < 88)
        || (x > 12 && x < 52 && y > 104 && y < 140)) {
        return [37, 99, 235, 255];
      }
      return [226, 232, 240, 255];
    });
    const editorPath = await makePngFile(assetsDir, 'story-editor.png', 120, 200, (x, y) => {
      if (y < 24) return [241, 245, 249, 255];
      if (x > 24 && x < 98 && y > 34 && y < 154) return [99, 102, 241, 255];
      return [226, 232, 240, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'ScanPilot',
      appDescription: 'A field app for live capture, agenda planning, and follow-up workflows.',
      platforms: ['ios'],
      features: ['Receipt capture', 'Team agenda', 'Story editor'],
      screenshots: [
        { path: capturePath, note: 'Live camera capture for scanning receipts and barcode intake' },
        { path: schedulePath, note: 'Team calendar agenda with bookings and next appointments' },
        { path: homePath, note: 'Main team home' },
        { path: editorPath, note: 'Story editor canvas' },
      ],
      goals: ['Feel active', 'Show control'],
      variantCount: 4,
      screenCount: 4,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      primaryColor: '#2563EB',
      secondaryColor: '#22C55E',
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    const panoramicConfigPath = result.variants.find((variant) => variant.id === 'concept-c')?.configPath;
    expect(individualConfigPath).toBeTruthy();
    expect(panoramicConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const captureScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('receipt-camera-capture.png'));
    const scheduleScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('team-calendar-agenda.png'));

    expect(captureScreen?.background).toBeTruthy();
    expect(scheduleScreen?.background).toBeTruthy();
    expect(captureScreen?.background).not.toBe(scheduleScreen?.background);

    const panoramic = parse((await readFile(panoramicConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const panoramicGroups = panoramic.panoramic.elements.filter((element: { type: string }) => element.type === 'group');

    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Live capture')),
    ).toBe(true);
    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Agenda')),
    ).toBe(true);
    expect((panoramic.panoramic.background.layers?.length ?? 0)).toBeGreaterThan(2);
  });

  it('materializes family-aware local cue treatments for commerce and security screenshots', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-commerce-security-assets-');
    const outputDir = await makeTempDir('appframe-materializer-commerce-security-output-');

    const commercePath = await makePngFile(assetsDir, 'checkout-cart-delivery.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if (x > 16 && x < 104 && y > 42 && y < 118) return [251, 191, 36, 255];
      if (x > 20 && x < 100 && y > 128 && y < 164) return [226, 232, 240, 255];
      if (x > 30 && x < 90 && y > 172 && y < 190) return [37, 99, 235, 255];
      return [255, 247, 237, 255];
    });
    const securityPath = await makePngFile(assetsDir, 'passkey-secure-login.png', 120, 200, (x, y) => {
      if (y < 30) return [15, 23, 42, 255];
      if (x > 24 && x < 96 && y > 42 && y < 150) return [30, 41, 59, 255];
      if (x > 34 && x < 86 && y > 166 && y < 186) return [59, 130, 246, 255];
      return [15, 23, 42, 255];
    });
    const homePath = await makePngFile(assetsDir, 'shop-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 92)
        || (x > 68 && x < 108 && y > 54 && y < 92)
        || (x > 12 && x < 52 && y > 106 && y < 144)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const profilePath = await makePngFile(assetsDir, 'member-profile.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'CartPass',
      appDescription: 'A commerce app for secure checkout, verified sign-in, and delivery follow-through.',
      platforms: ['ios'],
      features: ['Checkout flow', 'Passkey login', 'Delivery tracking'],
      screenshots: [
        { path: commercePath, note: 'Checkout cart with delivery status and order handoff' },
        { path: securityPath, note: 'Secure passkey login with identity verification and privacy protection' },
        { path: homePath, note: 'Shop home' },
        { path: profilePath, note: 'Member profile' },
      ],
      goals: ['Feel trusted', 'Show momentum'],
      variantCount: 4,
      screenCount: 4,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      primaryColor: '#2563EB',
      secondaryColor: '#F59E0B',
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    const panoramicConfigPath = result.variants.find((variant) => variant.id === 'concept-c')?.configPath;
    expect(individualConfigPath).toBeTruthy();
    expect(panoramicConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const commerceScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('checkout-cart-delivery.png'));
    const securityScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('passkey-secure-login.png'));

    expect(commerceScreen?.background).toBeTruthy();
    expect(securityScreen?.background).toBeTruthy();
    expect(commerceScreen?.background).not.toBe(securityScreen?.background);

    const panoramic = parse((await readFile(panoramicConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const panoramicGroups = panoramic.panoramic.elements.filter((element: { type: string }) => element.type === 'group');

    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Checkout flow')),
    ).toBe(true);
    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Secure access')),
    ).toBe(true);
    expect((panoramic.panoramic.background.layers?.length ?? 0)).toBeGreaterThan(2);
  });

  it('materializes family-aware local cue treatments for support and reward screenshots', async () => {
    const assetsDir = await makeTempDir('appframe-materializer-support-reward-assets-');
    const outputDir = await makeTempDir('appframe-materializer-support-reward-output-');

    const supportPath = await makePngFile(assetsDir, 'help-center-ticket-resolution.png', 120, 200, (x, y) => {
      if (y < 26) return [248, 250, 252, 255];
      if (x > 18 && x < 102 && y > 40 && y < 124) return [191, 219, 254, 255];
      if ((x > 24 && x < 96 && y > 136 && y < 154) || (x > 24 && x < 96 && y > 164 && y < 184)) {
        return [226, 232, 240, 255];
      }
      return [241, 245, 249, 255];
    });
    const rewardPath = await makePngFile(assetsDir, 'member-loyalty-rewards-perks.png', 120, 200, (x, y) => {
      if (y < 28) return [255, 247, 237, 255];
      if (x > 18 && x < 102 && y > 42 && y < 118) return [251, 191, 36, 255];
      if (x > 20 && x < 100 && y > 132 && y < 166) return [253, 230, 138, 255];
      if (x > 30 && x < 90 && y > 174 && y < 190) return [59, 130, 246, 255];
      return [255, 251, 235, 255];
    });
    const homePath = await makePngFile(assetsDir, 'member-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 92)
        || (x > 68 && x < 108 && y > 54 && y < 92)
        || (x > 12 && x < 52 && y > 106 && y < 144)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const profilePath = await makePngFile(assetsDir, 'member-profile.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'MemberLoop',
      appDescription: 'A membership app for loyalty rewards, cashback perks, and fast in-app support.',
      platforms: ['ios'],
      features: ['Help center', 'Rewards wallet', 'Member perks'],
      screenshots: [
        { path: supportPath, note: 'Help center with support tickets, FAQ guidance, and resolution status' },
        { path: rewardPath, note: 'Member loyalty rewards with perks, points, cashback, and redemption' },
        { path: homePath, note: 'Member home' },
        { path: profilePath, note: 'Member profile' },
      ],
      goals: ['Feel trusted', 'Show member value'],
      variantCount: 4,
      screenCount: 4,
    });

    const result = await materializeVariantPlan({
      plan,
      outputDir,
      primaryColor: '#2563EB',
      secondaryColor: '#F59E0B',
    });

    const individualConfigPath = result.variants.find((variant) => variant.id === 'concept-b')?.configPath;
    const panoramicConfigPath = result.variants.find((variant) => variant.id === 'concept-c')?.configPath;
    expect(individualConfigPath).toBeTruthy();
    expect(panoramicConfigPath).toBeTruthy();

    const individual = parse((await readFile(individualConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const supportScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('help-center-ticket-resolution.png'));
    const rewardScreen = individual.screens.find((screen: { screenshot: string }) => screen.screenshot.includes('member-loyalty-rewards-perks.png'));

    expect(supportScreen?.background).toBeTruthy();
    expect(rewardScreen?.background).toBeTruthy();
    expect(supportScreen?.background).not.toBe(rewardScreen?.background);

    const panoramic = parse((await readFile(panoramicConfigPath!, 'utf8')).replace(/^#.*\n/, ''));
    const panoramicGroups = panoramic.panoramic.elements.filter((element: { type: string }) => element.type === 'group');

    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Help center')),
    ).toBe(true);
    expect(
      panoramicGroups.some((group: { children?: Array<{ type: string; content?: string }> }) =>
        (group.children ?? []).some((child) => child.type === 'badge' && child.content === 'Member perks')),
    ).toBe(true);
    expect((panoramic.panoramic.background.layers?.length ?? 0)).toBeGreaterThan(2);
  });
});
