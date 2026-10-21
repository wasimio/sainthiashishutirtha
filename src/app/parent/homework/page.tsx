'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {
  CheckCircle2,
  Clock,
  Download,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { SAMPLE_HOMEWORK } from '@/data/schoolData';

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = useState(SAMPLE_HOMEWORK);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [diaryNote, setDiaryNote] = useState('');
  const [noteSubmitted, setNoteSubmitted] = useState(false);

  const subjects = ['All', 'English Literature', 'Mathematics', 'Environmental Studies (EVS)', 'Bengali (First Language)'];

  const filteredHomework = homeworkList.filter((hw) => {
    const matchSubj = selectedSubject === 'All' || hw.subject === selectedSubject;
    const matchStatus = statusFilter === 'All' || hw.status === statusFilter;
    return matchSubj && matchStatus;
  });

  const toggleStatus = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((hw) => {
        if (hw.id === id) {
          const nextStatus = hw.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...hw, status: nextStatus };
        }
        return hw;
      })
    );
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryNote.trim()) return;
    setNoteSubmitted(true);
    setDiaryNote('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#243B43]">
      <DashboardHeader
        role="parent"
        title="Daily Homework & Syllabus Tasks"
        subtitle="Aarav Sen • Class II-B • Roll No. 14"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/parent" className="hover:text-[#308599] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Parent Dashboard</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#243B43]">Homework & Assignments</span>
        </div>

        {/* Top Summary Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#243B43]">
              Active Homework Ledger
            </h2>
            <p className="text-xs text-slate-600">
              Reinforcement activities assigned by subject teachers. Parents can track submissions and review practice sheets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending</span>
              <span className="text-xl font-black text-amber-900">
                {homeworkList.filter((h) => h.status === 'Pending').length}
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Completed</span>
              <span className="text-xl font-black text-emerald-900">
                {homeworkList.filter((h) => h.status === 'Completed').length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Subject Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {subjects.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSubject === subj
                    ? 'bg-[#308599] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
                }`}
              >
                {subj === 'All' ? 'All Subjects' : subj.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            {['All', 'Pending', 'Completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-[#243B43] text-white'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Homework Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHomework.map((hw) => {
            const isDone = hw.status === 'Completed';
            return (
              <div
                key={hw.id}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-white hover:border-[#308599] shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#EAF5F7] text-[#308599] border border-[#A5D1DC]">
                      {hw.subject}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleStatus(hw.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="Click to toggle status"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600' : 'text-amber-600'}`} />
                      <span>{isDone ? 'Completed' : 'Mark as Done'}</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#243B43]">
                      {hw.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Teacher: <strong>{hw.teacher}</strong></span>
                      <span>•</span>
                      <span className="font-semibold text-rose-700">Due: {hw.dueDate}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <strong className="block text-slate-900 mb-1">Teacher&apos;s Instructions:</strong>
                    {hw.instructions}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Assigned: {hw.dateAssigned}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Simulated Download: ${hw.attachmentName}`)}
                    className="inline-flex items-center gap-1.5 text-[#308599] font-bold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{hw.attachmentName}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Digital School Diary Note Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5F7] text-[#308599] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#243B43]">
                Communication Diary to Class Teacher
              </h3>
              <p className="text-xs text-slate-500">
                Send a quick note or clarification regarding today&apos;s homework or student wellbeing
              </p>
            </div>
          </div>

          {noteSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
              <span>Your message has been recorded in the digital diary for Mrs. S. Ganguly.</span>
              <button
                type="button"
                onClick={() => setNoteSubmitted(false)}
                className="text-[#308599] underline ml-2"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendNote} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="e.g. Respected Teacher, Aarav has completed sums 1-8. For sum 9, he had a slight doubt which I have guided him through..."
                value={diaryNote}
                onChange={(e) => setDiaryNote(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Submit Diary Entry
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
