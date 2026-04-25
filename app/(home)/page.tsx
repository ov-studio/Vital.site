'use client';

import '../global.css';
import { usePageEffects }  from '@/components/home/usePageEffects';
import { Overlays }        from '@/components/Overlays';
import { Navbar }          from '@/components/Navbar';
import { HeroSection }     from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { EthosSection } from '@/components/home/EthosSection';
import { Footer }          from '@/components/Footer';

export default function HomePage() {
  usePageEffects();
  return (
    <>
      <Overlays />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <EthosSection />
      <Footer />
    </>
  );
}
