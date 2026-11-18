import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import LeadershipProfilesSection from '@/components/leadership/LeadershipProfilesSection';
import { getPublishedLeadershipProfiles } from '@/lib/cms/leadership';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('about');
}
export default async function AboutPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('about');
  if (!pageData) notFound();
  const leadership = await getPublishedLeadershipProfiles(locale);
  return (
    <CmsWebsitePage
      pageData={pageData}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      locale={locale}
      availableLocales={availableLocales}
    >
      <LeadershipProfilesSection profiles={leadership} locale={locale} />
    </CmsWebsitePage>
  );
}
