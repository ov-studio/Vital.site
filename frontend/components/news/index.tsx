'use client';
import * as config_pages  from '@/configs/pages';
import * as ui_card       from '@/ui/card';
import * as ui_empty      from '@/ui/empty';
import * as ui_iconbutton from '@/ui/iconbutton';
import * as ui_modal      from '@/ui/modal';
import * as ui_page       from '@/ui/page';
import * as ui_pagehead   from '@/ui/pagehead';
import * as ui_tagpill    from '@/ui/tagpill';
import * as lib_api_url   from '@/lib/api_url';
import * as lib_hooks     from '@/lib/hooks';
import * as lib_news      from '@/lib/news';
import * as react         from 'react';
import * as lucide        from 'lucide-react';
import * as next_navigation from 'next/navigation';
import './index.css';

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

function use_news_posts() {
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

function Banner({ post, size }: { post: NewsEntry; size: 'card' | 'modal' }) {
  return (
    <div className={`news-banner news-banner--${size}`}>
      {post.cover && <img src={post.cover} alt={post.title}/>}
    </div>
  );
}

function NewsModal({ post, on_close, closing }: {
  post:     NewsEntry;
  on_close: () => void;
  closing:  boolean;
}) {
  const { copied: copied_key, copy } = lib_hooks.use_clipboard(2000);
  const copied = copied_key !== null;

  const handle_share = react.useCallback(() => {
    copy(`${window.location.origin}/news/${post.slug}`);
  }, [post.slug, copy]);

  const controls = (
    <>
      <ui_iconbutton.IconButton
        className={`ui-modal-share${copied ? ' copied' : ''}`}
        icon={copied ? lucide.Check : lucide.Link}
        iconProps={{ size: 14, strokeWidth: 2.5 }}
        onClick={handle_share}
      />
      <ui_iconbutton.IconButton
        className="ui-modal-close"
        icon={lucide.X}
        iconProps={{ size: 14, strokeWidth: 2.5 }}
        onClick={on_close}
      />
    </>
  );

  return (
    <ui_modal.Modal
      closing={closing}
      onClose={on_close}
      controls={controls}
      media={<Banner post={post} size="modal"/>}
      label={post.title}
      maxWidth={875}
    >
      <ui_modal.ModalHeader
        author={post.author}
        version={post.date}
        title={post.title}
        tagline={post.description}
        titleClassName="ui-modal-name--wrap"
      />
      <ui_modal.ModalBody prose={false}>
        <div className="ui-modal-prose" dangerouslySetInnerHTML={{ __html: post.html }}/>
      </ui_modal.ModalBody>
      <ui_modal.ModalFooter>
        {post.tags.length > 0 && (
          <div className="ui-modal-tags">
            {post.tags.map(t => (
              <ui_tagpill.TagPill key={t} label={t} className="ui-modal-tag"/>
            ))}
          </div>
        )}
      </ui_modal.ModalFooter>
    </ui_modal.Modal>
  );
}

export function News() {
  const router       = next_navigation.useRouter();
  const searchParams = next_navigation.useSearchParams();
  const { posts, state } = use_news_posts();
  const [selected, set_selected] = react.useState<NewsEntry | null>(null);
  const [closing,  set_closing]  = react.useState(false);
  const [initial_modal_slug, set_initial_modal_slug] = react.useState(() => searchParams.get('modal'));

  react.useEffect(() => {
    if (initial_modal_slug) return; 
    const params = new URLSearchParams();
    if (selected) params.set('modal', selected.slug);
    const qs   = params.toString();
    const next = `/news${qs ? `?${qs}` : ''}`;
    const cur  = window.location.pathname + window.location.search;
    if (cur === next) return;
    router.replace(next, { scroll: false });
  }, [selected, initial_modal_slug, router]);

  react.useEffect(() => {
    if (state === 'loading' || !initial_modal_slug) return;
    const match = posts.find(p => p.slug === initial_modal_slug);
    if (match) { set_closing(false); set_selected(match); }
    set_initial_modal_slug(null);
  }, [state, posts, initial_modal_slug]);

  const open = react.useCallback((p: NewsEntry) => {
    set_closing(false);
    set_selected(p);
  }, []);

  const close = react.useCallback(() => {
    set_closing(prev => {
      if (prev) return prev;
      window.setTimeout(() => { set_selected(null); set_closing(false); }, 220);
      return true;
    });
  }, []);

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
              coverNode={<Banner post={post} size="card"/>}
              onClick={() => open(post)}
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

      {selected && (
        <NewsModal post={selected} on_close={close} closing={closing}/>
      )}
    </ui_page.Page>
  );
}
