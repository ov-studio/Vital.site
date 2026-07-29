'use client';
import * as config_site from '@/configs/site';
import * as react       from 'react';
import './index.css';

interface ContributorInfo {
  login:         string;
  avatar_url:    string;
  profile_url:   string;
  contributions: number;
  repos:         string[];
}

export function Contributors() {
  const [list, setList] = react.useState<ContributorInfo[] | null>(null);

  react.useEffect(() => {
    fetch('/api/contributors')
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]));
  }, []);

  return (
    <section id="contributors">
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Contributors</div>
            <h2>Built by the community.<br/>Powered by <span>everyone.</span></h2>
          </div>
          <a href={config_site.info.social.github.href} className="sec-link rev" target="_blank" rel="noreferrer">
            :: View on GitHub
          </a>
        </div>

        <div className="contrib-grid rev">
          {!list && Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="contrib-avatar contrib-avatar--skeleton"/>
          ))}

          {list?.map((c) => (
            <a key={c.login} href={c.profile_url} target="_blank" rel="noreferrer" className="contrib-avatar">
              <img src={c.avatar_url} alt={c.login} loading="lazy"/>
              <span className="contrib-tip">
                <strong>{c.login}</strong>
                <em>{c.contributions} commit{c.contributions === 1 ? '' : 's'}</em>
              </span>
            </a>
          ))}

          {list && list.length === 0 && (
            <p className="state-empty">No contributors found.</p>
          )}
        </div>
      </div>
    </section>
  );
}