import * as lib_api_url from '@/lib/api_url';
import * as lib_source  from '@/lib/source';
import * as lib_news    from '@/lib/news';
import * as next        from 'next';

export const dynamic = 'force-static';

export default function sitemap(): next.MetadataRoute.Sitemap {
  const frontend_url = lib_api_url.get_frontend_url();
  const pages = lib_source.source.getPages().map((page) => {
    const is_docs_root = page.url === '/docs';
    return {
      url: `${frontend_url}${page.url}`,
      changeFrequency: (is_docs_root ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: is_docs_root ? 0.9 : 0.7
    };
  });
  const posts = lib_news.get_posts().map((post) => ({
    url: `${frontend_url}${post.url}`,
    lastModified: post.data.date,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [
    { url: frontend_url, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${frontend_url}/news`, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...pages,
    ...posts
  ];
}
