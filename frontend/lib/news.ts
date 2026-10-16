import * as fumadocs_core_source from 'fumadocs-core/source';
import * as fumadocs_mdx_server  from 'fumadocs-mdx:collections/server';

/** Fumadocs content source loader for /news. */
export const news = fumadocs_core_source.loader({
  baseUrl: '/news',
  source: fumadocs_mdx_server.news.toFumadocsSource()
});

type NewsPage = ReturnType<typeof news.getPages>[number];

/** Short date label (fixed locale/timezone so server and client always match). */
export function fmt_post_date(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month:    'short',
    day:      'numeric',
    year:     'numeric',
    timeZone: 'UTC'
  });
}

/** Published posts only, newest first. `publish` defaults to false. */
export function get_posts() {
  return news
    .getPages()
    .filter((p) => p.data.publish === true)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Plain, serializable post data for the client components. */
export function to_entry(page: NewsPage) {
  const hash = [...page.slugs.join('/')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const hue  = 190 + (hash % 100);
  return {
    slug:        page.slugs[0],
    title:       page.data.title,
    description: page.data.description ?? '',
    date:        fmt_post_date(page.data.date),
    author:      page.data.author ?? 'ov-studio',
    tags:        page.data.tags,
    cover:       page.data.cover,
    hue,
    hue2:        (hue + 60) % 360
  };
}
