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
  Clock,
  Sparkles,
  LogIn
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

interface NavbarProps {
  onOpenAdmissionModal?: () => void;
}

export default function Navbar({ onOpenAdmissionModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

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

  const primaryPhone = SCHOOL_INFO.phone.split('/')[0].trim();

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Top Utility Strip */}
      <div className="bg-[#243B43] text-white text-xs border-b border-[#308599]/30">
        <div className="site-container py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A5D1DC]" />
              <span>Sainthia, Birbhum, W.B.</span>
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#A5D1DC]" />
              <span>Mon – Sat: 8:00 AM – 2:00 PM</span>
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <a
              href={`tel:${primaryPhone}`}
              className="hidden md:inline-flex items-center gap-1.5 hover:text-[#A5D1DC] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#A5D1DC]" />
              <span>Helpline: {primaryPhone}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-medium transition-colors"
            >
              <LogIn className="w-3 h-3 text-[#A5D1DC]" />
              <span>Portal Sign-In</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        aria-label="Main Navigation"
        className={`transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 py-2.5'
            : 'bg-white border-slate-100 py-3.5'
        }`}
      >
        <div className="site-container flex items-center justify-between gap-4">
          {/* Logo & Institution Branding */}
          <Link
            href="/"
            className="flex items-center gap-3 text-left shrink-0 group focus:outline-hidden focus:ring-2 focus:ring-[#308599] rounded-xl p-1"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden border-2 border-[#308599]/30 group-hover:border-[#308599] transition-colors bg-white">
              <Image
                src="/logo.png"
                alt="Sainthia Shishutirtha School Seal"
                width={56}
                height={56}
                priority
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold text-[#243B43] tracking-tight group-hover:text-[#308599] transition-colors uppercase leading-tight font-sans">
                Sainthia Shishutirtha
              </span>
              <span className="text-[11px] font-semibold text-[#308599] leading-tight">
                Primary & Foundational School (KG – Class IV)
              </span>
              <span className="text-[10px] text-slate-400 leading-tight hidden sm:block">
                Estd. 2013 • Sainthia, District Birbhum
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 text-[13px] font-semibold text-[#243B43]">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg transition-all relative ${
                    active
                      ? 'text-[#308599] bg-[#EAF5F7] font-bold'
                      : 'hover:text-[#308599] hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#308599] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Header Action: Admissions CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Admissions 2025–26</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href="/admissions"
              className="md:hidden px-3 py-1.5 bg-[#308599] text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Admissions
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#243B43] focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#EAF5F7] text-[#308599] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-3 space-y-2">
              <Link
                href="/login"
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#243B43] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <LogIn className="w-4 h-4 text-[#308599]" />
                <span>Portal Sign-In</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmissionModal?.();
                }}
                className="w-full py-3 bg-[#308599] text-white text-xs font-bold rounded-xl shadow-xs text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Quick Admission Enquiry</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
