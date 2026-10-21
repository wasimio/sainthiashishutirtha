'use client';

import React from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {
  Users,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Layers,
  BellRing,
  Download,
  Calendar
} from 'lucide-react';
import { SAMPLE_ADMISSIONS, SCHOOL_INFO } from '@/data/schoolData';

export default function AdminDashboardPage() {
  const enrollmentBreakdown = [
    { grade: 'Pre-Primary / Nursery', students: 48, capacity: 50, color: 'bg-amber-500' },
    { grade: 'Kindergarten (KG)', students: 64, capacity: 65, color: 'bg-teal-500' },
    { grade: 'Class I', students: 62, capacity: 65, color: 'bg-sky-500' },
    { grade: 'Class II', students: 58, capacity: 60, color: 'bg-indigo-500' },
    { grade: 'Class III', students: 56, capacity: 60, color: 'bg-purple-500' },
    { grade: 'Class IV', students: 54, capacity: 60, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-[#243B43]">
      <DashboardHeader
        role="admin"
        title="School Administration Portal"
        subtitle="Sainthia Shishutirtha • Academic Session 2025–2026 (KG – Class IV)"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Prototype Alert Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900">
            <strong>Administrator Prototype Preview:</strong> This control panel illustrates administrative visibility over enrollment, daily attendance metrics, and admission pipelines for Sainthia Shishutirtha. Sample data displayed is purely illustrative.
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Enrolled Students */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Enrolled
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#243B43]">
                342
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Across KG – Class IV</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F7] text-[#308599] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Faculty & Staff */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Faculty & Care Staff
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#243B43]">
                22
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                18:1 Student-Teacher Ratio
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Today's Attendance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today&apos;s Attendance
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#15803d]">
                96.2%
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                329 / 342 Students Present
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: New Admissions Pipeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Admissions 2025–26
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#308599]">
                38
              </div>
              <div className="text-[11px] text-amber-600 font-bold">
                12 Pending Verification
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Grid: Enrollment Distribution & Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Grade-wise Capacity Bars */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#243B43]">
                  Grade-wise Enrolment Distribution
                </h2>
                <p className="text-xs text-slate-500">
                  Current intake capacity versus enrolled students
                </p>
              </div>
              <span className="text-xs font-bold text-[#308599] bg-[#EAF5F7] px-2.5 py-1 rounded-md">
                342 / 360 Seats (95%)
              </span>
            </div>

            <div className="space-y-4">
              {enrollmentBreakdown.map((item, idx) => {
                const percent = Math.round((item.students / item.capacity) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#243B43]">{item.grade}</span>
                      <span className="text-slate-500 font-mono">
                        {item.students} / {item.capacity} ({percent}%)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Class capacity capped at 30 students per section to preserve quality.</span>
              <button
                type="button"
                onClick={() => alert('Simulated action: Download Enrollment Audit Sheet')}
                className="text-[#308599] font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Right Column: Quick Management Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#243B43]">
                Administrative Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/admin/admissions"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#308599] hover:bg-[#EAF5F7] transition-all text-left flex flex-col justify-between space-y-2 group"
                >
                  <Layers className="w-5 h-5 text-[#308599]" />
                  <div>
                    <div className="text-xs font-bold text-[#243B43] group-hover:text-[#308599]">
                      Admissions Table
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Process applicant files
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => alert('Simulated Action: Publish a new notice or circular.')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#308599] hover:bg-[#EAF5F7] transition-all text-left flex flex-col justify-between space-y-2 group"
                >
                  <BellRing className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold text-[#243B43] group-hover:text-[#308599]">
                      Issue Circular
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Post notice to parents
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Simulated Action: Generate student identity cards or report cards.')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#308599] hover:bg-[#EAF5F7] transition-all text-left flex flex-col justify-between space-y-2 group"
                >
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-[#243B43] group-hover:text-[#308599]">
                      Student ID Cards
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Batch generate cards
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Simulated Action: Update staff roll or leave ledger.')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#308599] hover:bg-[#EAF5F7] transition-all text-left flex flex-col justify-between space-y-2 group"
                >
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-[#243B43] group-hover:text-[#308599]">
                      Staff Roster
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Daily duty assignments
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* School Profile Summary Card */}
            <div className="bg-[#243B43] text-white p-6 rounded-3xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A5D1DC]">
                  Institution Metadata
                </span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-amber-300">
                  U-DISE: {SCHOOL_INFO.udiseNo}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {SCHOOL_INFO.name}
              </h3>
              <p className="text-xs text-slate-300">
                {SCHOOL_INFO.affiliation} • {SCHOOL_INFO.address}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Admission Applications Quick Feed */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#243B43]">
                Recent Admission Enquiries (2025–26)
              </h2>
              <p className="text-xs text-slate-500">
                Review recent applications submitted by parents
              </p>
            </div>
            <Link
              href="/admin/admissions"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#308599] hover:underline"
            >
              <span>View All Applications in Table</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_ADMISSIONS.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-500">
                    {app.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Interview Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#243B43]">
                    {app.applicantName}
                  </h3>
                  <div className="text-xs text-[#308599] font-semibold">
                    Applying for {app.appliedClass}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Parent: {app.parentName} ({app.phone})
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Submitted: {app.submissionDate}</span>
                  <Link
                    href="/admin/admissions"
                    className="font-bold text-[#308599] hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
