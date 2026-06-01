import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Production-only fix to prevent compilers from stripping indentation before an ellipsis (...)
function remarkEllipsisFix() {
  return (tree: any) => {
    if (process.env.NODE_ENV !== 'production') return;
    const traverse = (node: any) => {
      if (!node) return;
      if (node.type === 'code' && node.value && node.value.includes('...')) {
        // Fix 1: Restores indentation for standalone block ellipses (e.g., "    ...")
        node.value = node.value.replace(/^([ \t]*)\.\.\./gm, '$1  ...');
        // Fix 2: Prevents word-bound inline ellipses from collapsing (e.g., "local  ..." -> "local...")
        node.value = node.value.replace(/(\w+)[ \t]+\.\.\./g, '$1 ...');
      }
      if (node.children && Array.isArray(node.children)) node.children.forEach(traverse);
    };
    traverse(tree);
  };
}

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      badge: z.string().optional()
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkEllipsisFix],
  },
});
