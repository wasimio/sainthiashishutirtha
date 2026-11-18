'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Globe,
  Mail,
  ClipboardList,
  Settings,
  ExternalLink,
  FileText
} from 'lucide-react';
import { getAdminDashboardTelemetry, type AdminDashboardTelemetry } from '@/lib/services/adminService';
import { getCmsDashboardTelemetry, type CmsDashboardTelemetry } from '@/lib/actions/cmsDashboardActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AdminCommandDialog from '@/components/portal/admin/AdminCommandDialog';

export default function AdminOverviewPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [telemetry, setTelemetry] = useState<AdminDashboardTelemetry | null>(null);
  const [cmsTelemetry, setCmsTelemetry] = useState<CmsDashboardTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTelemetry = () => {
    setIsLoading(true);
    setError(null);
    Promise.all([
      getAdminDashboardTelemetry(),
      getCmsDashboardTelemetry()
    ])
      .then(([sysData, cmsRes]) => {
        setTelemetry(sysData);
        if (cmsRes.success && cmsRes.data) {
          setCmsTelemetry(cmsRes.data);
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to connect to database.';
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getAdminDashboardTelemetry(),
      getCmsDashboardTelemetry()
    ])
      .then(([sysData, cmsRes]) => {
        if (isMounted) {
          setTelemetry(sysData);
          if (cmsRes.success && cmsRes.data) {
            setCmsTelemetry(cmsRes.data);
          }
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to connect to database.';
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN');

  const cmsShortcuts = [
    {
      title: 'Website Notices & Bulletins',
      subtitle: cmsTelemetry
        ? `${cmsTelemetry.notices.published} Published • ${cmsTelemetry.notices.draft} Drafts`
        : 'Official circulars and holiday lists',
      href: '/portal/admin/website',
      icon: Globe,
    },
    {
      title: 'Admissions Pipeline',
      subtitle: cmsTelemetry
        ? `${cmsTelemetry.admissions.pendingReview} Pending • ${cmsTelemetry.admissions.total} Total`
        : 'Candidate verification and enrollment',
      href: '/portal/admin/admissions',
      icon: ClipboardList,
    },
    {
      title: 'Institutional Settings & Hours',
      subtitle: cmsTelemetry?.schoolSettings.isConfigured
        ? `${cmsTelemetry.schoolSettings.schoolName} (UDISE: ${cmsTelemetry.schoolSettings.udiseCode})`
        : 'Timings, affiliation, and contacts',
      href: '/portal/admin/settings',
      icon: Settings,
    },
    {
      title: 'Public School Website',
      subtitle: 'Visit live public portal & noticeboard',
      href: '/',
      icon: ExternalLink,
      external: true,
    },
  ];

  const adminShortcuts = [
    {
      title: 'Student Directory',
      subtitle: telemetry ? `${telemetry.totalStudents} Enrolled scholars` : 'Loading scholars...',
      href: '/portal/admin/students',
      icon: Users,
    },
    {
      title: 'Academic Structure',
      subtitle: telemetry ? `${telemetry.totalClasses} Classes • ${telemetry.totalSections} Sections` : 'Class standard setup',
      href: '/portal/admin/academics',
      icon: Layers,
    },
    {
      title: 'Staff & Mentors',
      subtitle: telemetry ? `${telemetry.totalStaff} Faculty members` : 'Staff roster',
      href: '/portal/admin/faculty',
      icon: GraduationCap,
    },
    {
      title: 'Treasury & Fee Ledger',
      subtitle: telemetry ? `${formatCurrency(telemetry.totalCollections)} Collected` : 'Fee collections',
      href: '/portal/admin/finance',
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5">
              Admin & Council
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Sainthia Shishutirtha • Production Database
            </span>
            {telemetry?.currentAcademicYearName && (
              <>
                <span className="text-zinc-300">•</span>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-800 bg-emerald-50">
                  Session: {telemetry.currentAcademicYearName}
                </Badge>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            Institutional Control Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl">
            Authoritative administrative telemetry, student strength, academic year hierarchy, fee ledgers, and governance oversight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="monochromeOutline"
            size="sm"
            onClick={refreshTelemetry}
            disabled={isLoading}
            className="text-xs gap-1.5 h-8 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live Telemetry</span>
          </Button>

          <Button
            variant="dark"
            size="sm"
            onClick={() => setIsCommandOpen(true)}
            className="text-xs gap-1.5 h-8 font-medium"
          >
            <span>Command Palette</span>
            <kbd className="hidden sm:inline-block px-1 py-0 text-[10px] font-mono text-zinc-400 bg-zinc-800 rounded">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Database Access Notice</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* 2. Key Performance Indicators (Real Telemetry) */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Students */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Enrolled Scholars
              </span>
              <div className="p-2 bg-[#308599]/10 text-[#308599] rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-zinc-950">
                {isLoading ? '...' : telemetry?.totalStudents ?? 0}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {telemetry?.totalStudents === 0 ? 'No students enrolled yet' : 'Active scholars across all sections'}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Faculty */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Teaching & Staff
              </span>
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <GraduationCap className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-zinc-950">
                {isLoading ? '...' : telemetry?.totalStaff ?? 0}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {telemetry?.totalStaff === 0 ? 'No faculty records created' : 'Assigned faculty & coordinators'}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Classes & Sections */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Academic Tiers
              </span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-zinc-950">
                {isLoading ? '...' : `${telemetry?.totalClasses ?? 0} Classes`}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {telemetry?.totalSections ?? 0} cohorts / classroom sections configured
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Fee Realization */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Fee Treasury
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <CreditCard className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-zinc-950">
                {isLoading ? '...' : formatCurrency(telemetry?.totalCollections ?? 0)}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {telemetry?.totalCollections === 0 ? 'Zero fee receipts recorded' : 'Cumulative verified collections'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2B. Website CMS & Public Intake Telemetry */}
      <section aria-label="Website CMS and Public Intake Telemetry">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Website CMS & Public Intake Telemetry
            </h2>
            <p className="text-xs text-zinc-500">
              Live database telemetry for public circulars, admissions pipeline, enquiries, and school metadata.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-[#308599] hover:text-[#236877] font-semibold h-7"
          >
            <Link href="/portal/admin/website">
              <span>Open CMS Hub</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Official Notices */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all bg-white">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Official Notices
              </span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-zinc-950">
                {isLoading ? '...' : `${cmsTelemetry?.notices.published ?? 0} Live`}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {cmsTelemetry ? `${cmsTelemetry.notices.total} total (${cmsTelemetry.notices.draft} drafts, ${cmsTelemetry.notices.archived} archived)` : 'Loading notices...'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <Link href="/portal/admin/website" className="text-[#308599] font-medium hover:underline flex items-center gap-1">
                  <span>Manage Notices</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/notices" target="_blank" className="text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                  <span>Public View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Admissions Pipeline */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all bg-white">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Admissions Pipeline
              </span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                <ClipboardList className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-zinc-950">
                {isLoading ? '...' : `${cmsTelemetry?.admissions.pendingReview ?? 0} Pending`}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {cmsTelemetry ? `${cmsTelemetry.admissions.total} received (${cmsTelemetry.admissions.approved} approved)` : 'Loading pipeline...'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <Link href="/portal/admin/admissions" className="text-[#308599] font-medium hover:underline flex items-center gap-1">
                  <span>Review Applications</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/admissions" target="_blank" className="text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                  <span>Intake Form</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Contact Enquiries */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all bg-white">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Contact Enquiries
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-zinc-950">
                {isLoading ? '...' : cmsTelemetry?.contactInquiries.tableReady ? `${cmsTelemetry.contactInquiries.newCount} New` : 'Pending Sync'}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {cmsTelemetry?.contactInquiries.tableReady
                  ? `${cmsTelemetry.contactInquiries.total} total (${cmsTelemetry.contactInquiries.resolvedCount} resolved)`
                  : 'Milestone 5 migration pending approval'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <Link href="/portal/admin/website" className="text-[#308599] font-medium hover:underline flex items-center gap-1">
                  <span>Enquiries Inbox</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/contact" target="_blank" className="text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                  <span>Contact Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: School Identity */}
          <Card className="border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all bg-white">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                School Metadata
              </span>
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                <Settings className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold text-zinc-950 truncate" title={cmsTelemetry?.schoolSettings.schoolName}>
                {isLoading ? '...' : cmsTelemetry?.schoolSettings.schoolName || 'Sainthia Shishutirtha'}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 truncate">
                UDISE: {cmsTelemetry?.schoolSettings.udiseCode || '19082200103'} • WBBPE
              </p>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <Link href="/portal/admin/settings" className="text-[#308599] font-medium hover:underline flex items-center gap-1">
                  <span>Profile Settings</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/about" target="_blank" className="text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                  <span>About Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Empty Database Onboarding Stepper (Displays when database is empty) */}
      {!isLoading && telemetry && telemetry.totalStudents === 0 && (
        <Card className="border-2 border-dashed border-[#308599]/30 bg-gradient-to-br from-[#EAF5F7]/40 via-white to-white shadow-xs">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#308599] text-white text-[10px] font-mono">
                System Setup
              </Badge>
              <CardTitle className="text-base font-bold text-zinc-950">
                Initial School System Initialization Guide
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-600">
              Your school database is currently pristine and ready for configuration. Follow these foundational steps in dependency order:
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">1. Academic Session</span>
                  <Calendar className="w-4 h-4 text-[#308599]" />
                </div>
                <p className="text-[11px] text-zinc-600">
                  Define the current academic calendar (e.g. 2026–2027) to anchor sections and enrollments.
                </p>
                <Link
                  href="/portal/admin/academics"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#308599] hover:underline pt-1"
                >
                  <span>Configure Years</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">2. Classes & Sections</span>
                  <Layers className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-[11px] text-zinc-600">
                  Create class standards (Nursery to Class IV) and instantiate cohorts (Section A/B).
                </p>
                <Link
                  href="/portal/admin/academics"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#308599] hover:underline pt-1"
                >
                  <span>Add Classes</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">3. Enroll Scholars</span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-zinc-600">
                  Register students with scholar IDs, emergency guardians, and section roll numbers.
                </p>
                <Link
                  href="/portal/admin/students"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#308599] hover:underline pt-1"
                >
                  <span>Register Students</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">4. Fee Structures</span>
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-[11px] text-zinc-600">
                  Configure admission charges, tuition heads, and term schedules for invoicing.
                </p>
                <Link
                  href="/portal/admin/finance"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#308599] hover:underline pt-1"
                >
                  <span>Setup Treasury</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Quick Module Shortcuts */}
      <section aria-label="Website CMS Modules Navigation">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Website CMS & Public Intake Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cmsShortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <Link
                key={sc.title}
                href={sc.href}
                target={sc.external ? '_blank' : undefined}
                className="group p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-zinc-100 group-hover:bg-[#308599]/10 text-zinc-800 group-hover:text-[#308599] rounded-xl transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#308599] transition-colors">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {sc.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. School Administrative Modules */}
      <section aria-label="Administrative Portals Navigation">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
          School Administrative Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminShortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <Link
                key={sc.title}
                href={sc.href}
                className="group p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-zinc-100 group-hover:bg-[#308599]/10 text-zinc-800 group-hover:text-[#308599] rounded-xl transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#308599] transition-colors">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {sc.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Command Palette Modal */}
      <AdminCommandDialog
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />
    </div>
  );
}
