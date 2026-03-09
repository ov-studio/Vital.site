'use client';

import '../global.css';
import { usePageEffects }  from '@/components/home/usePageEffects';
import { Overlays }        from '@/components/Overlays';
import { Navbar }          from '@/components/Navbar';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { HeroSection }            from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { ApiSection }      from '@/components/home/ApiSection';
import { EthosSection }    from '@/components/home/EthosSection';
import { Footer }          from '@/components/Footer';

export default function HomePage() {
  usePageEffects();
  return (
    <>
      <Overlays />
      <Navbar />
      <AnnouncementBar />
      <HeroSection />
      <FeaturesSection />
      <ApiSection />
      <EthosSection />
      <Footer />
    </>
  );
}
