import type { AppframeConfig, LocaleConfig } from '../types';

const COMMON_LOCALES = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'pt-BR',
  'nl',
  'sv',
  'no',
  'da',
  'fi',
  'pl',
  'cs',
  'tr',
  'ro',
  'hu',
  'uk',
  'ru',
  'el',
  'he',
  'ar',
  'hi',
  'th',
  'vi',
  'id',
  'ms',
  'ja',
  'ko',
  'zh-Hans',
  'zh-Hant',
] as const;

function normalizeLocaleTag(locale: string): string {
  if (locale === 'default') return locale;
  return locale.replace(/_/g, '-');
}

export function getAvailableLocales(
  config: AppframeConfig | null,
  sessionLocales: Record<string, LocaleConfig> = {},
): string[] {
  const configured = config?.locales ? Object.keys(config.locales) : [];
  const runtime = Object.keys(sessionLocales);
  return ['default', ...new Set([...configured, ...runtime, ...COMMON_LOCALES])];
}

export function getLocaleLabel(locale: string): string {
  if (locale === 'default') return 'Default';

  const normalized = normalizeLocaleTag(locale);

  try {
    const displayNames = new Intl.DisplayNames(undefined, { type: 'language' });
    const language = displayNames.of(normalized);
    if (language) return `${language} (${locale})`;
  } catch {
    // Ignore Intl locale display failures and fall back to the raw locale tag.
  }

  return locale;
}
