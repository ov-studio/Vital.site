'use client';
import * as ui_empty        from '@/ui/empty';
import * as ui_modal        from '@/ui/modal';
import * as ui_page         from '@/ui/page';
import * as ui_tagpill      from '@/ui/tagpill';
import * as news_posts      from '@/lib/news_posts';
import * as react           from 'react';
import * as lucide          from 'lucide-react';
import * as next_link       from 'next/link';
import * as next_navigation from 'next/navigation';
import './index.css';

function BackLink() {
  return (
    <next_link.default href="/news" className="np-back">
      <lucide.ArrowLeft size={14} strokeWidth={2.5}/>
      All news
    </next_link.default>
  );
}

export function NewsPost() {
  const router       = next_navigation.useRouter();
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
      <article className="np anim-in anim-in--2">
        <ui_modal.Modal
          inline
          onClose={() => router.push('/news')}
          share={() => news_posts.share_url(post.slug)}
          media={post.cover ? (
            <figure className="np-cover">
              <img src={post.cover} alt={post.title}/>
            </figure>
          ) : null}
        >
          <ui_modal.ModalHeader
            author={post.author}
            version={post.date}
            title={post.title}
            tagline={post.description}
            titleLevel={1}
            divider={false}
            wrap
          />
          {post.tags.length > 0 && (
            <div className="ui-modal-tags np-tags">
              {post.tags.map(t => <ui_tagpill.TagPill key={t} label={t}/>)}
            </div>
          )}
          <hr className="ui-modal-divider"/>
          <div className="np-prose ui-modal-prose" dangerouslySetInnerHTML={{ __html: post.html }}/>
        </ui_modal.Modal>
      </article>
    </ui_page.Page>
  );
}
