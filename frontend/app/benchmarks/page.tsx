import '@/app/global.css';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_benchmarks  from '@/components/benchmarks';
import * as component_clientshell from '@/components/clientshell';
import * as next                  from 'next';

export const metadata: next.Metadata = {
  title: 'Benchmarks',
};

export default function BenchmarksPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Vault', href: '/vault' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]}/>
      <component_benchmarks.Benchmarks/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
