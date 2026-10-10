'use client';
import * as config_pages from '@/configs/pages';
import * as config_tos   from '@/configs/tos';
import * as ui_page      from '@/ui/page';
import * as ui_pagehead  from '@/ui/pagehead';
import './index.css';

export function TOS() {
  return (
    <ui_page.Page id="tos">
      <ui_pagehead.PageHead
        label="Legal"
        title={<>Terms of <span>Service</span></>}
        intro={config_pages.pages.tos.description}
        introClassName="tos-intro"
      >
        <div className="tos-effective anim-in anim-in--2">
          Effective Date: {config_tos.TOS_Effective}*
        </div>
      </ui_pagehead.PageHead>

      <div className="tos-body">
        {config_tos.TOS.map((s, i) => (
          <div key={s.id} id={s.id} className="tos-section">
            <div className="tos-section-head">
              <div className="sec-title">{i + 1}. {s.title}</div>
            </div>
            {s.content.map((p, j) => (
              <p key={j} className="tos-section-p">{p}</p>
            ))}
          </div>
        ))}
      </div>
    </ui_page.Page>
  );
}
