import '@/app/global.css';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_vault       from '@/components/vault';
import * as component_clientshell from '@/components/clientshell';
import * as react                 from 'react';
import * as next                  from 'next';

export const metadata: next.Metadata = {
  title: 'Vault',
};

export default function VaultPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay />
      <component_navbar.Navbar links={[
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]} />
      <react.Suspense>
        <component_vault.Vault />
      </react.Suspense>
      <component_footer.Footer />
    </component_clientshell.ClientShell>
  );
}