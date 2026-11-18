'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  ExternalLink,
  ChevronRight,
  LogOut,
  SlidersHorizontal
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

interface AdminTopbarProps {
  onOpenMobile: () => void;
  onOpenCommand: () => void;
}

export default function AdminTopbar({
  onOpenMobile,
  onOpenCommand,
}: AdminTopbarProps) {
  const pathname = usePathname();

  const getPageInfo = () => {
    if (pathname.includes('/students')) return { title: 'Student Information System', section: 'Students' };
    if (pathname.includes('/admissions')) return { title: 'Admissions Pipeline & Verification', section: 'Admissions' };
    if (pathname.includes('/academics')) return { title: 'Curriculum & Class Allocation', section: 'Academics' };
    if (pathname.includes('/attendance')) return { title: 'Campus Attendance Monitoring', section: 'Attendance' };
    if (pathname.includes('/faculty')) return { title: 'Faculty & Staff Roster', section: 'Staff' };
    if (pathname.includes('/finance')) return { title: 'Fees & Treasury Ledger', section: 'Finance' };
    if (pathname.includes('/website')) return { title: 'Website Notices & CMS', section: 'Communications' };
    if (pathname.includes('/reports')) return { title: 'Reports & Institutional Telemetry', section: 'Analytics' };
    if (pathname.includes('/settings')) return { title: 'Settings & Governance Controls', section: 'Settings' };
    return { title: 'Executive Overview Dashboard', section: 'Overview' };
  };

  const page = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="monochromeGhost"
            size="icon"
            onClick={onOpenMobile}
            className="lg:hidden text-zinc-600 hover:text-zinc-950 h-8 w-8"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-zinc-400 hidden sm:inline">
              Admin Portal
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

        {/* Center / Right: Command Menu, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenCommand}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100/80 transition-colors text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Search records...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-white rounded border border-zinc-200">
              ⌘K
            </kbd>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Session 2026–2027</span>
          </div>

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
                  Administrative Notifications
                </span>
                <Badge variant="dark" className="text-[10px] px-1.5 py-0">
                  3 New
                </Badge>
              </div>

              <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">Admissions Queue</span>
                    <span className="text-[10px] text-zinc-400">12m ago</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    3 new applications received for KG-I and Class II admissions.
                  </p>
                </div>
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">Fee Reconciliation</span>
                    <span className="text-[10px] text-zinc-400">1h ago</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Term 2 fee collection reached 88.5% with ₹18.42L realized.
                  </p>
                </div>
              </div>

              <div className="p-2 border-t border-zinc-100 text-center bg-zinc-50/50">
                <Link
                  href="/portal/admin/reports"
                  className="text-[11px] font-semibold text-zinc-900 hover:underline"
                >
                  View Activity Ledger
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-md bg-zinc-950 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  AD
                </div>
                <span className="hidden md:inline text-xs font-semibold text-zinc-900">
                  Administrator
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-zinc-200">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-zinc-950">
                    School Administration
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    admin@shishutirtha.org
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200">
                    Super Administrator & Council
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-200" />
              <DropdownMenuItem asChild>
                <Link
                  href="/portal/admin/settings"
                  className="flex items-center gap-2 text-xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                  <span>System Settings</span>
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
