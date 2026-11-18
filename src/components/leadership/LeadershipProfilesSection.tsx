import Image from 'next/image';
import type { PublishedLeadershipProfile } from '@/lib/cms/leadership';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import type { Locale } from '@/lib/i18n/locales';

export default function LeadershipProfilesSection({ profiles, locale }: { profiles: PublishedLeadershipProfile[]; locale: Locale }) {
  if (!profiles.length) return null;
  const heading = locale === 'bn' ? 'আমাদের বিদ্যালয়ের নেতৃত্ব' : 'Meet the people guiding our school';
  const eyebrow = locale === 'bn' ? 'বিদ্যালয় নেতৃত্ব' : 'School leadership';
  const readMore = locale === 'bn' ? 'আরও পড়ুন' : 'Read more';
  return <section data-reveal className="border-t border-warm-card-border bg-white py-14 sm:py-20"><div className="site-container"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-widest text-terracotta">{eyebrow}</p><h2 className="mt-2 font-display text-3xl font-extrabold text-text-headline sm:text-4xl">{heading}</h2></div><div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{profiles.map((profile) => { const bio = profile.biography || profile.message; return <article key={profile.id} className="premium-card mx-auto flex w-full max-w-xs flex-col overflow-hidden rounded-[1.5rem] border border-warm-card-border bg-warm-ivory"><div className="relative aspect-[5/4] max-h-56 bg-heritage-teal-subtle">{profile.photo_url ? <Image src={resolvePublicMediaUrl(profile.photo_url)} alt={profile.photo_alt || profile.name} fill unoptimized className="object-cover object-center" /> : null}</div><div className="space-y-2 p-5"><div><p className="text-xs font-bold uppercase tracking-wider text-terracotta">{profile.designation}</p><h3 className="mt-1 text-lg font-extrabold text-text-headline">{profile.name}</h3></div>{bio ? bio.length > 280 ? <details className="text-sm leading-6 text-text-muted"><summary className="cursor-pointer font-bold text-heritage-teal">{readMore}</summary><p className="mt-2 whitespace-pre-line">{bio}</p></details> : <p className="text-sm leading-6 text-text-muted">{bio}</p> : null}</div></article>; })}</div></div></section>;
}
