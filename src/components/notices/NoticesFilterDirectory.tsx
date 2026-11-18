'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  AlertCircle,
  Search,
  ChevronRight,
  Download,
  Filter,
  FileText,
} from 'lucide-react';
import type { NoticeItem } from '@/data/schoolData';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getLocalePath } from '@/lib/i18n/routing';

interface NoticesFilterDirectoryProps {
  notices: NoticeItem[];
  locale?: Locale;
}

export default function NoticesFilterDirectory({ notices, locale = DEFAULT_LOCALE }: NoticesFilterDirectoryProps) {
  const dictionary = getUiDictionary(locale);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(notices.map((notice) => notice.category).filter(Boolean)))];

  const filteredNotices = notices.filter((item) => {
    const matchCat = filterType === 'All' || item.category === filterType;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="noticesSearchInput"
            name="search"
            type="text"
            aria-label={dictionary.notices.searchPlaceholder}
            placeholder={dictionary.notices.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border border-slate-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto" role="group" aria-label="Circular Category Filter">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{dictionary.notices.allCategories}:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={filterType === cat}
              onClick={() => setFilterType(cat)}
              className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] ${
                filterType === cat
                  ? 'bg-[#308599] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
              }`}
            >
              {cat === 'All' ? dictionary.notices.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Cards Grid or Empty State */}
      {filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between group ${
                notice.isImportant
                  ? 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
                  : 'border-slate-200 bg-white hover:border-[#308599]'
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
                  <div className="flex items-start gap-2 flex-wrap">
                    {notice.isImportant && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded shrink-0 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        {dictionary.notices.important}
                      </span>
                    )}
                    {notice.attachments && notice.attachments.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded shrink-0 mt-0.5">
                        <FileText className="w-3 h-3 text-red-600" />
                        {dictionary.notices.attachments} · {notice.attachments.length}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#243B43] group-hover:text-[#308599] transition-colors leading-snug w-full">
                      {notice.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {notice.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={getLocalePath(`/notices/${notice.id}`, locale)}
                  className="min-h-[44px] flex items-center gap-1 font-bold text-[#308599] hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] rounded-lg px-2"
                >
                  <span>{dictionary.common.readMore}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {notice.downloadUrl && notice.downloadUrl !== '#' ? (
                  <a
                    href={notice.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
                    aria-label={`${dictionary.actions.download}: ${notice.title}`}
                    title={dictionary.actions.download}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#243B43]">
            {dictionary.common.noResults}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {dictionary.common.noResults}
          </p>
          {(searchTerm || filterType !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterType('All');
              }}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-[#308599] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {dictionary.common.clearFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
