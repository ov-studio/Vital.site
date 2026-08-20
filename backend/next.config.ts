import *      as config_site from './configs/site';
import type * as next        from 'next';

const ALLOWED_ORIGIN = 'https://vital-sandbox.com';

const config: next.NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/api/:path*',
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
      has:         [{ type: 'host' as const, value: `${key}.vital-sandbox.com` }],
      destination: href.startsWith('http') ? href : `https://${href}`,
      permanent:   false
    }));
  }
};

export default config;
