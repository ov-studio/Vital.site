'use client';
import * as ui_divider      from '@/ui/divider';
import * as ui_empty        from '@/ui/empty';
import * as ui_iconbutton   from '@/ui/iconbutton';
import * as ui_page         from '@/ui/page';
import * as ui_tagpill      from '@/ui/tagpill';
import * as lib_hooks       from '@/lib/hooks';
import * as news_posts      from './use_posts';
import * as react           from 'react';
import * as lucide          from 'lucide-react';
import * as next_link       from 'next/link';
import * as next_navigation from 'next/navigation';
import '@/ui/modal/index.css';
import './post.css';

function ShareButton({ slug }: { slug: string }) {
  const { copied: copied_key, copy } = lib_hooks.use_clipboard(2000);
  const copied = copied_key !== null;

  return (
    <ui_iconbutton.IconButton
      className={`ui-modal-share${copied ? ' copied' : ''}`}
      title={copied ? 'Link copied' : 'Copy link'}
      icon={copied ? lucide.Check : lucide.Link}
      iconProps={{ size: 14, strokeWidth: 2.5 }}
      onClick={() => copy(news_posts.share_url(slug))}
    />
  );
}

function BackLink() {
  return (
    <next_link.default href="/news" className="np-back">
      <lucide.ArrowLeft size={14} strokeWidth={2.5}/>
      All news
    </next_link.default>
  );
}

export function NewsPost() {
  const searchParams = next_navigation.useSearchParams();
  const slug         = searchParams.get('slug') ?? '';
  const { posts, state } = news_posts.use_news_posts();
  const post = posts.find(p => p.slug === slug) ?? null;

  react.useEffect(() => {
    if (post) document.title = `${post.title} - Vital.sandbox`;
  }, [post]);

  if (state === 'loading') return <ui_page.Page id="news-post">{null}</ui_page.Page>;

  if (!post) {
    return (
      <ui_page.Page id="news-post">
        <div className="np">
          <div className="np-top anim-in"><BackLink/></div>
          <ui_empty.EmptyState icon={<lucide.Newspaper size={24}/>}>
            {state === 'error'
              ? 'Failed to load news — check your connection and try again'
              : 'This post could not be found'}
          </ui_empty.EmptyState>
        </div>
      </ui_page.Page>
    );
  }

  return (
    <ui_page.Page id="news-post">
      <article className="np">
        <div className="np-top anim-in">
          <BackLink/>
          <ShareButton slug={post.slug}/>
        </div>

        {post.cover && (
          <figure className="np-cover anim-in anim-in--2">
            <img src={post.cover} alt={post.title}/>
          </figure>
        )}

        <div className="np-head anim-in anim-in--3">
          <div className="np-meta">
            <span className="ui-modal-author">{post.author}</span>
            <time className="np-date">{post.date}</time>
          </div>
          <h1 className="np-title">{post.title}</h1>
          {post.description && <p className="np-lead">{post.description}</p>}
          {post.tags.length > 0 && (
            <div className="np-tags">
              {post.tags.map(t => <ui_tagpill.TagPill key={t} label={t}/>)}
            </div>
          )}
        </div>

        <ui_divider.Divider className="np-divider anim-in anim-in--4"/>

        <div className="np-prose ui-modal-prose" dangerouslySetInnerHTML={{ __html: post.html }}/>
      </article>
    </ui_page.Page>
  );
}
