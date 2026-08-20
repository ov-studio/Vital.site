import * as next       from 'next';
import * as lib_source from '@/lib/source';

export const dynamic = 'force-static';

function site_url(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export default function sitemap(): next.MetadataRoute.Sitemap {
  const SITE_URL = site_url();
  const pages = lib_source.source.getPages().map((page) => {
    const is_docs_root = page.url === '/docs';
    return {
      url: `${SITE_URL}${page.url}`,
      changeFrequency: (is_docs_root ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: is_docs_root ? 0.9 : 0.7
    };
  });

  return [
    { url: SITE_URL, changeFrequency: 'weekly' as const, priority: 1 },
    ...pages
  ];
}
