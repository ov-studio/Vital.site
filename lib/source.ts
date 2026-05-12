import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import * as LucideIcons from 'lucide-react';
import { createElement } from 'react';
import { site } from '@/configs/site';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(name) {
    if (name && name in LucideIcons) {
      return createElement(LucideIcons[name as keyof typeof LucideIcons] as any, site.lucide);
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

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];
  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');
  return `# ${page.data.title}\n\n${processed}`;
}