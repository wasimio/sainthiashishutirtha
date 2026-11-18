import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import {
  Clock,
  Sparkles,
  ArrowRight,
  Home,
  FileText,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Users,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

export const metadata: Metadata = {
  title: 'School Portal Under Development | Sainthia Shishutirtha',
  description:
    'Sainthia Shishu Tirtha School Portal is currently under active development as part of our Phase 2 digital rollout.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalComingSoonPage() {
  const upcomingFeatures = [
    {
      title: 'Parent & Guardian Portal',
      description:
        'Track daily student attendance, homework assignments, school circulars, exam schedules, and academic progress reports in real time.',
      icon: Users,
      badge: 'Phase 2 Initiative',
    },
    {
      title: 'Teacher & Academic Console',
      description:
        'Manage classroom rosters, daily roll-calls, curriculum progress tracking, term evaluations, and direct parent-teacher communications.',
      icon: GraduationCap,
      badge: 'Phase 2 Initiative',
    },
    {
      title: 'Governing Council & Administration',
      description:
        'Comprehensive institutional analytics, fee ledgers, staff allocations, admissions management, and compliance governance.',
      icon: Calendar,
      badge: 'Phase 2 Initiative',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar />

      <PageHeader
        badge="System Notice • Phase 2 Digital Initiative"
        title="Institutional Portal Under Development"
        subtitle="Our unified digital school management system is currently undergoing scheduled development and testing."
        breadcrumbs={[{ label: 'School Portal' }]}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 site-container py-12 space-y-12 focus:outline-hidden">
        {/* Core Announcement Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#243B43] via-[#1b4b57] to-[#308599] text-white p-8 sm:p-12 shadow-xl border border-[#308599]/30">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold tracking-wide uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>Development Status • Scheduled for Phase 2</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Sainthia Shishu Tirtha School Portal is Under Development
            </h1>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
              We are engineering a secure, modern digital management portal for our parents, students, faculty, and administrative council. During this development and hardening phase, direct online portal access is offline.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#243B43] font-bold text-sm hover:bg-[#EAF5F7] transition-all shadow-md active:scale-95"
              >
                <Home className="w-4 h-4 text-[#308599]" />
                <span>Return to Public Website</span>
              </Link>
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-900 font-bold text-sm hover:bg-amber-300 transition-all shadow-md active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Admissions Enquiry (Open)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
          <div className="absolute right-8 top-8 opacity-10 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>
        </div>

        {/* Feature Preview Grid */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#243B43]">
              What We Are Building for Our Community
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              The integrated school platform will offer dedicated portals tailored to each stakeholder group:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-[#EAF5F7]/40 rounded-2xl p-6 border border-[#A5D1DC]/60 flex flex-col justify-between hover:border-[#308599] transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#308599]/10 text-[#308599] flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#308599] bg-white px-2.5 py-1 rounded-full border border-[#A5D1DC]/60">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#243B43]">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#A5D1DC]/30 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Active Engineering</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Details & Urgent Assistance */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Phone className="w-3 h-3" />
              <span>Administrative Support</span>
            </div>
            <h2 className="text-xl font-bold text-[#243B43]">
              Need Urgent Student or Administrative Support?
            </h2>
            <p className="text-sm text-slate-600">
              For urgent administrative inquiries, student verification, or admissions queries while the portal is in development, please reach our school office directly:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-[#F0F8FA] border border-[#A5D1DC]/50 space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#308599]" />
                Official Helpline
              </span>
              <p className="text-base font-bold text-[#243B43]">
                +91 94342 27458
              </p>
              <p className="text-xs text-slate-600">
                Alternate: {SCHOOL_INFO.primaryPhone} / {SCHOOL_INFO.secondaryPhone}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0F8FA] border border-[#A5D1DC]/50 space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#308599]" />
                Official Email
              </span>
              <p className="text-base font-bold text-[#243B43]">
                <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-[#308599] transition-colors">
                  {SCHOOL_INFO.email}
                </a>
              </p>
              <p className="text-xs text-slate-600">
                Responses typically within 1 working day
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0F8FA] border border-[#A5D1DC]/50 space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#308599]" />
                Office Hours
              </span>
              <p className="text-sm font-bold text-[#243B43]">
                Summer: {SCHOOL_INFO.summerTiming}
              </p>
              <p className="text-xs text-slate-600">
                Winter: {SCHOOL_INFO.winterTiming}
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#308599] shrink-0" />
            <span>Campus: {SCHOOL_INFO.address}</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
