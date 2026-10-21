'use client';

import React from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { SAMPLE_ATTENDANCE_MONTH, NOTICES_AND_EVENTS } from '@/data/schoolData';

export default function ParentDashboardPage() {
  const timetableToday = [
    { period: 'Period 1', time: '8:00 – 8:45 AM', subject: 'English Phonics & Reading', teacher: 'Mrs. S. Ganguly' },
    { period: 'Period 2', time: '8:45 – 9:30 AM', subject: 'Mental Arithmetic & Tables', teacher: 'Mr. T. Roy' },
    { period: 'Period 3', time: '9:30 – 10:15 AM', subject: 'Bengali (সহজ পাঠ)', teacher: 'Mrs. M. Mukherjee' },
    { period: 'Break', time: '10:15 – 10:45 AM', subject: 'Tiffin & Supervised Playground Play', teacher: 'Support Staff' },
    { period: 'Period 4', time: '10:45 – 11:30 AM', subject: 'Environmental Studies (EVS)', teacher: 'Mrs. A. Sen' },
    { period: 'Period 5', time: '11:30 – 12:15 PM', subject: 'Drawing & Origami Workshop', teacher: 'Mr. B. Pal' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-[#243B43]">
      <DashboardHeader
        role="parent"
        title="Parent & Student Portal"
        subtitle="Sainthia Shishutirtha • Continuous Home-School Communication"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Prototype Alert Notice */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950">
            <strong>Parent Portal Prototype Preview:</strong> This screen previews the student profile, daily schedule, teacher notes, homework tracker, and attendance records available to enrolled families. Demonstrating sample data for fictional student <strong>Aarav Sen (Class II-B)</strong>.
          </div>
        </div>

        {/* Student Profile Identity Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#EAF5F7] border-2 border-[#308599] flex items-center justify-center text-3xl font-black text-[#308599] shadow-xs">
                AS
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-[#243B43]">
                    Aarav Sen
                  </h2>
                  <span className="bg-[#308599] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    Class II - Section B
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Roll No: <strong className="text-slate-800">14</strong> • Scholar ID: <strong className="text-slate-800">ST-2023-142</strong> • House: <span className="text-[#308599] font-bold">Tagore House (Blue)</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                  <span>Class Teacher: <strong>Mrs. S. Ganguly</strong></span>
                  <span>•</span>
                  <span>Blood Group: <strong>B+</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Performance & Attendance Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Attendance</span>
                <span className="text-xl font-black text-emerald-900">{SAMPLE_ATTENDANCE_MONTH.percentage}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">20/21 Days Present</span>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-[#308599] block">Evaluation</span>
                <span className="text-xl font-black text-[#243B43]">A+ Grade</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Term 2 Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Homework */}
          <Link
            href="/parent/homework"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#308599] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#243B43] group-hover:text-[#308599]">
                Homework & Tasks
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                2 active assignments due this week (English Phonics & EVS Nature Scrapbook).
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#308599]">
              <span>View Homework Details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Attendance */}
          <Link
            href="/parent/attendance"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#308599] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#243B43] group-hover:text-[#308599]">
                Attendance Ledger
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                October 2026: 95.2% presence. Verified on time arrival every morning at 7:55 AM.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#308599]">
              <span>Check Monthly Calendar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Fee Status */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#308599] flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#243B43]">
                Tuition & Activity Fees
              </h3>
              <div className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold inline-block border border-emerald-200">
                Quarter 3: Fully Cleared
              </div>
              <p className="text-xs text-slate-500">
                Next billing due date: <strong>10 January 2027</strong>.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <button
                type="button"
                onClick={() => alert('Simulated Action: Downloading fee receipt PDF')}
                className="text-[#308599] font-bold hover:underline"
              >
                Download Receipt PDF
              </button>
            </div>
          </div>
        </div>

        {/* Timetable & Class Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Today's Class Timetable */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#243B43]">
                  Today&apos;s Classroom Routine
                </h3>
                <p className="text-xs text-slate-500">Class II-B Daily Timetable</p>
              </div>
              <span className="text-xs font-semibold bg-[#EAF5F7] text-[#308599] px-2.5 py-1 rounded-md">
                5 Academic Periods
              </span>
            </div>

            <div className="space-y-3">
              {timetableToday.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-400 w-16 shrink-0">
                      {item.period}
                    </span>
                    <div>
                      <div className="font-bold text-[#243B43]">{item.subject}</div>
                      <div className="text-[11px] text-slate-500">{item.teacher}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-slate-500 text-[11px] shrink-0">
                    <Clock className="w-3 h-3 text-[#308599]" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Teacher Remark & Upcoming Events */}
          <div className="lg:col-span-5 space-y-6">
            {/* Teacher's Diary Remark */}
            <div className="bg-[#EAF5F7] p-6 rounded-3xl border border-[#A5D1DC] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#308599]">
                <MessageSquare className="w-4 h-4" />
                <span>Class Teacher&apos;s Remark</span>
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                &ldquo;Aarav showed wonderful curiosity during mental arithmetic today and volunteered to solve addition problems on the smart board. Please encourage his cursive reading habits at home.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#A5D1DC]/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Mrs. S. Ganguly (Class Teacher)</span>
                <span>21 Oct 2026</span>
              </div>
            </div>

            {/* School Circulars Feed */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#243B43]">
                Latest Circular for Parents
              </h3>
              <div className="space-y-2 text-xs">
                {NOTICES_AND_EVENTS.slice(1, 3).map((notice) => (
                  <div key={notice.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-[#308599]">{notice.category}</span>
                      <span>{notice.date}</span>
                    </div>
                    <h4 className="font-bold text-[#243B43]">{notice.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
