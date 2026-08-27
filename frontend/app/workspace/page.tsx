import '@/app/global.css';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_workspace   from '@/components/workspace';
import * as component_clientshell from '@/components/clientshell';
import * as next                  from 'next';

export const metadata: next.Metadata = {
  title:  'Workspace',
  robots: { index: false, follow: false }
};

export default function WorkspacePage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Vault', href: '/vault' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]}/>
      <component_workspace.Workspace/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
