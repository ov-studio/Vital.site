'use client';
import { Ethos_Content } from '@/configs/home';
import './index.css';

export function Ethos() {
  return (
    <section id="ethos">
      <div className="sw">
        <div className="ethos-head">
          <div className="slabel rev">Ethos</div>
          <h2 className="rev">No bloat. No strings.<br/><span>Just power.</span></h2>
        </div>

        <div className="ethos-grid">
          {Ethos_Content.map(({ title, desc, icon }, i) => (
            <div
              className="ecard rev"
              key={title}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="ecard-corner ecard-corner--tl"/>
              <span className="ecard-corner ecard-corner--br"/>

              <div className="ecard-ico">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">{icon}</svg>
                <span className="ecard-ico-ring"/>
              </div>

              <h3 className="ecard-title">{title}</h3>
              <p className="ecard-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}