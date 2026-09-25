import '@/app/global.css';
import * as config_pages          from '@/configs/pages';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_studio      from '@/components/studio';
import * as component_clientshell from '@/components/clientshell';
import * as next                  from 'next';

export const metadata: next.Metadata = {
  title: config_pages.pages.studio.title,
  description: config_pages.pages.studio.description,
  openGraph: {
    images: [{ url: '/og/studio' }]
  }
};

export default function StudioPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar
        links={[
          { label: 'Documentations', href: '/docs' },
          { label: 'Roadmap', href: '/roadmap' }
        ]}
      />
      <component_studio.Studio/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
