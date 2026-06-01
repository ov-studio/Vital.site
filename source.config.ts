import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Universal production fix that auto-spaces code-block ellipses globally
function remarkEllipsisFix() {
  return (tree: any) => {
    const traverse = (node: any) => {
      if (!node) return;
      if (node.type === 'code' && node.value && node.value.includes('...')) {
        // Fix 1: Restores indentation for standalone block ellipses (e.g., "    ...")
        node.value = node.value.replace(/^([ \t]*)\.\.\./gm, '$1  ...');
        // Fix 2: Global Automation for Assignment/Inline Ellipses (e.g., "local...", "foo...", ")...")
        node.value = node.value.replace(/([\w\)\],]+)[ \t]*\.{2,3}/g, '$1   ...');
      }
      if (node.children && Array.isArray(node.children)) node.children.forEach(traverse);
    };
    traverse(tree);
  };
}

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev
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
    // Relying solely on the high-performance structural Remark pre-processor
    remarkPlugins: [remarkEllipsisFix],
  },
});
