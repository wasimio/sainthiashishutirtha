/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import type { Locale } from '@/lib/i18n/locales';

export interface HomepageTickerItem { id: string; text: string; linkUrl: string | null; }
export interface HomepagePromotion { id: string; imageUrl: string | null; heading: string; body: string | null; primaryLabel: string | null; primaryUrl: string; secondaryLabel: string | null; secondaryUrl: string | null; }
export interface HomepageCampaign {
  id: string; title: string; heading: string; message: string; imageUrl: string | null;
  backgroundUrl: string | null; ctaLabel: string | null; ctaUrl: string | null;
  countdownTarget: string | null; enableCountdown: boolean; countdownCompletion: 'message' | 'hide';
  theme: 'festive' | 'elegant' | 'patriotic' | 'school_event' | 'minimal';
  animationStyle: 'confetti' | 'sparkles' | 'floating' | 'fade' | 'none';
  placement: 'before_hero' | 'after_hero' | 'after_intro';
}
export interface HomepageContent { ticker: HomepageTickerItem[]; promotion: HomepagePromotion | null; campaign: HomepageCampaign | null; }

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Missing additive tables deliberately result in no enhancement, not a broken homepage. */
export async function getEligibleHomepageContent(locale: Locale): Promise<HomepageContent> {
  const client = publicClient();
  if (!client) return { ticker: [], promotion: null, campaign: null };
  try {
    const raw = client as any;
    const now = new Date().toISOString();
    const [{ data: tickerRows, error: tickerError }, { data: promotionRows, error: promotionError }, { data: campaignRows, error: campaignError }] = await Promise.all([
      raw.from('homepage_ticker_items').select('id, text_en, text_bn, link_url')
        .eq('status', 'Published').eq('is_visible', true)
        .or(`publish_at.is.null,publish_at.lte.${now}`).or(`expires_at.is.null,expires_at.gte.${now}`)
        .order('sort_order').order('created_at'),
      raw.from('homepage_promotions').select('*')
        .eq('status', 'Published').eq('is_enabled', true)
        .or(`publish_at.is.null,publish_at.lte.${now}`).or(`expires_at.is.null,expires_at.gte.${now}`)
        .order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(1),
      raw.from('homepage_campaigns').select('*')
        .eq('status', 'Published').eq('is_enabled', true)
        .or(`starts_at.is.null,starts_at.lte.${now}`).or(`ends_at.is.null,ends_at.gt.${now}`)
        .order('priority', { ascending: false }).order('created_at', { ascending: true }).limit(1),
    ]);
    if (tickerError || promotionError || campaignError) return { ticker: [], promotion: null, campaign: null };
    const ticker = (tickerRows || []).flatMap((row: any) => {
      const text = (locale === 'bn' ? row.text_bn : row.text_en)?.trim();
      return text ? [{ id: row.id, text, linkUrl: row.link_url || null }] : [];
    });
    const campaignRow = campaignRows?.[0];
    const campaign = campaignRow && (locale !== 'bn' || (campaignRow.heading_bn?.trim() && campaignRow.message_bn?.trim())) ? {
      id: campaignRow.id, title: campaignRow.title,
      heading: locale === 'bn' ? campaignRow.heading_bn.trim() : campaignRow.heading_en.trim(),
      message: locale === 'bn' ? campaignRow.message_bn.trim() : campaignRow.message_en.trim(),
      imageUrl: campaignRow.image_url ? resolvePublicMediaUrl(campaignRow.image_url) : null,
      backgroundUrl: campaignRow.background_url ? resolvePublicMediaUrl(campaignRow.background_url) : null,
      ctaLabel: locale === 'bn' ? campaignRow.cta_label_bn || null : campaignRow.cta_label_en || null,
      ctaUrl: campaignRow.cta_url || null, countdownTarget: campaignRow.countdown_target || null,
      enableCountdown: Boolean(campaignRow.enable_countdown), countdownCompletion: campaignRow.countdown_completion,
      theme: campaignRow.theme, animationStyle: campaignRow.animation_style, placement: campaignRow.placement,
    } as HomepageCampaign : null;
    const row = promotionRows?.[0];
    if (!row) return { ticker, promotion: null, campaign };
    if (row.mode === 'blog') {
      const { data: post } = await raw.from('blog_posts').select('slug, title, excerpt, cover_image_url').eq('id', row.blog_post_id).eq('status', 'Published').eq('is_deleted', false).maybeSingle();
      if (!post) return { ticker, promotion: null, campaign };
      if (locale === 'bn') {
        const { data: translation } = await raw.from('blog_post_translations').select('slug, title, excerpt').eq('post_id', row.blog_post_id).eq('locale', 'bn').eq('status', 'Published').eq('is_complete', true).maybeSingle();
        if (!translation) return { ticker, promotion: null, campaign };
        return { ticker, campaign, promotion: { id: row.id, imageUrl: post.cover_image_url ? resolvePublicMediaUrl(post.cover_image_url) : null, heading: translation.title, body: translation.excerpt || null, primaryLabel: 'ব্লগটি পড়ুন', primaryUrl: `/blog/${translation.slug}`, secondaryLabel: null, secondaryUrl: null } };
      }
      return { ticker, campaign, promotion: { id: row.id, imageUrl: post.cover_image_url ? resolvePublicMediaUrl(post.cover_image_url) : null, heading: post.title, body: post.excerpt || null, primaryLabel: 'View Blog', primaryUrl: `/blog/${post.slug}`, secondaryLabel: null, secondaryUrl: null } };
    }
    const heading = (locale === 'bn' ? row.heading_bn : row.heading_en)?.trim();
    if (!heading) return { ticker, promotion: null, campaign };
    return { ticker, campaign, promotion: { id: row.id, imageUrl: row.image_url ? resolvePublicMediaUrl(row.image_url) : null, heading, body: (locale === 'bn' ? row.body_bn : row.body_en) || null, primaryLabel: (locale === 'bn' ? row.primary_label_bn : row.primary_label_en) || null, primaryUrl: row.primary_url || '/', secondaryLabel: (locale === 'bn' ? row.secondary_label_bn : row.secondary_label_en) || null, secondaryUrl: row.secondary_url || null } };
  } catch { return { ticker: [], promotion: null, campaign: null }; }
}
