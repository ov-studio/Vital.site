import '../../app/global.css';
import type { Metadata } from 'next';
import * as component_overlay from '@/components/overlay';
import * as component_navbar from '@/components/navbar';
import * as component_footer from '@/components/footer';
import * as component_tos from '@/components/tos';
import * as component_clientshell from '@/components/clientshell';

export const metadata: Metadata = {
  title: 'Terms of Service'
};

export default function TOSPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[]}/>
      <component_tos.TOS/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
