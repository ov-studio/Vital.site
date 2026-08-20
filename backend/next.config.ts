import type * as next from 'next';
import *      as path from 'path';

const ALLOWED_ORIGIN = 'https://vital-sandbox.com';

const config: next.NextConfig = {
  reactStrictMode: true,
  webpack(cfg) {
    cfg.resolve.alias['@/shared'] = path.resolve(__dirname, '../shared');
    return cfg;
  },
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
  }
};

export default config;
