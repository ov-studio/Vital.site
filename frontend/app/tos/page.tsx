import '@/app/global.css';
import * as lib_page_meta         from '@/lib/page_meta';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_tos         from '@/components/tos';
import * as component_clientshell from '@/components/clientshell';

export const metadata = lib_page_meta.page_meta('tos', '/tos');

export default function TOSPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Vault', href: '/vault' },
        { label: 'News', href: '/news' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]}/>
      <component_tos.TOS/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
