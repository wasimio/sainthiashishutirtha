'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronRight,
  LogOut,
  ExternalLink,
  ChevronDown
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
import { useParent } from '@/components/portal/parent/ParentContext';
import { PARENT_PROFILE } from '@/data/portalParentData';

interface ParentTopbarProps {
  onOpenMobile: () => void;
}

export default function ParentTopbar({ onOpenMobile }: ParentTopbarProps) {
  const pathname = usePathname();
  const { selectedChild, setSelectedChildId, siblings } = useParent();

  const getPageInfo = () => {
    if (pathname.includes('/attendance')) return { title: 'Attendance Log', section: 'Attendance' };
    if (pathname.includes('/homework')) return { title: 'Homework & Diary', section: 'Homework' };
    if (pathname.includes('/report-cards')) return { title: 'Evaluation & Report Cards', section: 'Academics' };
    if (pathname.includes('/fees')) return { title: 'Fee Invoices & Receipts', section: 'Accounts' };
    if (pathname.includes('/absence')) return { title: 'Absence Leave Application', section: 'Requests' };
    if (pathname.includes('/notices')) return { title: 'School Circulars', section: 'Notices' };
    if (pathname.includes('/contact')) return { title: 'School Helpdesk', section: 'Help' };
    return { title: 'Family Dashboard', section: 'Overview' };
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
              Parent Portal
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

        {/* Center / Right: Sibling Switcher + Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Sibling Pill / Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors text-xs font-semibold text-zinc-900"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">
                  {selectedChild.avatarInitials}
                </div>
                <span>{selectedChild.name}</span>
                <span className="text-[10px] text-zinc-400 font-normal hidden sm:inline">
                  ({selectedChild.grade})
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-zinc-200">
              <DropdownMenuLabel className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Switch Student View
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {siblings.map((child) => (
                <DropdownMenuItem
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`cursor-pointer text-xs p-2.5 ${selectedChild.id === child.id ? 'bg-zinc-100 font-bold' : ''}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-6 h-6 rounded-md bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center">
                      {child.avatarInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate">{child.name}</div>
                      <div className="text-[10px] text-zinc-500 font-normal truncate">
                        {child.grade} • Roll #{child.rollNo}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
                  School Notifications
                </span>
                <Badge variant="dark" className="text-[10px] px-1.5 py-0">
                  New Notice
                </Badge>
              </div>

              <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">Annual Sports Meet</span>
                    <span className="text-[10px] text-zinc-400">2d ago</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Sports meet schedule for Nursery and Class II scheduled for December.
                  </p>
                </div>
              </div>

              <div className="p-2 border-t border-zinc-100 text-center bg-zinc-50/50">
                <Link
                  href="/portal/parent/notices"
                  className="text-[11px] font-semibold text-zinc-900 hover:underline"
                >
                  View All School Notices
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Guardian Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                aria-label="Parent menu"
              >
                <div className="w-7 h-7 rounded-md bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  SS
                </div>
                <span className="hidden md:inline text-xs font-semibold text-zinc-900">
                  Mr. Sen
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-zinc-200">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-zinc-950">
                    {PARENT_PROFILE.primaryGuardianName}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {PARENT_PROFILE.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200">
                    Verified Parent (2 Children)
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-200" />
              <DropdownMenuItem asChild>
                <Link
                  href="/portal/parent/contact"
                  className="flex items-center gap-2 text-xs cursor-pointer"
                >
                  <span>School Office Helpdesk</span>
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
