'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  Award,
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { STAFF_PROFILE } from '@/data/portalStaffData';

interface StaffSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const STAFF_NAV_ITEMS = [
  { name: 'Teacher Dashboard', href: '/portal/staff', icon: LayoutDashboard },
  { name: 'Assigned Classes', href: '/portal/staff/classes', icon: Users, badge: '3 Sections' },
  { name: 'Daily Attendance', href: '/portal/staff/attendance', icon: CalendarCheck, badge: 'Class II-A' },
  { name: 'Homework & Diary', href: '/portal/staff/homework', icon: BookOpen, badge: '2 Active' },
  { name: 'Marks & Assessments', href: '/portal/staff/assessments', icon: Award },
  { name: 'Student Remarks', href: '/portal/staff/remarks', icon: MessageSquare },
  { name: 'My Profile & Leaves', href: '/portal/staff/profile', icon: User },
];

export default function StaffSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: StaffSidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/portal/staff') {
      return pathname === '/portal/staff';
    }
    return pathname.startsWith(href);
  };

  const renderNavList = (onNavigate?: () => void) => (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <div className="space-y-1">
        {!isCollapsed && (
          <div className="px-3 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Academic Operations
          </div>
        )}
        <nav className="space-y-0.5" aria-label="Staff Navigation">
          {STAFF_NAV_ITEMS.map((item) => {
            const active = isLinkActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative group ${
                  active
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-900'
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}

                {!isCollapsed && item.badge && (
                  <Badge
                    variant={active ? 'dark' : 'zinc'}
                    className={`text-[10px] px-1.5 py-0 h-4.5 ${
                      active ? 'bg-zinc-800 text-zinc-100 border-zinc-700' : ''
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Class Mentor Assignment Pill */}
      {!isCollapsed && (
        <div className="p-3 mx-1 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Class Teacher Duty</span>
            <Badge variant="dark" className="text-[9px] px-1.5 py-0">Mentor</Badge>
          </div>
          <div className="text-xs font-bold text-zinc-950">
            Class II — Section A
          </div>
          <p className="text-[11px] text-zinc-500">
            32 Enrolled • Room 201 • Morning Register
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-zinc-200 transition-all duration-200 ease-in-out relative z-20 ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200">
          <Link
            href="/portal/staff"
            className={`flex items-center gap-3 min-w-0 ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-950 tracking-tight truncate">
                  Shishutirtha
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500 font-medium">Faculty Portal</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-zinc-400 font-mono">STAFF</span>
                </div>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <Button
              type="button"
              variant="monochromeGhost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-7 w-7 text-zinc-400 hover:text-zinc-900 rounded-md"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {isCollapsed && (
          <div className="p-2 border-b border-zinc-100 flex justify-center">
            <Button
              type="button"
              variant="monochromeGhost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-7 w-7 text-zinc-400 hover:text-zinc-900 rounded-md"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {renderNavList()}

        {/* User Card */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/50">
          <div
            className={`flex items-center gap-3 p-2 rounded-lg bg-white border border-zinc-200/80 shadow-2xs ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-md bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              SG
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-zinc-900 truncate">
                  {STAFF_PROFILE.name}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  {STAFF_PROFILE.employeeId}
                </div>
              </div>
            )}

            {!isCollapsed && (
              <Link
                href="/"
                title="View Public School Website"
                className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 rounded"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={(open) => !open && onCloseMobile()}>
        <SheetContent side="left" className="p-0 w-72 bg-white flex flex-col">
          <SheetHeader className="h-16 px-4 flex flex-row items-center justify-between border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <SheetTitle className="text-xs font-bold text-zinc-950 text-left">
                  Sainthia Shishutirtha
                </SheetTitle>
                <div className="text-[10px] text-zinc-500 text-left">
                  Staff & Faculty Portal
                </div>
              </div>
            </div>
          </SheetHeader>

          {renderNavList(onCloseMobile)}

          <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-2">
            <Link
              href="/"
              onClick={onCloseMobile}
              className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200 rounded-md font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
