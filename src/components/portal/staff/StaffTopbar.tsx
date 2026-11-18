'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronRight,
  LogOut,
  ExternalLink,
  CalendarCheck,
  User
} from 'lucide-react';
import { Bell } from '@/components/icons/bell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STAFF_PROFILE } from '@/data/portalStaffData';

interface StaffTopbarProps {
  onOpenMobile: () => void;
}

export default function StaffTopbar({ onOpenMobile }: StaffTopbarProps) {
  const pathname = usePathname();

  const getPageInfo = () => {
    if (pathname.includes('/classes')) return { title: 'Assigned Classes & Roster', section: 'Classes' };
    if (pathname.includes('/attendance')) return { title: 'Daily Attendance Register', section: 'Attendance' };
    if (pathname.includes('/homework')) return { title: 'Homework & Assignment Diary', section: 'Homework' };
    if (pathname.includes('/assessments')) return { title: 'Assessments & Marks Entry', section: 'Marks' };
    if (pathname.includes('/remarks')) return { title: 'Student Behavioral Remarks', section: 'Remarks' };
    if (pathname.includes('/profile')) return { title: 'Teacher Profile & Leave Ledger', section: 'Profile' };
    return { title: 'Teacher Dashboard', section: 'Overview' };
  };

  const page = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="monochromeGhost"
            size="icon"
            onClick={onOpenMobile}
            className="lg:hidden text-zinc-600 hover:text-zinc-950 h-8 w-8"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-zinc-400 hidden sm:inline">
              Staff Portal
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 hidden sm:inline" />
            <span className="text-zinc-500 font-medium hidden md:inline">
              {page.section}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 hidden md:inline" />
            <span className="font-semibold text-zinc-950 truncate">
              {page.title}
            </span>
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Class Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-semibold border border-zinc-200">
            <CalendarCheck className="w-3.5 h-3.5 text-zinc-600" />
            <span>Class II-A (Mentor)</span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="monochromeGhost"
                size="icon"
                className="relative h-8 w-8 text-zinc-600 hover:text-zinc-950 rounded-lg"
                aria-label="View notifications"
              >
                <Bell size={18} className="text-zinc-700" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-zinc-950 ring-2 ring-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 border-zinc-200 shadow-xl">
              <div className="p-3 border-b border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-950">
                  Staff Circulars & Alerts
                </span>
                <Badge variant="dark" className="text-[10px] px-1.5 py-0">
                  2 New
                </Badge>
              </div>

              <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">Term 1 Marks Window</span>
                    <span className="text-[10px] text-zinc-400">1h ago</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Class II English Language and Mathematics marks entry window closes this Friday.
                  </p>
                </div>
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">Parent Meeting</span>
                    <span className="text-[10px] text-zinc-400">Yesterday</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Mr. Subrata Sen requested appointment regarding Aarav Sen (Roll #14).
                  </p>
                </div>
              </div>

              <div className="p-2 border-t border-zinc-100 text-center bg-zinc-50/50">
                <Link
                  href="/portal/staff/remarks"
                  className="text-[11px] font-semibold text-zinc-900 hover:underline"
                >
                  View Student Diary
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Teacher Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                aria-label="Staff menu"
              >
                <div className="w-7 h-7 rounded-md bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  SG
                </div>
                <span className="hidden md:inline text-xs font-semibold text-zinc-900">
                  Mrs. Ganguly
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-zinc-200">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-zinc-950">
                    {STAFF_PROFILE.name}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {STAFF_PROFILE.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200">
                    Class II Mentor & Senior Faculty
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-200" />
              <DropdownMenuItem asChild>
                <Link
                  href="/portal/staff/profile"
                  className="flex items-center gap-2 text-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Teacher Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Public School Website</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-200" />
              <DropdownMenuItem asChild>
                <Link
                  href="/auth/signout"
                  className="flex items-center gap-2 text-xs text-red-600 focus:text-red-700 cursor-pointer w-full"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
