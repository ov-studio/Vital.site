'use client';
import * as config_pages    from '@/configs/pages';
import * as ui_card         from '@/ui/card';
import * as ui_empty        from '@/ui/empty';
import * as ui_page         from '@/ui/page';
import * as ui_pagehead     from '@/ui/pagehead';
import * as ui_tagpill      from '@/ui/tagpill';
import * as news_posts      from './use_posts';
import * as react           from 'react';
import * as lucide          from 'lucide-react';
import * as next_navigation from 'next/navigation';
import './index.css';

export type NewsEntry = news_posts.NewsEntry;

function Banner({ post }: { post: NewsEntry }) {
  return (
    <div className="news-banner news-banner--card">
      {post.cover && <img src={post.cover} alt={post.title}/>}
    </div>
  );
}

export function News() {
  const router       = next_navigation.useRouter();
  const searchParams = next_navigation.useSearchParams();
  const legacy_slug  = searchParams.get('modal');
  const { posts, state } = news_posts.use_news_posts();

  // Old shared links (/news?modal=<slug>) now land on the article page.
  react.useEffect(() => {
    if (legacy_slug) router.replace(news_posts.post_href(legacy_slug));
  }, [legacy_slug, router]);

  if (legacy_slug) return null;

  return (
    <ui_page.Page id="news">
      <ui_pagehead.PageHead
        label="News"
        title={<>Project updates,<br/>Delivered as they <span>ship.</span></>}
        intro={config_pages.pages.news.description}
      />

      {state !== 'loading' && (
        <div className="news-grid anim-in anim-in--3">
          {state === 'error' && (
            <ui_empty.EmptyState icon={<lucide.WifiOff size={24} strokeWidth={2.5}/>}>
              Failed to load news — check your connection and try again
            </ui_empty.EmptyState>
          )}
          {state === 'done' && posts.length === 0 && (
            <ui_empty.EmptyState icon={<lucide.Newspaper size={24}/>}>
              No posts published yet
            </ui_empty.EmptyState>
          )}
          {state === 'done' && posts.map((post) => (
            <ui_card.Card
              key={post.slug}
              layout="stack"
              className="news-card"
              coverNode={<Banner post={post}/>}
              onClick={() => router.push(news_posts.post_href(post.slug))}
              bodyContent={
                <>
                  <ui_card.CardMeta
                    author={post.author}
                    version={post.date}
                    title={post.title}
                    tagline={post.description}
                  />
                  {post.tags.length > 0 && (
                    <div className="news-tags">
                      {post.tags.map(t => <ui_tagpill.TagPill key={t} label={t}/>)}
                    </div>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </ui_page.Page>
  );
}
