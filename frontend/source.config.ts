import * as fumadocs_config from 'fumadocs-mdx/config';
import * as zod             from 'zod';

export const docs = fumadocs_config.defineDocs({
  dir: 'content/docs',
  docs: {
    schema: fumadocs_config.frontmatterSchema.extend({
      badge: zod.z.string().optional()
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: fumadocs_config.metaSchema,
  }
});

export const news = fumadocs_config.defineDocs({
  dir: 'content/news',
  docs: {
    schema: fumadocs_config.frontmatterSchema.extend({
      date:   zod.z.coerce.date(),
      author: zod.z.string().optional(),
      cover:  zod.z.string().optional(),
      tags:   zod.z.array(zod.z.string()).default([])
    })
  }
});

export default fumadocs_config.defineConfig({
  mdxOptions: {
    remarkPlugins: [],
  }
});
