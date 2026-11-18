'use client';

import React from 'react';
import { useAdmissionModal } from '@/components/modals/AdmissionModalContext';

interface EnquireClassButtonProps {
  gradeRange: string;
}

export default function EnquireClassButton({ gradeRange }: EnquireClassButtonProps) {
  const { openAdmissionModal } = useAdmissionModal();

  return (
    <button
      type="button"
      onClick={() => openAdmissionModal(gradeRange)}
      className="w-full min-h-[44px] py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-[#308599] hover:bg-[#EAF5F7] rounded-xl transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
    >
      Enquire for this Class
    </button>
  );
}
