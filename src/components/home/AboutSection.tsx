'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Compass,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'philosophy'>('mission');

  const tabContent = {
    mission: {
      title: "Our Mission",
      desc: "To provide every child in Sainthia and surrounding communities with an inspiring, safe, and academically robust foundational education (KG to Class IV). We instill lifelong love for books, critical numeracy, moral integrity, and social empathy in every student.",
      points: [
        "Eliminate fear and intimidation from early learning through affection and play",
        "Build dual-language confidence in English and mother tongue (Bengali/Hindi)",
        "Nurture curiosity through hands-on science models and daily questions",
        "Maintain accessible, transparent communication with parents at all times"
      ]
    },
    vision: {
      title: "Our Vision",
      desc: "To be the benchmark primary learning sanctuary in Birbhum district, recognized for holistic student well-being, creative brilliance, exemplary character, and seamless readiness for premier secondary schools.",
      points: [
        "A campus where every child's individual voice and talent are celebrated",
        "Integration of modern audio-visual teaching with traditional Indian values",
        "Strong foundation in reading comprehension and mental arithmetic",
        "Environmentally conscious and community-minded future citizens"
      ]
    },
    philosophy: {
      title: "Our Educational Philosophy",
      desc: "We adhere to the philosophy that early childhood learning is most effective when it connects head, heart, and hands. Abstract knowledge is grounded in tangible objects, outdoor play, rhythm, and interactive exploration.",
      points: [
        "Activity before abstraction: count real pebbles before writing numbers",
        "Phonetic sound exploration before rote spelling drills",
        "Moral stories that encourage kindness, truthfulness, and sharing",
        "Physical vitality through daily morning games, yoga, and gymnastics"
      ]
    }
  };

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#EAF5F7]/30 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC] shadow-xs">
            <Building className="w-3.5 h-3.5 text-[#308599]" />
            <span>About Sainthia Shishutirtha</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#243B43] tracking-tight">
            Rooted in Tradition, Prepared for Tomorrow
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Established in 2013 with Government Registration (S/2L/14754 OF 2013-14) and official U-DISE recognition (19082200103), Sainthia Shishutirtha was conceived as a model school for primary excellence in Birbhum.
          </p>
        </div>

        {/* Grid: Story & Milestone Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Tabs for Mission/Vision/Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab Buttons */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('mission')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'mission'
                    ? 'bg-[#308599] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#243B43]'
                }`}
              >
                Our Mission
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vision')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'vision'
                    ? 'bg-[#308599] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#243B43]'
                }`}
              >
                Our Vision
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('philosophy')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'philosophy'
                    ? 'bg-[#308599] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#243B43]'
                }`}
              >
                Philosophy
              </button>
            </div>

            {/* Tab Content Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A5D1DC]/80 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5F7] flex items-center justify-center text-[#308599]">
                  {activeTab === 'mission' && <Target className="w-5 h-5" />}
                  {activeTab === 'vision' && <Compass className="w-5 h-5" />}
                  {activeTab === 'philosophy' && <Sparkles className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-bold text-[#243B43]">
                  {tabContent[activeTab].title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {tabContent[activeTab].desc}
              </p>

              <div className="pt-2 space-y-2.5 border-t border-slate-100">
                {tabContent[activeTab].points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#243B43]">
                    <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* School History Milestone Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#308599] flex items-center justify-center shrink-0 font-bold text-xs">
                  2013
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#243B43]">Founded in Sainthia</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Established under Govt. Reg. S/2L/14754 to elevate early education in Birbhum.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  2026
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#243B43]">Modern Infrastructure</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Activity rooms, CCTV security, junior library, and child-safe play zones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: School Photography Collage & Quality Seal */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80"
                alt="Classroom learning environment at Sainthia Shishutirtha"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#243B43]/85 via-black/20 to-transparent" />

              {/* Bottom accreditation box */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A5D1DC]">
                    Official Accreditation
                  </span>
                </div>
                <div className="text-sm font-semibold">
                  U-DISE Code: <span className="font-mono text-white font-bold">{SCHOOL_INFO.udiseNo}</span>
                </div>
                <p className="text-xs text-slate-200 leading-normal">
                  Registered under West Bengal Societies Registration Act (S/2L/14754 OF 2013-14).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
