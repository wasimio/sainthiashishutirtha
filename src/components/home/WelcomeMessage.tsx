'use client';

import React from 'react';
import Image from 'next/image';
import { Quote, Heart, Award, Check } from 'lucide-react';

export default function WelcomeMessage() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="site-container">
        <div className="bg-[#EAF5F7] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#A5D1DC]/60 relative overflow-hidden shadow-xs">
          {/* Subtle watermark / background element */}
          <div className="absolute top-4 right-6 text-[#A5D1DC]/20 pointer-events-none select-none">
            <Quote className="w-48 h-48 -mr-10 -mt-10 rotate-12" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Principal / Educator Photo Column */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="Head of School / Founder Desk"
                  fill
                  sizes="(max-width: 768px) 250px, 300px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#243B43]">
                  Headmaster&apos;s Desk
                </h3>
                <p className="text-xs text-[#308599] font-semibold">
                  Sainthia Shishutirtha
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Foundational Educationist</span>
                </div>
              </div>
            </div>

            {/* Welcome Message Text */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC]">
                <Heart className="w-3.5 h-3.5 text-[#D92525]" />
                <span>Message from the School Desk</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">
                &ldquo;Every child is born with boundless wonder. Our sacred duty is to keep that wonder alive.&rdquo;
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  Dear Parents and Guardians, welcome to <strong>Sainthia Shishutirtha</strong>. Since our establishment in 2013, our singular vision has been to cultivate a warm, unhurried, and joyful environment where early education is not a race of rote-memory, but an exhilarating journey of discovery.
                </p>
                <p>
                  During the foundational years—from Kindergarten through Class IV—children form their emotional relationship with books, teachers, and their peers. Here in Sainthia, we blend disciplined foundational academic competence with warmth, music, mother tongue literacy, English fluency, and moral ethics.
                </p>
                <p className="text-slate-600 text-sm italic">
                  We look forward to partnering with you in shaping your child into a compassionate, confident, and inquisitive young thinker.
                </p>
              </div>

              <div className="pt-4 border-t border-[#A5D1DC]/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-[#243B43] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Child-Centric Focus
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Compassionate Guidance
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Parent-Teacher Harmony
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic font-bold text-[#308599] text-base">
                    Headmaster & Management Council
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sainthia Shishutirtha, Birbhum
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
