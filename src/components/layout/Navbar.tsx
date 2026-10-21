'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  MapPin,
  ChevronDown,
  Sparkles,
  Shield,
  UserCheck,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

interface NavbarProps {
  onOpenAdmissionModal?: () => void;
}

export default function Navbar({ onOpenAdmissionModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPortalsDropdownOpen, setIsPortalsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/#hero' },
    { label: 'About School', href: '/#about' },
    { label: 'Classes & Programs', href: '/#programs' },
    { label: 'Facilities', href: '/#facilities' },
    { label: 'Why Shishutirtha', href: '/#why-us' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Notices & Events', href: '/#notices' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      {/* Prototype Switcher Banner */}
      <aside aria-label="Prototype demo switcher" className="bg-[#243B43] text-white text-xs px-4 py-2 border-b border-[#308599]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#308599] text-white font-semibold px-2 py-0.5 rounded-full text-[11px]">
              <Sparkles className="w-3 h-3" />
              Prototype Review
            </span>
            <span className="hidden sm:inline text-slate-300">
              Interactive demonstration for School Management
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-medium">
            <span className="text-slate-400 hidden md:inline">Quick Jump:</span>
            <Link
              href="/"
              className={`px-2.5 py-1 rounded transition-colors ${
                pathname === '/'
                  ? 'bg-white text-[#243B43] font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Public Website
            </Link>
            <Link
              href="/admin"
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                pathname.startsWith('/admin')
                  ? 'bg-amber-400 text-slate-900 font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-amber-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin Portal
            </Link>
            <Link
              href="/admin/admissions"
              className={`px-2.5 py-1 rounded transition-colors hidden lg:flex items-center gap-1 ${
                pathname === '/admin/admissions'
                  ? 'bg-teal-400 text-slate-900 font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-teal-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              Admissions Table
            </Link>
            <Link
              href="/parent"
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                pathname.startsWith('/parent')
                  ? 'bg-emerald-400 text-slate-900 font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-200'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              Parent Portal
            </Link>
          </div>
        </div>
      </aside>

      {/* Top Info Bar */}
      <header className="bg-[#EAF5F7] border-b border-[#A5D1DC]/40 text-xs text-[#243B43] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="bg-[#308599] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">U-DISE</span>
              <span className="tracking-wide">{SCHOOL_INFO.udiseNo}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Govt Regd</span>
              <span>{SCHOOL_INFO.affiliation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#308599]" />
              <span>Sainthia, Birbhum, West Bengal</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${SCHOOL_INFO.phone.split('/')[0].trim()}`}
              className="flex items-center gap-1 text-[#308599] font-semibold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{SCHOOL_INFO.phone.split('/')[0].trim()}</span>
            </a>
            <div className="inline-flex items-center gap-1 bg-[#308599]/10 text-[#308599] font-semibold px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Admissions 2025–26 Open (KG – IV)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navbar */}
      <nav
        aria-label="Main Navigation"
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand Title */}
            <Link href="/" className="flex items-center gap-3.5 group text-left">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden border-2 border-[#308599]/20 shadow-xs group-hover:border-[#308599] transition-all">
                <Image
                  src="/logo.png"
                  alt="Sainthia Shishutirtha School Official Logo"
                  width={64}
                  height={64}
                  priority
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-extrabold text-[#243B43] tracking-tight group-hover:text-[#308599] transition-colors uppercase">
                    Sainthia Shishutirtha
                  </span>
                </div>
                <span className="text-xs font-medium text-[#308599] tracking-normal">
                  Foundational & Primary School • Estd. 2013
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:block">
                  KG to Class IV • Sainthia, Birbhum (W.B.)
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1 text-sm font-medium text-[#243B43]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 rounded-lg hover:text-[#308599] hover:bg-[#EAF5F7] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Portals Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPortalsDropdownOpen(!isPortalsDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsPortalsDropdownOpen(false), 200)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[#A5D1DC] text-[#243B43] bg-white hover:bg-[#EAF5F7] transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-[#308599]" />
                  <span>Portals</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isPortalsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Prototype Portals
                    </div>
                    <Link
                      href="/admin"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Admin Dashboard</div>
                        <div className="text-[11px] text-slate-500">School metrics & controls</div>
                      </div>
                    </Link>
                    <Link
                      href="/admin/admissions"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <Layers className="w-4 h-4 text-teal-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Admissions Table</div>
                        <div className="text-[11px] text-slate-500">Applications & review status</div>
                      </div>
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <Link
                      href="/parent"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Parent Dashboard</div>
                        <div className="text-[11px] text-slate-500">Student daily overview</div>
                      </div>
                    </Link>
                    <Link
                      href="/parent/homework"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <Calendar className="w-4 h-4 text-indigo-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Homework & Tasks</div>
                        <div className="text-[11px] text-slate-500">Daily syllabus assignments</div>
                      </div>
                    </Link>
                    <Link
                      href="/parent/attendance"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <Calendar className="w-4 h-4 text-sky-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Attendance Record</div>
                        <div className="text-[11px] text-slate-500">Monthly presence calendar</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Admission CTA */}
              <button
                type="button"
                onClick={onOpenAdmissionModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admission Enquiry</span>
              </button>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={onOpenAdmissionModal}
                className="px-2.5 py-1.5 bg-[#308599] text-white text-xs font-bold rounded-md"
              >
                Enquire
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#243B43] hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#243B43] hover:bg-[#EAF5F7] hover:text-[#308599]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                Prototype Previews
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold"
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  Admin Dashboard
                </Link>
                <Link
                  href="/parent"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Parent Portal
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmissionModal?.();
                }}
                className="w-full mt-3 py-3 bg-[#308599] text-white text-sm font-bold rounded-lg shadow-sm text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Apply for Admission 2025–26
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
