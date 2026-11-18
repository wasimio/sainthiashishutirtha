'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COUNCIL_ADMISSION_PIPELINE } from '@/data/councilDemoData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdmissionsPipelineCard() {
  const totalInquiries = COUNCIL_ADMISSION_PIPELINE[0].count;

  return (
    <Card className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base font-semibold text-zinc-950">
                Admissions Pipeline Funnel
              </CardTitle>
              <Badge variant="dark" className="text-[10px] font-medium">
                Session 2026–2027
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500 mt-0.5">
              Candidate progression from initial inquiry through physical verification.
            </CardDescription>
          </div>

          <div className="text-xs font-semibold text-zinc-900 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60 self-start sm:self-auto">
            {totalInquiries} Total Applications
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Funnel Stage Items */}
        <div className="space-y-2.5">
          {COUNCIL_ADMISSION_PIPELINE.map((stage, idx) => {
            const pct = Math.round((stage.count / totalInquiries) * 100);

            return (
              <div
                key={stage.stage}
                className="p-3 rounded-lg bg-zinc-50/70 border border-zinc-200/70 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-zinc-900 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {stage.stage}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-zinc-500 text-[11px]">
                      {stage.count} candidates
                    </span>
                    <span className="font-bold text-zinc-950 tabular-nums">
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-zinc-900 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5">
                  <span className="truncate">{stage.description}</span>
                  <span className="shrink-0 font-mono">Stage {idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Footer link */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Target seat intake: 60 per intake cycle</span>
          <Button variant="monochromeGhost" size="sm" asChild className="h-7 text-xs p-0 text-zinc-700 hover:text-zinc-950">
            <Link href="/portal/council/students-admissions" className="flex items-center gap-1">
              <span>Review Admissions Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
