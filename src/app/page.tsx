import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import { getEligibleHomepageContent } from '@/lib/cms/homepageContent';

// CMS visibility is resolved during render; an unpublished page may intentionally 404.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('home');
}
export default async function HomePage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('home');
  if (!pageData) notFound();
  const homepageContent = await getEligibleHomepageContent(locale);
  return (
    <CmsWebsitePage
      pageData={pageData}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      home
      locale={locale}
      availableLocales={availableLocales}
      homepageContent={homepageContent}
    />
  );
}
