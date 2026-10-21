'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

interface FooterProps {
  onOpenAdmissionModal?: () => void;
}

export default function Footer({ onOpenAdmissionModal }: FooterProps) {
  return (
    <footer className="bg-[#243B43] text-white pt-16 pb-8 border-t-4 border-[#308599]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: About Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white p-1 shrink-0 overflow-hidden shadow-md">
                <Image
                  src="/logo.png"
                  alt="Sainthia Shishutirtha Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-white tracking-tight uppercase">
                  Sainthia Shishutirtha
                </h3>
                <p className="text-xs text-[#A5D1DC] font-medium">
                  Estd. 2013 • KG to Class IV
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Committed to imparting value-based, joyful early childhood and primary education. Cultivating foundational curiosity, bilingual competence, and empathetic character in the heart of Sainthia, Birbhum.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#A5D1DC]">U-DISE Code:</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">{SCHOOL_INFO.udiseNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#A5D1DC]">Registration:</span>
                <span className="text-white text-[11px]">{SCHOOL_INFO.affiliation}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Academic Wings */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#308599] pl-2.5">
              Academic Divisions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/#programs" className="hover:text-[#A5D1DC] flex items-center justify-between group">
                  <span>Pre-Primary & Nursery</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 group-hover:text-white">Ages 3–4</span>
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-[#A5D1DC] flex items-center justify-between group">
                  <span>Kindergarten (KG)</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 group-hover:text-white">Ages 4–5</span>
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-[#A5D1DC] flex items-center justify-between group">
                  <span>Junior Primary (Class I – II)</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 group-hover:text-white">Ages 6–7</span>
                </Link>
              </li>
              <li>
                <Link href="/#programs" className="hover:text-[#A5D1DC] flex items-center justify-between group">
                  <span>Senior Primary (Class III – IV)</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 group-hover:text-white">Ages 8–10</span>
                </Link>
              </li>
              <li>
                <Link href="/#facilities" className="hover:text-[#A5D1DC] flex items-center gap-1 text-[#A5D1DC] pt-2">
                  <span>Explore Campus Facilities</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation & Previews */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#308599] pl-2.5">
              Prototype Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/admin" className="hover:text-[#A5D1DC] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Admin Dashboard Preview</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/admissions" className="hover:text-[#A5D1DC] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  <span>Admissions Applications Table</span>
                </Link>
              </li>
              <li>
                <Link href="/parent" className="hover:text-[#A5D1DC] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Parent Portal Preview</span>
                </Link>
              </li>
              <li>
                <Link href="/parent/homework" className="hover:text-[#A5D1DC] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>Homework & Syllabus Tasks</span>
                </Link>
              </li>
              <li>
                <Link href="/parent/attendance" className="hover:text-[#A5D1DC] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>Attendance Calendar System</span>
                </Link>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onOpenAdmissionModal}
                className="w-full text-center py-2 px-3 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Admission Enquiry 2025–26</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Col 4: School Office & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#308599] pl-2.5">
              School Office
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A5D1DC] shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A5D1DC] shrink-0" />
                <span>{SCHOOL_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A5D1DC] shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#A5D1DC] shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer Box */}
        <div className="mt-8 p-3 rounded-lg bg-black/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Phase 1 Visual Prototype:</strong> Prepared for stakeholder review. No real student data is collected or stored on this demonstration environment.
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Official Institution: <span className="text-white font-semibold">Sainthia Shishutirtha</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 Sainthia Shishutirtha. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Government Registered School</span>
            <span>•</span>
            <span>U-DISE: 19082200103</span>
            <span>•</span>
            <span>Sainthia, Birbhum</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
