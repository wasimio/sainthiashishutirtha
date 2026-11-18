'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Layers,
  BookOpen,
  PlusCircle,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
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
import {
  getAcademicYears,
  getClasses,
  getSections,
  getSubjects,
  createAcademicYear,
  createClass,
  createSection,
  createSubject,
  AcademicYearRow,
  ClassRow,
  SectionRow,
  SubjectRow,
} from '@/lib/services/adminService';

type TabView = 'classes' | 'subjects' | 'years';

export default function AdminAcademicsPage() {
  const [activeTab, setActiveTab] = useState<TabView>('classes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [academicYears, setAcademicYears] = useState<AcademicYearRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);

  // Dialog states
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states - Academic Year
  const [yearName, setYearName] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [yearIsCurrent, setYearIsCurrent] = useState(true);

  // Form states - Class
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [classWing, setClassWing] = useState<'Early Childhood' | 'Pre-Primary' | 'Junior Primary' | 'Senior Primary'>('Junior Primary');
  const [classOrder, setClassOrder] = useState<number>(1);

  // Form states - Section
  const [sectionName, setSectionName] = useState('A');
  const [sectionClassId, setSectionClassId] = useState('');
  const [sectionCapacity, setSectionCapacity] = useState(35);
  const [sectionRoom, setSectionRoom] = useState('');

  // Form states - Subject
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subDesc, setSubDesc] = useState('');

  const refreshData = () => {
    Promise.all([
      getAcademicYears(),
      getClasses(),
      getSections(),
      getSubjects(),
    ])
      .then(([yearsData, classesData, sectionsData, subjectsData]) => {
        setAcademicYears(yearsData);
        setClasses(classesData);
        setSections(sectionsData);
        setSubjects(subjectsData);
        if (classesData.length > 0) {
          setSectionClassId((prev) => prev || classesData[0].id);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to query academic configuration.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getAcademicYears(),
      getClasses(),
      getSections(),
      getSubjects(),
    ])
      .then(([yearsData, classesData, sectionsData, subjectsData]) => {
        if (isMounted) {
          setAcademicYears(yearsData);
          setClasses(classesData);
          setSections(sectionsData);
          setSubjects(subjectsData);
          if (classesData.length > 0) {
            setSectionClassId((prev) => prev || classesData[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to load academic data:', err);
          setError(err instanceof Error ? err.message : 'Failed to query academic configuration.');
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

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearName.trim() || !yearStart || !yearEnd) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      await createAcademicYear({
        name: yearName.trim(),
        startDate: yearStart,
        endDate: yearEnd,
        isCurrent: yearIsCurrent,
      });
      showToast(`Academic Year "${yearName}" successfully configured.`);
      setIsYearModalOpen(false);
      setYearName('');
      setYearStart('');
      setYearEnd('');
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating academic year.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !classCode.trim()) {
      alert('Please fill out name and code.');
      return;
    }
    try {
      setSubmitting(true);
      await createClass({
        name: className.trim(),
        code: classCode.trim(),
        wing: classWing,
        displayOrder: Number(classOrder) || 1,
      });
      showToast(`Class "${className}" created successfully.`);
      setIsClassModalOpen(false);
      setClassName('');
      setClassCode('');
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating class.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentYear = academicYears.find((y) => y.is_current) || academicYears[0];
    if (!currentYear) {
      alert('You must have at least one Academic Year configured before adding sections.');
      return;
    }
    if (!sectionClassId) {
      alert('Please select a target class.');
      return;
    }
    try {
      setSubmitting(true);
      await createSection({
        classId: sectionClassId,
        academicYearId: currentYear.id,
        name: sectionName.trim(),
        capacity: Number(sectionCapacity) || 35,
        roomNumber: sectionRoom.trim() || undefined,
      });
      showToast(`Section "${sectionName}" added successfully.`);
      setIsSectionModalOpen(false);
      setSectionName('A');
      setSectionRoom('');
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating section.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) {
      alert('Please provide subject name and code.');
      return;
    }
    try {
      setSubmitting(true);
      await createSubject({
        name: subName.trim(),
        code: subCode.trim(),
        description: subDesc.trim() || undefined,
      });
      showToast(`Curriculum Subject "${subName}" added.`);
      setIsSubjectModalOpen(false);
      setSubName('');
      setSubCode('');
      setSubDesc('');
      refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating subject.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = academicYears.find((y) => y.is_current);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Curriculum Architecture
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              {currentYear ? `Active Session: ${currentYear.name}` : 'No Active Session Set'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Academic Architecture & Classes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Structure of grade divisions, sections, academic sessions, and institutional curriculum standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={() => setIsYearModalOpen(true)}
            className="text-xs h-8 gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
            <span>+ Academic Year</span>
          </Button>

          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={() => setIsClassModalOpen(true)}
            className="text-xs h-8 gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-600" />
            <span>+ Class</span>
          </Button>

          <Button
            variant="dark"
            size="sm"
            onClick={() => {
              if (classes.length === 0) {
                alert('Please create at least one Class before adding a Section.');
                return;
              }
              setIsSectionModalOpen(true);
            }}
            className="text-xs h-8 gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Section</span>
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

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-semibold block">Academic Configuration Warning</span>
            <p className="text-amber-700 text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('classes')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'classes'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Classes & Sections ({classes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'subjects'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Curriculum Subjects ({subjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('years')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'years'
              ? 'bg-zinc-950 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          Academic Sessions ({academicYears.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
          <p className="text-xs">Loading curriculum and grade hierarchy...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: Classes & Sections */}
          {activeTab === 'classes' && (
            <div className="space-y-4">
              {classes.length === 0 ? (
                <Card className="border-dashed border-2 border-zinc-200">
                  <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">No Grade Classes Configured Yet</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
                      Sainthia Shishutirtha accommodates Nursery through Class IV. Begin by defining your classes and adding class sections.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => setIsClassModalOpen(true)}
                        className="text-xs"
                      >
                        + Create First Class
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {classes.map((cls) => {
                    const classSections = sections.filter((s) => s.class_id === cls.id);
                    const totalCapacity = classSections.reduce((acc, s) => acc + (s.capacity || 0), 0);

                    return (
                      <Card key={cls.id} className="border-zinc-200/90 shadow-xs flex flex-col justify-between">
                        <CardHeader className="pb-3 border-b border-zinc-100">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="zinc" className="text-[10px]">
                              {cls.wing}
                            </Badge>
                            <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                              Code: {cls.code}
                            </span>
                          </div>
                          <CardTitle className="text-base font-bold text-zinc-950 mt-1">
                            {cls.name}
                          </CardTitle>
                          <CardDescription className="text-xs text-zinc-500">
                            Sequence Priority: #{cls.display_order}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-3 space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-zinc-500">Allocated Sections</span>
                              <span className="font-semibold text-zinc-900 font-mono">
                                {classSections.length} {classSections.length === 1 ? 'Section' : 'Sections'}
                              </span>
                            </div>
                            {classSections.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {classSections.map((sec) => (
                                  <span
                                    key={sec.id}
                                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 border border-zinc-200 text-zinc-800"
                                  >
                                    Sec {sec.name} {sec.room_number ? `(${sec.room_number})` : ''} • Cap: {sec.capacity}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-zinc-400 italic">No sections created for this grade yet.</p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                            <span>Total Grade Capacity</span>
                            <span className="font-semibold text-zinc-900 font-mono">{totalCapacity} Seats</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Curriculum Subjects */}
          {activeTab === 'subjects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-600">
                  Official subjects taught across Nursery, Kindergarten, and Primary divisions.
                </p>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => setIsSubjectModalOpen(true)}
                  className="text-xs h-8 gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>+ Add Subject</span>
                </Button>
              </div>

              {subjects.length === 0 ? (
                <Card className="border-dashed border-2 border-zinc-200">
                  <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                    <BookOpen className="w-8 h-8 text-zinc-400 mb-2" />
                    <h3 className="text-sm font-bold text-zinc-900">No Subjects Registered</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
                      Add foundational curriculum subjects such as Bengali (সহজ পাঠ), English, Arithmetic, and Environmental Studies.
                    </p>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => setIsSubjectModalOpen(true)}
                      className="text-xs"
                    >
                      + Add First Subject
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subjects.map((sub) => (
                    <Card key={sub.id} className="border-zinc-200/90 shadow-xs">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="zinc" className="text-[10px] font-mono">
                            {sub.code}
                          </Badge>
                          {sub.is_active && (
                            <span className="flex items-center text-[10px] text-emerald-600 font-medium gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-sm font-bold text-zinc-950 mt-1">
                          {sub.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-1 text-xs text-zinc-500">
                        {sub.description || 'Core curriculum foundation subject.'}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Academic Sessions */}
          {activeTab === 'years' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-600">
                  Master calendar sessions determining student enrollments, attendance, and fee terms.
                </p>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => setIsYearModalOpen(true)}
                  className="text-xs h-8 gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>+ New Session</span>
                </Button>
              </div>

              {academicYears.length === 0 ? (
                <Card className="border-dashed border-2 border-zinc-200">
                  <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                    <Calendar className="w-8 h-8 text-zinc-400 mb-2" />
                    <h3 className="text-sm font-bold text-zinc-900">No Academic Years Configured</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
                      Create an academic session (e.g. 2026–2027) to activate student enrollments and fee schedules.
                    </p>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => setIsYearModalOpen(true)}
                      className="text-xs"
                    >
                      + Create Academic Year
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {academicYears.map((yr) => (
                    <Card key={yr.id} className={`border ${yr.is_current ? 'border-zinc-900 bg-zinc-50/50' : 'border-zinc-200'}`}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base font-bold text-zinc-950">
                            {yr.name}
                          </CardTitle>
                          {yr.is_current && (
                            <Badge variant="dark" className="text-[10px]">
                              Current Active
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 text-xs space-y-1 text-zinc-600">
                        <div>
                          <span className="text-zinc-400">Duration: </span>
                          <span className="font-mono text-zinc-900">{yr.start_date}</span> to <span className="font-mono text-zinc-900">{yr.end_date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL 1: Create Academic Year */}
      <Dialog open={isYearModalOpen} onOpenChange={setIsYearModalOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleCreateYear}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Create Academic Year</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Define the annual school session for admissions, attendance, and fee collections.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Session Name *</label>
                <Input
                  value={yearName}
                  onChange={(e) => setYearName(e.target.value)}
                  placeholder="e.g. 2026–2027"
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Start Date *</label>
                  <Input
                    type="date"
                    value={yearStart}
                    onChange={(e) => setYearStart(e.target.value)}
                    required
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">End Date *</label>
                  <Input
                    type="date"
                    value={yearEnd}
                    onChange={(e) => setYearEnd(e.target.value)}
                    required
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="yearCurrentCheck"
                  checked={yearIsCurrent}
                  onChange={(e) => setYearIsCurrent(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                />
                <label htmlFor="yearCurrentCheck" className="text-xs text-zinc-700 font-medium">
                  Set as Current Active Session
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsYearModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Session
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Create Class */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleCreateClass}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Add Grade Class</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Register a new instructional grade division into the curriculum ladder.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Class Name *</label>
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Class I or Nursery"
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Code *</label>
                  <Input
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="e.g. CLS-1"
                    required
                    className="h-8 text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Display Order</label>
                  <Input
                    type="number"
                    value={classOrder}
                    onChange={(e) => setClassOrder(Number(e.target.value))}
                    min={1}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Wing</label>
                <select
                  value={classWing}
                  onChange={(e) => setClassWing(e.target.value as 'Early Childhood' | 'Pre-Primary' | 'Junior Primary' | 'Senior Primary')}
                  className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                >
                  <option value="Early Childhood">Early Childhood (Nursery)</option>
                  <option value="Pre-Primary">Pre-Primary (KG-I & KG-II)</option>
                  <option value="Junior Primary">Junior Primary (Class I & II)</option>
                  <option value="Senior Primary">Senior Primary (Class III & IV)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsClassModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Class
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Create Section */}
      <Dialog open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleCreateSection}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Add Class Section</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Divide a grade into manageable classroom sections (e.g. Section A, Section B).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Target Class *</label>
                <select
                  value={sectionClassId}
                  onChange={(e) => setSectionClassId(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.wing})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Section Identifier *</label>
                  <Input
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    placeholder="e.g. A"
                    required
                    className="h-8 text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Seat Capacity</label>
                  <Input
                    type="number"
                    value={sectionCapacity}
                    onChange={(e) => setSectionCapacity(Number(e.target.value))}
                    min={5}
                    max={80}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Room Number / Wing</label>
                <Input
                  value={sectionRoom}
                  onChange={(e) => setSectionRoom(e.target.value)}
                  placeholder="e.g. Room 102, Ground Floor"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsSectionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Section
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Create Subject */}
      <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
        <DialogContent className="max-w-md border-zinc-200">
          <form onSubmit={handleCreateSubject}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-zinc-950">Add Curriculum Subject</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Register a foundational study subject into the institutional syllabus repository.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Subject Name *</label>
                <Input
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Bengali Literature (সহজ পাঠ)"
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Subject Code *</label>
                <Input
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  placeholder="e.g. BEN-101"
                  required
                  className="h-8 text-xs uppercase"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Curriculum Notes / Syllabus Description</label>
                <textarea
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  rows={3}
                  placeholder="Key concepts, literature textbooks, or activity focus..."
                  className="w-full text-xs rounded-md border border-zinc-200 bg-white p-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="monochromeOutline" size="sm" onClick={() => setIsSubjectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" size="sm" disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Save Subject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
