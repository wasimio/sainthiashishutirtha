'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { SCHOOL_FACILITIES } from '@/data/schoolData';

export default function TeachingFacilities() {
  const previewFacilities = SCHOOL_FACILITIES.slice(0, 4);

  return (
    <section className="py-14 sm:py-18 bg-[#EAF5F7]/30 border-b border-slate-200">
      <div className="site-container space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
            Campus Environment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">
            Designed for Child Well-Being & Exploration
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A safe, hygienic, and bright campus environment where children explore, play, and learn freely.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {previewFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3.5 left-3.5 bg-[#243B43]/85 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {facility.category}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-[#243B43] group-hover:text-[#308599] transition-colors">
                  {facility.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {facility.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {facility.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#308599] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="text-center pt-2">
          <Link
            href="/facilities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#308599] hover:bg-[#266b7b] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>View All Campus Facilities & Safety Standards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
