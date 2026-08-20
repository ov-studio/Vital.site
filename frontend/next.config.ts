import type * as next          from 'next';
import *      as path          from 'path';
import *      as fumadocs_next from 'fumadocs-mdx/next';

const withMDX = fumadocs_next.createMDX();

const config: next.NextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  webpack(cfg) {
    cfg.resolve.alias['@/configs'] = path.resolve(__dirname, '../configs');
    return cfg;
  }
};

export default withMDX(config);
