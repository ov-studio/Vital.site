import * as lib_api_url from '@/lib/api_url';
import * as next        from 'next';

export const dynamic = 'force-static';

export default function robots(): next.MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/']
      }
    ],
    sitemap: `${lib_api_url.get_site_url()}/sitemap.xml`
  };
}
