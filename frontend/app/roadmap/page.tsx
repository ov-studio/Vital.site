import '@/app/global.css';
import * as lib_page_meta         from '@/lib/page_meta';
import * as config_roadmap        from '@/configs/roadmap';
import * as component_overlay     from '@/components/overlay';
import * as component_navbar      from '@/components/navbar';
import * as component_footer      from '@/components/footer';
import * as component_roadmap     from '@/components/roadmap';
import * as component_clientshell from '@/components/clientshell';
import * as lib_anchor            from '@/lib/anchor';

export const metadata = lib_page_meta.page_meta('roadmap', '/roadmap');

const Roadmap_Link = config_roadmap.Roadmap.map(s => ({
  label: `# ${s.name}`,
  href:  `#${lib_anchor.to_anchor(s.name)}`,
}));

export default function RoadmapPage() {
  return (
    <component_clientshell.ClientShell>
      <component_overlay.Overlay/>
      <component_navbar.Navbar links={Roadmap_Link}/>
      <component_roadmap.Roadmap/>
      <component_footer.Footer/>
    </component_clientshell.ClientShell>
  );
}
