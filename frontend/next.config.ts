import type * as next          from 'next';
import *      as fumadocs_next from 'fumadocs-mdx/next';
import *      as lib_api_url   from './lib/api_url.ts';

const withMDX = fumadocs_next.createMDX();
const is_dev  = process.env.NODE_ENV === 'development';

const config: next.NextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: true
  },

  // Dev only: mirrors the vercel.json rewrites so shared links (/vault/:id, /news/:slug+)
  // reach the backend share routes locally. Static export (build) doesn't support rewrites.
  ...(is_dev && {
    async rewrites() {
      const api = lib_api_url.get_backend_url();
      return [
        { source: '/vault/:id',   destination: `${api}/vault/share/:id`   },
        { source: '/news/:slug+', destination: `${api}/news/share/:slug+` }
      ];
    }
  })
};

export default withMDX(config);
