/**
 * Safe, read-only connectivity verification for the configured Supabase project.
 * 
 * IMPORTANT:
 * - Does not print, log, or return sensitive credentials or URLs.
 * - Does not create tables, insert records, or alter database state.
 * - Confirms network reachability and Auth gateway responsiveness;
 *   does NOT imply table authorization or active user session.
 */

export interface SupabaseConnectivityResult {
  ok: boolean;
  status: 'connected' | 'unreachable' | 'misconfigured';
  message: string;
  latencyMs?: number;
  service?: string;
}

export async function verifySupabaseConnectivity(): Promise<SupabaseConnectivityResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      ok: false,
      status: 'misconfigured',
      message: 'Supabase URL or Publishable Key is missing from environment variables.',
    };
  }

  const startTime = Date.now();

  try {
    // Ping the Supabase GoTrue Auth health endpoint safely
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
      },
      cache: 'no-store',
    });

    const latencyMs = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json().catch(() => null);
      const serviceName = (data && data.name) || 'GoTrue Auth';

      return {
        ok: true,
        status: 'connected',
        latencyMs,
        service: serviceName,
        message: 'Supabase project is reachable and responsive over HTTPS.',
      };
    }

    return {
      ok: false,
      status: 'unreachable',
      latencyMs,
      message: `Supabase gateway responded with HTTP status ${response.status}.`,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errMessage = error instanceof Error ? error.message : 'Unknown network error';

    return {
      ok: false,
      status: 'unreachable',
      latencyMs,
      message: `Network request to Supabase failed: ${errMessage}`,
    };
  }
}
