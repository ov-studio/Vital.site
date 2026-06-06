import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

function remarkEllipsisFix() {
  return (tree: any) => {
    const traverse = (node: any) => {
      if (!node) return;
      if (node.type === 'code' && node.value && node.value.includes('...')) {
        node.value = node.value.replace(/^([ \t]*)\.\.\./gm, '$1  ...');
        node.value = node.value.replace(/([\w\)\],]+)[ \t]*\.{2,3}/g, '$1   ...');
      }
      if (node.children && Array.isArray(node.children)) node.children.forEach(traverse);
    };
    traverse(tree);
  };
}

function remarkLuaCommentFix() {
  return (tree: any) => {
    const traverse = (node: any) => {
      if (!node) return;
      if (node.type === 'code' && (node.lang === 'lua' || node.lang === null) && node.value) {
        node.value = node.value.split('\n').map((line: string) => {
          if (/^[ \t]*--(?![-\[])/.test(line)) return ' ' + line;
          return line.replace(/(\S)[ \t]*--(?![-\[])(.*)/g, (_, pre, body) => {
            const safeBody = body.match(/^['"\-\.]/) ? ' ' + body : body;
            return pre + '  --' + safeBody;
          });
        }).join('\n');
      }
      if (node.children && Array.isArray(node.children)) node.children.forEach(traverse);
    };
    traverse(tree);
  };
}

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
    remarkPlugins: [remarkEllipsisFix, remarkLuaCommentFix],
  },
});