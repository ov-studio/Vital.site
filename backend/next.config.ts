import type * as next from 'next';

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
  }
};

export default config;
