import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const ALLOWED_STATIC_TAGS = new Set([
  'cms',
  'school_settings',
  'website_pages',
  'notices',
  'faculty',
  'gallery',
  'navigation',
  'media',
  'blog',
  'website_page_translations',
  'website_navigation_translations',
  'school_settings_translations',
  'homepage_content',
  'homepage_campaigns',
  'leadership',
]);

const DYNAMIC_TAG_PATTERN = /^(page|notice|blog|media)_[a-zA-Z0-9_-]+$/;
const LOCALIZED_TAG_PATTERN = /^(page|notice|blog|media|academic_program)_[a-zA-Z0-9_-]+:(en|bn)$/;
const LOCALE_TAG_PATTERN = /^(notices|faculty|gallery|navigation|blog):(en|bn)$/;

function isValidPublicPath(path: string): boolean {
  if (typeof path !== 'string' || !path.startsWith('/') || path.includes('..')) {
    return false;
  }
  return /^\/[a-zA-Z0-9_.\-\/]*$/.test(path);
}

/**
 * On-Demand Revalidation Route Handler for CMS Publishing Events
 *
 * Invoked securely by the standalone CMS whenever an administrator publishes
 * or unpublishes institutional settings, website pages, or page sections.
 *
 * Authentication:
 * Requires a matching REVALIDATION_SECRET via a Bearer token.
 */
export async function POST(request: NextRequest) {
  try {
    const configuredSecret = process.env.REVALIDATION_SECRET;
    if (!configuredSecret) {
      return NextResponse.json(
        { success: false, error: 'REVALIDATION_SECRET is not configured on this server.' },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7).trim()
      : null;
    if (!bearerToken || bearerToken !== configuredSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid revalidation secret.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const targetPath = typeof body.path === 'string' ? body.path : '/';
    const targetTag = typeof body.tag === 'string' ? body.tag : 'cms';
    const targetLocale = body.locale === 'bn' ? 'bn' : 'en';

    if (!isValidPublicPath(targetPath)) {
      return NextResponse.json(
        { success: false, error: 'Invalid revalidation path.' },
        { status: 400 },
      );
    }

    const isDynamicTag = DYNAMIC_TAG_PATTERN.test(targetTag);
    if (!ALLOWED_STATIC_TAGS.has(targetTag) && !isDynamicTag && !LOCALIZED_TAG_PATTERN.test(targetTag) && !LOCALE_TAG_PATTERN.test(targetTag)) {
      return NextResponse.json(
        { success: false, error: 'Invalid revalidation tag.' },
        { status: 400 },
      );
    }

    // 1. Invalidate cache tags
    try {
      revalidateTag(targetTag, { expire: 0 });
      if (targetLocale === 'bn' && !targetTag.endsWith(':bn')) {
        revalidateTag(`${targetTag}:bn`, { expire: 0 });
      }
      revalidateTag('cms', { expire: 0 });
    } catch (tagErr) {
      // revalidateTag might throw if cache handlers not configured, continue
      console.warn('[revalidate] Tag invalidation note:', tagErr);
    }

    // 2. Invalidate paths
    revalidatePath(targetPath);
    const unprefixedPath = targetPath === '/bn' ? '/' : targetPath.replace(/^\/bn(?=\/)/, '');
    const localizedPath = unprefixedPath === '/' ? '/bn' : `/bn${unprefixedPath}`;
    revalidatePath(targetLocale === 'bn' ? localizedPath : unprefixedPath);
    // Always purge the root layout cache so navbar, footer and layout settings update everywhere
    revalidatePath('/', 'layout');
    revalidatePath('/bn', 'layout');

    // Contextual path revalidation for specific collections
    if (targetTag === 'notices' || targetPath.startsWith('/notices')) {
      revalidatePath('/notices');
      revalidatePath('/bn/notices');
    }
    if (targetTag === 'blog' || targetPath.startsWith('/blog')) {
      revalidatePath('/blog');
      revalidatePath('/bn/blog');
    }
    if (targetTag === 'faculty' || targetPath.startsWith('/faculty')) {
      revalidatePath('/faculty');
      revalidatePath('/bn/faculty');
    }
    if (targetTag === 'gallery' || targetPath.startsWith('/gallery')) {
      revalidatePath('/gallery');
      revalidatePath('/bn/gallery');
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      timestamp: new Date().toISOString(),
      path: targetPath,
      tag: targetTag,
      locale: targetLocale,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[revalidate] Error processing revalidation:', err);
    return NextResponse.json(
      { success: false, error: `Revalidation failed: ${message}` },
      { status: 500 }
    );
  }
}
