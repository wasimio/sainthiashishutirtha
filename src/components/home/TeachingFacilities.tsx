'use client';

import React from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { SCHOOL_FACILITIES } from '@/data/schoolData';

export default function TeachingFacilities() {
  return (
    <section id="facilities" className="py-16 sm:py-24 bg-[#EAF5F7]/30 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC] shadow-xs">
            <LayoutGrid className="w-3.5 h-3.5 text-[#308599]" />
            <span>Campus Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#243B43] tracking-tight">
            Designed for Child Well-Being & Exploration
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our campus at Sainthia is thoughtfully constructed around safety, hygiene, open spaces, and age-appropriate learning resources.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SCHOOL_FACILITIES.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#243B43]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {facility.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#243B43] group-hover:text-[#308599] transition-colors">
                    {facility.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {facility.features.map((feat, idx) => (
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

        {/* Safety & Hygiene Guarantee Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#A5D1DC] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF5F7] flex items-center justify-center shrink-0 text-[#308599]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#243B43]">
                Zero-Compromise Child Safety Standards
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Full-time CCTV coverage, secure single-gate dismissal, female support staff, and verified ID pick-up cards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-[#308599] bg-[#EAF5F7] px-3 py-1.5 rounded-lg border border-[#A5D1DC]">
              Verified Visitor Log
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              RO Purified Drinking Water
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
