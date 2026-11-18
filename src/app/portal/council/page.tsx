'use client';

import React, { useState } from 'react';
import {
  Info,
  Download,
  Search
} from 'lucide-react';
import { COUNCIL_KPIS } from '@/data/councilDemoData';
import KpiStatCard from '@/components/council/KpiStatCard';
import EnrollmentBreakdownCard from '@/components/council/EnrollmentBreakdownCard';
import AttendanceSummaryCard from '@/components/council/AttendanceSummaryCard';
import AdmissionsPipelineCard from '@/components/council/AdmissionsPipelineCard';
import FeeSummaryCard from '@/components/council/FeeSummaryCard';
import PendingApprovalsCard from '@/components/council/PendingApprovalsCard';
import RecentActivityFeed from '@/components/council/RecentActivityFeed';
import QuickActionShortcuts from '@/components/council/QuickActionShortcuts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CouncilCommandDialog from '@/components/council/CouncilCommandDialog';

export default function CouncilOverviewPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleExport = () => {
    setDownloadNotice('Executive summary dossier exported (sample PDF).');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5">
              Executive Governance
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Sainthia Shishutirtha • Birbhum
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            Institutional Oversight Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl">
            Real-time administrative telemetry, student enrollment distribution, daily attendance, fee realization, and governance queues.
          </p>
        </div>

        {/* Date and Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={handleExport}
            className="text-xs gap-1.5 h-8 font-medium"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            <span>Export Summary</span>
          </Button>

          <Button
            variant="dark"
            size="sm"
            onClick={() => setIsCommandOpen(true)}
            className="text-xs gap-1.5 h-8 font-medium"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Command Palette</span>
            <kbd className="hidden sm:inline-block px-1 py-0 text-[10px] font-mono text-zinc-400 bg-zinc-800 rounded">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>

      {/* Export notification toast if triggered */}
      {downloadNotice && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span>{downloadNotice}</span>
          <button
            type="button"
            onClick={() => setDownloadNotice(null)}
            className="text-zinc-400 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Sleek Monochrome Demonstration Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 space-y-0.5">
          <div className="flex items-center gap-2 font-semibold text-zinc-950">
            <span>Fictional Demonstration Environment</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded">
              Sample Data Only
            </span>
          </div>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            All student enrollments, attendance figures, admission funnels, and fee ledgers presented across this dashboard are illustrative sample records designed to review layout, information density, and navigation flow before live database connection.
          </p>
        </div>
      </div>

      {/* 3. 4 Primary Key Performance Indicators */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COUNCIL_KPIS.map((kpi) => (
            <KpiStatCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* 4. Core Operational Grid: Enrollment & Attendance */}
      <section aria-label="Enrollment and Attendance Metrics">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <EnrollmentBreakdownCard />
          </div>
          <div className="lg:col-span-5">
            <AttendanceSummaryCard />
          </div>
        </div>
      </section>

      {/* 5. Admissions Funnel & Financial Summary Grid */}
      <section aria-label="Admissions and Financial Summaries">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <AdmissionsPipelineCard />
          </div>
          <div className="lg:col-span-7">
            <FeeSummaryCard />
          </div>
        </div>
      </section>

      {/* 6. Governance Queue: Pending Tasks & Recent Activity */}
      <section aria-label="Pending Approvals and Institutional Activity">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PendingApprovalsCard />
          </div>
          <div className="lg:col-span-5">
            <RecentActivityFeed />
          </div>
        </div>
      </section>

      {/* 7. Quick Action Shortcuts */}
      <section aria-label="Quick Navigation Shortcuts" className="pt-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Institutional Shortcuts & Access
          </h2>
          <span className="text-[11px] text-zinc-400">Direct Module Links</span>
        </div>
        <QuickActionShortcuts />
      </section>

      {/* Global Command Dialog */}
      <CouncilCommandDialog
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />
    </div>
  );
}
