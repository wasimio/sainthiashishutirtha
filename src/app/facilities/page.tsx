'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import AdmissionModal from '@/components/modals/AdmissionModal';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Droplets,
  Video,
  HeartPulse
} from 'lucide-react';
import { SCHOOL_FACILITIES } from '@/data/schoolData';

export default function FacilitiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <PageHeader
        badge="Campus & Infrastructure"
        title="Campus Facilities & Safety"
        subtitle="Designed from the ground up for childhood safety, sensory discovery, hygienic comfort, and active physical play."
        breadcrumbs={[{ label: 'Campus Facilities' }]}
      />

      <main className="flex-1 site-container py-12 space-y-16">
        {/* Safety & Hygiene Banner */}
        <section className="bg-[#243B43] text-white rounded-3xl p-8 sm:p-10 border border-slate-700 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A5D1DC]">
                Non-Negotiable Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Child Safety, Health & Daily Hygiene
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Full Campus Surveillance</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <Video className="w-6 h-6 text-[#A5D1DC]" />
              <h3 className="font-bold text-sm text-white">24x7 CCTV Coverage</h3>
              <p className="text-xs text-slate-300">Monitored cameras in all entrance corridors, playground zones, and activity halls.</p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <Droplets className="w-6 h-6 text-[#A5D1DC]" />
              <h3 className="font-bold text-sm text-white">Multi-Stage RO Water</h3>
              <p className="text-xs text-slate-300">Continuous pure, lab-tested drinking water dispensers accessible at child height.</p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <HeartPulse className="w-6 h-6 text-[#A5D1DC]" />
              <h3 className="font-bold text-sm text-white">First Aid & Sick Bay</h3>
              <p className="text-xs text-slate-300">Equipped with first-aid essentials, antiseptic, fever monitoring, and on-call pediatric doctor.</p>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#A5D1DC]" />
              <h3 className="font-bold text-sm text-white">Single-Gate Protocol</h3>
              <p className="text-xs text-slate-300">No student is allowed to leave without an authorized parent ID card and teacher handover.</p>
            </div>
          </div>
        </section>

        {/* Detailed Facilities Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Physical Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
              Spaces Where Childhood Flourishes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SCHOOL_FACILITIES.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#243B43]/85 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                    {facility.category}
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#243B43]">
                      {facility.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {facility.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Facility Highlights:
                    </span>
                    {facility.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule a Visit Banner */}
        <section className="bg-[#EAF5F7] rounded-3xl p-8 sm:p-12 border border-[#A5D1DC] text-center max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
            Campus Tours & Visits
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
            Experience Our Campus in Person
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            We welcome parents to visit our Sainthia campus during working hours (8:30 AM to 1:30 PM), observe classrooms, and inspect our safety arrangements firsthand.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Book a Campus Visit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+919474012345"
              className="px-6 py-3 bg-white text-[#243B43] border border-slate-200 hover:border-[#308599] text-xs font-bold rounded-xl transition-all"
            >
              Call Campus Desk
            </a>
          </div>
        </section>
      </main>

      <Footer onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <QuickActionRail onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
