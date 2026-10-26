import *      as lib_api_url from './lib/api_url.ts';
import type * as next        from 'next';

if (typeof require !== 'undefined' && !require.extensions['.tsx'] && require.extensions['.ts']) require.extensions['.tsx'] = require.extensions['.ts'];
const config_site = require('./configs/site.tsx') as typeof import('./configs/site.tsx');
const frontend_url = lib_api_url.get_frontend_url();
const frontend_host = new URL(frontend_url).hostname;

const resolve_destination = (href: string, populate_url?: boolean) => {
  if (populate_url) return `${frontend_url.replace(/\/+$/, '')}/${href.replace(/^\/+/, '')}`;
  return href.startsWith('http') ? href : `https://${href}`;
};

const config: next.NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: frontend_url },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      },
      {
        source: '/news',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' }
        ]
      }
    ];
  },

  async redirects() {
    const social = config_site.info.social as Record<string, { href: string; populate_url?: boolean }>;
    return Object.entries(social).map(([key, { href, populate_url }]) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: `${key}.${frontend_host}` }],
      destination: resolve_destination(href, populate_url),
      permanent: false
    }));
  }
};

export default config;