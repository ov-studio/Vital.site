import type * as next          from 'next';
import *      as fumadocs_next from 'fumadocs-mdx/next';

const withMDX = fumadocs_next.createMDX();

const config: next.NextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: true
  }
};

export default withMDX(config);
