import Image from 'next/image';
import { HERO_STATS } from '@/configs/homeData';

export function Hero() {
  return (
    <section id="hero">
      <div className="hgrid" />
      <div className="hero-center">
        <Image src="/vital_sandbox_logo.png" alt="" width={72} height={72} className="hero-logo" />
        <div className="hero-wordmark">
          <span className="hw-vital">Vital</span><span className="hw-dot">.</span><span className="hw-sub">sandbox</span>
        </div>
        <div className="hero-motto">
          <span>Script It.</span>
          <span className="hm-sep">—</span>
          <span className="hm-blue">Ship It.</span>
          <span className="hm-sep">—</span>
          <span>Limitless.</span>
        </div>
        <p className="hero-sub">
          The next-generation sandbox runtime. One language, infinite power — Lua from the ground up, built on Godot, engineered in C++17.
        </p>
        <div className="hbtns">
          <a href="#" className="btn-primary">Start Building</a>
          <a href="#features" className="btn-secondary">
            Explore Features
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
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
