'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

interface HeroSectionProps {
  onOpenAdmissionModal?: () => void;
}

export default function HeroSection({ onOpenAdmissionModal }: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#EAF5F7] via-white to-white py-12 lg:py-20">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#A5D1DC]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#308599]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A5D1DC] shadow-xs text-xs">
              <span className="flex items-center gap-1.5 font-bold text-[#308599]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Govt. Regd. S/2L/14754 OF 2013-14
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#243B43] font-medium">U-DISE: {SCHOOL_INFO.udiseNo}</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">Estd. 2013</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#243B43] tracking-tight leading-[1.15]">
                Where Young Minds{' '}
                <span className="text-[#308599] underline decoration-[#A5D1DC] decoration-wavy decoration-2 underline-offset-4">
                  Blossom with Joy
                </span>
                , Curiosity & Values
              </h1>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-2xl">
                Sainthia Shishutirtha provides a loving, activity-driven educational haven from <strong>Kindergarten (KG) through Class IV</strong>. Here, every child is cherished, guided with gentle discipline, and inspired to fall in love with learning.
              </p>
            </div>

            {/* Key Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>Play-Based Learning</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>18:1 Small Class Ratio</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>Bilingual Fluency</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>CCTV Monitored Safety</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>Green Play Area</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>Arts & Storytelling</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onOpenAdmissionModal}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#308599] hover:bg-[#266b7b] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Apply for Admission 2025–26</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/academics"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#EAF5F7] text-[#243B43] border-2 border-[#A5D1DC] text-sm font-bold rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#308599]" />
                <span>Explore Classes (KG – IV)</span>
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#308599]">12+</div>
                <div className="text-xs text-slate-500 font-medium">Years of Trust (Estd. 2013)</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#243B43]">18 : 1</div>
                <div className="text-xs text-slate-500 font-medium">Student : Teacher Ratio</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#15803d]">KG – IV</div>
                <div className="text-xs text-slate-500 font-medium">Foundational Wing</div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Photography & Floating Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[4/3] sm:aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80"
                  alt="Young students in interactive classroom at Shishutirtha"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Joyful Early Learning
                  </div>
                  <p className="text-sm font-medium leading-snug">
                    Hands-on activity, sensory play, and foundational literacy at Sainthia Shishutirtha.
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Official Crest Seal */}
              <div className="absolute -top-5 -left-4 sm:-left-6 bg-white p-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 relative rounded-full overflow-hidden border border-emerald-500/20 bg-slate-50 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Official School Crest"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <div>
                  <div className="text-xs font-black text-[#243B43] uppercase tracking-tight">
                    Shishutirtha
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Govt. Registered
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Admission Open Tag */}
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-[#308599] text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-[240px]">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-extrabold text-amber-200">
                    Session 2025–26
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Admissions Now Open for KG – Class IV
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
