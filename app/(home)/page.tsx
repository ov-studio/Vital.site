import '../global.css';
import * as component_overlay from '@/components/overlay';
import * as component_navbar from '@/components/navbar';
import * as component_footer from '@/components/footer';
import * as component_home_hero from '@/components/home/hero';
import * as component_home_features from '@/components/home/features';
import * as component_home_ethos from '@/components/home/ethos';
import * as component_clientshell from '@/components/clientshell';

export default function HomePage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={[
        { label: 'Features', href: '#features' },
        { label: 'Ethos', href: '#ethos' },
        { label: 'Documentations', href: '/docs' },
        { label: 'Roadmap', href: '/roadmap' }
      ]}/>
      <component_home_hero.Hero/>
      <component_home_features.Features/>
      <component_home_ethos.Ethos/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}