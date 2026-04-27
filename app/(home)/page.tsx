import '../global.css';
import { Overlay } from '@/components/overlay';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { Ethos } from '@/components/home/ethos';
import { ClientShell } from '@/components/home/ClientShell';

export default function HomePage() {
  return (
    <ClientShell>
      <Overlay/>
      <Navbar links={[
        { label: 'Features', href: '#features' },
        { label: 'Ethos', href: '#ethos' },
        { label: 'Documentations', href: '/docs' }
      ]}/>
      <Hero/>
      <Features/>
      <Ethos/>
      <Footer/>
    </ClientShell>
  );
}