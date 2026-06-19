import * as lib_source from '@/lib/source';
import * as config_roadmap from '@/configs/roadmap';
import * as component_overlay from '@/components/overlay';
import * as component_navbar from '@/components/navbar';
import * as component_footer from '@/components/footer';
import * as component_roadmap from '@/components/roadmap';
import * as component_clientshell from '@/components/clientshell';
import * as next from 'next';
import '../global.css';

export const metadata: next.Metadata = {
  title: 'Roadmap'
};

const Roadmap_Link = config_roadmap.Roadmap.map(s => ({
  label: s.name,
  href: `#${lib_source.to_anchor(s.name)}`,
}));

export default function HomePage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={Roadmap_Link}/>
      <component_roadmap.Roadmap sections={config_roadmap.Roadmap}/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}