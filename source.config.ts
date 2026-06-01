import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Production-only fix to prevent compilers from stripping indentation before an ellipsis (...)
function remarkEllipsisFix() {
  return (tree: any) => {
    if (process.env.NODE_ENV !== 'production') return;
    const traverse = (node: any) => {
      if (!node) return;
      if (node.type === 'code' && node.value && node.value.includes('...')) {
        node.value = node.value.replace(/^([ \t]*)\.\.\./gm, '$1  ...');
      }
      if (node.children && Array.isArray(node.children)) node.children.forEach(traverse);
    };
    traverse(tree);
  };
}

// Production HTML-level fix that forces the text values inside code blocks to be spaced correctly
function rehypeEllipsisFix() {
  return (tree: any) => {
    if (process.env.NODE_ENV !== 'production') return;
    const traverse = (node: any) => {
      if (!node) return;

      // Targets the literal text values inside HTML elements within code blocks
      if (node.type === 'text' && node.value) {
        // Automatically converts any broken "local.." or "local..." text blocks into "local ..."
        if (node.value.includes('local.')) {
          node.value = node.value.replace(/local\s*\.{2,3}/g, 'local ...');
        }
        // Cleans up standalone dots that might be grouped inside a broken text node span
        if (node.value === '..' || node.value === '...') {
          node.value = ' ...';
        }
      }

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
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
    remarkPlugins: [remarkEllipsisFix],
    // Injected the HTML-level token post-processor
    rehypePlugins: [rehypeEllipsisFix],
  },
});
