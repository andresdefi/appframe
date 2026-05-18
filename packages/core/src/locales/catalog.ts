export interface LocaleCatalogEntry {
  code: string;
  label: string;
  nativeLabel: string;
}

// ISO codes + display names roughly matching App Store Connect storefronts.
// `code` is what we persist as the key in `locales: Record<string, LocaleConfig>`.
// `label` is the English display name shown in the picker. `nativeLabel` is
// the endonym (e.g. "Deutsch") shown as a secondary line.
export const LOCALE_CATALOG: LocaleCatalogEntry[] = [
  { code: 'ar-SA', label: 'Arabic (Saudi Arabia)', nativeLabel: 'العربية' },
  { code: 'ca', label: 'Catalan', nativeLabel: 'Català' },
  { code: 'zh-Hans', label: 'Chinese, Simplified', nativeLabel: '简体中文' },
  { code: 'zh-Hant', label: 'Chinese, Traditional', nativeLabel: '繁體中文' },
  { code: 'zh-HK', label: 'Chinese (Hong Kong)', nativeLabel: '香港繁體' },
  { code: 'hr', label: 'Croatian', nativeLabel: 'Hrvatski' },
  { code: 'cs', label: 'Czech', nativeLabel: 'Čeština' },
  { code: 'da', label: 'Danish', nativeLabel: 'Dansk' },
  { code: 'nl-NL', label: 'Dutch', nativeLabel: 'Nederlands' },
  { code: 'en-AU', label: 'English (Australia)', nativeLabel: 'English (AU)' },
  { code: 'en-CA', label: 'English (Canada)', nativeLabel: 'English (CA)' },
  { code: 'en-GB', label: 'English (UK)', nativeLabel: 'English (UK)' },
  { code: 'en-US', label: 'English (US)', nativeLabel: 'English (US)' },
  { code: 'fi', label: 'Finnish', nativeLabel: 'Suomi' },
  { code: 'fr-CA', label: 'French (Canada)', nativeLabel: 'Français (Canada)' },
  { code: 'fr-FR', label: 'French', nativeLabel: 'Français' },
  { code: 'de-DE', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'el', label: 'Greek', nativeLabel: 'Ελληνικά' },
  { code: 'he', label: 'Hebrew', nativeLabel: 'עברית' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'hu', label: 'Hungarian', nativeLabel: 'Magyar' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'ms', label: 'Malay', nativeLabel: 'Bahasa Melayu' },
  { code: 'no', label: 'Norwegian', nativeLabel: 'Norsk' },
  { code: 'pl', label: 'Polish', nativeLabel: 'Polski' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)', nativeLabel: 'Português (Brasil)' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)', nativeLabel: 'Português' },
  { code: 'ro', label: 'Romanian', nativeLabel: 'Română' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { code: 'sk', label: 'Slovak', nativeLabel: 'Slovenčina' },
  { code: 'es-MX', label: 'Spanish (Mexico)', nativeLabel: 'Español (México)' },
  { code: 'es-ES', label: 'Spanish (Spain)', nativeLabel: 'Español (España)' },
  { code: 'sv', label: 'Swedish', nativeLabel: 'Svenska' },
  { code: 'th', label: 'Thai', nativeLabel: 'ไทย' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt' },
  { code: 'af', label: 'Afrikaans', nativeLabel: 'Afrikaans' },
  { code: 'sq', label: 'Albanian', nativeLabel: 'Shqip' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ' },
  { code: 'hy', label: 'Armenian', nativeLabel: 'Հայերեն' },
  { code: 'az', label: 'Azerbaijani', nativeLabel: 'Azərbaycanca' },
  { code: 'eu', label: 'Basque', nativeLabel: 'Euskara' },
  { code: 'be', label: 'Belarusian', nativeLabel: 'Беларуская' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'bs', label: 'Bosnian', nativeLabel: 'Bosanski' },
  { code: 'bg', label: 'Bulgarian', nativeLabel: 'Български' },
  { code: 'my', label: 'Burmese', nativeLabel: 'မြန်မာ' },
  { code: 'km', label: 'Khmer', nativeLabel: 'ខ្មែរ' },
  { code: 'et', label: 'Estonian', nativeLabel: 'Eesti' },
  { code: 'fil', label: 'Filipino', nativeLabel: 'Filipino' },
  { code: 'gl', label: 'Galician', nativeLabel: 'Galego' },
  { code: 'ka', label: 'Georgian', nativeLabel: 'ქართული' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'is', label: 'Icelandic', nativeLabel: 'Íslenska' },
  { code: 'ga', label: 'Irish', nativeLabel: 'Gaeilge' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'kk', label: 'Kazakh', nativeLabel: 'Қазақша' },
  { code: 'lo', label: 'Lao', nativeLabel: 'ລາວ' },
  { code: 'lv', label: 'Latvian', nativeLabel: 'Latviešu' },
  { code: 'lt', label: 'Lithuanian', nativeLabel: 'Lietuvių' },
  { code: 'mk', label: 'Macedonian', nativeLabel: 'Македонски' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'mn', label: 'Mongolian', nativeLabel: 'Монгол' },
  { code: 'ne', label: 'Nepali', nativeLabel: 'नेपाली' },
  { code: 'ps', label: 'Pashto', nativeLabel: 'پښتو' },
  { code: 'fa', label: 'Persian', nativeLabel: 'فارسی' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'sr', label: 'Serbian', nativeLabel: 'Српски' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'sl', label: 'Slovenian', nativeLabel: 'Slovenščina' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { code: 'uz', label: 'Uzbek', nativeLabel: 'Oʻzbekcha' },
  { code: 'cy', label: 'Welsh', nativeLabel: 'Cymraeg' },
  { code: 'zu', label: 'Zulu', nativeLabel: 'IsiZulu' },
];

export const LOCALE_CATALOG_BY_CODE: Record<string, LocaleCatalogEntry> = Object.fromEntries(
  LOCALE_CATALOG.map((entry) => [entry.code, entry]),
);

export function getLocaleLabel(code: string): string {
  if (code === 'default') return 'Default';
  return LOCALE_CATALOG_BY_CODE[code]?.label ?? code;
}
