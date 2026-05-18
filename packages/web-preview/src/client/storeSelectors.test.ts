import { describe, it, expect } from 'vitest';
import {
  getConfiguredLocaleText,
  selectScreensForLocale,
  selectPanoramicElementsForLocale,
} from './storeSelectors';
import type { ScreenState, PanoramicElement, LocaleConfig } from './types';

// Tiny stub used for the screens/panoramicElements arrays — every field
// the selectors care about is identity-tracked, not field-tracked, so we
// only need the bare shape.
const stubScreen = (id: string): ScreenState => ({ id } as unknown as ScreenState);
const stubElement = (id: string): PanoramicElement => ({ id } as unknown as PanoramicElement);

describe('getConfiguredLocaleText', () => {
  it('returns undefined for the default locale', () => {
    const locales: Record<string, LocaleConfig> = {
      'es-MX': { screens: [{ headline: 'Hola' }] },
    };
    expect(getConfiguredLocaleText(locales, 0, 'default', 'headline')).toBeUndefined();
  });

  it('reads the locale override when present', () => {
    const locales: Record<string, LocaleConfig> = {
      'es-MX': { screens: [{ headline: 'Hola' }, { headline: 'Adios' }] },
    };
    expect(getConfiguredLocaleText(locales, 0, 'es-MX', 'headline')).toBe('Hola');
    expect(getConfiguredLocaleText(locales, 1, 'es-MX', 'headline')).toBe('Adios');
  });

  it('returns undefined when the locale entry is missing', () => {
    const locales: Record<string, LocaleConfig> = {};
    expect(getConfiguredLocaleText(locales, 0, 'es-MX', 'headline')).toBeUndefined();
  });

  it('returns undefined when the screen index is out of range', () => {
    const locales: Record<string, LocaleConfig> = {
      'es-MX': { screens: [{ headline: 'Hola' }] },
    };
    expect(getConfiguredLocaleText(locales, 5, 'es-MX', 'headline')).toBeUndefined();
  });
});

describe('selectScreensForLocale', () => {
  const def0 = stubScreen('def-0');
  const def1 = stubScreen('def-1');
  const es0 = stubScreen('es-0');
  const es1 = stubScreen('es-1');
  const state = {
    screens: [def0, def1],
    localeScreens: { 'es-MX': [es0, es1] },
  };

  it('returns the default screens for locale="default"', () => {
    expect(selectScreensForLocale(state, 'default')).toBe(state.screens);
  });

  it('returns the locale snapshot when locale has its own entry', () => {
    expect(selectScreensForLocale(state, 'es-MX')).toBe(state.localeScreens['es-MX']);
  });

  it('falls back to default screens when the locale entry is missing', () => {
    expect(selectScreensForLocale(state, 'no')).toBe(state.screens);
  });
});

describe('selectPanoramicElementsForLocale', () => {
  const def = stubElement('def-el');
  const es = stubElement('es-el');
  const state = {
    panoramicElements: [def],
    localePanoramicElements: { 'es-MX': [es] },
  };

  it('returns default elements for locale="default"', () => {
    expect(selectPanoramicElementsForLocale(state, 'default')).toBe(state.panoramicElements);
  });

  it('returns the locale snapshot when present', () => {
    expect(selectPanoramicElementsForLocale(state, 'es-MX')).toBe(
      state.localePanoramicElements['es-MX'],
    );
  });

  it('falls back to default when the locale entry is missing', () => {
    expect(selectPanoramicElementsForLocale(state, 'fr')).toBe(state.panoramicElements);
  });
});
