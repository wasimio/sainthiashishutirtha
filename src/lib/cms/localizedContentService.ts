import 'server-only';

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { cacheLife, cacheTag } from 'next/cache';
import type { Json } from '@/types/database.types';
import type { Locale } from '@/lib/i18n/locales';
import type { ClassDetail } from '@/data/schoolData';
import {
  getPublishedPage,
  getPublishedSchoolSettings,
  getPublishedNavigation,
  getPublishedNotices,
  getPublishedNoticeBySlug,
  getPublishedFaculty,
  getPublishedGalleryItems,
  getPublishedBlogPosts,
  getPublishedBlogPostBySlug,
  PublicContentError,
  type PublishedNavigationItem,
  type PublishedPageData,
  type PublishedSchoolSettings,
  type PublishedNotice,
  type PublishedFaculty,
  type PublishedGalleryItem,
  type PublishedBlogPost,
  type WebsiteSectionRow,
} from './contentService';

export interface WebsitePageTranslationRow {
  id: string;
  page_id: string;
  locale: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  structured_content: Json;
  status: string;
  is_complete: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface WebsiteSectionTranslationRow {
  id: string;
  page_translation_id: string;
  section_id: string;
  locale: string;
  title: string;
  subtitle: string | null;
  content_json: Json;
  sort_order: number;
  is_published: boolean;
}

interface SchoolSettingsTranslationRow {
  id: string;
  settings_id: string;
  locale: string;
  school_name: string;
  short_name: string | null;
  tagline: string | null;
  about_text: string | null;
  campus_address: string;
  landmark: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  office_hours: string | null;
  working_days: string | null;
  weekly_holidays: string | null;
  curriculum: string | null;
  classes_offered: string | null;
  medium_of_instruction: string | null;
  facilities_summary: string | null;
  status: string;
  is_complete: boolean;
}

interface NavigationTranslationRow {
  navigation_id: string;
  locale: string;
  label: string;
  status: string;
  is_complete: boolean;
}

interface NoticeTranslationRow {
  notice_id: string; locale: string; slug: string; title: string; summary: string | null; content: string;
  seo_title: string | null; seo_description: string | null; status: string; is_complete: boolean;
}

interface FacultyTranslationRow {
  faculty_id: string; locale: string; name: string | null; designation: string; department: string | null;
  qualification: string | null; bio: string | null; specialization: string | null; photo_alt: string;
  status: string; is_complete: boolean;
}

interface GalleryItemTranslationRow {
  gallery_item_id: string; locale: string; title: string; caption: string | null; alt_text: string;
  category_label: string | null; status: string; is_complete: boolean;
}

interface BlogPostTranslationRow {
  post_id: string; locale: string; slug: string; title: string; excerpt: string | null; content: string;
  cover_image_alt: string; category_label: string | null; tags: string[]; meta_title: string | null;
  meta_description: string | null; canonical_url: string | null; og_title: string | null;
  og_description: string | null; og_image_alt: string | null; status: string; is_complete: boolean;
}

interface AcademicProgramTranslationRow {
  program_key: string; locale: string; slug: string; title: string; grade_range: string; overview: string;
  age_requirement: string; school_hours: string; class_teacher: string; learning_outcomes: string[];
  curriculum_breakdown: Json; daily_routine: Json; booklist_highlights: string[]; status: string; is_complete: boolean;
}

let localizedClient: SupabaseClient | null = null;

function getLocalizedClient(): SupabaseClient {
  if (localizedClient) return localizedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new PublicContentError('configuration', 'initialize_localized_public_client');
  localizedClient = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return localizedClient;
}

function isMigrationPending(error: { code?: string; message?: string } | null): boolean {
  return Boolean(error && (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('schema cache')));
}

function failLocalizedRead(operation: string, error: { code?: string } | null): never {
  console.error('[localizedContentService] Public localized read failed.', { operation, code: error?.code || 'unavailable' });
  throw new PublicContentError('database', operation);
}

export interface PublishedLocalizedPageData extends PublishedPageData {
  structuredContent: Json;
}

export async function getPublishedLocalizedPage(slug: string, locale: Exclude<Locale, 'en'>): Promise<PublishedLocalizedPageData | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('website_page_translations');
  cacheTag(`page_${slug}:${locale}`);

  const english = await getPublishedPage(slug);
  if (!english) return null;

  const client = getLocalizedClient();
  const { data: translation, error } = await client
    .from('website_page_translations')
    .select('id,page_id,locale,title,meta_title,meta_description,structured_content,status,is_complete,published_at,created_at,updated_at')
    .eq('page_id', english.page.id)
    .eq('locale', locale)
    .eq('status', 'Published')
    .eq('is_complete', true)
    .maybeSingle();

  if (isMigrationPending(error)) return null;
  if (error) failLocalizedRead(`read_page_translation:${slug}:${locale}`, error);
  if (!translation) return null;
  const pageTranslation = translation as WebsitePageTranslationRow;

  const { data: sectionTranslations, error: sectionsError } = await client
    .from('website_section_translations')
    .select('id,page_translation_id,section_id,locale,title,subtitle,content_json,sort_order,is_published')
    .eq('page_translation_id', pageTranslation.id)
    .eq('locale', locale)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (isMigrationPending(sectionsError)) return null;
  if (sectionsError) failLocalizedRead(`read_section_translations:${slug}:${locale}`, sectionsError);
  if (!sectionTranslations?.length) return null;
  const localizedSections = sectionTranslations as WebsiteSectionTranslationRow[];

  const originals = new Map(english.sections.map((section) => [section.id, section]));
  const sections = localizedSections.flatMap((localized): WebsiteSectionRow[] => {
    const original = originals.get(localized.section_id);
    if (!original) return [];
    return [{
      ...original,
      title: localized.title,
      subtitle: localized.subtitle,
      content_json: localized.content_json,
      sort_order: localized.sort_order,
      is_published: localized.is_published,
    }];
  });
  if (!sections.length) return null;

  const page = {
    ...english.page,
    title: pageTranslation.title,
    meta_title: pageTranslation.meta_title,
    meta_description: pageTranslation.meta_description,
    published_at: pageTranslation.published_at,
    updated_at: pageTranslation.updated_at,
  };
  return {
    page,
    sections,
    sectionsByKey: Object.fromEntries(sections.map((section) => [section.section_key, section])),
    title: page.title,
    subtitle: null,
    meta_title: page.meta_title,
    meta_description: page.meta_description,
    structuredContent: pageTranslation.structured_content,
  };
}

export async function hasPublishedPageTranslation(slug: string, locale: Exclude<Locale, 'en'>): Promise<boolean> {
  return Boolean(await getPublishedLocalizedPage(slug, locale));
}

export async function getPublishedLocalizedSchoolSettings(locale: Exclude<Locale, 'en'>): Promise<PublishedSchoolSettings | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`school_settings:${locale}`);

  const english = await getPublishedSchoolSettings();
  const client = getLocalizedClient();
  const { data, error } = await client
    .from('school_settings_translations')
    .select('*')
    .eq('settings_id', 'primary_config')
    .eq('locale', locale)
    .eq('status', 'Published')
    .eq('is_complete', true)
    .maybeSingle();
  if (isMigrationPending(error)) return null;
  if (error) failLocalizedRead(`read_school_settings_translation:${locale}`, error);
  if (!data) return null;
  const translation = data as SchoolSettingsTranslationRow;

  return {
    ...english,
    school_name: translation.school_name,
    short_name: translation.short_name,
    tagline: translation.tagline,
    about_text: translation.about_text,
    campus_address: translation.campus_address,
    primary_address: translation.campus_address,
    landmark: translation.landmark,
    city: translation.city,
    district: translation.district,
    state: translation.state,
    office_hours: translation.office_hours,
    working_days: translation.working_days,
    weekly_holidays: translation.weekly_holidays,
    curriculum: translation.curriculum,
    classes_offered: translation.classes_offered,
    medium_of_instruction: translation.medium_of_instruction,
    facilities_summary: translation.facilities_summary,
  };
}

export async function getPublishedLocalizedNavigation(locale: Exclude<Locale, 'en'>): Promise<PublishedNavigationItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`navigation:${locale}`);

  const english = await getPublishedNavigation();
  if (!english.length) return [];
  const client = getLocalizedClient();
  const { data, error } = await client
    .from('website_navigation_translations')
    .select('*')
    .eq('locale', locale)
    .eq('status', 'Published')
    .eq('is_complete', true);
  if (isMigrationPending(error)) return [];
  if (error) failLocalizedRead(`read_navigation_translations:${locale}`, error);
  const labels = new Map(((data || []) as NavigationTranslationRow[]).map((item) => [item.navigation_id, item.label]));
  return english.flatMap((item) => labels.has(item.id) ? [{ ...item, label: labels.get(item.id)! }] : []);
}

async function readPublishedTranslations<Row>(
  table: string,
  resourceColumn: string,
  resourceIds: string[],
  locale: Exclude<Locale, 'en'>,
  operation: string,
): Promise<Row[]> {
  if (!resourceIds.length) return [];
  const { data, error } = await getLocalizedClient()
    .from(table)
    .select('*')
    .in(resourceColumn, resourceIds)
    .eq('locale', locale)
    .eq('status', 'Published')
    .eq('is_complete', true);
  if (isMigrationPending(error)) return [];
  if (error) failLocalizedRead(operation, error);
  return (data || []) as Row[];
}

export async function getPublishedLocalizedNotices(
  locale: Exclude<Locale, 'en'>,
  options: { limit?: number; offset?: number; category?: string } = {},
): Promise<PublishedNotice[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`notices:${locale}`);
  const masters = await getPublishedNotices({ ...options, limit: undefined, offset: undefined });
  const rows = await readPublishedTranslations<NoticeTranslationRow>('notice_translations', 'notice_id', masters.map((item) => item.id), locale, `read_notice_translations:${locale}`);
  const translations = new Map(rows.map((row) => [row.notice_id, row]));
  let localized = masters.flatMap((item) => {
    const translation = translations.get(item.id);
    return translation ? [{ ...item, slug: translation.slug, title: translation.title, summary: translation.summary, content: translation.content }] : [];
  });
  const offset = options.offset || 0;
  if (options.limit) localized = localized.slice(offset, offset + options.limit);
  return localized;
}

export type PublishedLocalizedNotice = PublishedNotice & { source_slug: string | null };

export async function getPublishedLocalizedNoticeBySlug(slug: string, locale: Exclude<Locale, 'en'>): Promise<PublishedLocalizedNotice | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`notice_${slug}:${locale}`);
  const client = getLocalizedClient();
  const { data: direct, error } = await client.from('notice_translations').select('*').eq('locale', locale).eq('slug', slug).eq('status', 'Published').eq('is_complete', true).maybeSingle();
  if (error && !isMigrationPending(error)) failLocalizedRead(`read_notice_translation:${slug}:${locale}`, error);
  let translation = direct as NoticeTranslationRow | null;
  const master = translation ? await getPublishedNoticeBySlug(translation.notice_id) : await getPublishedNoticeBySlug(slug);
  if (!master) return null;
  if (!translation) {
    const rows = await readPublishedTranslations<NoticeTranslationRow>('notice_translations', 'notice_id', [master.id], locale, `read_notice_translation:${slug}:${locale}`);
    translation = rows[0] || null;
  }
  if (!translation) return null;
  return { ...master, source_slug: master.slug, slug: translation.slug, title: translation.title, summary: translation.summary, content: translation.content };
}

export async function getPublishedLocalizedFaculty(locale: Exclude<Locale, 'en'>): Promise<PublishedFaculty[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`faculty:${locale}`);
  const masters = await getPublishedFaculty();
  const rows = await readPublishedTranslations<FacultyTranslationRow>('faculty_member_translations', 'faculty_id', masters.map((item) => item.id), locale, `read_faculty_translations:${locale}`);
  const translations = new Map(rows.map((row) => [row.faculty_id, row]));
  return masters.flatMap((item) => {
    const translation = translations.get(item.id);
    return translation ? [{ ...item, name: translation.name || item.name, designation: translation.designation, department: translation.department || item.department, qualification: translation.qualification, bio: translation.bio }] : [];
  });
}

export type PublishedLocalizedGalleryItem = Omit<PublishedGalleryItem, 'category'> & { category: string };

export async function getPublishedLocalizedGalleryItems(locale: Exclude<Locale, 'en'>, albumId?: string): Promise<PublishedLocalizedGalleryItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`gallery:${locale}`);
  const masters = await getPublishedGalleryItems(albumId);
  const rows = await readPublishedTranslations<GalleryItemTranslationRow>('gallery_item_translations', 'gallery_item_id', masters.map((item) => item.id), locale, `read_gallery_translations:${locale}`);
  const translations = new Map(rows.map((row) => [row.gallery_item_id, row]));
  return masters.flatMap((item) => {
    const translation = translations.get(item.id);
    return translation ? [{ ...item, title: translation.title, caption: translation.caption, alt_text: translation.alt_text, category: translation.category_label || item.category }] : [];
  });
}

export type PublishedLocalizedBlogPost = Omit<PublishedBlogPost, 'category'> & { category: string; source_slug: string };

function overlayBlogPost(master: PublishedBlogPost, translation: BlogPostTranslationRow): PublishedLocalizedBlogPost {
  return {
    ...master,
    source_slug: master.slug,
    slug: translation.slug,
    title: translation.title,
    excerpt: translation.excerpt,
    content: translation.content,
    cover_image_alt: translation.cover_image_alt,
    category: translation.category_label || master.category,
    tags: translation.tags,
    meta_title: translation.meta_title,
    meta_description: translation.meta_description,
    canonical_url: translation.canonical_url,
  };
}

export interface PublishedLocalizedBlogPostsResult {
  posts: PublishedLocalizedBlogPost[];
  totalCount: number;
}

export async function getPublishedLocalizedBlogPosts(
  locale: Exclude<Locale, 'en'>,
  options: { category?: string; search?: string; isFeatured?: boolean; limit?: number; offset?: number } = {},
): Promise<PublishedLocalizedBlogPostsResult> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`blog:${locale}`);
  const { posts } = await getPublishedBlogPosts({ isFeatured: options.isFeatured, limit: 200, offset: 0 });
  const rows = await readPublishedTranslations<BlogPostTranslationRow>('blog_post_translations', 'post_id', posts.map((item) => item.id), locale, `read_blog_translations:${locale}`);
  const translations = new Map(rows.map((row) => [row.post_id, row]));
  let localized = posts.flatMap((post) => {
    const translation = translations.get(post.id);
    return translation ? [overlayBlogPost(post, translation)] : [];
  });
  if (options.category && options.category !== 'All') localized = localized.filter((post) => post.category === options.category);
  if (options.search?.trim()) {
    const query = options.search.trim().toLocaleLowerCase('bn-IN');
    localized = localized.filter((post) => `${post.title} ${post.excerpt || ''}`.toLocaleLowerCase('bn-IN').includes(query));
  }
  const totalCount = localized.length;
  const offset = options.offset || 0;
  const limit = options.limit || 9;
  return { posts: localized.slice(offset, offset + limit), totalCount };
}

export async function getPublishedLocalizedBlogPostBySlug(slug: string, locale: Exclude<Locale, 'en'>): Promise<PublishedLocalizedBlogPost | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`blog_${slug}:${locale}`);
  const client = getLocalizedClient();
  const { data: direct, error } = await client.from('blog_post_translations').select('*').eq('locale', locale).eq('slug', slug).eq('status', 'Published').eq('is_complete', true).maybeSingle();
  if (error && !isMigrationPending(error)) failLocalizedRead(`read_blog_translation:${slug}:${locale}`, error);
  let translation = direct as BlogPostTranslationRow | null;
  let master: PublishedBlogPost | null;
  if (translation) {
    const result = await getPublishedBlogPosts({ limit: 200, offset: 0 });
    master = result.posts.find((post) => post.id === translation?.post_id) || null;
  } else {
    master = await getPublishedBlogPostBySlug(slug);
  }
  if (!master) return null;
  if (!translation) {
    const rows = await readPublishedTranslations<BlogPostTranslationRow>('blog_post_translations', 'post_id', [master.id], locale, `read_blog_translation:${slug}:${locale}`);
    translation = rows[0] || null;
  }
  return translation ? overlayBlogPost(master, translation) : null;
}

export async function getPublishedLocalizedAcademicProgram(
  programKeyOrSlug: string,
  locale: Exclude<Locale, 'en'>,
  master: ClassDetail,
): Promise<ClassDetail | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`academic_program:${programKeyOrSlug}:${locale}`);
  const { data, error } = await getLocalizedClient()
    .from('academic_program_translations')
    .select('*')
    .eq('locale', locale)
    .eq('program_key', programKeyOrSlug)
    .eq('status', 'Published')
    .eq('is_complete', true)
    .maybeSingle();
  if (isMigrationPending(error)) return null;
  if (error) failLocalizedRead(`read_academic_program:${programKeyOrSlug}:${locale}`, error);
  if (!data) return null;
  const translation = data as AcademicProgramTranslationRow;
  const curriculum = Array.isArray(translation.curriculum_breakdown) ? translation.curriculum_breakdown as ClassDetail['curriculumBreakdown'] : [];
  const routine = Array.isArray(translation.daily_routine) ? translation.daily_routine as ClassDetail['dailyRoutine'] : [];
  if (!curriculum.length || !routine.length || !translation.learning_outcomes.length) return null;
  return {
    ...master,
    slug: translation.slug,
    title: translation.title,
    gradeRange: translation.grade_range,
    overview: translation.overview,
    ageRequirement: translation.age_requirement,
    schoolHours: translation.school_hours,
    classTeacher: translation.class_teacher,
    learningOutcomes: translation.learning_outcomes,
    curriculumBreakdown: curriculum,
    dailyRoutine: routine,
    booklistHighlights: translation.booklist_highlights,
  };
}
