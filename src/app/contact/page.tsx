import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('contact');
}
export default async function ContactPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('contact');
  if (!pageData) notFound();
  return (
    <CmsWebsitePage
      pageData={pageData}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      locale={locale}
      availableLocales={availableLocales}
    />
  );
}
