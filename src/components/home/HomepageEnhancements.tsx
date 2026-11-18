'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { HomepageContent } from '@/lib/cms/homepageContent';

function isSafeHref(value: string | null) { return Boolean(value && (value.startsWith('/') || /^https:\/\/[^\s]+$/i.test(value))); }

export default function HomepageEnhancements({ content }: { content: HomepageContent }) {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dismiss = useCallback(() => { if (content.promotion) sessionStorage.setItem(`sst-promotion:${content.promotion.id}`, 'dismissed'); setOpen(false); }, [content.promotion]);

  useEffect(() => {
    const timer = window.setTimeout(() => { setHydrated(true); if (content.promotion && !sessionStorage.getItem(`sst-promotion:${content.promotion.id}`)) setOpen(true); }, 0);
    return () => window.clearTimeout(timer);
  }, [content.promotion]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismiss, open]);

  return <>
    {content.ticker.length > 0 && <section aria-label="School announcements" className="homepage-ticker overflow-hidden border-y border-amber-200 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 py-2.5 text-slate-950 shadow-[inset_0_-1px_0_rgba(146,64,14,0.18)]"><div className="homepage-ticker-viewport"><div className="homepage-ticker-track">{[false, true].map((duplicate) => <div key={String(duplicate)} aria-hidden={duplicate || undefined} className={`homepage-ticker-group ${duplicate ? 'homepage-ticker-group--duplicate' : ''}`}>{content.ticker.map((item) => <span key={`${item.id}-${String(duplicate)}`} className="homepage-ticker-item">{isSafeHref(item.linkUrl) ? <a href={item.linkUrl!} tabIndex={duplicate ? -1 : undefined} className="text-sm font-extrabold underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950">{item.text}</a> : <span className="text-sm font-extrabold">{item.text}</span>}<span aria-hidden className="text-base text-amber-800">✦</span></span>)}</div>)}</div></div></section>}
    {hydrated && open && content.promotion && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="homepage-promotion-title" className="relative grid max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white shadow-2xl sm:grid-cols-2"><button ref={closeRef} onClick={dismiss} className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-slate-700 shadow focus-visible:ring-2 focus-visible:ring-heritage-teal" aria-label="Close promotion"><X className="h-5 w-5" /></button>{content.promotion.imageUrl && <img src={content.promotion.imageUrl} alt="" className="h-52 w-full object-cover sm:h-full" />}{!content.promotion.imageUrl && <div className="hidden bg-heritage-teal-subtle sm:block" />}<div className="p-7"><h2 id="homepage-promotion-title" className="pr-8 text-2xl font-extrabold text-text-headline">{content.promotion.heading}</h2>{content.promotion.body && <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-muted">{content.promotion.body}</p>}<div className="mt-6 flex flex-wrap gap-3">{isSafeHref(content.promotion.primaryUrl) && <Link href={content.promotion.primaryUrl} onClick={dismiss} className="rounded-xl bg-heritage-teal px-4 py-2.5 text-sm font-bold text-white">{content.promotion.primaryLabel || 'Learn more'}</Link>}{content.promotion.secondaryLabel && isSafeHref(content.promotion.secondaryUrl) && <a href={content.promotion.secondaryUrl!} onClick={dismiss} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">{content.promotion.secondaryLabel}</a>}</div></div></section></div>}
  </>;
}
