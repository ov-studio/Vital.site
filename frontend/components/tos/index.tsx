'use client';
import * as config_pages from '@/configs/pages';
import * as config_tos   from '@/configs/tos';
import * as ui_wallpaper from '@/ui/wallpaper';
import './index.css';

export function TOS() {
  return (
    <section id="tos">
      <ui_wallpaper.Wallpaper variant={5}/>
      <div className="sw">
        <div className="page-head">
          <div className="sec-head sec-head--intro">
            <div>
              <div className="slabel">Legal</div>
              <h2>Terms of <span>Service</span></h2>
            </div>
          </div>
          <div className="page-intro tos-intro">
            {config_pages.pages.tos.description}
          </div>
          <div className="tos-effective anim-in anim-in--2">
            Effective Date: {config_tos.TOS_Effective}*
          </div>
        </div>

        <div className="tos-body">
          {config_tos.TOS.map((s, i) => (
            <div key={s.id} id={s.id} className="tos-section">
              <div className="sec-title">{i + 1}. {s.title}</div>
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
