import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getRequestLocale } from '@/lib/i18n/request';
import { getLocalePath } from '@/lib/i18n/routing';

const LEGACY_SECTION_ROUTES: Record<string, true> = { 'pre-primary-kg': true, 'junior-primary': true, 'senior-primary': true, 'pre-primary': true, primary: true };
export function generateStaticParams() { return Object.keys(LEGACY_SECTION_ROUTES).map((classId) => ({ classId })); }
export async function generateMetadata(): Promise<Metadata> { return { robots: { index: false, follow: true } }; }

export default async function AcademicDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  if (!LEGACY_SECTION_ROUTES[classId]) notFound();
  const locale = await getRequestLocale(); const bengali = locale === 'bn';
  return <main className="site-container flex min-h-[60vh] items-center justify-center py-16"><section className="max-w-xl rounded-3xl border border-warm-card-border bg-white p-8 text-center shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-terracotta">{bengali ? 'শিক্ষা সম্পর্কিত তথ্য' : 'Academic information'}</p><h1 className="mt-3 text-3xl font-extrabold text-text-headline">{bengali ? 'বিদ্যালয়ের সঙ্গে যোগাযোগ করুন' : 'Please contact the school'}</h1><p className="mt-4 leading-7 text-text-muted">{bengali ? 'শ্রেণি, ভর্তি ও শিক্ষাসংক্রান্ত অতিরিক্ত তথ্যের জন্য বিদ্যালয় দপ্তরের সঙ্গে যোগাযোগ করুন।' : 'For additional information about classes, admissions, or academics, please contact the school office.'}</p><Link href={getLocalePath('/contact', locale)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-heritage-teal px-5 py-3 text-sm font-bold text-white"><span>{bengali ? 'যোগাযোগ করুন' : 'Contact the school'}</span><ArrowRight className="h-4 w-4" /></Link></section></main>;
}
