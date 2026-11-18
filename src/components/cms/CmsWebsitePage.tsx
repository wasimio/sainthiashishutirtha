import React from 'react';
import JsonLd, { getSchoolJsonLd } from '@/components/common/JsonLd';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import CmsSectionRenderer from './CmsSectionRenderer';
import type {
  PublishedPageData,
  PublishedSchoolSettings,
  PublishedNavigationItem,
} from '@/lib/cms/contentService';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import HomepageEnhancements from '@/components/home/HomepageEnhancements';
import HomepageCampaign from '@/components/home/HomepageCampaign';
import type { HomepageContent } from '@/lib/cms/homepageContent';

interface CmsWebsitePageProps {
  pageData: PublishedPageData;
  settings: PublishedSchoolSettings;
  headerNavigation?: PublishedNavigationItem[];
  footerNavigation?: PublishedNavigationItem[];
  home?: boolean;
  children?: React.ReactNode;
  locale?: Locale;
  availableLocales?: readonly Locale[];
  homepageContent?: HomepageContent;
  beforeContent?: React.ReactNode;
}

export default function CmsWebsitePage({
  pageData,
  settings,
  headerNavigation,
  footerNavigation,
  home = false,
  children,
  locale = DEFAULT_LOCALE,
  availableLocales = [DEFAULT_LOCALE],
  homepageContent,
  beforeContent,
}: CmsWebsitePageProps) {
  const { page, sections } = pageData;
  const dictionary = getUiDictionary(locale);
  const homeOrder = ['hero', 'statistics', 'intro', 'blog_preview', 'gallery_preview', 'cta'];
  const orderedSections = home
    ? [...sections].sort((left, right) => {
      const leftRank = homeOrder.indexOf(left.section_type);
      const rightRank = homeOrder.indexOf(right.section_type);
      const normalizedLeft = leftRank < 0 ? homeOrder.length : leftRank;
      const normalizedRight = rightRank < 0 ? homeOrder.length : rightRank;
      return normalizedLeft - normalizedRight || left.sort_order - right.sort_order;
    })
    : sections;
  const campaignIndex = !home || !homepageContent?.campaign ? -1 : (() => {
    const placement = homepageContent.campaign.placement;
    if (placement === 'before_hero') return 0;
    const anchor = placement === 'after_intro' ? 'intro' : 'hero';
    const index = orderedSections.findIndex((section) => section.section_type === anchor);
    return index < 0 ? 0 : index + 1;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory text-text-body">
      <JsonLd data={getSchoolJsonLd()} />
      <Navbar settings={settings} navigation={headerNavigation} locale={locale} availableLocales={availableLocales} />
      {home && homepageContent ? <HomepageEnhancements content={homepageContent} /> : null}

      {!home && (
        <PageHeader
          badge={page.slug === 'admissions' ? (settings.classes_offered || 'Lower Nursery to Class V') : sections[0]?.subtitle || settings.short_name || settings.school_name}
          title={page.title}
          subtitle={page.meta_description || dictionary.pageHeader.officialInformation}
          breadcrumbs={[{ label: page.title }]}
          locale={locale}
        />
      )}

      <main id="main-content" tabIndex={-1} className="flex-1 pb-[5.5rem] focus:outline-hidden lg:pb-0">
        {beforeContent}
        {campaignIndex >= 0 ? <><CmsSectionRenderer sections={orderedSections.slice(0, campaignIndex)} settings={settings} locale={locale} showHomepageBlogPreview={false} /><HomepageCampaign campaign={homepageContent!.campaign!} /><CmsSectionRenderer sections={orderedSections.slice(campaignIndex)} settings={settings} locale={locale} showHomepageBlogPreview={home} /></> : <CmsSectionRenderer sections={orderedSections} settings={settings} locale={locale} showHomepageBlogPreview={home} />}
        {children}
      </main>

      <Footer settings={settings} navigation={footerNavigation} locale={locale} />
      <QuickActionRail settings={settings} locale={locale} />
    </div>
  );
}
