import type * as next          from 'next';
import *      as fumadocs_next from 'fumadocs-mdx/next';
import *      as config_site   from './configs/site.tsx';

const withMDX = fumadocs_next.createMDX();

const config: next.NextConfig = {
  reactStrictMode: true,

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