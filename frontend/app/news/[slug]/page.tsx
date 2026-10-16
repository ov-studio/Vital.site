import '@/app/global.css';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_news        from '@/components/news';
import * as component_clientshell from '@/components/clientshell';
import * as lib_news              from '@/lib/news';
import * as next_navigation       from 'next/navigation';

export const dynamicParams = false;

type Params = { slug: string };

export default async function NewsPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = lib_news.news.getPage([slug]);
  if (!page) next_navigation.notFound();

  const MDXContent = page.data.body;

  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Vault', href: '/vault' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' },
        { label: 'News', href: '/news' }
      ]}/>
      <component_news.NewsPost post={lib_news.to_entry(page)}>
        <MDXContent/>
      </component_news.NewsPost>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}

export function generateStaticParams() {
  return lib_news.news.getPages().map((page) => ({ slug: page.slugs[0] }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = lib_news.news.getPage([slug]);
  if (!page) next_navigation.notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: [{ url: page.data.cover ?? '/og/news' }]
    }
  };
}
