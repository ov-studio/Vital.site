import '@/app/global.css';
import * as component_overlay from '@/components/overlay';
import * as component_navbar from '@/components/navbar';
import * as component_footer from '@/components/footer';
import * as component_vault from '@/components/vault';
import * as component_clientshell from '@/components/clientshell';
import * as next from 'next';

export const metadata: next.Metadata = {
  title: 'Vault',
};

export default function VaultPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[]}/>
      <component_vault.Vault/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
