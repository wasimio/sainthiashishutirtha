import 'server-only';

import { headers } from 'next/headers';
import {
  DEFAULT_LOCALE,
  SITE_LOCALE_HEADER,
  SITE_PATHNAME_HEADER,
  isLocale,
  type Locale,
} from './locales';

/**
 * Locale resolved by Proxy from the public URL. English routes stay
 * unprefixed; Bengali requests retain /bn in the browser and are internally
 * rewritten to the matching English route template.
 */
export async function getRequestLocale(): Promise<Locale> {
  const value = (await headers()).get(SITE_LOCALE_HEADER);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getRequestPathname(): Promise<string> {
  return (await headers()).get(SITE_PATHNAME_HEADER) || '/';
}
