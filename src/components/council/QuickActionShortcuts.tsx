'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  CreditCard,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function QuickActionShortcuts() {
  const shortcuts = [
    {
      title: 'Review Admissions',
      subtitle: '38 Applications in pipeline',
      href: '/portal/council/students-admissions',
      icon: Users,
      badge: 'Active',
    },
    {
      title: 'Academic Curricula',
      subtitle: 'KG through Class IV syllabi',
      href: '/portal/council/academics',
      icon: GraduationCap,
      badge: 'Term 2',
    },
    {
      title: 'Fee Dues Ledger',
      subtitle: '₹2.38L pending collection',
      href: '/portal/council/finance',
      icon: CreditCard,
      badge: 'Defaulters',
    },
    {
      title: 'Faculty & Access',
      subtitle: '22 Teaching & staff profiles',
      href: '/portal/council/faculty-access',
      icon: UserCheck,
      badge: 'Verified',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {shortcuts.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.title} href={item.href} className="group block">
            <Card className="border-zinc-200/90 shadow-xs hover:border-zinc-400 hover:shadow-sm transition-all duration-150 h-full">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200/80 text-zinc-900 flex items-center justify-center shrink-0 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-900 group-hover:text-zinc-950 transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0" />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
