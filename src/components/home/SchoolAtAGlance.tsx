import React from 'react';
import { cacheLife } from 'next/cache';
import { Calendar, GraduationCap, Users, Languages } from 'lucide-react';
import type { WebsiteSectionRow, PublishedSchoolSettings } from '@/lib/cms/contentService';
import { SCHOOL_INFO } from '@/data/schoolData';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';

interface SchoolAtAGlanceProps {
  section?: WebsiteSectionRow | null;
  settings?: PublishedSchoolSettings | null;
  locale?: Locale;
}

async function getCurrentYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

export default async function SchoolAtAGlance({ section, settings, locale = DEFAULT_LOCALE }: SchoolAtAGlanceProps) {
  const estdYear = settings?.estd_year || SCHOOL_INFO.estdYear;
  const classesOffered = settings?.classes_offered || SCHOOL_INFO.classesOffered;
  const parsedEstd = parseInt(estdYear, 10);

  const fallbackYear = isNaN(parsedEstd) ? 2013 : parsedEstd;
  const yearsOfService = `${(await getCurrentYear()) - fallbackYear}+ Years`;

  const fallbackStats = [
    {
      label: "Years of Educational Service",
      value: yearsOfService,
      subtext: `Established in ${estdYear}`,
      icon: Calendar
    },
    {
      label: "Academic Scope",
      value: classesOffered,
      subtext: "Foundational & Primary Wings",
      icon: GraduationCap
    },
    {
      label: "Student-Teacher Ratio",
      value: "18 : 1",
      subtext: "Individualized Attention",
      icon: Users
    },
    {
      label: "Bilingual Foundation",
      value: "Dual Literacy",
      subtext: "English & Mother Tongue",
      icon: Languages
    }
  ];
  const content = section?.content_json && typeof section.content_json === 'object' && !Array.isArray(section.content_json)
    ? section.content_json as Record<string, unknown>
    : {};
  const configuredStats = Array.isArray(content.stats) ? content.stats : [];
  const stats = configuredStats.length
    ? configuredStats.flatMap((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
        const record = item as Record<string, unknown>;
        return [{
          label: String(record.label || ''), value: String(record.value || ''), subtext: String(record.subtext || ''),
          icon: [Calendar, GraduationCap, Users, Languages][index % 4],
        }];
      })
    : locale === 'en' ? fallbackStats : [];

  const title = section?.title || (locale === 'en' ? 'Sainthia Shishutirtha at a Glance' : '');
  const subtitle = section?.subtitle || (locale === 'en' ? 'A trusted early-childhood learning center rooted in Birbhum district.' : '');

  return (
    <section className="border-y border-warm-card-border bg-white py-14 sm:py-20">
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            {typeof content.eyebrow === 'string' ? content.eyebrow : ''}
          </span>
          <h2 className={`text-fluid-h2 font-bold tracking-tight text-text-headline ${locale === 'bn' ? 'font-bengali-display' : 'font-display'}`}>
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center space-y-2 rounded-[1.75rem] border border-warm-card-border bg-warm-ivory p-5 text-center shadow-[0_12px_35px_rgba(20,56,63,0.05)] transition hover:-translate-y-1 hover:bg-heritage-teal-subtle sm:p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-[#245E6D] flex items-center justify-center shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#1B2E35] tracking-tight font-sans">
                  {stat.value}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700">{stat.label}</div>
                  <div className="text-[11px] text-slate-500">{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
