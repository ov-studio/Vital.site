import * as config_site  from '@/configs/site';
import * as config_pages from '@/configs/pages';
import { OG_W, OG_H }    from '@/lib/og_sizes';
import type * as next    from 'next';

type PageKey = keyof typeof config_pages.pages;

/**
 * Shared section-page metadata: title, description, canonical, og:url,
 * og:image (brand /og/<section>), and twitter card — one place for all listing pages.
 */
export function page_meta(key: PageKey, path: string): next.Metadata {
  const { title, description } = config_pages.pages[key];
  const section = path.replace(/^\//, '');
  const image = `/og/${section}`;

  return {
    title,
    description,
    alternates: { canonical: path },

    openGraph: {
      title,
      description,
      url: path,
      siteName: config_site.info.name,
      type: 'website',
      images: [{ url: image, width: OG_W, height: OG_H, type: 'image/png' }]
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}
