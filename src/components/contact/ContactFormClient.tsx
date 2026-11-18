'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, PhoneCall } from 'lucide-react';
import { SCHOOL_INFO, VERIFIED_CLASSES } from '@/data/schoolData';
import { submitContactInquiry } from '@/lib/actions/contactActions';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';

export default function ContactFormClient({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dictionary = getUiDictionary(locale);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    classInterest: 'KG',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const result = await submitContactInquiry({
        parentName: formData.parentName,
        phone: formData.phone,
        email: formData.email,
        classInterest: formData.classInterest,
        message: formData.message,
        website_hp: honeypot,
      });

      if (result.success) {
        setIsSubmitted(true);
        setSubmittedRef(result.referenceNo || null);
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

  return (
    <div className="rounded-[2rem] border border-warm-card-border bg-white p-6 shadow-[0_18px_55px_rgba(20,56,63,0.08)] sm:p-10 lg:col-span-7">
      <h2 className="text-2xl font-bold text-[#243B43] mb-2">
        {dictionary.forms.contactTitle}
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 mb-6">
        {dictionary.forms.contactIntro}
      </p>

      {isSubmitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-emerald-950">
              {dictionary.forms.sentTitle}
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              {dictionary.forms.success} <strong>{formData.parentName}</strong> · <strong>{formData.phone}</strong>
            </p>
          </div>

          {submittedRef && (
            <div className="bg-[#EAF5F7] p-4 rounded-2xl border border-[#A5D1DC] text-center space-y-1 max-w-sm mx-auto shadow-2xs">
              <span className="text-[11px] font-bold text-[#245E6D] uppercase tracking-wider block">
                {dictionary.forms.referenceNumber}
              </span>
              <span className="font-mono font-black text-sm sm:text-base text-[#1B2E35] bg-white px-3 py-1 rounded-lg border border-[#A5D1DC] inline-block shadow-2xs">
                {submittedRef}
              </span>
              <p className="text-[10px] text-slate-500 pt-0.5">
                {dictionary.forms.saveReference}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSubmittedRef(null);
                setFormData({
                  parentName: '',
                  phone: '',
                  email: '',
                  classInterest: 'KG',
                  message: '',
                });
                setHoneypot('');
              }}
              className="inline-flex items-center justify-center min-h-[44px] px-4 text-xs font-bold text-[#308599] hover:underline cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] rounded-lg"
            >
              {dictionary.forms.anotherInquiry}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 animate-in fade-in" role="alert">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-semibold">{dictionary.forms.unableToSend}</strong>
                <p className="text-rose-800">{errorMessage}</p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-rose-700">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{dictionary.forms.administrativeOffice}: <a href={`tel:${SCHOOL_INFO.primaryPhone}`} className="font-bold underline">{SCHOOL_INFO.primaryPhone}</a></span>
                </div>
              </div>
            </div>
          )}

          {/* Bot Honeypot */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contactParentName" className="text-xs font-bold text-[#243B43]">
                {dictionary.forms.parentName} <span className="text-rose-500" aria-hidden="true">*</span>
                <span className="sr-only">({dictionary.forms.required})</span>
              </label>
              <input
                id="contactParentName"
                name="parentName"
                type="text"
                required
                autoComplete="name"
                placeholder={dictionary.forms.parentName}
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                aria-invalid={!!fieldErrors.parentName}
                aria-describedby={fieldErrors.parentName ? 'contactParentNameErr' : undefined}
                className={`w-full px-4 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                  fieldErrors.parentName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
              />
              {fieldErrors.parentName && (
                <p id="contactParentNameErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.parentName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contactPhone" className="text-xs font-bold text-[#243B43]">
                {dictionary.forms.phone} <span className="text-rose-500" aria-hidden="true">*</span>
                <span className="sr-only">({dictionary.forms.required})</span>
              </label>
              <input
                id="contactPhone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="e.g. 98321 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? 'contactPhoneErr' : undefined}
                className={`w-full px-4 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                  fieldErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
              />
              {fieldErrors.phone && (
                <p id="contactPhoneErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contactEmail" className="text-xs font-bold text-[#243B43]">
                {dictionary.forms.emailOptional}
              </label>
              <input
                id="contactEmail"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="parent@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'contactEmailErr' : undefined}
                className={`w-full px-4 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border ${
                  fieldErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
              />
              {fieldErrors.email && (
                <p id="contactEmailErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contactClassInterest" className="text-xs font-bold text-[#243B43]">
                {dictionary.forms.classInterest}
              </label>
              <select
                id="contactClassInterest"
                name="classInterest"
                value={formData.classInterest}
                onChange={(e) => setFormData({ ...formData, classInterest: e.target.value })}
                className="w-full px-4 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-xl border border-slate-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all bg-white cursor-pointer"
              >
                {VERIFIED_CLASSES.map((cls) => (
                  <option key={cls.code} value={cls.name}>
                    {locale === 'bn' ? cls.code : `${cls.name} (${cls.wing})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contactMessage" className="text-xs font-bold text-[#243B43]">
              {dictionary.forms.messagePrompt}
            </label>
            <textarea
              id="contactMessage"
              name="message"
              rows={4}
              placeholder={dictionary.forms.messagePrompt}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? 'contactMessageErr' : undefined}
              className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border ${
                fieldErrors.message ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] transition-all`}
            />
            {fieldErrors.message && (
              <p id="contactMessageErr" className="text-[11px] text-rose-600 font-medium">{fieldErrors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 min-h-[48px] bg-[#308599] hover:bg-[#266b7b] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] focus-visible:ring-offset-2 cursor-pointer active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{dictionary.forms.submitting}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{dictionary.forms.submit}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
