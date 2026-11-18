import { getLocaleDefinition, type Locale } from './locales.ts';

export type DateInput = Date | number | string;

function toDate(value: DateInput): Date {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('A valid date is required for localization.');
  }
  return date;
}

export function formatDate(
  value: DateInput,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat(getLocaleDefinition(locale).intlLocale, options).format(toDate(value));
}

export function formatNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(getLocaleDefinition(locale).intlLocale, options).format(value);
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency = 'INR',
  options: Omit<Intl.NumberFormatOptions, 'currency' | 'style'> = {},
): string {
  return formatNumber(value, locale, {
    ...options,
    style: 'currency',
    currency,
  });
}
