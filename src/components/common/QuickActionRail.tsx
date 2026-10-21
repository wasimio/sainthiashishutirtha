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

interface QuickActionRailProps {
  onOpenAdmissionModal?: () => void;
}

export default function QuickActionRail({ onOpenAdmissionModal }: QuickActionRailProps) {
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

  const primaryPhone = SCHOOL_INFO.phone.split('/')[0].trim();

  return (
    <>
      {/* Desktop Vertical Quick-Action Rail (hidden on mobile/tablet < 1024px) */}
      <aside
        aria-label="Quick contact shortcuts"
        className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-l-2xl border-y border-l border-slate-200 shadow-lg text-[#243B43]"
      >
        {/* Action 1: Call Phone */}
        <a
          href={`tel:${primaryPhone}`}
          className="group relative p-2.5 rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#308599] transition-all flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
          aria-label={`Call School Office: ${primaryPhone}`}
        >
          <Phone className="w-4 h-4 text-[#308599]" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#243B43] rounded-lg shadow-md whitespace-nowrap">
            Call: {primaryPhone}
          </span>
        </a>

        {/* Action 2: Admission Enquiry */}
        <button
          type="button"
          onClick={onOpenAdmissionModal}
          className="group relative p-2.5 rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#308599] transition-all flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
          aria-label="Open Admission Enquiry Form"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#243B43] rounded-lg shadow-md whitespace-nowrap">
            Admissions Enquiry
          </span>
        </button>

        {/* Action 3: Campus Location */}
        <Link
          href="/contact"
          className="group relative p-2.5 rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#308599] transition-all flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
          aria-label="Campus Location & Visit Directions"
        >
          <MapPin className="w-4 h-4 text-[#308599]" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#243B43] rounded-lg shadow-md whitespace-nowrap">
            Locate Campus
          </span>
        </Link>

        {/* Action 4: Notices */}
        <Link
          href="/notices"
          className="group relative p-2.5 rounded-xl hover:bg-[#EAF5F7] text-slate-700 hover:text-[#308599] transition-all flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
          aria-label="View Latest School Notices"
        >
          <Bell className="w-4 h-4 text-[#308599]" />
          <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#243B43] rounded-lg shadow-md whitespace-nowrap">
            Notices & Updates
          </span>
        </Link>

        {/* Action 5: Scroll to top */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="group relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all flex items-center justify-center border-t border-slate-100 mt-1 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="pointer-events-none absolute right-full mr-2.5 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-semibold text-white bg-[#243B43] rounded-lg shadow-md whitespace-nowrap">
              Back to Top
            </span>
          </button>
        )}
      </aside>

      {/* Mobile Bottom Quick-Action Bar (visible only below lg: 1024px) */}
      <nav
        aria-label="Mobile quick shortcuts"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around gap-2 text-[11px] font-semibold text-[#243B43]">
          <a
            href={`tel:${primaryPhone}`}
            className="flex flex-col items-center gap-1 p-1 text-slate-600 hover:text-[#308599] focus:outline-hidden active:scale-95 transition-transform"
          >
            <Phone className="w-4 h-4 text-[#308599]" />
            <span>Call</span>
          </a>

          <button
            type="button"
            onClick={onOpenAdmissionModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#308599] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Apply Now</span>
          </button>

          <Link
            href="/contact"
            className="flex flex-col items-center gap-1 p-1 text-slate-600 hover:text-[#308599] focus:outline-hidden active:scale-95 transition-transform"
          >
            <MapPin className="w-4 h-4 text-[#308599]" />
            <span>Visit</span>
          </Link>

          <Link
            href="/notices"
            className="flex flex-col items-center gap-1 p-1 text-slate-600 hover:text-[#308599] focus:outline-hidden active:scale-95 transition-transform"
          >
            <Bell className="w-4 h-4 text-[#308599]" />
            <span>Notices</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
