import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import {
  Clock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { CLASS_DETAILS, ACADEMIC_PROGRAMS } from '@/data/schoolData';

export function generateStaticParams() {
  return Object.keys(CLASS_DETAILS).map((slug) => ({
    classId: slug,
  }));
}

interface ClassPageProps {
  params: Promise<{ classId: string }>;
}

export default async function ClassDetailPage({ params }: ClassPageProps) {
  const { classId } = await params;
  const classData = CLASS_DETAILS[classId];

  if (!classData) {
    notFound();
  }

  const otherPrograms = ACADEMIC_PROGRAMS.filter((p) => p.slug !== classId);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar />

      <PageHeader
        badge={classData.gradeRange}
        title={classData.title}
        subtitle={classData.overview}
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: classData.title }
        ]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Key Metrics Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#EAF5F7] p-5 rounded-2xl border border-[#A5D1DC]/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Age Eligibility</span>
            <span className="text-sm font-bold text-[#243B43] mt-0.5 block">{classData.ageRequirement}</span>
          </div>
          <div className="bg-[#EAF5F7] p-5 rounded-2xl border border-[#A5D1DC]/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Class Timings</span>
            <span className="text-sm font-bold text-[#308599] mt-0.5 block">{classData.schoolHours}</span>
          </div>
          <div className="bg-[#EAF5F7] p-5 rounded-2xl border border-[#A5D1DC]/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Lead Educators</span>
            <span className="text-sm font-bold text-[#243B43] mt-0.5 block">{classData.classTeacher}</span>
          </div>
          <div className="bg-[#EAF5F7] p-5 rounded-2xl border border-[#A5D1DC]/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Section Capacity</span>
            <span className="text-sm font-bold text-[#243B43] mt-0.5 block">Max {classData.studentCapacity} Seats</span>
          </div>
        </section>

        {/* Learning Outcomes */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 space-y-5">
          <h2 className="text-xl font-bold text-[#243B43] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#308599]" />
            <span>Target Learning Outcomes & Milestones</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {classData.learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Two Columns: Daily Routine & Curriculum Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Daily Classroom Routine */}
          <section className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-[#243B43] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#308599]" />
                <span>Daily Routine & Timetable</span>
              </h2>
              <span className="text-xs text-slate-400">Regular Day</span>
            </div>

            <div className="space-y-3">
              {classData.dailyRoutine.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 text-xs">
                  <span className="font-mono font-bold text-[#308599] shrink-0 w-16">
                    {step.time}
                  </span>
                  <span className="text-slate-700">{step.activity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Subject & Weekly Allocation */}
          <section className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-[#243B43] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#308599]" />
                <span>Subject Syllabus & Weekly Allocation</span>
              </h2>
              <span className="text-xs text-slate-400">Continuous Assessment</span>
            </div>

            <div className="space-y-3">
              {classData.curriculumBreakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#243B43]">{item.subject}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#EAF5F7] text-[#308599] rounded-md">
                      {item.weeklyHours}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Booklist Highlights */}
        <section className="bg-[#EAF5F7] rounded-3xl p-6 sm:p-8 border border-[#A5D1DC] space-y-4">
          <h2 className="text-lg font-bold text-[#243B43] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#308599]" />
            <span>Prescribed Textbooks & Learning Kits</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            {classData.booklistHighlights.map((book, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-[#A5D1DC]/60">
                <BookOpen className="w-4 h-4 text-[#308599] shrink-0" />
                <span>{book}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Admissions CTA for this grade */}
        <section className="bg-[#243B43] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A5D1DC]">
              Session 2025–2026 Admissions
            </span>
            <h3 className="text-2xl font-black text-white">
              Enroll Your Child in {classData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Limited seats remaining for the upcoming academic session. Complete our online application to schedule a campus walk and meeting.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admissions"
              className="px-6 py-3.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Apply Online for {classData.gradeRange}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Explore Other Classes */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <h3 className="text-base font-bold text-[#243B43]">
            Explore Other Academic Wings:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherPrograms.map((prog) => (
              <Link
                key={prog.id}
                href={`/academics/${prog.slug}`}
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#308599] hover:bg-[#EAF5F7] transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#308599] block">{prog.gradeRange}</span>
                  <span className="text-sm font-bold text-[#243B43] group-hover:text-[#308599]">{prog.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#308599] transition-all" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
