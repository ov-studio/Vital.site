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
      <Navbar/>
      <Hero/>
      <Features/>
      <Ethos/>
      <Footer/>
    </ClientShell>
  );
}