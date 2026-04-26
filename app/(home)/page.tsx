import '../global.css';
import { Overlay } from '@/components/overlay';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { EthosSection } from '@/components/home/EthosSection';
import { Footer } from '@/components/footer';
import { ClientShell } from '@/components/home/ClientShell';

export default function HomePage() {
  return (
    <ClientShell>
      <Overlay />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <EthosSection />
      <Footer />
    </ClientShell>
  );
}