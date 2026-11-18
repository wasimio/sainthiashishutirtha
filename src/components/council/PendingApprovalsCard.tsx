'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { COUNCIL_PENDING_TASKS, PendingTaskItem } from '@/data/councilDemoData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
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

export default function PendingApprovalsCard() {
  const [selectedTask, setSelectedTask] = useState<PendingTaskItem | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleApprove = () => {
    setActionStatus('Approved');
    setTimeout(() => {
      setSelectedTask(null);
      setActionStatus(null);
    }, 1200);
  };

  const handleDecline = () => {
    setActionStatus('Deferred for clarification');
    setTimeout(() => {
      setSelectedTask(null);
      setActionStatus(null);
    }, 1200);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning" className="text-[10px] px-1.5 py-0">Review Needed</Badge>;
      default:
        return <Badge variant="zinc" className="text-[10px] px-1.5 py-0">Routine</Badge>;
    }
  };

  return (
    <>
      <Card className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
        <CardHeader className="pb-4 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm sm:text-base font-semibold text-zinc-950">
                  Governance Approvals Queue
                </CardTitle>
                <Badge variant="dark" className="text-[10px] font-medium">
                  {COUNCIL_PENDING_TASKS.length} Pending
                </Badge>
              </div>
              <CardDescription className="text-xs text-zinc-500 mt-0.5">
                Institutional decisions, fee concessions, and staff approvals awaiting Council signature.
              </CardDescription>
            </div>

            <div className="text-xs font-semibold text-zinc-700 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60 self-start sm:self-auto">
              Action Required
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {COUNCIL_PENDING_TASKS.map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-lg border border-zinc-200/80 hover:border-zinc-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {task.category}
                  </span>
                  {getUrgencyBadge(task.urgency)}
                </div>

                <div className="text-xs font-semibold text-zinc-950 group-hover:text-zinc-800 transition-colors">
                  {task.title}
                </div>

                <p className="text-[11px] text-zinc-500 line-clamp-1">
                  {task.description}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-zinc-400 pt-0.5">
                  <span>Submitted by: {task.submittedBy}</span>
                  <span>•</span>
                  <span>{task.dateSubmitted}</span>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => setSelectedTask(task)}
                  className="h-7 text-xs px-3 rounded-md"
                >
                  Review
                </Button>
              </div>
            </div>
          ))}

          {/* Card Footer link */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Audit requirement: Two Council signatures for fee waivers</span>
            <Button variant="monochromeGhost" size="sm" asChild className="h-7 text-xs p-0 text-zinc-700 hover:text-zinc-950">
              <Link href="/portal/council/settings" className="flex items-center gap-1">
                <span>Governance Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="max-w-md border-zinc-200">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="zinc" className="text-[10px] font-mono">
                  {selectedTask.category}
                </Badge>
                {getUrgencyBadge(selectedTask.urgency)}
              </div>
              <DialogTitle className="text-base font-semibold text-zinc-950 mt-1">
                {selectedTask.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Submitted by {selectedTask.submittedBy} on {selectedTask.dateSubmitted}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700 space-y-2">
              <p className="leading-relaxed">{selectedTask.description}</p>
              <div className="pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500 flex justify-between">
                <span>Reference ID: {selectedTask.id}</span>
                <span>Council Decision Stage</span>
              </div>
            </div>

            {actionStatus && (
              <div className="p-3 rounded-lg bg-zinc-900 text-white text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Action recorded: {actionStatus}</span>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="monochromeOutline"
                size="sm"
                onClick={handleDecline}
                disabled={!!actionStatus}
                className="text-xs"
              >
                Request Clarification
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleApprove}
                disabled={!!actionStatus}
                className="text-xs"
              >
                Approve Decision
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
