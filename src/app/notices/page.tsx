import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import NoticesFilterDirectory from '@/components/notices/NoticesFilterDirectory';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import { getPublishedNotices } from '@/lib/cms/contentService';
import { getPublishedLocalizedNotices } from '@/lib/cms/localizedContentService';
import { formatDate } from '@/lib/i18n/format';
import type { NoticeItem } from '@/data/schoolData';
import { resolvePublicMediaUrl, parseNoticeAttachments } from '@/lib/media/resolveMediaUrl';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('notices');
}

export default async function NoticesPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('notices');

  if (!pageData) notFound();
  const publishedNotices = locale === 'bn' ? await getPublishedLocalizedNotices('bn') : await getPublishedNotices();

  const noticeList: NoticeItem[] = publishedNotices.map((n) => {
    const parsedAttachments = parseNoticeAttachments(n.attachment_path).map((att) => ({
      ...att,
      url: resolvePublicMediaUrl(att.url),
    }));
    const primaryDownloadUrl =
      parsedAttachments[0]?.url ||
      (n.attachment_path ? resolvePublicMediaUrl(n.attachment_path) : undefined);

    return {
      id: n.slug || n.id,
      title: n.title,
      date: n.published_at
        ? formatDate(n.published_at, locale)
        : locale === 'bn' ? 'সাম্প্রতিক' : 'Recent',
      category:
        n.category === 'Circular'
          ? 'Notice'
          : n.category === 'Holiday'
            ? 'Event'
            : (n.category as NoticeItem['category']) || 'Notice',
      isImportant: n.is_pinned ?? false,
      description: n.content
        ? n.content.slice(0, 160) + '...'
        : 'Official circular from Sainthia Shishu Tirtha.',
      fullContent: n.content || undefined,
      issuedBy: 'Office of the Headmaster',
      downloadUrl: primaryDownloadUrl,
      attachments: parsedAttachments,
    };
  });

  return (
    <CmsWebsitePage
      pageData={pageData}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      locale={locale}
      availableLocales={availableLocales}
    >
      <section className="site-container py-12">
        <NoticesFilterDirectory notices={noticeList} locale={locale} />
      </section>
    </CmsWebsitePage>
  );
}
