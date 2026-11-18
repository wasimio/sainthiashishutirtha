'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Save,
  Info
} from 'lucide-react';
import { STAFF_ATTENDANCE_REGISTER, StaffStudentAttendance } from '@/data/portalStaffData';
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

export default function StaffDailyAttendancePage() {
  const [register, setRegister] = useState<StaffStudentAttendance[]>(STAFF_ATTENDANCE_REGISTER);
  const [selectedDate, setSelectedDate] = useState('2026-10-22');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const presentCount = register.filter((s) => s.status === 'present').length;
  const absentCount = register.filter((s) => s.status === 'absent').length;
  const lateCount = register.filter((s) => s.status === 'late').length;

  const handleStatusChange = (rollNo: number, newStatus: 'present' | 'absent' | 'late') => {
    setRegister((prev) =>
      prev.map((item) =>
        item.rollNo === rollNo ? { ...item, status: newStatus } : item
      )
    );
    setIsSaved(false);
  };

  const handleMarkAllPresent = () => {
    setRegister((prev) => prev.map((item) => ({ ...item, status: 'present' })));
    setIsSaved(false);
    setToastMessage('All 20 students marked present for today.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveRegister = () => {
    setIsSaved(true);
    setToastMessage('Morning Attendance Register saved locally (Demo simulation — no database record altered).');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Class II - Section A
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Morning Roll Call Register
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Daily Attendance Interface
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Record morning student attendance, note late arrivals, and submit verified register to administrative desk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={handleMarkAllPresent}
            className="text-xs h-8 gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
            <span>Mark All Present</span>
          </Button>

          {isSaved && (
            <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
              Register Saved
            </Badge>
          )}

          <Button
            variant="dark"
            size="sm"
            onClick={handleSaveRegister}
            className="text-xs h-8 gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Attendance Register</span>
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
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-950">Interactive Daily Register</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded">
              Demo Simulation
            </span>
          </div>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Clicking status pills updates the section metrics below. Saving demonstrates client-side state handling before Supabase table integration.
          </p>
        </div>
      </div>

      {/* Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase">Section Strength</span>
          <div className="text-xl font-bold text-zinc-950 mt-0.5">{register.length} Students</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-semibold text-emerald-700 uppercase">Present</span>
          <div className="text-xl font-bold text-zinc-950 mt-0.5 tabular-nums text-emerald-700">{presentCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-semibold text-red-700 uppercase">Absent</span>
          <div className="text-xl font-bold text-zinc-950 mt-0.5 tabular-nums text-red-700">{absentCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <span className="text-[10px] font-semibold text-amber-700 uppercase">Late Arrivals</span>
          <div className="text-xl font-bold text-zinc-950 mt-0.5 tabular-nums text-amber-700">{lateCount}</div>
        </div>
      </div>

      {/* Register Table */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Morning Roll Call Register — Class II-A
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Session date: {selectedDate} • Room 201
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-md border border-zinc-200 bg-zinc-50 font-mono text-zinc-800"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                <TableHead className="w-16 text-center text-[11px]">Roll</TableHead>
                <TableHead className="text-[11px]">Student Name</TableHead>
                <TableHead className="w-28 text-[11px]">Scholar ID</TableHead>
                <TableHead className="text-center w-64 text-[11px]">Attendance Status</TableHead>
                <TableHead className="text-[11px]">Teacher Observation / Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {register.map((student) => (
                <TableRow key={student.rollNo} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                  <TableCell className="text-center font-bold text-zinc-950 tabular-nums">
                    {student.rollNo}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-950">
                    {student.name}
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500">{student.scholarId}</TableCell>

                  {/* 3 Status Toggle Buttons */}
                  <TableCell className="text-center">
                    <div className="inline-flex rounded-md border border-zinc-200 p-0.5 bg-zinc-100 gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.rollNo, 'present')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                          student.status === 'present'
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.rollNo, 'absent')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                          student.status === 'absent'
                            ? 'bg-red-600 text-white shadow-2xs'
                            : 'text-zinc-600 hover:text-red-700'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.rollNo, 'late')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                          student.status === 'late'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'text-zinc-600 hover:text-amber-700'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </TableCell>

                  <TableCell className="text-zinc-500">
                    {student.notes ? (
                      <span className="italic">{student.notes}</span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
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
