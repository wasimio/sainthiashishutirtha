'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Eye,
  Users,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  getStudents,
  registerStudent,
  getAcademicYears,
  getSections,
  type EnrolledStudentDetail,
  type AcademicYearRow,
  type SectionRow,
  type ClassRow
} from '@/lib/services/adminService';
import { Card } from '@/components/ui/card';
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

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<EnrolledStudentDetail[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearRow[]>([]);
  const [sections, setSections] = useState<(SectionRow & { class?: ClassRow })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<EnrolledStudentDetail | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [scholarId, setScholarId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('2019-01-01');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [academicYearId, setAcademicYearId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [rollNumber, setRollNumber] = useState<number>(1);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianRelation, setGuardianRelation] = useState<'Father' | 'Mother' | 'Legal Guardian' | 'Grandparent' | 'Other'>('Father');
  const [guardianAddress, setGuardianAddress] = useState('Sainthia, Birbhum');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const refreshData = () => {
    Promise.all([
      getStudents(),
      getAcademicYears(),
      getSections(),
    ])
      .then(([studentsData, yearsData, sectionsData]) => {
        setStudents(studentsData);
        setAcademicYears(yearsData);
        setSections(sectionsData);
        if (yearsData.length > 0) {
          const current = yearsData.find((y) => y.is_current) || yearsData[0];
          setAcademicYearId(current.id);
        }
        if (sectionsData.length > 0) {
          setSectionId(sectionsData[0].id);
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load students.';
        setToastMessage(`Error: ${message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getStudents(),
      getAcademicYears(),
      getSections(),
    ])
      .then(([studentsData, yearsData, sectionsData]) => {
        if (isMounted) {
          setStudents(studentsData);
          setAcademicYears(yearsData);
          setSections(sectionsData);
          if (yearsData.length > 0) {
            const current = yearsData.find((y) => y.is_current) || yearsData[0];
            setAcademicYearId(current.id);
          }
          if (sectionsData.length > 0) {
            setSectionId(sectionsData[0].id);
          }
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load students.';
          setToastMessage(`Error: ${message}`);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenRegister = () => {
    // Generate suggested scholar ID
    const year = new Date().getFullYear();
    const count = students.length + 1;
    setScholarId(`ST-${year}-${String(count).padStart(4, '0')}`);
    setRollNumber(count);
    setFormError(null);
    setIsRegisterOpen(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!firstName.trim() || !lastName.trim() || !scholarId.trim()) {
      setFormError('First Name, Last Name, and Scholar ID are required.');
      return;
    }
    if (!guardianName.trim() || !guardianPhone.trim()) {
      setFormError('Guardian Name and Primary Phone are required.');
      return;
    }
    if (!academicYearId || !sectionId) {
      setFormError('Please select both an Academic Year and a Section.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent({
        scholarId,
        firstName,
        lastName,
        gender,
        dateOfBirth: dob,
        bloodGroup,
        academicYearId,
        sectionId,
        rollNumber: Number(rollNumber),
        guardianName,
        guardianPhone,
        guardianRelation,
        guardianAddress,
        emergencyPhone: emergencyPhone || guardianPhone,
        medicalNotes,
      });

      setToastMessage(`Scholar ${firstName} ${lastName} (${scholarId}) successfully registered.`);
      setIsRegisterOpen(false);
      // Reset form
      setFirstName('');
      setLastName('');
      setGuardianName('');
      setGuardianPhone('');
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      s.scholar_id.toLowerCase().includes(search.toLowerCase()) ||
      (s.primaryGuardian?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Student Records
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              {students.length} Registered Scholars • Production Database
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Student Information System (SIS)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Authoritative scholar master roster, guardian emergency contacts, cohort enrollment, and academic status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="text-xs h-8 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="dark"
            size="sm"
            onClick={handleOpenRegister}
            className="text-xs h-8 gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register Scholar</span>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by scholar ID, name, or guardian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-white border border-zinc-200 rounded-md text-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
          >
            <option value="All">All Statuses</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Under Review">Under Review</option>
            <option value="TC Issued">TC Issued</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
      </div>

      {/* 3. Main Student Table or Honest Empty State */}
      <Card className="border-zinc-200/90 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-[#308599]" />
            Loading scholars from database...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-900">
                {students.length === 0 ? 'No Scholars Registered' : 'No Matching Scholars Found'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {students.length === 0
                  ? 'Your student database has zero enrolled scholars. Click the button below to register the first scholar into an academic cohort.'
                  : 'Try adjusting your search criteria or status filter.'}
              </p>
            </div>
            {students.length === 0 && (
              <Button
                variant="dark"
                size="sm"
                onClick={handleOpenRegister}
                className="text-xs gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register First Scholar</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50">
                  <TableHead className="text-xs font-semibold">Scholar ID</TableHead>
                  <TableHead className="text-xs font-semibold">Student Name</TableHead>
                  <TableHead className="text-xs font-semibold">Class / Section</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Roll</TableHead>
                  <TableHead className="text-xs font-semibold">Primary Guardian</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((st) => (
                  <TableRow key={st.id} className="hover:bg-zinc-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-zinc-900">
                      {st.scholar_id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-xs text-zinc-950">
                        {st.first_name} {st.last_name}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {st.gender} • DOB: {st.date_of_birth}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-700">
                      {st.enrollment?.className ? (
                        <span>
                          {st.enrollment.className} ({st.enrollment.sectionName})
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic">Not Enrolled</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-center text-zinc-700">
                      {st.enrollment?.rollNumber ?? '—'}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="text-zinc-900 font-medium">
                        {st.primaryGuardian?.name || 'Not Recorded'}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {st.primaryGuardian?.phone || 'No phone'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={st.status === 'Enrolled' ? 'secondary' : 'outline'}
                        className="text-[10px]"
                      >
                        {st.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStudent(st)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* 4. Registration Dialog Modal */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950">
              Register New Scholar
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Creates a master scholar record, sets primary guardian contact, and enrolls student into an active cohort.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            {/* Section A: Scholar Identity */}
            <div className="space-y-2 border-b border-zinc-100 pb-3">
              <span className="font-bold text-zinc-900 block uppercase tracking-wider text-[10px]">
                A. Scholar Identity
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Scholar / Admission No *
                  </label>
                  <Input
                    value={scholarId}
                    onChange={(e) => setScholarId(e.target.value)}
                    placeholder="e.g. ST-2026-0001"
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="h-8 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full h-8 px-2 text-xs bg-white border border-zinc-200 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Date of Birth *
                  </label>
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full h-8 px-2 text-xs bg-white border border-zinc-200 rounded-md"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section B: Academic Placement */}
            <div className="space-y-2 border-b border-zinc-100 pb-3">
              <span className="font-bold text-zinc-900 block uppercase tracking-wider text-[10px]">
                B. Cohort Placement & Academic Year
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Academic Year *
                  </label>
                  {academicYears.length === 0 ? (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      No years configured. Please add an Academic Year in Academics tab first.
                    </div>
                  ) : (
                    <select
                      value={academicYearId}
                      onChange={(e) => setAcademicYearId(e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-zinc-200 rounded-md"
                      required
                    >
                      {academicYears.map((y) => (
                        <option key={y.id} value={y.id}>
                          {y.name} {y.is_current ? '(Active)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Class & Section *
                  </label>
                  {sections.length === 0 ? (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      No sections available. Configure classes and sections first.
                    </div>
                  ) : (
                    <select
                      value={sectionId}
                      onChange={(e) => setSectionId(e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-zinc-200 rounded-md"
                      required
                    >
                      {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          {sec.class?.name || 'Class'} — {sec.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Roll Number *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={rollNumber}
                    onChange={(e) => setRollNumber(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section C: Guardian & Contact Information */}
            <div className="space-y-2 border-b border-zinc-100 pb-3">
              <span className="font-bold text-zinc-900 block uppercase tracking-wider text-[10px]">
                C. Primary Guardian & Emergency Contact
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Guardian Name *
                  </label>
                  <Input
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Full guardian name"
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Primary Phone (WhatsApp) *
                  </label>
                  <Input
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="+91 94340 XXXXX"
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value as 'Father' | 'Mother' | 'Legal Guardian' | 'Grandparent' | 'Other')}
                    className="w-full h-8 px-2 text-xs bg-white border border-zinc-200 rounded-md"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Residential Address
                  </label>
                  <Input
                    value={guardianAddress}
                    onChange={(e) => setGuardianAddress(e.target.value)}
                    placeholder="Sainthia town address"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                    Emergency Secondary Phone
                  </label>
                  <Input
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Optional alternate phone"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section D: Medical & Special Notes */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-zinc-700">
                Medical Notes / Allergies (Optional)
              </label>
              <Input
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Any special medical conditions, allergies, or instructions"
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRegisterOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark"
                size="sm"
                disabled={isSubmitting || academicYears.length === 0 || sections.length === 0}
                className="text-xs gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm & Enroll</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. Student Details Modal */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedStudent.scholar_id}
                </Badge>
                <Badge
                  variant={selectedStudent.status === 'Enrolled' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {selectedStudent.status}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-zinc-950 mt-1">
                {selectedStudent.first_name} {selectedStudent.last_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Registered on {new Date(selectedStudent.created_at).toLocaleDateString('en-IN')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5">
                <span className="font-semibold text-zinc-900 block text-[11px] uppercase tracking-wider">
                  Academic Cohort
                </span>
                <div className="flex justify-between text-zinc-700">
                  <span>Class & Section:</span>
                  <span className="font-medium text-zinc-900">
                    {selectedStudent.enrollment?.className || 'N/A'} ({selectedStudent.enrollment?.sectionName || 'N/A'})
                  </span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Roll Number:</span>
                  <span className="font-mono font-medium text-zinc-900">
                    {selectedStudent.enrollment?.rollNumber ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Academic Session:</span>
                  <span className="font-medium text-zinc-900">
                    {selectedStudent.enrollment?.academicYearName || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5">
                <span className="font-semibold text-zinc-900 block text-[11px] uppercase tracking-wider">
                  Primary Guardian
                </span>
                <div className="flex justify-between text-zinc-700">
                  <span>Guardian Name:</span>
                  <span className="font-medium text-zinc-900">
                    {selectedStudent.primaryGuardian?.name || 'Not Recorded'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Relationship:</span>
                  <span className="font-medium text-zinc-900">
                    {selectedStudent.primaryGuardian?.relationship || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Primary Phone:</span>
                  <span className="font-mono text-zinc-900 font-medium">
                    {selectedStudent.primaryGuardian?.phone || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5">
                <span className="font-semibold text-zinc-900 block text-[11px] uppercase tracking-wider">
                  Personal & Emergency
                </span>
                <div className="flex justify-between text-zinc-700">
                  <span>Gender:</span>
                  <span className="text-zinc-900">{selectedStudent.gender}</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Date of Birth:</span>
                  <span className="text-zinc-900">{selectedStudent.date_of_birth}</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Blood Group:</span>
                  <span className="font-mono text-zinc-900">{selectedStudent.blood_group || 'Not Tested'}</span>
                </div>
                {selectedStudent.medical_notes && (
                  <div className="pt-1 text-zinc-600 border-t border-zinc-200/60 mt-1">
                    <span className="font-medium text-zinc-900">Medical Notes:</span> {selectedStudent.medical_notes}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStudent(null)}
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
