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
  GraduationCap,
  LogIn
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

interface NavbarProps {
  onOpenAdmissionModal?: () => void;
}

export default function Navbar({ onOpenAdmissionModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPortalsDropdownOpen, setIsPortalsDropdownOpen] = useState(false);
  const [showPrototypeBar, setShowPrototypeBar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Faculty', href: '/faculty' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Notices', href: '/notices' },
    { label: 'Contact', href: '/contact' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Slim Top Bar: Contact + U-DISE + Prototype Toggle */}
      <div className="bg-[#243B43] text-white text-xs px-4 py-1.5 border-b border-[#308599]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3 h-3 text-[#A5D1DC]" />
              Sainthia, Birbhum, W.B.
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <span className="bg-[#308599] text-white font-bold px-1.5 py-0.2 rounded text-[10px]">U-DISE</span>
              <span className="font-mono">{SCHOOL_INFO.udiseNo}</span>
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <a
              href={`tel:${SCHOOL_INFO.phone.split('/')[0].trim()}`}
              className="hidden lg:inline-flex items-center gap-1 text-[#A5D1DC] hover:text-white font-medium"
            >
              <Phone className="w-3 h-3" />
              <span>{SCHOOL_INFO.phone.split('/')[0].trim()}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setShowPrototypeBar(!showPrototypeBar)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 font-semibold transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Prototype Switcher</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showPrototypeBar ? 'rotate-180' : ''}`} />
            </button>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#308599] hover:bg-[#266b7b] text-white font-bold transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Collapsible Prototype Navigation Bar */}
      {showPrototypeBar && (
        <div className="bg-[#1b2e35] text-white text-xs px-4 py-2 border-b border-amber-500/30 animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="text-amber-300 font-bold text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Role Demonstration Screens:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <Link
                href="/admin"
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  pathname.startsWith('/admin') && pathname !== '/admin/admissions'
                    ? 'bg-amber-400 text-slate-900 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-amber-200'
                }`}
              >
                <Shield className="w-3 h-3" />
                Admin Dashboard
              </Link>
              <Link
                href="/admin/admissions"
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  pathname === '/admin/admissions'
                    ? 'bg-teal-400 text-slate-900 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-teal-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                Admissions CRM
              </Link>
              <Link
                href="/parent"
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  pathname === '/parent'
                    ? 'bg-emerald-400 text-slate-900 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-emerald-200'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                Parent Portal
              </Link>
              <Link
                href="/parent/homework"
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  pathname === '/parent/homework'
                    ? 'bg-indigo-400 text-slate-900 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-indigo-200'
                }`}
              >
                <Calendar className="w-3 h-3" />
                Homework
              </Link>
              <Link
                href="/parent/attendance"
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  pathname === '/parent/attendance'
                    ? 'bg-sky-400 text-slate-900 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-sky-200'
                }`}
              >
                <Calendar className="w-3 h-3" />
                Attendance
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        aria-label="Primary Navigation"
        className={`transition-all duration-200 ${
          isScrolled
            ? 'shadow-md border-b border-slate-100 py-2'
            : 'border-b border-slate-200 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Brand Title */}
            <Link href="/" className="flex items-center gap-3 group text-left shrink-0">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden border-2 border-[#308599]/20 shadow-xs group-hover:border-[#308599] transition-all">
                <Image
                  src="/logo.png"
                  alt="Sainthia Shishutirtha School Official Seal"
                  width={56}
                  height={56}
                  priority
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-[#243B43] tracking-tight group-hover:text-[#308599] transition-colors uppercase leading-none">
                  Sainthia Shishutirtha
                </span>
                <span className="text-[11px] font-semibold text-[#308599] mt-0.5">
                  KG to Class IV • Estd. 2013
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block">
                  Govt. Regd. S/2L/14754 • Sainthia, Birbhum
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1 text-xs font-semibold text-[#243B43]">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-[#EAF5F7] text-[#308599] font-bold'
                        : 'hover:text-[#308599] hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Actions: Admission CTA + Portals Dropdown */}
            <div className="hidden md:flex items-center gap-2.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPortalsDropdownOpen(!isPortalsDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsPortalsDropdownOpen(false), 200)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-[#243B43] hover:bg-[#EAF5F7] hover:border-[#A5D1DC] transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-[#308599]" />
                  <span>Portals</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isPortalsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Management Portals
                    </div>
                    <Link
                      href="/login"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <LogIn className="w-4 h-4 text-[#308599] mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Login Portal</div>
                        <div className="text-[11px] text-slate-500">Sign in with credentials</div>
                      </div>
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <Link
                      href="/admin"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Admin Dashboard</div>
                        <div className="text-[11px] text-slate-500">Administrative controls</div>
                      </div>
                    </Link>
                    <Link
                      href="/parent"
                      className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#EAF5F7] transition-colors text-left"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[#243B43]">Parent Portal</div>
                        <div className="text-[11px] text-slate-500">Student daily ledger</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/admissions"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Admissions 2025–26</span>
              </Link>
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex items-center gap-2 xl:hidden">
              <Link
                href="/admissions"
                className="px-3 py-1.5 bg-[#308599] text-white text-xs font-bold rounded-lg"
              >
                Admissions
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#243B43] hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isLinkActive(link.href)
                    ? 'bg-[#EAF5F7] text-[#308599] font-bold'
                    : 'text-[#243B43] hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-100 text-[#243B43] font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Portal Login</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmissionModal?.();
                }}
                className="w-full py-3 bg-[#308599] text-white text-xs font-bold rounded-xl shadow-xs text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Admission Enquiry</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
