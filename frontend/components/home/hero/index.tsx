'use client';
import * as config_site         from '@/configs/site';
import * as config_home         from '@/configs/home';
import * as ui_brand            from '@/ui/brand';
import * as ui_wallpaper        from '@/ui/wallpaper';
import * as component_download  from '@/components/download';
import * as component_platforms from '@/components/platforms';
import * as component_videoreel from '@/components/videoreel';
import * as lib_api_url         from '@/lib/api_url';
import * as react               from 'react';
import * as lucide              from 'lucide-react';
import './index.css';

interface StatsInfo {
  stars:      number;
  forks:      number;
  issues:     number;
  commits:    number;
  supporters: number;
}

function format(v: number) {
  return v.toLocaleString();
}

function floor10(v: number) {
  if (v <= 0) return 0;
  return Math.floor(v / 10) * 10;
}

function softPlus(v: number | null | undefined) {
  if (v == null || v <= 0) return '0';
  return `${format(floor10(v))}+`;
}

interface TypewriterProps {
  text:   string;
  delay?: number;
  speed?: number;
}

function Typewriter({ text, delay = 700, speed = 28 }: TypewriterProps) {
  const [count, setCount] = react.useState(0);
  const [done, setDone] = react.useState(false);

  react.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      setDone(true);
      return;
    }

    let i = 0;
    let timer = 0;
    const tick = () => {
      i++;
      setCount(i);
      if (i >= text.length) {
        setDone(true);
        return;
      }
      const ch = text[i - 1];
      const pause = ch === ',' ? 220 : ch === ' ' ? speed * 0.8 : speed + Math.random() * 22;
      timer = window.setTimeout(tick, pause);
    };

    setCount(0);
    setDone(false);
    timer = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <span className="hero-type" aria-label={text}>
      <span className={`hero-type-text${count === 0 ? ' is-empty' : ''}`} aria-hidden="true">
        {text.slice(0, count)}
        <span className={`hero-type-caret${done ? ' is-done' : ''}`}/>
      </span>
      <span className="hero-type-rest" aria-hidden="true">{text.slice(count)}</span>
    </span>
  );
}

interface HeroProps {
  slides?: string[];
}

export function Hero({ slides = [] }: HeroProps) {
  const [data, setData] = react.useState<StatsInfo | null>(null);
  const [active, setActive] = react.useState(0);
  const [ready, setReady] = react.useState(false);

  react.useEffect(() => {
    fetch(lib_api_url.get_api_url('/stats'))
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ stars: 0, forks: 0, issues: 0, commits: 0, supporters: 0 }));
  }, []);

  react.useEffect(() => {
    if (slides.length === 0) return;
    let raf = 0;
    const reveal = () => { raf = window.requestAnimationFrame(() => setReady(true)); };
    const img = new Image();
    img.onload  = reveal;
    img.onerror = reveal;
    img.src = slides[0];
    if (img.complete) reveal();
    const fallback = window.setTimeout(reveal, 2000);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      img.onload = img.onerror = null;
    };
  }, [slides]);

  react.useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <section id="hero">
      <div className={`hero-slideshow${ready ? ' is-ready' : ''}`} aria-hidden="true">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`hero-slide${ready && i === active ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="hero-slideshow-overlay"/>
      </div>

      <div className="hcorner hcorner-tl"/>
      <div className="hcorner hcorner-tr"/>
      <div className="hcorner hcorner-bl"/>
      <div className="hcorner hcorner-br"/>

      <div className="hero-center">
        <div className="hero-brand">
          <ui_brand.Brand size="xxl" variant="logo-only" neon={true} flicker={true}/>
        </div>

        <div className="hero-motto">
          <div className="hero-stat hero-stat-supporters">
            <lucide.Heart className="hero-stat-icon" size={14} strokeWidth={2.25} aria-hidden="true"/>
            <span>
              <strong className="hero-stat-num">{softPlus(data?.supporters)}</strong> supporters
            </span>
          </div>

          <span className="hero-stat-sep" aria-hidden="true"/>

          <div className="hero-stat hero-stat-stars">
            <lucide.Star className="hero-stat-icon" size={12} strokeWidth={2.25} aria-hidden="true"/>
            <span>
              <strong className="hero-stat-num">{softPlus(data?.stars)}</strong> stargazers
            </span>
          </div>
        </div>

        <div className="hero-sub">
          <p className="hero-sub-lead">
            <Typewriter text={config_site.info.description}/>
          </p>
          <p className="hero-sub-mid">
            Full control over rendering, networking, threading, and assets — one seamless workflow<br/>
            From indie ideas to large scale multiplayer worlds, build without compromise
          </p>
        </div>

        <component_download.Download>
          <component_platforms.Platforms/>
        </component_download.Download>
      </div>

      <component_videoreel.VideoReel playlist={config_home.HeroReel}/>
    </section>
  );
}
