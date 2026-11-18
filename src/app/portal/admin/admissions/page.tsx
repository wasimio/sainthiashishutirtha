'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Info,
  FileCheck,
  UserPlus,
  RefreshCw,
  Database
} from 'lucide-react';
import { type AdminAdmissionApplication } from '@/data/portalAdminData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getAdminAdmissionsApplications,
  updateAdminAdmissionStage,
} from '@/lib/actions/admissionsActions';
import type { AdmissionStage } from '@/types/database.types';

export default function AdminAdmissionsPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<AdminAdmissionApplication | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveApplications, setLiveApplications] = useState<AdminAdmissionApplication[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  const reloadApplications = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await getAdminAdmissionsApplications();
      if (result.success && result.data) {
        const mapped: AdminAdmissionApplication[] = result.data.map((row) => ({
          id: row.id,
          applicationNo: row.application_no,
          candidateName: `${row.candidate_first_name} ${row.candidate_last_name}`.trim(),
          appliedGrade: row.previous_school?.includes('Applied Tier:')
            ? row.previous_school.split('Applied Tier:')[1].split('|')[0].trim()
            : 'KG',
          guardianName: row.guardian_name,
          guardianPhone: row.guardian_phone,
          submissionDate: row.created_at ? row.created_at.split('T')[0] : '2026-10-29',
          stage: row.stage as AdminAdmissionApplication['stage'],
          status: row.status as AdminAdmissionApplication['status'],
          notes: row.previous_school || 'Direct public website online enquiry.',
        }));
        setLiveApplications(mapped);
        setIsLiveConnected(true);
      } else {
        setLiveApplications([]);
        setIsLiveConnected(false);
      }
    } catch {
      setLiveApplications([]);
      setIsLiveConnected(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const result = await getAdminAdmissionsApplications();
        if (ignore) return;
        if (result.success && result.data) {
          const mapped: AdminAdmissionApplication[] = result.data.map((row) => ({
            id: row.id,
            applicationNo: row.application_no,
            candidateName: `${row.candidate_first_name} ${row.candidate_last_name}`.trim(),
            appliedGrade: row.previous_school?.includes('Applied Tier:')
              ? row.previous_school.split('Applied Tier:')[1].split('|')[0].trim()
              : 'KG',
            guardianName: row.guardian_name,
            guardianPhone: row.guardian_phone,
            submissionDate: row.created_at ? row.created_at.split('T')[0] : '2026-10-29',
            stage: row.stage as AdminAdmissionApplication['stage'],
            status: row.status as AdminAdmissionApplication['status'],
            notes: row.previous_school || 'Direct public website online enquiry.',
          }));
          setLiveApplications(mapped);
          setIsLiveConnected(true);
        } else {
          setLiveApplications([]);
          setIsLiveConnected(false);
        }
      } catch {
        if (!ignore) {
          setLiveApplications([]);
          setIsLiveConnected(false);
        }
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredApps = liveApplications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(search.toLowerCase()) ||
      app.guardianName.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'All' || app.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const nextStageMap: Record<string, AdmissionStage> = {
    'Applied': 'Document Verification',
    'Document Verification': 'Parent Interaction',
    'Parent Interaction': 'Provisional Admission',
    'Provisional Admission': 'Enrolled',
    'Enrolled': 'Enrolled',
  };

  const handleStageAdvance = async () => {
    if (!selectedApp) return;
    setIsUpdatingStage(true);

    const nextStage = nextStageMap[selectedApp.stage] || 'Document Verification';

    if (isLiveConnected) {
      const res = await updateAdminAdmissionStage(selectedApp.id, nextStage);
      if (res.success) {
        setToastMessage(`Application ${selectedApp.applicationNo} moved to "${nextStage}".`);
        await reloadApplications();
      } else {
        setToastMessage(`Failed to advance stage: ${res.error}`);
      }
    } else {
      setToastMessage(`Application ${selectedApp.applicationNo} advanced to "${nextStage}" (Demo preview).`);
      setLiveApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, stage: nextStage as AdminAdmissionApplication['stage'] } : a))
      );
    }

    setIsUpdatingStage(false);
    setSelectedApp(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Admissions Desk
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Academic Session 2026–2027
            </span>
            <span className="text-zinc-300">•</span>
            {isLiveConnected ? (
              <Badge variant="zinc" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-200">
                Live Supabase Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-zinc-500">
                Demo Sample Queue
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Admissions Pipeline & Verification
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Monitor applicant progression from online submission to document verification, parent interaction, and seat allotment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={reloadApplications}
            disabled={isRefreshing}
            className="text-xs h-8 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              setToastMessage('To register walk-in candidates, submit through the public admission modal.');
              setTimeout(() => setToastMessage(null), 4000);
            }}
            className="text-xs h-8 gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Walk-in Intake</span>
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

      {/* Connection Notice */}
      {!isLiveConnected && (
        <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-700 space-y-0.5">
            <span className="font-semibold text-zinc-950 block">Database Status: 0 Live Records in Supabase</span>
            <p className="text-zinc-600 text-[11px] leading-relaxed">
              Displaying sample applicant dossiers for stage verification. Once parents submit live enquiries through the public admission modal, real database records will display here automatically.
            </p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate name, application ID..."
            className="pl-9 h-9 text-xs border-zinc-200"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0">
          {['All', 'Applied', 'Document Verification', 'Parent Interaction', 'Provisional Admission'].map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setStageFilter(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                stageFilter === stage
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-zinc-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
              <Database className="w-4 h-4 text-zinc-600" />
              <span>Applications In Pipeline ({filteredApps.length})</span>
            </CardTitle>
            <span className="text-xs text-zinc-400">Target intake: 60 per intake cycle</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                <TableHead className="w-28 text-[11px]">App No.</TableHead>
                <TableHead className="text-[11px]">Candidate</TableHead>
                <TableHead className="text-[11px]">Applied Grade</TableHead>
                <TableHead className="text-[11px]">Guardian Details</TableHead>
                <TableHead className="text-[11px]">Submission</TableHead>
                <TableHead className="text-[11px]">Current Stage</TableHead>
                <TableHead className="text-[11px]">Status</TableHead>
                <TableHead className="text-right text-[11px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-zinc-500 text-xs">
                    {search || stageFilter !== 'All'
                      ? 'No applications match your filter criteria.'
                      : 'No admission applications received yet. Public enquiries submitted via the admissions portal will appear here in real-time.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredApps.map((app) => (
                  <TableRow key={app.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                    <TableCell className="font-mono text-zinc-600 font-semibold">{app.applicationNo}</TableCell>
                    <TableCell className="font-bold text-zinc-950">{app.candidateName}</TableCell>
                    <TableCell className="text-zinc-700">{app.appliedGrade}</TableCell>
                    <TableCell className="text-zinc-600">
                      <div>{app.guardianName}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{app.guardianPhone}</div>
                    </TableCell>
                    <TableCell className="text-zinc-500 font-mono text-[11px]">{app.submissionDate}</TableCell>
                    <TableCell>
                      <Badge variant="zinc" className="text-[10px]">
                        {app.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={app.status === 'Approved' ? 'dark' : 'outline'} className="text-[10px]">
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="monochromeOutline"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                        className="h-7 text-xs px-2.5 rounded-md"
                      >
                        <FileCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Review</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Review Dialog */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <DialogContent className="max-w-md border-zinc-200">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="dark" className="text-[10px] font-mono">
                  {selectedApp.applicationNo}
                </Badge>
                <Badge variant="zinc" className="text-[10px]">
                  {selectedApp.stage}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-zinc-950 mt-1">
                {selectedApp.candidateName}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Applied for {selectedApp.appliedGrade} • Submitted on {selectedApp.submissionDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Guardian Information</span>
                <p className="font-medium text-zinc-900">{selectedApp.guardianName} ({selectedApp.guardianPhone})</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Verification Notes</span>
                <p className="text-zinc-600 leading-relaxed">{selectedApp.notes}</p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="monochromeOutline"
                size="sm"
                onClick={() => setSelectedApp(null)}
                disabled={isUpdatingStage}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={handleStageAdvance}
                disabled={isUpdatingStage}
                className="text-xs"
              >
                {isUpdatingStage ? 'Updating Stage...' : 'Approve & Advance Stage'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
