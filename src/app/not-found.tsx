import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Home, SearchX } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { getRequestLocale } from '@/lib/i18n/request';
import { getLocalePath } from '@/lib/i18n/routing';

export const instant = false;

export const metadata: Metadata = {
  title: 'Page Not Found | Sainthia Shishutirtha',
  description: 'The requested page is not currently available.',
};

export default async function NotFound() {
  const locale = await getRequestLocale();
  const dictionary = getUiDictionary(locale);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EA] text-[#14383F]">
      <Navbar locale={locale} availableLocales={locale === 'bn' ? ['en', 'bn'] : ['en']} />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 bg-linear-to-b from-[#EAF5F7] via-white to-white focus:outline-hidden"
      >
        <div className="site-container py-16 sm:py-24">
          <section className="mx-auto max-w-2xl rounded-3xl border border-[#A5D1DC] bg-white px-6 py-12 text-center shadow-sm sm:px-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF5F7] text-[#308599]">
              <SearchX className="h-8 w-8" aria-hidden="true" />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#308599]">
              {dictionary.statusPages.notFoundEyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {dictionary.statusPages.notFoundTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              {dictionary.statusPages.notFoundDescription}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={getLocalePath('/', locale)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#308599] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#266b7b] focus:outline-hidden focus:ring-2 focus:ring-[#308599] focus:ring-offset-2"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                {dictionary.statusPages.returnHome}
              </Link>
              <Link
                href={getLocalePath('/contact', locale)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#A5D1DC] bg-white px-5 py-3 text-sm font-bold text-[#243B43] transition-colors hover:bg-[#EAF5F7] focus:outline-hidden focus:ring-2 focus:ring-[#308599] focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {dictionary.statusPages.contactSchool}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
