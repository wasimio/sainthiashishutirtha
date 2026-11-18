'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COUNCIL_ATTENDANCE_SNAPSHOT } from '@/data/councilDemoData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const WEEKLY_TREND = [
  { day: 'Mon', rate: 94.2, present: 322, total: 342 },
  { day: 'Tue', rate: 96.1, present: 329, total: 342 },
  { day: 'Wed', rate: 95.9, present: 328, total: 342 },
  { day: 'Thu', rate: 95.4, present: 326, total: 342 },
  { day: 'Fri', rate: 94.8, present: 324, total: 342 },
];

export default function AttendanceSummaryCard() {
  const totalPresent = COUNCIL_ATTENDANCE_SNAPSHOT.reduce((acc, curr) => acc + curr.present, 0);
  const totalStudents = COUNCIL_ATTENDANCE_SNAPSHOT.reduce((acc, curr) => acc + curr.total, 0);
  const overallPct = ((totalPresent / totalStudents) * 100).toFixed(1);

  return (
    <Card className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base font-semibold text-zinc-950">
                Attendance Telemetry
              </CardTitle>
              <Badge variant="dark" className="text-[10px] font-medium">
                {overallPct}% Today
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500 mt-0.5">
              Morning register completion and 5-day campus attendance trend.
            </CardDescription>
          </div>

          <div className="text-xs font-semibold text-zinc-700 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60 self-start sm:self-auto">
            {totalPresent} Present • {totalStudents - totalPresent} Absent
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <Tabs defaultValue="today" className="w-full">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-500">View format:</span>
            <TabsList className="h-7 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50">
              <TabsTrigger value="today" className="text-[11px] h-6 px-2.5">
                Today&apos;s Roll
              </TabsTrigger>
              <TabsTrigger value="trend" className="text-[11px] h-6 px-2.5">
                5-Day Trend
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Today's Roll */}
          <TabsContent value="today" className="space-y-3 mt-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COUNCIL_ATTENDANCE_SNAPSHOT.map((item) => (
                <div
                  key={item.grade}
                  className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-1 hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900 truncate">
                      {item.grade}
                    </span>
                    <span className="font-bold text-zinc-950 tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                    <span>Present:</span>
                    <span className="font-medium text-zinc-700">
                      {item.present}/{item.total}
                    </span>
                  </div>
                  {/* Mini bar */}
                  <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-900 h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: 5-Day Trend Bar Chart */}
          <TabsContent value="trend" className="space-y-3 mt-1">
            <div className="p-3 rounded-lg bg-zinc-50/70 border border-zinc-200/70 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-medium">Daily Campus Rate</span>
                <span className="text-[11px]">Benchmark: 95.0%</span>
              </div>

              {/* Responsive SVG Bar Chart */}
              <div className="h-32 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
                {WEEKLY_TREND.map((day) => {
                  const heightPct = Math.max(20, Math.round(((day.rate - 90) / 10) * 100));
                  return (
                    <div
                      key={day.day}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                    >
                      <span className="text-[10px] font-bold text-zinc-900 opacity-90 group-hover:scale-105 transition-transform tabular-nums">
                        {day.rate}%
                      </span>
                      <div className="w-full max-w-[36px] bg-zinc-200 rounded-t-sm h-full flex items-end">
                        <div
                          className="w-full bg-zinc-900 rounded-t-sm group-hover:bg-zinc-700 transition-colors"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-600">
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Card Footer link */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Faculty morning sign-in rate: 100%</span>
          <Button variant="monochromeGhost" size="sm" asChild className="h-7 text-xs p-0 text-zinc-700 hover:text-zinc-950">
            <Link href="/portal/council/reports" className="flex items-center gap-1">
              <span>Attendance Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
