import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import {
  Calendar,
  ArrowLeft,
  Building,
  FileText,
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';
import {
  getPublishedSchoolSettings,
  getPublishedNoticeBySlug,
  getPublishedNotices,
  getPublishedNavigation,
} from '@/lib/cms/contentService';
import CmsDocumentDownload from '@/components/media/CmsDocumentDownload';
import { parseNoticeAttachments } from '@/lib/media/resolveMediaUrl';
import {
  getPublishedLocalizedNavigation,
  getPublishedLocalizedNoticeBySlug,
  getPublishedLocalizedNotices,
  getPublishedLocalizedSchoolSettings,
} from '@/lib/cms/localizedContentService';
import { getRequestLocale } from '@/lib/i18n/request';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { formatDate } from '@/lib/i18n/format';
import { getLocalePath } from '@/lib/i18n/routing';

export const instant = false;

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoticeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const locale = await getRequestLocale();
  const dbNotice = await (locale === 'bn' ? getPublishedLocalizedNoticeBySlug(id, 'bn') : getPublishedNoticeBySlug(id)).catch(() => null);
  const dictionary = getUiDictionary(locale);

  if (!dbNotice) {
    return {
      title: dictionary.notices.notFoundTitle,
      description: dictionary.notices.notFoundDescription,
      robots: { index: false, follow: false },
    };
  }

  const title = dbNotice.title;
  const description = dbNotice.summary || dbNotice.content?.slice(0, 155) || 'Official circular from Sainthia Shishu Tirtha.';

  return {
    title: `${title} | Official Notice | Sainthia Shishutirtha`,
    description: `${description}...`,
    keywords: [
      title,
      "Sainthia school notice",
      "Official circular Birbhum",
      "Shishutirtha announcements",
    ],
    alternates: { canonical: getLocalePath(`/notices/${dbNotice.slug || dbNotice.id}`, locale) },
  };
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const locale = await getRequestLocale();
  const dictionary = getUiDictionary(locale);
  const [settings, dbNotice, recentNotices, navigation, bengaliNotice] = await Promise.all([
    locale === 'bn' ? getPublishedLocalizedSchoolSettings('bn') : getPublishedSchoolSettings(),
    locale === 'bn' ? getPublishedLocalizedNoticeBySlug(id, 'bn') : getPublishedNoticeBySlug(id),
    locale === 'bn' ? getPublishedLocalizedNotices('bn', { limit: 4 }).catch(() => []) : getPublishedNotices({ limit: 4 }).catch(() => []),
    locale === 'bn' ? getPublishedLocalizedNavigation('bn').catch(() => []) : getPublishedNavigation().catch(() => []),
    getPublishedLocalizedNoticeBySlug(id, 'bn').catch(() => null),
  ]);

  if (!dbNotice || !settings) {
    notFound();
  }

  const headerNav = navigation.filter((n) => n.menu_location === 'header_main');
  const footerNav = navigation.filter((n) => n.menu_location.startsWith('footer_'));
  const localePaths = bengaliNotice ? {
    en: locale === 'bn' ? `/notices/${('source_slug' in dbNotice ? dbNotice.source_slug : dbNotice.slug || dbNotice.id)}` : `/notices/${dbNotice.slug || dbNotice.id}`,
    bn: locale === 'bn' ? `/bn/notices/${dbNotice.slug || dbNotice.id}` : `/bn/notices/${bengaliNotice.slug || bengaliNotice.id}`,
  } : undefined;

  const notice = {
    id: dbNotice.slug || dbNotice.id,
    title: dbNotice.title,
    date: dbNotice.published_at
      ? formatDate(dbNotice.published_at, locale)
      : dictionary.common.recent,
    category: dbNotice.category || 'Notice',
    description: dbNotice.content || '',
    fullContent: dbNotice.content || '',
    issuedBy: dictionary.notices.issuedBy,
  };

  const attachments = parseNoticeAttachments(dbNotice.attachment_path);

  const otherNotices = recentNotices
    .filter((n) => n.id !== dbNotice.id && n.slug !== dbNotice.slug)
    .slice(0, 3)
    .map((n) => ({
      id: n.slug || n.id,
      title: n.title,
      date: n.published_at
        ? formatDate(n.published_at, locale)
        : dictionary.common.recent,
      category: n.category,
    }));

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory text-text-body">
      <Navbar settings={settings} navigation={headerNav} locale={locale} availableLocales={bengaliNotice ? ['en', 'bn'] : ['en']} localePaths={localePaths} />

      <PageHeader
        badge={notice.category}
        title={notice.title}
        subtitle={`${dictionary.common.publishedOn} ${notice.date} · ${notice.issuedBy}`}
        breadcrumbs={[
          { label: dictionary.notices.title, href: '/notices' },
          { label: notice.title }
        ]}
        locale={locale}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 site-container max-w-4xl py-12 space-y-8 focus:outline-hidden">
        {/* Notice Reader Document Card */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#EAF5F7] text-[#245E6D] rounded-lg">
                {notice.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{notice.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={getLocalePath('/notices', locale)}
                className="px-4 py-2 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{dictionary.notices.backToNotices}</span>
              </Link>
            </div>
          </div>

          <h2 className="text-fluid-h2 font-extrabold text-[#1B2E35] leading-snug">
            {notice.title}
          </h2>

          <div className="prose prose-slate max-w-none text-fluid-body text-slate-700 leading-relaxed space-y-4">
            <p className="whitespace-pre-line">{notice.fullContent || notice.description}</p>
          </div>

          {/* Official Document Attachments Section */}
          {attachments.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#245E6D] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-600" />
                <span>{dictionary.notices.attachments} ({attachments.length})</span>
              </h3>
              <div className="space-y-3">
                {attachments.map((att, i) => (
                  <CmsDocumentDownload
                    key={att.id || att.url || i}
                    filePathOrUrl={att.url}
                    title={att.title}
                    fileSizeBytes={att.fileSize || undefined}
                    description={dictionary.notices.officialDocument}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#245E6D]" />
              <span>{dictionary.notices.issuedBy}: <strong>{notice.issuedBy}</strong></span>
            </div>

            <div className="text-[11px] text-slate-400">
              U-DISE: {SCHOOL_INFO.udiseNo} • Sainthia, Birbhum
            </div>
          </div>
        </article>

        {/* Other Recent Notices */}
        {otherNotices.length > 0 && (
          <section className="space-y-4 pt-6">
            <h3 className="text-base font-bold text-[#1B2E35]">
              {dictionary.notices.otherRecent}:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherNotices.map((n) => (
                <Link
                  key={n.id}
                  href={getLocalePath(`/notices/${n.id}`, locale)}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#245E6D] transition-all space-y-2 block group"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-[#245E6D]">{n.category}</span>
                    <span>{n.date}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1B2E35] group-hover:text-[#245E6D] line-clamp-2">
                    {n.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} navigation={footerNav} locale={locale} />

      <QuickActionRail settings={settings} locale={locale} />
    </div>
  );
}
