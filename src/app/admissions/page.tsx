import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsWebsitePage from '@/components/cms/CmsWebsitePage';
import { getPublicPageContext, getPublicPageMetadata } from '@/lib/cms/publicPage';
import AdmissionsEnquiryForm from '@/components/admissions/AdmissionsEnquiryForm';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata('admissions');
}

export default async function AdmissionsPage() {
  const { pageData, settings, headerNavigation, footerNavigation, locale, availableLocales } = await getPublicPageContext('admissions');
  if (!pageData) notFound();

  return (
    <CmsWebsitePage
      pageData={pageData}
      settings={settings}
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      locale={locale}
      availableLocales={availableLocales}
      beforeContent={<AdmissionsEnquiryForm />}
    />
  );
}
