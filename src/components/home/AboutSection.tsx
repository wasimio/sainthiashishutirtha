'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Building
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

export default function AboutSection() {
  return (
    <section className="py-14 sm:py-18 bg-[#EAF5F7]/30 border-b border-slate-200">
      <div className="site-container space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: School Image Showcase */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[5/4]">
              <Image
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80"
                alt="Classroom learning environment at Sainthia Shishutirtha"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#243B43]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5D1DC]">
                  Sainthia, Birbhum
                </span>
                <p className="text-xs font-medium text-slate-200">
                  Established in {SCHOOL_INFO.estdYear} to elevate foundational schooling standards in the community.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Institutional Story */}
          <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC] shadow-2xs">
              <Building className="w-3.5 h-3.5 text-[#308599]" />
              <span>About Sainthia Shishutirtha</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B43] tracking-tight">
              A Warm, Value-Centered Foundation for Early Learners
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                Founded in 2013, <strong>Sainthia Shishutirtha</strong> was established with a singular conviction: that early childhood education from Kindergarten through Class IV must be grounded in affection, sensory discovery, and strong bilingual foundations rather than rote memorization.
              </p>
              <p>
                We believe that every child develops at their own natural pace. In our classrooms, small batch sizes allow teachers to understand each student deeply, nurturing confident communicators and kind peers who are well-prepared for senior school transitions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                <span><strong>Holistic Curriculum:</strong> Phonics, mental math, Sahaj Path Bengali, and environmental inquiry.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#308599] shrink-0 mt-0.5" />
                <span><strong>Child Safety:</strong> 24x7 monitored campus, verified escorts, and pure RO drinking water.</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>Read Full History & Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
