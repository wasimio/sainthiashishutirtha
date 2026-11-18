'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  FileCheck2
} from 'lucide-react';
import type { WebsiteSectionRow, PublishedSchoolSettings } from '@/lib/cms/contentService';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';

interface AdmissionEnquiryCTAProps {
  section?: WebsiteSectionRow | null;
  settings?: PublishedSchoolSettings | null;
  locale?: Locale;
}

export default function AdmissionEnquiryCTA({ section, settings, locale = DEFAULT_LOCALE }: AdmissionEnquiryCTAProps) {
  const dictionary = getUiDictionary(locale);

  const phone = settings?.admission_phone || settings?.official_phone || '9153336315 / 8926769992';
  const content = (section?.content_json as Record<string, unknown>) || {};
  const sectionTitle = section?.title || '';
  const sectionDesc = typeof content.description === 'string' ? content.description : section?.subtitle || '';
  const ctaButtonText = typeof content.button_text === 'string' ? content.button_text : dictionary.actions.admissionEnquiry;
  const fallbackSteps = [
    {
      step: "01",
      title: "Online Enquiry",
      desc: "Fill our simple digital form or collect a registration form at our school office in Sainthia."
    },
    {
      step: "02",
      title: "Campus Walkthrough",
      desc: "Visit our airy classrooms, green grounds, and interactive activity rooms with your little one."
    },
    {
      step: "03",
      title: "Friendly Interaction",
      desc: "A warm, informal chat with teachers and headmaster to understand your child's personality."
    },
    {
      step: "04",
      title: "Welcome & Kit",
      desc: "Complete documentation, receive syllabus, uniform instructions, and join our school family."
    }
  ];
  const admissionSteps = Array.isArray(content.steps)
    ? content.steps.flatMap((step, index) => {
        if (!step || typeof step !== 'object' || Array.isArray(step)) return [];
        const item = step as Record<string, unknown>;
        return [{ step: String(item.step || `${index + 1}`.padStart(2, '0')), title: String(item.title || ''), desc: String(item.description || item.desc || '') }];
      })
    : locale === 'en' ? fallbackSteps : [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-heritage-teal via-[#14383F] to-[#0C282D] py-16 text-white sm:py-24 lg:py-28">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#A5D1DC]/10 blur-2xl pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#A5D1DC] text-xs font-bold border border-white/15">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{typeof content.eyebrow === 'string' ? content.eyebrow : ''}</span>
          </div>

          <h2 className={`text-fluid-h1 font-bold tracking-tight text-white ${locale === 'bn' ? 'font-bengali-display' : 'font-display'}`}>
            {sectionTitle}
          </h2>

          <p className="text-fluid-body text-slate-200 leading-relaxed max-w-2xl mx-auto">
            {sectionDesc}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admissions"
              className="focus-ring inline-flex min-h-[50px] cursor-pointer items-center justify-center gap-2.5 rounded-full bg-terracotta px-8 py-3.5 text-sm font-extrabold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-terracotta-hover"
            >
              <span>{ctaButtonText}</span>
              <ArrowRight className="w-4 h-4 text-[#245E6D]" />
            </Link>
          </div>
        </div>

        {/* 4 Steps Journey */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {admissionSteps.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 sm:p-6 border border-white/15 relative space-y-3"
            >
              <div className="text-2xl font-black text-[#A5D1DC]/70 font-mono">
                {item.step}
              </div>
              <h3 className="text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Supporting Note */}
        <div className="mt-10 sm:mt-12 text-center text-xs text-slate-300 flex flex-wrap items-center justify-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{typeof content.supporting_note === 'string' ? content.supporting_note : dictionary.navigation.helpline}: <strong>{phone}</strong></span>
        </div>
      </div>
    </section>
  );
}
