'use client';

import React, { useState } from 'react';
import {
  PlusCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useParent } from '@/components/portal/parent/ParentContext';
import { PARENT_ABSENCE_REQUESTS, ParentAbsenceRequest } from '@/data/portalParentData';
import { Card, CardContent } from '@/components/ui/card';
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

export default function ParentAbsencePage() {
  const { selectedChild } = useParent();
  const [requests, setRequests] = useState<ParentAbsenceRequest[]>(PARENT_ABSENCE_REQUESTS);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reasonCategory, setReasonCategory] = useState<'Medical / Sickness' | 'Family Function' | 'Emergency' | 'Travel'>('Medical / Sickness');
  const [reasonText, setReasonText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const childRequests = requests.filter((r) => r.childId === selectedChild.id);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !reasonText.trim()) return;

    const newReq: ParentAbsenceRequest = {
      id: `abs-${Date.now()}`,
      childId: selectedChild.id,
      startDate,
      endDate: endDate || startDate,
      daysCount: 1,
      reasonCategory,
      reasonText,
      submittedOn: new Date().toISOString().split('T')[0],
      status: 'Under Review',
    };

    setRequests([newReq, ...requests]);
    setIsSubmitOpen(false);
    setStartDate('');
    setEndDate('');
    setReasonText('');
    setToastMessage(`Absence leave application submitted to ${selectedChild.classTeacher} (Demo simulation).`);
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
              Class Mentor: {selectedChild.classTeacher}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Student Absence & Leave Application
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Submit leave applications in advance, report medical sickness, and track approval status.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={() => setIsSubmitOpen(true)}
          className="text-xs h-8 gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Apply for Student Leave</span>
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
          <span className="font-semibold text-zinc-950 block">Leave Sanction Protocol</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Medical leaves exceeding 2 days require a certified physician note. Routine leaves are approved by the class teacher within 24 hours.
          </p>
        </div>
      </div>

      {/* Requests History List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Leave Applications History for {selectedChild.name}
        </h2>

        {childRequests.length === 0 ? (
          <Card className="border-zinc-200/90 shadow-xs">
            <CardContent className="py-10 text-center text-xs text-zinc-500">
              No absence applications submitted for {selectedChild.name}.
            </CardContent>
          </Card>
        ) : (
          childRequests.map((req) => (
            <Card key={req.id} className="border-zinc-200/90 shadow-xs">
              <CardContent className="p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="zinc" className="text-[10px]">
                      {req.reasonCategory}
                    </Badge>
                    <span className="font-bold text-zinc-950 text-xs">
                      {req.startDate} {req.endDate !== req.startDate ? `to ${req.endDate}` : ''} ({req.daysCount} Day{req.daysCount > 1 ? 's' : ''})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Applied: {req.submittedOn}
                    </span>
                    <Badge variant={req.status === 'Approved' ? 'dark' : 'outline'} className="text-[10px]">
                      {req.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50/70 p-3 rounded-lg border border-zinc-200/60">
                  {req.reasonText}
                </p>

                {req.reviewedBy && (
                  <div className="text-[11px] text-zinc-500 pt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sanctioned by: {req.reviewedBy}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Submit Leave Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleSubmitRequest}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">
                Submit Absence Application
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Application for {selectedChild.name} ({selectedChild.grade})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Reason Category</label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value as ParentAbsenceRequest['reasonCategory'])}
                  className="w-full h-8 px-2.5 text-xs rounded-md border border-zinc-200 bg-white"
                >
                  <option value="Medical / Sickness">Medical Sickness / Health</option>
                  <option value="Family Function">Family Event / Function</option>
                  <option value="Emergency">Domestic Emergency</option>
                  <option value="Travel">Family Travel</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 text-xs border-zinc-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-8 text-xs border-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Detailed Explanation</label>
                <textarea
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  rows={3}
                  placeholder="Explain reason for absence to the class teacher..."
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
                onClick={() => setIsSubmitOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" className="text-xs">
                Submit Slip
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
