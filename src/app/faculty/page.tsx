'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import AdmissionModal from '@/components/modals/AdmissionModal';
import {
  GraduationCap,
  Award,
  BookOpen,
  HeartHandshake,
  Users
} from 'lucide-react';
import { FACULTY_MEMBERS } from '@/data/schoolData';

export default function FacultyPage() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departments = ['All', 'Leadership', 'Primary', 'Pre-Primary', 'Activity & Physical'];

  const filteredFaculty = selectedDept === 'All'
    ? FACULTY_MEMBERS
    : FACULTY_MEMBERS.filter((f) => f.department === selectedDept);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <PageHeader
        badge="Mentors & Caregivers"
        title="Our Dedicated Faculty & Staff"
        subtitle="Meet the experienced, compassionate educators who guide our children every day with patience, academic rigor, and boundless love."
        breadcrumbs={[{ label: 'Faculty & Mentors' }]}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Department Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDept === dept
                  ? 'bg-[#308599] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
              }`}
            >
              {dept === 'All' ? 'All Mentors' : dept}
            </button>
          ))}
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFaculty.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#243B43]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {mentor.department}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#243B43] group-hover:text-[#308599] transition-colors leading-snug">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-[#308599] font-semibold mt-0.5">
                      {mentor.role}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#308599]" />
                      <span className="truncate">{mentor.qualification}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{mentor.experienceYears}+ Years Teaching Experience</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 pt-1">
                    {mentor.bio}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <span className="text-[11px] font-medium bg-[#EAF5F7] text-[#308599] px-2.5 py-1 rounded-lg block text-center border border-[#A5D1DC]/60 truncate">
                  {mentor.specialization}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Teacher Quality & Training Commitment */}
        <section className="bg-[#EAF5F7] rounded-3xl p-8 sm:p-10 border border-[#A5D1DC] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white text-[#308599] flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#243B43]">Trained in Child Psychology</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our teachers undergo regular workshops on positive reinforcement, non-threatening evaluation, and handling early emotional milestones.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white text-[#308599] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#243B43]">Continuous FLN Workshops</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Faculty routinely participate in modern Foundational Literacy & Numeracy pedagogical refreshers to integrate the latest audio-visual methods.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white text-[#308599] flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#243B43]">Dedicated Support Staff</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained female care attendants assist kindergarten children with washroom cleanliness, shoe lacing, and safe handwashing routines during tiffin.
            </p>
          </div>
        </section>
      </main>

      <Footer onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
