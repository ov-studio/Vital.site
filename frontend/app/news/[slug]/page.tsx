import '@/app/global.css';
import * as component_news from '@/components/news/server';
import * as lib_news       from '@/lib/news';
import * as lib_og_brand   from '@/lib/og_brand';
import * as next           from 'next';
import * as next_navigation from 'next/navigation';

export const dynamicParams = false;

type Params = { slug: string };

export default async function NewsPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!lib_news.news.getPage([slug])) next_navigation.notFound();
  return <component_news.NewsView slug={slug}/>;
}

export function generateStaticParams() {
  return lib_news.news.getPages().map((page) => ({ slug: page.slugs[0] }));
}

/** Shared links embed the post's cover as the OG image (falls back to /og/news). */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<next.Metadata> {
  const { slug } = await params;
  const page = lib_news.news.getPage([slug]);
  if (!page) next_navigation.notFound();

  const image = {
    url:    lib_news.has_og_cover(page.data.cover) ? `/og/posts/${slug}` : '/og/news',
    width:  lib_og_brand.OG_W,
    height: lib_og_brand.OG_H
  };
  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: 'article',
      publishedTime: page.data.date.toISOString(),
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: [image.url]
    }
  };
}
