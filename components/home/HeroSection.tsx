import './HeroSection.css';
import { VitalBrand } from '@/components/VitalBrand';

async function getGitHubStats() {
  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch('https://api.github.com/repos/ov-studio/Vital.sandbox', {
        next: { revalidate: 3600 },
      }),
      fetch('https://api.github.com/repos/ov-studio/Vital.sandbox/commits?per_page=1', {
        next: { revalidate: 3600 },
      }),
    ]);

    const repo = await repoRes.json();

    const linkHeader = commitsRes.headers.get('link') || '';
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    const commits = match ? parseInt(match[1]) : '—';

    return {
      stars: repo.stargazers_count ?? '—',
      forks: repo.forks_count ?? '—',
      issues: repo.open_issues_count ?? '—',
      commits,
    };
  } catch {
    return { stars: '—', forks: '—', issues: '—', commits: '—' };
  }
}

export async function HeroSection() {
  const { stars, forks, issues, commits } = await getGitHubStats();

  const STATS = [
    {
      value: typeof stars === 'number' ? stars.toLocaleString() : stars,
      label: 'Stars',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M8 1l1.9 3.8L14 5.6l-3 2.9.7 4.1L8 10.5l-3.7 2.1.7-4.1-3-2.9 4.1-.8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      value: typeof forks === 'number' ? forks.toLocaleString() : forks,
      label: 'Forks',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="5" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 4.5v2a3 3 0 003 3m3-5v2a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: typeof commits === 'number' ? commits.toLocaleString() : commits,
      label: 'Commits',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 8h4.5M10.5 8H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: typeof issues === 'number' ? issues.toLocaleString() : issues,
      label: 'Issues',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

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
        {/* Brand — logo + wordmark */}
        <div className="hero-brand">
          <VitalBrand size="xl" variant="full" />
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
          An open-source, high-performance sandbox built on Godot and powered by C++17. A clean Lua layer gives you full control over rendering, networking, threading, and assets — all in one seamless workflow.
          <br /><br />From indie ideas to large scale multiplayer worlds, build without compromise.
        </p>

        {/* CTA */}
        <div className="hbtns">
          <a href="#" className="btn-primary">Download Latest Build</a>
          <a href="#features" className="btn-secondary">
            Explore Features
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* GitHub stats bar */}
        <div className="hero-stats">
          {STATS.map(({ value, label, icon }) => (
            <div key={label} className="hstat">
              <div className="hstat-top">
                <span className="hstat-ico">{icon}</span>
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
