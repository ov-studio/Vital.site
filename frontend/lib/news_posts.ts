'use client';
import * as lib_api_url from '@/lib/api_url';
import * as lib_hooks   from '@/lib/hooks';
import * as lib_news    from '@/lib/news';
import * as react       from 'react';

export interface NewsEntry {
  slug:        string;
  title:       string;
  description: string;
  date:        string;
  author:      string;
  tags:        string[];
  cover?:      string;
  html:        string;
}

/** In-site URL of the article page for a post slug (slug may contain folders). */
export function post_href(slug: string): string {
  return `/news/post?slug=${encodeURIComponent(slug)}`;
}

/** Public share URL of a post (served by the backend share route with link-preview tags). */
export function share_url(slug: string): string {
  return `${window.location.origin}/news/${slug.split('/').map(encodeURIComponent).join('/')}`;
}

/** Loads news.json once and exposes the posts plus the fetch state. */
export function use_news_posts() {
  const [posts, set_posts] = react.useState<NewsEntry[]>([]);
  const [state, set_state] = react.useState<lib_news.NewsLoadState>('loading');

  lib_hooks.use_page_loading(state === 'loading');

  react.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(lib_api_url.get_api_url('/news'));
        if (!res.ok) throw new Error(`news.json fetch ${res.status}`);
        const index: lib_news.NewsIndex = await res.json();
        const entries: NewsEntry[] = (index.posts ?? []).map(p => ({
          slug:        p.slug,
          title:       p.title,
          description: p.description ?? '',
          date:        lib_news.fmt_post_date(new Date(p.date)),
          author:      p.author,
          tags:        Array.isArray(p.tags) ? p.tags : [],
          cover:       p.cover ?? undefined,
          html:        p.html ?? ''
        }));
        if (!cancelled) { set_posts(entries); set_state('done'); }
      }
      catch (err) {
        console.error('[News]', err);
        if (!cancelled) set_state('error');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return {
    posts,
    state
  };
}
