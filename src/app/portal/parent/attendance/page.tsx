'use client';

import React from 'react';
import Link from 'next/link';
import {
  Info,
  ArrowRight
} from 'lucide-react';
import { useParent } from '@/components/portal/parent/ParentContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ParentAttendancePage() {
  const { selectedChild } = useParent();

  const daysInOctober = Array.from({ length: 22 }, (_, i) => {
    const day = i + 1;
    // Simulate weekend
    const isSunday = day % 7 === 4;
    // Simulate occasional absence
    const isAbsent = day === 9;
    const isLeave = day === 12;

    let status = 'present';
    if (isSunday) status = 'weekend';
    else if (isAbsent) status = 'absent';
    else if (isLeave) status = 'leave';

    return { day, status };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              {selectedChild.name}
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              {selectedChild.grade} - Section {selectedChild.section}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Attendance History & Campus Record
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Verified classroom attendance roll, excused leave ledger, and monthly percentage tracker.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          asChild
          className="text-xs h-8 gap-1.5"
        >
          <Link href="/portal/parent/absence">
            <span>Submit Absence Slip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>

      {/* Demo Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 space-y-0.5">
          <span className="font-semibold text-zinc-950 block">Statutory 75% Attendance Requirement</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            West Bengal Primary Education Council guidelines require minimum 75% annual physical attendance for term promotion. {selectedChild.name}&apos;s current standing is <strong>{selectedChild.attendancePct}%</strong>.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Cumulative Rate</span>
            <div className="text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{selectedChild.attendancePct}%</div>
            <span className="text-[11px] text-emerald-700 font-medium">Exceeds Requirement</span>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Days Attended</span>
            <div className="text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{selectedChild.presentDays}</div>
            <span className="text-[11px] text-zinc-500">Out of {selectedChild.totalWorkingDays} working days</span>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Sanctioned Leaves</span>
            <div className="text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{selectedChild.excusedLeaves} Days</div>
            <span className="text-[11px] text-zinc-500">Approved by Class Teacher</span>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Unexcused Absence</span>
            <div className="text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{selectedChild.unexcusedAbsences} Day</div>
            <span className="text-[11px] text-zinc-500">Notice slip sent in diary</span>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Visual Grid */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-zinc-950">
              October 2026 Daily Roll
            </CardTitle>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Leave</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Absent</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-zinc-200" /> Weekend</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="font-semibold text-zinc-400 text-[11px] py-1">
                {day}
              </div>
            ))}

            {daysInOctober.map((item) => {
              let bg = 'bg-zinc-50 border-zinc-200 text-zinc-800';
              if (item.status === 'present') bg = 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold';
              if (item.status === 'leave') bg = 'bg-amber-50 border-amber-200 text-amber-950 font-bold';
              if (item.status === 'absent') bg = 'bg-red-50 border-red-200 text-red-950 font-bold';
              if (item.status === 'weekend') bg = 'bg-zinc-100 border-zinc-200/60 text-zinc-400';

              return (
                <div
                  key={item.day}
                  className={`p-2.5 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 min-h-[50px] ${bg}`}
                >
                  <span className="tabular-nums">{item.day}</span>
                  <span className="text-[9px] uppercase tracking-wider font-mono opacity-80">
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
