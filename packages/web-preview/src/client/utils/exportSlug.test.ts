import { describe, it, expect } from 'vitest';
import { composeExportSlug } from './exportSlug';

describe('composeExportSlug', () => {
  it('returns just the project slug when no variant is active', () => {
    expect(composeExportSlug('Impostor Party Game', null, 0)).toBe('impostor-party-game');
    expect(composeExportSlug('Impostor Party Game', undefined, 0)).toBe('impostor-party-game');
  });

  it('returns just the project slug when only one variant exists', () => {
    // Single-variant projects don't need to disambiguate. New projects
    // start with one auto-generated "Concept A" variant so the common
    // case stays clean.
    expect(composeExportSlug('Spentio', 'Concept A', 1)).toBe('spentio');
    expect(composeExportSlug('My App', 'Anything', 1)).toBe('my-app');
  });

  it('appends the active variant slug when 2+ variants exist', () => {
    expect(composeExportSlug('Impostor Party Game', 'Variant 2', 2)).toBe(
      'impostor-party-game-variant-2',
    );
    expect(composeExportSlug('Spentio', 'Concept B', 3)).toBe('spentio-concept-b');
  });

  it('falls back to "project" when the project display name is empty', () => {
    expect(composeExportSlug('', null, 0)).toBe('project');
    expect(composeExportSlug(null, null, 0)).toBe('project');
    expect(composeExportSlug(undefined, null, 0)).toBe('project');
  });

  it('drops the variant suffix when the variant name is empty', () => {
    // Empty variant short-circuits to the project slug, same shape as
    // a no-variant export.
    expect(composeExportSlug('My App', '', 2)).toBe('my-app');
  });

  it('collapses punctuation and trims hyphen edges', () => {
    expect(composeExportSlug('Hello, World!', 'Concept A', 2)).toBe('hello-world-concept-a');
    expect(composeExportSlug('--Edge--Case--', 'Variant 1', 2)).toBe('edge-case-variant-1');
  });

  it('lowercases the entire slug', () => {
    expect(composeExportSlug('SHOUTING', 'CAPS LOCK', 2)).toBe('shouting-caps-lock');
  });
});
