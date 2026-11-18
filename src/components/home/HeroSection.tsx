'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import type { PublishedSchoolSettings, WebsiteSectionRow } from '@/lib/cms/contentService';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getLocalePath } from '@/lib/i18n/routing';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';

interface HeroSectionProps { section?: WebsiteSectionRow | null; settings?: PublishedSchoolSettings | null; locale?: Locale; }
const text = (content: Record<string, unknown>, key: string) => typeof content[key] === 'string' ? content[key].trim() : '';
const isVideo = (url: string, mediaType: string) => mediaType === 'video' || /\.(mp4|webm|ogg)(?:$|[?#])/i.test(url);
function focalPosition(value: string) { return /^(left|center|right)(\s+(top|center|bottom))?$/.test(value) || /^\d{1,3}%\s+\d{1,3}%$/.test(value) ? value : 'center'; }

/** A CMS-only hero: no invented copy or stock imagery is rendered as school content. */
export default function HeroSection({ section, locale = DEFAULT_LOCALE }: HeroSectionProps) {
  const content = (section?.content_json as Record<string, unknown>) || {};
  const heading = text(content, 'heading') || section?.title || '';
  const highlightedText = text(content, 'highlighted_text');
  const description = text(content, 'description') || text(content, 'subheading') || section?.subtitle || '';
  const mediaUrl = text(content, 'media_url') || text(content, 'image_url');
  const resolvedMediaUrl = mediaUrl ? resolvePublicMediaUrl(mediaUrl) : '';
  const layout = text(content, 'hero_layout') === 'background' || text(content, 'layout_variant') === 'background' ? 'background' : 'split';
  const alignment = ['left', 'center', 'right'].includes(text(content, 'alignment')) ? text(content, 'alignment') : 'left';
  const overlay = Math.min(90, Math.max(0, Number(content.overlay_strength) || (layout === 'background' ? 58 : 0)));
  const primaryLabel = text(content, 'primary_cta_label') || text(content, 'cta_text') || (locale === 'bn' ? 'ভর্তি সম্পর্কে জানুন' : 'Admission Enquiry');
  const primaryUrl = text(content, 'primary_cta_url') || text(content, 'cta_url') || '/admissions';
  const secondaryLabel = text(content, 'secondary_cta_label') || (locale === 'bn' ? 'আমাদের সম্পর্কে' : 'About the School');
  const secondaryUrl = text(content, 'secondary_cta_url') || '/about';
  const highlights = Array.isArray(content.highlights) ? content.highlights.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
  const contentAlignment = alignment === 'center' ? 'items-center text-center' : alignment === 'right' ? 'items-end text-right' : 'items-start text-left';
  const title = highlightedText && heading.includes(highlightedText) ? <>{heading.split(highlightedText)[0]}<span className="text-terracotta">{highlightedText}</span>{heading.split(highlightedText).slice(1).join(highlightedText)}</> : heading;
  const media = resolvedMediaUrl ? (isVideo(resolvedMediaUrl, text(content, 'media_type')) ? <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" aria-label={text(content, 'media_alt') || text(content, 'image_alt') || heading}><source src={resolvedMediaUrl} /></video> : <Image src={resolvedMediaUrl} alt={text(content, 'media_alt') || text(content, 'image_alt') || heading} fill priority sizes="(max-width: 1024px) 100vw, 48vw" unoptimized className="object-cover" style={{ objectPosition: focalPosition(text(content, 'focal_position')) }} />) : null;

  return <section className={`relative overflow-hidden ${layout === 'background' ? 'min-h-[38rem] bg-heritage-teal py-20 sm:min-h-[42rem]' : 'bg-[linear-gradient(135deg,#FDFBF7_0%,#E8F2F3_100%)] py-14 sm:py-20 lg:py-24'}`}>
    {layout === 'background' && media ? <div className="absolute inset-0">{media}<div className="absolute inset-0 bg-[#14383F]" style={{ opacity: overlay / 100 }} /></div> : null}
    <div className={`site-container relative ${layout === 'background' ? 'flex min-h-[28rem] items-center' : ''}`}><div className={layout === 'split' ? 'grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,.9fr)]' : 'w-full'}>
      <div className={`flex max-w-3xl flex-col gap-6 ${contentAlignment} ${layout === 'background' ? 'text-white' : ''}`}>
        {text(content, 'badge') && <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold ${layout === 'background' ? 'border-white/25 bg-white/10 text-white' : 'border-heritage-teal/20 bg-white/80 text-heritage-teal'}`}><ShieldCheck className="h-4 w-4" />{text(content, 'badge')}</span>}
        <div className="space-y-3"><h1 className={`text-fluid-hero font-display font-bold tracking-[-0.045em] ${layout === 'background' ? 'text-white' : 'text-text-headline'}`}>{title}</h1>{description && <p className={`max-w-2xl text-fluid-body leading-relaxed ${layout === 'background' ? 'text-white/90' : 'text-text-muted'}`}>{description}</p>}</div>
        {highlights.length > 0 && <div className="flex flex-wrap gap-x-5 gap-y-2">{highlights.map((item) => <span key={item} className="inline-flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-mustard" />{item}</span>)}</div>}
        <div className="flex flex-col gap-3 sm:flex-row"><Link href={getLocalePath(primaryUrl, locale)} className="focus-ring inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-terracotta-hover"><Sparkles className="h-4 w-4 text-amber-300" />{primaryLabel}<ArrowRight className="h-4 w-4" /></Link><Link href={getLocalePath(secondaryUrl, locale)} className={`focus-ring inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 ${layout === 'background' ? 'border-white/35 bg-white/10 text-white hover:bg-white/20' : 'border-warm-card-border bg-white text-text-headline hover:bg-heritage-teal-subtle'}`}><BookOpen className="h-4 w-4" />{secondaryLabel}</Link></div>
      </div>
      {layout === 'split' && <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border-[6px] border-white bg-heritage-teal-subtle shadow-[0_28px_80px_rgba(20,56,63,0.22)]">{media || <div className="grid h-full place-items-center p-8 text-center text-sm font-semibold text-heritage-teal">Hero media can be added from the CMS.</div>}</div>}
    </div></div>
  </section>;
}
