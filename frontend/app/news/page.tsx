import '@/app/global.css';
import * as config_pages  from '@/configs/pages';
import * as component_news from '@/components/news/server';
import * as next          from 'next';

export const metadata: next.Metadata = {
  title: config_pages.pages.news.title,
  description: config_pages.pages.news.description,
  openGraph: {
    images: [{ url: '/og/news' }]
  }
};

export default function NewsPage() {
  return <component_news.NewsView/>;
}
