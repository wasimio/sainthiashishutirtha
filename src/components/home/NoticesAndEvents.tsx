'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  AlertCircle,
  ChevronRight,
  Download,
  X,
  ArrowRight
} from 'lucide-react';
import { NOTICES_AND_EVENTS, NoticeItem } from '@/data/schoolData';

export default function NoticesAndEvents() {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Notice' | 'Event' | 'Academic'>('All');
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const filteredItems = filterType === 'All'
    ? NOTICES_AND_EVENTS
    : NOTICES_AND_EVENTS.filter((item) => item.category === filterType);

  // Focus restoration & body scroll locking when notice modal is active
  useEffect(() => {
    if (selectedNotice) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        const closeBtn = document.getElementById('homeNoticeCloseBtn');
        if (closeBtn) {
          closeBtn.focus();
        }
      });
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
        previouslyFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedNotice]);

  // Handle Escape key to close notice modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNotice) {
        setSelectedNotice(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNotice]);

  return (
    <section id="notices" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF5F7] rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC]">
              <Bell className="w-3.5 h-3.5 text-[#308599]" />
              <span>Campus Circulars & Updates</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#243B43] tracking-tight">
              Announcements & Upcoming Events
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Keep updated with our academic circulars, school events, exhibition schedules, and admission milestones.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Notice category filter">
            {(['All', 'Notice', 'Event', 'Academic'] as const).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={filterType === type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] ${
                  filterType === type
                    ? 'bg-[#308599] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
                }`}
              >
                {type === 'All' ? 'All Updates' : `${type}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => setSelectedNotice(notice)}
              aria-label={`View notice: ${notice.title} (${notice.category})`}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] ${
                notice.isImportant
                  ? 'border-amber-200 bg-amber-50/40 hover:border-amber-400 hover:shadow-md'
                  : 'border-slate-200 bg-white hover:border-[#A5D1DC] hover:shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${
                      notice.category === 'Notice'
                        ? 'bg-blue-100 text-blue-800'
                        : notice.category === 'Event'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {notice.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{notice.date}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {notice.isImportant && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded shrink-0 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        Important
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#243B43] group-hover:text-[#308599] transition-colors leading-snug">
                      {notice.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {notice.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#308599]">
                <span>Read Full Circular</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {/* View All Notices Link */}
        <div className="mt-12 text-center">
          <Link
            href="/notices"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-[#EAF5F7] hover:bg-[#A5D1DC]/40 text-[#308599] border border-[#A5D1DC] text-xs sm:text-sm font-bold rounded-xl shadow-2xs hover:shadow-sm transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
          >
            <span>View All Official Circulars & Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Notice Details Modal */}
        {selectedNotice && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="homeNoticeModalTitle"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setSelectedNotice(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="homeNoticeCloseBtn"
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#EAF5F7] text-[#308599]">
                  {selectedNotice.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedNotice.date}</span>
                </div>
              </div>

              <h3 id="homeNoticeModalTitle" className="text-xl font-bold text-[#243B43] leading-snug">
                {selectedNotice.title}
              </h3>

              <div className="p-4 bg-[#EAF5F7]/60 rounded-2xl border border-[#A5D1DC]/50 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                <p>{selectedNotice.description}</p>
                <p className="text-xs text-slate-500 pt-1">
                  Issued by: <strong>Office of Administration, Sainthia Shishutirtha</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Simulated PDF Download: ${selectedNotice.title}.pdf`);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#308599]" />
                  <span>Download Circular PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="px-6 py-3 min-h-[48px] bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
