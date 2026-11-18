'use client';

import React, { useState } from 'react';
import ParentSidebar from '@/components/portal/parent/ParentSidebar';
import ParentTopbar from '@/components/portal/parent/ParentTopbar';
import { ParentProvider } from '@/components/portal/parent/ParentContext';
import type { UserProfile } from '@/lib/auth/authorization';
import type { User } from '@supabase/supabase-js';

interface ParentPortalShellProps {
  children: React.ReactNode;
  user?: User;
  profile?: UserProfile;
}

export default function ParentPortalShell({
  children,
}: ParentPortalShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ParentProvider>
      <div className="min-h-screen bg-zinc-50/60 flex flex-col lg:flex-row text-zinc-900 font-sans antialiased">
        {/* Sidebar */}
        <ParentSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          <ParentTopbar onOpenMobile={() => setIsMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>

          <footer className="px-6 py-4 border-t border-zinc-200 bg-white text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              © 2026 Sainthia Shishutirtha • Parent & Guardian Portal
            </span>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span>U-DISE: 19082200103</span>
              <span>•</span>
              <span>Birbhum, West Bengal</span>
            </div>
          </footer>
        </div>
      </div>
    </ParentProvider>
  );
}
