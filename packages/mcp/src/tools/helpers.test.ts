import { describe, it, expect } from 'vitest';
import {
  isRecord,
  requireSlug,
  requireIndex,
  requireString,
  requireRecord,
  requireConfirm,
  wrapTextAsHtml,
  normalizeColor,
  suggestSimilar,
  unknownIdError,
  jsonContent,
} from './helpers.js';

describe('isRecord', () => {
  it('accepts plain objects', () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: 1 })).toBe(true);
  });
  it('rejects arrays, null, primitives', () => {
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord('foo')).toBe(false);
    expect(isRecord(42)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
  });
});

describe('requireSlug', () => {
  it('returns the slug when present', () => {
    expect(requireSlug({ slug: 'my-project' })).toBe('my-project');
  });
  it('throws when missing or empty', () => {
    expect(() => requireSlug({})).toThrow(/`slug` is required/);
    expect(() => requireSlug({ slug: '' })).toThrow(/`slug` is required/);
    expect(() => requireSlug({ slug: 42 })).toThrow(/`slug` is required/);
  });
});

describe('requireIndex', () => {
  it('accepts non-negative integers including 0', () => {
    expect(requireIndex({ index: 0 })).toBe(0);
    expect(requireIndex({ index: 5 })).toBe(5);
  });
  it('rejects negatives, floats, and non-numbers', () => {
    expect(() => requireIndex({ index: -1 })).toThrow();
    expect(() => requireIndex({ index: 1.5 })).toThrow();
    expect(() => requireIndex({ index: '0' })).toThrow();
    expect(() => requireIndex({})).toThrow();
  });
});

describe('requireString / requireRecord / requireConfirm', () => {
  it('requireString returns non-empty strings, rejects otherwise', () => {
    expect(requireString({ name: 'foo' }, 'name')).toBe('foo');
    expect(() => requireString({ name: '' }, 'name')).toThrow();
    expect(() => requireString({}, 'name')).toThrow();
  });
  it('requireRecord returns the object or throws', () => {
    expect(requireRecord({ a: 1 }, 'tool')).toEqual({ a: 1 });
    expect(() => requireRecord(null, 'tool')).toThrow(/tool requires/);
    expect(() => requireRecord([], 'tool')).toThrow();
  });
  it('requireConfirm only passes when confirm === true', () => {
    expect(() => requireConfirm({ confirm: true }, 'del', 'delete X')).not.toThrow();
    expect(() => requireConfirm({}, 'del', 'delete X')).toThrow(/permanently delete X/);
    expect(() => requireConfirm({ confirm: false }, 'del', 'delete X')).toThrow();
    expect(() => requireConfirm({ confirm: 'true' }, 'del', 'delete X')).toThrow();
  });
});

describe('wrapTextAsHtml', () => {
  it('wraps plain text in a centered paragraph', () => {
    expect(wrapTextAsHtml('Hello')).toBe('<p style="text-align: center;">Hello</p>');
  });
  it('passes HTML through unchanged', () => {
    const html = '<p style="text-align: left;">bar</p>';
    expect(wrapTextAsHtml(html)).toBe(html);
  });
  it('detects HTML even with leading whitespace', () => {
    expect(wrapTextAsHtml('  <p>bar</p>')).toBe('  <p>bar</p>');
  });
});

describe('normalizeColor', () => {
  it('passes display-p3 strings through unchanged', () => {
    const p3 = 'color(display-p3 0.5 0.5 0.5)';
    expect(normalizeColor(p3)).toBe(p3);
  });
  it('converts hex to display-p3', () => {
    const result = normalizeColor('#ff0000');
    expect(result).toMatch(/^color\(display-p3 /);
  });
  it('returns unrecognised strings unchanged (server will reject on save)', () => {
    expect(normalizeColor('not a color')).toBe('not a color');
  });
});

describe('suggestSimilar', () => {
  const pool = ['ios-6.9', 'ios-6.5', 'ios-6.3', 'android-phone', 'mac-2880x1800'];

  it('suggests close matches', () => {
    expect(suggestSimilar('ios-6.8', pool)).toContain('ios-6.9');
    expect(suggestSimilar('ios-69', pool)).toContain('ios-6.9');
  });
  it('returns empty when nothing is close', () => {
    expect(suggestSimilar('xyzabcdef-nothing-matches', pool, { maxDistance: 2 })).toEqual([]);
  });
  it('is case-insensitive', () => {
    expect(suggestSimilar('IOS-6.9', pool)).toContain('ios-6.9');
  });
  it('caps at `max` suggestions', () => {
    const result = suggestSimilar('ios', pool, { max: 2 });
    expect(result.length).toBeLessThanOrEqual(2);
  });
});

describe('unknownIdError', () => {
  it('includes did-you-mean suggestions when available', () => {
    const err = unknownIdError('frame', 'iphone-17-pro-mxa', ['iphone-17-pro-max', 'iphone-17']);
    expect(err.message).toContain('iphone-17-pro-max');
    expect(err.message).toContain('Did you mean');
  });
  it('falls back gracefully when no suggestions are close', () => {
    const err = unknownIdError('frame', 'qqq', ['ipad', 'mac']);
    expect(err.message).toContain('unknown frame "qqq"');
    expect(err.message).not.toContain('Did you mean');
  });
  it('appends the help hint when provided', () => {
    const err = unknownIdError('frame', 'qqq', [], 'Call list_frames.');
    expect(err.message).toContain('Call list_frames.');
  });
});

describe('jsonContent', () => {
  it('returns text content with pretty-printed JSON', () => {
    const result = jsonContent({ a: 1 });
    expect(result.content[0]).toEqual({
      type: 'text',
      text: '{\n  "a": 1\n}',
    });
  });
});
