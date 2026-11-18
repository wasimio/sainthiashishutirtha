'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  User,
  GraduationCap,
  AlertCircle,
  Loader2,
  PhoneCall
} from 'lucide-react';
import { SCHOOL_INFO, VERIFIED_CLASSES } from '@/data/schoolData';
import { submitAdmissionApplication } from '@/lib/actions/admissionsActions';
import { usePathname } from 'next/navigation';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { getLocaleFromPathname } from '@/lib/i18n/routing';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGrade?: string;
}

export default function AdmissionModal({ isOpen, onClose, defaultGrade }: AdmissionModalProps) {
  const locale = getLocaleFromPathname(usePathname());
  const dictionary = getUiDictionary(locale);
  const copy = dictionary.admissionForm;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'Boy',
    applyingGrade: defaultGrade || 'KG',
    parentName: '',
    relationship: 'Mother',
    phone: '',
    email: '',
    residentialArea: 'Sainthia Town',
    remarks: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const activeGrade = selectedGrade !== null ? selectedGrade : (defaultGrade || 'KG');

  // Focus management and body scroll locking
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = 'hidden';

      // Focus first input field once modal opens
      requestAnimationFrame(() => {
        const firstInput = document.getElementById('admissionChildName');
        if (firstInput) {
          firstInput.focus();
        }
      });
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = '';
      if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
        previouslyFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside and cancel fallback listeners
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const result = await submitAdmissionApplication({
        studentName: formData.studentName,
        dob: formData.dob,
        gender: formData.gender,
        applyingGrade: activeGrade,
        parentName: formData.parentName,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        residentialArea: formData.residentialArea,
        remarks: formData.remarks,
        website_hp: honeypot,
      });

      if (result.success && result.applicationNo) {
        setSubmittedRef(result.applicationNo);
      } else {
        setErrorMessage(locale === 'bn' ? dictionary.forms.error : result.error || dictionary.forms.error);
        if (result.fieldErrors) {
          setFieldErrors(locale === 'bn'
            ? Object.fromEntries(Object.keys(result.fieldErrors).map((field) => [field, dictionary.forms.required]))
            : result.fieldErrors);
        }
      }
    } catch {
      setErrorMessage(dictionary.forms.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setSelectedGrade(null);
    setErrorMessage(null);
    setFieldErrors({});
    setFormData({
      studentName: '',
      dob: '',
      gender: 'Boy',
      applyingGrade: defaultGrade || 'KG',
      parentName: '',
      relationship: 'Mother',
      phone: '',
      email: '',
      residentialArea: 'Sainthia Town',
      remarks: ''
    });
    setHoneypot('');
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
      aria-labelledby="admissionDialogTitle"
      aria-describedby="admissionDialogDesc"
      className="m-auto w-[95%] max-w-2xl overflow-hidden rounded-[2rem] border border-warm-card-border p-0 text-text-headline shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-xs sm:w-full"
    >
      <div className="bg-white max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-heritage-teal p-5 text-white sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            aria-label={copy.close}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{copy.eyebrow}</span>
          </div>

          <h2 id="admissionDialogTitle" className="text-xl sm:text-2xl font-black text-white">
            {copy.title}
          </h2>
          <p id="admissionDialogDesc" className="text-xs text-slate-200 mt-1">
            {copy.subtitle}
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
                  {copy.successTitle}
                </h3>
                <p className="text-xs text-slate-600">
                  {copy.thankYou}
                </p>
              </div>

              {/* Official Reference Ticket */}
              <div className="bg-[#EAF5F7] p-5 rounded-2xl border border-[#A5D1DC] text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#A5D1DC]">
                  <span className="font-bold text-[#308599]">{copy.reference}:</span>
                  <span className="font-mono font-black text-[#243B43] bg-white px-2.5 py-1 rounded border border-slate-300 text-sm shadow-xs">
                    {submittedRef}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{copy.studentName}</span>
                    <strong>{formData.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{copy.gradeApplied}</span>
                    <strong>{activeGrade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{copy.guardian}</span>
                    <strong>{formData.parentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{copy.contact}</span>
                    <strong>{formData.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 max-w-md mx-auto bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#308599] inline mr-1 -mt-0.5" />
                <span>{copy.responseNote}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 min-h-[48px] bg-[#308599] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#266b7b] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] cursor-pointer"
                >
                  {copy.doneClose}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="space-y-5">
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-semibold">{copy.incomplete}</strong>
                    <p className="text-rose-800">{errorMessage}</p>
                    <div className="pt-1 flex items-center gap-2 text-[11px] text-rose-700">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{dictionary.navigation.helpline}: <a href={`tel:${SCHOOL_INFO.primaryPhone}`} className="font-bold underline">{SCHOOL_INFO.primaryPhone}</a></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bot Honeypot Input (hidden from humans) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Child Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#308599] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>1. {copy.childInfo}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="admissionChildName" className="text-xs font-bold text-[#243B43]">
                      {copy.childName} <span className="text-rose-500" aria-hidden="true">*</span>
                      <span className="sr-only">({dictionary.forms.required})</span>
                    </label>
                    <input
                      id="admissionChildName"
                      name="childName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder={copy.childName}
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      aria-invalid={!!fieldErrors.studentName}
                      aria-describedby={fieldErrors.studentName ? 'admissionChildNameErr' : undefined}
                      className={`w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                        fieldErrors.studentName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
                    />
                    {fieldErrors.studentName && (
                      <p id="admissionChildNameErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.studentName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="admissionGrade" className="text-xs font-bold text-[#243B43]">
                      {copy.grade} <span className="text-rose-500" aria-hidden="true">*</span>
                      <span className="sr-only">({dictionary.forms.required})</span>
                    </label>
                    <select
                      id="admissionGrade"
                      name="admissionGrade"
                      value={activeGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border border-slate-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] bg-white cursor-pointer transition-all"
                    >
                      {VERIFIED_CLASSES.map((cls) => (
                        <option key={cls.code} value={cls.name}>
                          {locale === 'bn' ? cls.code : `${cls.name} (${cls.wing})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="admissionDob" className="text-xs font-bold text-[#243B43]">
                      {copy.dateOfBirth} <span className="text-rose-500" aria-hidden="true">*</span>
                      <span className="sr-only">({dictionary.forms.required})</span>
                    </label>
                    <input
                      id="admissionDob"
                      name="dob"
                      type="date"
                      required
                      autoComplete="bday"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      aria-invalid={!!fieldErrors.dob}
                      aria-describedby={fieldErrors.dob ? 'admissionDobErr' : undefined}
                      className={`w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                        fieldErrors.dob ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
                    />
                    {fieldErrors.dob && (
                      <p id="admissionDobErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.dob}</p>
                    )}
                  </div>

                  <fieldset className="space-y-1.5">
                    <legend className="text-xs font-bold text-[#243B43]">
                      {copy.gender} <span className="text-rose-500" aria-hidden="true">*</span>
                    </legend>
                    <div className="flex gap-4 pt-0.5 text-xs font-medium">
                      <label htmlFor="admissionGenderBoy" className="flex items-center gap-2 cursor-pointer min-h-[44px] px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">
                        <input
                          id="admissionGenderBoy"
                          type="radio"
                          name="gender"
                          value="Boy"
                          checked={formData.gender === 'Boy'}
                          onChange={() => setFormData({ ...formData, gender: 'Boy' })}
                          className="w-4 h-4 text-[#308599] focus:ring-[#308599]"
                        />
                        <span>{copy.boy}</span>
                      </label>
                      <label htmlFor="admissionGenderGirl" className="flex items-center gap-2 cursor-pointer min-h-[44px] px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">
                        <input
                          id="admissionGenderGirl"
                          type="radio"
                          name="gender"
                          value="Girl"
                          checked={formData.gender === 'Girl'}
                          onChange={() => setFormData({ ...formData, gender: 'Girl' })}
                          className="w-4 h-4 text-[#308599] focus:ring-[#308599]"
                        />
                        <span>{copy.girl}</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>

              {/* Parent Details */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#308599] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>2. {copy.guardianInfo}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="admissionParentName" className="text-xs font-bold text-[#243B43]">
                      {copy.guardianName} <span className="text-rose-500" aria-hidden="true">*</span>
                      <span className="sr-only">({dictionary.forms.required})</span>
                    </label>
                    <input
                      id="admissionParentName"
                      name="parentName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder={copy.guardianName}
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      aria-invalid={!!fieldErrors.parentName}
                      aria-describedby={fieldErrors.parentName ? 'admissionParentNameErr' : undefined}
                      className={`w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                        fieldErrors.parentName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
                    />
                    {fieldErrors.parentName && (
                      <p id="admissionParentNameErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.parentName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="admissionPhone" className="text-xs font-bold text-[#243B43]">
                      {copy.mobile} <span className="text-rose-500" aria-hidden="true">*</span>
                      <span className="sr-only">({dictionary.forms.required})</span>
                    </label>
                    <input
                      id="admissionPhone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="e.g. 98321 44552"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'admissionPhoneErr' : undefined}
                      className={`w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                        fieldErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
                    />
                    {fieldErrors.phone && (
                      <p id="admissionPhoneErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="admissionEmail" className="text-xs font-bold text-[#243B43]">
                      {copy.emailOptional}
                    </label>
                    <input
                      id="admissionEmail"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'admissionEmailErr' : undefined}
                      className={`w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                        fieldErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
                    />
                    {fieldErrors.email && (
                      <p id="admissionEmailErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="admissionArea" className="text-xs font-bold text-[#243B43]">
                      {copy.locality}
                    </label>
                    <input
                      id="admissionArea"
                      name="residentialArea"
                      type="text"
                      autoComplete="address-level2"
                      placeholder={copy.locality}
                      value={formData.residentialArea}
                      onChange={(e) => setFormData({ ...formData, residentialArea: e.target.value })}
                      className="w-full px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border border-slate-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="admissionRemarks" className="text-xs font-bold text-[#243B43]">
                    {copy.notes}
                  </label>
                  <textarea
                    id="admissionRemarks"
                    name="remarks"
                    rows={2}
                    placeholder={copy.notes}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-3 min-h-[48px] text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer disabled:opacity-50"
                >
                  {copy.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 min-h-[48px] bg-[#308599] hover:bg-[#266b7b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] cursor-pointer flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{copy.submitting}</span>
                    </>
                  ) : (
                    <span>{copy.submit}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
