'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

interface HeroSectionProps {
  onOpenAdmissionModal?: () => void;
}

export default function HeroSection({ onOpenAdmissionModal }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF5F7]/60 via-[#EAF5F7]/20 to-white py-12 lg:py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: School Messaging & Purposeful Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* School Trust & Identity Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#A5D1DC] shadow-2xs text-xs">
              <span className="flex items-center gap-1.5 font-bold text-[#308599]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Foundational Excellence Since {SCHOOL_INFO.estdYear}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Sainthia, Birbhum</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#243B43] tracking-tight leading-[1.18] font-sans">
                Where Young Minds{' '}
                <span className="text-[#308599]">
                  Blossom with Joy
                </span>
                , Curiosity & Values
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
                Sainthia Shishutirtha provides a safe, nurturing educational haven for children from <strong>Kindergarten through Class IV</strong>. Combining play-based discovery with disciplined foundational literacy and dual-language fluency.
              </p>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
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
                <span>Safe Monitored Campus</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>Spacious Green Play Area</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#243B43]">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                <span>Arts & Creative Expression</span>
              </div>
            </div>

            {/* Two Purposeful Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {onOpenAdmissionModal ? (
                <button
                  type="button"
                  onClick={onOpenAdmissionModal}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Explore Admissions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/admissions"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Explore Admissions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#EAF5F7] text-[#243B43] border border-slate-300 hover:border-[#308599] text-xs sm:text-sm font-bold rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#308599]" />
                <span>Discover Our School</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Photographic Presentation */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[4/3] lg:aspect-[5/4]">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80"
                alt="Interactive primary classroom learning environment"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5D1DC] block">
                  Foundational Primary Education
                </span>
                <p className="text-xs sm:text-sm font-medium leading-snug mt-0.5">
                  Nurturing curiosity, phonics, and friendship in an unhurried early childhood environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
