import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type { Database, AppRole } from '@/types/database.types';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

/**
 * Retrieves the currently authenticated Supabase user on the server.
 * Returns null if the user is unauthenticated or session is invalid.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

/**
 * Fetches the trusted profile record from public.profiles for the current user.
 * Returns null if user is unauthenticated or has no profile.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  try {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return null;
    }

    return profile;
  } catch {
    return null;
  }
}

/**
 * Enforces that the current request has an authenticated session and a valid profile
 * matching one of the permitted application roles.
 * 
 * If unauthenticated or unauthorized, redirects safely to /login or the user's role-appropriate portal.
 */
export async function requireRole(
  allowedRoles: AppRole[],
  redirectPath = '/login'
): Promise<{ user: User; profile: UserProfile }> {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(redirectPath);
  }

  const profile = await getCurrentProfile();
  if (!profile || !profile.is_active) {
    redirect('/login?error=account_deactivated');
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirect to the portal matching their actual database role
    switch (profile.role) {
      case 'admin':
        redirect('/portal/admin');
      case 'staff':
        redirect('/portal/staff');
      case 'parent':
        redirect('/portal/parent');
      default:
        redirect('/login?error=unauthorized_role');
    }
  }

  return { user, profile };
}

/**
 * Requires 'admin' role. Reusable guard for Council / Super Admin routes.
 */
export async function requireAdmin(redirectPath = '/login') {
  return requireRole(['admin'], redirectPath);
}

/**
 * Requires 'staff' role. Reusable guard for Teacher / Faculty routes.
 */
export async function requireStaff(redirectPath = '/login') {
  return requireRole(['staff'], redirectPath);
}

/**
 * Requires 'parent' role. Reusable guard for Guardian routes.
 */
export async function requireParent(redirectPath = '/login') {
  return requireRole(['parent'], redirectPath);
}
