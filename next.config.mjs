import * as fumadocs_next from 'fumadocs-mdx/next';

const withMDX = fumadocs_next.createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'discord.vital-sandbox.com',
          },
        ],
        destination: 'http://discord.gg/sVCnxPW',
        permanent: false
      },
    ];
  },
};

export default withMDX(config);
