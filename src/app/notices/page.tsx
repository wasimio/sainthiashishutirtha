'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import AdmissionModal from '@/components/modals/AdmissionModal';
import {
  Calendar,
  AlertCircle,
  Search,
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { NOTICES_AND_EVENTS } from '@/data/schoolData';

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Notice', 'Event', 'Academic'];

  const filteredNotices = NOTICES_AND_EVENTS.filter((item) => {
    const matchCat = filterType === 'All' || item.category === filterType;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <PageHeader
        badge="Circulars & Bulletins"
        title="Official School Notices & Events"
        subtitle="Stay informed with the latest academic circulars, vacation announcements, examination schedules, and campus events from Sainthia Shishutirtha."
        breadcrumbs={[{ label: 'Notices & Circulars' }]}
      />

      <main className="flex-1 site-container py-12 space-y-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search circulars by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === cat
                    ? 'bg-[#308599] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
                }`}
              >
                {cat === 'All' ? 'All Circulars' : `${cat}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Cards Grid */}
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

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/notices/${notice.id}`}
                  className="font-bold text-[#308599] hover:underline flex items-center gap-1"
                >
                  <span>Read Full Notice</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => alert(`Simulated PDF Download: ${notice.title}.pdf`)}
                  className="p-1.5 text-slate-400 hover:text-[#308599] hover:bg-slate-100 rounded-lg transition-colors"
                  title="Download notice as PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <QuickActionRail onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
