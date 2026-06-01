import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Production-only fix to prevent compilers from stripping indentation before an ellipsis (...)
function remarkEllipsisFix() {
  return (tree: any) => {
    if (process.env.NODE_ENV !== 'production') return;

    // Helper function to safely traverse all nested nodes in the MDX tree
    const traverse = (node: any) => {
      if (!node) return;
      // Targets all markdown code blocks containing an ellipsis
      if (node.type === 'code' && node.value && node.value.includes('...')) {
        // Captures leading spaces/tabs on any line and pads the ellipsis for production alignment
        node.value = node.value.replace(/^([ \t]*)\.\.\./gm, '$1    ...');
      }

      // Continue traversing down if children exist
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
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
