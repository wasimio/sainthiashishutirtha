'use client';

import React, { useState } from 'react';
import {
  Clock,
  Info,
  Paperclip,
  Check
} from 'lucide-react';
import { useParent } from '@/components/portal/parent/ParentContext';
import { PARENT_HOMEWORK_ITEMS, ParentHomeworkItem } from '@/data/portalParentData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ParentHomeworkPage() {
  const { selectedChild } = useParent();
  const [items, setItems] = useState<ParentHomeworkItem[]>(PARENT_HOMEWORK_ITEMS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const childHomework = items.filter((h) => h.childId === selectedChild.id);

  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
    const target = items.find((i) => i.id === id);
    const nextState = !target?.isCompleted;
    setToastMessage(
      nextState
        ? `Marked "${target?.title}" as completed at home.`
        : `Marked "${target?.title}" as pending.`
    );
    setTimeout(() => setToastMessage(null), 3000);
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
              Daily Communication Diary
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Homework & Curricular Tasks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Assigned reading practice, workbook assignments, and downloadable worksheets for {selectedChild.name}.
          </p>
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
          <span className="font-semibold text-zinc-950 block">Parent Signature & Home Verification</span>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Checking off a task signifies to the class mentor that the child has completed home reading or workbook practice.
          </p>
        </div>
      </div>

      {/* Homework Cards */}
      <div className="space-y-4">
        {childHomework.length === 0 ? (
          <Card className="border-zinc-200/90 shadow-xs">
            <CardContent className="py-12 text-center text-xs text-zinc-500">
              No active homework tasks assigned for {selectedChild.name}.
            </CardContent>
          </Card>
        ) : (
          childHomework.map((hw) => (
            <Card
              key={hw.id}
              className={`border-zinc-200/90 shadow-xs transition-colors ${
                hw.isCompleted ? 'bg-zinc-50/50 opacity-90' : 'bg-white'
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="zinc" className="text-[10px]">
                        {hw.subject}
                      </Badge>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Assigned on {hw.assignedDate}
                      </span>
                    </div>
                    <h3 className={`text-base font-bold text-zinc-950 ${hw.isCompleted ? 'line-through text-zinc-500' : ''}`}>
                      {hw.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(hw.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        hw.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
                      }`}
                    >
                      {hw.isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <span>Mark as Done</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60 text-xs text-zinc-700 leading-relaxed">
                  {hw.instructions}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                  <div>
                    Teacher: <strong className="text-zinc-800">{hw.teacherName}</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    {hw.attachmentName && (
                      <button
                        type="button"
                        onClick={() => {
                          setToastMessage(`Downloading ${hw.attachmentName} (Sample PDF)...`);
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="text-xs font-medium text-zinc-900 hover:underline flex items-center gap-1"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>{hw.attachmentName}</span>
                      </button>
                    )}
                    <span className="text-zinc-400">•</span>
                    <span className="font-semibold text-zinc-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Due: {hw.dueDate}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
