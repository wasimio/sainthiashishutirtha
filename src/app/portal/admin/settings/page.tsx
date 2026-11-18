'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getSchoolSettings,
  updateSchoolSettings,
  getAcademicYears,
  AcademicYearRow,
} from '@/lib/services/adminService';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [academicYears, setAcademicYears] = useState<AcademicYearRow[]>([]);

  // Form states
  const [schoolName, setSchoolName] = useState('Sainthia Shishutirtha');
  const [udiseCode, setUdiseCode] = useState('19082200103');
  const [campusAddress, setCampusAddress] = useState('Sainthia, Birbhum, West Bengal 731234');
  const [officialPhone, setOfficialPhone] = useState('+91 94340 12345');
  const [officialEmail, setOfficialEmail] = useState('info@shishutirtha.org');
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [lateFine, setLateFine] = useState<number>(10);
  const [gracePeriod, setGracePeriod] = useState<number>(15);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getSchoolSettings(),
      getAcademicYears(),
    ])
      .then(([settingsData, yearsData]) => {
        if (isMounted) {
          setAcademicYears(yearsData);
          if (settingsData) {
            setSchoolName(settingsData.school_name || 'Sainthia Shishutirtha');
            setUdiseCode(settingsData.udise_code || '19082200103');
            setCampusAddress(settingsData.campus_address || 'Sainthia, Birbhum, West Bengal 731234');
            setOfficialPhone(settingsData.official_phone || '+91 94340 12345');
            setOfficialEmail(settingsData.official_email || 'info@shishutirtha.org');
            setSelectedYearId(settingsData.current_academic_year_id || '');
            setLateFine(settingsData.fee_late_fine_daily ?? 10);
            setGracePeriod(settingsData.attendance_grace_period_mins ?? 15);
          } else {
            const curYear = yearsData.find((y) => y.is_current);
            if (curYear) setSelectedYearId(curYear.id);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error('Failed to load school settings:', err);
          setError(err instanceof Error ? err.message : 'Failed to query institutional configuration.');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSchoolSettings({
        school_name: schoolName.trim(),
        udise_code: udiseCode.trim(),
        campus_address: campusAddress.trim(),
        official_phone: officialPhone.trim(),
        official_email: officialEmail.trim(),
        current_academic_year_id: selectedYearId || null,
        fee_late_fine_daily: Number(lateFine) || 0,
        attendance_grace_period_mins: Number(gracePeriod) || 0,
      });

      showToast('Institutional governance settings successfully saved.');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update school settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              System Configuration
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Governance & Institutional Keys
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            Governance & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            School identity metadata, active academic session, portal role security, and statutory defaults.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={handleSave}
          disabled={saving || loading}
          className="text-xs h-8 gap-1.5"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Changes</span>
        </Button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-semibold block">Configuration Notice</span>
            <p className="text-amber-700 text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
          <p className="text-xs">Loading institutional settings from Supabase...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: General Settings Form */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  School Identity & U-DISE Registration
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Statutory school registration identifiers and physical campus address.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Official Institution Name *</label>
                  <Input
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                    className="h-8 text-xs border-zinc-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">U-DISE+ School Code *</label>
                    <Input
                      value={udiseCode}
                      onChange={(e) => setUdiseCode(e.target.value)}
                      required
                      className="h-8 text-xs border-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Active Academic Session</label>
                    <select
                      value={selectedYearId}
                      onChange={(e) => setSelectedYearId(e.target.value)}
                      className="w-full h-8 text-xs rounded-md border border-zinc-200 bg-white px-2.5 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-950 font-mono"
                    >
                      <option value="">-- None Selected --</option>
                      {academicYears.map((yr) => (
                        <option key={yr.id} value={yr.id}>
                          {yr.name} {yr.is_current ? '(Default Active)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Official Contact Phone</label>
                    <Input
                      value={officialPhone}
                      onChange={(e) => setOfficialPhone(e.target.value)}
                      className="h-8 text-xs border-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Official Contact Email</label>
                    <Input
                      type="email"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      className="h-8 text-xs border-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Campus Physical Address</label>
                  <Input
                    value={campusAddress}
                    onChange={(e) => setCampusAddress(e.target.value)}
                    className="h-8 text-xs border-zinc-200"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  Institutional Defaults & Rules
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Automation rules for attendance grace periods and late fee fine calculations.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Daily Late Fee Fine (₹)</label>
                    <Input
                      type="number"
                      value={lateFine}
                      onChange={(e) => setLateFine(Number(e.target.value))}
                      min={0}
                      className="h-8 text-xs border-zinc-200 font-mono"
                    />
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Applied after invoice due date</span>
                  </div>
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1">Morning Grace Period (Mins)</label>
                    <Input
                      type="number"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(Number(e.target.value))}
                      min={0}
                      max={60}
                      className="h-8 text-xs border-zinc-200 font-mono"
                    />
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Scholars arrive late after this</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Security & Role Model Card */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-900" />
                  <span>Three-Portal Role Access Model</span>
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Enforced at Supabase Row-Level Security (RLS) and middleware levels.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">1. Admin & Council</span>
                    <Badge variant="dark" className="text-[10px]">Level 3</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Full institutional governance: Fees, Admissions, SIS Roster, Faculty management, and statutory reports.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">2. Staff & Faculty</span>
                    <Badge variant="zinc" className="text-[10px]">Level 2</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Classroom operational control: Daily attendance register, homework distribution, marks entry, and student remarks.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">3. Parent & Guardian</span>
                    <Badge variant="outline" className="text-[10px]">Level 1</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Family access with sibling switcher: Attendance records, report cards, homework tracking, fee receipts, and leave requests.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      )}
    </div>
  );
}
