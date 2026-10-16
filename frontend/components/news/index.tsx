'use client';
import * as config_pages  from '@/configs/pages';
import * as ui_card       from '@/ui/card';
import * as ui_iconbutton from '@/ui/iconbutton';
import * as ui_modal      from '@/ui/modal';
import * as ui_page       from '@/ui/page';
import * as ui_pagehead   from '@/ui/pagehead';
import * as ui_tagpill    from '@/ui/tagpill';
import * as lib_hooks     from '@/lib/hooks';
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
  hue:         number;
  hue2:        number;
}

function Banner({ post, size }: { post: NewsEntry; size: 'card' | 'modal' }) {
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

function NewsModal({ post, body, on_close, closing }: {
  post:     NewsEntry;
  body:     react.ReactNode;
  on_close: () => void;
  closing:  boolean;
}) {
  const { copied: copied_key, copy } = lib_hooks.use_clipboard(2000);
  const copied = copied_key !== null;

  const handle_share = react.useCallback(() => {
    copy(`${window.location.origin}/news?modal=${post.slug}`);
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
      <ui_modal.ModalBody>
        <article className="news-prose">{body}</article>
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

export function News({ posts, bodies }: { posts: NewsEntry[]; bodies: Record<string, react.ReactNode> }) {
  const router       = next_navigation.useRouter();
  const searchParams = next_navigation.useSearchParams();
  const [slug,    set_slug]    = react.useState<string | null>(null);
  const [closing, set_closing] = react.useState(false);

  react.useEffect(() => {
    const m = searchParams.get('modal');
    if (m) set_slug(m);
  }, []);

  react.useEffect(() => {
    const next = `/news${slug ? `?modal=${slug}` : ''}`;
    const cur  = window.location.pathname + window.location.search;
    if (cur === next) return;
    router.replace(next, { scroll: false });
  }, [slug, router]);

  const open = react.useCallback((s: string) => {
    set_closing(false);
    set_slug(s);
  }, []);

  const close = react.useCallback(() => {
    set_closing(prev => {
      if (prev) return prev;
      window.setTimeout(() => { set_slug(null); set_closing(false); }, 220);
      return true;
    });
  }, []);

  const selected = posts.find(p => p.slug === slug) ?? null;

  return (
    <ui_page.Page id="news">
      <ui_pagehead.PageHead
        label="News"
        title={<>Project updates,<br/>Delivered as they <span>ship.</span></>}
        intro={config_pages.pages.news.description}
      />

      <div className="news-grid anim-in anim-in--3">
        {posts.map((post) => (
          <ui_card.Card
            key={post.slug}
            layout="stack"
            className="news-card"
            coverNode={<Banner post={post} size="card"/>}
            onClick={() => open(post.slug)}
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

      {selected && (
        <NewsModal post={selected} body={bodies[selected.slug]} on_close={close} closing={closing}/>
      )}
    </ui_page.Page>
  );
}
