import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen } from 'lucide-react';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import { getLocalePath } from '@/lib/i18n/routing';

export const instant = false;
export async function generateMetadata(): Promise<Metadata> { return getPublicPageMetadata('academics'); }

export default async function AcademicsPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('academics');
  if (!pageData) notFound();
  const bengali = locale === 'bn';
  const sections = bengali
    ? [{ title: 'প্রাক-প্রাথমিক', classes: 'লোয়ার নার্সারি, আপার নার্সারি ও কেজি' }, { title: 'প্রাথমিক', classes: 'প্রথম শ্রেণি থেকে পঞ্চম শ্রেণি' }]
    : [{ title: 'Pre-Primary', classes: 'Lower Nursery, Upper Nursery and KG' }, { title: 'Primary', classes: 'Class 1 through Class 5' }];
  return <CmsWebsitePage pageData={pageData} settings={settings} headerNavigation={headerNavigation} footerNavigation={footerNavigation} locale={locale} availableLocales={availableLocales}>
    <section className="site-container py-12 sm:py-16"><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-widest text-terracotta">{bengali ? 'শিক্ষাবিভাগ' : 'Academic sections'}</p><h2 className="mt-3 text-3xl font-extrabold text-text-headline sm:text-4xl">{bengali ? 'আমাদের শিক্ষাবিভাগ' : 'Our academic sections'}</h2><p className="mt-4 text-base leading-7 text-text-muted">{bengali ? 'বিদ্যালয়ে বর্তমানে দুটি শিক্ষাবিভাগ রয়েছে। বিস্তারিত তথ্যের জন্য বিদ্যালয় দপ্তরের সঙ্গে যোগাযোগ করুন।' : 'The school currently offers two academic sections. Please contact the school office for additional information.'}</p></div>
      <div className="mx-auto mt-9 grid max-w-4xl gap-6 md:grid-cols-2">{sections.map((section) => <article key={section.title} className="rounded-3xl border border-warm-card-border bg-white p-7 shadow-sm"><BookOpen className="h-6 w-6 text-terracotta" /><h3 className="mt-4 text-xl font-bold text-text-headline">{section.title}</h3><p className="mt-2 text-sm leading-6 text-text-muted">{section.classes}</p></article>)}</div>
      <div className="mt-9 text-center"><Link href={getLocalePath('/contact', locale)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-heritage-teal px-5 py-3 text-sm font-bold text-white hover:bg-heritage-teal-dark"><span>{bengali ? 'বিদ্যালয়ে যোগাযোগ করুন' : 'Contact the school'}</span><ArrowRight className="h-4 w-4" /></Link></div>
    </section>
  </CmsWebsitePage>;
}
