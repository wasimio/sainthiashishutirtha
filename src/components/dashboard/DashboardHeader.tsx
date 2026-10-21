'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Shield,
  UserCheck,
  ArrowLeft,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface DashboardHeaderProps {
  role: 'admin' | 'parent';
  title: string;
  subtitle: string;
}

export default function DashboardHeader({ role, title, subtitle }: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-[#243B43] text-white border-b border-slate-700 sticky top-0 z-30 shadow-md">
      {/* Top Prototype Badge Bar */}
      <div className="bg-[#1b2f36] px-4 py-1.5 text-xs border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-amber-300 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            Prototype Simulation
          </span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            • Fictional Demonstration Data for School Review
          </span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A5D1DC] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Public Website</span>
        </Link>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Page Info */}
          <div className="flex items-center gap-3.5">
            <Link href="/" className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-white p-1 overflow-hidden shadow-sm hover:ring-2 hover:ring-[#A5D1DC] transition-all">
                <Image
                  src="/logo.png"
                  alt="Sainthia Shishutirtha"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {title}
                </h1>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    role === 'admin'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-emerald-400 text-slate-900'
                  }`}
                >
                  {role === 'admin' ? 'Administration' : 'Parent View'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Navigation Links according to role */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {role === 'admin' ? (
              <>
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    pathname === '/admin'
                      ? 'bg-[#308599] text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </Link>

                <Link
                  href="/admin/admissions"
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    pathname === '/admin/admissions'
                      ? 'bg-[#308599] text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Admissions Table</span>
                </Link>

                <Link
                  href="/parent"
                  className="px-3 py-1.5 rounded-lg font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 ml-2"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch to Parent Portal</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/parent"
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    pathname === '/parent'
                      ? 'bg-[#308599] text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student Overview</span>
                </Link>

                <Link
                  href="/parent/homework"
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    pathname === '/parent/homework'
                      ? 'bg-[#308599] text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Homework & Tasks</span>
                </Link>

                <Link
                  href="/parent/attendance"
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    pathname === '/parent/attendance'
                      ? 'bg-[#308599] text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Attendance</span>
                </Link>

                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-lg font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 ml-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Switch to Admin</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
