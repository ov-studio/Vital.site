import '@/app/global.css';
import * as config_pages  from '@/configs/pages';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_news        from '@/components/news';
import * as component_clientshell from '@/components/clientshell';
import * as react                 from 'react';
import * as next                  from 'next';

export const metadata: next.Metadata = {
  title: config_pages.pages.news.title,
  description: config_pages.pages.news.description,
  openGraph: {
    images: [{ url: '/og/news' }]
  }
};

export default function NewsPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Vault', href: '/vault' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]}/>
      <react.Suspense>
        <component_news.News/>
      </react.Suspense>
      <component_footer.Footer/>
    </component_clientshell.ClientShell> 
  );
} 
 