import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_news        from '@/components/news';
import * as component_clientshell from '@/components/clientshell';
import * as lib_news              from '@/lib/news';
import * as react                 from 'react';

export function NewsView({ slug }: { slug?: string }) {
  const pages  = lib_news.get_posts();
  const posts  = pages.map(lib_news.to_entry);
  const bodies: Record<string, react.ReactNode> = {};
  for (const page of pages) {
    const Body = page.data.body;
    bodies[page.slugs[0]] = <Body/>;
  }

  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Vault', href: '/vault' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]}/>
      <react.Suspense>
        <component_news.News posts={posts} bodies={bodies} initial={slug}/>
      </react.Suspense>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
