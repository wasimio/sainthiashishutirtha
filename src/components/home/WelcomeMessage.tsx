import React from 'react';
import Image from 'next/image';
import { Quote, Heart } from 'lucide-react';
import type { WebsiteSectionRow, PublishedSchoolSettings } from '@/lib/cms/contentService';
import { SCHOOL_INFO } from '@/data/schoolData';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import type { PublishedLeadershipProfile } from '@/lib/cms/leadership';

interface WelcomeMessageProps {
  section?: WebsiteSectionRow | null;
  settings?: PublishedSchoolSettings | null;
  locale?: Locale;
  principal?: PublishedLeadershipProfile | null;
}

export default function WelcomeMessage({ section, settings, locale = DEFAULT_LOCALE, principal }: WelcomeMessageProps) {
  const content = (section?.content_json as Record<string, unknown>) || {};
  const quote = typeof content.quote === 'string' ? content.quote : section?.title || '';
  const bodyText = principal?.message || (typeof content.body_text === 'string' ? content.body_text : null);
  const authorName = principal?.name || (typeof content.author_name === 'string' ? content.author_name : '');
  const authorTitle = principal?.designation || (typeof content.author_title === 'string' ? content.author_title : '');
  const authorRole = typeof content.author_role === 'string' ? content.author_role : '';
  const imageUrl = principal?.photo_url
    ? resolvePublicMediaUrl(principal.photo_url)
    : typeof content.image_url === 'string' ? resolvePublicMediaUrl(content.image_url) : null;
  const schoolName = settings?.school_name || SCHOOL_INFO.name;

  return (
    <section className="border-b border-warm-card-border bg-white py-12 sm:py-16">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-warm-card-border bg-[linear-gradient(135deg,#E8F2F3,#FDFBF7)] p-5 shadow-[0_18px_50px_rgba(20,56,63,0.08)] sm:p-7 lg:p-8">
          {/* Subtle watermark / background element */}
          <div className="absolute top-4 right-6 text-[#A5D1DC]/20 pointer-events-none select-none">
            <Quote className="h-36 w-36 -mr-8 -mt-8 rotate-12" />
          </div>

          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[auto_1fr] lg:grid-cols-[12rem_minmax(0,1fr)] relative z-10">
            {/* Principal / Educator Photo Column */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {imageUrl ? <div className="relative mb-3 h-28 w-28 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg sm:h-36 sm:w-36">
                <Image
                  src={imageUrl}
                  alt={principal?.photo_alt || (typeof content.image_alt === 'string' ? content.image_alt : authorTitle || schoolName)}
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  loading="lazy"
                  // CMS media is stored at its already-public URL. Serving it directly
                  // avoids a second image-optimizer hop being the single point of failure.
                  unoptimized
                  className="object-cover"
                />
              </div> : null}

              <div className="space-y-0.5">
                <p className="text-sm font-extrabold text-text-headline">{authorName}</p>
                <p className="text-xs font-semibold text-heritage-teal">{authorTitle || authorRole}</p>
              </div>
            </div>

            {/* Welcome Message Text */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A5D1DC] bg-white px-3 py-1 text-xs font-bold text-[#245E6D]">
                <Heart className="w-3.5 h-3.5 text-[#D92525]" />
                <span>{section?.subtitle || ''}</span>
              </div>

              <h2 className="text-fluid-h2 font-extrabold tracking-tight text-[#1B2E35]">
                {quote.startsWith('"') || quote.startsWith('“') || quote.startsWith('&ldquo;') ? quote : `“${quote}”`}
              </h2>

              <div className="space-y-2 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
                {bodyText ? <p className="whitespace-pre-line">{bodyText}</p> : locale === 'en' ? (
                  <>
                    <p>Dear Parents and Guardians, welcome to <strong>{schoolName}</strong>.</p>
                    <p>Our school serves children from Lower Nursery to Class 5. Please contact us for current programme information, admission guidance, and school updates.</p>
                    <p className="text-slate-600 text-sm italic">
                      We look forward to partnering with you in your child&apos;s learning journey.
                    </p>
                  </>
                ) : null}
              </div>

              <div className="border-t border-[#A5D1DC]/50 pt-3 text-sm">
                <span className="font-bold text-text-headline">{authorName}</span>
                {authorTitle && <span className="text-text-muted"> · {authorTitle}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
