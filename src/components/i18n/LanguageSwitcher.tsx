'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe2 } from 'lucide-react';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, LOCALE_DEFINITIONS, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/locales';
import { getLocalePath } from '@/lib/i18n/routing';

interface LanguageSwitcherProps {
  /** The locale already resolved by the route/template. */
  locale?: Locale;
  /** The current internal path. Pass this from a server template when available. */
  pathname?: string;
  /**
   * Locales whose complete editorial page is already published. Bengali is
   * intentionally opt-in so this component cannot expose an incomplete /bn URL.
   */
  availableLocales?: readonly Locale[];
  /** Exact published sibling URLs when a localized record uses a different slug. */
  localePaths?: Partial<Record<Locale, string>>;
  className?: string;
}

export default function LanguageSwitcher({
  locale = DEFAULT_LOCALE,
  pathname = '/',
  availableLocales = [DEFAULT_LOCALE],
  localePaths,
  className = '',
}: LanguageSwitcherProps) {
  const dictionary = getUiDictionary(locale);
  const publishedLocales = new Set<Locale>([locale, ...availableLocales]);
  const [unavailableMessage, setUnavailableMessage] = useState(false);
  const unavailableId = 'bengali-content-unavailable';

  return (
    <div
      aria-label={dictionary.languageSwitcher.label}
      className={`relative inline-flex items-center gap-1 rounded-full border border-[#C9DBD8] bg-[#FFFCF5] p-1 text-xs font-semibold text-[#14383F] shadow-[0_8px_24px_rgba(20,56,63,0.08)] ${className}`.trim()}
      role="group"
    >
      <Globe2 aria-hidden="true" className="ml-1 h-3.5 w-3.5 text-[#B45338]" />
      {SUPPORTED_LOCALES.map((candidate) => {
        const definition = LOCALE_DEFINITIONS[candidate];
        const isCurrent = candidate === locale;
        const isPublished = publishedLocales.has(candidate);
        const label = candidate === 'en' ? 'EN' : 'বাংলা';

        if (isCurrent) {
          return (
            <span
              key={candidate}
              aria-current="true"
              className="rounded-full bg-[#14383F] px-2.5 py-1 text-[#FFFCF5]"
              title={dictionary.languageSwitcher.currentLanguage}
            >
              {label}
            </span>
          );
        }

        if (!isPublished) {
          return (
            <button
              type="button"
              key={candidate}
              aria-disabled="true"
              aria-describedby={unavailableMessage ? unavailableId : undefined}
              onClick={() => setUnavailableMessage(true)}
              className="rounded-full px-2.5 py-1 text-[#8B9997] underline-offset-2 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D95D39]"
            >
              {label}
            </button>
          );
        }

        return (
          <Link
            key={candidate}
            href={localePaths?.[candidate] || getLocalePath(pathname, candidate)}
            hrefLang={definition.htmlLang}
            lang={definition.htmlLang}
            className="rounded-full px-2.5 py-1 text-[#47645F] transition-colors hover:bg-[#F3E5C8] hover:text-[#14383F] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D95D39]"
          >
            {label}
          </Link>
        );
      })}
      {unavailableMessage && <span id={unavailableId} role="status" className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-60 rounded-lg border border-amber-200 bg-amber-50 p-2 text-left text-[11px] font-medium leading-4 text-amber-950 shadow-lg">Bengali content for this page is not published yet. You are still on the available English page.</span>}
    </div>
  );
}
