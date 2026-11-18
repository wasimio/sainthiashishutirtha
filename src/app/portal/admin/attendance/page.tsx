'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Download,
  Loader2,
  AlertCircle,
  Calendar
} from 'lucide-react';
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
import {
  getDailyAttendanceSummary,
  DailyAttendanceSummary,
} from '@/lib/services/adminService';

export default function AdminAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [summary, setSummary] = useState<DailyAttendanceSummary>({
    date: selectedDate,
    totalSessions: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalStudents: 0,
    attendancePct: null,
    absentees: [],
  });

  useEffect(() => {
    let isMounted = true;
    getDailyAttendanceSummary(selectedDate)
      .then((data) => {
        if (isMounted) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to load attendance summary:', err);
          setError(err instanceof Error ? err.message : 'Failed to query attendance telemetry.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const handleExportCSV = () => {
    if (summary.absentees.length === 0) {
      setToastMessage(`No absentee records found for ${selectedDate}.`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const headers = ['Scholar ID', 'Student Name', 'Grade & Section', 'Status', 'Remarks'];
    const rows = summary.absentees.map((a) => [
      `"${a.scholarId}"`,
      `"${a.studentName}"`,
      `"${a.className} - ${a.sectionName}"`,
      `"${a.status}"`,
      `"${a.remarks || 'None'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Absentees_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`Exported ${summary.absentees.length} absentee records to CSV.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Attendance Control
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Daily Attendance Register
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Campus Attendance Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Real-time morning classroom register completion, grade percentages, and daily absentee tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-100 rounded-lg p-1 border border-zinc-200">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 ml-1.5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs bg-transparent border-0 font-mono text-zinc-900 focus:ring-0 p-0.5"
            />
          </div>

          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-8 gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            <span>Export Register</span>
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

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-semibold block">Attendance Query Notice</span>
            <p className="text-amber-700 text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Overall Campus Attendance
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold font-mono text-zinc-950">
              {summary.attendancePct !== null ? `${summary.attendancePct}%` : 'N/A'}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {summary.totalStudents > 0
                ? `${summary.totalPresent} of ${summary.totalStudents} scholars present`
                : 'No roll-call sessions marked'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Classroom Register Submissions
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold font-mono text-zinc-950">
              {summary.totalSessions} Sessions
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {summary.totalSessions === 0
                ? 'Pending class teacher submissions'
                : 'Classroom morning rolls recorded'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/90 shadow-xs bg-zinc-950 text-white">
          <CardHeader className="p-4 pb-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Daily Absentees
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold font-mono text-white">
              {summary.totalAbsent} Scholars
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {summary.totalLate > 0 ? `${summary.totalLate} marked late` : 'All roll marks accounted'}
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
          <p className="text-xs">Gathering roll-call register telemetry...</p>
        </div>
      ) : summary.totalSessions === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">No Attendance Sessions Recorded for {selectedDate}</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
              Morning registers will appear here in real-time as class teachers submit daily roll calls via the Staff Portal.
            </p>
            <Badge variant="zinc" className="text-xs">
              Waiting for teacher submissions
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  Daily Absentee Register ({selectedDate})
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Scholars recorded absent during today&apos;s morning roll call requiring diary follow-up.
                </CardDescription>
              </div>
              <Badge variant="dark" className="text-[10px]">
                {summary.absentees.length} Absentees
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {summary.absentees.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-zinc-900">100% Attendance Recorded!</p>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  No scholars were marked absent across the submitted sessions today.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                    <TableHead className="w-28 text-[11px]">Scholar ID</TableHead>
                    <TableHead className="text-[11px]">Scholar Name</TableHead>
                    <TableHead className="text-[11px]">Grade Division</TableHead>
                    <TableHead className="text-[11px]">Status</TableHead>
                    <TableHead className="text-[11px]">Remarks / Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.absentees.map((a) => (
                    <TableRow key={a.studentId} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                      <TableCell className="font-mono font-medium text-zinc-500">{a.scholarId}</TableCell>
                      <TableCell className="font-bold text-zinc-950">{a.studentName}</TableCell>
                      <TableCell className="text-zinc-700 font-medium">
                        {a.className} - Section {a.sectionName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="zinc" className="text-[10px] text-amber-700 bg-amber-50 border-amber-200">
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-[11px]">
                        {a.remarks || 'No parent note submitted'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
