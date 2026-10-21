'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import WelcomeMessage from '@/components/home/WelcomeMessage';
import AdmissionModal from '@/components/modals/AdmissionModal';
import {
  ShieldCheck,
  Target,
  Compass,
  Sparkles,
  Award,
  BookOpen,
  Heart,
  Users,
  CheckCircle2
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const coreValues = [
    { title: "Joyful Discovery", desc: "Learning should never feel like a chore. We use hands-on materials, interactive storytelling, and outdoor observation to spark innate curiosity.", icon: Sparkles },
    { title: "Compassion & Empathy", desc: "Children learn to respect their peers, share during tiffin, care for animals and plants, and resolve disagreements with gentle dialogue.", icon: Heart },
    { title: "Foundational Bilingualism", desc: "Fluency in spoken and written English paired with pride and mastery in the mother tongue (Bengali/Hindi) creates confident thinkers.", icon: BookOpen },
    { title: "Integrity & Moral Roots", desc: "Honesty, punctuality, hygiene, and civic responsibility are woven into daily circle discussions and morning assembly thoughts.", icon: Award },
    { title: "Inclusive Care", desc: "Every child is unique. Our small 18:1 ratio ensures no slow-blooming child is left behind or made to feel inadequate.", icon: Users },
    { title: "Transparent Governance", desc: "An open door for parents. We believe the school and home are equal partners in shaping a balanced young human being.", icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <PageHeader
        badge="Institutional Heritage • Estd. 2013"
        title="About Sainthia Shishutirtha"
        subtitle="A premier foundational school in Birbhum dedicated to nurturing confident, compassionate, and inquisitive young learners from Kindergarten through Class IV."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <main className="flex-1 site-container py-12 space-y-16">
        {/* Accreditation & Genesis */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Our Inception & Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">
              Founded on the Belief that Early Childhood Education Shapes Destiny
            </h2>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Established in <strong>2013</strong> under the West Bengal Societies Registration Act (Govt. Regd: <strong>{SCHOOL_INFO.affiliation}</strong>) with official U-DISE recognition (<strong>{SCHOOL_INFO.udiseNo}</strong>), <strong>Sainthia Shishutirtha</strong> was born from a shared aspiration among visionary local educationists: to build a modern, high-quality primary school in Sainthia that rejects stressful cramming in favor of holistic growth.
              </p>
              <p>
                Over the past 12+ years, the institution has grown into Birbhum&apos;s trusted foundational academy, preparing hundreds of young boys and girls for confident transitions into reputed high schools throughout West Bengal.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3 bg-[#EAF5F7] rounded-xl border border-[#A5D1DC]/60 text-xs">
                <span className="text-slate-500 block">Registration</span>
                <strong className="text-[#243B43]">S/2L/14754 OF 2013-14</strong>
              </div>
              <div className="p-3 bg-[#EAF5F7] rounded-xl border border-[#A5D1DC]/60 text-xs">
                <span className="text-slate-500 block">U-DISE Code</span>
                <strong className="font-mono text-[#308599]">{SCHOOL_INFO.udiseNo}</strong>
              </div>
              <div className="p-3 bg-[#EAF5F7] rounded-xl border border-[#A5D1DC]/60 text-xs">
                <span className="text-slate-500 block">Affiliation Wing</span>
                <strong className="text-[#243B43]">KG to Class IV</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#EAF5F7] p-6 sm:p-8 rounded-3xl border border-[#A5D1DC] space-y-4">
            <h3 className="text-lg font-bold text-[#243B43] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#308599]" />
              <span>Institutional Pillars</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                <span><strong>Child Safety First:</strong> Guarded gates, monitored corridors, and female care attendants for little learners.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                <span><strong>Holistic Balance:</strong> Daily blending of phonics, mental math, Bengali literature, sports, and music.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                <span><strong>Parental Trust:</strong> Transparent diaries, weekly teacher feedback, and open office hours.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#A5D1DC] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F7] text-[#308599] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#243B43]">
              Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              To provide every child in Sainthia and neighboring rural areas with an inspiring, safe, and academically sound foundational education. We dedicate ourselves to fostering bilingual reading fluency, logical numeracy, emotional security, and ethical character without rote memorization anxiety.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#A5D1DC] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F7] text-[#308599] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#243B43]">
              Our Vision
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              To be the benchmark primary learning sanctuary in Birbhum district, recognized for nurturing joyful, compassionate, and intellectually curious young citizens who excel in their subsequent academic journeys while remaining grounded in cultural ethics.
            </p>
          </div>
        </section>

        {/* Core Values 6-Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#308599]">
              Ethos & Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43]">
              The Values That Guide Every Classroom Hour
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#308599] transition-all space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#308599]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#243B43]">{val.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Headmaster's Welcome Desk */}
      <WelcomeMessage />

      <Footer onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <QuickActionRail onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
