'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation
} from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';
import type { WebsiteSectionRow, PublishedSchoolSettings } from '@/lib/cms/contentService';
import ContactFormClient from '@/components/contact/ContactFormClient';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';

interface ContactSectionProps {
  section?: WebsiteSectionRow | null;
  settings?: PublishedSchoolSettings | null;
  locale?: Locale;
}

export default function ContactSection({ section, settings, locale = DEFAULT_LOCALE }: ContactSectionProps) {
  const dictionary = getUiDictionary(locale);
  const content = (section?.content_json as Record<string, string>) || {};
  const schoolName = settings?.school_name || SCHOOL_INFO.name;
  const address = content.address || settings?.primary_address || SCHOOL_INFO.address;
  const phone = content.phone || settings?.primary_phone || SCHOOL_INFO.phone;
  const email = content.email || settings?.primary_email || SCHOOL_INFO.email;
  const officeHours = content.office_hours || settings?.office_hours || SCHOOL_INFO.officeHours;
  const mapUrl = settings?.map_location_url || "https://maps.google.com/?q=Sainthia+Shishu+Tirtha+Birbhum";
  const sectionTitle = section?.title || '';
  const sectionSubtitle = section?.subtitle || '';

  return (
    <section id="contact" className="border-b border-warm-card-border bg-white py-16 sm:py-24">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF5F7] rounded-full text-xs font-bold text-[#245E6D] border border-[#A5D1DC]">
            <MapPin className="w-3.5 h-3.5 text-[#245E6D]" />
            <span>{content.eyebrow || dictionary.navigation.contact}</span>
          </div>
          <h2 className={`text-fluid-h1 font-bold tracking-tight text-text-headline ${locale === 'bn' ? 'font-bengali-display' : 'font-display'}`}>
            {sectionTitle}
          </h2>
          <p className="text-fluid-body text-slate-600 leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Details & Location Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#EAF5F7] p-6 sm:p-8 rounded-3xl border border-[#A5D1DC] space-y-6">
              <h3 className="text-xl font-bold text-[#1B2E35]">
                {content.details_title || dictionary.footer.schoolOffice}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#245E6D] shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B2E35]">{content.address_label || dictionary.actions.locateCampus}</strong>
                    <span>{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#245E6D] shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B2E35]">{content.phone_label || dictionary.forms.phone}</strong>
                    <span>{phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#245E6D] shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B2E35]">{content.email_label || dictionary.forms.email}</strong>
                    <span>{email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 text-[#245E6D] shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#1B2E35]">{content.hours_label || dictionary.footer.schoolHours}</strong>
                    <span>{officeHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map Card */}
            <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-xs bg-slate-50 relative aspect-[16/10] flex flex-col justify-end p-6">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#E8F2F3,#FDFBF7)]" />
              <div className="absolute inset-x-6 top-8 flex items-start gap-3 rounded-2xl border border-warm-card-border bg-white/90 p-4 shadow-lg backdrop-blur">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-terracotta text-white"><MapPin className="h-5 w-5" /></span>
                <div><strong className="block text-sm text-text-headline">{schoolName}</strong><span className="mt-1 block text-xs leading-5 text-text-muted">{address}</span></div>
              </div>

              {/* Bottom information bar on map */}
              <div className="relative z-10 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2">
                <div className="text-xs">
                  <div className="font-bold text-[#1B2E35]">{content.location_title || settings?.city || ''}</div>
                  <div className="text-[11px] text-slate-500">{content.location_note || address}</div>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 min-h-[40px] bg-[#245E6D] hover:bg-[#1B4B57] text-white text-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#245E6D] cursor-pointer"
                  aria-label={dictionary.actions.locateCampus}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{dictionary.actions.locateCampus}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Enquiry Form Component */}
          <ContactFormClient locale={locale} />
        </div>
      </div>
    </section>
  );
}
