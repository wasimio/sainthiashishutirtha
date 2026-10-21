'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import AdmissionModal from '@/components/modals/AdmissionModal';
import {
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Award
} from 'lucide-react';
import { ACADEMIC_PROGRAMS } from '@/data/schoolData';

export default function AcademicsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGrade, setModalGrade] = useState<string | undefined>();

  const openEnquiry = (grade?: string) => {
    setModalGrade(grade);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => openEnquiry()} />

      <PageHeader
        badge="Foundational & Primary Wings"
        title="Academic Programmes & Pedagogy"
        subtitle="Explore our age-calibrated curriculum from Kindergarten through Class IV, fostering foundational literacy, mental arithmetic, and joyful learning."
        breadcrumbs={[{ label: 'Academics' }]}
      />

      <main className="flex-1 site-container py-12 space-y-16">
        {/* Academic Divisions Overview */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Curriculum Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
              Three Developmentally Focused Wings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Select any academic division to review full subject lists, classroom daily routines, and booklist highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ACADEMIC_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 hover:border-[#308599] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${prog.badgeColor}`}>
                      {prog.gradeRange}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Age: {prog.ageGroup}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#243B43] group-hover:text-[#308599] transition-colors">
                    {prog.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#308599]" />
                    <span>School Hours: <strong>{prog.timing}</strong></span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Pillars:
                    </span>
                    {prog.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#243B43]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#308599] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <Link
                    href={`/academics/${prog.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#EAF5F7] text-[#308599] hover:bg-[#308599] hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>View Class Details & Routine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => openEnquiry(prog.gradeRange)}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Enquire for this Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pedagogical Philosophy */}
        <section className="bg-[#EAF5F7] rounded-3xl p-8 sm:p-12 border border-[#A5D1DC] space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Teaching Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
              Foundational Literacy and Numeracy (FLN)
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              We align our classroom pedagogy with National and State Early Childhood Education guidelines. Research demonstrates that children who achieve reading fluency and basic number sense before Class III develop superior analytical confidence in higher education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#308599] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#243B43]">Bilingual Phonics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Children master English letter-sound associations, sight-word vocabularies, and Bengali script effortlessly through rhyming songs and stories.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#243B43]">Concrete before Abstract</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Math is taught using abacus beads, geometric blocks, and clock dials before abstract equations appear on paper, eliminating math apprehension.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#243B43]">Stress-Free Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continuous formative observations replace intimidating end-of-year exams. Teachers document reading milestones, handwriting, and social warmth.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenAdmissionModal={() => openEnquiry()} />

      <QuickActionRail onOpenAdmissionModal={() => openEnquiry()} />

      <AdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultGrade={modalGrade}
      />
    </div>
  );
}
