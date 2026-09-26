'use client';
import * as config_home         from '@/configs/home';
import * as ui_brand            from '@/ui/brand';
import * as ui_wallpaper        from '@/ui/wallpaper';
import * as component_download  from '@/components/download';
import * as component_videoreel from '@/components/videoreel';
import * as lib_api_url         from '@/lib/api_url';
import * as react               from 'react';
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

export function Hero() {
  const [data, setData] = react.useState<StatsInfo | null>(null);

  react.useEffect(() => {
    fetch(lib_api_url.get_api_url('/stats'))
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ stars: 0, forks: 0, issues: 0, commits: 0, supporters: 0 }));
  }, []);

  return (
    <section id="hero">
      <ui_wallpaper.Wallpaper variant={6}/>
      <div className="hcorner hcorner-tl"/>
      <div className="hcorner hcorner-tr"/>
      <div className="hcorner hcorner-bl"/>
      <div className="hcorner hcorner-br"/>

      <div className="hero-center">
        <div className="hero-brand">
          <ui_brand.Brand size="xxl" variant="logo-only" neon={true} flicker={true} rays={true}/>
        </div>

        <div className="hero-motto">
          Backed by {softPlus(data?.supporters)} Supporters ❤️
          {' '}&{' '}
          {softPlus(data?.stars)} Stargazers 🌟
        </div>

        <div className="hero-sub">
          <p className="hero-sub-lead">
            An open-source, high-performance sandbox built on Godot and powered by C++17 and Lua.
          </p>
          <p className="hero-sub-mid">
            Full control over rendering, networking, threading, and assets — one seamless workflow.<br/>
            From indie ideas to large scale multiplayer worlds, build without compromise.
          </p>
        </div>

        <component_download.Download/>
      </div>
      <component_videoreel.VideoReel videos={config_home.Videos}/>
    </section>
  );
}
