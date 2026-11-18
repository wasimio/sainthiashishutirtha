'use client';

import React, { useState } from 'react';
import {
  Download,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminReportsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reportItems = [
    { title: 'Annual U-DISE+ Statutory School Data Return', description: 'Comprehensive student, faculty, and infrastructure census for Ministry of Education submission.', code: 'UDISE-2025-26', size: '2.4 MB' },
    { title: 'Term 1 Academic Evaluation & Promotion Analysis', description: 'Grade-wise performance distribution, subject average marks, and learning outcome benchmarks.', code: 'ACAD-EVAL-T1', size: '1.8 MB' },
    { title: 'Campus Attendance & Chronic Absenteeism Audit', description: 'Daily attendance rates, gender breakdown, and students with less than 75% attendance.', code: 'ATTN-AUDIT-Q2', size: '890 KB' },
    { title: 'Quarterly Fee Reconciliation & Audit Ledger', description: 'Tuition fees, development fund realizations, concessions, and outstanding defaulters roll.', code: 'FIN-AUDIT-Q2', size: '1.2 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Compliance & Reporting
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              U-DISE: 19082200103 • Birbhum District
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Reports & Institutional Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Official statutory returns, academic telemetry, attendance analytics, and treasury audit packages.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={() => {
            setToastMessage('Complete annual school report package generated (Demo simulation).');
            setTimeout(() => setToastMessage(null), 3000);
          }}
          className="text-xs h-8 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Generate Full Dossier</span>
        </Button>
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
          <span className="font-semibold text-zinc-950 block">Audit & Regulatory Archive</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Reports generated here are structured for governing council meetings, West Bengal education department verifications, and annual general body review.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Total Enrollment</span>
            <div className="text-2xl font-bold text-zinc-950 mt-0.5">342</div>
            <span className="text-[10px] text-zinc-500">95.0% Capacity Utilization</span>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Student Retention</span>
            <div className="text-2xl font-bold text-zinc-950 mt-0.5">98.2%</div>
            <span className="text-[10px] text-emerald-700 font-semibold">+1.4% vs last session</span>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Teacher-Student Ratio</span>
            <div className="text-2xl font-bold text-zinc-950 mt-0.5">1 : 16</div>
            <span className="text-[10px] text-zinc-500">Exceeds RTE 1:30 benchmark</span>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] uppercase font-semibold text-zinc-500">Average Attendance</span>
            <div className="text-2xl font-bold text-zinc-950 mt-0.5">95.4%</div>
            <span className="text-[10px] text-zinc-500">Annual cumulative rate</span>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Available Regulatory Reports & Institutional Dossiers
        </h2>

        {reportItems.map((rep) => (
          <Card key={rep.code} className="border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-colors">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="zinc" className="text-[10px] font-mono">
                    {rep.code}
                  </Badge>
                  <span className="text-[11px] text-zinc-400 font-mono">{rep.size}</span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-950">
                  {rep.title}
                </h3>
                <p className="text-xs text-zinc-600 line-clamp-2">
                  {rep.description}
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <Button
                  variant="monochromeOutline"
                  size="sm"
                  onClick={() => {
                    setToastMessage(`Downloading ${rep.code} (Sample PDF representation)...`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="h-8 text-xs gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Download PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
