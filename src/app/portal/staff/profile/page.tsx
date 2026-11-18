'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  PlusCircle
} from 'lucide-react';
import { STAFF_PROFILE } from '@/data/portalStaffData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function StaffProfilePage() {
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [leaveDays, setLeaveDays] = useState('1');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [reason, setReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLeaveOpen(false);
    setToastMessage(`Leave application (${leaveDays} day(s) ${leaveType}) submitted for Principal review (Demo simulation).`);
    setReason('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Staff Record
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Employee ID: {STAFF_PROFILE.employeeId}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Faculty Profile & Leave Balance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Teaching qualifications, service record, assigned mentorship duties, and leave entitlements.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={() => setIsLeaveOpen(true)}
          className="text-xs h-8 gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Apply for Leave</span>
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

      {/* Profile Identity Card */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-zinc-900 text-white font-bold text-2xl flex items-center justify-center shrink-0">
                SG
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-zinc-950">{STAFF_PROFILE.name}</h2>
                  <Badge variant="dark" className="text-[10px]">Senior Faculty</Badge>
                </div>
                <p className="text-xs text-zinc-600">{STAFF_PROFILE.designation}</p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                  <span>ID: {STAFF_PROFILE.employeeId}</span>
                  <span>•</span>
                  <span>Experience: {STAFF_PROFILE.experience}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-600 space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-3 sm:pt-0 sm:pl-6">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>{STAFF_PROFILE.email}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>{STAFF_PROFILE.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                <span>{STAFF_PROFILE.qualification}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Leave Balances & Teaching Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Ledger */}
        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Annual Leave Ledger (Session 2026–2027)
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Statutory leave accruals and remaining days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-900 block">Casual Leave (CL)</span>
                <span className="text-[11px] text-zinc-500">For personal or emergency needs</span>
              </div>
              <Badge variant="zinc" className="text-xs font-bold font-mono">
                {STAFF_PROFILE.leaveBalance.casualLeave}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-900 block">Medical Leave (ML)</span>
                <span className="text-[11px] text-zinc-500">Medical certificate supported</span>
              </div>
              <Badge variant="zinc" className="text-xs font-bold font-mono">
                {STAFF_PROFILE.leaveBalance.medicalLeave}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-900 block">Earned Leave (EL)</span>
                <span className="text-[11px] text-zinc-500">Accumulated vacation duty credit</span>
              </div>
              <Badge variant="dark" className="text-xs font-bold font-mono">
                {STAFF_PROFILE.leaveBalance.earnedLeave}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Responsibilities */}
        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Institutional Duties & Allocation
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Class mentorship and curriculum subject responsibilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            {STAFF_PROFILE.assignedSections.map((sec) => (
              <div key={sec.grade + sec.section} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{sec.grade} - Section {sec.section}</span>
                  <Badge variant={sec.role.includes('Class Teacher') ? 'dark' : 'outline'} className="text-[10px]">
                    {sec.role}
                  </Badge>
                </div>
                <div className="text-[11px] text-zinc-500">
                  {sec.students} Scholars • English Phonics & EVS Curriculum
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Apply Leave Dialog */}
      <Dialog open={isLeaveOpen} onOpenChange={setIsLeaveOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleApplyLeave}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">
                Staff Leave Application
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Application will be routed to the Principal & Council Member desk for approval.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-zinc-200 bg-white"
                  >
                    <option value="Casual Leave">Casual Leave (CL)</option>
                    <option value="Medical Leave">Medical Leave (ML)</option>
                    <option value="Earned Leave">Earned Leave (EL)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Days Count</label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(e.target.value)}
                    className="h-8 text-xs border-zinc-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Reason for Absence</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Reason for leave and planned substitute teacher coverage..."
                  className="w-full p-2 text-xs rounded-md border border-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="monochromeOutline"
                size="sm"
                onClick={() => setIsLeaveOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" className="text-xs">
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
