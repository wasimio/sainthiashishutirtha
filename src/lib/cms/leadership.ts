import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Locale } from '@/lib/i18n/locales';

export interface PublishedLeadershipProfile {
  id: string;
  role_key: string;
  name: string;
  designation: string;
  message: string | null;
  biography: string | null;
  photo_url: string | null;
  photo_alt: string | null;
  sort_order: number;
}

interface LeadershipTranslationRow {
  leadership_profile_id: string;
  name: string;
  designation: string;
  message: string | null;
  biography: string | null;
  photo_alt: string | null;
}

function client(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Public Supabase configuration is unavailable.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Missing-table errors are treated as an unapplied additive migration, never as content. */
export async function getPublishedLeadershipProfiles(locale: Locale = 'en'): Promise<PublishedLeadershipProfile[]> {
  try {
    const supabase = client();
    const { data: masters, error } = await supabase
      .from('leadership_profiles')
      .select('id, role_key, name, designation, message, biography, photo_url, photo_alt, sort_order')
      .eq('status', 'Published').eq('is_visible', true)
      .order('sort_order').order('created_at');
    if (error || !masters) return [];
    if (locale === 'en') return masters as PublishedLeadershipProfile[];

    const { data: translations, error: translationError } = await supabase
      .from('leadership_profile_translations')
      .select('leadership_profile_id, name, designation, message, biography, photo_alt')
      .eq('locale', 'bn').eq('status', 'Published').eq('is_complete', true);
    if (translationError || !translations) return [];
    const typedTranslations = translations as unknown as LeadershipTranslationRow[];
    const byProfile = new Map<string, LeadershipTranslationRow>(typedTranslations.map((item) => [item.leadership_profile_id, item]));
    return (masters as PublishedLeadershipProfile[]).flatMap((profile) => {
      const translation = byProfile.get(profile.id);
      return translation ? [{
        ...profile,
        name: translation.name,
        designation: translation.designation,
        message: translation.message,
        biography: translation.biography,
        photo_alt: translation.photo_alt || profile.photo_alt,
      }] : [];
    });
  } catch {
    return [];
  }
}

export function getPrincipalProfile(profiles: PublishedLeadershipProfile[]) {
  return profiles.find((profile) => profile.role_key === 'principal') || null;
}
