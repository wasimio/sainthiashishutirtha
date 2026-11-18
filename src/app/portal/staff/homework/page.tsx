'use client';

import React, { useState } from 'react';
import {
  PlusCircle,
  Paperclip,
  Info
} from 'lucide-react';
import { STAFF_HOMEWORK_LIST, StaffHomework } from '@/data/portalStaffData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

export default function StaffHomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<StaffHomework[]>(STAFF_HOMEWORK_LIST);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('Class II-A');
  const [subject, setSubject] = useState('English Language');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const newHw: StaffHomework = {
      id: `hw-${Date.now()}`,
      title,
      grade: grade.split('-')[0],
      section: grade.split('-')[1] || 'A',
      subject,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      instructions,
      submissionsCount: 0,
      totalStudents: 32,
      status: 'Active',
    };

    setHomeworkList([newHw, ...homeworkList]);
    setIsAssignOpen(false);
    setTitle('');
    setInstructions('');
    setDueDate('');
    setToastMessage('New homework assigned to class diary (Demo simulation).');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Curricular Assignments
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Daily Class Diary & Worksheets
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Homework & Worksheet Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Publish daily homework tasks, attach practice sheets, and monitor student completion status.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={() => setIsAssignOpen(true)}
          className="text-xs h-8 gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Assign New Homework</span>
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
          <span className="font-semibold text-zinc-950 block">Diary Sync Notice</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Tasks published here sync immediately to the Parent & Student Portal under the respective child&apos;s homework tab.
          </p>
        </div>
      </div>

      {/* Homework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeworkList.map((hw) => {
          const compPct = Math.round((hw.submissionsCount / hw.totalStudents) * 100);

          return (
            <Card key={hw.id} className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="zinc" className="text-[10px]">
                    {hw.grade} - Section {hw.section}
                  </Badge>
                  <span className="text-[11px] font-medium text-zinc-500">
                    {hw.subject}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-zinc-950 mt-1">
                  {hw.title}
                </CardTitle>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  <span>Assigned: {hw.assignedDate}</span>
                  <span>•</span>
                  <span className="font-semibold text-zinc-700">Due: {hw.dueDate}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-3 space-y-3">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {hw.instructions}
                </p>

                {hw.attachmentName && (
                  <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-between text-xs text-zinc-700">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate font-mono text-[11px]">{hw.attachmentName}</span>
                    </div>
                    <Button variant="monochromeGhost" size="sm" className="h-6 text-[10px] px-2 text-zinc-600">
                      View
                    </Button>
                  </div>
                )}

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Parent Signatures / Submissions</span>
                    <span className="font-semibold text-zinc-900">{hw.submissionsCount} / {hw.totalStudents} ({compPct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-900 h-full rounded-full" style={{ width: `${compPct}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <Badge variant={hw.status === 'Active' ? 'dark' : 'outline'} className="text-[10px]">
                    {hw.status}
                  </Badge>

                  <Button
                    variant="monochromeOutline"
                    size="sm"
                    onClick={() => {
                      setToastMessage(`Reviewed submissions for "${hw.title}".`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="h-7 text-xs px-2.5 rounded-md"
                  >
                    <span>Inspect Submissions</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Assign Homework Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleAssign}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">
                Assign Class Homework
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Task will appear in student diaries and the verified parent portal.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Homework Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 5 Reading & Sentence Construction"
                  className="h-8 text-xs border-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Target Section</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-zinc-200 bg-white"
                  >
                    <option value="Class II-A">Class II - Section A</option>
                    <option value="Class III-B">Class III - Section B</option>
                    <option value="Class IV-A">Class IV - Section A</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-zinc-200 bg-white"
                  >
                    <option value="English Language">English Language</option>
                    <option value="Environmental Studies">Environmental Studies</option>
                    <option value="Bengali Literature">Bengali Literature</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-8 text-xs border-zinc-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Teacher Instructions</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  placeholder="Specific tasks for student to complete in workbook or notebook..."
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
                onClick={() => setIsAssignOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" className="text-xs">
                Dispatch Homework
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
