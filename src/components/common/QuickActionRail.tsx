'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Sparkles,
  MapPin,
  Bell,
  ArrowUp
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';
import type { PublishedSchoolSettings } from '@/lib/cms/contentService';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getLocalePath } from '@/lib/i18n/routing';

interface QuickActionRailProps {
  settings?: PublishedSchoolSettings | null;
  locale?: Locale;
}

export default function QuickActionRail({ settings, locale = DEFAULT_LOCALE }: QuickActionRailProps) {
  const dictionary = getUiDictionary(locale);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawPhone = settings?.official_phone || settings?.primary_phone || SCHOOL_INFO.phone;
  const primaryPhone = rawPhone.split('/')[0].trim();

  return (
    <>
      {/* Desktop Vertical Quick-Action Rail (hidden on mobile/tablet < 1024px) */}
      <aside
        aria-label={dictionary.actions.admissionEnquiry}
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1.5 rounded-l-2xl border-y border-l border-warm-card-border bg-warm-ivory/95 p-1.5 text-text-headline shadow-xl backdrop-blur-md lg:flex"
      >
        {/* Action 1: Call Phone */}
        <a
          href={`tel:${primaryPhone}`}
          className="group relative p-3 min-w-[44px] min-h-[44px] rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#245E6D] transition-all flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D]"
          aria-label={`${dictionary.actions.call}: ${primaryPhone}`}
        >
          <Phone className="w-4 h-4 text-[#245E6D]" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#1B2E35] rounded-lg shadow-md whitespace-nowrap">
            {dictionary.actions.call}: {primaryPhone}
          </span>
        </a>

        {/* Action 2: Admission Enquiry */}
        <Link
          href={getLocalePath('/admissions', locale)}
          className="group relative p-3 min-w-[44px] min-h-[44px] rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#245E6D] transition-all flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D] cursor-pointer"
          aria-label={dictionary.actions.admissionEnquiry}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#1B2E35] rounded-lg shadow-md whitespace-nowrap">
            {dictionary.actions.admissionEnquiry}
          </span>
        </Link>

        {/* Action 3: Campus Location */}
        <Link
          href={getLocalePath('/contact', locale)}
          className="group relative p-3 min-w-[44px] min-h-[44px] rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#245E6D] transition-all flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D]"
          aria-label={dictionary.actions.locateCampus}
        >
          <MapPin className="w-4 h-4 text-[#245E6D]" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#1B2E35] rounded-lg shadow-md whitespace-nowrap">
            {dictionary.actions.locateCampus}
          </span>
        </Link>

        {/* Action 4: Notices */}
        <Link
          href={getLocalePath('/notices', locale)}
          className="group relative p-3 min-w-[44px] min-h-[44px] rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#245E6D] transition-all flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D]"
          aria-label={dictionary.actions.viewNotices}
        >
          <Bell className="w-4 h-4 text-[#245E6D]" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#1B2E35] rounded-lg shadow-md whitespace-nowrap">
            {dictionary.actions.viewNotices}
          </span>
        </Link>

        {/* Action 5: Scroll to top */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="group relative p-3 min-w-[44px] min-h-[44px] rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all flex items-center justify-center border-t border-slate-100 mt-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D] cursor-pointer"
            aria-label={dictionary.actions.backToTop}
          >
            <ArrowUp className="w-4 h-4" />
            <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#1B2E35] rounded-lg shadow-md whitespace-nowrap">
              {dictionary.actions.backToTop}
            </span>
          </button>
        )}
      </aside>

      {/* Mobile Bottom Quick-Action Bar (visible only below lg: 1024px) */}
      <nav
        aria-label={dictionary.navigation.mobileNavigation}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-warm-card-border bg-warm-ivory/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(20,56,63,0.10)] backdrop-blur-md lg:hidden"
      >
        <div className="flex items-center justify-around gap-2 text-[11px] font-semibold text-[#1B2E35]">
          <a
            href={`tel:${primaryPhone}`}
            aria-label={`${dictionary.actions.call}: ${primaryPhone}`}
            className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-2 py-1 text-slate-600 hover:text-[#245E6D] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D] rounded-xl active:scale-95 transition-transform"
          >
            <Phone className="w-4 h-4 text-[#245E6D]" />
            <span>{dictionary.actions.call}</span>
          </a>

          <Link
            href={getLocalePath('/admissions', locale)}
            aria-label={dictionary.actions.admissionEnquiry}
            className="flex min-h-[48px] cursor-pointer items-center justify-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-terracotta-hover active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{dictionary.actions.applyNow}</span>
          </Link>

          <Link
            href={getLocalePath('/contact', locale)}
            aria-label={dictionary.actions.locateCampus}
            className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-2 py-1 text-slate-600 hover:text-[#245E6D] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D] rounded-xl active:scale-95 transition-transform"
          >
            <MapPin className="w-4 h-4 text-[#245E6D]" />
            <span>{dictionary.actions.visit}</span>
          </Link>

          <Link
            href={getLocalePath('/notices', locale)}
            aria-label={dictionary.actions.viewNotices}
            className="flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] px-2 py-1 text-slate-600 hover:text-[#245E6D] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D] rounded-xl active:scale-95 transition-transform"
          >
            <Bell className="w-4 h-4 text-[#245E6D]" />
            <span>{dictionary.navigation.notices}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
