'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Info
} from 'lucide-react';
import { SAMPLE_ATTENDANCE_MONTH } from '@/data/schoolData';

export default function AttendancePage() {
  const [leaveForm, setLeaveForm] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    parentRemark: ''
  });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.fromDate || !leaveForm.reason) return;
    setLeaveSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#243B43]">
      <DashboardHeader
        role="parent"
        title="Student Attendance Record"
        subtitle="Aarav Sen • Class II-B • Academic Session 2025–2026"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/parent" className="hover:text-[#308599] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Parent Dashboard</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#243B43]">Attendance Ledger</span>
        </div>

        {/* Top Summary Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
                Monthly Overview • {SAMPLE_ATTENDANCE_MONTH.month}
              </span>
              <h2 className="text-2xl font-black text-[#243B43] mt-1">
                {SAMPLE_ATTENDANCE_MONTH.percentage} Overall Presence
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Consistent attendance supports your child&apos;s emotional bonding and steady foundational mastery.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Present</span>
                <span className="text-xl font-black text-emerald-900">{SAMPLE_ATTENDANCE_MONTH.presentDays} Days</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Absent</span>
                <span className="text-xl font-black text-rose-900">{SAMPLE_ATTENDANCE_MONTH.absentDays} Day</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">Late Arrival</span>
                <span className="text-xl font-black text-blue-900">0 Days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Daily Attendance Table / Calendar */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#243B43]">
                Daily Attendance Roll ({SAMPLE_ATTENDANCE_MONTH.month})
              </h3>
              <span className="text-xs font-medium text-slate-500">
                School timings: 8:00 AM – 1:00 PM
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {SAMPLE_ATTENDANCE_MONTH.records.map((rec, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-700 w-16">
                      {rec.date}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {rec.remark}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                      rec.status === 'Present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'Holiday'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rec.status === 'Present' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {rec.status === 'Absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                    <span>{rec.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Apply for Leave Form & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            {/* Submit Leave Application */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#243B43]">
                Submit Student Leave Notice
              </h3>
              <p className="text-xs text-slate-500">
                Inform the class teacher and administration ahead of planned absences or sickness.
              </p>

              {leaveSubmitted ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-xs text-emerald-950">
                    Leave Request Submitted!
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    The notice from <strong>{leaveForm.fromDate || 'Tomorrow'}</strong> has been routed to Mrs. S. Ganguly (Class Teacher) and recorded in the attendance portal.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLeaveSubmitted(false);
                      setLeaveForm({ fromDate: '', toDate: '', reason: '', parentRemark: '' });
                    }}
                    className="text-xs font-bold text-[#308599] underline pt-2"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">From Date *</label>
                      <input
                        type="date"
                        required
                        value={leaveForm.fromDate}
                        onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-[#308599]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">To Date</label>
                      <input
                        type="date"
                        value={leaveForm.toDate}
                        onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-[#308599]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Reason for Absence *</label>
                    <select
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-[#308599] bg-white"
                    >
                      <option value="">Select reason...</option>
                      <option value="Seasonal Cold / Medical">Seasonal Cold / Fever / Medical</option>
                      <option value="Family Function">Family Ceremony / Travel</option>
                      <option value="Doctor Appointment">Scheduled Doctor / Dental Visit</option>
                      <option value="Other">Other Personal Reasons</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Parent Note (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Doctor's advice or specific note to class teacher..."
                      value={leaveForm.parentRemark}
                      onChange={(e) => setLeaveForm({ ...leaveForm, parentRemark: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-[#308599]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#308599] hover:bg-[#266b7b] text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Send Leave Application
                  </button>
                </form>
              )}
            </div>

            {/* Attendance Guidelines Card */}
            <div className="bg-[#EAF5F7] p-6 rounded-3xl border border-[#A5D1DC] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#308599]">
                <Info className="w-4 h-4" />
                <span>School Attendance Policy</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li>• Morning assembly bell rings strictly at <strong>8:00 AM</strong>.</li>
                <li>• Minimum <strong>85% attendance</strong> is mandatory for end-of-term promotion.</li>
                <li>• Absence for more than 2 consecutive days requires a medical certificate.</li>
                <li>• Early departure requires signed gate pass from the Headmaster&apos;s office.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
