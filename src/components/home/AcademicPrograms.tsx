'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ACADEMIC_PROGRAMS } from '@/data/schoolData';

interface AcademicProgramsProps {
  onOpenAdmissionModal?: (defaultGrade?: string) => void;
}

export default function AcademicPrograms({ onOpenAdmissionModal }: AcademicProgramsProps) {
  return (
    <section className="py-14 sm:py-18 bg-white border-b border-slate-200">
      <div className="site-container space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
            Academic Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">
            Academic Wings: Kindergarten through Class IV
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A continuous, age-calibrated learning pathway focused on foundational literacy, arithmetic logic, and creative confidence.
          </p>
        </div>

        {/* 3 Wings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ACADEMIC_PROGRAMS.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-[#308599] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${prog.badgeColor}`}>
                    {prog.gradeRange}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Age {prog.ageGroup}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#243B43] group-hover:text-[#308599] transition-colors">
                  {prog.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-[#308599]" />
                  <span>Timings: {prog.timing}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prog.description}
                </p>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Focus:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prog.keySubjects.slice(0, 3).map((subj, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/academics/${prog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#308599] hover:underline"
                >
                  <span>Class Details & Routine</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => onOpenAdmissionModal?.(prog.gradeRange)}
                  className="text-xs font-semibold text-slate-500 hover:text-[#243B43]"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/academics"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#243B43] border border-slate-300 hover:border-[#308599] rounded-xl text-xs font-bold transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#308599]" />
            <span>Explore Full Curriculum & Methodology</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
