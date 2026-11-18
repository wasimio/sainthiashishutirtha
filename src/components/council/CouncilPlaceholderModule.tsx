'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Info,
  CheckCircle2,
  Lock,
  Layers,
  LucideIcon
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CouncilPlaceholderModuleProps {
  title: string;
  badge: string;
  description: string;
  icon: LucideIcon;
  plannedFeatures: string[];
  governanceFocus: string;
}

export default function CouncilPlaceholderModule({
  title,
  badge,
  description,
  icon: Icon,
  plannedFeatures,
  governanceFocus,
}: CouncilPlaceholderModuleProps) {
  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-zinc-100 border border-zinc-200/80 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 space-y-0.5">
          <div className="flex items-center gap-2 font-semibold text-zinc-950">
            <span>Module Architecture Defined</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded">
              Phase 2 Target
            </span>
          </div>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            This module shell represents the Council Member oversight area for{' '}
            <strong>{title}</strong>. Full interactive database records and administrative forms will be integrated following Master Plan approval.
          </p>
        </div>
      </div>

      {/* Main Feature Preview Card */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-6 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="zinc" className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5">
                    {badge}
                  </Badge>
                  <span className="text-[11px] text-zinc-400 font-medium">Council Domain</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1">
                  {title}
                </CardTitle>
              </div>
            </div>

            <Button
              variant="monochromeOutline"
              size="sm"
              asChild
              className="text-xs font-medium h-8 self-start sm:self-auto"
            >
              <Link href="/portal/council" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Executive Overview</span>
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Description & Governance Focus */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-950">
                Module Scope & Operational Objectives
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {description}
              </p>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 space-y-1.5">
                <span className="text-xs font-semibold text-zinc-900 block">
                  Council Member Governance Authority:
                </span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {governanceFocus}
                </p>
              </div>
            </div>

            {/* Planned Deliverables */}
            <div className="lg:col-span-5 bg-zinc-50/70 p-5 rounded-xl border border-zinc-200/70 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60">
                <h4 className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Planned Sub-Features</span>
                </h4>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {plannedFeatures.length} Components
                </Badge>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-700 font-medium">
                {plannedFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 text-[11px] text-zinc-400 italic flex items-center gap-1.5 border-t border-zinc-200/60">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Backend mutations deferred per Step 1 frontend scope</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
