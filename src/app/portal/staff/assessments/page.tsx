'use client';

import React, { useState } from 'react';
import {
  Save,
  Info
} from 'lucide-react';
import { STAFF_MARKS_ROSTER, StaffMarksRecord } from '@/data/portalStaffData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

export default function StaffAssessmentsPage() {
  const [marks, setMarks] = useState<StaffMarksRecord[]>(STAFF_MARKS_ROSTER);
  const [term, setTerm] = useState('Term 1 Cumulative Assessment');
  const [subject, setSubject] = useState('English Language & Phonics');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const calculateGrade = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    return 'D';
  };

  const handleScoreChange = (rollNo: number, newScore: number) => {
    setMarks((prev) =>
      prev.map((item) => {
        if (item.rollNo === rollNo) {
          const score = isNaN(newScore) ? 0 : Math.min(item.maxMarks, Math.max(0, newScore));
          return {
            ...item,
            marksObtained: score,
            gradeLetter: calculateGrade(score, item.maxMarks),
          };
        }
        return item;
      })
    );
  };

  const handleSaveMarks = () => {
    setToastMessage('Assessment marks saved locally (Demo simulation — no database altered).');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Evaluation Console
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Class II - Section A
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Assessments & Marks Entry
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Enter terminal scores, calculate grades, and submit evaluation dossiers to the Headmaster desk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="dark"
            size="sm"
            onClick={handleSaveMarks}
            className="text-xs h-8 gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Marks Roster</span>
          </Button>
        </div>
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
          <span className="font-semibold text-zinc-950 block">Interactive Marks Calculation</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Changing scores in the input fields dynamically recalculates letter grades (A+, A, B+, B, C) in real time.
          </p>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-64">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">Assessment Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full h-8 px-2.5 text-xs rounded-md border border-zinc-200 bg-white font-medium"
          >
            <option>Term 1 Cumulative Assessment</option>
            <option>Unit Test 2 Assessment</option>
            <option>Terminal Promotion Examination</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase block mb-1">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-8 px-2.5 text-xs rounded-md border border-zinc-200 bg-white font-medium"
          >
            <option>English Language & Phonics</option>
            <option>Mental Arithmetic & Tables</option>
            <option>Environmental Studies (EVS)</option>
            <option>Bengali (সহজ পাঠ)</option>
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Evaluation Roster — {subject} (Max Marks: 50)
            </CardTitle>
            <span className="text-xs text-zinc-500">Term: {term}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                <TableHead className="w-16 text-center text-[11px]">Roll</TableHead>
                <TableHead className="w-28 text-[11px]">Scholar ID</TableHead>
                <TableHead className="text-[11px]">Student Name</TableHead>
                <TableHead className="w-32 text-center text-[11px]">Score (/ 50)</TableHead>
                <TableHead className="w-20 text-center text-[11px]">Grade</TableHead>
                <TableHead className="text-[11px]">Teacher Observation / Performance Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marks.map((row) => (
                <TableRow key={row.rollNo} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                  <TableCell className="text-center font-bold text-zinc-950 tabular-nums">
                    {row.rollNo}
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500">{row.scholarId}</TableCell>
                  <TableCell className="font-semibold text-zinc-950">{row.studentName}</TableCell>

                  {/* Score Input */}
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min={0}
                      max={row.maxMarks}
                      value={row.marksObtained}
                      onChange={(e) => handleScoreChange(row.rollNo, parseInt(e.target.value))}
                      className="w-20 h-7 text-center font-bold tabular-nums text-xs mx-auto border-zinc-300"
                    />
                  </TableCell>

                  {/* Letter Grade */}
                  <TableCell className="text-center">
                    <Badge variant={row.gradeLetter === 'A+' ? 'dark' : 'zinc'} className="text-[11px] font-bold">
                      {row.gradeLetter}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-zinc-600 text-[11px]">
                    {row.remarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
