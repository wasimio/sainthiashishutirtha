import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CmsImage from '@/components/media/CmsImage';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Search
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import {
  getPublishedBlogPosts,
  getPublishedSchoolSettings,
  getPublishedNavigation,
  getPublishedBlogCategories,
} from '@/lib/cms/contentService';
import {
  getPublishedLocalizedBlogPosts,
  getPublishedLocalizedNavigation,
  getPublishedLocalizedSchoolSettings,
} from '@/lib/cms/localizedContentService';
import { extractPlainTextSnippet } from '@/lib/blog/contentProcessor';
import { getRequestLocale } from '@/lib/i18n/request';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { formatDate, formatNumber } from '@/lib/i18n/format';
import { getLocalePath } from '@/lib/i18n/routing';

export const instant = false;

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { category, q } = await searchParams;
  const locale = await getRequestLocale();
  const dictionary = getUiDictionary(locale);
  const settings = locale === 'bn' ? await getPublishedLocalizedSchoolSettings('bn') : await getPublishedSchoolSettings();
  if (!settings) return { robots: { index: false, follow: false } };
  const schoolName = settings.school_name || 'Sainthia Shishutirtha';

  let title = `${dictionary.blog.title} | ${schoolName}`;
  let description = dictionary.blog.title;

  if (category && category !== 'All') {
    title = `${category} | ${dictionary.blog.title}`;
    description = `${category} · ${schoolName}`;
  } else if (q) {
    title = `${dictionary.common.search}: "${q}" | ${dictionary.blog.title}`;
  }

  return {
    title,
    description,
    keywords: [
      'school blog sainthia',
      'primary pedagogy birbhum',
      'early childhood education tips',
      'child development west bengal',
      'shishutirtha blog',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'bn' ? 'bn_IN' : 'en_IN',
      url: getLocalePath('/blog', locale),
    },
    alternates: { canonical: getLocalePath('/blog', locale) },
  };
}

export default async function BlogListingPage({ searchParams }: BlogPageProps) {
  const { category = 'All', q = '', page = '1' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limit = 9;
  const offset = (pageNum - 1) * limit;
  const locale = await getRequestLocale();
  const dictionary = getUiDictionary(locale);

  const [settings, postsResult, navigation, categoriesList, bengaliAvailability] = await Promise.all([
    locale === 'bn' ? getPublishedLocalizedSchoolSettings('bn') : getPublishedSchoolSettings(),
    locale === 'bn' ? getPublishedLocalizedBlogPosts('bn', {
      category: category !== 'All' ? category : undefined,
      search: q.trim() || undefined,
      limit,
      offset,
    }) : getPublishedBlogPosts({
      category: category !== 'All' ? category : undefined,
      search: q.trim() || undefined,
      limit,
      offset,
    }),
    locale === 'bn' ? getPublishedLocalizedNavigation('bn').catch(() => []) : getPublishedNavigation().catch(() => []),
    locale === 'bn' ? Promise.resolve([]) : getPublishedBlogCategories().catch(() => []),
    getPublishedLocalizedBlogPosts('bn', { limit: 1, offset: 0 }).catch(() => ({ posts: [], totalCount: 0 })),
  ]);
  if (!settings || (locale === 'bn' && postsResult.totalCount === 0 && !q && category === 'All')) notFound();
  const { posts, totalCount } = postsResult;

  const categoryNames = ['All', ...new Set(locale === 'bn' ? posts.map((post) => post.category).filter(Boolean) : categoriesList.map((c) => c.name))];
  const availableLocales = bengaliAvailability.totalCount > 0 ? ['en', 'bn'] as const : ['en'] as const;

  const headerNav = navigation.filter((n) => n.menu_location === 'header_main');
  const footerNav = navigation.filter((n) => n.menu_location.startsWith('footer_'));

  const totalPages = Math.ceil(totalCount / limit);
  const featuredPost = pageNum === 1 && !q && category === 'All' && posts.length > 0 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory text-text-body">
      <Navbar settings={settings} navigation={headerNav} locale={locale} availableLocales={availableLocales} />

      <PageHeader
        badge={dictionary.blog.title}
        title={dictionary.blog.title}
        subtitle={dictionary.blog.title}
        breadcrumbs={[{ label: dictionary.blog.title }]}
        locale={locale}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 site-container py-10 sm:py-14 space-y-10 focus:outline-hidden">
        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Form */}
            <form method="GET" action={getLocalePath('/blog', locale)} className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={dictionary.blog.searchPlaceholder}
                aria-label={dictionary.blog.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border border-slate-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D] transition-all bg-white"
              />
              {category !== 'All' && (
                <input type="hidden" name="category" value={category} />
              )}
            </form>

            <div className="text-xs text-slate-500 font-medium">
              {dictionary.common.search}: <strong>{formatNumber(posts.length, locale)}</strong> / <strong>{formatNumber(totalCount, locale)}</strong>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1" role="group" aria-label={dictionary.blog.allCategories}>
            {categoryNames.map((cat) => {
              const isActive = (cat === 'All' && category === 'All') || category === cat;
              const basePath = getLocalePath('/blog', locale);
              const href = cat === 'All' ? basePath : `${basePath}?category=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#245E6D] text-white shadow-xs'
                      : 'bg-[#EAF5F7] text-slate-700 hover:text-[#245E6D] hover:bg-[#A5D1DC]/30'
                  }`}
                >
                  <span>{cat === 'All' ? dictionary.blog.allCategories : cat}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Article Card (if first page and no search) */}
        {featuredPost && (
          <article data-reveal className="premium-card bg-[#EAF5F7]/50 rounded-3xl border border-[#A5D1DC] overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[260px] bg-slate-100">
                <CmsImage
                  src={featuredPost.cover_image_url}
                  alt={featuredPost.cover_image_alt || featuredPost.title}
                  fallbackSrc="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#245E6D] shadow-xs backdrop-blur-xs">
                    {dictionary.blog.featured}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#245E6D] text-white font-bold text-[10px] uppercase">
                      {featuredPost.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredPost.reading_time_minutes} min read</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {featuredPost.published_at ? formatDate(featuredPost.published_at, locale) : dictionary.common.recent}
                      </span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#1B2E35] tracking-tight hover:text-[#245E6D] transition-colors">
                    <Link href={getLocalePath(`/blog/${featuredPost.slug}`, locale)}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt || extractPlainTextSnippet(featuredPost.content, 160)}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#A5D1DC]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <User className="w-3.5 h-3.5 text-[#245E6D]" />
                    <span>{featuredPost.author_name}</span>
                  </div>

                  <Link
                    href={getLocalePath(`/blog/${featuredPost.slug}`, locale)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] bg-[#245E6D] hover:bg-[#1B4B57] text-white text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow"
                  >
                    <span>{dictionary.blog.readArticle}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Article Grid */}
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <article data-reveal
                key={post.id}
                className="premium-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <Link href={getLocalePath(`/blog/${post.slug}`, locale)} className="block relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <CmsImage
                      src={post.cover_image_url}
                      alt={post.cover_image_alt || post.title}
                      fallbackSrc="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=75"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#245E6D]">
                      {post.category}
                    </div>
                  </Link>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {post.published_at ? formatDate(post.published_at, locale) : dictionary.common.recent}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{post.reading_time_minutes} min read</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1B2E35] group-hover:text-[#245E6D] transition-colors leading-snug line-clamp-2">
                      <Link href={getLocalePath(`/blog/${post.slug}`, locale)}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {post.excerpt || extractPlainTextSnippet(post.content, 120)}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {dictionary.common.by} {post.author_name}
                  </span>
                  <Link
                    href={getLocalePath(`/blog/${post.slug}`, locale)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#245E6D] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{dictionary.common.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-[#EAF5F7]/40 border border-[#A5D1DC] text-center space-y-4">
            <BookOpen className="w-12 h-12 text-[#245E6D] mx-auto opacity-70" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1B2E35]">{dictionary.blog.noPosts}</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {dictionary.common.noResults}
              </p>
            </div>
            {(q || category !== 'All') && (
              <Link
                href={getLocalePath('/blog', locale)}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] bg-[#245E6D] text-white text-xs font-bold rounded-xl"
              >
                <span>{dictionary.blog.allCategories}</span>
              </Link>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav aria-label="Blog pagination" className="pt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isCurrent = p === pageNum;
              const href = `${getLocalePath('/blog', locale)}?page=${p}${category !== 'All' ? `&category=${encodeURIComponent(category)}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
              return (
                <Link
                  key={p}
                  href={href}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#245E6D] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-[#EAF5F7] text-slate-700'
                  }`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {formatNumber(p, locale)}
                </Link>
              );
            })}
          </nav>
        )}
      </main>

      <Footer settings={settings} navigation={footerNav} locale={locale} />
      <QuickActionRail settings={settings} locale={locale} />
    </div>
  );
}
