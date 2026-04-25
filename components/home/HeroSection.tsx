import Image from 'next/image';
import { HERO_STATS } from '@/configs/homeData';
import './HeroSection.css';

export function HeroSection() {
  return (
    <section id="hero">
      {/* Animated background */}
      <div className="hbg">
        <div className="hbg-glow" />
        <div className="hbg-grid" />
        <div className="hbg-scanline" />
      </div>

      {/* Corner brackets */}
      <div className="hcorner hcorner-tl" />
      <div className="hcorner hcorner-tr" />
      <div className="hcorner hcorner-bl" />
      <div className="hcorner hcorner-br" />

      <div className="hero-center">
        {/* Logo + wordmark */}
        <div className="hero-brand">
          <Image src="/vital_sandbox_logo.png" alt="" width={64} height={64} className="hero-logo" />
          <div className="hero-wordmark">Vital.sandbox</div>
        </div>

        {/* Motto */}
        <div className="hero-motto">
          <span className="hm-word">Script It.</span>
          <span className="hm-sep">—</span>
          <span className="hm-word hm-blue">Ship It.</span>
          <span className="hm-sep">—</span>
          <span className="hm-word">Limitless.</span>
        </div>

        {/* Sub */}
        <p className="hero-sub">
          The next-generation sandbox runtime. One language, infinite power —<br />
          Lua from the ground up, built on Godot, engineered in C++17.
        </p>

        {/* CTA */}
        <div className="hbtns">
          <a href="/docs" className="btn-primary">Start Building</a>
          <a href="#features" className="btn-secondary">
            Explore Features
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {HERO_STATS.map(({ value, label }, i) => (
            <>
              {i > 0 && <div key={`div-${i}`} className="hstat-div" />}
              <div key={value} className="hstat">
                <span className="hstat-n">{value}</span>
                <span className="hstat-l">{label}</span>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}