'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/portal/admin/AdminSidebar';
import AdminTopbar from '@/components/portal/admin/AdminTopbar';
import AdminCommandDialog from '@/components/portal/admin/AdminCommandDialog';
import type { UserProfile } from '@/lib/auth/authorization';
import type { User } from '@supabase/supabase-js';

interface AdminPortalShellProps {
  children: React.ReactNode;
  user?: User;
  profile?: UserProfile;
}

export default function AdminPortalShell({
  children,
}: AdminPortalShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50/60 flex flex-col lg:flex-row text-zinc-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Topbar Header */}
        <AdminTopbar
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenCommand={() => setIsCommandOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>

        {/* Minimalist Monochrome Footer */}
        <footer className="px-6 py-4 border-t border-zinc-200 bg-white text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Sainthia Shishutirtha • Administration & Council Portal
          </span>
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span>U-DISE: 19082200103</span>
            <span>•</span>
            <span>Birbhum, West Bengal</span>
          </div>
        </footer>
      </div>

      {/* Command Palette Dialog */}
      <AdminCommandDialog
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />
    </div>
  );
}
