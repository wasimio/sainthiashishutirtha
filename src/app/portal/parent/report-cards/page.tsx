'use client';

import React, { useState } from 'react';
import {
  Download,
  Info
} from 'lucide-react';
import { useParent } from '@/components/portal/parent/ParentContext';
import { PARENT_REPORT_CARDS } from '@/data/portalParentData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

export default function ParentReportCardsPage() {
  const { selectedChild } = useParent();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reportCard = PARENT_REPORT_CARDS[selectedChild.id] || PARENT_REPORT_CARDS['child-aarav'];

  const handleDownload = () => {
    setToastMessage(`Official Term Report Card for ${selectedChild.name} downloaded as PDF (Sample representation).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
              Scholar ID: {selectedChild.scholarId}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Terminal Evaluation & Report Card
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Official cumulative evaluation scores, subject-wise teacher observations, and promotion remarks.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={handleDownload}
          className="text-xs h-8 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Official PDF</span>
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
          <span className="font-semibold text-zinc-950 block">Evaluation Standard</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Report cards reflect continuous internal assessments (CIE) and summative term evaluations following primary curriculum guidelines.
          </p>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Evaluation Term</span>
            <div className="text-sm font-bold text-zinc-950 mt-1">{reportCard.term}</div>
            <span className="text-[11px] text-zinc-500">{selectedChild.grade} - Section {selectedChild.section}</span>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Cumulative Percentage</span>
            <div className="text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{reportCard.percentage}</div>
            <span className="text-[11px] text-emerald-700 font-semibold">{reportCard.totalMarks} / {reportCard.maxMarks} Marks</span>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardContent className="p-4">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Academic Standing</span>
            <div className="text-xl font-bold text-zinc-950 mt-1">{reportCard.rank}</div>
            <span className="text-[11px] text-zinc-500">Class Mentor: {selectedChild.classTeacher}</span>
          </CardContent>
        </Card>
      </div>

      {/* Subject Marks Table */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <CardTitle className="text-sm font-semibold text-zinc-950">
            Subject-Wise Learning Assessment
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Detailed performance breakdown across academic and co-curricular domains.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                <TableHead className="text-[11px]">Subject / Learning Area</TableHead>
                <TableHead className="text-center w-24 text-[11px]">Max Marks</TableHead>
                <TableHead className="text-center w-28 text-[11px]">Marks Obtained</TableHead>
                <TableHead className="text-center w-20 text-[11px]">Grade</TableHead>
                <TableHead className="text-[11px]">Teacher Observation & Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportCard.subjects.map((sub) => (
                <TableRow key={sub.subject} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                  <TableCell className="font-semibold text-zinc-950">{sub.subject}</TableCell>
                  <TableCell className="text-center font-mono text-zinc-500 tabular-nums">{sub.fullMarks}</TableCell>
                  <TableCell className="text-center font-bold text-zinc-950 tabular-nums">{sub.marksObtained}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="dark" className="text-[10px] font-bold">
                      {sub.gradeLetter}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600 text-[11px] leading-relaxed">
                    {sub.teacherRemarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Headmaster Overall Remark Card */}
      <Card className="border-zinc-200/90 shadow-xs bg-zinc-50/60">
        <CardContent className="p-5 space-y-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Institutional Mentor & Principal Observation
          </span>
          <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed italic">
            &ldquo;{reportCard.remarks}&rdquo;
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
