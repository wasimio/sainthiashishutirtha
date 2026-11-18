import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd, { getBreadcrumbJsonLd } from './JsonLd';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getLocalePath } from '@/lib/i18n/routing';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  breadcrumbs: { label: string; href?: string }[];
  locale?: Locale;
}

export default function PageHeader({ title, subtitle, badge, breadcrumbs, locale = DEFAULT_LOCALE }: PageHeaderProps) {
  const dictionary = getUiDictionary(locale);
  const localizedBreadcrumbs = breadcrumbs.map((crumb) => ({
    ...crumb,
    href: crumb.href ? getLocalePath(crumb.href, locale) : undefined,
  }));
  return (
    <div className="relative overflow-hidden border-b border-warm-card-border bg-[linear-gradient(135deg,#E8F2F3_0%,#FDFBF7_58%,#FBECE8_100%)] py-12 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[36px] border-terracotta/[0.06]" />
      <div aria-hidden="true" className="absolute bottom-0 left-[12%] h-1 w-28 rounded-full bg-mustard" />
      {/* Schema.org BreadcrumbList Structured Data */}
      <JsonLd data={getBreadcrumbJsonLd(localizedBreadcrumbs)} />

      <div className="site-container relative space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label={dictionary.pageHeader.breadcrumbLabel} className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
          <Link href={getLocalePath('/', locale)} className="focus-ring flex items-center gap-1 rounded hover:text-terracotta">
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>{dictionary.common.home}</span>
          </Link>

          {localizedBreadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {crumb.href ? (
                <Link href={crumb.href} className="focus-ring rounded transition-colors hover:text-terracotta">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-bold text-text-headline">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Title & Subtitle */}
        <div className="max-w-4xl space-y-3">
          {badge && (
            <span className="inline-flex rounded-full border border-heritage-teal/15 bg-white/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-heritage-teal shadow-sm">
              {badge}
            </span>
          )}
          <h1 className={`text-fluid-hero font-bold tracking-[-0.035em] text-text-headline ${locale === 'bn' ? 'font-bengali-display leading-bengali-heading' : 'font-display'}`}>
            {title}
          </h1>
          <p className="max-w-3xl text-fluid-body leading-7 text-text-muted">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
