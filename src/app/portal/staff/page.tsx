'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookOpen,
  Clock,
  ArrowRight,
  Info,
  Users,
  PlusCircle
} from 'lucide-react';
import { STAFF_PROFILE, STAFF_HOMEWORK_LIST, STAFF_STUDENT_REMARKS } from '@/data/portalStaffData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function StaffDashboardPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Staff Portal
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Academic Session 2026–2027
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Welcome, {STAFF_PROFILE.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            {STAFF_PROFILE.designation} • {STAFF_PROFILE.department}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="dark"
            size="sm"
            asChild
            className="text-xs h-8 gap-1.5"
          >
            <Link href="/portal/staff/attendance">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Mark Morning Register</span>
            </Link>
          </Button>

          <Button
            variant="monochromeOutline"
            size="sm"
            asChild
            className="text-xs h-8 gap-1.5"
          >
            <Link href="/portal/staff/homework">
              <PlusCircle className="w-3.5 h-3.5 text-zinc-600" />
              <span>Assign Homework</span>
            </Link>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Demo Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 space-y-0.5">
          <span className="font-semibold text-zinc-950 block">Faculty Workspace Simulation</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Attendance markers, diary notes, and assessment forms in this portal demonstrate real classroom workflows for Sainthia Shishutirtha teachers.
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Assigned Mentorship</span>
              <div className="text-lg font-bold text-zinc-950 mt-0.5">Class II-A</div>
              <span className="text-[11px] text-zinc-500">32 Enrolled Scholars</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-zinc-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Today&apos;s Roll Status</span>
              <div className="text-lg font-bold text-zinc-950 mt-0.5">28 / 32 Present</div>
              <span className="text-[11px] text-emerald-700 font-medium">93.8% Section Rate</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-zinc-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Active Homework</span>
              <div className="text-lg font-bold text-zinc-950 mt-0.5">2 Assignments</div>
              <span className="text-[11px] text-zinc-500">Due Friday & Saturday</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-zinc-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Leave Entitlement</span>
              <div className="text-lg font-bold text-zinc-950 mt-0.5">6 Casual Leaves</div>
              <span className="text-[11px] text-zinc-500">8 Medical Days Available</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-zinc-900" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Today's Timetable + Homework & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Teaching Routine (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-zinc-950">
                    Today&apos;s Class Schedule & Periods
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Sainthia Shishutirtha Daily Bell Schedule
                  </CardDescription>
                </div>
                <Badge variant="zinc" className="text-[10px]">
                  Wednesday
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 divide-y divide-zinc-100">
              {STAFF_PROFILE.todaySchedule.map((sched, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs first:pt-0 last:pb-0">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-950">{sched.subject}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium">
                        {sched.grade}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span>{sched.time}</span>
                      <span>•</span>
                      <span>{sched.room}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400 shrink-0 font-semibold">
                    {sched.period}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Homework & Remarks (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  Active Homework Tasks
                </CardTitle>
                <Button variant="monochromeGhost" size="sm" asChild className="h-6 text-xs p-0 text-zinc-600">
                  <Link href="/portal/staff/homework" className="flex items-center gap-1">
                    <span>Manage</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-3">
              {STAFF_HOMEWORK_LIST.slice(0, 2).map((hw) => (
                <div key={hw.id} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900 truncate">{hw.title}</span>
                    <Badge variant="dark" className="text-[9px] px-1.5 py-0">{hw.grade}</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">{hw.instructions}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-200/50">
                    <span>Submissions: {hw.submissionsCount} / {hw.totalStudents}</span>
                    <span className="font-medium text-zinc-600">Due: {hw.dueDate}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  Recent Student Remarks
                </CardTitle>
                <Button variant="monochromeGhost" size="sm" asChild className="h-6 text-xs p-0 text-zinc-600">
                  <Link href="/portal/staff/remarks" className="flex items-center gap-1">
                    <span>All Notes</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5">
              {STAFF_STUDENT_REMARKS.slice(0, 2).map((rem) => (
                <div key={rem.id} className="p-2.5 rounded-lg border border-zinc-200/60 bg-white text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">{rem.studentName}</span>
                    <Badge variant="zinc" className="text-[9px] px-1 py-0">{rem.category}</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">{rem.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
