import type * as next from 'next';

// Set this in the api-service's Vercel project env vars if the site ever
// moves domains. Defaults to the production site origin.
const ALLOWED_ORIGIN = process.env.SITE_ORIGIN ?? 'https://vital-sandbox.com';

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
