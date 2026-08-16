import * as next from 'next';
import * as lib_source from '@/lib/source';

function site_url(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export default function sitemap(): next.MetadataRoute.Sitemap {
  const SITE_URL = site_url();

  const pages = lib_source.source.getPages().map((page) => ({
    url: `${SITE_URL}${page.url}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  return [
    { url: SITE_URL, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE_URL}/docs`, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...pages
  ];
}
