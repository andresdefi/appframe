import { describe, it, expect } from 'vitest';
import {
  STATIC_SCREEN_DEFAULTS,
  fattenScreen,
  slimScreen,
  slimProjectSnapshot,
} from './screenSerialization';
import type { ScreenState } from '../types';

// Minimal full ScreenState that uses only the static defaults — every
// optional field is at its STATIC_SCREEN_DEFAULTS value. Theme-derived
// fields (font / colors / etc.) are not part of the defaults set, so
// they're still set explicitly.
function buildDefaultScreen(overrides: Partial<ScreenState> = {}): ScreenState {
  return {
    id: 'screen-1',
    screenIndex: 0,
    headline: 'Hello',
    subtitle: '',
    font: 'inter',
    fontWeight: 600,
    headlineFont: 'inter',
    headlineFontWeight: 600,
    subtitleFont: 'inter',
    subtitleFontWeight: 400,
    colors: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      background: '#F8FAFC',
      text: '#0F172A',
      subtitle: '#64748B',
      freeText: '#64748B',
    },
    frameId: 'iphone-17-pro',
    deviceScale: 92,
    deviceTop: 15,
    deviceAngle: 8,
    ...STATIC_SCREEN_DEFAULTS,
    ...overrides,
  } as ScreenState;
}

describe('slimScreen', () => {
  it('omits every field that still matches a static default', () => {
    const screen = buildDefaultScreen();
    const slim = slimScreen(screen);
    // Static-default keys should be gone.
    expect(slim).not.toHaveProperty('headlineSize');
    expect(slim).not.toHaveProperty('headlineRotation');
    expect(slim).not.toHaveProperty('freeTextEnabled');
    expect(slim).not.toHaveProperty('annotations');
    expect(slim).not.toHaveProperty('spotlight');
    expect(slim).not.toHaveProperty('backgroundType');
    expect(slim).not.toHaveProperty('layout');
  });

  it('keeps identity fields (id, screenIndex)', () => {
    const slim = slimScreen(buildDefaultScreen());
    expect(slim.id).toBe('screen-1');
    expect(slim.screenIndex).toBe(0);
  });

  it('keeps content / theme-derived fields untouched', () => {
    const slim = slimScreen(buildDefaultScreen({ headline: 'Custom headline' }));
    expect(slim.headline).toBe('Custom headline');
    expect(slim.font).toBe('inter');
    expect(slim.colors).toBeDefined();
    expect(slim.frameId).toBe('iphone-17-pro');
    expect(slim.deviceScale).toBe(92);
  });

  it('keeps a field that diverges from the static default', () => {
    const slim = slimScreen(buildDefaultScreen({ headlineRotation: 12 }));
    expect(slim.headlineRotation).toBe(12);
  });

  it('keeps a nested object that diverges from the default shape', () => {
    const slim = slimScreen(
      buildDefaultScreen({
        backgroundGradient: {
          type: 'linear',
          colors: ['#000', '#fff'],
          direction: 90,
          radialPosition: 'center',
        },
      }),
    );
    expect(slim.backgroundGradient).toEqual({
      type: 'linear',
      colors: ['#000', '#fff'],
      direction: 90,
      radialPosition: 'center',
    });
  });

  it('omits a nested object that deep-equals the default shape', () => {
    // Different reference but same content as the default backgroundGradient.
    const slim = slimScreen(
      buildDefaultScreen({
        backgroundGradient: {
          type: 'linear',
          colors: ['#6366f1', '#ec4899'],
          direction: 135,
          radialPosition: 'center',
        },
      }),
    );
    expect(slim).not.toHaveProperty('backgroundGradient');
  });

  it('keeps a non-empty array even if it would otherwise be omittable', () => {
    const slim = slimScreen(
      buildDefaultScreen({
        annotations: [
          {
            id: 'a1',
            shape: 'rectangle',
            x: 0,
            y: 0,
            w: 10,
            h: 10,
            strokeColor: '#000',
            strokeWidth: 1,
            borderRadius: 0,
          },
        ],
      }),
    );
    expect(Array.isArray(slim.annotations)).toBe(true);
    expect(slim.annotations).toHaveLength(1);
  });
});

describe('fattenScreen', () => {
  it('re-injects every omitted static default', () => {
    const fat = fattenScreen({ id: 'x', screenIndex: 0, headline: 'h' });
    expect(fat.headlineSize).toBe(0);
    expect(fat.layout).toBe('center');
    expect(fat.annotations).toEqual([]);
    expect(fat.spotlight).toBeNull();
    expect(fat.backgroundType).toBe('solid');
    expect(fat.textPositions).toEqual({ headline: null, subtitle: null, freeText: null });
  });

  it('lets saved values override defaults', () => {
    const fat = fattenScreen({
      id: 'x',
      screenIndex: 0,
      headline: 'h',
      headlineRotation: 12,
      backgroundType: 'gradient',
    });
    expect(fat.headlineRotation).toBe(12);
    expect(fat.backgroundType).toBe('gradient');
  });

  it('returns just defaults when given garbage', () => {
    const fat = fattenScreen(null);
    expect(fat.layout).toBe('center');
    expect(fat.headlineSize).toBe(0);
  });

  it('migrates the legacy `screenshotDataUrl` field to `screenshotUrl`', () => {
    // Older project files on disk used `screenshotDataUrl` (misleading
    // name — the value is almost always an HTTP URL, not a data URL).
    // The current field is `screenshotUrl`; the migration transparently
    // promotes the legacy key so existing projects load without churn.
    const fat = fattenScreen({
      id: 'x',
      screenIndex: 0,
      headline: 'h',
      screenshotDataUrl: '/api/screenshots/legacy/screen1.png',
    });
    expect(fat.screenshotUrl).toBe('/api/screenshots/legacy/screen1.png');
    expect((fat as Record<string, unknown>).screenshotDataUrl).toBeUndefined();
  });

  it('prefers the new field if both legacy and new are present', () => {
    // Defensive: should never happen on disk, but if a manually-edited
    // file has both keys (e.g., partially-migrated by hand) the new
    // name wins.
    const fat = fattenScreen({
      id: 'x',
      screenIndex: 0,
      headline: 'h',
      screenshotDataUrl: '/api/screenshots/legacy/old.png',
      screenshotUrl: '/api/screenshots/current/new.png',
    });
    expect(fat.screenshotUrl).toBe('/api/screenshots/current/new.png');
  });
});

describe('slim → fatten round-trip', () => {
  it('preserves a fully-default screen', () => {
    const original = buildDefaultScreen({ headline: 'Test' });
    const round = fattenScreen(slimScreen(original)) as Partial<ScreenState>;
    // Every static-default field that round-trips should match the
    // original (which set them to defaults explicitly).
    for (const key of Object.keys(STATIC_SCREEN_DEFAULTS) as Array<keyof typeof STATIC_SCREEN_DEFAULTS>) {
      expect(round[key]).toEqual(original[key]);
    }
    // Identity + content preserved.
    expect(round.id).toBe(original.id);
    expect(round.headline).toBe(original.headline);
  });

  it('preserves user-customized values through the round trip', () => {
    const original = buildDefaultScreen({
      headline: 'Custom',
      headlineRotation: 7,
      backgroundType: 'gradient',
      backgroundColor: '#abcdef',
      annotations: [
        {
          id: 'a',
          shape: 'circle',
          x: 1,
          y: 2,
          w: 3,
          h: 4,
          strokeColor: '#000',
          strokeWidth: 1,
          borderRadius: 5,
        },
      ],
    });
    const round = fattenScreen(slimScreen(original)) as Partial<ScreenState>;
    expect(round.headline).toBe('Custom');
    expect(round.headlineRotation).toBe(7);
    expect(round.backgroundType).toBe('gradient');
    expect(round.backgroundColor).toBe('#abcdef');
    expect(round.annotations).toHaveLength(1);
  });

  it('shrinks the on-wire size meaningfully for a default screen', () => {
    const original = buildDefaultScreen({ headline: 'Test' });
    const fullJson = JSON.stringify(original);
    const slimJson = JSON.stringify(slimScreen(original));
    // The slim form should be at least 2x smaller. In practice the
    // typical untouched screen drops by ~3-5x, but we want a soft
    // lower bound to catch regressions where slim stops slimming.
    expect(slimJson.length * 2).toBeLessThan(fullJson.length);
  });
});

describe('slimProjectSnapshot', () => {
  it('slims the top-level screens array', () => {
    const snapshot = {
      platform: 'iphone',
      screens: [buildDefaultScreen({ id: 's1' }), buildDefaultScreen({ id: 's2' })],
    };
    const slimmed = slimProjectSnapshot(snapshot) as { screens: Partial<ScreenState>[] };
    expect(slimmed.screens).toHaveLength(2);
    expect(slimmed.screens[0]).not.toHaveProperty('headlineSize');
    expect(slimmed.screens[1]).not.toHaveProperty('headlineSize');
    expect(slimmed.screens[0]!.id).toBe('s1');
    expect(slimmed.screens[1]!.id).toBe('s2');
  });

  it('slims each variant\'s inner snapshot.screens array', () => {
    const snapshot = {
      platform: 'iphone',
      screens: [buildDefaultScreen({ id: 's1' })],
      variants: [
        {
          id: 'v1',
          name: 'Concept A',
          snapshot: {
            screens: [buildDefaultScreen({ id: 's1-a' })],
          },
        },
        {
          id: 'v2',
          name: 'Concept B',
          snapshot: {
            screens: [buildDefaultScreen({ id: 's1-b' })],
          },
        },
      ],
    };
    const slimmed = slimProjectSnapshot(snapshot) as {
      variants: { snapshot: { screens: Partial<ScreenState>[] } }[];
    };
    expect(slimmed.variants[0]!.snapshot.screens[0]).not.toHaveProperty('headlineSize');
    expect(slimmed.variants[1]!.snapshot.screens[0]).not.toHaveProperty('headlineSize');
    expect(slimmed.variants[0]!.snapshot.screens[0]!.id).toBe('s1-a');
  });

  it('passes through snapshots that don\'t have screens / variants', () => {
    const snapshot = { platform: 'iphone', exportSize: 'app-store-6.9' };
    expect(slimProjectSnapshot(snapshot)).toEqual(snapshot);
  });

  it('does not mutate the input snapshot', () => {
    const snapshot = {
      platform: 'iphone',
      screens: [buildDefaultScreen({ id: 's1' })],
    };
    const before = JSON.stringify(snapshot);
    slimProjectSnapshot(snapshot);
    expect(JSON.stringify(snapshot)).toBe(before);
  });
});
