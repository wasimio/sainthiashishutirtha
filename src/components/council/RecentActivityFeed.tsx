'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight
} from 'lucide-react';
import { COUNCIL_ACTIVITY_FEED } from '@/data/councilDemoData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RecentActivityFeed() {
  return (
    <Card className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm sm:text-base font-semibold text-zinc-950">
                Institutional Activity Feed
              </CardTitle>
              <Badge variant="zinc" className="text-[10px] font-medium">
                Live Log
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500 mt-0.5">
              Chronological log of administrative actions, fee receipts, and register updates.
            </CardDescription>
          </div>

          <span className="text-[11px] font-mono text-zinc-400 self-start sm:self-auto">
            Today
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-200">
          {COUNCIL_ACTIVITY_FEED.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-zinc-900 ring-4 ring-white" />

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900">
                    {event.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {event.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>By {event.actor}</span>
                  <span>•</span>
                  <span className="capitalize font-mono text-[10px] text-zinc-400">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Card Footer link */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Audit trail retained for 3 academic sessions</span>
          <Button variant="monochromeGhost" size="sm" asChild className="h-7 text-xs p-0 text-zinc-700 hover:text-zinc-950">
            <Link href="/portal/council/reports" className="flex items-center gap-1">
              <span>Full Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
