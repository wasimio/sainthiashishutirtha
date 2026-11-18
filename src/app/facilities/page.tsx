import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import { SCHOOL_FACILITIES } from '@/data/schoolData';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('facilities');
}

export default async function FacilitiesPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('facilities');
  if (!pageData) notFound();

  return (
    <CmsWebsitePage
      pageData={pageData}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      locale={locale}
      availableLocales={availableLocales}
    >
      {locale === 'en' && <>
      {/* Comprehensive Campus Facilities Directory */}
      <section className="site-container py-12 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF5F7] rounded-full text-xs font-bold text-[#245E6D] border border-[#A5D1DC]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Campus Infrastructure</span>
          </div>
          <h2 className="text-fluid-h2 font-extrabold text-[#1B2E35] tracking-tight">
            Safe, Joyful & Child-Friendly Campus
          </h2>
          <p className="text-fluid-body text-slate-600 leading-relaxed">
            Every learning space at Sainthia Shishutirtha is purposefully designed to encourage curiosity, safety, and holistic growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHOOL_FACILITIES.map((facility) => (
            <article data-reveal key={facility.id}
              className="premium-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-[#245E6D]">
                    {facility.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-[#1B2E35] group-hover:text-[#245E6D] transition-colors">
                    {facility.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {facility.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    {facility.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      </>}
    </CmsWebsitePage>
  );
}
