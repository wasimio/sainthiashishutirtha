'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  SlidersHorizontal,
  GraduationCap,
  Loader2,
  AlertCircle
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getStaffMembers,
  getProfiles,
  addStaffMember,
  StaffProfileRow,
  ProfileRow,
} from '@/lib/services/adminService';

type EnrichedStaff = StaffProfileRow & { profile?: ProfileRow };

export default function AdminFacultyPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [staffList, setStaffList] = useState<EnrichedStaff[]>([]);
  const [availableProfiles, setAvailableProfiles] = useState<ProfileRow[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<EnrichedStaff | null>(null);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('Primary Academics');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(3);

  const refreshData = () => {
    Promise.all([
      getStaffMembers(),
      getProfiles(),
    ])
      .then(([staffData, allProfiles]) => {
        setStaffList(staffData);
        setAvailableProfiles(allProfiles);
        if (allProfiles.length > 0) {
          setSelectedProfileId((prev) => prev || allProfiles[0].id);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to query staff profiles.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getStaffMembers(),
      getProfiles(),
    ])
      .then(([staffData, allProfiles]) => {
        if (isMounted) {
          setStaffList(staffData);
          setAvailableProfiles(allProfiles);
          if (allProfiles.length > 0) {
            setSelectedProfileId((prev) => prev || allProfiles[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to query faculty records:', err);
          setError(err instanceof Error ? err.message : 'Failed to query staff profiles.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId || !employeeId.trim() || !designation.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await addStaffMember({
        profileId: selectedProfileId,
        employeeId: employeeId.trim(),
        designation: designation.trim(),
        department: department.trim() || undefined,
        qualification: qualification.trim() || undefined,
        experienceYears: Number(experienceYears) || 0,
      });

      showToast(`Faculty member "${designation}" successfully onboarded.`);
      setIsAddModalOpen(false);
      setEmployeeId('');
      setDesignation('');
      setQualification('');
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create staff profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStaff = staffList.filter((fac) => {
    const name = fac.profile?.full_name || '';
    const empId = fac.employee_id || '';
    const desig = fac.designation || '';
    const dept = fac.department || '';
    const q = search.toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      empId.toLowerCase().includes(q) ||
      desig.toLowerCase().includes(q) ||
      dept.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Staff Management
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              {staffList.length} Authorized Teaching & Administrative Personnel
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Faculty Directory & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Teaching assignments, staff designations, verified qualifications, and portal authorization keys.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={() => {
            if (availableProfiles.length === 0) {
              alert('No registered user accounts found in profiles to associate as staff.');
              return;
            }
            setIsAddModalOpen(true);
          }}
          className="text-xs h-8 gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Faculty Member</span>
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

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-semibold block">Faculty Directory Sync Alert</span>
            <p className="text-amber-700 text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by teacher name, ID, or designation..."
          className="pl-9 h-9 text-xs border-zinc-200"
        />
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
          <p className="text-xs">Querying faculty directory records...</p>
        </div>
      ) : staffList.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">No Faculty Profiles Registered Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
              The faculty directory currently has 0 staff profiles in the database. Onboard teachers from registered accounts to assign mentor roles and subjects.
            </p>
            <Button
              variant="dark"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs"
            >
              + Onboard First Faculty Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zinc-200/90 shadow-xs">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Authorized Faculty & Leadership Accounts
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Active staff credentials for classroom attendance, diary notices, and assessment marks entry.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/70 border-b border-zinc-200">
                  <TableHead className="w-28 text-[11px]">Staff ID</TableHead>
                  <TableHead className="text-[11px]">Name & Designation</TableHead>
                  <TableHead className="text-[11px]">Department</TableHead>
                  <TableHead className="text-[11px]">Qualification</TableHead>
                  <TableHead className="text-[11px]">Experience</TableHead>
                  <TableHead className="text-right text-[11px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((fac) => (
                  <TableRow key={fac.profile_id} className="border-b border-zinc-100 hover:bg-zinc-50/50 text-xs">
                    <TableCell className="font-mono font-medium text-zinc-500">{fac.employee_id}</TableCell>
                    <TableCell>
                      <div className="font-bold text-zinc-950">{fac.profile?.full_name || 'Unnamed Staff'}</div>
                      <div className="text-[10px] text-zinc-500">{fac.designation}</div>
                    </TableCell>
                    <TableCell className="text-zinc-700 font-medium">{fac.department || 'General Academics'}</TableCell>
                    <TableCell className="text-zinc-600">{fac.qualification || 'Recorded in dossier'}</TableCell>
                    <TableCell className="text-zinc-500 font-mono text-[11px]">
                      {fac.experience_years ? `${fac.experience_years} Years` : 'Fresh'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="monochromeOutline"
                        size="sm"
                        onClick={() => setSelectedStaff(fac)}
                        className="h-7 text-xs px-2.5 rounded-md"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                        <span>Manage</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MODAL: Onboard Staff Member */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleAddStaff}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Add Faculty Member</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Link an institutional user account to an official employee faculty profile.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Select User Account *</label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  required
                >
                  {availableProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.email}) — [{p.role.toUpperCase()}]
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Only registered auth accounts can be linked as faculty profiles.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Employee ID *</label>
                  <Input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. ST-FAC-01"
                    required
                    className="h-8 text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Experience (Years)</label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    min={0}
                    max={50}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Official Designation *</label>
                <Input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Primary Assistant Teacher"
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Department</label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Primary Academics / Science Wing"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Educational Qualification</label>
                <Input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. M.A., B.Ed. (Visva-Bharati)"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Faculty Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: Faculty Details / Manage */}
      {selectedStaff && (
        <Dialog open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
          <DialogContent className="max-w-md border-zinc-200">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="dark" className="text-[10px] font-mono">
                  {selectedStaff.employee_id}
                </Badge>
                <Badge variant="zinc" className="text-[10px]">
                  {selectedStaff.department || 'General'}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-zinc-950 mt-1">
                {selectedStaff.profile?.full_name || 'Staff Member'}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                {selectedStaff.designation}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-700">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Email</span>
                  <span className="font-medium text-zinc-900">{selectedStaff.profile?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Phone</span>
                  <span className="font-medium font-mono text-zinc-900">
                    {selectedStaff.profile?.phone || 'Not recorded'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Qualification</span>
                  <span className="font-medium text-zinc-900">{selectedStaff.qualification || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Experience</span>
                  <span className="font-medium text-zinc-900">{selectedStaff.experience_years || 0} Years</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500">
                Authorized for attendance submission, syllabus tracking, and student evaluations.
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="monochromeOutline"
                size="sm"
                onClick={() => setSelectedStaff(null)}
                className="text-xs"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
