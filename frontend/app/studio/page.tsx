import '@/app/global.css';
import * as lib_page_meta         from '@/lib/page_meta';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_studio      from '@/components/studio';
import * as component_clientshell from '@/components/clientshell';

export const metadata = lib_page_meta.page_meta('studio', '/studio');

export default function StudioPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar
        links={[
          { label: 'News', href: '/news' },
          { label: 'Documentations', href: '/docs' },
          { label: 'Roadmap', href: '/roadmap' }
        ]}
      />
      <component_studio.Studio/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
