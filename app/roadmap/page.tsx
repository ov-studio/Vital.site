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
      <Overlay />
      <Navbar links={[
        { label: 'Foundation', href: '#foundation' },
        { label: 'UI', href: '#ui' },
        { label: 'Rendering', href: '#rendering' },
        { label: '3D World', href: '#3d-world' },
        { label: 'Physics', href: '#physics' },
        { label: 'Input', href: '#input-audio' },
        { label: 'Audio', href: '#input-audio' },
        { label: 'Networking', href: '#networking' },
      ]} />
      <RoadmapGrid />
      <Footer />
    </ClientShell>
  );
}