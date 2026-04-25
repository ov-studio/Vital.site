import '../global.css';
import { Overlays } from '@/components/Overlays';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { EthosSection } from '@/components/home/EthosSection';
import { Footer } from '@/components/Footer';
import { ClientShell } from '@/components/home/ClientShell';

export default function HomePage() {
  return (
    <ClientShell>
      <Overlays />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <EthosSection />
      <Footer />
    </ClientShell>
  );
}