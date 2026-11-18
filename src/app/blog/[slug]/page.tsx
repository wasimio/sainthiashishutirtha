import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CmsImage from '@/components/media/CmsImage';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  Share2,
  Tag,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import QuickActionRail from '@/components/common/QuickActionRail';
import JsonLd from '@/components/common/JsonLd';
import {
  getPublishedBlogPostBySlug,
  getPublishedSchoolSettings,
  getRelatedBlogPosts,
  getPublishedNavigation,
} from '@/lib/cms/contentService';
import {
  getPublishedLocalizedBlogPostBySlug,
  getPublishedLocalizedBlogPosts,
  getPublishedLocalizedNavigation,
  getPublishedLocalizedSchoolSettings,
} from '@/lib/cms/localizedContentService';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import BlogContentRenderer from '@/components/blog/BlogContentRenderer';
import { extractPlainTextSnippet } from '@/lib/blog/contentProcessor';
import { getRequestLocale } from '@/lib/i18n/request';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { formatDate } from '@/lib/i18n/format';
import { getLocalePath } from '@/lib/i18n/routing';

export const instant = false;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const [post, settings] = await Promise.all([
    locale === 'bn' ? getPublishedLocalizedBlogPostBySlug(slug, 'bn') : getPublishedBlogPostBySlug(slug),
    locale === 'bn' ? getPublishedLocalizedSchoolSettings('bn') : getPublishedSchoolSettings(),
  ]);

  if (!post || !settings) return { robots: { index: false, follow: false } };

  const schoolName = settings.school_name || 'Sainthia Shishutirtha';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shishutirtha.in').replace(/\/$/, '');
  const canonicalPath = getLocalePath(`/blog/${post.slug}`, locale);
  const canonicalUrl = post.canonical_url || `${siteUrl}${canonicalPath}`;
  const title = post.meta_title || `${post.title} | ${schoolName}`;
  const description = post.meta_description || post.excerpt || extractPlainTextSnippet(post.content, 160);
  const ogImage = post.og_image_url
    ? resolvePublicMediaUrl(post.og_image_url)
    : post.cover_image_url
      ? resolvePublicMediaUrl(post.cover_image_url)
      : `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: locale === 'bn' ? { bn: canonicalUrl } : { en: canonicalUrl },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      locale: locale === 'bn' ? 'bn_IN' : 'en_IN',
      publishedTime: post.published_at || post.created_at,
      authors: [post.author_name],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.cover_image_alt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const dictionary = getUiDictionary(locale);
  const [post, settings, navigation, bengaliPost] = await Promise.all([
    locale === 'bn' ? getPublishedLocalizedBlogPostBySlug(slug, 'bn') : getPublishedBlogPostBySlug(slug),
    locale === 'bn' ? getPublishedLocalizedSchoolSettings('bn') : getPublishedSchoolSettings(),
    locale === 'bn' ? getPublishedLocalizedNavigation('bn').catch(() => []) : getPublishedNavigation().catch(() => []),
    getPublishedLocalizedBlogPostBySlug(slug, 'bn').catch(() => null),
  ]);

  if (!post || !settings) {
    notFound();
  }

  const headerNav = navigation.filter((n) => n.menu_location === 'header_main');
  const footerNav = navigation.filter((n) => n.menu_location.startsWith('footer_'));

  const relatedPosts = locale === 'bn'
    ? (await getPublishedLocalizedBlogPosts('bn', { category: post.category, limit: 4, offset: 0 })).posts.filter((item) => item.id !== post.id).slice(0, 3)
    : await getRelatedBlogPosts(slug, post.category, 3);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shishutirtha.in').replace(/\/$/, '');
  const articleUrl = `${siteUrl}${getLocalePath(`/blog/${post.slug}`, locale)}`;
  const schoolName = settings.school_name || 'Sainthia Shishutirtha';

  // Schema.org BlogPosting structured data
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || extractPlainTextSnippet(post.content, 160),
    image: post.cover_image_url ? [resolvePublicMediaUrl(post.cover_image_url)] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: schoolName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
  };

  const formattedDate = post.published_at ? formatDate(post.published_at, locale, { day: 'numeric', month: 'long', year: 'numeric' }) : dictionary.common.recent;
  const availableLocales = bengaliPost ? ['en', 'bn'] as const : ['en'] as const;
  const localePaths = bengaliPost ? {
    en: locale === 'bn' ? `/blog/${'source_slug' in post ? post.source_slug : post.slug}` : `/blog/${post.slug}`,
    bn: locale === 'bn' ? `/bn/blog/${post.slug}` : `/bn/blog/${bengaliPost.slug}`,
  } : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory text-text-body">
      <JsonLd data={blogPostingJsonLd} />
      <Navbar settings={settings} navigation={headerNav} locale={locale} availableLocales={availableLocales} localePaths={localePaths} />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-hidden">
        {/* Article Header & Breadcrumbs */}
        <section className="bg-gradient-to-b from-[#EAF5F7] via-[#EAF5F7]/40 to-white pt-8 pb-12 sm:pb-16 border-b border-slate-100">
          <div className="site-container max-w-4xl space-y-6">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <Link href={getLocalePath('/', locale)} className="hover:text-[#245E6D] transition-colors">{dictionary.common.home}</Link>
              <span>/</span>
              <Link href={getLocalePath('/blog', locale)} className="hover:text-[#245E6D] transition-colors">{dictionary.blog.title}</Link>
              <span>/</span>
              <Link href={`${getLocalePath('/blog', locale)}?category=${encodeURIComponent(post.category)}`} className="hover:text-[#245E6D] transition-colors">
                {post.category}
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#1B2E35] truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
            </nav>

            {/* Category & Read Time Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`${getLocalePath('/blog', locale)}?category=${encodeURIComponent(post.category)}`}
                className="px-3 py-1 rounded-full text-xs font-bold bg-[#245E6D] text-white hover:bg-[#1B4B57] transition-colors"
              >
                {post.category}
              </Link>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded-full border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-[#245E6D]" />
                <span>{post.reading_time_minutes} {dictionary.blog.minutesRead}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className={`text-fluid-h1 font-bold tracking-tight text-text-headline ${locale === 'bn' ? 'font-bengali-display' : 'font-display'}`}>
              {post.title}
            </h1>

            {/* Author Attribution & Date Metadata Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#245E6D] text-white flex items-center justify-center font-bold text-sm">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-[#1B2E35] block">{post.author_name}</span>
                  <span className="text-[11px] text-slate-500">{dictionary.blog.columnist} • {schoolName}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{dictionary.common.publishedOn} {formattedDate}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.cover_image_url && (
          <div className="site-container max-w-4xl -mt-6 sm:-mt-8">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <CmsImage
                src={post.cover_image_url}
                alt={post.cover_image_alt || post.title}
                fallbackSrc="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
            {post.cover_image_alt && (
              <p className="text-[11px] text-slate-400 text-center mt-2 italic">
                {post.cover_image_alt}
              </p>
            )}
          </div>
        )}

        {/* Article Body */}
        <article className="site-container max-w-3xl py-10 sm:py-14 space-y-8">
          {post.excerpt && (
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed border-l-4 border-[#245E6D] pl-4 sm:pl-6 italic bg-[#EAF5F7]/30 py-3 rounded-r-2xl">
              {post.excerpt}
            </p>
          )}

          <BlogContentRenderer content={post.content} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                {dictionary.blog.relatedTopics}:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Share Strip */}
          <div className="pt-6 pb-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#1B2E35] flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-[#245E6D]" />
              <span>{dictionary.blog.share}:</span>
            </span>

            <div className="flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${articleUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 min-h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 min-h-[38px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>Facebook</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 min-h-[38px] bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>X / Twitter</span>
              </a>
            </div>
          </div>
        </article>

        {/* Related Articles Showcase */}
        {relatedPosts.length > 0 && (
          <section className="bg-[#EAF5F7]/40 border-t border-[#A5D1DC]/40 py-12 sm:py-16">
            <div className="site-container max-w-4xl space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#245E6D] uppercase tracking-wider block">
                    {post.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1B2E35]">
                    {dictionary.blog.related}
                  </h2>
                </div>

                <Link
                  href={getLocalePath('/blog', locale)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#245E6D] hover:underline"
                >
                  <span>{dictionary.blog.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <article
                    key={rel.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[#245E6D] bg-[#EAF5F7] px-2 py-0.5 rounded">
                        {rel.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#1B2E35] group-hover:text-[#245E6D] transition-colors line-clamp-2">
                        <Link href={getLocalePath(`/blog/${rel.slug}`, locale)}>
                          {rel.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {rel.excerpt || extractPlainTextSnippet(rel.content, 80)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rel.reading_time_minutes} {dictionary.blog.minutesRead}</span>
                      <Link
                        href={getLocalePath(`/blog/${rel.slug}`, locale)}
                        className="text-xs font-bold text-[#245E6D] inline-flex items-center gap-1"
                      >
                        <span>{dictionary.common.readMore}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} navigation={footerNav} locale={locale} />
      <QuickActionRail settings={settings} locale={locale} />
    </div>
  );
}
