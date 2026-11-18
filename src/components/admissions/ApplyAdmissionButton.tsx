'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ApplyAdmissionButtonProps {
  className?: string;
  defaultGrade?: string;
  children?: React.ReactNode;
}

export default function ApplyAdmissionButton({
  className,
  defaultGrade,
  children,
}: ApplyAdmissionButtonProps) {
  return (
    <Link
      href={defaultGrade ? `/admissions?class=${encodeURIComponent(defaultGrade)}` : '/admissions'}
      className={
        className ||
        "inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-[#308599] hover:bg-[#266b7b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] focus-visible:ring-offset-2 cursor-pointer active:scale-95"
      }
    >
      {children || (
        <>
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Apply Online for Session 2025–2026</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </Link>
  );
}
