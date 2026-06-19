import * as config_site from '@/configs/site';
import * as react from 'react';
import * as lucide from 'lucide-react';
import * as fumadocs_core_source from 'fumadocs-core/source';
import * as fumadocs_mdx_server from 'fumadocs-mdx:collections/server';

export function to_anchor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const source = fumadocs_core_source.loader({
  baseUrl: '/docs',
  source: fumadocs_mdx_server.docs.toFumadocsSource(),
  icon(name) {
    if (name && name in lucide) {
      return react.createElement(lucide[name as keyof typeof lucide] as any, config_site.info.lucide);
    }
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

export function getPageImage(page: fumadocs_core_source.InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];
  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: fumadocs_core_source.InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');
  return `# ${page.data.title}\n\n${processed}`;
}