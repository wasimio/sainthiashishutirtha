'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Shield,
  UserCheck,
  GraduationCap,
  CreditCard,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'principal' | 'teacher' | 'finance' | 'parent'>('admin');
  const [email, setEmail] = useState('admin@shishutirtha.org');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleConfigs = {
    admin: {
      name: "Management & Super Admin",
      email: "admin@shishutirtha.org",
      targetRoute: "/admin",
      color: "bg-amber-400 text-slate-900",
      icon: Shield,
      desc: "Full school operations, admissions oversight, staff allocation, and institutional reports."
    },
    principal: {
      name: "Headmaster / Principal",
      email: "headmaster@shishutirtha.org",
      targetRoute: "/admin",
      color: "bg-teal-500 text-white",
      icon: GraduationCap,
      desc: "Academic leadership, timetable schedules, circular approvals, and faculty mentorship."
    },
    teacher: {
      name: "Class Teacher",
      email: "teacher.ganguly@shishutirtha.org",
      targetRoute: "/parent/homework",
      color: "bg-indigo-500 text-white",
      icon: GraduationCap,
      desc: "Daily student attendance, syllabus homework, assessment marking, and student diary remarks."
    },
    finance: {
      name: "Finance & Accounts",
      email: "accounts@shishutirtha.org",
      targetRoute: "/admin",
      color: "bg-emerald-500 text-white",
      icon: CreditCard,
      desc: "Fee collection ledgers, dues, automated billing vouchers, and payment receipt printouts."
    },
    parent: {
      name: "Parent & Guardian",
      email: "parent.sen@example.com",
      targetRoute: "/parent",
      color: "bg-sky-500 text-white",
      icon: UserCheck,
      desc: "Monitor your linked child's attendance, daily routine, homework tasks, and fee clearance."
    }
  };

  const handleRoleSelect = (roleKey: keyof typeof roleConfigs) => {
    setSelectedRole(roleKey);
    setEmail(roleConfigs[roleKey].email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push(roleConfigs[selectedRole].targetRoute);
    }, 400);
  };

  const currentRole = roleConfigs[selectedRole];
  const CurrentIcon = currentRole.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF5F7] via-slate-50 to-[#A5D1DC]/30 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="site-container w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#243B43] hover:text-[#308599] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Website</span>
        </Link>

        <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
          U-DISE: {SCHOOL_INFO.udiseNo} • Sainthia, Birbhum
        </span>
      </div>

      {/* Center Container */}
      <div className="max-w-xl w-full mx-auto my-8 space-y-6">
        {/* Prototype Quick Selector Card */}
        <div className="bg-[#243B43] text-white p-5 rounded-3xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Role Demonstration Quick Switcher:
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
              Prototype Mode
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Select a designated school role to prefill sample credentials and preview its tailored portal:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(roleConfigs) as Array<keyof typeof roleConfigs>).map((rk) => (
              <button
                key={rk}
                type="button"
                onClick={() => handleRoleSelect(rk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === rk
                    ? 'bg-amber-400 text-slate-900 shadow-xs ring-2 ring-white/50'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                {roleConfigs[rk].name.split('/')[0].split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-white p-1 mx-auto shadow-sm border border-slate-200 overflow-hidden">
              <Image
                src="/logo.png"
                alt="Sainthia Shishutirtha Seal"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-[#243B43]">
              School Portal Sign In
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to access your administrative dashboard or student ledger
            </p>
          </div>

          {/* Active Role Indicator */}
          <div className="p-3.5 rounded-2xl bg-[#EAF5F7] border border-[#A5D1DC] flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${currentRole.color}`}>
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#243B43] block">{currentRole.name}</span>
              <span className="text-[11px] text-slate-500">{currentRole.desc}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243B43]">
                Email or Official Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#243B43]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset instructions will be sent via SMS / email in production.')}
                  className="text-[11px] text-[#308599] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Accessing Portal...' : `Sign In as ${currentRole.name.split('/')[0]}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100">
            <span>New admission seeking parents? </span>
            <Link href="/admissions" className="text-[#308599] font-bold hover:underline">
              Apply online for admission 2025–26
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="site-container w-full text-center text-[11px] text-slate-400">
        © 2026 Sainthia Shishutirtha • Government Registered S/2L/14754 OF 2013-14 • Birbhum, West Bengal
      </div>
    </div>
  );
}
