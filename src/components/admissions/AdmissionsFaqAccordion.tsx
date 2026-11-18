'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface AdmissionsFaqAccordionProps {
  faqs: FaqItem[];
}

export default function AdmissionsFaqAccordion({ faqs }: AdmissionsFaqAccordionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3" role="presentation">
      {faqs.map((faq, idx) => {
        const isOpen = activeFaq === idx;
        const questionId = `faq-question-${idx}`;
        const answerId = `faq-answer-${idx}`;

        return (
          <div
            key={idx}
            className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
          >
            <h3 className="m-0 p-0 font-normal">
              <button
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 min-h-[48px] text-left font-bold text-xs sm:text-sm text-[#243B43] flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#308599]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>

            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#EAF5F7]/30"
              >
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
