'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { X } from 'lucide-react';
import type { HomepageContent } from '@/lib/cms/homepageContent';

function isSafeHref(value: string | null) { return Boolean(value && (value.startsWith('/') || /^https:\/\/[^\s]+$/i.test(value))); }
type TickerMetrics = { groupCount: number; distance: number; duration: number };

export default function HomepageEnhancements({ content }: { content: HomepageContent }) {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [tickerMetrics, setTickerMetrics] = useState<TickerMetrics>({ groupCount: 4, distance: 0, duration: 0 });
  const closeRef = useRef<HTMLButtonElement>(null);
  const tickerViewportRef = useRef<HTMLDivElement>(null);
  const primaryTickerGroupRef = useRef<HTMLDivElement>(null);
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

  // A pixel distance, measured from a complete visual group, avoids flex-gap
  // percentage rounding and makes the reset exactly coincide with the copy.
  useLayoutEffect(() => {
    if (!content.ticker.length) return;
    const updateTickerMetrics = () => {
      const groupWidth = primaryTickerGroupRef.current?.getBoundingClientRect().width || 0;
      const viewportWidth = tickerViewportRef.current?.getBoundingClientRect().width || 0;
      if (!groupWidth || !viewportWidth) return;
      const groupCount = Math.max(2, Math.ceil(viewportWidth / groupWidth) + 2);
      const duration = Math.max(16, Math.min(120, groupWidth / 48));
      setTickerMetrics((current) => current.groupCount === groupCount && current.distance === groupWidth && current.duration === duration ? current : { groupCount, distance: groupWidth, duration });
    };
    const frame = window.requestAnimationFrame(updateTickerMetrics);
    const observer = new ResizeObserver(updateTickerMetrics);
    if (tickerViewportRef.current) observer.observe(tickerViewportRef.current);
    if (primaryTickerGroupRef.current) observer.observe(primaryTickerGroupRef.current);
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); };
  }, [content.ticker]);

  const tickerStyle = tickerMetrics.distance > 0 ? { '--ticker-offset': `-${tickerMetrics.distance}px`, '--ticker-duration': `${tickerMetrics.duration}s` } as CSSProperties : undefined;
  return <>
    {content.ticker.length > 0 && <section aria-label="School announcements" className="homepage-ticker overflow-hidden border-y border-amber-200 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 py-2.5 text-slate-950 shadow-[inset_0_-1px_0_rgba(146,64,14,0.18)]" data-ready={tickerMetrics.distance > 0}><div ref={tickerViewportRef} className="homepage-ticker-viewport"><div className="homepage-ticker-track" style={tickerStyle}>{Array.from({ length: tickerMetrics.groupCount }).map((_, groupIndex) => { const duplicate = groupIndex > 0; return <div key={groupIndex} ref={groupIndex === 0 ? primaryTickerGroupRef : undefined} aria-hidden={duplicate || undefined} className={`homepage-ticker-group flex shrink-0 items-center whitespace-nowrap ${duplicate ? 'homepage-ticker-group--duplicate' : ''}`}>{content.ticker.map((item) => <span key={`${item.id}-${groupIndex}`} className="inline-flex items-center gap-10 px-6">{isSafeHref(item.linkUrl) ? <a href={item.linkUrl!} tabIndex={duplicate ? -1 : undefined} className="text-sm font-extrabold underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950">{item.text}</a> : <span className="text-sm font-extrabold">{item.text}</span>}<span aria-hidden className="text-base text-amber-800">✦</span></span>)}</div>; })}</div></div><style jsx global>{`@keyframes homepage-ticker-marquee { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(var(--ticker-offset), 0, 0); } } .homepage-ticker-viewport { overflow: hidden; max-width: 100%; } .homepage-ticker-track { display: flex; width: max-content; will-change: transform; } .homepage-ticker[data-ready='true'] .homepage-ticker-track { animation: homepage-ticker-marquee var(--ticker-duration) linear infinite; } .homepage-ticker:hover .homepage-ticker-track, .homepage-ticker:focus-within .homepage-ticker-track { animation-play-state: paused; } @media (prefers-reduced-motion: reduce) { .homepage-ticker-viewport { overflow-x: auto; overscroll-behavior-inline: contain; } .homepage-ticker-track { animation: none !important; transform: none !important; width: max-content; } .homepage-ticker-group--duplicate { display: none; } }`}</style></section>}
    {hydrated && open && content.promotion && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="homepage-promotion-title" className="relative grid max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white shadow-2xl sm:grid-cols-2"><button ref={closeRef} onClick={dismiss} className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-slate-700 shadow focus-visible:ring-2 focus-visible:ring-heritage-teal" aria-label="Close promotion"><X className="h-5 w-5" /></button>{content.promotion.imageUrl && <img src={content.promotion.imageUrl} alt="" className="h-52 w-full object-cover sm:h-full" />}{!content.promotion.imageUrl && <div className="hidden bg-heritage-teal-subtle sm:block" />}<div className="p-7"><h2 id="homepage-promotion-title" className="pr-8 text-2xl font-extrabold text-text-headline">{content.promotion.heading}</h2>{content.promotion.body && <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-muted">{content.promotion.body}</p>}<div className="mt-6 flex flex-wrap gap-3">{isSafeHref(content.promotion.primaryUrl) && <Link href={content.promotion.primaryUrl} onClick={dismiss} className="rounded-xl bg-heritage-teal px-4 py-2.5 text-sm font-bold text-white">{content.promotion.primaryLabel || 'Learn more'}</Link>}{content.promotion.secondaryLabel && isSafeHref(content.promotion.secondaryUrl) && <a href={content.promotion.secondaryUrl!} onClick={dismiss} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">{content.promotion.secondaryLabel}</a>}</div></div></section></div>}
  </>;
}
