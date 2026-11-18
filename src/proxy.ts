import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { SITE_LOCALE_HEADER, SITE_PATHNAME_HEADER } from '@/lib/i18n/locales';

const BENGALI_PREFIX = '/bn';
const BENGALI_PUBLIC_ROOTS = new Set([
  '/',
  '/about',
  '/academics',
  '/admissions',
  '/facilities',
  '/faculty',
  '/gallery',
  '/notices',
  '/blog',
  '/contact',
]);

function isBengaliPublicPath(pathname: string): boolean {
  if (pathname === BENGALI_PREFIX) return true;
  if (!pathname.startsWith(`${BENGALI_PREFIX}/`)) return false;
  const englishPath = pathname.slice(BENGALI_PREFIX.length) || '/';
  const root = `/${englishPath.split('/').filter(Boolean)[0] || ''}`;
  return BENGALI_PUBLIC_ROOTS.has(root);
}

function withLocaleHeaders(request: NextRequest, locale: 'en' | 'bn') {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(SITE_LOCALE_HEADER, locale);
  requestHeaders.set(SITE_PATHNAME_HEADER, request.nextUrl.pathname);
  return requestHeaders;
}

function copyResponseCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  return to;
}

/**
 * Next.js 16 Proxy
 * Runs before requests are completed to enforce Phase 1 portal isolation,
 * refresh Supabase Auth sessions, and prevent unauthorized portal exposure.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isBengaliPublicPath(pathname)) {
    const englishPath = pathname === BENGALI_PREFIX ? '/' : pathname.slice(BENGALI_PREFIX.length);
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = englishPath;

    const { supabaseResponse } = await updateSession(request);
    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: withLocaleHeaders(request, 'bn') },
    });

    response.cookies.set('site-locale', 'bn', {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
    return copyResponseCookies(supabaseResponse, response);
  }

  // 1. Allow the Coming Soon page itself without redirection
  if (pathname === '/portal-coming-soon') {
    const requestHeaders = withLocaleHeaders(request, 'en');
    const { supabaseResponse } = await updateSession(request);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    return copyResponseCookies(supabaseResponse, response);
  }

  // 2. Intercept ALL Phase 2 portal and legacy routes:
  // /portal, /portal/*, /admin, /admin/*, /parent, /parent/*, /login
  // When any visitor (authenticated or unauthenticated) attempts to access these routes,
  // redirect them to the dedicated Coming Soon screen.
  if (
    pathname === '/portal' ||
    pathname.startsWith('/portal/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/parent' ||
    pathname.startsWith('/parent/') ||
    pathname === '/login'
  ) {
    return NextResponse.redirect(new URL('/portal-coming-soon', request.url));
  }

  // 3. Refresh Supabase session cookies for public routes
  const requestHeaders = withLocaleHeaders(request, 'en');
  const { supabaseResponse } = await updateSession(request);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set('site-locale', 'en', {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  return copyResponseCookies(supabaseResponse, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
