import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { cacheLife, cacheTag } from 'next/cache';
import { SCHOOL_INFO } from '@/data/schoolData';
import type { Database } from '@/types/database.types';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';

let cachedClient: SupabaseClient<Database> | null = null;

export type PublicContentErrorKind = 'configuration' | 'database' | 'unexpected';

/**
 * A safe, user-facing error for failures that must not be mistaken for missing
 * or unpublished CMS content. The original Supabase error is deliberately not
 * attached because Next.js may surface thrown errors in development output.
 */
export class PublicContentError extends Error {
  readonly kind: PublicContentErrorKind;
  readonly operation: string;

  constructor(
    kind: PublicContentErrorKind,
    operation: string,
  ) {
    super('The public website content is temporarily unavailable.');
    this.name = 'PublicContentError';
    this.kind = kind;
    this.operation = operation;
  }
}

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('code' in error)) return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' && code ? code : undefined;
}

function failPublicContentRead(
  kind: PublicContentErrorKind,
  operation: string,
  error?: unknown,
): never {
  console.error('[contentService] Public CMS read failed.', {
    kind,
    operation,
    code: getErrorCode(error) || 'unavailable',
  });
  throw new PublicContentError(kind, operation);
}

function getPublicClient(): SupabaseClient<Database> {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    failPublicContentRead('configuration', 'initialize_public_client');
  }

  cachedClient = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

export type SchoolSettingsRow = Database['public']['Tables']['school_settings']['Row'];
export type WebsitePageRow = Database['public']['Tables']['website_pages']['Row'];
export type WebsiteSectionRow = Database['public']['Tables']['website_sections']['Row'];

export interface PublishedSchoolSettings {
  school_name: string;
  short_name: string | null;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  about_text: string | null;
  estd_year: string | null;
  school_type: string | null;
  board: string | null;
  registration_no: string | null;
  affiliation: string | null;
  udise_code: string;
  udise_number?: string;
  campus_address: string;
  primary_address?: string;
  landmark: string | null;
  ward: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  map_location_url: string | null;
  official_phone: string;
  primary_phone: string | null;
  secondary_phone: string | null;
  admission_phone: string | null;
  official_email: string;
  primary_email?: string;
  affiliation_board?: string | null;
  social_links: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  summer_timing: string | null;
  winter_timing: string | null;
  working_days: string | null;
  weekly_holidays: string | null;
  office_hours: string | null;
  admission_hours: string | null;
  curriculum: string | null;
  classes_offered: string | null;
  academic_session: string | null;
  medium_of_instruction: string | null;
  facilities_summary: string | null;
  published_at: string | null;
}

export interface PublishedPageData {
  page: WebsitePageRow;
  sections: WebsiteSectionRow[];
  sectionsByKey: Record<string, WebsiteSectionRow>;
  title?: string;
  subtitle?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

function getDefaultSchoolSettings(): PublishedSchoolSettings {
  return {
    school_name: SCHOOL_INFO.name,
    short_name: 'SST',
    tagline: SCHOOL_INFO.tagline,
    logo_url: null,
    favicon_url: null,
    about_text: null,
    estd_year: SCHOOL_INFO.estdYear,
    school_type: 'Co-Educational Primary School',
    board: null,
    registration_no: null,
    affiliation: SCHOOL_INFO.affiliation,
    affiliation_board: SCHOOL_INFO.affiliation,
    udise_code: SCHOOL_INFO.udiseNo,
    udise_number: SCHOOL_INFO.udiseNo,
    campus_address: SCHOOL_INFO.address,
    primary_address: SCHOOL_INFO.address,
    landmark: null,
    ward: null,
    city: 'Sainthia',
    district: 'Birbhum',
    state: 'West Bengal',
    pincode: '731234',
    map_location_url: null,
    official_phone: SCHOOL_INFO.phone,
    primary_phone: SCHOOL_INFO.primaryPhone,
    secondary_phone: SCHOOL_INFO.secondaryPhone,
    admission_phone: SCHOOL_INFO.primaryPhone,
    official_email: SCHOOL_INFO.email,
    primary_email: SCHOOL_INFO.email,
    social_links: {},
    summer_timing: SCHOOL_INFO.summerTiming,
    winter_timing: SCHOOL_INFO.winterTiming,
    working_days: 'Monday to Saturday',
    weekly_holidays: 'Sunday',
    office_hours: SCHOOL_INFO.officeHours,
    admission_hours: null,
    curriculum: null,
    classes_offered: SCHOOL_INFO.classesOffered,
    academic_session: null,
    medium_of_instruction: null,
    facilities_summary: null,
    published_at: null,
  };
}

/**
 * Fetches published institutional settings from Supabase.
 * Strictly ignores draft_settings and unpublished edits.
 * Merges cleanly over baseline defaults if database is unreachable.
 */
export async function getPublishedSchoolSettings(): Promise<PublishedSchoolSettings> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('school_settings');

  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('school_settings')
      .select('*')
      .eq('id', 'primary_config')
      .maybeSingle();

    if (error) {
      failPublicContentRead('database', 'read_school_settings', error);
    }

    if (!data) {
      return getDefaultSchoolSettings();
    }

    return {
      school_name: data.school_name || SCHOOL_INFO.name,
      short_name: data.short_name || 'SST',
      tagline: data.tagline || SCHOOL_INFO.tagline,
      logo_url: data.logo_url || null,
      favicon_url: data.favicon_url || null,
      about_text: data.about_text || null,
      estd_year: data.estd_year || SCHOOL_INFO.estdYear,
      school_type: data.school_type || 'Co-Educational Primary School',
      board: data.board || null,
      registration_no: data.registration_no || null,
      affiliation: data.affiliation || SCHOOL_INFO.affiliation,
      affiliation_board: data.affiliation || SCHOOL_INFO.affiliation,
      udise_code: data.udise_code || SCHOOL_INFO.udiseNo,
      udise_number: data.udise_code || SCHOOL_INFO.udiseNo,
      campus_address: data.campus_address || SCHOOL_INFO.address,
      primary_address: data.campus_address || SCHOOL_INFO.address,
      landmark: data.landmark || null,
      ward: data.ward || null,
      city: data.city || 'Sainthia',
      district: data.district || 'Birbhum',
      state: data.state || 'West Bengal',
      pincode: data.pincode || '731234',
      map_location_url: data.map_location_url || null,
      official_phone: data.official_phone || SCHOOL_INFO.phone,
      primary_phone: data.primary_phone || SCHOOL_INFO.primaryPhone,
      secondary_phone: data.secondary_phone || SCHOOL_INFO.secondaryPhone,
      admission_phone: data.admission_phone || SCHOOL_INFO.primaryPhone,
      official_email: data.official_email || SCHOOL_INFO.email,
      primary_email: data.official_email || SCHOOL_INFO.email,
      social_links:
        data.social_links && typeof data.social_links === 'object' && !Array.isArray(data.social_links)
          ? (data.social_links as PublishedSchoolSettings['social_links'])
          : {},
      summer_timing: data.summer_timing || SCHOOL_INFO.summerTiming,
      winter_timing: data.winter_timing || SCHOOL_INFO.winterTiming,
      working_days: data.working_days || 'Monday to Saturday',
      weekly_holidays: data.weekly_holidays || 'Sunday',
      office_hours: data.office_hours || SCHOOL_INFO.officeHours,
      admission_hours: data.admission_hours || null,
      curriculum: data.curriculum || null,
      classes_offered: data.classes_offered || SCHOOL_INFO.classesOffered,
      academic_session: data.academic_session || null,
      medium_of_instruction: data.medium_of_instruction || null,
      facilities_summary: data.facilities_summary || null,
      published_at: data.published_at || null,
    };
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_school_settings', err);
  }
}

/**
 * Fetches published page metadata and sections for a specific canonical slug.
 * Enforces is_published = true. Uncommitted drafts return null.
 */
export async function getPublishedPage(slug: string): Promise<PublishedPageData | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('website_pages');
  cacheTag(`page_${slug}`);

  try {
    const supabase = getPublicClient();

    // 1. Fetch published page
    const { data: pageRow, error: pageErr } = await supabase
      .from('website_pages')
      .select('id, slug, title, meta_title, meta_description, is_published, published_at, created_by, updated_by, created_at, updated_at')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (pageErr) {
      failPublicContentRead('database', `read_page:${slug}`, pageErr);
    }

    if (!pageRow) {
      return null;
    }

    // Keep draft columns out of the public data graph even though RLS already
    // prevents anonymous visitors from reading unpublished rows.
    const page: WebsitePageRow = {
      ...pageRow,
      content_revision: (pageRow as { content_revision?: number }).content_revision ?? 1,
      draft_data: null,
      draft_updated_at: null,
      draft_updated_by: null,
    };

    // 2. Fetch published sections for this page
    const { data: sectionRows, error: sectionsErr } = await supabase
      .from('website_sections')
      .select('id, page_id, section_key, section_type, title, subtitle, content_json, sort_order, is_published, updated_by, created_at, updated_at')
      .eq('page_id', page.id)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });

    if (sectionsErr) {
      failPublicContentRead('database', `read_page_sections:${slug}`, sectionsErr);
    }

    if (!sectionRows) {
      failPublicContentRead('unexpected', `read_page_sections:${slug}`);
    }

    const sections: WebsiteSectionRow[] = sectionRows.map((section) => ({
      ...section,
      is_new_in_draft: false,
      draft_title: null,
      draft_subtitle: null,
      draft_content: null,
      draft_sort_order: null,
      draft_updated_at: null,
      draft_updated_by: null,
      is_deleted_in_draft: false,
    }));

    const sectionsByKey: Record<string, WebsiteSectionRow> = {};
    for (const sec of sections) {
      sectionsByKey[sec.section_key] = sec;
    }

    return {
      page,
      sections,
      sectionsByKey,
      title: page.title,
      subtitle: null,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
    };
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', `read_page:${slug}`, err);
  }
}

export type PublishedNotice = Database['public']['Tables']['notices']['Row'];

/**
 * Fetches published notices eligible for public display.
 * Strictly respects is_published = true, publication date <= now, and expiry date > now.
 * Never falls back to fabricated data; returns empty array when no notices are published,
 * and raises PublicContentError on database failure.
 */
export async function getPublishedNotices(options: {
  limit?: number;
  offset?: number;
  category?: string;
} = {}): Promise<PublishedNotice[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('notices');

  try {
    const supabase = getPublicClient();
    const nowIso = new Date().toISOString();

    let query = supabase
      .from('notices')
      .select('*')
      .eq('status', 'Published')
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false });

    if (options.category && options.category !== 'All') {
      query = query.eq('category', options.category as Database['public']['Tables']['notices']['Row']['category']);
    }

    if (options.limit) {
      const from = options.offset || 0;
      query = query.range(from, from + options.limit - 1);
    }

    const { data, error } = await query;
    if (error) {
      failPublicContentRead('database', 'read_notices', error);
    }

    return data || [];
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_notices', err);
  }
}

/**
 * Fetches single published notice by slug.
 * Strictly ignores draft/unpublished records and raises on database error.
 */
export async function getPublishedNoticeBySlug(slug: string): Promise<PublishedNotice | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag(`notice_${slug}`);

  try {
    const supabase = getPublicClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    let query = supabase
      .from('notices')
      .select('*')
      .eq('status', 'Published');

    if (isUuid) {
      query = query.or(`slug.eq.${slug},id.eq.${slug}`);
    } else {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      failPublicContentRead('database', `read_notice:${slug}`, error);
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', `read_notice:${slug}`, err);
  }
}

export type PublishedFaculty = Database['public']['Tables']['faculty_members']['Row'];

/**
 * Fetches published and active faculty members.
 * Returns empty array when no faculty members are published.
 * Never serves fabricated fallback data.
 */
export async function getPublishedFaculty(): Promise<PublishedFaculty[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('faculty');

  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('faculty_members')
      .select('*')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      failPublicContentRead('database', 'read_faculty', error);
    }

    const faculty = (data || []) as PublishedFaculty[];
    const assetUuids = faculty
      .map((f) => f.photo_url?.trim())
      .filter((u): u is string => Boolean(u && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u)));

    if (assetUuids.length > 0) {
      const { data: assets } = await supabase
        .from('media_assets')
        .select('id, public_url, file_path, storage_provider')
        .in('id', assetUuids);

      if (assets && assets.length > 0) {
        const assetMap = new Map(assets.map((a) => [a.id, a.public_url || resolvePublicMediaUrl(a)]));
        for (const f of faculty) {
          if (f.photo_url && assetMap.has(f.photo_url.trim())) {
            f.photo_url = assetMap.get(f.photo_url.trim())!;
          }
        }
      }
    }

    return faculty;
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_faculty', err);
  }
}

export type PublishedGalleryItem = Database['public']['Tables']['gallery_items']['Row'];
export type PublishedGalleryAlbum = Database['public']['Tables']['gallery_albums']['Row'];

/**
 * Fetches published gallery albums.
 * Returns empty array when no albums are published.
 */
export async function getPublishedGalleryAlbums(): Promise<PublishedGalleryAlbum[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('gallery');

  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('gallery_albums')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      failPublicContentRead('database', 'read_gallery_albums', error);
    }

    return data || [];
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_gallery_albums', err);
  }
}

/**
 * Fetches published gallery photos.
 * Returns empty array when no photos are published.
 * Never serves fabricated fallback data.
 */
export async function getPublishedGalleryItems(albumId?: string): Promise<PublishedGalleryItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('gallery');

  try {
    const supabase = getPublicClient();
    let query = supabase
      .from('gallery_items')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (albumId) {
      query = query.eq('album_id', albumId);
    }

    const { data, error } = await query;
    if (error) {
      failPublicContentRead('database', 'read_gallery_items', error);
    }

    return data || [];
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_gallery_items', err);
  }
}

export type PublishedNavigationItem = Database['public']['Tables']['website_navigation']['Row'];

/**
 * Fetches published website navigation items.
 * Returns empty array when no custom navigation items are configured.
 */
export async function getPublishedNavigation(
  menuLocation?: PublishedNavigationItem['menu_location']
): Promise<PublishedNavigationItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('navigation');

  try {
    const supabase = getPublicClient();
    let query = supabase
      .from('website_navigation')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (menuLocation) {
      query = query.eq('menu_location', menuLocation);
    }

    const { data, error } = await query;
    if (error) {
      failPublicContentRead('database', 'read_navigation', error);
    }

    return data || [];
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_navigation', err);
  }
}

/**
 * Submits a public contact enquiry with server-side validation and anti-spam check.
 * Accurately reports failure if the database mutation cannot be completed.
 */
export async function submitPublicContactEnquiry(payload: {
  parent_name: string;
  phone: string;
  email?: string;
  subject?: string;
  class_interest?: string;
  message: string;
  honeypot?: string;
}): Promise<{ success: boolean; reference_no?: string; error?: string }> {
  // Anti-spam honeypot
  if (payload.honeypot) {
    return { success: true, reference_no: 'ENQ-RECEIVED' };
  }

  const parentName = payload.parent_name?.trim();
  const phone = payload.phone?.trim();
  const message = payload.message?.trim();
  const subject = payload.subject?.trim() || 'General Inquiry';

  if (!parentName || parentName.length < 2) {
    return { success: false, error: 'Please enter a valid name (minimum 2 characters).' };
  }

  if (!phone || !/^[0-9+ -]{7,20}$/.test(phone)) {
    return { success: false, error: 'Please enter a valid phone number.' };
  }

  if (!message || message.length < 5) {
    return { success: false, error: 'Please enter a message (minimum 5 characters).' };
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceNo = `ENQ-${dateStr}-${randSuffix}`;

  try {
    const supabase = getPublicClient();
    const { error } = await supabase.from('contact_inquiries').insert({
      reference_no: referenceNo,
      parent_name: parentName,
      phone,
      email: payload.email?.trim() || null,
      subject,
      class_interest: payload.class_interest?.trim() || null,
      message,
      status: 'New',
    });

    if (error) {
      console.error('[submitPublicContactEnquiry] Insert error:', error.message);
      return { success: false, error: 'Unable to submit enquiry at this time. Please contact the school office directly.' };
    }

    return { success: true, reference_no: referenceNo };
  } catch (err) {
    console.error('[submitPublicContactEnquiry] Unexpected error:', err);
    return { success: false, error: 'Unable to submit enquiry. Please try again later.' };
  }
}

export type PublishedMediaAsset = Database['public']['Tables']['media_assets']['Row'];

export { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';

/**
 * Fetches published media assets from Supabase PostgreSQL.
 * Strictly filters by is_published = true AND status = 'ready'.
 */
export async function getPublishedMediaAssets(options: {
  category?: string;
  mimeType?: string;
  albumId?: string;
  limit?: number;
} = {}): Promise<PublishedMediaAsset[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('media');

  try {
    const supabase = getPublicClient();
    let query = supabase
      .from('media_assets')
      .select('*')
      .eq('is_published', true)
      .eq('status', 'ready')
      .order('created_at', { ascending: false });

    if (options.category && options.category !== 'All') {
      query = query.eq('category', options.category as PublishedMediaAsset['category']);
    }

    if (options.mimeType && options.mimeType !== 'All') {
      if (options.mimeType === 'image') query = query.ilike('mime_type', 'image/%');
      else if (options.mimeType === 'video') query = query.ilike('mime_type', 'video/%');
      else if (options.mimeType === 'pdf') query = query.eq('mime_type', 'application/pdf');
    }

    if (options.albumId) {
      query = query.eq('album_id', options.albumId);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) {
      failPublicContentRead('database', 'read_media_assets', error);
    }

    return (data as PublishedMediaAsset[]) || [];
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_media_assets', err);
  }
}

/**
 * Fetches a single published media asset by ID.
 * Returns null if not found or not published.
 */
export async function getPublishedMediaAssetById(id: string): Promise<PublishedMediaAsset | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('media');
  cacheTag(`media_${id}`);

  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .eq('status', 'ready')
      .maybeSingle();

    if (error) return null;
    return (data as PublishedMediaAsset) || null;
  } catch {
    return null;
  }
}

export type PublishedBlogPost = Database['public']['Tables']['blog_posts']['Row'];

export interface PublishedBlogPostsResult {
  posts: PublishedBlogPost[];
  totalCount: number;
}

/**
 * Fetches published blog articles with optional category filtering, pagination, and search.
 * Strictly respects status = 'Published' and is_deleted = false.
 */
export async function getPublishedBlogPosts(options: {
  category?: string;
  search?: string;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
} = {}): Promise<PublishedBlogPostsResult> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('blog');

  try {
    const supabase = getPublicClient();
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'Published')
      .eq('is_deleted', false)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (options.category && options.category !== 'All') {
      query = query.eq('category', options.category as PublishedBlogPost['category']);
    }

    if (options.isFeatured !== undefined) {
      query = query.eq('is_featured', options.isFeatured);
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim();
      query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
    }

    const limit = options.limit || 9;
    const offset = options.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) {
      failPublicContentRead('database', 'read_blog_posts', error);
    }

    const posts = (data as PublishedBlogPost[]) || [];
    const assetUuids = posts
      .map((p) => p.cover_image_url?.trim())
      .filter((u): u is string => Boolean(u && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u)));

    if (assetUuids.length > 0) {
      const { data: assets } = await supabase
        .from('media_assets')
        .select('id, public_url, file_path, storage_provider')
        .in('id', assetUuids);

      if (assets && assets.length > 0) {
        const assetMap = new Map(assets.map((a) => [a.id, a.public_url || resolvePublicMediaUrl(a)]));
        for (const p of posts) {
          if (p.cover_image_url && assetMap.has(p.cover_image_url.trim())) {
            p.cover_image_url = assetMap.get(p.cover_image_url.trim())!;
          }
        }
      }
    }

    return {
      posts,
      totalCount: count ?? (data?.length || 0),
    };
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', 'read_blog_posts', err);
  }
}

/**
 * Fetches a single published blog article by slug.
 */
export async function getPublishedBlogPostBySlug(slug: string): Promise<PublishedBlogPost | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('blog');
  cacheTag(`blog_${slug}`);

  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'Published')
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) {
      failPublicContentRead('database', `read_blog_post:${slug}`, error);
    }

    const post = (data as PublishedBlogPost) || null;
    if (post && post.cover_image_url && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.cover_image_url.trim())) {
      const { data: asset } = await supabase
        .from('media_assets')
        .select('id, public_url, file_path, storage_provider')
        .eq('id', post.cover_image_url.trim())
        .maybeSingle();
      if (asset) {
        post.cover_image_url = asset.public_url || resolvePublicMediaUrl(asset);
      }
    }

    return post;
  } catch (err: unknown) {
    if (err instanceof PublicContentError) throw err;
    failPublicContentRead('unexpected', `read_blog_post:${slug}`, err);
  }
}

/**
 * Fetches related blog posts in the same category, excluding the specified slug.
 */
export async function getRelatedBlogPosts(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<PublishedBlogPost[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('blog');

  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'Published')
      .eq('is_deleted', false)
      .eq('category', category as PublishedBlogPost['category'])
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return (data as PublishedBlogPost[]) || [];
  } catch {
    return [];
  }
}

export interface PublishedBlogCategory {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
}

export const CANONICAL_BLOG_CATEGORIES: PublishedBlogCategory[] = [
  { name: 'Campus News', slug: 'campus-news' },
  { name: 'Academics & Pedagogy', slug: 'academics-pedagogy' },
  { name: 'Early Childhood', slug: 'early-childhood' },
  { name: 'School Events', slug: 'school-events' },
  { name: 'Parenting & Care', slug: 'parenting-care' },
  { name: 'Achievements', slug: 'achievements' },
];

/**
 * Fetches published blog categories.
 * Tries `blog_categories` table; falls back gracefully to distinct categories from blog_posts or canonical defaults.
 */
export async function getPublishedBlogCategories(): Promise<PublishedBlogCategory[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('cms');
  cacheTag('blog');
  cacheTag('blog_categories');

  try {
    const supabase = getPublicClient();
    /* eslint-disable @typescript-eslint/no-explicit-any -- blog_categories is deployed but absent from the legacy generated Database type. */
    const { data, error } = await (supabase.from as any)('blog_categories')
      .select('id, name, slug, description, sort_order')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    if (!error && data && data.length > 0) {
      return data as PublishedBlogCategory[];
    }

    const { data: postsData } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('status', 'Published')
      .eq('is_deleted', false);

    const postCategories = (postsData || [])
      .map((p) => p.category?.trim())
      .filter((c): c is string => Boolean(c));

    const combinedNames = Array.from(
      new Set([...CANONICAL_BLOG_CATEGORIES.map((c) => c.name), ...postCategories])
    );

    return combinedNames.map((name, idx) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sort_order: idx + 1,
    }));
  } catch {
    return CANONICAL_BLOG_CATEGORIES;
  }
}



