'use client';

import { useEffect } from 'react';

/** Progressive enhancement: content remains visible until this observer begins. */
export default function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.classList.add('motion-enabled');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const observe = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((node) => observer.observe(node));
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); root.classList.remove('motion-enabled'); };
  }, []);
  return null;
}
