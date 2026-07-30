import * as fumadocs_next from 'fumadocs-mdx/next';
import { info } from './src/configs/site.js';

const withMDX = fumadocs_next.createMDX();

/** @type {import('next').NextConfig} */
const config = {
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
    return Object.entries(info.social).map(([key, { href }]) => ({
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: `${key}.vital-sandbox.com`
        }
      ],
      destination: href.startsWith('http') ? href : `https://${href}`,
      permanent: false
    }));
  }
};

export default withMDX(config);