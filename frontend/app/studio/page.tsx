import '@/app/global.css';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_studio      from '@/components/studio';
import * as component_clientshell from '@/components/clientshell';
import * as lib_api_url           from '@/lib/api_url';
import * as next                  from 'next';

export const metadata: next.Metadata = {
  title: 'Studio',
  openGraph: {
    images: [{ url: lib_api_url.get_api_url('/og?path=/studio') }]
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
