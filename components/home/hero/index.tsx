import * as config_site from '@/configs/site';
import * as component_brand from '@/components/brand';
import * as component_download from '@/components/download';
import * as lucide from 'lucide-react';
import './index.css';

function format(v: number | string) {
  return typeof v === 'number' ? v.toLocaleString() : v;
}

async function get_git_stats() {
  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/repos/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/commits?per_page=1`, { next: { revalidate: 3600 } }),
    ]);
    const repo = await repoRes.json();
    const link = commitsRes.headers.get('link') ?? '';
    const match = link.match(/page=(\d+)>; rel="last"/);
    return {
      stars: repo.stargazers_count ?? '—',
      forks: repo.forks_count ?? '—',
      issues: repo.open_issues_count ?? '—',
      commits: match ? parseInt(match[1]) : '—'
    };
  }
  catch {
    return { stars: '—', forks: '—', issues: '—', commits: '—' };
  }
}

const STAT_ICONS = {
  stars: <lucide.Star size={14} strokeWidth={2}/>,
  forks: <lucide.GitFork size={14} strokeWidth={2}/>,
  commits: <lucide.GitCommit size={14} strokeWidth={2}/>,
  issues: <lucide.CircleDot size={14} strokeWidth={2}/>
};

export async function Hero() {
  const data = await get_git_stats();
  const stats = [
    { key: 'stars', value: format(data.stars), label: 'Stars' },
    { key: 'forks', value: format(data.forks), label: 'Forks' },
    { key: 'commits', value: format(data.commits), label: 'Commits' },
    { key: 'issues', value: format(data.issues), label: 'Issues' },
  ] as const;

  return (
    <section id="hero">
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
