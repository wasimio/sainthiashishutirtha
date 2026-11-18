'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { getLocaleFromPathname, getLocalePath } from '@/lib/i18n/routing';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname || '/');
  const dictionary = getUiDictionary(locale);

  useEffect(() => {
    console.error('[public-site] A page could not be rendered.', {
      digest: error.digest || 'unavailable',
    });
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-[70vh] items-center bg-linear-to-b from-[#EAF5F7] via-white to-white py-16"
    >
      <section className="site-container">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#A5D1DC] bg-white px-6 py-12 text-center shadow-sm sm:px-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <AlertTriangle className="h-8 w-8" aria-hidden="true" />
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#308599]">
            {dictionary.statusPages.temporaryEyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {dictionary.statusPages.temporaryTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            {dictionary.statusPages.temporaryDescription}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#308599] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#266b7b] focus:outline-hidden focus:ring-2 focus:ring-[#308599] focus:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {dictionary.statusPages.tryAgain}
            </button>
            <Link
              href={getLocalePath('/', locale)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#A5D1DC] bg-white px-5 py-3 text-sm font-bold text-[#243B43] transition-colors hover:bg-[#EAF5F7] focus:outline-hidden focus:ring-2 focus:ring-[#308599] focus:ring-offset-2"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              {dictionary.statusPages.returnHome}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
