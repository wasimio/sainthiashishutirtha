'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
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
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/lib/auth/authorization';
import { SCHOOL_INFO } from '@/data/schoolData';

function isValidInternalRedirect(path: string | null): boolean {
  if (!path) return false;
  return (
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !path.includes(':\\') &&
    !path.includes('http:') &&
    !path.includes('https:')
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const errorParam = searchParams.get('error');

  const [selectedRole, setSelectedRole] = useState<'admin' | 'principal' | 'teacher' | 'finance' | 'parent' | 'council'>('council');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (errorParam === 'account_deactivated') {
      return 'Your account is deactivated. Please consult the school administration.';
    }
    if (errorParam === 'unauthorized_role') {
      return 'Your account is not authorized to access that portal.';
    }
    return null;
  });

  const isDevelopment = process.env.NODE_ENV !== 'production';

  const roleConfigs = {
    council: {
      name: 'Governing Council Member',
      email: 'council@shishutirtha.org',
      color: 'bg-[#308599] text-white',
      icon: Shield,
      desc: 'Executive oversight of enrollment, daily attendance, financial ledgers, and governance.',
    },
    admin: {
      name: 'Management & Super Admin',
      email: 'admin@shishutirtha.org',
      color: 'bg-amber-400 text-slate-900',
      icon: Shield,
      desc: 'Full school operations, admissions oversight, staff allocation, and institutional reports.',
    },
    principal: {
      name: 'Headmaster / Principal',
      email: 'headmaster@shishutirtha.org',
      color: 'bg-teal-500 text-white',
      icon: GraduationCap,
      desc: 'Academic leadership, timetable schedules, circular approvals, and faculty mentorship.',
    },
    teacher: {
      name: 'Class Teacher & Staff',
      email: 'teacher.ganguly@shishutirtha.org',
      color: 'bg-indigo-500 text-white',
      icon: GraduationCap,
      desc: 'Daily student attendance, syllabus homework, assessment marking, and student diary remarks.',
    },
    finance: {
      name: 'Finance & Accounts',
      email: 'accounts@shishutirtha.org',
      color: 'bg-emerald-500 text-white',
      icon: CreditCard,
      desc: 'Fee collection ledgers, dues, automated billing vouchers, and payment receipt printouts.',
    },
    parent: {
      name: 'Parent & Guardian',
      email: 'parent.sen@example.com',
      color: 'bg-sky-500 text-white',
      icon: UserCheck,
      desc: 'Monitor your linked child\'s attendance, daily routine, homework tasks, and fee clearance.',
    },
  };

  const handleRoleSelect = (roleKey: keyof typeof roleConfigs) => {
    setSelectedRole(roleKey);
    setEmail(roleConfigs[roleKey].email);
    setPassword('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError || !authData?.user) {
        setErrorMessage('Invalid email or password. Please verify your credentials and try again.');
        setIsLoading(false);
        return;
      }

      // 2. Query trusted public.profiles record
      const { data: rawProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      const profile = rawProfile as UserProfile | null;

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setErrorMessage('User account profile not found. Please contact the school administrative desk.');
        setIsLoading(false);
        return;
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        setErrorMessage('This user account has been deactivated. Please contact the headmaster office.');
        setIsLoading(false);
        return;
      }

      // 3. Determine authorized destination by database role
      let defaultRoute = '/portal/parent';
      if (profile.role === 'admin') {
        defaultRoute = '/portal/admin';
      } else if (profile.role === 'staff') {
        defaultRoute = '/portal/staff';
      }

      let destination = defaultRoute;

      // 4. Validate redirect parameter against role permissions
      if (redirectParam && isValidInternalRedirect(redirectParam)) {
        if (redirectParam.startsWith('/portal/admin') || redirectParam.startsWith('/portal/council')) {
          if (profile.role === 'admin') destination = redirectParam;
        } else if (redirectParam.startsWith('/portal/staff')) {
          if (profile.role === 'staff' || profile.role === 'admin') destination = redirectParam;
        } else if (redirectParam.startsWith('/portal/parent')) {
          if (profile.role === 'parent' || profile.role === 'admin') destination = redirectParam;
        }
      }

      router.push(destination);
      router.refresh();
    } catch {
      setErrorMessage('A network communication error occurred. Please check your connection and retry.');
      setIsLoading(false);
    }
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
        {/* Prototype Quick Selector Card (Development Only) */}
        {isDevelopment && (
          <div className="bg-[#243B43] text-white p-5 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Role Demonstration Quick Switcher:
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                Dev Preview
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Select an account persona to prefill sample email address for testing:
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
        )}

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
                priority
              />
            </div>
            <h1 className="text-2xl font-black text-[#243B43]">
              School Portal Sign In
            </h1>
            <p className="text-xs text-slate-500">
              Sign in with your verified Supabase credentials to access your administrative dashboard or student ledger
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

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243B43]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@shishutirtha.org"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] disabled:opacity-50"
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
                  onClick={() => alert('Password reset links can be requested from the school office or administrator.')}
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
                  placeholder="Enter your account password"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] disabled:opacity-50"
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
              className="w-full py-3.5 bg-[#308599] hover:bg-[#266b7b] disabled:bg-slate-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100">
            <span>New admission seeking parents? </span>
            <Link href="/admissions" className="text-[#308599] font-bold hover:underline">
              Apply online for admission 2026–27
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#EAF5F7] via-slate-50 to-[#A5D1DC]/30 flex items-center justify-center">
          <div className="text-xs font-semibold text-slate-500">Loading sign in portal...</div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
