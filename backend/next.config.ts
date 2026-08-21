import *      as config_site from './configs/site.tsx';
import *      as lib_api_url from './lib/api_url.ts';
import type * as next        from 'next';

const SITE_URL       = lib_api_url.get_frontend_url();
const SITE_HOST      = new URL(SITE_URL).hostname;
const ALLOWED_ORIGIN = SITE_URL;

const config: next.NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: ALLOWED_ORIGIN },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      },
      {
        source: '/og',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: ALLOWED_ORIGIN }
        ]
      }
    ];
  },

  async redirects() {
    return Object.entries(config_site.info.social).map(([key, { href }]) => ({
      source:      '/:path*',
      has:         [{ type: 'host' as const, value: `${key}.${SITE_HOST}` }],
      destination: href.startsWith('http') ? href : `https://${href}`,
      permanent:   false
    }));
  }
};

export default config;