'use client';

import '../global.css';
import { usePageEffects }  from '@/components/home/usePageEffects';
import { Overlays }        from '@/components/Overlays';
import { Navbar }          from '@/components/Navbar';
import { HeroSection }     from '@/components/home/HeroSection';
import { EthosSection }    from '@/components/home/EthosSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Footer }          from '@/components/Footer';

export default function HomePage() {
  usePageEffects();
  return (
    <>
      <Overlays />
      <Navbar />
      <HeroSection />
      <EthosSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}
