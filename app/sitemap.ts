import type { MetadataRoute } from 'next';
import { ventures } from '@/lib/ventures-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tentmakers.ph';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/about`, lastModified: now },
    { url: `${base}/ventures`, lastModified: now },
    ...ventures.map((v) => ({
      url: `${base}/ventures/${v.slug}`,
      lastModified: now,
    })),
    { url: `${base}/contact`, lastModified: now },
  ];
}
