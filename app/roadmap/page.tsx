import '../global.css';
import type { Metadata } from 'next';
import { Overlay } from '@/components/overlay';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoadmapGrid } from '@/components/roadmap';
import { ClientShell } from '@/components/clientshell';
import { Roadmap_Section } from '@/configs/roadmap';

export const metadata: Metadata = {
  title: 'Roadmap'
};

function toAnchor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const Roadmap_Link = Roadmap_Section.map(s => ({
  label: s.name,
  href: `#${toAnchor(s.name)}`,
}));

export default function HomePage() {
  return (
    <ClientShell>
      <Overlay/>
      <Navbar links={Roadmap_Link}/>
      <RoadmapGrid sections={Roadmap_Section}/>
      <Footer/>
    </ClientShell>
  );
}