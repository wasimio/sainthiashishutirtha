import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import FacultyFilterDirectory from '@/components/faculty/FacultyFilterDirectory';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import { getPublishedFaculty } from '@/lib/cms/contentService';
import { getPublishedLocalizedFaculty } from '@/lib/cms/localizedContentService';
import type { FacultyMember } from '@/data/schoolData';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('faculty');
}

export default async function FacultyPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('faculty');

  if (!pageData) notFound();
  const publishedFaculty = locale === 'bn' ? await getPublishedLocalizedFaculty('bn') : await getPublishedFaculty();

  const facultyList: FacultyMember[] = publishedFaculty.map((f) => ({
    id: f.id,
    name: f.name,
    role: f.designation || 'Educator',
    department: (f.department as FacultyMember['department']) || 'Primary',
    qualification: f.qualification || '',
    experienceYears: f.experience_years || 0,
    bio: f.bio || '',
    image: f.photo_url
      ? resolvePublicMediaUrl(f.photo_url)
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=450&q=75',
    specialization: f.designation || 'Foundational Educator',
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
      <section className="site-container py-12">
        <FacultyFilterDirectory faculty={facultyList} locale={locale} />
      </section>
    </CmsWebsitePage>
  );
}
