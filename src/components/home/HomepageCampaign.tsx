'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { HomepageCampaign as Campaign } from '@/lib/cms/homepageContent';

function remaining(target: string) {
  return Math.max(0, new Date(target).getTime() - Date.now());
}

function formatRemaining(milliseconds: number) {
  const total = Math.floor(milliseconds / 1000);
  return [Math.floor(total / 86400), Math.floor((total % 86400) / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((value) => String(value).padStart(2, '0'));
}

export default function HomepageCampaign({ campaign }: { campaign: Campaign }) {
  const [left, setLeft] = useState(() => campaign.countdownTarget ? remaining(campaign.countdownTarget) : 0);
  useEffect(() => {
    if (!campaign.enableCountdown || !campaign.countdownTarget) return;
    const tick = () => setLeft(remaining(campaign.countdownTarget!));
    tick(); const id = window.setInterval(tick, 1000); return () => window.clearInterval(id);
  }, [campaign.countdownTarget, campaign.enableCountdown]);
  const showCountdown = campaign.enableCountdown && campaign.countdownTarget && left > 0;
  const units = showCountdown ? formatRemaining(left) : [];
  const classes = {
    festive: 'from-rose-700 via-orange-600 to-amber-500', elegant: 'from-slate-950 via-slate-800 to-teal-800',
    patriotic: 'from-orange-600 via-white to-emerald-700 text-slate-900', school_event: 'from-heritage-teal via-cyan-700 to-blue-800',
    minimal: 'from-heritage-teal to-slate-800',
  }[campaign.theme];
  return <section aria-label={campaign.title} className={`relative overflow-hidden bg-gradient-to-r ${classes} py-8 text-white sm:py-12 ${campaign.animationStyle === 'fade' ? 'motion-safe:animate-pulse' : ''}`}>
    {campaign.backgroundUrl && <img src={campaign.backgroundUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />}
    {campaign.animationStyle !== 'none' && <div aria-hidden="true" className={`campaign-decoration campaign-${campaign.animationStyle}`} />}
    <div className="site-container relative grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.65fr)]">
      <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/80">{campaign.title}</p><h2 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{campaign.heading}</h2><p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-6 text-white/90 sm:text-base">{campaign.message}</p>
        {campaign.ctaLabel && campaign.ctaUrl && <Link href={campaign.ctaUrl} className="focus-ring mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-extrabold text-heritage-teal shadow-lg transition hover:bg-warm-ivory">{campaign.ctaLabel}</Link>}
      </div>
      <div className="justify-self-center md:justify-self-end">
        {campaign.imageUrl && <img src={campaign.imageUrl} alt="" className="mb-4 aspect-[16/9] w-full max-w-sm rounded-2xl object-cover shadow-xl" />}
        {showCountdown && <div className="grid grid-cols-4 gap-2" aria-label={`Countdown: ${units.join(':')}`}>{['Days', 'Hours', 'Minutes', 'Seconds'].map((label, index) => <div key={label} className="rounded-xl bg-black/20 px-2 py-3 text-center backdrop-blur"><b className="block text-xl tabular-nums">{units[index]}</b><span className="text-[10px] font-bold uppercase tracking-wide text-white/75">{label}</span></div>)}</div>}
        {campaign.enableCountdown && !showCountdown && campaign.countdownCompletion === 'message' && <p className="rounded-xl bg-black/20 px-4 py-3 text-center text-sm font-bold backdrop-blur">{campaign.message}</p>}
      </div>
    </div>
    <style jsx>{` .campaign-decoration { position:absolute; inset:0; pointer-events:none; opacity:.28; background-image:radial-gradient(circle, white 1px, transparent 1.5px); background-size:28px 28px; } .campaign-sparkles { animation: drift 10s linear infinite; } .campaign-floating { animation: float 7s ease-in-out infinite; } .campaign-confetti { background-image:linear-gradient(135deg, transparent 45%, rgba(255,255,255,.65) 46%, transparent 48%); background-size:44px 36px; animation: drift 8s linear infinite; } @keyframes drift { to { transform: translateX(-28px) translateY(28px); } } @keyframes float { 50% { transform: translateY(-10px); } } @media (prefers-reduced-motion: reduce) { .campaign-decoration, .motion-safe\\:animate-pulse { animation:none !important; } }`}</style>
  </section>;
}
