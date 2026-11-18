'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Search,
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  UserCheck,
  Globe,
  FileBarChart2,
  Settings,
  ArrowRight,
  PlusCircle,
  FileText,
  Download
} from 'lucide-react';

interface CouncilCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMMAND_ITEMS = [
  {
    category: 'Navigation',
    items: [
      { name: 'Executive Overview', href: '/portal/council', icon: LayoutDashboard },
      { name: 'Students & Admissions', href: '/portal/council/students-admissions', icon: Users },
      { name: 'Academic Architecture', href: '/portal/council/academics', icon: GraduationCap },
      { name: 'Finance & Accounts', href: '/portal/council/finance', icon: CreditCard },
      { name: 'Faculty & Access Control', href: '/portal/council/faculty-access', icon: UserCheck },
      { name: 'Website Management', href: '/portal/council/website', icon: Globe },
      { name: 'Reports & Monitoring', href: '/portal/council/reports', icon: FileBarChart2 },
      { name: 'Governance & Settings', href: '/portal/council/settings', icon: Settings },
    ],
  },
  {
    category: 'Quick Actions',
    items: [
      { name: 'New Admission Inquiry Form', href: '/portal/council/students-admissions', icon: PlusCircle },
      { name: 'Export Fee Defaulters Roll', href: '/portal/council/finance', icon: Download },
      { name: 'Draft Campus Notice / Circular', href: '/portal/council/website', icon: FileText },
      { name: 'Download Term-1 Audit Dossier', href: '/portal/council/reports', icon: Download },
    ],
  },
];

export default function CouncilCommandDialog({
  open,
  onOpenChange,
}: CouncilCommandDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K or Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    setQuery('');
    router.push(href);
  };

  const filteredGroups = COMMAND_ITEMS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-zinc-200 shadow-2xl">
        <DialogHeader className="p-3 border-b border-zinc-200">
          <div className="flex items-center gap-2 px-1">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sections, records, or quick commands..."
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-sm placeholder:text-zinc-400"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-zinc-100 rounded border border-zinc-200">
              ESC
            </kbd>
          </div>
          <DialogTitle className="sr-only">Command Menu</DialogTitle>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-100">
          {filteredGroups.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching commands or routes found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.category} className="py-2 first:pt-0 last:pb-0">
                <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {group.category}
                </div>
                <div className="space-y-0.5 mt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-700 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-3 py-2 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Navigate with mouse or keyboard</span>
          <span>Sainthia Shishutirtha • Council Portal</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
