import '../global.css';
import type { Metadata } from 'next';
import { Overlay } from '@/components/overlay';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { RoadmapGrid } from '@/components/roadmap';
import { ClientShell } from '@/components/clientshell';

export const metadata: Metadata = {
  title: 'Roadmap - Vital.sandbox',
  description: 'Track the development progress of every Vital.sandbox module.',
};

export default function HomePage() {
  return (
    <ClientShell>
      <Overlay/>
      <Navbar links={[
        { label: 'Home', href: '/' },
        { label: 'Documentations', href: '/docs' }
      ]}/>
      <RoadmapGrid />
      <Footer/>
    </ClientShell>
  );
}