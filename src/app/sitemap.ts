import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { CLASS_DETAILS } from '@/data/schoolData';

type Frequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

const STATIC_ROUTES = [
  { slug: 'home', path: '/', frequency: 'weekly' as Frequency, priority: 1 },
  { slug: 'about', path: '/about', frequency: 'monthly' as Frequency, priority: 0.8 },
  { slug: 'academics', path: '/academics', frequency: 'monthly' as Frequency, priority: 0.8 },
  { slug: 'admissions', path: '/admissions', frequency: 'weekly' as Frequency, priority: 0.9 },
  { slug: 'facilities', path: '/facilities', frequency: 'monthly' as Frequency, priority: 0.7 },
  { slug: 'faculty', path: '/faculty', frequency: 'monthly' as Frequency, priority: 0.7 },
  { slug: 'gallery', path: '/gallery', frequency: 'monthly' as Frequency, priority: 0.6 },
  { slug: 'notices', path: '/notices', frequency: 'daily' as Frequency, priority: 0.8 },
  { slug: 'contact', path: '/contact', frequency: 'monthly' as Frequency, priority: 0.8 },
] as const;

function localePair(
  baseUrl: string,
  englishPath: string,
  bengaliPath: string | null,
  lastModified: Date,
  changeFrequency: Frequency,
  priority: number,
): MetadataRoute.Sitemap {
  const englishUrl = `${baseUrl}${englishPath}`;
  if (!bengaliPath) return [{ url: englishUrl, lastModified, changeFrequency, priority }];
  const bengaliUrl = `${baseUrl}${bengaliPath}`;
  const alternates = { languages: { en: englishUrl, bn: bengaliUrl, 'x-default': englishUrl } };
  return [
    { url: englishUrl, lastModified, changeFrequency, priority, alternates },
    { url: bengaliUrl, lastModified, changeFrequency, priority, alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const now = new Date();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const staticRoutes = STATIC_ROUTES.flatMap((route) => localePair(baseUrl, route.path, null, now, route.frequency, route.priority));
  const academicRoutes = Object.keys(CLASS_DETAILS).flatMap((slug) => localePair(baseUrl, `/academics/${slug}`, null, now, 'monthly', 0.7));
  const blogIndex = localePair(baseUrl, '/blog', null, now, 'daily', 0.8);

  if (!supabaseUrl || !supabaseKey) return [...staticRoutes, ...academicRoutes, ...blogIndex];

  try {
    const client = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const nowIso = now.toISOString();
    const [{ data: pages }, { data: posts }, { data: notices }, { data: settingsTranslation }] = await Promise.all([
      client.from('website_pages').select('id,slug,updated_at').eq('is_published', true),
      client.from('blog_posts').select('id,slug,updated_at').eq('status', 'Published').eq('is_deleted', false).limit(500),
      client.from('notices').select('id,slug,updated_at').eq('status', 'Published').or(`expires_at.is.null,expires_at.gt.${nowIso}`).limit(500),
      client.from('school_settings_translations').select('id').eq('settings_id', 'primary_config').eq('locale', 'bn').eq('status', 'Published').eq('is_complete', true).maybeSingle(),
    ]);

    const bengaliEnabled = Boolean(settingsTranslation);
    const pageIds = (pages || []).map((page) => page.id);
    const postIds = (posts || []).map((post) => post.id);
    const noticeIds = (notices || []).map((notice) => notice.id);
    const [{ data: pageTranslations }, { data: postTranslations }, { data: noticeTranslations }, { data: academicTranslations }] = bengaliEnabled
      ? await Promise.all([
          pageIds.length ? client.from('website_page_translations').select('page_id,updated_at').in('page_id', pageIds).eq('locale', 'bn').eq('status', 'Published').eq('is_complete', true) : Promise.resolve({ data: [] }),
          postIds.length ? client.from('blog_post_translations').select('post_id,slug,updated_at').in('post_id', postIds).eq('locale', 'bn').eq('status', 'Published').eq('is_complete', true) : Promise.resolve({ data: [] }),
          noticeIds.length ? client.from('notice_translations').select('notice_id,slug,updated_at').in('notice_id', noticeIds).eq('locale', 'bn').eq('status', 'Published').eq('is_complete', true) : Promise.resolve({ data: [] }),
          client.from('academic_program_translations').select('program_key,slug,updated_at').eq('locale', 'bn').eq('status', 'Published').eq('is_complete', true),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

    const translatedPageIds = new Set((pageTranslations || []).map((row) => row.page_id));
    const pagesBySlug = new Map((pages || []).map((page) => [page.slug, page]));
    const localizedStatic = STATIC_ROUTES.flatMap((route) => {
      const page = pagesBySlug.get(route.slug);
      const hasBengali = Boolean(page && translatedPageIds.has(page.id));
      return localePair(baseUrl, route.path, hasBengali ? (route.path === '/' ? '/bn' : `/bn${route.path}`) : null, page?.updated_at ? new Date(page.updated_at) : now, route.frequency, route.priority);
    });

    const academicMap = new Map((academicTranslations || []).map((row) => [row.program_key, row]));
    const localizedAcademics = Object.keys(CLASS_DETAILS).flatMap((slug) => {
      const translation = academicMap.get(slug);
      return localePair(baseUrl, `/academics/${slug}`, translation ? `/bn/academics/${slug}` : null, translation?.updated_at ? new Date(translation.updated_at) : now, 'monthly', 0.7);
    });

    const postTranslationMap = new Map((postTranslations || []).map((row) => [row.post_id, row]));
    const localizedPosts = (posts || []).flatMap((post) => {
      const translation = postTranslationMap.get(post.id);
      return localePair(baseUrl, `/blog/${post.slug}`, translation ? `/bn/blog/${translation.slug}` : null, new Date(translation?.updated_at || post.updated_at || now), 'weekly', 0.7);
    });
    const hasBengaliBlog = (postTranslations || []).length > 0;
    const localizedBlogIndex = localePair(baseUrl, '/blog', hasBengaliBlog ? '/bn/blog' : null, now, 'daily', 0.8);

    const noticeTranslationMap = new Map((noticeTranslations || []).map((row) => [row.notice_id, row]));
    const localizedNotices = (notices || []).flatMap((notice) => {
      const translation = noticeTranslationMap.get(notice.id);
      const englishSlug = notice.slug || notice.id;
      return localePair(baseUrl, `/notices/${englishSlug}`, translation ? `/bn/notices/${translation.slug}` : null, new Date(translation?.updated_at || notice.updated_at || now), 'weekly', 0.7);
    });

    return [...localizedStatic, ...localizedAcademics, ...localizedBlogIndex, ...localizedPosts, ...localizedNotices];
  } catch {
    // Until the additive bilingual migration is approved, keep the existing
    // English sitemap intact and publish no speculative Bengali URLs.
    return [...staticRoutes, ...academicRoutes, ...blogIndex];
  }
}
