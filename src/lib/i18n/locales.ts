/**
 * The public site has exactly two supported display locales. English remains
 * unprefixed for URL compatibility; Bengali will use the explicit /bn prefix
 * when its published content routes are introduced in a later step.
 */
export const SUPPORTED_LOCALES = ['en', 'bn'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const SITE_LOCALE_HEADER = 'x-site-locale';
export const SITE_PATHNAME_HEADER = 'x-site-pathname';

export interface LocaleDefinition {
  htmlLang: 'en' | 'bn';
  intlLocale: 'en-IN' | 'bn-IN';
  label: string;
  nativeLabel: string;
}

export const LOCALE_DEFINITIONS: Record<Locale, LocaleDefinition> = {
  en: {
    htmlLang: 'en',
    intlLocale: 'en-IN',
    label: 'English',
    nativeLabel: 'English',
  },
  bn: {
    htmlLang: 'bn',
    intlLocale: 'bn-IN',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDefinition(locale: Locale): LocaleDefinition {
  return LOCALE_DEFINITIONS[locale];
}
