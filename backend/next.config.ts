import type * as next from 'next';

if (!process.env.SITE_ORIGIN && process.env.NODE_ENV === 'production') {
  console.warn('[CORS] SITE_ORIGIN is not set — Access-Control-Allow-Origin will default to "*" in production. Set SITE_ORIGIN to your frontend origin to lock this down.');
}

const ALLOWED_ORIGIN = process.env.SITE_ORIGIN ?? '*';

const config: next.NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: ALLOWED_ORIGIN },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ];
  }
};

export default config;
