import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Route handler for signing out the current user session.
 * Clears Supabase session cookies and redirects to /login.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const redirectUrl = new URL('/login', request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const redirectUrl = new URL('/login', request.url);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
