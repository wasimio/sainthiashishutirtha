import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Building
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';
import type { PublishedSchoolSettings } from '@/lib/cms/contentService';

interface AboutSectionProps {
  settings?: PublishedSchoolSettings | null;
}

export default function AboutSection({ settings }: AboutSectionProps = {}) {
  const schoolName = settings?.school_name || SCHOOL_INFO.name;
  const estdYear = settings?.estd_year || SCHOOL_INFO.estdYear;
  const locationText = `${settings?.city || 'Sainthia'}, ${settings?.district || 'Birbhum'}`;
  return (
    <section className="py-14 sm:py-18 bg-[#EAF5F7]/30 border-b border-slate-200">
      <div className="site-container space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: School Image Showcase */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[5/4]">
              <Image
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=75"
                alt="Classroom learning environment at Sainthia Shishutirtha"
                fill
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 550px"
                loading="lazy"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#243B43]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5D1DC]">
                  {locationText}
                </span>
                <p className="text-xs font-medium text-slate-200">
                  Serving the local community since {estdYear}.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Institutional Story */}
          <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC] shadow-2xs">
              <Building className="w-3.5 h-3.5 text-[#308599]" />
              <span>About {schoolName}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">
              A Supportive Place to Learn
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                Founded in {estdYear}, <strong>{schoolName}</strong> serves children from Lower Nursery to Class 5 in {locationText}.
              </p>
              <p>
                For current information about classes, learning activities, facilities, and admissions, please contact the school directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                <span>Programme details are shared directly by the school.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                <span>Contact the school for current campus and admission information.</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] bg-[#308599] hover:bg-[#266b7b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
              >
                <span>Read Full History & Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
