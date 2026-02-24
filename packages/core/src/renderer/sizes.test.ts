import { describe, it, expect } from 'vitest';
import { STORE_SIZES, getTargetSizes } from './sizes.js';

describe('STORE_SIZES', () => {
  it('has the correct iPhone 6.7" dimensions (1290x2796 at 2x)', () => {
    const size = STORE_SIZES['ios-6.7']!;
    expect(size.width * 2).toBe(1290);
    expect(size.height * 2).toBe(2796);
    expect(size.platform).toBe('ios');
  });

  it('has the correct iPhone 6.5" dimensions (1284x2778 at 2x)', () => {
    const size = STORE_SIZES['ios-6.5']!;
    expect(size.width * 2).toBe(1284);
    expect(size.height * 2).toBe(2778);
  });

  it('has the correct Android phone dimensions (1080x1920 at 2x)', () => {
    const size = STORE_SIZES['android-phone']!;
    expect(size.width * 2).toBe(1080);
    expect(size.height * 2).toBe(1920);
    expect(size.platform).toBe('android');
  });

  it('has the correct feature graphic dimensions (1024x500 at 2x)', () => {
    const size = STORE_SIZES['android-feature-graphic']!;
    expect(size.width * 2).toBe(1024);
    expect(size.height * 2).toBe(500);
  });

  it('has iPad 12.9" and 11" sizes', () => {
    expect(STORE_SIZES['ios-ipad-12.9']).toBeDefined();
    expect(STORE_SIZES['ios-ipad-11']).toBeDefined();
  });
});

describe('getTargetSizes', () => {
  it('returns default iOS sizes (6.7 and 6.5)', () => {
    const sizes = getTargetSizes(['ios']);
    expect(sizes).toHaveLength(2);
    expect(sizes[0]!.name).toBe('iPhone 6.7"');
    expect(sizes[1]!.name).toBe('iPhone 6.5"');
  });

  it('returns custom iOS sizes', () => {
    const sizes = getTargetSizes(['ios'], [6.7]);
    expect(sizes).toHaveLength(1);
  });

  it('returns default Android sizes (phone)', () => {
    const sizes = getTargetSizes(['android']);
    expect(sizes).toHaveLength(1);
    expect(sizes[0]!.name).toBe('Android Phone');
  });

  it('includes feature graphic when requested', () => {
    const sizes = getTargetSizes(['android'], undefined, ['phone'], true);
    expect(sizes).toHaveLength(2);
    expect(sizes.some((s) => s.name === 'Feature Graphic')).toBe(true);
  });

  it('returns both platform sizes', () => {
    const sizes = getTargetSizes(['ios', 'android']);
    expect(sizes.length).toBeGreaterThanOrEqual(3);
  });

  it('returns empty for unrecognized sizes', () => {
    const sizes = getTargetSizes(['ios'], [99]);
    expect(sizes).toHaveLength(0);
  });
});
