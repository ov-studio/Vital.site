import *      as config_site  from '@/configs/site';
import *      as config_pages from '@/configs/pages';
import *      as lib_api_url  from '@/lib/api_url';
import *      as lib_og_sizes from '@/lib/og_sizes';
import type * as next         from 'next';

type PageKey = keyof typeof config_pages.pages;

/** Shared Open Graph + Twitter + canonical block. */
function social(
  title: string,
  description: string,
  path: string,
  image: string,
): Pick<next.Metadata, 'alternates' | 'openGraph' | 'twitter'> {
  return {
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: config_site.info.name,
      type: 'website',
      images: [{ url: image, width: lib_og_sizes.OG_W, height: lib_og_sizes.OG_H, type: 'image/png' }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    },
  };
}

/**
 * Root layout metadata (home defaults + title template + metadataBase).
 * Section pages use `page_meta` instead.
 */
export function root_meta(): next.Metadata {
  const title = config_site.info.name;
  const seo_title = config_site.info.seo.title;
  const description = config_site.info.seo.description;
  return {
    metadataBase: new URL(lib_api_url.get_frontend_url()),
    title: {
      template: `%s - ${title}`,
      default: seo_title
    },
    description,
    ...social(seo_title, description, '/', '/og/default.png')
  };
}

/**
 * Section-page metadata: title, description, canonical, og:url,
 * og:image (brand /og/<section>), and twitter card.
 */
export function page_meta(key: PageKey, path: string): next.Metadata {
  const { title, description } = config_pages.pages[key];
  const section = path.replace(/^\//, '');
  return {
    title,
    description,
    ...social(title, description, path, `/og/${section}`)
  };
}
