'use client';
import * as config_pages from '@/configs/pages';
import * as ui_button    from '@/ui/button';
import * as ui_card      from '@/ui/card';
import * as ui_modal     from '@/ui/modal';
import * as ui_page      from '@/ui/page';
import * as ui_pagehead  from '@/ui/pagehead';
import * as ui_tagpill   from '@/ui/tagpill';
import * as lucide       from 'lucide-react';
import './index.css';

export interface NewsEntry {
  url:         string;
  title:       string;
  description: string;
  date:        string;
  author:      string;
  tags:        string[];
  cover?:      string;
  hue:         number;
  hue2:        number;
}

function Banner({ post, size }: { post: NewsEntry; size: 'card' | 'feature' | 'post' }) {
  return (
    <div
      className={`news-banner news-banner--${size}`}
      style={{ '--hue': post.hue, '--hue2': post.hue2 } as React.CSSProperties}
    >
      {post.cover
        ? <img src={post.cover} alt={post.title}/>
        : <div className="news-banner-art"><lucide.Newspaper size={size === 'card' ? 48 : 80} strokeWidth={1.25}/></div>
      }
      <div className="news-banner-overlay"/>
    </div>
  );
}

function Tags({ tags, className = '' }: { tags: string[]; className?: string }) {
  if (!tags.length) return null;
  return (
    <div className={`news-tags ${className}`}>
      {tags.map((tag) => <ui_tagpill.TagPill key={tag} label={tag}/>)}
    </div>
  );
}

export function NewsList({ posts }: { posts: NewsEntry[] }) {
  const [featured, ...rest] = posts;
  return (
    <ui_page.Page id="news">
      <ui_pagehead.PageHead
        label="News"
        title={<>Latest <span>News</span></>}
        intro={config_pages.pages.news.description}
      />

      {featured && (
        <a href={featured.url} className="news-feature anim-in anim-in--3">
          <div className="news-feature-inner">
            <Banner post={featured} size="feature"/>
            <div className="news-feature-body">
              <ui_card.CardMeta
                author={featured.author}
                version={featured.date}
                title={featured.title}
                tagline={featured.description}
              />
              <Tags tags={featured.tags}/>
              <span className="news-feature-cta">Read post →</span>
            </div>
          </div>
        </a>
      )}

      {rest.length > 0 && (
        <div className="news-grid anim-in anim-in--4">
          {rest.map((post) => (
            <a key={post.url} href={post.url} className="news-card-link">
              <ui_card.Card
                layout="stack"
                className="news-card"
                coverNode={<Banner post={post} size="card"/>}
                bodyContent={
                  <>
                    <ui_card.CardMeta
                      author={post.author}
                      version={post.date}
                      title={post.title}
                      tagline={post.description}
                    />
                    <Tags tags={post.tags}/>
                  </>
                }
              />
            </a>
          ))}
        </div>
      )}
    </ui_page.Page>
  );
}

export function NewsPost({ post, children }: { post: NewsEntry; children: React.ReactNode }) {
  return (
    <ui_page.Page id="news-post">
      <div className="news-frame">
        <div className="news-frame-inner">
          <Banner post={post} size="post"/>
          <div className="news-frame-body">
            <ui_modal.ModalHeader
              author={post.author}
              version={post.date}
              title={post.title}
              tagline={post.description}
              titleClassName="ui-modal-name--wrap"
            />
            <article className="news-prose">{children}</article>
            <Tags tags={post.tags} className="news-tags--post"/>
            <ui_modal.ModalActions>
              <ui_button.Button variant="primary" href="/news">Back to News</ui_button.Button>
            </ui_modal.ModalActions>
          </div>
        </div>
      </div>
    </ui_page.Page>
  );
}
