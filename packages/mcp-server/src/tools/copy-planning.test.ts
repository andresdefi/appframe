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
    expect(selected.summary.headline.length).toBeGreaterThan(0);
    expect(selected.features.length).toBeGreaterThan(0);
  });

  it('penalizes weak headlines that join multiple ideas', () => {
    const weak = scoreHeadline('Track workouts and habits', 'hero');
    const strong = scoreHeadline('Stay on track', 'hero');

    expect(weak.score).toBeLessThan(strong.score);
    expect(weak.issues.some((issue) => issue.includes('"and"'))).toBe(true);
  });
});

