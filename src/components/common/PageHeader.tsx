'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageHeader({ title, subtitle, badge, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-[#EAF5F7] to-white border-b border-slate-200 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#308599] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#308599] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#243B43]">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          {badge && (
            <span className="inline-block px-3 py-1 bg-white text-[#308599] border border-[#A5D1DC] text-xs font-bold rounded-full shadow-2xs">
              {badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#243B43] tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
