import { describe, it, expect } from 'vitest';
import { isPathInside } from './pathSafety.js';

describe('isPathInside', () => {
  it('accepts a direct child', () => {
    expect(isPathInside('/tmp/app', '/tmp/app/screenshots/home.png')).toBe(true);
  });

  it('accepts a deeply nested descendant', () => {
    expect(isPathInside('/tmp/app', '/tmp/app/a/b/c/d/file.png')).toBe(true);
  });

  it('normalizes redundant segments', () => {
    expect(isPathInside('/tmp/app', '/tmp/app/foo/../bar/baz.png')).toBe(true);
  });

  // The original bug fix.
  it('rejects sibling directories that share a name prefix', () => {
    expect(isPathInside('/tmp/app', '/tmp/app-secrets/file.png')).toBe(false);
    expect(isPathInside('/tmp/app', '/tmp/app2/file.png')).toBe(false);
  });

  it('rejects escapes via ..', () => {
    expect(isPathInside('/tmp/app', '/tmp/app/../etc/passwd')).toBe(false);
    expect(isPathInside('/tmp/app', '/tmp/other/file')).toBe(false);
  });

  it('rejects an unrelated absolute path', () => {
    expect(isPathInside('/tmp/app', '/etc/passwd')).toBe(false);
  });

  it('rejects target == base (strictly inside, not equal)', () => {
    expect(isPathInside('/tmp/app', '/tmp/app')).toBe(false);
    expect(isPathInside('/tmp/app', '/tmp/app/')).toBe(false);
  });
});
