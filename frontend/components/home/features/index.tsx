'use client';
import * as config_home        from '@/configs/home';
import * as ui_wallpaper       from '@/ui/wallpaper';
import * as component_showcase from '@/components/home/showcase';
import * as react              from 'react';
import './index.css';

export function Features() {
  const [selectedId, setSelectedId] = react.useState<string>(
    () => config_home.Features[0]?.id ?? ''
  );

  const select = react.useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <section id="features">
      <ui_wallpaper.Wallpaper variant={2}/>
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Features</div>
            <h2>Built for creators.<br/>Engineered for <span>production.</span></h2>
          </div>
          <a href="/docs" className="sec-link rev">
            :: View documentations 
          </a>
        </div>

        <div className="feat-body">
          <div className="feat-clusters rev-l" role="listbox" aria-label="Features">
            {config_home.Features.map((c, ci) => {
              const active = selectedId === c.id;
              return (
                <div
                  key={c.id}
                  role="option"
                  aria-selected={active}
                  tabIndex={0}
                  className={`fcluster${active ? ' is-active' : ''}`}
                  style={{ '--ci': ci } as React.CSSProperties}
                  onClick={() => select(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      select(c.id);
                    }
                  }}
                >
                  <div className="fcluster-head">
                    <span className="fcluster-dot"/>
                    <span className="fcluster-label">{c.label}</span>
                  </div>
                  <p className="fcluster-desc">{c.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="feat-diagram rev-r">
            <component_showcase.Showcase selectedId={selectedId} onSelect={select}/>
          </div>
        </div>
      </div>
    </section>
  );
}
