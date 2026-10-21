'use client';

import React from 'react';
import {
  HeartHandshake,
  Users,
  Languages,
  ShieldCheck,
  Smile,
  CalendarCheck,
  Star,
  CheckCircle2
} from 'lucide-react';
import { WHY_CHOOSE_US, TESTIMONIALS } from '@/data/schoolData';

export default function WhyChooseUs() {
  const iconMap: Record<string, React.ReactNode> = {
    HeartHandshake: <HeartHandshake className="w-6 h-6 text-[#308599]" />,
    Users: <Users className="w-6 h-6 text-[#308599]" />,
    Languages: <Languages className="w-6 h-6 text-[#308599]" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#308599]" />,
    Smile: <Smile className="w-6 h-6 text-[#308599]" />,
    CalendarCheck: <CalendarCheck className="w-6 h-6 text-[#308599]" />,
  };

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF5F7] rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC]">
            <HeartHandshake className="w-3.5 h-3.5 text-[#308599]" />
            <span>Why Shishutirtha</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#243B43] tracking-tight">
            Why Discerning Parents Trust Sainthia Shishutirtha
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Finding the right school for the formative years (Ages 3 to 10) sets the blueprint for your child&apos;s emotional health, self-esteem, and intellectual thirst.
          </p>
        </div>

        {/* 6 Key Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {WHY_CHOOSE_US.map((item, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-3xl bg-[#EAF5F7]/40 border border-[#A5D1DC]/70 hover:border-[#308599] hover:bg-[#EAF5F7] transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {iconMap[item.icon] || <CheckCircle2 className="w-6 h-6 text-[#308599]" />}
              </div>
              <h3 className="text-lg font-bold text-[#243B43] mb-2 group-hover:text-[#308599] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Parent Testimonials Section */}
        <div className="bg-[#243B43] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A5D1DC]">
                  Voices of Confidence
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  What Parents Say About Us
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-white/10 px-3.5 py-1.5 rounded-full text-xs text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">4.9 / 5</span>
                <span className="text-slate-300 ml-1">Parent Trust Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/15 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="font-bold text-xs text-white">
                      {t.parentName}
                    </div>
                    <div className="text-[11px] text-[#A5D1DC]">
                      {t.childInfo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
