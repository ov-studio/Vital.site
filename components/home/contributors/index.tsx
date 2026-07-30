'use client';
import * as config_site from '@/configs/site';
import * as react       from 'react';
import * as lucide      from 'lucide-react';
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
          {list?.map((c) => (
            <a key={c.login} href={c.profile_url} target="_blank" rel="noreferrer" className="contrib-avatar">
              <span className="contrib-avatar-img">
                <img src={c.avatar_url} alt={c.login} loading="lazy"/>
              </span>
              <span className="contrib-tip">
                <strong>{c.login}</strong>
                <em>{c.contributions} commit{c.contributions === 1 ? '' : 's'}</em>
              </span>
            </a>
          ))}

          {list && list.length === 0 && (
            <div className="state-empty">
              <lucide.Package size={28} strokeWidth={1.5}/>
              <p>No contributors found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}