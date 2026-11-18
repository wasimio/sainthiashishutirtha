/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Image as ImageIcon,
  Users,
} from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import SchoolAtAGlance from '@/components/home/SchoolAtAGlance';
import WelcomeMessage from '@/components/home/WelcomeMessage';
import AdmissionEnquiryCTA from '@/components/home/AdmissionEnquiryCTA';
import ContactSection from '@/components/home/ContactSection';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import type { PublishedSchoolSettings, WebsiteSectionRow } from '@/lib/cms/contentService';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getLocalePath } from '@/lib/i18n/routing';
import { getPrincipalProfile, getPublishedLeadershipProfiles, type PublishedLeadershipProfile } from '@/lib/cms/leadership';
import { getPublishedBlogPosts, getPublishedGalleryItems } from '@/lib/cms/contentService';
import { getPublishedLocalizedBlogPosts, getPublishedLocalizedGalleryItems } from '@/lib/cms/localizedContentService';

type Content = Record<string, unknown>;

interface CmsSectionRendererProps {
  sections: WebsiteSectionRow[];
  settings?: PublishedSchoolSettings | null;
  locale?: Locale;
  showHomepageBlogPreview?: boolean;
}

type CollectionPreviewSection = Pick<WebsiteSectionRow, 'id' | 'title' | 'subtitle' | 'content_json'>;

function getContent(section: Pick<WebsiteSectionRow, 'content_json'>): Content {
  const value = section.content_json;
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Content) : {};
}

function text(content: Content, key: string): string {
  const value = content[key];
  return typeof value === 'string' ? value : '';
}

function items(content: Content, ...keys: string[]): Record<string, unknown>[] {
  for (const key of keys) {
    const value = content[key];
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is Record<string, unknown> => !!item && typeof item === 'object' && !Array.isArray(item),
      );
    }
  }
  return [];
}

function safeHref(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const href = value.trim();
  if (
    href.startsWith('/') ||
    href.startsWith('https://') ||
    href.startsWith('http://') ||
    href.startsWith('uploads/') ||
    href.startsWith('hostinger:')
  ) {
    return resolvePublicMediaUrl(href);
  }
  return null;
}

function SectionHeading({ section }: { section: Pick<WebsiteSectionRow, 'title' | 'subtitle'> }) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">{section.title}</h2>
      {section.subtitle && <p className="text-sm text-slate-600 leading-relaxed">{section.subtitle}</p>}
    </div>
  );
}

function TextImageSection({ section, locale }: { section: WebsiteSectionRow; locale: Locale }) {
  const content = getContent(section);
  const imageUrl = safeHref(content.image_url);
  const dictionary = getUiDictionary(locale);
  return (
    <section className="site-container py-14 sm:py-20">
      <div className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-12 ${text(content, 'layout_variant') === 'spotlight' ? 'rounded-[2rem] bg-heritage-teal-subtle p-6 sm:p-10' : ''}`}>
        <div className="lg:col-span-7 space-y-4">
          {text(content, 'badge') && (
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">{text(content, 'badge')}</span>
          )}
          <SectionHeading section={section} />
          <p className="whitespace-pre-line text-base leading-8 text-text-muted">
            {text(content, 'body_text') || text(content, 'body') || dictionary.sections.emptyNarrative}
          </p>
        </div>
        {imageUrl ? (
          <div className="group overflow-hidden rounded-[2rem] border border-warm-card-border bg-heritage-teal-subtle shadow-[0_24px_70px_rgba(20,56,63,0.14)] lg:col-span-5">
            <img src={imageUrl} alt={text(content, 'image_alt') || section.title} className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            {text(content, 'image_caption') && (
              <p className="px-4 py-3 text-xs text-slate-600">{text(content, 'image_caption')}</p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FeatureCardsSection({ section, locale }: { section: WebsiteSectionRow; locale: Locale }) {
  const cards = items(getContent(section), 'cards', 'items', 'features');
  const dictionary = getUiDictionary(locale);
  return (
    <section className="site-container space-y-10 py-14 sm:py-20">
      <SectionHeading section={section} />
      {cards.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${text(getContent(section), 'layout_variant') === 'compact' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
          {cards.map((card, index) => (
            <article key={`${section.id}-${index}`} className="group space-y-4 rounded-[1.75rem] border border-warm-card-border bg-white p-7 shadow-[0_14px_45px_rgba(20,56,63,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(20,56,63,0.12)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-terracotta-subtle text-terracotta transition group-hover:bg-terracotta group-hover:text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#243B43]">{String(card.title || `Feature ${index + 1}`)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{String(card.description || card.desc || '')}</p>
            </article>
          ))}
        </div>
      ) : (
          <EmptySection message={dictionary.sections.noFeatureCards} />
      )}
    </section>
  );
}

function FacilitiesSection({ section, locale }: { section: WebsiteSectionRow; locale: Locale }) {
  const facilities = items(getContent(section), 'facilities', 'items', 'cards');
  const dictionary = getUiDictionary(locale);
  return (
    <section className="site-container py-12 space-y-8">
      <SectionHeading section={section} />
      {facilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((facility, index) => (
            <article key={`${section.id}-${index}`} className="rounded-2xl bg-[#EAF5F7] border border-[#A5D1DC] p-5 space-y-2">
              <BookOpen className="w-5 h-5 text-[#308599]" />
              <h3 className="font-bold text-[#243B43]">{String(facility.title || `Facility ${index + 1}`)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{String(facility.description || facility.body || '')}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptySection message={dictionary.sections.noFacilities} />
      )}
    </section>
  );
}

async function CollectionPreview({ section, kind, locale }: { section: CollectionPreviewSection; kind: 'notices' | 'gallery' | 'faculty' | 'blog'; locale: Locale }) {
  const content = getContent(section);
  const dictionary = getUiDictionary(locale);
  // The homepage blog rail is intentionally editorially deterministic: it is
  // always the three newest published public articles, never draft content.
  const maxItems = kind === 'blog' ? 3 : Math.min(Math.max(Number(content.max_items) || 3, 1), 6);
  const dynamicRecords = kind === 'gallery'
    ? (locale === 'bn' ? await getPublishedLocalizedGalleryItems('bn') : await getPublishedGalleryItems()).slice(0, maxItems)
    : kind === 'blog'
      ? (locale === 'bn' ? (await getPublishedLocalizedBlogPosts('bn', { limit: maxItems })).posts : (await getPublishedBlogPosts({ limit: maxItems })).posts)
      : null;
  const sourceRecords = dynamicRecords || (kind === 'notices'
    ? items(content, 'notices', 'items')
    : kind === 'gallery'
      ? items(content, 'photos', 'gallery', 'items')
      : items(content, 'faculty', 'members', 'items'));
  const records = sourceRecords.map((record) => record as Record<string, unknown>);
  const destination = kind === 'blog' ? '/blog' : kind === 'gallery' ? '/gallery' : null;

  // A homepage with no eligible blog posts should not expose an empty shell.
  if (kind === 'blog' && records.length === 0) return null;

  return (
    <section className="site-container py-12 space-y-8">
      <SectionHeading section={section} />
      {records.length === 0 ? (
        <EmptySection message={dictionary.sections.noItems} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {records.map((record, index) => {
            const imageUrl = safeHref(record.image_url || record.cover_image_url || record.url);
            const href = kind === 'blog' && typeof record.slug === 'string' ? `/blog/${record.slug}` : safeHref(record.href || record.link);
            return (
            <article key={`${section.id}-${index}`} className="premium-card group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  {(kind === 'gallery' || kind === 'blog') && imageUrl ? <img src={imageUrl} alt={String(record.alt_text || record.cover_image_alt || record.alt || record.title || section.title)} className="w-full aspect-[4/3] object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
                <div className="p-5 space-y-2">
                  {kind === 'faculty' ? <Users className="w-5 h-5 text-[#308599]" /> : kind === 'notices' ? <Clock3 className="w-5 h-5 text-[#308599]" /> : kind === 'blog' ? <BookOpen className="w-5 h-5 text-[#308599]" /> : <ImageIcon className="w-5 h-5 text-[#308599]" />}
                  <h3 className="font-bold text-[#243B43]">{String(record.title || record.name || `${kind} item ${index + 1}`)}</h3>
                  {kind === 'blog' && typeof record.published_at === 'string' ? <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{new Intl.DateTimeFormat(locale === 'bn' ? 'bn-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(record.published_at))}</p> : null}
                  <p className="text-xs text-slate-600 leading-relaxed">{String(record.description || record.excerpt || record.caption || record.content || '')}</p>
                  {href ? <Link href={getLocalePath(href as string, locale)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#308599]">{dictionary.common.readMore} <ArrowRight className="w-3.5 h-3.5" /></Link> : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
      {destination && records.length > 0 ? <Link href={getLocalePath(destination, locale)} className="inline-flex items-center gap-2 text-sm font-bold text-terracotta hover:text-terracotta-hover">{kind === 'blog' ? (locale === 'bn' ? 'সব ব্লগ দেখুন' : 'View All Blogs') : dictionary.common.viewAll} <ArrowRight className="h-4 w-4" /></Link> : null}
    </section>
  );
}

function AccordionSection({ section, locale }: { section: WebsiteSectionRow; locale: Locale }) {
  const faqs = items(getContent(section), 'faqs', 'items', 'questions');
  const dictionary = getUiDictionary(locale);
  return (
    <section className="site-container py-12 space-y-6">
      <SectionHeading section={section} />
      {faqs.length > 0 ? (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details key={`${section.id}-${index}`} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-[#243B43] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#308599]" />
                {String(faq.question || faq.title || `Question ${index + 1}`)}
              </summary>
              <p className="pt-3 pl-6 text-sm text-slate-600 leading-relaxed">{String(faq.answer || faq.description || '')}</p>
            </details>
          ))}
        </div>
      ) : (
        <EmptySection message={dictionary.sections.noQuestions} />
      )}
    </section>
  );
}

function EmptySection({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">{message}</div>;
}

function UnsupportedSection({ section, locale }: { section: WebsiteSectionRow; locale: Locale }) {
  const dictionary = getUiDictionary(locale);
  return (
    <section className="site-container py-8">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        {dictionary.sections.unsupported} <code className="font-mono">{section.section_type}</code>
      </div>
    </section>
  );
}

function CmsSection({ section, settings, locale, principal }: { section: WebsiteSectionRow; settings?: PublishedSchoolSettings | null; locale: Locale; principal?: PublishedLeadershipProfile | null }) {
  switch (section.section_type) {
    case 'hero':
      return <HeroSection section={section} settings={settings} locale={locale} />;
    case 'statistics':
      return <SchoolAtAGlance section={section} settings={settings} locale={locale} />;
    case 'intro':
      return <WelcomeMessage section={section} settings={settings} locale={locale} principal={principal} />;
    case 'feature_cards':
      return <FeatureCardsSection section={section} locale={locale} />;
    case 'cta':
      return <AdmissionEnquiryCTA section={section} settings={settings} locale={locale} />;
    case 'contact_info':
      return <ContactSection section={section} settings={settings} locale={locale} />;
    case 'text_image':
      return <TextImageSection section={section} locale={locale} />;
    case 'facilities':
      return <FacilitiesSection section={section} locale={locale} />;
    case 'notices_preview':
      return <CollectionPreview section={section} kind="notices" locale={locale} />;
    case 'gallery_preview':
      return <CollectionPreview section={section} kind="gallery" locale={locale} />;
    case 'blog_preview':
      return <CollectionPreview section={section} kind="blog" locale={locale} />;
    case 'faculty_preview':
      return <CollectionPreview section={section} kind="faculty" locale={locale} />;
    case 'accordion_faq':
      return <AccordionSection section={section} locale={locale} />;
    default:
      return <UnsupportedSection section={section} locale={locale} />;
  }
}

export default async function CmsSectionRenderer({ sections, settings, locale = DEFAULT_LOCALE, showHomepageBlogPreview = false }: CmsSectionRendererProps) {
  const dictionary = getUiDictionary(locale);
  const principal = getPrincipalProfile(await getPublishedLeadershipProfiles(locale));
  const hasBlogPreview = sections.some((section) => section.section_type === 'blog_preview');
  const shouldShowHomepageBlogPreview = showHomepageBlogPreview && !hasBlogPreview;
  const hasCta = sections.some((section) => section.section_type === 'cta');
  const homepageBlogPreview = shouldShowHomepageBlogPreview ? (
    <div data-reveal>
      <CollectionPreview
        section={{
          id: 'system-homepage-blog-preview',
          title: locale === 'bn' ? 'সাম্প্রতিক ব্লগ' : 'Latest from Our Blog',
          subtitle: locale === 'bn' ? 'স্কুলের সাম্প্রতিক খবর ও গল্প' : 'School news and stories',
          content_json: {},
        }}
        kind="blog"
        locale={locale}
      />
    </div>
  ) : null;
  return (
    <div className="space-y-2">
      {sections.length > 0 ? sections.map((section) => (
        <React.Fragment key={section.id}>
          {shouldShowHomepageBlogPreview && section.section_type === 'cta' ? homepageBlogPreview : null}
          <div data-reveal><CmsSection section={section} settings={settings} locale={locale} principal={principal} /></div>
        </React.Fragment>
      )) : <EmptySection message={dictionary.sections.noSections} />}
      {shouldShowHomepageBlogPreview && !hasCta ? homepageBlogPreview : null}
    </div>
  );
}
