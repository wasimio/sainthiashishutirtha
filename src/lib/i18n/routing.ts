import { DEFAULT_LOCALE, type Locale, isLocale } from './locales.ts';

const BENGALI_PREFIX = '/bn';

function splitPath(path: string): { pathname: string; suffix: string } {
  const boundary = path.search(/[?#]/);
  if (boundary === -1) return { pathname: path, suffix: '' };
  return {
    pathname: path.slice(0, boundary),
    suffix: path.slice(boundary),
  };
}

function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeadingSlash === '/' ? withLeadingSlash : withLeadingSlash.replace(/\/+$/, '');
}

/** Returns the locale encoded in a public pathname; unprefixed paths are English. */
export function getLocaleFromPathname(path: string): Locale {
  const { pathname } = splitPath(path);
  const normalized = normalizePathname(pathname);
  return normalized === BENGALI_PREFIX || normalized.startsWith(`${BENGALI_PREFIX}/`) ? 'bn' : DEFAULT_LOCALE;
}

/** Removes the explicit Bengali prefix while preserving query strings and hashes. */
export function stripLocalePrefix(path: string): string {
  const { pathname, suffix } = splitPath(path);
  const normalized = normalizePathname(pathname);

  if (normalized === BENGALI_PREFIX) return `/${suffix}`;
  if (normalized.startsWith(`${BENGALI_PREFIX}/`)) {
    return `${normalized.slice(BENGALI_PREFIX.length)}${suffix}`;
  }

  return `${normalized}${suffix}`;
}

/**
 * Produces the equivalent internal URL for a locale without inventing a route.
 * A future route/template must explicitly opt in before this helper is exposed
 * as a public Bengali link.
 */
export function getLocalePath(path: string, locale: Locale): string {
  const englishPath = stripLocalePrefix(path);
  if (locale === DEFAULT_LOCALE) return englishPath;

  const { pathname, suffix } = splitPath(englishPath);
  return pathname === '/' ? `${BENGALI_PREFIX}${suffix}` : `${BENGALI_PREFIX}${pathname}${suffix}`;
}

/** Returns true only for a locale identifier supported by this foundation. */
export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return isLocale(value);
}
