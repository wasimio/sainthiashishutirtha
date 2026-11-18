import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/portal/',
          '/portal/*',
          '/admin/',
          '/admin/*',
          '/parent/',
          '/parent/*',
          '/auth/',
          '/auth/*',
          '/login',
          '/login/*',
          '/portal-coming-soon',
        ],
      },
    ],
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
