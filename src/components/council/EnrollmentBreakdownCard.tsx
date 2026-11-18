'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COUNCIL_ENROLLMENT } from '@/data/councilDemoData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function EnrollmentBreakdownCard() {
  const totalEnrolled = COUNCIL_ENROLLMENT.reduce((acc, curr) => acc + curr.enrolled, 0);
  const totalCapacity = COUNCIL_ENROLLMENT.reduce((acc, curr) => acc + curr.capacity, 0);
  const overallPercentage = ((totalEnrolled / totalCapacity) * 100).toFixed(1);

  return (
    <Card className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base font-semibold text-zinc-950">
                Enrollment by Academic Grade
              </CardTitle>
              <Badge variant="zinc" className="text-[10px] font-medium">
                {overallPercentage}% Capacity
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500 mt-0.5">
              Current student strength across Kindergarten and Primary wings.
            </CardDescription>
          </div>

          <div className="text-xs font-semibold text-zinc-900 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60 self-start sm:self-auto">
            {totalEnrolled} / {totalCapacity} Seats Filled
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Grade Breakdown Bars */}
        <div className="space-y-3">
          {COUNCIL_ENROLLMENT.map((item) => {
            const pct = Math.round((item.enrolled / item.capacity) * 100);
            const isFull = pct >= 95;

            return (
              <div key={item.grade} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900">{item.grade}</span>
                    <span className="text-[11px] text-zinc-400">
                      ({item.sections} {item.sections === 1 ? 'section' : 'sections'})
                    </span>
                    <span className="text-[10px] text-zinc-400 px-1.5 py-0.2 bg-zinc-100 rounded">
                      {item.wing}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-zinc-500">
                      {item.enrolled} / {item.capacity}
                    </span>
                    <span
                      className={`font-semibold tabular-nums ${
                        isFull ? 'text-zinc-950 font-bold' : 'text-zinc-700'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-zinc-900' : 'bg-zinc-700'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Footer link */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Capacity limit: 40 students per section</span>
          <Button variant="monochromeGhost" size="sm" asChild className="h-7 text-xs p-0 text-zinc-700 hover:text-zinc-950">
            <Link href="/portal/council/students-admissions" className="flex items-center gap-1">
              <span>View Student Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
