import * as config_site          from '@/configs/site';
import * as react                from 'react';
import * as lucide               from 'lucide-react';
import * as fumadocs_core_source from 'fumadocs-core/source';
import * as fumadocs_mdx_server  from 'fumadocs-mdx:collections/server';

/** Re-export client-safe anchor helper for docs. */
export { to_anchor } from '@/lib/anchor';

/** Fumadocs content source loader for /docs. */
export const source = fumadocs_core_source.loader({
  baseUrl: '/docs',
  source: fumadocs_mdx_server.docs.toFumadocsSource(),
  icon(name) {
    if (!name || !/^[A-Z]/.test(name)) return;
    const icon = (lucide as unknown as Record<string, lucide.LucideIcon | undefined>)[name];
    if (!icon) {
      console.warn(`[docs] unknown lucide icon "${name}"`);
      return;
    }
    return react.createElement(icon, config_site.info.lucide);
  },
  slugs(file) {
    const parts = file.path.replace(/\.mdx?$/, '').split('/');
    const last = parts[parts.length - 1];
    const match = last.match(/^([^_]+)__(.+)$/);
    if (match) {
      const [, prefix, name] = match;
      return [...parts.slice(0, -1), prefix, name];
    }
  },
});

/** OG image path segments and URL for a docs page. */
export function getPageImage(page: fumadocs_core_source.InferPageType<typeof source>) {
  const path = page.slugs.length ? page.slugs.join('--') : '_';
  return {
    segments: [path],
    url: `/og/docs/${path}`
  };
}

/** Flatten a docs page to markdown text for LLM / search indexing. */
export async function getLLMText(page: fumadocs_core_source.InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');
  return `# ${page.data.title}\n\n${processed}`;
}
