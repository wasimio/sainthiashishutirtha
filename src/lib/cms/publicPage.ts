import type { Metadata } from 'next';
import {
  getPublishedPage,
  getPublishedSchoolSettings,
  getPublishedNavigation,
  type PublishedPageData,
  type PublishedSchoolSettings,
  type PublishedNavigationItem,
} from './contentService';
import {
  getPublishedLocalizedNavigation,
  getPublishedLocalizedPage,
  getPublishedLocalizedSchoolSettings,
  hasPublishedPageTranslation,
} from './localizedContentService';
import { getRequestLocale } from '@/lib/i18n/request';
import { getLocalePath } from '@/lib/i18n/routing';
import type { Locale } from '@/lib/i18n/locales';

export const PUBLIC_PAGE_SLUGS = ['home', 'about', 'academics', 'admissions', 'notices', 'faculty', 'facilities', 'gallery', 'contact'] as const;
export type PublicPageSlug = (typeof PUBLIC_PAGE_SLUGS)[number];

const FALLBACK_METADATA: Record<PublicPageSlug, { title: string; description: string }> = {
  home: {
    title: 'Sainthia Shishutirtha | Foundational & Primary School',
    description: 'Official website of Sainthia Shishutirtha, Birbhum, West Bengal.',
  },
  about: { title: 'About Us | Sainthia Shishutirtha', description: 'Learn about Sainthia Shishu Tirtha and its educational mission.' },
  academics: { title: 'Academics | Sainthia Shishutirtha', description: 'Explore the school curriculum and academic programme.' },
  admissions: { title: 'Admissions | Sainthia Shishutirtha', description: 'Admission information and enquiry details.' },
  notices: { title: 'Notices | Sainthia Shishutirtha', description: 'Official school notices and circulars.' },
  faculty: { title: 'Faculty | Sainthia Shishutirtha', description: 'Meet the school faculty and staff.' },
  facilities: { title: 'Facilities | Sainthia Shishutirtha', description: 'Explore the school campus and facilities.' },
  gallery: { title: 'Gallery | Sainthia Shishutirtha', description: 'School campus photos and moments.' },
  contact: { title: 'Contact | Sainthia Shishutirtha', description: 'Official school contact and campus information.' },
};

export interface PublicPageContext {
  pageData: PublishedPageData | null;
  settings: PublishedSchoolSettings;
  headerNavigation: PublishedNavigationItem[];
  footerNavigation: PublishedNavigationItem[];
  locale: Locale;
  availableLocales: readonly Locale[];
}

export async function getPublicPageContext(slug: PublicPageSlug): Promise<PublicPageContext> {
  const locale = await getRequestLocale();
  const [englishSettings, pageData, localizedSettings, navigation, bengaliPageAvailable] = await Promise.all([
    getPublishedSchoolSettings(),
    locale === 'bn' ? getPublishedLocalizedPage(slug, 'bn') : getPublishedPage(slug),
    getPublishedLocalizedSchoolSettings('bn').catch(() => null),
    locale === 'bn' ? getPublishedLocalizedNavigation('bn').catch(() => []) : getPublishedNavigation().catch(() => []),
    hasPublishedPageTranslation(slug, 'bn').catch(() => false),
  ]);

  const settings = locale === 'bn' ? localizedSettings : englishSettings;
  const safePageData = locale === 'bn' && !settings ? null : pageData;

  const headerNavigation = navigation.filter((item) => item.menu_location === 'header_main');
  const footerNavigation = navigation.filter((item) => item.menu_location.startsWith('footer_'));

  const availableLocales: Locale[] = localizedSettings && bengaliPageAvailable ? ['en', 'bn'] : ['en'];
  return {
    pageData: safePageData,
    settings: settings || englishSettings,
    headerNavigation,
    footerNavigation,
    locale,
    availableLocales,
  };
}

export async function getPublicPageMetadata(slug: PublicPageSlug): Promise<Metadata> {
  const { pageData, settings, locale, availableLocales } = await getPublicPageContext(slug);
  const fallback = FALLBACK_METADATA[slug];
  const schoolName = settings.school_name || 'Sainthia Shishutirtha';
  const englishPath = slug === 'home' ? '/' : `/${slug}`;
  const canonical = getLocalePath(englishPath, locale);

  if (locale === 'bn' && !pageData) {
    return { robots: { index: false, follow: false } };
  }

  const languages: Record<string, string> = { en: englishPath, 'x-default': englishPath };
  if (availableLocales.includes('bn')) languages.bn = getLocalePath(englishPath, 'bn');
  return {
    title: pageData?.meta_title || fallback.title.replace('Sainthia Shishutirtha', schoolName),
    description: pageData?.meta_description || fallback.description,
    alternates: { canonical, languages },
    openGraph: {
      title: pageData?.meta_title || pageData?.page.title || fallback.title,
      description: pageData?.meta_description || fallback.description,
      url: canonical,
      locale: locale === 'bn' ? 'bn_IN' : 'en_IN',
      type: 'website',
    },
  };
}
