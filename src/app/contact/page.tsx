'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import AdmissionModal from '@/components/modals/AdmissionModal';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    classInterest: 'Kindergarten (KG)',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <PageHeader
        badge="Connect & Visit"
        title="Contact Sainthia Shishutirtha"
        subtitle="We invite prospective parents to visit our campus, observe a classroom session, and consult with our academic coordinators."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <main className="flex-1 site-container py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Campus Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#EAF5F7] p-6 sm:p-8 rounded-3xl border border-[#A5D1DC] space-y-6">
              <h2 className="text-xl font-bold text-[#243B43]">
                Office & Visitor Information
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#308599] shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#243B43]">Campus Address</strong>
                    <span>{SCHOOL_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#308599] shadow-2xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#243B43]">Admission Helpline</strong>
                    <span>{SCHOOL_INFO.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#308599] shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#243B43]">Official Email</strong>
                    <span>{SCHOOL_INFO.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#308599] shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#243B43]">Visiting Hours</strong>
                    <span>{SCHOOL_INFO.officeHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-xs bg-slate-50 relative aspect-[16/10] flex flex-col justify-end p-6">
              <div className="absolute inset-0 bg-[#A5D1DC]/20 flex items-center justify-center opacity-60 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(#308599_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-10 h-10 bg-[#308599] text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="mt-1 bg-white text-[#243B43] px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-2xs border border-slate-200">
                  Sainthia Shishutirtha
                </div>
              </div>

              <div className="relative z-10 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2">
                <div className="text-xs">
                  <div className="font-bold text-[#243B43]">Central Sainthia, Birbhum</div>
                  <div className="text-[11px] text-slate-500">Accessible from Railway Station & Town Road</div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Simulated action: Opens Google Maps directions to Sainthia Shishutirtha.')}
                  className="px-3 py-1.5 bg-[#308599] text-white text-xs font-semibold rounded-lg hover:bg-[#266b7b] transition-colors shrink-0 flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Enquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-[#243B43] mb-2">
              Send an Enquiry or Campus Visit Request
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Submit your inquiry below. Our admissions desk will contact you within 24 working hours.
            </p>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-emerald-950">
                    Enquiry Recorded!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Thank you, <strong>{formData.parentName}</strong>. Our academic counselor will call you at <strong>{formData.phone}</strong> regarding your query for <strong>{formData.classInterest}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      parentName: '',
                      phone: '',
                      email: '',
                      classInterest: 'Kindergarten (KG)',
                      message: ''
                    });
                  }}
                  className="text-xs font-bold text-[#308599] hover:underline pt-2"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#243B43]">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smt. Debaleena Ghosh"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#243B43]">
                      Contact Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98321 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#243B43]">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#243B43]">
                      Class of Interest
                    </label>
                    <select
                      value={formData.classInterest}
                      onChange={(e) => setFormData({ ...formData, classInterest: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] transition-all bg-white"
                    >
                      <option value="Pre-Primary / Nursery">Pre-Primary / Nursery (Age 3+)</option>
                      <option value="Kindergarten (KG)">Kindergarten (KG) (Age 4+)</option>
                      <option value="Class I">Class I (Age 6+)</option>
                      <option value="Class II">Class II (Age 7+)</option>
                      <option value="Class III">Class III (Age 8+)</option>
                      <option value="Class IV">Class IV (Age 9+)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#243B43]">
                    Your Message / Specific Question
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you'd like to know about our school timings, transport, curriculum, or visiting hours..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#308599] hover:bg-[#266b7b] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry to School Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <QuickActionRail onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
