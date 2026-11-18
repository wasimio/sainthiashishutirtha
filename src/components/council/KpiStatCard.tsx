'use client';

import React from 'react';
import {
  Users,
  CheckCircle2,
  Sparkles,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { CouncilKpi } from '@/data/councilDemoData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KpiStatCardProps {
  kpi: CouncilKpi;
}

export default function KpiStatCard({ kpi }: KpiStatCardProps) {
  const getIcon = () => {
    switch (kpi.category) {
      case 'students':
        return <Users className="w-4 h-4 text-zinc-900" />;
      case 'attendance':
        return <CheckCircle2 className="w-4 h-4 text-zinc-900" />;
      case 'admissions':
        return <Sparkles className="w-4 h-4 text-zinc-900" />;
      case 'finance':
        return <CreditCard className="w-4 h-4 text-zinc-900" />;
      default:
        return <Users className="w-4 h-4 text-zinc-900" />;
    }
  };

  const getBadgeVariant = () => {
    switch (kpi.changeType) {
      case 'positive':
        return 'zinc';
      case 'alert':
        return 'warning';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="border-zinc-200/90 shadow-xs hover:border-zinc-400 hover:shadow-sm transition-all duration-150">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* Card Header Row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {kpi.label}
          </span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200/80 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
        </div>

        {/* Large Stat Metric */}
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            {kpi.value}
          </div>
          <p className="text-xs text-zinc-500 mt-1 truncate">
            {kpi.subtext}
          </p>
        </div>

        {/* Card Footer Trend / Status */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
          {kpi.changeLabel ? (
            <Badge
              variant={getBadgeVariant()}
              className="text-[10px] font-medium px-2 py-0.5 rounded"
            >
              <ArrowUpRight className="w-3 h-3 mr-1 inline-block text-zinc-600" />
              {kpi.changeLabel}
            </Badge>
          ) : (
            <span className="text-zinc-400 text-[11px]">Normal operating range</span>
          )}

          <span className="text-[10px] text-zinc-400 font-mono uppercase">
            {kpi.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
