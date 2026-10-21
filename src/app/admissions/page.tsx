'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import AdmissionModal from '@/components/modals/AdmissionModal';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { ADMISSION_DETAILS } from '@/data/schoolData';

export default function AdmissionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const admissionSteps = [
    { step: "01", title: "Submit Online Enquiry / Form", desc: "Fill our digital admission form or collect the printed prospectus from our school office in Sainthia." },
    { step: "02", title: "Campus Walkthrough", desc: "Visit our airy classrooms, green grounds, and interactive activity rooms with your child." },
    { step: "03", title: "Friendly Informal Interaction", desc: "A warm, informal conversation with teachers to understand your child's personality and language habits." },
    { step: "04", title: "Enrollment & Welcome Kit", desc: "Submit verified documents, receive the uniform guidelines, booklist, and join our Shishutirtha family." }
  ];

  const faqs = [
    { q: "Is there any formal written entrance examination for Kindergarten (KG)?", a: "No. In strict adherence to child-friendly pedagogical principles, we conduct zero stressful written tests for early childhood applicants. We have an informal, joyful observation session with parents present to understand the child's readiness." },
    { q: "What is the maximum student capacity per section?", a: "Each class section is capped strictly at 30 students to maintain our proven 18:1 child-to-teacher ratio and ensure individualized attention." },
    { q: "Are parents allowed to accompany children during the initial days of Kindergarten?", a: "Yes. For Nursery and KG students, we allow an unhurried, gentle orientation period where parents may stay in the visitor pavilion until the child feels completely comfortable with their teachers." },
    { q: "What documents must be submitted at the time of admission?", a: "An attested copy of the Birth Certificate, 3 passport photographs of the student, 1 photograph each of parents/guardians, residential proof in Birbhum, and a transfer certificate (for Class I through IV)." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <PageHeader
        badge="Session 2025–2026 Admissions Open"
        title="Admission Guidelines & Registration"
        subtitle="Transparent enrollment criteria, age requirements, document checklists, and fee schedules for Kindergarten through Class IV."
        breadcrumbs={[{ label: 'Admissions' }]}
      />

      <main className="flex-1 site-container py-12 space-y-16">
        {/* Step-by-Step Admission Process */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Enrollment Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
              Four Simple Steps to Join Shishutirtha
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionSteps.map((item, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#308599] transition-all space-y-3 relative">
                <span className="font-mono text-2xl font-black text-[#308599]/40">{item.step}</span>
                <h3 className="text-base font-bold text-[#243B43]">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Fill Online Admission Enquiry Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Age Criteria & Eligibility Table */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Age Specifications
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
              Class-wise Age Eligibility for 2025–26
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF5F7] text-[#243B43] uppercase text-[10px] font-extrabold tracking-wider border-b border-[#A5D1DC]/60">
                  <tr>
                    <th className="py-4 px-6">Grade / Wing</th>
                    <th className="py-4 px-6">Age Requirement</th>
                    <th className="py-4 px-6">Cut-off Benchmark</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {ADMISSION_DETAILS.ageCriteria.map((crit, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#243B43]">{crit.grade}</td>
                      <td className="py-4 px-6 font-semibold text-[#308599]">{crit.age}</td>
                      <td className="py-4 px-6 text-slate-600">{crit.cutoff}</td>
                      <td className="py-4 px-6 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Accepting Applications
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Documents & Fee Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Documents Checklist */}
          <section className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#308599] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#243B43]">Required Documents</h3>
                <p className="text-xs text-slate-500">To be submitted during physical verification</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {ADMISSION_DETAILS.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Fee Overview */}
          <section className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#243B43]">Fee Structure Overview</h3>
                <p className="text-xs text-slate-500">Approved by School Governing Body</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {ADMISSION_DETAILS.feeOverview.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-800 block">{item.head}</span>
                    <span className="text-[11px] text-slate-400">{item.frequency}</span>
                  </div>
                  <span className="font-mono font-bold text-base text-[#308599]">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 italic">
              * Concessions available for siblings and meritorious underprivileged families upon formal application.
            </div>
          </section>
        </div>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#243B43] flex items-center justify-between gap-4 hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-slate-400 font-bold transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      ↓
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#EAF5F7]/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <QuickActionRail onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
