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

interface CouncilTopbarProps {
  onOpenMobile: () => void;
  onOpenCommand: () => void;
}

export default function CouncilTopbar({
  onOpenMobile,
  onOpenCommand,
}: CouncilTopbarProps) {
  const pathname = usePathname();

  const getPageInfo = () => {
    switch (pathname) {
      case '/portal/council/students-admissions':
        return { title: 'Students & Admissions', section: 'Oversight' };
      case '/portal/council/academics':
        return { title: 'Academic Architecture', section: 'Curriculum' };
      case '/portal/council/finance':
        return { title: 'Finance & Accounts', section: 'Treasury' };
      case '/portal/council/faculty-access':
        return { title: 'Faculty & Access Control', section: 'Staffing' };
      case '/portal/council/website':
        return { title: 'Website Management', section: 'Communications' };
      case '/portal/council/reports':
        return { title: 'Reports & Monitoring', section: 'Analytics' };
      case '/portal/council/settings':
        return { title: 'Settings & Security', section: 'Governance' };
      default:
        return { title: 'Executive Overview', section: 'Council' };
    }
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

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-zinc-400 hidden sm:inline">
              Portal
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
          {/* Quick Command / Search Bar Trigger */}
          <button
            type="button"
            onClick={onOpenCommand}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100/80 transition-colors text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Search portal...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-white rounded border border-zinc-200">
              ⌘K
            </kbd>
          </button>

          {/* Session Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Session 2026–2027</span>
          </div>

          {/* Notifications Dropdown (Using @keyline/bell) */}
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
                {/* Notification Item 1 */}
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">
                      Admission Inquiries
                    </span>
                    <span className="text-[10px] text-zinc-400">12m ago</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    3 new applications received for KG-I and Class II admissions.
                  </p>
                </div>

                {/* Notification Item 2 */}
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">
                      Fee Reconciliation
                    </span>
                    <span className="text-[10px] text-zinc-400">1h ago</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Term 2 fee collection reached 88.5% with ₹18.42L realized.
                  </p>
                </div>

                {/* Notification Item 3 */}
                <div className="p-3 hover:bg-zinc-50 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">
                      Faculty Leave Request
                    </span>
                    <span className="text-[10px] text-zinc-400">3h ago</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Primary Science teacher submitted 3-day medical leave application.
                  </p>
                </div>
              </div>

              <div className="p-2 border-t border-zinc-100 text-center bg-zinc-50/50">
                <Link
                  href="/portal/council/reports"
                  className="text-[11px] font-semibold text-zinc-900 hover:underline"
                >
                  View Activity Ledger
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-md bg-zinc-950 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  DB
                </div>
                <span className="hidden md:inline text-xs font-semibold text-zinc-900">
                  Dr. Banerjee
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-zinc-200">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-zinc-950">
                    Dr. Debabrata Banerjee
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    debabrata@shishutirtha.org
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200">
                    Governing Council Member
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-200" />
              <DropdownMenuItem asChild>
                <Link
                  href="/portal/council/settings"
                  className="flex items-center gap-2 text-xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Governance Settings</span>
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
