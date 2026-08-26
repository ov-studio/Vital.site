'use client';
import * as config_site             from '@/configs/site';
import * as component_iconwallpaper from '@/components/iconwallpaper';
import * as lib_api_url             from '@/lib/api_url';
import * as react                   from 'react';
import * as lucide                  from 'lucide-react';
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
    fetch(lib_api_url.get_api_url('/contributors'))
      .then((r) => r.json())
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]));
  }, []);

  return (
    <section id="contributors">
      <component_iconwallpaper.IconWallpaper
        seed={3}
        icons={[
          lucide.Heart,
          lucide.Star,
          lucide.Users,
          lucide.Coffee,
          lucide.Cat,
          lucide.Bird,
          lucide.Flower2,
          lucide.PartyPopper,
          lucide.Smile,
          lucide.ThumbsUp,
          lucide.Sparkles,
          lucide.MessageCircle
        ]}
      />
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

        <div className="studio-note rev">
          <p>
            We&apos;re <strong>ov-studio</strong> – the same team that spent years crafting shaders,
            systems, and experiences on MTA, FiveM, and SAMP. As those platforms aged, we chose to build
            something modern. Something truly ours.
          </p>
          <p>
            <strong>Vital.sandbox</strong> is what we built — a community-driven, fully open-source
            sandbox project, backed by ov-studio. Same team, same philosophy, same leadership. Every
            talented developer from ov-studio is here, bringing decades of experience into this new
            chapter.
          </p>
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
              <lucide.UserRoundX size={28} strokeWidth={1.5}/>
              <p>No contributors found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}