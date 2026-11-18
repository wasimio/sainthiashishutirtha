'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock3, MapPin, Phone } from 'lucide-react';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { SCHOOL_INFO } from '@/data/schoolData';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getLocalePath, stripLocalePrefix } from '@/lib/i18n/routing';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import type { PublishedNavigationItem, PublishedSchoolSettings } from '@/lib/cms/contentService';

interface NavbarProps {
  settings?: PublishedSchoolSettings | null;
  navigation?: PublishedNavigationItem[] | null;
  locale?: Locale;
  availableLocales?: readonly Locale[];
  localePaths?: Partial<Record<Locale, string>>;
}

interface NavItem { label: string; href: string; isExternal?: boolean; target?: string }

export default function Navbar({
  settings,
  navigation,
  locale = DEFAULT_LOCALE,
  availableLocales = [DEFAULT_LOCALE],
  localePaths,
}: NavbarProps) {
  const dictionary = getUiDictionary(locale);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const schoolName = settings?.school_name || SCHOOL_INFO.name;
  const phone = (settings?.official_phone || settings?.primary_phone || SCHOOL_INFO.phone).split('/')[0].trim();
  const city = settings?.city || 'Sainthia';
  const campusAddress = settings?.campus_address
    ? `${settings.campus_address.split(',')[0].trim()}, ${city}`
    : `Saradishpally, ${city}`;
  const officeHours = settings?.office_hours || SCHOOL_INFO.officeHours;
  const classesOffered = settings?.classes_offered || SCHOOL_INFO.classesOffered;
  const estdYear = settings?.estd_year || SCHOOL_INFO.estdYear;

  const fallbackNavigation: NavItem[] = [
    { label: dictionary.navigation.home, href: '/' },
    { label: dictionary.navigation.about, href: '/about' },
    { label: dictionary.navigation.academics, href: '/academics' },
    { label: dictionary.navigation.faculty, href: '/faculty' },
    { label: dictionary.navigation.facilities, href: '/facilities' },
    { label: dictionary.navigation.gallery, href: '/gallery' },
    { label: dictionary.navigation.blog, href: '/blog' },
    { label: dictionary.navigation.notices, href: '/notices' },
    { label: dictionary.navigation.contact, href: '/contact' },
  ];

  const navLinks = useMemo<NavItem[]>(() => {
    const source = navigation?.length
      ? navigation.filter((item) => item.is_published).sort((a, b) => a.sort_order - b.sort_order).map((item) => ({
          label: item.label,
          href: item.url,
          isExternal: item.is_external,
          target: item.target || (item.is_external ? '_blank' : '_self'),
        }))
      : fallbackNavigation;
    if (!source.some((item) => !item.isExternal && stripLocalePrefix(item.href) === '/blog')) {
      source.push({ label: dictionary.navigation.blog, href: '/blog' });
    }
    return source.map((item) => ({
      ...item,
      href: item.isExternal ? item.href : getLocalePath(item.href, locale),
    }));
  // The dictionary and CMS navigation are stable for a route render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, locale]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !isMobileMenuOpen) return;
      setIsMobileMenuOpen(false);
      if (mobileMenuRef.current) mobileMenuRef.current.open = false;
      window.requestAnimationFrame(() => mobileMenuRef.current?.querySelector('summary')?.focus());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const frame = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
    setIsMobileMenuOpen(false);
  };
  const englishPath = stripLocalePrefix(pathname);
  const isActive = (href: string) => {
    const target = stripLocalePrefix(href);
    return target === '/' ? englishPath === '/' : englishPath === target || englishPath.startsWith(`${target}/`);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-heritage-teal text-white">
        <div className="site-container flex min-h-8 items-center justify-between gap-3 py-1 text-[11px]">
          <div className="flex min-w-0 items-center gap-4 text-white/80">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-mustard" />
              <span className="truncate">{campusAddress}</span>
            </span>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <Clock3 aria-hidden="true" className="h-3.5 w-3.5 text-mustard" />
              {officeHours}
            </span>
          </div>
          <a href={`tel:${phone}`} className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-white hover:text-mustard">
            <Phone aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{dictionary.navigation.helpline}:</span> {phone}
          </a>
        </div>
      </div>

      <nav
        aria-label={dictionary.navigation.mainNavigation}
        className={`border-b border-warm-card-border/80 bg-warm-ivory/95 backdrop-blur-xl transition-all ${isScrolled ? 'shadow-[0_12px_35px_rgba(20,56,63,0.10)]' : ''}`}
      >
        <div className="site-container flex min-h-[64px] items-center justify-between gap-2 py-2 sm:gap-3">
          <Link href={getLocalePath('/', locale)} className="focus-ring group flex min-w-0 flex-1 items-center gap-2 rounded-2xl sm:gap-3 lg:flex-none">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-warm-card-border bg-white p-0.5 shadow-sm sm:h-12 sm:w-12 lg:h-14 lg:w-14">
              <Image
                src={settings?.logo_url ? resolvePublicMediaUrl(settings.logo_url) : '/logo.png'}
                alt={`${schoolName} school seal`}
                fill
                priority
                unoptimized={Boolean(settings?.logo_url)}
                className="object-contain"
              />
            </span>
            <span className="min-w-0">
              <span className={`block text-[11px] font-extrabold uppercase leading-[1.12] tracking-[-0.02em] text-text-headline transition-colors group-hover:text-terracotta sm:text-base sm:leading-tight ${locale === 'bn' ? 'font-bengali-display leading-bengali-heading' : 'font-display'}`}>
                {schoolName}
              </span>
              <span className="hidden truncate text-[10px] font-semibold text-heritage-teal sm:block sm:text-[11px]">
                {dictionary.navigation.schoolDescriptor} · {classesOffered}
              </span>
              <span className="hidden text-[10px] text-text-subtle md:block">
                {dictionary.navigation.established} {estdYear} · {city}
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                target={link.target}
                rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`focus-ring whitespace-nowrap rounded-full px-2 py-1.5 text-[11px] font-bold transition-colors ${isActive(link.href) ? 'bg-heritage-teal text-white' : 'text-text-body hover:bg-terracotta-subtle hover:text-terracotta'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher locale={locale} pathname={pathname} availableLocales={availableLocales} localePaths={localePaths} />
            <Link
              href={getLocalePath('/admissions', locale)}
              className="focus-ring inline-flex min-h-11 items-center rounded-full bg-heritage-teal px-5 text-xs font-extrabold text-white shadow-[0_8px_22px_rgba(20,56,63,0.24)] transition hover:-translate-y-0.5 hover:bg-heritage-teal-hover"
            >
              {dictionary.actions.applyNow}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
            <Link href={getLocalePath('/admissions', locale)} className="focus-ring inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-terracotta px-2.5 text-[11px] font-extrabold text-white sm:px-3 sm:text-xs">
              {dictionary.navigation.admissions}
            </Link>
            <details ref={mobileMenuRef} className="mobile-menu relative lg:hidden" onToggle={(event) => setIsMobileMenuOpen(event.currentTarget.open)}>
              <summary
                className="focus-ring relative z-20 grid h-11 w-11 cursor-pointer list-none touch-manipulation place-items-center rounded-full border border-warm-card-border bg-white text-text-headline [&::-webkit-details-marker]:hidden"
                aria-label={isMobileMenuOpen ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                role="button"
                data-menu-toggle="mobile"
              >
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-150 motion-reduce:transition-none ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
              </span>
              </summary>
            </details>
          </div>
        </div>

        <div id="mobile-navigation" aria-label={dictionary.navigation.mobileNavigation} className="mobile-navigation-panel relative z-10 grid overflow-hidden border-t border-warm-card-border bg-warm-ivory shadow-2xl transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none lg:hidden">
          <div className="min-h-0 overflow-hidden">
            <div className="px-4 pb-8 pt-4">
              <div className="mx-auto grid max-w-xl grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  ref={link === navLinks[0] ? firstMobileLinkRef : undefined}
                  href={link.href}
                  target={link.target}
                  onClick={closeMobileMenu}
                  className={`focus-ring flex min-h-12 items-center rounded-2xl px-4 text-sm font-bold ${isActive(link.href) ? 'bg-heritage-teal text-white' : 'border border-warm-card-border bg-white text-text-body'}`}
                >
                  {link.label}
                </Link>
              ))}
              </div>
              <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2 border-t border-warm-card-border pt-4">
              <LanguageSwitcher locale={locale} pathname={pathname} availableLocales={availableLocales} localePaths={localePaths} />
              <Link href={getLocalePath('/admissions', locale)} onClick={closeMobileMenu} className="focus-ring flex min-h-12 items-center justify-center rounded-2xl bg-terracotta px-5 text-sm font-extrabold text-white">
                {dictionary.navigation.quickEnquiry}
              </Link>
              <a href={`tel:${phone}`} className="focus-ring flex min-h-12 items-center justify-center rounded-2xl bg-heritage-teal-subtle px-5 text-sm font-bold text-heritage-teal">
                {dictionary.navigation.helpline}: {phone}
              </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
