import '@/app/global.css';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_tos         from '@/components/tos';
import * as component_clientshell from '@/components/clientshell';
import * as lib_api_url           from '@/lib/api_url';
import * as next                  from 'next';

export const metadata: next.Metadata = {
  title: 'Terms of Service',
  openGraph: {
    images: [{ url: lib_api_url.get_api_url('/og?path=/tos') }]
  }
};

export default function TOSPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Vault', href: '/vault' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]}/>
      <component_tos.TOS/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
