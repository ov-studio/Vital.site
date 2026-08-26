'use client';
import * as component_brand         from '@/components/brand';
import * as component_download      from '@/components/download';
import * as component_iconwallpaper from '@/components/iconwallpaper';
import * as lib_api_url             from '@/lib/api_url';
import * as react                   from 'react';
import * as lucide                  from 'lucide-react';
import './index.css';

interface StatsInfo {
  stars:   number;
  forks:   number;
  issues:  number;
  commits: number;
}

function format(v: number) {
  return v.toLocaleString();
}

const STAT_ICONS = {
  stars: <lucide.Star size={15} strokeWidth={2.5}/>,
  forks: <lucide.GitFork size={15} strokeWidth={2.5}/>,
  commits: <lucide.GitCommit size={15} strokeWidth={2.5}/>,
  issues: <lucide.CircleDot size={15} strokeWidth={2.5}/>
};

export function Hero() {
  const [data, setData] = react.useState<StatsInfo | null>(null);

  react.useEffect(() => {
    fetch(lib_api_url.get_api_url('/stats'))
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ stars: 0, forks: 0, issues: 0, commits: 0 }));
  }, []);

  const stats = [
    { key: 'stars',   value: data ? format(data.stars)   : '—', label: 'Stars'   },
    { key: 'forks',   value: data ? format(data.forks)   : '—', label: 'Forks'   },
    { key: 'commits', value: data ? format(data.commits) : '—', label: 'Commits' },
    { key: 'issues',  value: data ? format(data.issues)  : '—', label: 'Issues'  }
  ] as const;

  return (
    <section id="hero">
      <component_iconwallpaper.IconWallpaper
        seed={0}
        icons={[
          lucide.Rocket,
          lucide.Code2,
          lucide.Terminal,
          lucide.Zap,
          lucide.Box,
          lucide.Sparkles,
          lucide.Layers,
          lucide.Cpu,
        ]}
      />
      <div className="hbg">
        <div className="hbg-grid"/>
        <div className="hbg-scanline"/>
      </div>
      <div className="hcorner hcorner-tl"/>
      <div className="hcorner hcorner-tr"/>
      <div className="hcorner hcorner-bl"/>
      <div className="hcorner hcorner-br"/>

      <div className="hero-center">
        <div className="hero-brand">
          <component_brand.Brand size="xxl" variant="logo-only" className="hero-brand--logo"/>
        </div>

        <div className="hero-motto">
          <span className="hm-word">Script It</span>
          <span className="hm-sep">—</span>
          <span className="hm-word hm-blue">Ship It</span>
          <span className="hm-sep">—</span>
          <span className="hm-word">Limitless</span>
        </div>

        <p className="hero-sub">
          An open-source, high-performance sandbox built on Godot and powered by C++17 and Lua.
          <br/>— Full control over rendering, networking, threading, and assets - one seamless workflow —
          <br/><span style={{ marginTop: '16px', display: 'inline-block' }}>From indie ideas to large scale multiplayer worlds, build without compromise.</span>
        </p>

        <component_download.Download/>

        <div className="hero-stats">
          {stats.map(({ key, value, label }) => (
            <div key={key} className="hstat">
              <div className="hstat-top">
                <span className="hstat-ico">{STAT_ICONS[key]}</span>
                <span className="hstat-n">{value}</span>
              </div>
              <span className="hstat-l">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}