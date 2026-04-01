import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { VariantSetPlan } from './design-planning.js';

vi.mock('@appframe/core', () => ({
  loadConfig: vi.fn(async (configPath: string) => ({
    mode: configPath.includes('panoramic') ? 'panoramic' : 'individual',
    app: {
      name: 'FocusFlow',
      description: 'Stay on top of your routine',
      platforms: ['ios'],
      features: ['Daily planning'],
    },
    theme: {
      style: 'minimal',
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        background: '#F8FAFC',
        text: '#0F172A',
        subtitle: '#64748B',
      },
      font: 'inter',
      fontWeight: 600,
    },
    frames: { style: 'flat' },
    screens: [
      { screenshot: 'screen-1.png', headline: 'Own your day', layout: 'center', composition: 'single' },
    ],
    output: { platforms: ['ios'], directory: './output' },
  })),
}));

import { createSessionFromManifest, readSession } from './variant-session-lib.js';

describe('createSessionFromManifest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores explicit copy assignments for individual and panoramic concepts', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'appframe-session-lib-'));
    const manifestPath = join(dir, 'manifest.json');
    const individualConfigPath = join(dir, 'concept-a.config.yaml');
    const panoramicConfigPath = join(dir, 'concept-c.panoramic.config.yaml');

    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          app: { name: 'FocusFlow' },
          variants: [
            { id: 'concept-a', name: 'Clean Hero', mode: 'individual', configPath: individualConfigPath },
            { id: 'concept-c', name: 'Editorial Panorama', mode: 'panoramic', configPath: panoramicConfigPath },
          ],
        },
        null,
        2,
      ),
      'utf-8',
    );

    const selectedCopySet = {
      hero: {
        id: 'hero-1',
        slot: 'hero' as const,
        headline: 'Own\nyour day',
        subtitle: 'Show the workflow priorities and next step in one pass',
        wordCount: 3,
        subtitleWordCount: 10,
        score: 94,
        rationale: [],
        issues: [],
      },
      differentiator: {
        id: 'diff-1',
        slot: 'differentiator' as const,
        headline: 'Plan with focus',
        subtitle: 'Use the second beat to show clarity pace and control together',
        wordCount: 3,
        subtitleWordCount: 11,
        score: 90,
        rationale: [],
        issues: [],
      },
      features: [
        {
          id: 'feature-1',
          slot: 'feature' as const,
          headline: 'Track every habit',
          subtitle: 'Use the screen detail to show how habit tracking removes drag',
          sourceFeature: 'Habit tracking',
          wordCount: 3,
          subtitleWordCount: 11,
          score: 88,
          rationale: [],
          issues: [],
        },
      ],
      trust: {
        id: 'trust-1',
        slot: 'trust' as const,
        headline: 'Built for repeat use',
        subtitle: 'Show why the product is polished enough for repeat use',
        wordCount: 4,
        subtitleWordCount: 10,
        score: 85,
        rationale: [],
        issues: [],
      },
      summary: {
        id: 'summary-1',
        slot: 'summary' as const,
        headline: 'Everything that matters',
        subtitle: 'Close on the remaining benefit so the set finishes with range',
        wordCount: 3,
        subtitleWordCount: 11,
        score: 86,
        rationale: [],
        issues: [],
      },
    };

    const conceptPlan: VariantSetPlan = {
      app: {
        name: 'FocusFlow',
        description: 'Stay on top of your routine',
        category: 'productivity',
        platforms: ['ios'],
      },
      goals: ['Show calm planning', 'Reinforce daily consistency'],
      analysisSummary: {
        screenshotCount: 5,
        selectedCount: 5,
        roles: { home: 1, workflow: 2, detail: 1, settings: 1 },
        topHeroCandidate: '/shots/home.png',
        topHeroExplanation: ['Home/dashboard content usually makes the clearest opening hero.'],
      },
      selectedScreens: [
        { path: '/shots/home.png', role: 'home' as const, heroPriority: 92, inferredOrder: 1, focus: 'home flow', unsafeForTextOverlay: false },
        { path: '/shots/planner.png', role: 'workflow' as const, heroPriority: 84, inferredOrder: 2, focus: 'planner flow', unsafeForTextOverlay: false },
        { path: '/shots/habits.png', role: 'detail' as const, heroPriority: 78, inferredOrder: 3, focus: 'habit tracking', unsafeForTextOverlay: false },
        { path: '/shots/streaks.png', role: 'workflow' as const, heroPriority: 73, inferredOrder: 4, focus: 'streak proof', unsafeForTextOverlay: false },
        { path: '/shots/settings.png', role: 'settings' as const, heroPriority: 42, inferredOrder: 5, focus: 'settings', unsafeForTextOverlay: true },
      ],
      variants: [
        {
          id: 'concept-a',
          name: 'Clean Hero',
          currentCapabilityFit: 'supported_now' as const,
          mode: 'individual' as const,
          style: 'minimal',
          recipe: 'clean-hero',
          strategy: 'Lead with the cleanest hero screen.',
          screens: [
            {
              index: 1,
              sourcePath: '/shots/home.png',
              sourceRole: 'home' as const,
              slideRole: 'hero',
              layout: 'center' as const,
              composition: 'single' as const,
              backgroundStrategy: 'primary-tint',
              copyDirection: 'Lead with the primary outcome.',
              framing: 'framed' as const,
            },
            {
              index: 2,
              sourcePath: '/shots/planner.png',
              sourceRole: 'workflow' as const,
              slideRole: 'differentiator',
              layout: 'angled-right' as const,
              composition: 'single' as const,
              backgroundStrategy: 'consistent-light',
              copyDirection: 'Explain the differentiator.',
              framing: 'framed' as const,
            },
            {
              index: 3,
              sourcePath: '/shots/habits.png',
              sourceRole: 'detail' as const,
              slideRole: 'feature',
              layout: 'center' as const,
              composition: 'single' as const,
              backgroundStrategy: 'consistent-light',
              copyDirection: 'Show feature proof.',
              framing: 'framed' as const,
            },
            {
              index: 4,
              sourcePath: '/shots/streaks.png',
              sourceRole: 'workflow' as const,
              slideRole: 'trust',
              layout: 'angled-left' as const,
              composition: 'single' as const,
              backgroundStrategy: 'consistent-light',
              copyDirection: 'Reassure with trust.',
              framing: 'framed' as const,
            },
            {
              index: 5,
              sourcePath: '/shots/settings.png',
              sourceRole: 'settings' as const,
              slideRole: 'summary',
              layout: 'center' as const,
              composition: 'single' as const,
              backgroundStrategy: 'consistent-light',
              copyDirection: 'Close with the summary.',
              framing: 'framed' as const,
            },
          ],
        },
        {
          id: 'concept-c',
          name: 'Editorial Panorama',
          currentCapabilityFit: 'supported_now' as const,
          mode: 'panoramic' as const,
          style: 'editorial',
          recipe: 'editorial-panorama',
          strategy: 'Connect the story across the strip.',
          canvasPlan: {
            frameCount: 5,
            designGoal: 'Connected premium story.',
            requiredElements: [{ type: 'text' as const, purpose: 'headline beats' }],
          },
          frames: [
            { frame: 1, sourcePath: '/shots/home.png', sourceRole: 'home' as const, cropSuitability: 'low' as const, storyBeat: 'hero' },
            { frame: 2, sourcePath: '/shots/planner.png', sourceRole: 'workflow' as const, cropSuitability: 'medium' as const, storyBeat: 'differentiator' },
            { frame: 3, sourcePath: '/shots/habits.png', sourceRole: 'detail' as const, cropSuitability: 'high' as const, storyBeat: 'feature' },
            { frame: 4, sourcePath: '/shots/streaks.png', sourceRole: 'workflow' as const, cropSuitability: 'medium' as const, storyBeat: 'trust' },
            { frame: 5, sourcePath: '/shots/settings.png', sourceRole: 'settings' as const, cropSuitability: 'low' as const, storyBeat: 'summary' },
          ],
        },
      ],
    };

    const result = await createSessionFromManifest({
      manifestPath,
      conceptPlan,
      selectedCopySet,
    });

    expect(result.session.variants[0]?.copyAssignments).toEqual([
      {
        unitKind: 'screen',
        unitIndex: 1,
        slot: 'hero',
        headline: 'Own\nyour day',
        subtitle: 'Show the workflow priorities and next step in one pass',
        sourceFeature: undefined,
        sourcePath: '/shots/home.png',
        sourceRole: 'home',
      },
      {
        unitKind: 'screen',
        unitIndex: 2,
        slot: 'differentiator',
        headline: 'Plan with focus',
        subtitle: 'Use the second beat to show clarity pace and control together',
        sourceFeature: undefined,
        sourcePath: '/shots/planner.png',
        sourceRole: 'workflow',
      },
      {
        unitKind: 'screen',
        unitIndex: 3,
        slot: 'feature',
        headline: 'Track every habit',
        subtitle: 'Use the screen detail to show how habit tracking removes drag',
        sourceFeature: 'Habit tracking',
        sourcePath: '/shots/habits.png',
        sourceRole: 'detail',
      },
      {
        unitKind: 'screen',
        unitIndex: 4,
        slot: 'trust',
        headline: 'Built for repeat use',
        subtitle: 'Show why the product is polished enough for repeat use',
        sourceFeature: undefined,
        sourcePath: '/shots/streaks.png',
        sourceRole: 'workflow',
      },
      {
        unitKind: 'screen',
        unitIndex: 5,
        slot: 'summary',
        headline: 'Everything that matters',
        subtitle: 'Close on the remaining benefit so the set finishes with range',
        sourceFeature: undefined,
        sourcePath: '/shots/settings.png',
        sourceRole: 'settings',
      },
    ]);

    expect(result.session.variants[1]?.copyAssignments?.[2]).toEqual({
      unitKind: 'frame',
      unitIndex: 3,
      slot: 'feature',
      headline: 'Track every habit',
      subtitle: 'Use the screen detail to show how habit tracking removes drag',
      sourceFeature: 'Habit tracking',
      sourcePath: '/shots/habits.png',
      sourceRole: 'detail',
    });

    const persisted = JSON.parse(await readFile(result.sessionPath, 'utf-8')) as {
      variants: Array<{ copyAssignments?: unknown[] }>;
    };
    expect(persisted.variants[0]?.copyAssignments).toHaveLength(5);

    const readBack = await readSession(result.sessionPath);
    expect(readBack.variants[1]?.copyAssignments).toHaveLength(5);
  });
});
