'use client';

import React, { useState } from 'react';
import {
  PlusCircle,
  Info
} from 'lucide-react';
import { STAFF_STUDENT_REMARKS, StaffStudentRemark, STAFF_ATTENDANCE_REGISTER } from '@/data/portalStaffData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function StaffRemarksPage() {
  const [remarks, setRemarks] = useState<StaffStudentRemark[]>(STAFF_STUDENT_REMARKS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('Aarav Sen (Roll #14)');
  const [category, setCategory] = useState<'Academic' | 'Behavioral' | 'Appreciation' | 'Attendance'>('Academic');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'Both' | 'Parents Only' | 'Internal Faculty'>('Both');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newRem: StaffStudentRemark = {
      id: `rem-${Date.now()}`,
      studentName: selectedStudent,
      scholarId: 'ST-2024-089',
      grade: 'Class II-A',
      category,
      date: new Date().toISOString().split('T')[0],
      content,
      visibility,
    };

    setRemarks([newRem, ...remarks]);
    setIsAddOpen(false);
    setContent('');
    setToastMessage('Student observation recorded in diary (Demo simulation).');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Student Observation
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Class II - Section A Diary
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Student Remarks & Behavioral Log
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Document academic observations, praise, developmental feedback, and attendance notices for parents.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="text-xs h-8 gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Student Remark</span>
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
          <span className="font-semibold text-zinc-950 block">Home-School Communication</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Remarks saved with &quot;Both&quot; or &quot;Parents Only&quot; visibility are transmitted to the verified Parent Portal diary for the guardian to review and acknowledge.
          </p>
        </div>
      </div>

      {/* Remarks Grid */}
      <div className="space-y-3">
        {remarks.map((rem) => (
          <Card key={rem.id} className="border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-950 text-sm">{rem.studentName}</span>
                  <Badge
                    variant={rem.category === 'Appreciation' ? 'dark' : 'zinc'}
                    className="text-[10px]"
                  >
                    {rem.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <span>{rem.date}</span>
                  <span>•</span>
                  <span>Visible to: {rem.visibility}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50/70 p-3 rounded-lg border border-zinc-200/60">
                {rem.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Remark Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleAddRemark}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">
                Record Student Observation
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Feedback will appear in the child&apos;s digital communication diary.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Select Scholar</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs rounded-md border border-zinc-200 bg-white"
                >
                  {STAFF_ATTENDANCE_REGISTER.map((st) => (
                    <option key={st.rollNo} value={`${st.name} (Roll #${st.rollNo})`}>
                      Roll #{st.rollNo} — {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Observation Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StaffStudentRemark['category'])}
                    className="w-full h-8 px-2 text-xs rounded-md border border-zinc-200 bg-white"
                  >
                    <option value="Academic">Academic Progress</option>
                    <option value="Appreciation">Appreciation / Star Behavior</option>
                    <option value="Behavioral">Behavioral Observation</option>
                    <option value="Attendance">Attendance Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as StaffStudentRemark['visibility'])}
                    className="w-full h-8 px-2 text-xs rounded-md border border-zinc-200 bg-white"
                  >
                    <option value="Both">Both Parents & Faculty</option>
                    <option value="Parents Only">Parents Only</option>
                    <option value="Internal Faculty">Internal Faculty Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Observation Details</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  placeholder="Specific observations, praise, or guidance for home practice..."
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
                onClick={() => setIsAddOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" className="text-xs">
                Save Observation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
