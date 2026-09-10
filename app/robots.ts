import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tentmakers.ph';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/ventures', '/contact'],
        disallow: ['/dashboard', '/login', '/register', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
