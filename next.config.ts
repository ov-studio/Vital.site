import type * as next          from 'next';
import *      as fumadocs_next from 'fumadocs-mdx/next';
import *      as config_site   from './configs/site.tsx';

const withMDX = fumadocs_next.createMDX();
const STATIC_CONTENT_CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800';

const config: next.NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  async headers() {
    return [
      {
        source: '/docs/:path*',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      },
      {
        source: '/og/:path*',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      },
      {
        source: '/llms.txt',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      },
      {
        source: '/llms-full.txt',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      },
      {
        source: '/llms.mdx/:path*',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      },
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      },
      {
        source: '/robots.txt',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      },
      {
        source: '/opengraph-image',
        headers: [{ key: 'Cache-Control', value: STATIC_CONTENT_CACHE_CONTROL }]
      }
    ];
  },

  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*'
      },
    ];
  },

  async redirects() {
    return Object.entries(config_site.info.social).map(([key, { href }]) => ({
      source: '/:path*',
      has: [
        {
          type: 'host' as const,
          value: `${key}.vital-sandbox.com`
        }
      ],
      destination: href.startsWith('http') ? href : `https://${href}`,
      permanent: false
    }));
  }
};

export default withMDX(config);