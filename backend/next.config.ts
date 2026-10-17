import *      as config_site from './configs/site.tsx';
import *      as lib_api_url from './lib/api_url.ts';
import type * as next        from 'next';

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
      }
    ];
  },

  async redirects() {
    return Object.entries(config_site.info.social).map(([key, { href, populate_url }]) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: `${key}.${frontend_host}` }],
      destination: resolve_destination(href, populate_url),
      permanent: false
    }));
  }
};

export default config;