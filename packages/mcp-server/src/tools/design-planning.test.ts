import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { deflateSync } from 'node:zlib';
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
  name: string,
  width: number,
  height: number,
  pixelAt: (x: number, y: number) => [number, number, number, number],
): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'appframe-design-plan-png-'));
  tempDirs.push(dir);
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

  it('derives palette, quiet zones, and focal point from PNG pixels', async () => {
    const heroPath = await makePngFile('home-pixel.png', 120, 200, (x, y) => {
      if (y < 48) return [246, 247, 250, 255];
      if (x > 70 && x < 110 && y > 62 && y < 182) return [37, 99, 235, 255];
      return [132, 56, 255, 255];
    });

    const analysis = await analyzeScreenshotSet([{ path: heroPath, note: 'Main dashboard' }]);
    const first = analysis[0]!;

    expect(first.dominantPalette.length).toBeGreaterThan(0);
    expect(first.safeTextZones.some((zone) => zone.label === 'top')).toBe(true);
    expect(first.pixelMetrics?.source).toBe('png');
    expect(first.pixelMetrics?.topQuietRatio ?? 0).toBeGreaterThan(0.6);
    expect(first.focalPoint?.x ?? 0).toBeGreaterThan(45);
    expect(first.focalPoint?.y ?? 0).toBeGreaterThan(35);
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
    const homePath = await makePngFile('home-screen.png', 120, 200, (x, y) => {
      if (y < 46) return [246, 247, 250, 255];
      if (x > 30 && x < 86 && y > 62 && y < 182) return [37, 99, 235, 255];
      return [132, 56, 255, 255];
    });
    const detailPath = await makePngFile('detail-report.png', 120, 200, (x, y) => {
      if (y < 38) return [250, 250, 252, 255];
      if (x > 66 && x < 112 && y > 58 && y < 170) return [16, 185, 129, 255];
      return [241, 245, 249, 255];
    });
    const settingsPath = await makePngFile('settings-screen.png', 120, 200, (x, y) => {
      const tone = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0 ? 212 : 164;
      return [tone, tone, tone + 8, 255];
    });

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
    if (plan.variants[1]?.mode === 'individual') {
      const conceptAPaths = plan.variants[0]?.mode === 'individual'
        ? plan.variants[0].screens.map((screen) => screen.sourcePath)
        : [];
      const conceptBPaths = plan.variants[1].screens.map((screen) => screen.sourcePath);
      expect(conceptBPaths).not.toEqual(conceptAPaths);
      expect(plan.variants[1].screens.some((screen) => screen.composition !== 'single')).toBe(true);
      expect(plan.variants[1].screens.some((screen) => (screen.extraScreenshots?.length ?? 0) > 0)).toBe(true);
      expect(plan.variants[1].screens.some((screen) => Boolean(screen.focalPoint))).toBe(true);
      expect(plan.variants[1].screens.some((screen) => screen.copyDirection.includes('Keep it extra short') || screen.copyDirection.includes('broader than a literal feature caption'))).toBe(true);
    }
    expect(plan.variants[2]).toMatchObject({
      id: 'concept-c',
      mode: 'panoramic',
      currentCapabilityFit: 'supported_now',
    });
    if (plan.variants[2]?.mode === 'panoramic') {
      const conceptAPaths = plan.variants[0]?.mode === 'individual'
        ? plan.variants[0].screens.map((screen) => screen.sourcePath)
        : [];
      const conceptCPaths = plan.variants[2].frames?.map((frame) => frame.sourcePath) ?? [];
      expect(conceptCPaths).not.toEqual(conceptAPaths);
      expect(plan.variants[2].frames?.some((frame) => Boolean(frame.focalPoint))).toBe(true);
      expect(plan.variants[2].canvasPlan.requiredElements.some((el) => el.type === 'group')).toBe(true);
      expect(plan.variants[2].canvasPlan.requiredElements.some((el) => el.type === 'logo')).toBe(true);
      expect(plan.variants[2].frames?.every((frame) => frame.cropSuitability)).toBe(true);
      expect(plan.variants[2].frames?.some((frame) => frame.compositionFeatures?.includes('layered-detail-extract'))).toBe(true);
      expect(plan.variants[2].frames?.every((frame) => frame.compositionFeatures?.includes('floating-detail-card'))).toBe(true);
      expect(plan.variants[2].frames?.some((frame) => frame.compositionNote && frame.compositionNote.length > 20)).toBe(true);
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
      expect(plan.variants[3].frames?.some((frame) => frame.compositionFeatures?.includes('decorative-cluster'))).toBe(true);
      expect(plan.variants[3].frames?.some((frame) => frame.compositionFeatures?.includes('proof-stack'))).toBe(true);
    }
  });

  it('selects finance-specific concept recipes and planning tone', async () => {
    const homePath = await makeSvgFile('home-dashboard.svg', 1290, 2796);
    const detailPath = await makeSvgFile('weekly-report.svg', 1290, 2796);
    const settingsPath = await makeSvgFile('settings-screen.svg', 1290, 2796);

    const plan = await buildVariantSetPlan({
      appName: 'Ledgerly',
      appDescription: 'A personal finance app for budgets, spending, and money reports.',
      platforms: ['ios'],
      features: ['Budget tracking', 'Cash flow reports', 'Spending alerts'],
      screenshots: [
        { path: homePath, note: 'Main money dashboard' },
        { path: detailPath, note: 'Weekly spending report' },
        { path: settingsPath, note: 'Security settings' },
      ],
      goals: ['Build trust', 'Show clarity'],
      variantCount: 4,
      screenCount: 3,
    });

    expect(plan.app.category).toBe('finance');
    expect(plan.variants[0]).toMatchObject({
      id: 'concept-a',
      name: 'Trust Hero',
      style: 'clean',
      recipe: 'trust-led-hero',
    });
    expect(plan.variants[3]).toMatchObject({
      id: 'concept-d',
      name: 'Proof Panorama',
      recipe: 'bold-panorama',
    });
    if (plan.variants[0]?.mode === 'individual') {
      expect(plan.variants[0].screens[0]?.sourceRole).toBe('home');
      expect(plan.variants[0].screens[0]?.copyDirection).toContain('calm, credible, and precise');
    }
    if (plan.variants[2]?.mode === 'panoramic') {
      expect(plan.variants[2].name).toBe('Editorial Confidence');
      expect(plan.variants[2].canvasPlan.designGoal).toContain('finance');
      expect(plan.variants[2].canvasPlan.requiredElements.some((element) => /proof/i.test(element.purpose))).toBe(true);
    }
  });

  it('uses social category weighting to favor communication-led dynamic concepts', async () => {
    const homePath = await makeSvgFile('home-feed.svg', 1290, 2796);
    const chatPath = await makeSvgFile('chat-inbox.svg', 1290, 2796);
    const discoveryPath = await makeSvgFile('discover-creators.svg', 1290, 2796);
    const settingsPath = await makeSvgFile('settings-screen.svg', 1290, 2796);

    const plan = await buildVariantSetPlan({
      appName: 'Pulse',
      appDescription: 'A social app for chat, creator communities, and shared moments.',
      platforms: ['ios'],
      features: ['Group chat', 'Creator feeds', 'Shared posts'],
      screenshots: [
        { path: homePath, note: 'Community home feed' },
        { path: chatPath, note: 'Chat inbox' },
        { path: discoveryPath, note: 'Discover creators' },
        { path: settingsPath, note: 'Profile settings' },
      ],
      goals: ['Feel active', 'Show community'],
      variantCount: 4,
      screenCount: 4,
    });

    expect(plan.app.category).toBe('social');
    expect(plan.variants[0]).toMatchObject({
      id: 'concept-a',
      name: 'Connection Hero',
      recipe: 'connection-hero',
    });
    expect(plan.variants[1]).toMatchObject({
      id: 'concept-b',
      name: 'Community Momentum',
      recipe: 'community-momentum',
    });
    if (plan.variants[1]?.mode === 'individual') {
      const socialRoles = plan.variants[1].screens.map((screen) => screen.sourceRole);
      expect(socialRoles).toContain('communication');
      expect(plan.variants[1].screens[0]?.sourceRole).toBe('communication');
      expect(plan.variants[1].screens.some((screen) => screen.copyDirection.includes('active, human, and social'))).toBe(true);
    }
    if (plan.variants[2]?.mode === 'panoramic') {
      expect(plan.variants[2].name).toBe('Conversation Panorama');
      expect(plan.variants[2].canvasPlan.designGoal).toContain('community energy');
    }
  });

  it('diversifies lead screenshot assignment across concepts when enough screens exist', async () => {
    const homePath = await makePngFile('home-feed.png', 120, 200, (x, y) => {
      if (y < 52) return [248, 250, 252, 255];
      if (x > 28 && x < 88 && y > 58 && y < 184) return [59, 130, 246, 255];
      return [226, 232, 240, 255];
    });
    const chatPath = await makePngFile('chat-inbox.png', 120, 200, (x, y) => {
      const tone = (Math.floor(x / 6) + Math.floor(y / 8)) % 2 === 0 ? 214 : 168;
      if (x > 14 && x < 106 && y > 44 && y < 176 && y % 18 < 10) return [37, 99, 235, 255];
      return [tone, tone, tone + 10, 255];
    });
    const discoveryPath = await makePngFile('discover-creators.png', 120, 200, (x, y) => {
      if (y < 48) return [250, 246, 240, 255];
      if (x > 18 && x < 100 && y > 70 && y < 164) return [249, 115, 22, 255];
      return [255, 237, 213, 255];
    });
    const detailPath = await makePngFile('detail-story.png', 120, 200, (x, y) => {
      if (y < 34) return [244, 246, 248, 255];
      if ((x > 20 && x < 102 && y > 62 && y < 82) || (x > 32 && x < 110 && y > 110 && y < 170)) {
        return [16, 185, 129, 255];
      }
      return [203, 213, 225, 255];
    });
    const settingsPath = await makePngFile('settings-screen.png', 120, 200, (x, y) => {
      const tone = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0 ? 210 : 176;
      return [tone, tone, tone + 8, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'Pulse',
      appDescription: 'A social app for chat, creator communities, and shared moments.',
      platforms: ['ios'],
      features: ['Group chat', 'Creator feeds', 'Shared posts'],
      screenshots: [
        { path: homePath, note: 'Community home feed' },
        { path: chatPath, note: 'Chat inbox' },
        { path: discoveryPath, note: 'Discover creators' },
        { path: detailPath, note: 'Story detail' },
        { path: settingsPath, note: 'Profile settings' },
      ],
      goals: ['Feel active', 'Show community'],
      variantCount: 4,
      screenCount: 5,
    });

    const conceptLeadPaths = plan.variants.map((variant) =>
      variant.mode === 'individual'
        ? variant.screens[0]?.sourcePath
        : variant.frames?.[0]?.sourcePath,
    );
    const conceptLeadRoles = plan.variants.map((variant) =>
      variant.mode === 'individual'
        ? variant.screens[0]?.sourceRole
        : variant.frames?.[0]?.sourceRole,
    );
    const uniqueLeadPaths = new Set(conceptLeadPaths.filter((value): value is string => Boolean(value)));

    expect(uniqueLeadPaths.size).toBe(4);
    expect(conceptLeadRoles).toContain('communication');
  });
});
