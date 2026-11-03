import * as config_site from '@/configs/site';
import * as lib_api_url from '@/lib/api_url';
import * as fa          from 'react-icons/fa6';
import * as si          from 'react-icons/si';
import './index.css';

const social_icons = {
  kofi:    si.SiKofi,
  github:  fa.FaGithub,
  discord: fa.FaDiscord,
  youtube: fa.FaYoutube,
} as const;

export function Social() {
  return (
    <div className="social">
      {Object.entries(config_site.info.social).map(([key, item]) => {
        if (item.hide_on_social) return null;
        const Icon = social_icons[key as keyof typeof social_icons];
        if (!Icon) return null;

        const href = item.populate_url ? lib_api_url.get_page_url(item.href) : item.href;
        return (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={item.label}>
            <Icon className="social-icon" size={18}/>
          </a>
        );
      })}
    </div>
  );
}
