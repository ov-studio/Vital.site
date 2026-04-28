import './index.css';
import { Brand } from '@/components/brand';
import { Download } from '@/components/download';
import { site } from '@/configs/site';

async function getGitHubStats() {
  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${site.git.sandbox.user}/${site.git.sandbox.repo}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/repos/${site.git.sandbox.user}/${site.git.sandbox.repo}/commits?per_page=1`, { next: { revalidate: 3600 } }),
    ]);
    const repo = await repoRes.json();
    const link = commitsRes.headers.get('link') ?? '';
    const match = link.match(/page=(\d+)>; rel="last"/);
    return {
      stars: repo.stargazers_count ?? '—',
      forks: repo.forks_count ?? '—',
      issues: repo.open_issues_count ?? '—',
      commits: match ? parseInt(match[1]) : '—',
    };
  } catch {
    return { stars: '—', forks: '—', issues: '—', commits: '—' };
  }
}

const fmt = (v: number | string) => typeof v === 'number' ? v.toLocaleString() : v;

const STAT_ICONS = {
  stars: (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.9 3.8L14 5.6l-3 2.9.7 4.1L8 10.5l-3.7 2.1.7-4.1-3-2.9 4.1-.8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>),
  forks: (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 4.5v2a3 3 0 003 3m3-5v2a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
  commits: (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 8h4.5M10.5 8H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
  issues: (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
};

export async function Hero() {
  const stats = await getGitHubStats();

  const STATS = [
    { key: 'stars', value: fmt(stats.stars), label: 'Stars' },
    { key: 'forks', value: fmt(stats.forks), label: 'Forks' },
    { key: 'commits', value: fmt(stats.commits), label: 'Commits' },
    { key: 'issues', value: fmt(stats.issues), label: 'Issues' },
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
          {/* full wordmark on normal screens, logo-only on tiny screens */}
          <Brand size="xl" variant="full" className="hero-brand--full"/>
          <Brand size="xl" variant="logo-only" className="hero-brand--logo"/>
        </div>

        <div className="hero-motto">
          <span className="hm-word">Script It.</span>
          <span className="hm-sep">—</span>
          <span className="hm-word hm-blue">Ship It.</span>
          <span className="hm-sep">—</span>
          <span className="hm-word">Limitless.</span>
        </div>

        <p className="hero-sub">
          An open-source, high-performance sandbox built on Godot and powered by C++17. A clean Lua layer gives you full control over rendering, networking, threading, and assets — all in one seamless workflow.
          <br/><br/>From indie ideas to large scale multiplayer worlds, build without compromise.
        </p>

        {/* Client component — fetches release info in the browser */}
        <Download/>

        <div className="hero-stats">
          {STATS.map(({ key, value, label }) => (
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
