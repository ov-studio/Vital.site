'use client';
import * as config_site  from '@/configs/site';
import * as config_tos   from '@/configs/tos';
import * as ui_wallpaper from '@/ui/wallpaper';
import './index.css';

export function TOS() {
  return (
    <section id="tos">
      <ui_wallpaper.Wallpaper
        seed={11}
        vignette={false}
      />
      <div className="sw">
        <div className="page-head">
          <div className="sec-head sec-head--intro">
            <div>
              <div className="slabel">Legal</div>
              <h2>Terms of <span>Service</span></h2>
            </div>
          </div>
          <div className="tos-intro">
            Terms and conditions governing your use of {config_site.info.name} and its associated services
          </div>
          <div className="tos-effective">
            Effective Date: {config_tos.TOS_Effective}*
          </div>
        </div>

        <div className="tos-body">
          {config_tos.TOS.map((s, i) => (
            <div key={s.id} id={s.id} className="tos-section">
              <div className="tos-section-title">{i + 1}. {s.title}</div>
              {s.content.map((p, j) => (
                <p key={j} className="tos-section-p">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
