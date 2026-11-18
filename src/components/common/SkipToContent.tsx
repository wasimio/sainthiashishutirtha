import React from 'react';

/**
 * Accessible "Skip to Main Content" link adhering to WCAG 2.2 AA.
 * Remains visually hidden until focused via keyboard Tab navigation.
 */
export default function SkipToContent({ label = 'Skip to main content' }: { label?: string }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#308599] focus:text-white focus:rounded-xl focus:shadow-xl focus:font-bold focus:text-xs focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1b434d] transition-all"
    >
      {label}
    </a>
  );
}
