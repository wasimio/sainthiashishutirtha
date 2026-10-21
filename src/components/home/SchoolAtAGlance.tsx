'use client';

import React from 'react';
import { Calendar, GraduationCap, Users, Languages } from 'lucide-react';

export default function SchoolAtAGlance() {
  const stats = [
    {
      label: "Years of Educational Service",
      value: "12+ Years",
      subtext: "Established in 2013",
      icon: Calendar
    },
    {
      label: "Academic Scope",
      value: "KG to Class IV",
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

  return (
    <section className="bg-white border-y border-slate-100 py-10 sm:py-14">
      <div className="site-container">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
            Institutional Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">
            Sainthia Shishutirtha at a Glance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A trusted early-childhood learning center rooted in Birbhum district.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#EAF5F7]/40 rounded-2xl p-5 border border-[#A5D1DC]/40 text-center flex flex-col items-center justify-center space-y-2 hover:bg-[#EAF5F7] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-[#308599] flex items-center justify-center shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#243B43] tracking-tight font-sans">
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
