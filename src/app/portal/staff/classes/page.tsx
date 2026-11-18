'use client';

import React, { useState } from 'react';
import {
  Search,
  Info,
  Download
} from 'lucide-react';
import { STAFF_PROFILE, STAFF_ATTENDANCE_REGISTER } from '@/data/portalStaffData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

export default function StaffClassesPage() {
  const [selectedSection, setSelectedSection] = useState('Class II - Section A');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRoster = STAFF_ATTENDANCE_REGISTER.filter((st) =>
    st.name.toLowerCase().includes(search.toLowerCase()) ||
    st.scholarId.toLowerCase().includes(search.toLowerCase()) ||
    st.rollNo.toString().includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Class Assignments
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              3 Teaching Sections • 90 Students Under Instruction
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Assigned Classes & Student Rosters
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Teaching duties, classroom rolls, guardian contact books, and section allocations.
          </p>
        </div>

        <Button
          variant="monochromeOutline"
          size="sm"
          onClick={() => {
            setToastMessage('Class roster downloaded as PDF (Sample representation).');
            setTimeout(() => setToastMessage(null), 3000);
          }}
          className="text-xs h-8 gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-zinc-600" />
          <span>Export Class Roster</span>
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
          <span className="font-semibold text-zinc-950 block">Section Mentorship & Subject Allocation</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Class teachers have complete guardianship view over their primary mentor section, while subject teachers have marks & attendance entry privileges.
          </p>
        </div>
      </div>

      {/* 3 Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STAFF_PROFILE.assignedSections.map((sec) => (
          <button
            key={sec.grade + sec.section}
            type="button"
            onClick={() => setSelectedSection(`${sec.grade} - Section ${sec.section}`)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedSection === `${sec.grade} - Section ${sec.section}`
                ? 'border-zinc-900 bg-white ring-2 ring-zinc-950/10 shadow-xs'
                : 'border-zinc-200 bg-zinc-50 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge variant={sec.role.includes('Class Teacher') ? 'dark' : 'zinc'} className="text-[10px]">
                {sec.role}
              </Badge>
              <span className="text-xs text-zinc-500 font-medium">{sec.students} Enrolled</span>
            </div>
            <div className="text-base font-bold text-zinc-950 mt-2">
              {sec.grade} — Section {sec.section}
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Room 201 • Morning Session
            </p>
          </button>
        ))}
      </div>

      {/* Search and Table */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Student Register — {selectedSection}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Roster list with roll numbers and emergency guardian contacts.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scholar name, roll..."
              className="pl-8 h-8 text-xs border-zinc-200"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                <TableHead className="w-16 text-center text-[11px]">Roll</TableHead>
                <TableHead className="w-28 text-[11px]">Scholar ID</TableHead>
                <TableHead className="text-[11px]">Student Name</TableHead>
                <TableHead className="text-center w-16 text-[11px]">Gender</TableHead>
                <TableHead className="text-[11px]">Guardian Phone</TableHead>
                <TableHead className="text-right text-[11px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoster.map((st) => (
                <TableRow key={st.rollNo} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                  <TableCell className="text-center font-bold text-zinc-950 tabular-nums">
                    {st.rollNo}
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500">{st.scholarId}</TableCell>
                  <TableCell className="font-semibold text-zinc-950">{st.name}</TableCell>
                  <TableCell className="text-center text-zinc-600 font-mono text-[11px]">{st.gender}</TableCell>
                  <TableCell className="font-mono text-zinc-600">{st.guardianPhone}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="monochromeOutline"
                      size="sm"
                      onClick={() => {
                        setToastMessage(`Viewing diary notes for ${st.name} (Roll #${st.rollNo}).`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="h-7 text-xs px-2.5 rounded-md"
                    >
                      <span>Diary Note</span>
                    </Button>
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
