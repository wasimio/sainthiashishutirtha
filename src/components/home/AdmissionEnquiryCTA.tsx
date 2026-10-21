'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileCheck2
} from 'lucide-react';

interface AdmissionEnquiryCTAProps {
  onOpenAdmissionModal?: () => void;
}

export default function AdmissionEnquiryCTA({ onOpenAdmissionModal }: AdmissionEnquiryCTAProps) {
  const admissionSteps = [
    {
      step: "01",
      title: "Online Enquiry",
      desc: "Fill our simple digital form or collect a registration form at our school office in Sainthia."
    },
    {
      step: "02",
      title: "Campus Walkthrough",
      desc: "Visit our airy classrooms, green grounds, and interactive activity rooms with your little one."
    },
    {
      step: "03",
      title: "Friendly Interaction",
      desc: "A warm, informal chat with teachers and headmaster to understand your child's personality."
    },
    {
      step: "04",
      title: "Welcome & Kit",
      desc: "Complete documentation, receive syllabus, uniform instructions, and join our school family."
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#308599] via-[#243B43] to-[#1c3037] text-white relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#A5D1DC]/10 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#A5D1DC] text-xs font-bold border border-white/15">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Academic Session 2025–2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Begin Your Child&apos;s Journey at Shishutirtha
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Admissions are currently underway for <strong>Kindergarten (KG), Class I, Class II, Class III, and Class IV</strong>. Seats in each batch are strictly limited to maintain our 18:1 child-to-teacher ratio.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenAdmissionModal}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white hover:bg-slate-100 text-[#243B43] text-sm font-extrabold rounded-2xl shadow-xl transition-all transform active:scale-95"
            >
              <span>Submit Admission Enquiry Now</span>
              <ArrowRight className="w-4 h-4 text-[#308599]" />
            </button>
          </div>
        </div>

        {/* 4 Steps Journey */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {admissionSteps.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/15 relative space-y-3"
            >
              <div className="text-2xl font-black text-[#A5D1DC]/60 font-mono">
                {item.step}
              </div>
              <h3 className="text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Supporting Note */}
        <div className="mt-12 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>Have questions before applying? Call our Admissions Desk directly at <strong>+91 94740 12345</strong></span>
        </div>
      </div>
    </section>
  );
}
