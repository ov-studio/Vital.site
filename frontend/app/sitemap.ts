import * as lib_api_url from '@/lib/api_url';
import * as lib_source  from '@/lib/source';
import * as next        from 'next';

export const dynamic = 'force-static';

export default function sitemap(): next.MetadataRoute.Sitemap {
  const SITE_URL = lib_api_url.get_site_url();
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
