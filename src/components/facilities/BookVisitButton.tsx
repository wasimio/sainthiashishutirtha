'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAdmissionModal } from '@/components/modals/AdmissionModalContext';

export default function BookVisitButton() {
  const { openAdmissionModal } = useAdmissionModal();

  return (
    <button
      type="button"
      onClick={() => openAdmissionModal()}
      className="px-6 py-3 min-h-[48px] bg-[#308599] hover:bg-[#266b7b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] focus-visible:ring-offset-2"
    >
      <span>Book a Campus Visit</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
