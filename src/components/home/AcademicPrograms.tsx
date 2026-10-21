'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Clock,
  UserCheck,
  Check,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { ACADEMIC_PROGRAMS } from '@/data/schoolData';

interface AcademicProgramsProps {
  onOpenAdmissionModal?: (defaultGrade?: string) => void;
}

export default function AcademicPrograms({ onOpenAdmissionModal }: AcademicProgramsProps) {
  const [selectedId, setSelectedId] = useState<string>(ACADEMIC_PROGRAMS[0].id);

  const selectedProgram = ACADEMIC_PROGRAMS.find((p) => p.id === selectedId) || ACADEMIC_PROGRAMS[0];

  return (
    <section id="programs" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF5F7] rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC]">
            <GraduationCap className="w-3.5 h-3.5 text-[#308599]" />
            <span>Curriculum & Wings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#243B43] tracking-tight">
            Academic Programs from KG to Class IV
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our curriculum is age-calibrated to support the cognitive, motor, emotional, and social development of young children without examination stress.
          </p>
        </div>

        {/* Program Cards Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {ACADEMIC_PROGRAMS.map((program) => {
            const isSelected = program.id === selectedId;
            return (
              <div
                key={program.id}
                onClick={() => setSelectedId(program.id)}
                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative ${
                  isSelected
                    ? 'border-[#308599] bg-[#EAF5F7]/50 shadow-md ring-2 ring-[#308599]/20'
                    : 'border-slate-200 bg-white hover:border-[#A5D1DC] hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-[#308599] text-white p-1 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="space-y-3">
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${program.badgeColor}`}>
                    {program.gradeRange}
                  </span>

                  <h3 className="text-lg font-bold text-[#243B43]">
                    {program.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#308599]" />
                      <span>{program.ageGroup}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#308599]" />
                      <span>{program.timing}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Program Detailed Spotlight */}
        <div className="bg-[#EAF5F7] rounded-3xl p-6 sm:p-10 border border-[#A5D1DC] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-[#308599] text-white px-3 py-1 rounded-md">
                  {selectedProgram.gradeRange}
                </span>
                <span className="text-xs text-[#243B43] font-semibold bg-white px-3 py-1 rounded-md border border-[#A5D1DC]">
                  Age: {selectedProgram.ageGroup}
                </span>
                <span className="text-xs text-[#243B43] font-semibold bg-white px-3 py-1 rounded-md border border-[#A5D1DC]">
                  Timing: {selectedProgram.timing}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
                {selectedProgram.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {selectedProgram.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#308599]">
                  Pedagogical Highlights:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProgram.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#243B43]">
                      <Sparkles className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#308599]">
                  Key Subjects & Developmental Focus:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.keySubjects.map((subject, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium bg-white text-[#243B43] border border-[#A5D1DC] px-2.5 py-1 rounded-lg"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenAdmissionModal?.(selectedProgram.gradeRange)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  <span>Apply for {selectedProgram.gradeRange}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-slate-600 font-medium">
                  Limited seats reserved for academic year 2025–26
                </div>
              </div>
            </div>

            {/* Right: Graphic Box */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#243B43]">
                    What Makes Our Pedagogy Unique?
                  </h4>
                  <p className="text-xs text-slate-500">Continuous Formative Assessment</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  Instead of anxiety-inducing end-of-year examinations for little children, our educators conduct regular, gentle observational assessments.
                </p>
                <div className="p-3 rounded-xl bg-[#EAF5F7] border border-[#A5D1DC]/50 space-y-2">
                  <div className="font-bold text-[#243B43] text-xs">Assessment Dimensions:</div>
                  <ul className="space-y-1 text-slate-700">
                    <li>• Phonics listening & reading fluency</li>
                    <li>• Number logic & mental problem solving</li>
                    <li>• Social behavior, empathy & peer teamwork</li>
                    <li>• Creative dexterity in crafts, song & drawing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
