'use client';
import * as config_home             from '@/configs/home';
import * as component_iconwallpaper from '@/components/iconwallpaper';
import * as lucide                  from 'lucide-react';
import './index.css';

export function Ethos() {
  return (
    <section id="ethos">
      <component_iconwallpaper.IconWallpaper
        seed={2}
        icons={[
          lucide.Heart,
          lucide.Star,
          lucide.Flower2,
          lucide.Sun,
          lucide.Leaf,
          lucide.Feather,
          lucide.Gem,
          lucide.Gift,
          lucide.Rainbow,
          lucide.Clover,
          lucide.Smile
        ]}
      />
      <div className="sw">
        <div className="sec-head rev">
          <div>
            <div className="slabel">Ethos</div>
            <h2>No bloat. No strings.<br/><span>Just power.</span></h2>
          </div>
        </div>

        <div className="ethos-grid">
          {config_home.Ethos.map(({ title, desc, icon }, i) => (
            <div
              className="ecard rev"
              key={title}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="ecard-corner ecard-corner--tl"/>
              <span className="ecard-corner ecard-corner--br"/>
              <div className="ecard-ico">
                {icon}
                <span className="icon-ring"/>
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