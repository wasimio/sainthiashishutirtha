import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import GalleryGridClient from '@/components/gallery/GalleryGridClient';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import { getPublishedGalleryItems } from '@/lib/cms/contentService';
import { getPublishedLocalizedGalleryItems } from '@/lib/cms/localizedContentService';
import type { GalleryPhoto } from '@/data/schoolData';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('gallery');
}

export default async function GalleryPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('gallery');

  if (!pageData) notFound();
  const publishedItems = locale === 'bn' ? await getPublishedLocalizedGalleryItems('bn') : await getPublishedGalleryItems();

  const photoList: GalleryPhoto[] = publishedItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: (item.category as GalleryPhoto['category']) || 'Classroom',
    imageUrl: resolvePublicMediaUrl(item.image_url),
    caption: item.caption || item.title,
    altText: item.alt_text || item.title,
  }));

  return (
    <CmsWebsitePage
      pageData={pageData}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      locale={locale}
      availableLocales={availableLocales}
    >
      <section data-reveal className="site-container py-12">
        <GalleryGridClient photos={photoList} locale={locale} />
      </section>
    </CmsWebsitePage>
  );
}
