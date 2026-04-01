import { describe, expect, it } from 'vitest';
import { generateCopyCandidates, scoreHeadline, selectCopySet } from './copy-planning.js';

describe('copy planning helpers', () => {
  it('generates slot-based copy candidates and selects a complete copy set', () => {
    const candidateSet = generateCopyCandidates({
      appName: 'FitFlow',
      appDescription: 'Workout planning that helps people stay consistent.',
      category: 'health',
      features: ['Workout plans', 'Progress tracking', 'Weekly routines'],
      goals: ['Show momentum', 'Feel premium'],
      screenshotCount: 5,
    });

    expect(candidateSet.slots.find((slot) => slot.slot === 'hero')?.candidates.length).toBeGreaterThan(0);
    expect(candidateSet.slots.filter((slot) => slot.slot === 'feature').length).toBeGreaterThan(0);

    const selected = selectCopySet(candidateSet);
    expect(selected.hero.headline.length).toBeGreaterThan(0);
    expect(selected.hero.subtitle?.length ?? 0).toBeGreaterThan(0);
    expect(selected.summary.headline.length).toBeGreaterThan(0);
    expect(selected.summary.subtitle?.length ?? 0).toBeGreaterThan(0);
    expect(selected.features.length).toBeGreaterThan(0);
  });

  it('penalizes weak headlines that join multiple ideas', () => {
    const weak = scoreHeadline('Track workouts and habits', 'hero');
    const strong = scoreHeadline('Stay on track', 'hero');

    expect(weak.score).toBeLessThan(strong.score);
    expect(weak.issues.some((issue) => issue.includes('"and"'))).toBe(true);
  });

  it('penalizes feature-list and feature-label headlines', () => {
    const weakList = scoreHeadline('Tasks habits reminders', 'hero');
    const weakLabel = scoreHeadline('Budget tracking', 'feature', 'Budget tracking');
    const strong = scoreHeadline('See your money clearly', 'hero');

    expect(weakList.score).toBeLessThan(strong.score);
    expect(weakList.issues.some((issue) => issue.includes('feature list'))).toBe(true);
    expect(weakLabel.issues.some((issue) => issue.includes('feature label'))).toBe(true);
  });

  it('uses screenshot-derived slot signals to steer candidate phrases', () => {
    const candidateSet = generateCopyCandidates({
      appName: 'Planit',
      appDescription: 'Daily planning with tasks, habits, and reminders.',
      category: 'productivity',
      features: ['Tasks', 'Widgets', 'Habit streaks'],
      screenshotCount: 5,
      screenSignals: [
        { slot: 'hero', sourceRole: 'workflow', focus: 'your day', density: 'minimal', topQuietRatio: 0.82 },
        { slot: 'differentiator', sourceRole: 'home', focus: 'everything in one view', density: 'balanced' },
        { slot: 'feature', sourceRole: 'detail', focus: 'habit streaks', unsafeForTextOverlay: true },
        { slot: 'trust', sourceRole: 'detail', focus: 'daily routine' },
        { slot: 'summary', sourceRole: 'home', focus: 'your day at a glance' },
      ],
    });

    const heroHeadlines = candidateSet.slots
      .find((slot) => slot.slot === 'hero')
      ?.candidates.map((candidate) => candidate.headline.replace(/\n/g, ' ')) ?? [];
    const featureHeadlines = candidateSet.slots
      .find((slot) => slot.slot === 'feature')
      ?.candidates.map((candidate) => candidate.headline.replace(/\n/g, ' ')) ?? [];
    const heroSubtitles = candidateSet.slots
      .find((slot) => slot.slot === 'hero')
      ?.candidates.map((candidate) => candidate.subtitle) ?? [];

    expect(heroHeadlines.some((headline) => /plan your day fast/i.test(headline))).toBe(true);
    expect(featureHeadlines.some((headline) => /habit streaks/i.test(headline))).toBe(true);
    expect(heroSubtitles.some((subtitle) => /workflow|priorities|next step/i.test(subtitle ?? ''))).toBe(true);
  });

  it('avoids repeating embedded UI text when OCR-derived text is present', () => {
    const candidateSet = generateCopyCandidates({
      appName: 'Pulse+',
      appDescription: 'A premium chat app for creator communities and group conversations.',
      category: 'social',
      features: ['Creator communities', 'Group chat', 'Shared posts'],
      screenshotCount: 5,
      screenSignals: [
        {
          slot: 'hero',
          sourceRole: 'paywall',
          focus: 'Upgrade to Pro',
          embeddedText: ['Upgrade to Pro', 'Start 7 day trial'],
          unsafeForTextOverlay: true,
        },
        { slot: 'differentiator', sourceRole: 'communication', focus: 'group chat' },
        { slot: 'feature', sourceRole: 'detail', focus: 'creator communities' },
        { slot: 'trust', sourceRole: 'detail', focus: 'premium access' },
        { slot: 'summary', sourceRole: 'home', focus: 'creator communities' },
      ],
    });

    const heroHeadlines = candidateSet.slots
      .find((slot) => slot.slot === 'hero')
      ?.candidates.map((candidate) => candidate.headline.replace(/\n/g, ' ')) ?? [];

    expect(heroHeadlines.some((headline) => /upgrade to pro/i.test(headline))).toBe(false);

    const selected = selectCopySet(candidateSet);
    expect(selected.hero.headline.replace(/\n/g, ' ')).not.toMatch(/upgrade to pro/i);
  });

  it('keeps the final selected copy set from collapsing onto repeated headlines', () => {
    const selected = selectCopySet({
      appName: 'Ledgerly',
      category: 'finance',
      generatedAt: new Date().toISOString(),
      rules: [],
      narrative: [],
      slots: [
        {
          slot: 'hero',
          candidates: [
            {
              id: 'hero-1',
              slot: 'hero',
              headline: 'Clear money\ndaily',
              wordCount: 3,
              score: 92,
              rationale: [],
              issues: [],
            },
          ],
        },
        {
          slot: 'differentiator',
          candidates: [
            {
              id: 'diff-1',
              slot: 'differentiator',
              headline: 'Clear budget\ndaily',
              wordCount: 3,
              score: 90,
              rationale: [],
              issues: [],
            },
            {
              id: 'diff-2',
              slot: 'differentiator',
              headline: 'Budgets with\ncontext',
              wordCount: 3,
              score: 84,
              rationale: [],
              issues: [],
            },
          ],
        },
        {
          slot: 'feature',
          sourceFeature: 'Budget tracking',
          candidates: [
            {
              id: 'feature-1',
              slot: 'feature',
              headline: 'Track every\nbudget',
              sourceFeature: 'Budget tracking',
              wordCount: 3,
              score: 86,
              rationale: [],
              issues: [],
            },
          ],
        },
        {
          slot: 'trust',
          candidates: [
            {
              id: 'trust-1',
              slot: 'trust',
              headline: 'Built for\ndaily trust',
              wordCount: 4,
              score: 83,
              rationale: [],
              issues: [],
            },
          ],
        },
        {
          slot: 'summary',
          candidates: [
            {
              id: 'summary-1',
              slot: 'summary',
              headline: 'Clear money\ndaily',
              wordCount: 3,
              score: 91,
              rationale: [],
              issues: [],
            },
            {
              id: 'summary-2',
              slot: 'summary',
              headline: 'Money moves\nwith clarity',
              wordCount: 4,
              score: 84,
              rationale: [],
              issues: [],
            },
          ],
        },
      ],
    });

    expect(selected.differentiator.headline).toBe('Budgets with\ncontext');
    expect(selected.summary.headline).toBe('Money moves\nwith clarity');
  });

  it('merges external copy back through rescoring before final selection', () => {
    const selected = selectCopySet(
      {
        appName: 'Ledgerly',
        category: 'finance',
        generatedAt: new Date().toISOString(),
        rules: [],
        narrative: [],
        slots: [
          {
            slot: 'hero',
            candidates: [
              {
                id: 'hero-1',
                slot: 'hero',
                headline: 'Track your\nmoney',
                subtitle: 'See every budget and transaction.',
                wordCount: 3,
                subtitleWordCount: 5,
                score: 78,
                rationale: [],
                issues: [],
              },
            ],
          },
          {
            slot: 'differentiator',
            candidates: [
              {
                id: 'diff-1',
                slot: 'differentiator',
                headline: 'Budgets with\ncontext',
                subtitle: 'Keep every category tied to the next decision.',
                wordCount: 3,
                subtitleWordCount: 9,
                score: 84,
                rationale: [],
                issues: [],
              },
            ],
          },
          {
            slot: 'feature',
            sourceFeature: 'Budget tracking',
            candidates: [
              {
                id: 'feature-1',
                slot: 'feature',
                headline: 'Track every\nbudget',
                subtitle: 'Zoom in on spending without losing the wider story.',
                sourceFeature: 'Budget tracking',
                wordCount: 3,
                subtitleWordCount: 9,
                score: 86,
                rationale: [],
                issues: [],
              },
            ],
          },
          {
            slot: 'trust',
            candidates: [
              {
                id: 'trust-1',
                slot: 'trust',
                headline: 'Built for\ndaily trust',
                subtitle: 'Reassure with reliable history and steady proof.',
                wordCount: 4,
                subtitleWordCount: 7,
                score: 82,
                rationale: [],
                issues: [],
              },
            ],
          },
          {
            slot: 'summary',
            candidates: [
              {
                id: 'summary-1',
                slot: 'summary',
                headline: 'Everything that\nmatters',
                subtitle: 'Close on the broader money story, not another feature.',
                wordCount: 3,
                subtitleWordCount: 9,
                score: 84,
                rationale: [],
                issues: [],
              },
            ],
          },
        ],
      },
      [
        {
          slot: 'hero',
          headline: 'Own your budget',
          subtitle: 'See cash flow, budgets, and spending in one calmer view.',
        },
      ],
    );

    expect(selected.hero.headline).toBe('Own your budget');
    expect(selected.hero.subtitle).toBe('See cash flow budgets and spending in one calmer view');
  });

  it('adds category-specific finance hero phrasing to the candidate pool', () => {
    const candidateSet = generateCopyCandidates({
      appName: 'Ledgerly',
      appDescription: 'Budgeting and cash flow tracking for everyday money decisions.',
      category: 'finance',
      features: ['Budget tracking', 'Cash flow reports', 'Spending alerts'],
      screenshotCount: 4,
    });

    const heroHeadlines = candidateSet.slots
      .find((slot) => slot.slot === 'hero')
      ?.candidates.map((candidate) => candidate.headline.replace(/\n/g, ' ')) ?? [];

    expect(heroHeadlines).toContain('See your money clearly');
  });

  it('keeps benefit-led feature headlines ahead of raw feature labels', () => {
    const candidateSet = generateCopyCandidates({
      appName: 'Ledgerly',
      appDescription: 'Budgeting and cash flow tracking for everyday money decisions.',
      category: 'finance',
      features: ['Budget tracking', 'Cash flow reports', 'Spending alerts'],
      screenshotCount: 4,
    });

    const featureCandidates = candidateSet.slots.find((slot) => slot.slot === 'feature')?.candidates ?? [];
    const normalizedHeadlines = featureCandidates.map((candidate) => candidate.headline.replace(/\n/g, ' '));

    expect(normalizedHeadlines[0]).not.toBe('Budget tracking');
    expect(normalizedHeadlines).not.toContain('Budget tracking');
  });
});
