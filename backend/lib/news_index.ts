import * as config_site from '@/configs/site';

const RAW_URL = `https://raw.githubusercontent.com/${config_site.info.git.news.user}/${config_site.info.git.news.repo}/${config_site.info.git.news.branch}/news.json`;

export interface NewsListing {
  slug:         string;
  title:        string;
  description?: string;
  cover?:       string | null;
}

/** Look up one post in news.json (null if missing or GitHub is unreachable). */
export async function find_news_post(slug: string): Promise<NewsListing | null> {
  try {
    const res = await fetch(RAW_URL, {
      next:    { revalidate: 300 },
      headers: config_site.info.api.github_headers
    });
    if (!res.ok) return null;

    const index = await res.json() as { posts?: NewsListing[] };
    return index.posts?.find((p) => p.slug === slug) ?? null;
  }
  catch {
    return null;
  }
}

/** Cover formats the OG image generator can crop. */
export function has_og_cover(cover?: string | null): cover is string {
  return !!cover && /\.(png|jpe?g|gif)$/i.test(cover);
}
