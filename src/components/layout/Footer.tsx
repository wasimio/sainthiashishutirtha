'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { SCHOOL_INFO } from '@/data/schoolData';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getLocalePath } from '@/lib/i18n/routing';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import type { PublishedNavigationItem, PublishedSchoolSettings } from '@/lib/cms/contentService';

interface FooterProps {
  settings?: PublishedSchoolSettings | null;
  navigation?: PublishedNavigationItem[] | null;
  locale?: Locale;
}

export default function Footer({
  settings,
  navigation,
  locale = DEFAULT_LOCALE,
}: FooterProps) {
  const dictionary = getUiDictionary(locale);
  const schoolName = settings?.school_name || SCHOOL_INFO.name;
  const address = settings?.campus_address || SCHOOL_INFO.address;
  const phone = settings?.official_phone || settings?.primary_phone || SCHOOL_INFO.phone;
  const email = settings?.official_email || SCHOOL_INFO.email;
  const officeHours = settings?.office_hours || SCHOOL_INFO.officeHours;
  const estdYear = settings?.estd_year || SCHOOL_INFO.estdYear;
  const classesOffered = settings?.classes_offered || SCHOOL_INFO.classesOffered;
  const affiliation = settings?.affiliation || SCHOOL_INFO.affiliation;
  const udiseNo = settings?.udise_code || SCHOOL_INFO.udiseNo;
  const logoUrl = settings?.logo_url ? resolvePublicMediaUrl(settings.logo_url) : '/logo.png';

  const fallbackLinks = [
    { label: dictionary.footer.aboutSchool, url: '/about' },
    { label: dictionary.footer.facultyRoster, url: '/faculty' },
    { label: dictionary.footer.campusGallery, url: '/gallery' },
    { label: dictionary.footer.schoolBlog, url: '/blog' },
    { label: dictionary.footer.circulars, url: '/notices' },
    { label: dictionary.footer.contactOffice, url: '/contact' },
  ];
  const quickLinks = navigation?.some((item) => item.menu_location === 'footer_quick_links' && item.is_published)
    ? navigation.filter((item) => item.menu_location === 'footer_quick_links' && item.is_published).sort((a, b) => a.sort_order - b.sort_order)
    : fallbackLinks;

  return (
    <footer className="relative overflow-hidden border-t-4 border-mustard bg-[#102F35] pb-24 pt-16 text-white lg:pb-8">
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[48px] border-white/[0.035]" />
      <div aria-hidden="true" className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-terracotta/[0.07] blur-3xl" />

      <div className="site-container relative">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_0.9fr_1fr]">
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white p-1 shadow-xl">
                <Image src={logoUrl} alt={`${schoolName} school seal`} fill loading="lazy" unoptimized={Boolean(settings?.logo_url)} className="object-contain p-1" />
              </span>
              <div>
                <h2 className={`text-xl font-bold text-white ${locale === 'bn' ? 'font-bengali-display' : 'font-display'}`}>{schoolName}</h2>
                <p className="mt-1 text-xs font-semibold text-mustard">{dictionary.footer.established} {estdYear} · {classesOffered}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/68">
              {settings?.about_text || SCHOOL_INFO.tagline}
            </p>
            <dl className="flex flex-wrap gap-2 text-[11px]">
              <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5"><dt className="inline text-white/55">{dictionary.footer.udiseCode}: </dt><dd className="inline font-semibold text-white">{udiseNo}</dd></div>
              {affiliation && <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5"><dt className="inline text-white/55">{dictionary.footer.affiliation}: </dt><dd className="inline font-semibold text-white">{affiliation}</dd></div>}
            </dl>
          </section>

          <section>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-mustard">{dictionary.footer.divisions}</h3>
            <ul className="space-y-3 text-sm text-white/68">
              <li><Link href={getLocalePath('/academics', locale)} className="transition hover:text-white">{dictionary.navigation.academics}</Link></li>
              <li><Link href={getLocalePath('/academics/pre-primary-kg', locale)} className="transition hover:text-white">{classesOffered}</Link></li>
              <li><Link href={getLocalePath('/faculty', locale)} className="transition hover:text-white">{dictionary.navigation.faculty}</Link></li>
              <li className="pt-2"><Link href={getLocalePath('/facilities', locale)} className="inline-flex items-center gap-1.5 font-bold text-mustard hover:text-white">{dictionary.footer.exploreFacilities}<ArrowUpRight className="h-3.5 w-3.5" /></Link></li>
            </ul>
          </section>

          <section>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-mustard">{dictionary.footer.quickNavigation}</h3>
            <ul className="space-y-3 text-sm text-white/68">
              {quickLinks.map((item) => {
                const external = 'is_external' in item && item.is_external;
                const href = external ? item.url : getLocalePath(item.url, locale);
                const target = 'target' in item && typeof item.target === 'string' ? item.target : undefined;
                return <li key={`${item.label}-${item.url}`}><Link href={href} target={target} className="transition hover:text-white">{item.label}</Link></li>;
              })}
            </ul>
            <Link href={getLocalePath('/admissions', locale)} className="focus-ring mt-6 inline-flex min-h-11 items-center rounded-full bg-terracotta px-5 text-xs font-extrabold text-white shadow-lg transition hover:bg-terracotta-hover">
              {dictionary.actions.admissionEnquiry}
            </Link>
          </section>

          <section>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-mustard">{dictionary.footer.schoolOffice}</h3>
            <address className="space-y-4 text-sm not-italic text-white/68">
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mustard" /><span>{address}</span></p>
              <a href={`tel:${phone}`} className="flex items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-mustard" />{phone}</a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 break-all hover:text-white"><Mail className="h-4 w-4 shrink-0 text-mustard" />{email}</a>
              <p className="flex items-start gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-mustard" /><span>{officeHours}</span></p>
            </address>
          </section>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11px] text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {schoolName}. {dictionary.footer.rights}</p>
          <p>{dictionary.footer.registeredSchool} · {dictionary.footer.udiseCode}: {udiseNo}</p>
        </div>
      </div>
    </footer>
  );
}
