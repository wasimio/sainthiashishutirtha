'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  User,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGrade?: string;
}

export default function AdmissionModal({ isOpen, onClose, defaultGrade }: AdmissionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'Boy',
    applyingGrade: defaultGrade || 'Kindergarten (KG)',
    parentName: '',
    relationship: 'Mother',
    phone: '',
    email: '',
    residentialArea: 'Sainthia Town',
    remarks: ''
  });
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const activeGrade = selectedGrade !== null ? selectedGrade : (defaultGrade || 'Kindergarten (KG)');

  // Open/Close dialog using showModal() per Modern Web Guidance
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Fallback for light-dismiss on browsers that do not support closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        onClose();
      }
    };

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('click', handleDialogClick);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.parentName || !formData.phone) return;
    const randomId = `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(randomId);
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setSelectedGrade(null);
    setFormData({
      studentName: '',
      dob: '',
      gender: 'Boy',
      applyingGrade: defaultGrade || 'Kindergarten (KG)',
      parentName: '',
      relationship: 'Mother',
      phone: '',
      email: '',
      residentialArea: 'Sainthia Town',
      remarks: ''
    });
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
      aria-labelledby="dialogTitle"
      className="backdrop:bg-black/60 backdrop:backdrop-blur-xs rounded-3xl p-0 max-w-2xl w-[95%] sm:w-full overflow-hidden shadow-2xl border border-slate-200 m-auto text-[#243B43]"
    >
      <div className="bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#308599] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Academic Session 2025–2026</span>
          </div>

          <h2 id="dialogTitle" className="text-xl sm:text-2xl font-black text-white">
            Online Admission Enquiry
          </h2>
          <p className="text-xs text-slate-200 mt-1">
            Sainthia Shishutirtha • KG through Class IV (U-DISE: {SCHOOL_INFO.udiseNo})
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submittedRef ? (
            <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-emerald-950">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-600">
                  Thank you for your interest in Sainthia Shishutirtha.
                </p>
              </div>

              {/* Reference Ticket */}
              <div className="bg-[#EAF5F7] p-5 rounded-2xl border border-[#A5D1DC] text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#A5D1DC]">
                  <span className="font-bold text-[#308599]">Enquiry Reference:</span>
                  <span className="font-mono font-black text-[#243B43] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {submittedRef}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Student Name</span>
                    <strong>{formData.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Grade Applied</span>
                    <strong>{activeGrade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Parent Name</span>
                    <strong>{formData.parentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contact Mobile</span>
                    <strong>{formData.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 max-w-md mx-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
                <AlertCircle className="w-4 h-4 text-amber-600 inline mr-1 -mt-0.5" />
                <span>Our admissions office will call you within 24 working hours to schedule a friendly campus interaction and document verification.</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#308599] text-white text-xs font-bold rounded-xl hover:bg-[#266b7b] transition-colors"
                >
                  Done & Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Child Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#308599] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>1. Child&apos;s Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Child&apos;s Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sourav Roy"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Class for Admission *
                    </label>
                    <select
                      value={activeGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599] bg-white"
                    >
                      <option value="Pre-Primary / Nursery">Pre-Primary / Nursery (Age 3+)</option>
                      <option value="Kindergarten (KG)">Kindergarten / KG (Age 4+)</option>
                      <option value="Class I">Class I (Age 6+)</option>
                      <option value="Class II">Class II (Age 7+)</option>
                      <option value="Class III">Class III (Age 8+)</option>
                      <option value="Class IV">Class IV (Age 9+)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Gender
                    </label>
                    <div className="flex gap-4 pt-1.5 text-xs font-medium">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Boy"
                          checked={formData.gender === 'Boy'}
                          onChange={() => setFormData({ ...formData, gender: 'Boy' })}
                          className="text-[#308599] focus:ring-[#308599]"
                        />
                        <span>Boy</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Girl"
                          checked={formData.gender === 'Girl'}
                          onChange={() => setFormData({ ...formData, gender: 'Girl' })}
                          className="text-[#308599] focus:ring-[#308599]"
                        />
                        <span>Girl</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Details */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#308599] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>2. Parent / Guardian Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Subir Roy"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98321 44552"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#243B43]">
                      Residential Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. College More / Station Road, Sainthia"
                      value={formData.residentialArea}
                      onChange={(e) => setFormData({ ...formData, residentialArea: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243B43]">
                    Additional Notes or Previous School (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any specific queries or details regarding your child's previous schooling..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#308599] hover:bg-[#266b7b] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Submit Admission Enquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
