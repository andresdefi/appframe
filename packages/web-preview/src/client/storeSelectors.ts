// Locale-aware selectors for the preview store. Extracted from store.ts
// to keep the main store file focused on the create<PreviewStore>() call.
// These are pure functions and can be unit-tested in isolation.

import type {
  ScreenState,
  LocaleConfig,
  PanoramicElement,
} from './types';

/** Internal: look up a locale's text override for a given screen field.
 *  Returns undefined for the default locale (which has no override). */
export function getConfiguredLocaleText(
  locales: Record<string, LocaleConfig>,
  index: number,
  locale: string,
  field: 'headline' | 'subtitle',
): string | undefined {
  if (locale === 'default') return undefined;
  return locales[locale]?.screens?.[index]?.[field];
}

/**
 * Returns the ScreenState array for the given locale, or Default's
 * `screens` when locale is 'default'. Falls back to default's array if
 * the locale somehow lacks its own snapshot (shouldn't happen post-Phase 3
 * but defensive against partial migrations).
 */
export function selectScreensForLocale(
  state: { screens: ScreenState[]; localeScreens: Record<string, ScreenState[]> },
  locale: string,
): ScreenState[] {
  if (locale === 'default') return state.screens;
  return state.localeScreens[locale] ?? state.screens;
}

/**
 * Returns the panoramic elements array for the given locale, snapshot-model
 * style. Same fallback as selectScreensForLocale.
 */
export function selectPanoramicElementsForLocale(
  state: {
    panoramicElements: PanoramicElement[];
    localePanoramicElements: Record<string, PanoramicElement[]>;
  },
  locale: string,
): PanoramicElement[] {
  if (locale === 'default') return state.panoramicElements;
  return state.localePanoramicElements[locale] ?? state.panoramicElements;
}
