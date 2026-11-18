import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

let adminClientInstance: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Returns a server-only Supabase client initialized with the SUPABASE_SERVICE_ROLE_KEY.
 * 
 * SECURITY SPECIFICATIONS:
 * 1. Protected by 'server-only' package: Any accidental import into client-side components
 *    will cause a Next.js compile-time failure.
 * 2. Uses process.env.SUPABASE_SERVICE_ROLE_KEY which is NEVER prefixed with NEXT_PUBLIC_.
 * 3. Bypasses client-side RLS and is used EXCLUSIVELY inside protected Server Actions
 *    for mediated public intake (admissions enquiry RPC and contact form insertion).
 */
export function getAdminClient() {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in server environment.');
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY: The server-only privileged client requires SUPABASE_SERVICE_ROLE_KEY in the server environment.'
    );
  }

  adminClientInstance = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClientInstance;
}
