import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Returns verified Schema.org School structured data.
 * Adheres strictly to verified statutory information (U-DISE, Registration, Location).
 * Omits unverified contact numbers, emails, claims, or guessed production URLs.
 */
export function getSchoolJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: 'Sainthia Shishutirtha',
    alternateName: 'Shishutirtha Sainthia',
    description:
      'School serving Lower Nursery through Class 5 in Sainthia, Birbhum, West Bengal.',
    ...(siteUrl ? { url: siteUrl } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sainthia',
      addressRegion: 'West Bengal',
      postalCode: '731234',
      addressCountry: 'IN',
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'U-DISE Code',
        name: '19082200103',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Government Registration',
        name: 'S/2L/14754 OF 2013-14',
      },
    ],
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data from route breadcrumbs.
 */
export function getBreadcrumbJsonLd(breadcrumbs: { label: string; href?: string }[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl ? `${siteUrl.replace(/\/$/, '')}/` : '/',
    },
    ...breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: crumb.label,
      ...(crumb.href
        ? { item: siteUrl ? `${siteUrl.replace(/\/$/, '')}${crumb.href}` : crumb.href }
        : {}),
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
