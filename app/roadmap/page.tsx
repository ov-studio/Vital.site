import '../global.css';
import type { Metadata } from 'next';
import * as config_roadmap from '@/configs/roadmap';
import { Overlay } from '@/components/overlay';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Roadmap } from '@/components/roadmap';
import { ClientShell } from '@/components/clientshell';

export const metadata: Metadata = {
  title: 'Roadmap'
};

function toAnchor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const Roadmap_Link = config_roadmap.Roadmap.map(s => ({
  label: s.name,
  href: `#${toAnchor(s.name)}`,
}));

export default function HomePage() {
  return (
    <ClientShell>
      <Overlay/>
      <Navbar links={Roadmap_Link}/>
      <Roadmap sections={config_roadmap.Roadmap}/>
      <Footer/>
    </ClientShell>
  );
}