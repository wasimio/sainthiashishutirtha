import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import {
  Calendar,
  ArrowLeft,
  Building
} from 'lucide-react';
import { NOTICES_AND_EVENTS, SCHOOL_INFO } from '@/data/schoolData';

export function generateStaticParams() {
  return NOTICES_AND_EVENTS.map((notice) => ({
    id: notice.id,
  }));
}

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = NOTICES_AND_EVENTS.find((n) => n.id === id);

  if (!notice) {
    notFound();
  }

  const otherNotices = NOTICES_AND_EVENTS.filter((n) => n.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar />

      <PageHeader
        badge={notice.category}
        title={notice.title}
        subtitle={`Published on ${notice.date} by ${notice.issuedBy || 'School Administration'}`}
        breadcrumbs={[
          { label: 'Notices', href: '/notices' },
          { label: notice.title }
        ]}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Notice Reader Document Card */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#EAF5F7] text-[#308599] rounded-lg">
                {notice.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{notice.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/notices"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Notices</span>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] leading-snug">
            {notice.title}
          </h2>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
            <p>{notice.fullContent || notice.description}</p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#308599]" />
              <span>Issued by: <strong>{notice.issuedBy || 'Sainthia Shishutirtha Office'}</strong></span>
            </div>

            <div className="text-[11px] text-slate-400">
              U-DISE: {SCHOOL_INFO.udiseNo} • Sainthia, Birbhum
            </div>
          </div>
        </article>

        {/* Other Recent Notices */}
        <section className="space-y-4 pt-6">
          <h3 className="text-base font-bold text-[#243B43]">
            Other Recent Notices & Circulars:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherNotices.map((n) => (
              <Link
                key={n.id}
                href={`/notices/${n.id}`}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#308599] transition-all space-y-2 block group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-[#308599]">{n.category}</span>
                  <span>{n.date}</span>
                </div>
                <h4 className="font-bold text-xs text-[#243B43] group-hover:text-[#308599] line-clamp-2">
                  {n.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
