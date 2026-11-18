'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookOpen,
  Award,
  CreditCard,
  Heart,
  Info,
  ArrowRight
} from 'lucide-react';
import { useParent } from '@/components/portal/parent/ParentContext';
import { PARENT_HOMEWORK_ITEMS } from '@/data/portalParentData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ParentDashboardPage() {
  const { selectedChild, setSelectedChildId, siblings } = useParent();

  const childHomework = PARENT_HOMEWORK_ITEMS.filter((h) => h.childId === selectedChild.id);

  return (
    <div className="space-y-6">
      {/* Sibling Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-zinc-900" />
          <span className="text-xs font-semibold text-zinc-700">Enrolled Children:</span>
        </div>

        <div className="flex items-center gap-2">
          {siblings.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedChildId(child.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedChild.id === child.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                  selectedChild.id === child.id ? 'bg-white text-zinc-950' : 'bg-zinc-300 text-zinc-900'
                }`}
              >
                {child.avatarInitials}
              </div>
              <span>{child.name}</span>
              <span className={`text-[10px] font-normal ${selectedChild.id === child.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                ({child.grade})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Child Summary Hero Card */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-xs">
                {selectedChild.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
                    {selectedChild.name}
                  </h1>
                  <Badge variant="dark" className="text-[10px]">
                    {selectedChild.grade} - Section {selectedChild.section}
                  </Badge>
                </div>
                <div className="text-xs text-zinc-600 flex flex-wrap items-center gap-3">
                  <span>Scholar ID: <strong className="font-mono text-zinc-800">{selectedChild.scholarId}</strong></span>
                  <span>•</span>
                  <span>Roll No: <strong className="tabular-nums text-zinc-800">{selectedChild.rollNo}</strong></span>
                  <span>•</span>
                  <span>DOB: {selectedChild.dob}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-600 border-t md:border-t-0 md:border-l border-zinc-200 pt-3 md:pt-0 md:pl-6 space-y-1">
              <div>
                <span className="text-zinc-400">Class Mentor: </span>
                <strong className="text-zinc-900">{selectedChild.classTeacher}</strong>
              </div>
              <div className="text-[11px] text-zinc-500">
                {selectedChild.classTeacherContact}
              </div>
              <div className="text-[11px] text-zinc-500 pt-0.5">
                Transport: {selectedChild.busRoute}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 space-y-0.5">
          <span className="font-semibold text-zinc-950 block">Home-School Family Portal</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            All records displayed below belong to <strong>{selectedChild.name}</strong>. Switching the sibling pill at the top recalculates attendance, homework, report card marks, and fee invoices.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Campus Attendance</span>
              <div className="text-2xl font-bold text-zinc-950 mt-0.5 tabular-nums">
                {selectedChild.attendancePct}%
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">
                {selectedChild.presentDays} of {selectedChild.totalWorkingDays} Days Attended
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-zinc-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Active Homework</span>
              <div className="text-2xl font-bold text-zinc-950 mt-0.5 tabular-nums">
                {childHomework.length} Tasks
              </div>
              <span className="text-[11px] text-zinc-500">
                Next due tomorrow
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-zinc-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Term Evaluation</span>
              <div className="text-2xl font-bold text-zinc-950 mt-0.5">
                Grade A+
              </div>
              <span className="text-[11px] text-zinc-500">
                Term 1 Report Card Ready
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-zinc-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Fee Status</span>
              <div className="text-2xl font-bold text-zinc-950 mt-0.5">
                {selectedChild.feeStatus}
              </div>
              <span className="text-[11px] text-zinc-500">
                {selectedChild.pendingFeeAmount === 0 ? 'No outstanding balance' : `₹${selectedChild.pendingFeeAmount} pending`}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-zinc-900" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational 2-Column: Homework & Teacher's Observation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Homework Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  Current Homework & Assignments
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Tasks assigned by class mentor for {selectedChild.name}
                </CardDescription>
              </div>

              <Button variant="monochromeGhost" size="sm" asChild className="h-6 text-xs p-0 text-zinc-600">
                <Link href="/portal/parent/homework" className="flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              {childHomework.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  No pending homework tasks assigned for {selectedChild.name} today.
                </div>
              ) : (
                childHomework.map((hw) => (
                  <div key={hw.id} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-900">{hw.title}</span>
                      <Badge variant="zinc" className="text-[9px] px-1.5 py-0">{hw.subject}</Badge>
                    </div>
                    <p className="text-[11px] text-zinc-600 leading-relaxed">{hw.instructions}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-200/50">
                      <span>Teacher: {hw.teacherName}</span>
                      <span className="font-semibold text-zinc-700">Due: {hw.dueDate}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold text-zinc-950">
                Parent Quick Actions
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Frequently accessed student services
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5">
              <Link href="/portal/parent/report-cards" className="block p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-100/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-zinc-900" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">Download Term Report Card</div>
                      <div className="text-[11px] text-zinc-500">Evaluation marks and teacher remarks</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </Link>

              <Link href="/portal/parent/fees" className="block p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-100/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-zinc-900" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">Fee Invoices & Receipts</div>
                      <div className="text-[11px] text-zinc-500">View paid receipts and upcoming dues</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </Link>

              <Link href="/portal/parent/absence" className="block p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-100/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="w-4 h-4 text-zinc-900" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">Apply for Student Absence</div>
                      <div className="text-[11px] text-zinc-500">Submit sickness or leave slip to school</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
