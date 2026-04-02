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

async function makeJsonFile(name: string, payload: unknown): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'appframe-design-plan-json-'));
  tempDirs.push(dir);
  const filePath = join(dir, name);
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');
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

  it('uses optional OCR sidecars to improve role and text-overlay understanding', async () => {
    const screenPath = await makePngFile('screen-2.png', 120, 200, (x, y) => {
      if (y < 46) return [250, 250, 252, 255];
      if (x > 26 && x < 96 && y > 68 && y < 176) return [99, 102, 241, 255];
      return [241, 245, 249, 255];
    });
    const ocrPath = await makeJsonFile('screen-2.ocr.json', {
      source: 'agent-vision',
      roleHint: 'paywall',
      blocks: [
        { text: 'Upgrade to Pro', x: 12, y: 10, width: 58, height: 10, confidence: 0.98 },
        { text: 'Start 7 day trial', x: 10, y: 24, width: 72, height: 8, confidence: 0.95 },
      ],
    });

    const analysis = await analyzeScreenshotSet([{ path: screenPath, ocrJsonPath: ocrPath }]);
    const first = analysis[0]!;

    expect(first.role).toBe('paywall');
    expect(first.textInsights?.source).toBe('agent-vision');
    expect(first.textInsights?.lineCount).toBe(2);
    expect(first.textInsights?.topCoverage ?? 0).toBeGreaterThan(0.15);
    expect(first.safeTextZones.some((zone) => zone.label === 'top')).toBe(false);
    expect(first.textRisk).toBe('high');
    expect(first.unsafeForTextOverlay).toBe(true);
    expect(first.heroExplanation.some((line) => line.includes('OCR/vision'))).toBe(true);
  });

  it('uses denser OCR text fixtures to infer communication screens and overlay risk', async () => {
    const chatPath = await makePngFile('chat-thread.png', 120, 200, (x, y) => {
      if (y < 32) return [244, 246, 248, 255];
      if ((x > 10 && x < 78 && y > 48 && y < 68) || (x > 42 && x < 110 && y > 84 && y < 104)) {
        return [59, 130, 246, 255];
      }
      if ((x > 12 && x < 94 && y > 120 && y < 138) || (x > 24 && x < 108 && y > 154 && y < 172)) {
        return [191, 219, 254, 255];
      }
      return [226, 232, 240, 255];
    });
    const ocrPath = await makeJsonFile('chat-thread.vision.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Messages', x: 10, y: 6, width: 28, height: 8, confidence: 0.99 },
        { text: 'Search messages', x: 42, y: 18, width: 42, height: 8, confidence: 0.97 },
        { text: 'Reply with a voice note', x: 12, y: 52, width: 54, height: 8, confidence: 0.97 },
        { text: 'See who is typing live', x: 42, y: 88, width: 50, height: 8, confidence: 0.94 },
        { text: 'Pinned community updates', x: 18, y: 124, width: 58, height: 8, confidence: 0.93 },
      ],
    });

    const analysis = await analyzeScreenshotSet([{ path: chatPath, ocrJsonPath: ocrPath }]);
    const first = analysis[0]!;

    expect(first.role).toBe('communication');
    expect(first.textRisk).toBe('high');
    expect(first.unsafeForTextOverlay).toBe(true);
    expect(first.textInsights?.topCoverage ?? 0).toBeGreaterThan(0.12);
  });

  it('uses OCR semantics to distinguish onboarding, settings, and data-heavy reporting screens', async () => {
    const onboardingPath = await makePngFile('welcome-flow.png', 120, 200, (x, y) => {
      if (y < 52) return [250, 250, 252, 255];
      if (x > 26 && x < 94 && y > 68 && y < 150) return [99, 102, 241, 255];
      return [241, 245, 249, 255];
    });
    const settingsPath = await makePngFile('screen-2.png', 120, 200, (_x, y) => {
      const tone = y % 16 < 8 ? 232 : 214;
      return [tone, tone, tone + 6, 255];
    });
    const dashboardPath = await makePngFile('screen-3.png', 120, 200, (x, y) => {
      if (y < 40) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 86) || (x > 68 && x < 108 && y > 54 && y < 86)) {
        return [37, 99, 235, 255];
      }
      if ((x > 12 && x < 108 && y > 108 && y < 170) && y % 14 < 7) {
        return [16, 185, 129, 255];
      }
      return [226, 232, 240, 255];
    });
    const reportPath = await makePngFile('screen-4.png', 120, 200, (x, y) => {
      if (y < 36) return [244, 246, 248, 255];
      if ((x > 18 && x < 102 && y > 60 && y < 88) || (x > 24 && x < 98 && y > 110 && y < 176)) {
        return [16, 185, 129, 255];
      }
      return [203, 213, 225, 255];
    });

    const onboardingOcrPath = await makeJsonFile('welcome-flow.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Welcome to FocusFlow', x: 16, y: 12, width: 56, height: 10, confidence: 0.99 },
        { text: 'Turn plans into calmer days', x: 14, y: 28, width: 74, height: 10, confidence: 0.97 },
        { text: 'Allow notifications', x: 22, y: 146, width: 48, height: 8, confidence: 0.96 },
        { text: 'Continue', x: 40, y: 166, width: 28, height: 8, confidence: 0.98 },
      ],
    });
    const settingsOcrPath = await makeJsonFile('settings-screen.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Account', x: 12, y: 18, width: 24, height: 8, confidence: 0.99 },
        { text: 'Notifications', x: 12, y: 42, width: 36, height: 8, confidence: 0.98 },
        { text: 'Privacy', x: 12, y: 66, width: 22, height: 8, confidence: 0.98 },
        { text: 'Appearance', x: 12, y: 90, width: 28, height: 8, confidence: 0.97 },
        { text: 'Billing', x: 12, y: 114, width: 20, height: 8, confidence: 0.97 },
      ],
    });
    const dashboardOcrPath = await makeJsonFile('dashboard.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Dashboard', x: 12, y: 10, width: 30, height: 8, confidence: 0.99 },
        { text: 'Balance $12,430', x: 14, y: 52, width: 44, height: 8, confidence: 0.98 },
        { text: 'Spending $1,280', x: 70, y: 52, width: 40, height: 8, confidence: 0.98 },
        { text: 'Savings 18%', x: 16, y: 76, width: 32, height: 8, confidence: 0.97 },
        { text: 'Weekly activity', x: 14, y: 112, width: 40, height: 8, confidence: 0.96 },
        { text: 'Revenue 24%', x: 14, y: 136, width: 36, height: 8, confidence: 0.96 },
      ],
    });
    const reportOcrPath = await makeJsonFile('report.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Weekly report', x: 12, y: 10, width: 34, height: 8, confidence: 0.99 },
        { text: 'Revenue $18,240', x: 16, y: 58, width: 42, height: 8, confidence: 0.98 },
        { text: 'Conversion 8.4%', x: 16, y: 84, width: 42, height: 8, confidence: 0.97 },
        { text: 'Spending -12%', x: 16, y: 118, width: 38, height: 8, confidence: 0.97 },
        { text: 'Trend up 3.2%', x: 16, y: 146, width: 36, height: 8, confidence: 0.96 },
      ],
    });

    const analysis = await analyzeScreenshotSet([
      { path: onboardingPath, ocrJsonPath: onboardingOcrPath },
      { path: settingsPath, note: 'Profile and controls', ocrJsonPath: settingsOcrPath },
      { path: dashboardPath, note: 'Main finance view', ocrJsonPath: dashboardOcrPath },
      { path: reportPath, note: 'Weekly finance screen', ocrJsonPath: reportOcrPath },
    ]);

    const byPath = new Map(analysis.map((entry) => [entry.path, entry]));
    expect(byPath.get(onboardingPath)?.role).toBe('onboarding');
    expect(byPath.get(onboardingPath)?.density).toBe('minimal');
    expect(byPath.get(onboardingPath)?.recommendedUsage).toBe('hero-device');

    expect(byPath.get(settingsPath)?.role).toBe('settings');
    expect(byPath.get(settingsPath)?.density).toBe('dense');
    expect(byPath.get(settingsPath)?.cropSuitability).toBe('low');
    expect(byPath.get(settingsPath)?.recommendedUsage).toBe('support-only');

    expect(byPath.get(dashboardPath)?.role).toBe('home');
    expect(byPath.get(dashboardPath)?.density).toBe('dense');
    expect(byPath.get(dashboardPath)?.cropSuitability).toBe('high');
    expect(byPath.get(dashboardPath)?.unsafeForTextOverlay).toBe(true);

    expect(byPath.get(reportPath)?.role).toBe('detail');
    expect(byPath.get(reportPath)?.density).toBe('dense');
    expect(byPath.get(reportPath)?.cropSuitability).toBe('high');
    expect(byPath.get(reportPath)?.heroExplanation.some((line) => line.includes('data-heavy reporting view'))).toBe(true);
  });

  it('infers screenshot semantics and occupied regions from raster layout when OCR is absent', async () => {
    const onboardingPath = await makePngFile('welcome-flow.png', 120, 200, (x, y) => {
      if (y < 54) return [250, 250, 252, 255];
      if (x > 26 && x < 94 && y > 64 && y < 146) return [99, 102, 241, 255];
      if (x > 24 && x < 96 && y > 162 && y < 184) return [16, 185, 129, 255];
      return [241, 245, 249, 255];
    });
    const paywallPath = await makePngFile('premium-offer.png', 120, 200, (x, y) => {
      if (x > 14 && x < 106 && y > 42 && y < 166) return [79, 70, 229, 255];
      if (x > 24 && x < 96 && y > 170 && y < 190) return [245, 158, 11, 255];
      return [15, 23, 42, 255];
    });
    const settingsPath = await makePngFile('settings-screen.png', 120, 200, (x, y) => {
      if (y < 30) return [244, 246, 248, 255];
      const inRow = y > 42 && y < 182 && y % 22 < 12;
      if (inRow && x > 10 && x < 110) return [203, 213, 225, 255];
      return [226, 232, 240, 255];
    });
    const chatPath = await makePngFile('chat-thread.png', 120, 200, (x, y) => {
      if (y < 32) return [244, 246, 248, 255];
      if ((x > 8 && x < 74 && y > 48 && y < 66)
        || (x > 44 && x < 112 && y > 78 && y < 98)
        || (x > 10 && x < 72 && y > 114 && y < 132)
        || (x > 46 && x < 110 && y > 146 && y < 164)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const dashboardPath = await makePngFile('dashboard-home.png', 120, 200, (x, y) => {
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
    const reportPath = await makePngFile('weekly-report.png', 120, 200, (x, y) => {
      if (y < 32) return [244, 246, 248, 255];
      if ((x > 16 && x < 104 && y > 54 && y < 78)
        || (x > 16 && x < 104 && y > 96 && y < 124)
        || (x > 18 && x < 102 && y > 138 && y < 176)) {
        return [16, 185, 129, 255];
      }
      return [203, 213, 225, 255];
    });

    const analysis = await analyzeScreenshotSet([
      { path: onboardingPath },
      { path: paywallPath },
      { path: settingsPath },
      { path: chatPath },
      { path: dashboardPath },
      { path: reportPath },
    ]);

    const byPath = new Map(analysis.map((entry) => [entry.path, entry]));
    expect(byPath.get(onboardingPath)?.role).toBe('onboarding');
    expect(byPath.get(onboardingPath)?.recommendedUsage).toBe('hero-device');
    expect(byPath.get(onboardingPath)?.occupiedRegions).toContain('bottom');

    expect(byPath.get(paywallPath)?.role).toBe('paywall');
    expect(byPath.get(paywallPath)?.occupiedRegions).toContain('center');
    expect(byPath.get(paywallPath)?.occupiedRegions).toContain('bottom');

    expect(byPath.get(settingsPath)?.role).toBe('settings');
    expect(byPath.get(settingsPath)?.recommendedUsage).toBe('support-only');
    expect(byPath.get(settingsPath)?.unsafeForTextOverlay).toBe(true);

    expect(byPath.get(chatPath)?.role).toBe('communication');
    expect(byPath.get(chatPath)?.occupiedRegions).toEqual(expect.arrayContaining(['left', 'right']));
    expect(byPath.get(chatPath)?.unsafeForTextOverlay).toBe(true);

    expect(byPath.get(dashboardPath)?.role).toBe('home');
    expect(byPath.get(dashboardPath)?.cropSuitability).toBe('high');

    expect(byPath.get(reportPath)?.role).toBe('detail');
    expect(byPath.get(reportPath)?.cropSuitability).toBe('high');
    expect(byPath.get(reportPath)?.heroExplanation.some((line) => line.includes('Raster layout suggests dashboard/reporting structure'))).toBe(true);
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

  it('extends deterministic non-OCR semantic inference to workflow and discovery layouts', async () => {
    const workflowPath = await makePngFile('workflow-builder.png', 120, 200, (x, y) => {
      if (x > 18 && x < 74 && y > 10 && y < 22) return [148, 163, 184, 255];
      if (y < 28) return [241, 245, 249, 255];
      if (x > 22 && x < 98 && y > 34 && y < 48) return [203, 213, 225, 255];
      if (x > 34 && x < 86 && y > 60 && y < 148) return [99, 102, 241, 255];
      if ((x > 40 && x < 80 && y > 76 && y < 90) || (x > 40 && x < 80 && y > 100 && y < 114)) return [165, 180, 252, 255];
      if (x > 26 && x < 94 && y > 164 && y < 186) return [16, 185, 129, 255];
      return [226, 232, 240, 255];
    });
    const discoveryPath = await makePngFile('discover-feed.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if (x > 16 && x < 104 && y > 34 && y < 48) return [226, 232, 240, 255];
      const inCardRow =
        ((x > 10 && x < 54) || (x > 66 && x < 110))
        && ((y > 58 && y < 92) || (y > 104 && y < 138) || (y > 150 && y < 184));
      if (inCardRow) return [59, 130, 246, 255];
      return [241, 245, 249, 255];
    });

    const analysis = await analyzeScreenshotSet([
      { path: workflowPath, note: 'Project workflow' },
      { path: discoveryPath, note: 'Template discovery feed' },
    ]);

    const byPath = new Map(analysis.map((entry) => [entry.path, entry]));
    expect(byPath.get(workflowPath)?.role).toBe('workflow');
    expect(byPath.get(workflowPath)?.density).toBe('minimal');
    expect(byPath.get(workflowPath)?.heroExplanation.some((line) => line.includes('Workflow screens often explain the core value quickly'))).toBe(true);

    expect(byPath.get(discoveryPath)?.role).toBe('discovery');
    expect(byPath.get(discoveryPath)?.cropSuitability).toBe('high');
    expect(byPath.get(discoveryPath)?.heroExplanation.some((line) => line.includes('Discovery screens can sell breadth and exploration'))).toBe(true);
  });

  it('uses local cue families to distinguish editor, profile, and catalog screenshots beyond the core role set', async () => {
    const editorPath = await makePngFile('template-editor-canvas.png', 120, 200, (x, y) => {
      if (y < 26) return [241, 245, 249, 255];
      if (x > 22 && x < 98 && y > 34 && y < 156) return [99, 102, 241, 255];
      if (x > 26 && x < 94 && y > 166 && y < 186) return [203, 213, 225, 255];
      return [226, 232, 240, 255];
    });
    const catalogPath = await makePngFile('shop-catalog-grid.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      const inCardRow =
        ((x > 10 && x < 54) || (x > 66 && x < 110))
        && ((y > 54 && y < 92) || (y > 102 && y < 140) || (y > 150 && y < 188));
      if (inCardRow) return [59, 130, 246, 255];
      return [241, 245, 249, 255];
    });
    const profilePath = await makePngFile('creator-profile-community.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });

    const analysis = await analyzeScreenshotSet([
      { path: editorPath, note: 'Template editor canvas with layers and tools' },
      { path: catalogPath, note: 'Product catalog collection with featured items' },
      { path: profilePath, note: 'Creator profile for community members and followers' },
    ]);

    const byPath = new Map(analysis.map((entry) => [entry.path, entry]));
    expect(byPath.get(editorPath)?.role).toBe('workflow');
    expect(byPath.get(editorPath)?.heroExplanation.some((line) => line.includes('hands-on creation'))).toBe(true);

    expect(byPath.get(catalogPath)?.role).toBe('discovery');
    expect(byPath.get(catalogPath)?.heroExplanation.some((line) => line.includes('browse story'))).toBe(true);

    expect(byPath.get(profilePath)?.role).toBe('detail');
    expect(byPath.get(profilePath)?.heroExplanation.some((line) => line.includes('identity, trust, and social proof'))).toBe(true);
  });

  it('uses local cue families to distinguish map and media screenshots beyond the core role set', async () => {
    const mapPath = await makePngFile('nearby-route-map.png', 120, 200, (x, y) => {
      if (y < 26) return [248, 250, 252, 255];
      if (x > 18 && x < 102 && y > 36 && y < 168) return [134, 239, 172, 255];
      if (x > 28 && x < 92 && y > 150 && y < 182) return [226, 232, 240, 255];
      return [219, 234, 254, 255];
    });
    const mediaPath = await makePngFile('now-playing-audio-queue.png', 120, 200, (x, y) => {
      if (y < 24) return [15, 23, 42, 255];
      if (x > 18 && x < 102 && y > 34 && y < 122) return [217, 70, 239, 255];
      if (x > 24 && x < 96 && y > 136 && y < 184) return [148, 163, 184, 255];
      return [30, 41, 59, 255];
    });

    const analysis = await analyzeScreenshotSet([
      { path: mapPath, note: 'Nearby map for routes, pickups, and city locations' },
      { path: mediaPath, note: 'Now playing audio queue with playlists and episodes' },
    ]);

    const byPath = new Map(analysis.map((entry) => [entry.path, entry]));
    expect(byPath.get(mapPath)?.role).toBe('discovery');
    expect(byPath.get(mapPath)?.heroExplanation.some((line) => line.includes('real-world coverage'))).toBe(true);

    expect(byPath.get(mediaPath)?.role).toBe('detail');
    expect(byPath.get(mediaPath)?.heroExplanation.some((line) => line.includes('ongoing engagement'))).toBe(true);
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
      expect(plan.variants[1].frameStrategy?.defaultTreatment).toBe('mixed');
      expect(plan.variants[1].frameStrategy?.framelessAllowedWhen.length ?? 0).toBeGreaterThan(0);
      expect(plan.variants[1].screens.some((screen) => screen.composition !== 'single')).toBe(true);
      expect(plan.variants[1].screens.some((screen) => (screen.extraScreenshots?.length ?? 0) > 0)).toBe(true);
      expect(plan.variants[1].screens.some((screen) => Boolean(screen.focalPoint))).toBe(true);
      expect(plan.variants[1].screens.some((screen) => screen.copyDirection.includes('Keep it extra short') || screen.copyDirection.includes('broader than a literal feature caption'))).toBe(true);
      expect(plan.variants[1].screens.every((screen) => Boolean(screen.cropPlan))).toBe(true);
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
      expect(plan.variants[2].frameStrategy?.defaultTreatment).toBe('mixed');
      expect(plan.variants[2].frames?.some((frame) => Boolean(frame.focalPoint))).toBe(true);
      expect(plan.variants[2].canvasPlan.requiredElements.some((el) => el.type === 'group')).toBe(true);
      expect(plan.variants[2].canvasPlan.requiredElements.some((el) => el.type === 'logo')).toBe(true);
      expect(plan.variants[2].frames?.every((frame) => frame.cropSuitability)).toBe(true);
      expect(plan.variants[2].frames?.every((frame) => Boolean(frame.cropPlan))).toBe(true);
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

  it('adds OCR-aware copy and crop guidance into the variant plan output', async () => {
    const heroPath = await makePngFile('home-overview.png', 120, 200, (x, y) => {
      if (y < 46) return [246, 247, 250, 255];
      if (x > 28 && x < 92 && y > 58 && y < 178) return [37, 99, 235, 255];
      return [226, 232, 240, 255];
    });
    const paywallPath = await makePngFile('premium-offer.png', 120, 200, (x, y) => {
      if (y < 40) return [17, 24, 39, 255];
      if (x > 18 && x < 102 && y > 56 && y < 176) return [99, 102, 241, 255];
      return [30, 41, 59, 255];
    });
    const detailPath = await makePngFile('insights-detail.png', 120, 200, (x, y) => {
      if (y < 34) return [244, 246, 248, 255];
      if ((x > 18 && x < 104 && y > 64 && y < 86) || (x > 24 && x < 98 && y > 114 && y < 164)) {
        return [16, 185, 129, 255];
      }
      return [203, 213, 225, 255];
    });
    const paywallOcrPath = await makeJsonFile('premium-offer.ocr.json', {
      source: 'agent-vision',
      roleHint: 'paywall',
      blocks: [
        { text: 'Upgrade to Pro', x: 12, y: 8, width: 60, height: 10, confidence: 0.99 },
        { text: 'Start 7 day trial', x: 12, y: 22, width: 70, height: 8, confidence: 0.97 },
      ],
    });

    const plan = await buildVariantSetPlan({
      appName: 'Pulse+',
      appDescription: 'A premium social app for creator communities and shared conversations.',
      platforms: ['ios'],
      features: ['Creator communities', 'Premium chat', 'Shared posts'],
      screenshots: [
        { path: heroPath, note: 'Community overview' },
        { path: paywallPath, ocrJsonPath: paywallOcrPath },
        { path: detailPath, note: 'Post insights' },
      ],
      goals: ['Feel premium', 'Stay readable'],
      variantCount: 4,
      screenCount: 3,
    });

    const paywallSummary = plan.selectedScreens.find((screen) => screen.path === paywallPath);
    expect(paywallSummary?.embeddedTextSample).toContain('Upgrade to Pro');
    expect(paywallSummary?.textOccupiedRegions).toContain('top');

    const conceptA = plan.variants[0];
    expect(conceptA?.frameStrategy?.defaultTreatment).toBe('framed');

    if (plan.variants[1]?.mode === 'individual') {
      const paywallScreen = plan.variants[1].screens.find((screen) => screen.sourcePath === paywallPath);
      expect(paywallScreen?.copyDirection).toContain('Avoid reusing embedded UI text');
      expect(paywallScreen?.cropPlan?.avoidRegions).toContain('top');
    }

    if (plan.variants[2]?.mode === 'panoramic') {
      const paywallFrame = plan.variants[2].frames?.find((frame) => frame.sourcePath === paywallPath);
      expect(paywallFrame?.cropPlan?.avoidRegions).toContain('top');
      expect(paywallFrame?.cropPlan?.rationale).toContain('Avoid text-heavy regions');
    }
  });

  it('uses raster-only semantics to drive occupied-region output and richer per-role planning', async () => {
    const onboardingPath = await makePngFile('welcome-flow.png', 120, 200, (x, y) => {
      if (y < 54) return [250, 250, 252, 255];
      if (x > 26 && x < 94 && y > 64 && y < 146) return [99, 102, 241, 255];
      if (x > 24 && x < 96 && y > 162 && y < 184) return [16, 185, 129, 255];
      return [241, 245, 249, 255];
    });
    const paywallPath = await makePngFile('premium-offer.png', 120, 200, (x, y) => {
      if (x > 14 && x < 106 && y > 42 && y < 166) return [79, 70, 229, 255];
      if (x > 24 && x < 96 && y > 170 && y < 190) return [245, 158, 11, 255];
      return [15, 23, 42, 255];
    });
    const chatPath = await makePngFile('chat-thread.png', 120, 200, (x, y) => {
      if (y < 32) return [244, 246, 248, 255];
      if ((x > 8 && x < 74 && y > 48 && y < 66)
        || (x > 44 && x < 112 && y > 78 && y < 98)
        || (x > 10 && x < 72 && y > 114 && y < 132)
        || (x > 46 && x < 110 && y > 146 && y < 164)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const settingsPath = await makePngFile('settings-screen.png', 120, 200, (x, y) => {
      if (y < 30) return [244, 246, 248, 255];
      const inRow = y > 42 && y < 182 && y % 22 < 12;
      if (inRow && x > 10 && x < 110) return [203, 213, 225, 255];
      return [226, 232, 240, 255];
    });

    const plan = await buildVariantSetPlan({
      appName: 'Pulse+',
      appDescription: 'A premium social app for creator communities, onboarding, and shared conversations.',
      platforms: ['ios'],
      features: ['Creator communities', 'Premium chat', 'Shared posts'],
      screenshots: [
        { path: onboardingPath },
        { path: paywallPath },
        { path: chatPath },
        { path: settingsPath },
      ],
      goals: ['Feel premium', 'Stay readable'],
      variantCount: 4,
      screenCount: 4,
    });

    const selectedPaywall = plan.selectedScreens.find((screen) => screen.path === paywallPath);
    const selectedChat = plan.selectedScreens.find((screen) => screen.path === chatPath);
    expect(selectedPaywall?.textOccupiedRegions).toContain('bottom');
    expect(selectedChat?.textOccupiedRegions).toEqual(expect.arrayContaining(['left', 'right']));

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const onboardingScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === onboardingPath);
      const paywallScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === paywallPath);
      const chatScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === chatPath);
      const settingsScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === settingsPath);

      expect(onboardingScreen?.backgroundStrategy).toBe('airy-spotlight');
      expect(paywallScreen?.backgroundStrategy).toBe('premium-spotlight');
      expect(chatScreen?.copyDirection).toContain('Keep the message social and immediate');
      expect(chatScreen?.implementationNote).toContain('message lanes readable');
      expect(settingsScreen?.composition).toBe('duo-split');
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const paywallFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === paywallPath);
      const chatFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === chatPath);

      expect(paywallFrame?.compositionFeatures).toContain('proof-stack');
      expect(chatFrame?.compositionNote).toContain('alternating message rhythm');
    }
  });

  it('adds workflow and discovery-specific planning reactions from deterministic non-OCR screenshots', async () => {
    const workflowPath = await makePngFile('workflow-builder.png', 120, 200, (x, y) => {
      if (x > 18 && x < 74 && y > 10 && y < 22) return [148, 163, 184, 255];
      if (y < 28) return [241, 245, 249, 255];
      if (x > 22 && x < 98 && y > 34 && y < 48) return [203, 213, 225, 255];
      if (x > 34 && x < 86 && y > 60 && y < 148) return [99, 102, 241, 255];
      if ((x > 40 && x < 80 && y > 76 && y < 90) || (x > 40 && x < 80 && y > 100 && y < 114)) return [165, 180, 252, 255];
      if (x > 26 && x < 94 && y > 164 && y < 186) return [16, 185, 129, 255];
      return [226, 232, 240, 255];
    });
    const discoveryPath = await makePngFile('discover-feed.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if (x > 16 && x < 104 && y > 34 && y < 48) return [226, 232, 240, 255];
      const inCardRow =
        ((x > 10 && x < 54) || (x > 66 && x < 110))
        && ((y > 58 && y < 92) || (y > 104 && y < 138) || (y > 150 && y < 184));
      if (inCardRow) return [59, 130, 246, 255];
      return [241, 245, 249, 255];
    });
    const reportPath = await makePngFile('screen-13.png', 120, 200, (x, y) => {
      if (y < 32) return [244, 246, 248, 255];
      if ((x > 16 && x < 104 && y > 54 && y < 78)
        || (x > 16 && x < 104 && y > 96 && y < 124)
        || (x > 18 && x < 102 && y > 138 && y < 176)) {
        return [16, 185, 129, 255];
      }
      return [203, 213, 225, 255];
    });
    const homePath = await makePngFile('screen-14.png', 120, 200, (x, y) => {
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
      variantCount: 4,
      screenCount: 4,
    });

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const workflowScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === workflowPath);
      const discoveryScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === discoveryPath);

      expect(workflowScreen?.backgroundStrategy).toBe('workflow-surface');
      expect(workflowScreen?.composition).not.toBe('single');
      expect(workflowScreen?.implementationNote).toContain('action path');

      expect(discoveryScreen?.backgroundStrategy).toBe('discovery-glow');
      expect(discoveryScreen?.copyDirection).toContain('exploratory and broad');
      expect(discoveryScreen?.implementationNote).toContain('browse cards');
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const workflowFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === workflowPath);
      const discoveryFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === discoveryPath);

      expect(workflowFrame?.compositionFeatures).toContain('proof-stack');
      expect(workflowFrame?.compositionNote).toContain('action path');
      expect(discoveryFrame?.compositionFeatures).toContain('decorative-cluster');
      expect(discoveryFrame?.compositionNote).toContain('browse cards');
    }
  });

  it('adds editor, catalog, and profile-specific planning reactions from local screenshot cues', async () => {
    const editorPath = await makePngFile('template-editor-canvas.png', 120, 200, (x, y) => {
      if (y < 26) return [241, 245, 249, 255];
      if (x > 22 && x < 98 && y > 34 && y < 156) return [99, 102, 241, 255];
      if (x > 26 && x < 94 && y > 166 && y < 186) return [203, 213, 225, 255];
      return [226, 232, 240, 255];
    });
    const catalogPath = await makePngFile('shop-catalog-grid.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      const inCardRow =
        ((x > 10 && x < 54) || (x > 66 && x < 110))
        && ((y > 54 && y < 92) || (y > 102 && y < 140) || (y > 150 && y < 188));
      if (inCardRow) return [59, 130, 246, 255];
      return [241, 245, 249, 255];
    });
    const profilePath = await makePngFile('creator-profile-community.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });
    const homePath = await makePngFile('main-dashboard.png', 120, 200, (x, y) => {
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

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const editorScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === editorPath);
      const catalogScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === catalogPath);
      const profileScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === profilePath);

      expect(editorScreen?.backgroundStrategy).toBe('studio-surface');
      expect(editorScreen?.copyDirection).toContain('creative control or making progress');
      expect(editorScreen?.implementationNote).toContain('main workspace dominant');

      expect(catalogScreen?.backgroundStrategy).toBe('catalog-glow');
      expect(catalogScreen?.copyDirection).toContain('range, curation, or choice');
      expect(catalogScreen?.implementationNote).toContain('curated assortment');

      expect(profileScreen?.backgroundStrategy).toBe('community-spotlight');
      expect(profileScreen?.copyDirection).toContain('identity, trust, or community momentum');
      expect(profileScreen?.implementationNote).toContain('creator proof');
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const editorFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === editorPath);
      const catalogFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === catalogPath);
      const profileFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === profilePath);

      expect(editorFrame?.compositionFeatures).toContain('toolbar-ribbon');
      expect(editorFrame?.compositionNote).toContain('tool-ribbon treatment');

      expect(catalogFrame?.compositionFeatures).toContain('browse-strip');
      expect(catalogFrame?.compositionNote).toContain('curated strip');

      expect(profileFrame?.compositionFeatures).toContain('profile-orbit');
      expect(profileFrame?.compositionNote).toContain('creator/profile spotlight');
    }
  });

  it('adds map and media-specific planning reactions from local screenshot cues', async () => {
    const mapPath = await makePngFile('nearby-route-map.png', 120, 200, (x, y) => {
      if (y < 26) return [248, 250, 252, 255];
      if (x > 18 && x < 102 && y > 36 && y < 168) return [134, 239, 172, 255];
      if (x > 28 && x < 92 && y > 150 && y < 182) return [226, 232, 240, 255];
      return [219, 234, 254, 255];
    });
    const mediaPath = await makePngFile('now-playing-audio-queue.png', 120, 200, (x, y) => {
      if (y < 24) return [15, 23, 42, 255];
      if (x > 18 && x < 102 && y > 34 && y < 122) return [217, 70, 239, 255];
      if (x > 24 && x < 96 && y > 136 && y < 184) return [148, 163, 184, 255];
      return [30, 41, 59, 255];
    });
    const homePath = await makePngFile('city-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 92)
        || (x > 68 && x < 108 && y > 54 && y < 92)
        || (x > 12 && x < 52 && y > 106 && y < 144)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const profilePath = await makePngFile('guide-profile.png', 120, 200, (x, y) => {
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

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const mapScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === mapPath);
      const mediaScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === mediaPath);

      expect(mapScreen?.backgroundStrategy).toBe('route-glow');
      expect(mapScreen?.copyDirection).toContain('guidance, proximity, or real-world confidence');
      expect(mapScreen?.implementationNote).toContain('route or nearby context legible');

      expect(mediaScreen?.backgroundStrategy).toBe('playback-stage');
      expect(mediaScreen?.copyDirection).toContain('mood, momentum, or what is playing');
      expect(mediaScreen?.implementationNote).toContain('now-playing surface prominent');
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const mapFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === mapPath);
      const mediaFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === mediaPath);

      expect(mapFrame?.compositionFeatures).toContain('route-arc');
      expect(mapFrame?.compositionNote).toContain('route-arc treatment');

      expect(mediaFrame?.compositionFeatures).toContain('media-marquee');
      expect(mediaFrame?.compositionNote).toContain('playback marquee');
    }

    const boldConcept = plan.variants[3];
    expect(boldConcept?.mode).toBe('panoramic');
    if (boldConcept?.mode === 'panoramic') {
      const mediaFrame = boldConcept.frames?.find((frame) => frame.sourcePath === mediaPath);
      expect(mediaFrame?.compositionFeatures).toContain('media-marquee');
    }
  });

  it('adds capture and schedule-specific planning reactions from local screenshot cues', async () => {
    const capturePath = await makePngFile('receipt-camera-capture.png', 120, 200, (x, y) => {
      if (y < 26) return [15, 23, 42, 255];
      if (x > 20 && x < 100 && y > 34 && y < 160) return [30, 41, 59, 255];
      if (x > 42 && x < 78 && y > 168 && y < 190) return [248, 250, 252, 255];
      return [51, 65, 85, 255];
    });
    const schedulePath = await makePngFile('team-calendar-agenda.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if (x < 28 && y > 38 && y < 184 && y % 28 < 18) return [203, 213, 225, 255];
      if (x > 34 && x < 104 && y > 42 && y < 182 && y % 28 < 16) return [96, 165, 250, 255];
      return [241, 245, 249, 255];
    });
    const homePath = await makePngFile('team-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 52 && y < 88)
        || (x > 68 && x < 108 && y > 52 && y < 88)
        || (x > 12 && x < 52 && y > 104 && y < 140)) {
        return [37, 99, 235, 255];
      }
      return [226, 232, 240, 255];
    });
    const editorPath = await makePngFile('story-editor.png', 120, 200, (x, y) => {
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

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const captureScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === capturePath);
      const scheduleScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === schedulePath);

      expect(captureScreen?.backgroundStrategy).toBe('capture-stage');
      expect(captureScreen?.copyDirection).toContain('capturing, scanning, or live framing confidence');
      expect(captureScreen?.implementationNote).toContain('live preview or subject area clear');
      expect(['hero-tilt', 'duo-overlap']).toContain(captureScreen?.composition);

      expect(scheduleScreen?.backgroundStrategy).toBe('timeline-surface');
      expect(scheduleScreen?.copyDirection).toContain('timing, readiness, or the next planned moment');
      expect(scheduleScreen?.implementationNote).toContain('chronological rhythm');
      expect(scheduleScreen?.composition).toBe('duo-split');
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const captureFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === capturePath);
      const scheduleFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === schedulePath);

      expect(captureFrame?.compositionFeatures).toContain('capture-focus');
      expect(captureFrame?.compositionNote).toContain('capture-focus treatment');

      expect(scheduleFrame?.compositionFeatures).toContain('timeline-band');
      expect(scheduleFrame?.compositionNote).toContain('timeline band');
    }

    const boldConcept = plan.variants[3];
    expect(boldConcept?.mode).toBe('panoramic');
    if (boldConcept?.mode === 'panoramic') {
      const captureFrame = boldConcept.frames?.find((frame) => frame.sourcePath === capturePath);
      const scheduleFrame = boldConcept.frames?.find((frame) => frame.sourcePath === schedulePath);

      expect(captureFrame?.compositionFeatures).toContain('capture-focus');
      expect(scheduleFrame?.compositionFeatures).toContain('timeline-band');
    }
  });

  it('adds commerce and security-specific planning reactions from local screenshot cues', async () => {
    const commercePath = await makePngFile('checkout-cart-delivery.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if (x > 16 && x < 104 && y > 42 && y < 118) return [251, 191, 36, 255];
      if (x > 20 && x < 100 && y > 128 && y < 164) return [226, 232, 240, 255];
      if (x > 30 && x < 90 && y > 172 && y < 190) return [37, 99, 235, 255];
      return [255, 247, 237, 255];
    });
    const securityPath = await makePngFile('passkey-secure-login.png', 120, 200, (x, y) => {
      if (y < 30) return [15, 23, 42, 255];
      if (x > 24 && x < 96 && y > 42 && y < 150) return [30, 41, 59, 255];
      if (x > 34 && x < 86 && y > 166 && y < 186) return [59, 130, 246, 255];
      return [15, 23, 42, 255];
    });
    const homePath = await makePngFile('shop-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 92)
        || (x > 68 && x < 108 && y > 54 && y < 92)
        || (x > 12 && x < 52 && y > 106 && y < 144)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const profilePath = await makePngFile('member-profile.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });

    const analysis = await analyzeScreenshotSet([
      { path: commercePath, note: 'Checkout cart with delivery status and order handoff' },
      { path: securityPath, note: 'Secure passkey login with identity verification and privacy protection' },
      { path: homePath, note: 'Shop home' },
      { path: profilePath, note: 'Member profile' },
    ]);
    const commerceAnalysis = analysis.find((entry) => entry.path === commercePath);
    expect(commerceAnalysis?.role).not.toBe('paywall');

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

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const commerceScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === commercePath);
      const securityScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === securityPath);

      expect(commerceScreen?.backgroundStrategy).toBe('checkout-lane');
      expect(commerceScreen?.copyDirection).toContain('purchase confidence, cart momentum, or order follow-through');
      expect(commerceScreen?.implementationNote).toContain('cart, offer, or delivery momentum');
      expect(['hero-tilt', 'duo-overlap', 'fanned-cards']).toContain(commerceScreen?.composition);

      expect(securityScreen?.backgroundStrategy).toBe('vault-glow');
      expect(securityScreen?.copyDirection).toContain('trusted access, privacy, or verification confidence');
      expect(securityScreen?.implementationNote).toContain('verification step or trusted identity signal clear');
      expect(securityScreen?.composition).toBe('duo-split');
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const commerceFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === commercePath);
      const securityFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === securityPath);

      expect(commerceFrame?.compositionFeatures).toContain('checkout-lane');
      expect(commerceFrame?.compositionNote).toContain('checkout-lane treatment');

      expect(securityFrame?.compositionFeatures).toContain('trust-shield');
      expect(securityFrame?.compositionNote).toContain('trust-shield treatment');
    }

    const boldConcept = plan.variants[3];
    expect(boldConcept?.mode).toBe('panoramic');
    if (boldConcept?.mode === 'panoramic') {
      const commerceFrame = boldConcept.frames?.find((frame) => frame.sourcePath === commercePath);
      const securityFrame = boldConcept.frames?.find((frame) => frame.sourcePath === securityPath);

      expect(commerceFrame?.compositionFeatures).toContain('checkout-lane');
      expect(securityFrame?.compositionFeatures).toContain('trust-shield');
    }
  });

  it('adds support and reward-specific planning reactions from local screenshot cues', async () => {
    const supportPath = await makePngFile('help-center-ticket-resolution.png', 120, 200, (x, y) => {
      if (y < 26) return [248, 250, 252, 255];
      if (x > 18 && x < 102 && y > 40 && y < 124) return [191, 219, 254, 255];
      if ((x > 24 && x < 96 && y > 136 && y < 154) || (x > 24 && x < 96 && y > 164 && y < 184)) {
        return [226, 232, 240, 255];
      }
      return [241, 245, 249, 255];
    });
    const rewardPath = await makePngFile('member-loyalty-rewards-perks.png', 120, 200, (x, y) => {
      if (y < 28) return [255, 247, 237, 255];
      if (x > 18 && x < 102 && y > 42 && y < 118) return [251, 191, 36, 255];
      if (x > 20 && x < 100 && y > 132 && y < 166) return [253, 230, 138, 255];
      if (x > 30 && x < 90 && y > 174 && y < 190) return [59, 130, 246, 255];
      return [255, 251, 235, 255];
    });
    const homePath = await makePngFile('member-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 92)
        || (x > 68 && x < 108 && y > 54 && y < 92)
        || (x > 12 && x < 52 && y > 106 && y < 144)) {
        return [59, 130, 246, 255];
      }
      return [226, 232, 240, 255];
    });
    const profilePath = await makePngFile('member-profile.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });

    const analysis = await analyzeScreenshotSet([
      { path: supportPath, note: 'Help center with support tickets, FAQ guidance, and resolution status' },
      { path: rewardPath, note: 'Member loyalty rewards with perks, points, cashback, and redemption' },
      { path: homePath, note: 'Member home' },
      { path: profilePath, note: 'Member profile' },
    ]);
    const supportAnalysis = analysis.find((entry) => entry.path === supportPath);
    const rewardAnalysis = analysis.find((entry) => entry.path === rewardPath);
    expect(supportAnalysis?.role).not.toBe('settings');
    expect(rewardAnalysis?.role).not.toBe('paywall');

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

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const supportScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === supportPath);
      const rewardScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === rewardPath);

      expect(supportScreen?.backgroundStrategy).toBe('care-surface');
      expect(supportScreen?.copyDirection).toContain('reassurance, guided help, or fast resolution');
      expect(supportScreen?.implementationNote).toContain('answer path or resolution state clear');
      expect(supportScreen?.composition).toBe('duo-split');

      expect(rewardScreen?.backgroundStrategy).toBe('perk-glow');
      expect(rewardScreen?.copyDirection).toContain('earned value, perks, or loyalty payoff');
      expect(rewardScreen?.implementationNote).toContain('earned-value surface');
      expect(['duo-overlap', 'fanned-cards']).toContain(rewardScreen?.composition);
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const supportFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === supportPath);
      const rewardFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === rewardPath);

      expect(supportFrame?.compositionFeatures).toContain('support-beacon');
      expect(supportFrame?.compositionNote).toContain('support-beacon treatment');

      expect(rewardFrame?.compositionFeatures).toContain('reward-ribbon');
      expect(rewardFrame?.compositionNote).toContain('reward-ribbon treatment');
    }

    const boldConcept = plan.variants[3];
    expect(boldConcept?.mode).toBe('panoramic');
    if (boldConcept?.mode === 'panoramic') {
      const supportFrame = boldConcept.frames?.find((frame) => frame.sourcePath === supportPath);
      const rewardFrame = boldConcept.frames?.find((frame) => frame.sourcePath === rewardPath);

      expect(supportFrame?.compositionFeatures).toContain('support-beacon');
      expect(rewardFrame?.compositionFeatures).toContain('reward-ribbon');
    }
  });

  it('adds activity and document-specific planning reactions from local screenshot cues', async () => {
    const activityPath = await makePngFile('community-activity-feed-updates.png', 120, 200, (x, y) => {
      if (y < 28) return [248, 250, 252, 255];
      if ((x > 12 && x < 38 && y > 42 && y < 68)
        || (x > 12 && x < 38 && y > 82 && y < 108)
        || (x > 12 && x < 38 && y > 122 && y < 148)) {
        return [59, 130, 246, 255];
      }
      if ((x > 44 && x < 104 && y > 44 && y < 72)
        || (x > 44 && x < 104 && y > 84 && y < 112)
        || (x > 44 && x < 104 && y > 124 && y < 152)) {
        return [191, 219, 254, 255];
      }
      return [241, 245, 249, 255];
    });
    const documentPath = await makePngFile('invoice-pdf-document-review.png', 120, 200, (x, y) => {
      if (y < 26) return [248, 250, 252, 255];
      if (x > 24 && x < 96 && y > 38 && y < 174) return [255, 255, 255, 255];
      if ((x > 34 && x < 86 && y > 54 && y < 66)
        || (x > 34 && x < 86 && y > 86 && y < 98)
        || (x > 34 && x < 86 && y > 118 && y < 130)
        || (x > 34 && x < 86 && y > 150 && y < 162)) {
        return [203, 213, 225, 255];
      }
      return [226, 232, 240, 255];
    });
    const homePath = await makePngFile('workspace-home.png', 120, 200, (x, y) => {
      if (y < 34) return [248, 250, 252, 255];
      if ((x > 12 && x < 52 && y > 54 && y < 92)
        || (x > 68 && x < 108 && y > 54 && y < 92)
        || (x > 12 && x < 52 && y > 106 && y < 144)) {
        return [99, 102, 241, 255];
      }
      return [226, 232, 240, 255];
    });
    const profilePath = await makePngFile('member-profile.png', 120, 200, (x, y) => {
      if (y < 40) return [250, 250, 252, 255];
      if (x > 22 && x < 98 && y > 50 && y < 106) return [244, 114, 182, 255];
      if ((x > 16 && x < 104 && y > 122 && y < 142) || (x > 22 && x < 98 && y > 154 && y < 178)) {
        return [226, 232, 240, 255];
      }
      return [255, 241, 242, 255];
    });

    const analysis = await analyzeScreenshotSet([
      { path: activityPath, note: 'Community activity feed with live updates, posts, likes, and comments' },
      { path: documentPath, note: 'PDF invoice review with signed pages, statement records, and approval status' },
      { path: homePath, note: 'Workspace home' },
      { path: profilePath, note: 'Member profile' },
    ]);
    const activityAnalysis = analysis.find((entry) => entry.path === activityPath);
    const documentAnalysis = analysis.find((entry) => entry.path === documentPath);
    expect(activityAnalysis?.role).not.toBe('communication');
    expect(documentAnalysis?.role).not.toBe('settings');

    const plan = await buildVariantSetPlan({
      appName: 'PulseDocs',
      appDescription: 'A team workspace for live activity, document review, and approval follow-through.',
      platforms: ['ios'],
      features: ['Activity feed', 'Document review', 'Approval history'],
      screenshots: [
        { path: activityPath, note: 'Community activity feed with live updates, posts, likes, and comments' },
        { path: documentPath, note: 'PDF invoice review with signed pages, statement records, and approval status' },
        { path: homePath, note: 'Workspace home' },
        { path: profilePath, note: 'Member profile' },
      ],
      goals: ['Feel active', 'Show clarity'],
      variantCount: 4,
      screenCount: 4,
    });

    const dynamicConcept = plan.variants[1];
    expect(dynamicConcept?.mode).toBe('individual');
    if (dynamicConcept?.mode === 'individual') {
      const activityScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === activityPath);
      const documentScreen = dynamicConcept.screens.find((screen) => screen.sourcePath === documentPath);

      expect(activityScreen?.backgroundStrategy).toBe('signal-burst');
      expect(activityScreen?.copyDirection).toContain('live activity, updates, or social momentum');
      expect(activityScreen?.implementationNote).toContain('live updates, reactions, or post cadence');
      expect(['duo-overlap', 'fanned-cards']).toContain(activityScreen?.composition);

      expect(documentScreen?.backgroundStrategy).toBe('folio-surface');
      expect(documentScreen?.copyDirection).toContain('clarity, review confidence, or record readiness');
      expect(documentScreen?.implementationNote).toContain('main page or approval state clear');
      expect(['duo-split', 'hero-tilt']).toContain(documentScreen?.composition);
    }

    const editorialConcept = plan.variants[2];
    expect(editorialConcept?.mode).toBe('panoramic');
    if (editorialConcept?.mode === 'panoramic') {
      const activityFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === activityPath);
      const documentFrame = editorialConcept.frames?.find((frame) => frame.sourcePath === documentPath);

      expect(activityFrame?.compositionFeatures).toContain('activity-wave');
      expect(activityFrame?.compositionNote).toContain('activity-wave treatment');
      expect(['open with live momentum', 'keep the feed cadence moving', 'land on follow-through']).toContain(activityFrame?.pacing);

      expect(documentFrame?.compositionFeatures).toContain('folio-stack');
      expect(documentFrame?.compositionNote).toContain('folio-stack treatment');
      expect(['open with focused proof', 'develop a readable record story', 'close on review confidence']).toContain(documentFrame?.pacing);
    }

    const boldConcept = plan.variants[3];
    expect(boldConcept?.mode).toBe('panoramic');
    if (boldConcept?.mode === 'panoramic') {
      const activityFrame = boldConcept.frames?.find((frame) => frame.sourcePath === activityPath);
      const documentFrame = boldConcept.frames?.find((frame) => frame.sourcePath === documentPath);

      expect(activityFrame?.compositionFeatures).toContain('activity-wave');
      expect(documentFrame?.compositionFeatures).toContain('folio-stack');
    }
  });

  it('adds role-specific copy guidance for onboarding, settings, and reporting-heavy screens', async () => {
    const onboardingPath = await makeSvgFile('welcome-screen.svg', 1290, 2796);
    const dashboardPath = await makeSvgFile('finance-home.svg', 1290, 2796);
    const settingsPath = await makeSvgFile('controls-screen.svg', 1290, 2796);
    const reportPath = await makeSvgFile('report-screen.svg', 1290, 2796);

    const onboardingOcrPath = await makeJsonFile('welcome-screen.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Welcome to FocusFlow', x: 0.12, y: 0.08, width: 0.42, height: 0.04, confidence: 0.99 },
        { text: 'Allow notifications', x: 0.2, y: 0.74, width: 0.34, height: 0.03, confidence: 0.97 },
        { text: 'Continue', x: 0.34, y: 0.84, width: 0.18, height: 0.03, confidence: 0.98 },
      ],
    });
    const settingsOcrPath = await makeJsonFile('controls-screen.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Account', x: 0.08, y: 0.14, width: 0.18, height: 0.03, confidence: 0.98 },
        { text: 'Notifications', x: 0.08, y: 0.24, width: 0.26, height: 0.03, confidence: 0.98 },
        { text: 'Privacy', x: 0.08, y: 0.34, width: 0.16, height: 0.03, confidence: 0.97 },
        { text: 'Appearance', x: 0.08, y: 0.44, width: 0.2, height: 0.03, confidence: 0.97 },
      ],
    });
    const dashboardOcrPath = await makeJsonFile('finance-home.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Dashboard', x: 0.08, y: 0.06, width: 0.2, height: 0.03, confidence: 0.99 },
        { text: 'Balance $12,430', x: 0.1, y: 0.22, width: 0.28, height: 0.03, confidence: 0.98 },
        { text: 'Spending $1,280', x: 0.56, y: 0.22, width: 0.26, height: 0.03, confidence: 0.98 },
        { text: 'Savings 18%', x: 0.1, y: 0.34, width: 0.2, height: 0.03, confidence: 0.97 },
        { text: 'Weekly activity', x: 0.1, y: 0.5, width: 0.24, height: 0.03, confidence: 0.97 },
      ],
    });
    const reportOcrPath = await makeJsonFile('report-screen.ocr.json', {
      source: 'agent-vision',
      blocks: [
        { text: 'Weekly report', x: 0.08, y: 0.06, width: 0.22, height: 0.03, confidence: 0.99 },
        { text: 'Revenue $18,240', x: 0.12, y: 0.22, width: 0.26, height: 0.03, confidence: 0.98 },
        { text: 'Conversion 8.4%', x: 0.12, y: 0.32, width: 0.26, height: 0.03, confidence: 0.97 },
        { text: 'Trend up 3.2%', x: 0.12, y: 0.42, width: 0.22, height: 0.03, confidence: 0.97 },
      ],
    });

    const plan = await buildVariantSetPlan({
      appName: 'Ledgerly',
      appDescription: 'Budgeting and reporting for money decisions.',
      platforms: ['ios'],
      features: ['Budget tracking', 'Cash flow reporting', 'Security controls'],
      screenshots: [
        { path: onboardingPath, ocrJsonPath: onboardingOcrPath },
        { path: dashboardPath, note: 'Main dashboard', ocrJsonPath: dashboardOcrPath },
        { path: settingsPath, note: 'Settings and preferences', ocrJsonPath: settingsOcrPath },
        { path: reportPath, note: 'Weekly finance report', ocrJsonPath: reportOcrPath },
      ],
      goals: ['Feel clear', 'Build trust'],
      variantCount: 4,
      screenCount: 4,
    });

    const individualScreens = plan.variants
      .filter((variant) => variant.mode === 'individual')
      .flatMap((variant) => variant.screens);

    expect(individualScreens.find((screen) => screen.sourcePath === onboardingPath)?.copyDirection).toContain(
      'permission or tutorial UI itself',
    );
    expect(individualScreens.find((screen) => screen.sourcePath === settingsPath)?.copyDirection).toContain(
      'Sell control, privacy, or personalization',
    );
    expect(individualScreens.find((screen) => screen.sourcePath === reportPath)?.copyDirection).toContain(
      'decision-ready payoff',
    );
  });
});
