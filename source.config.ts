import * as fumadocs_config from 'fumadocs-mdx/config';
import * as zod from 'zod';

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
  },
});

export default fumadocs_config.defineConfig({
  mdxOptions: {
    remarkPlugins: [],
  },
});