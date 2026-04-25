import './FeaturesSection.css';
import { ArrowRight } from './atoms';

const CLUSTERS = [
  {
    id: 'core',
    label: 'Core',
    desc: 'Cryptography, compression, hardware inspection, and a full runtime console — the foundation everything runs on.',
    items: ['Crypto', 'Shrinker', 'Stack', 'Inspect', 'Console'],
  },
  {
    id: 'rendering',
    label: 'Rendering',
    desc: 'Full programmatic control over 2D canvas, textures, fonts, render targets, and embedded web content.',
    items: ['Canvas', 'RenderTarget', 'Texture', 'Font', 'Webview'],
  },
  {
    id: 'models',
    label: 'Models',
    desc: 'Load, spawn, transform, animate, and morph 3D assets at runtime — built for advanced customization systems.',
    items: ['Load / Unload', 'Instantiation', 'Transform', 'Animation', 'Blend Shapes', 'Visibility'],
  },
  {
    id: 'threading',
    label: 'Threading',
    desc: 'Async/await, promises, heartbeats, and low-level thread pooling — modern concurrency without sacrificing control.',
    items: ['Async / Await', 'Promises', 'Heartbeats', 'Threader'],
  },
  {
    id: 'networking',
    label: 'Networking',
    desc: 'HTTP REST, high-performance transport, and precise task scheduling for time-sensitive execution.',
    items: ['REST', 'Robust Transport', 'Scheduling'],
  },
  {
    id: 'sandbox',
    label: 'Sandboxing',
    desc: 'Full Lua isolation with no access to host internals — safe, extensible, built for user scripting and plugins.',
    items: ['Lua Isolation', 'User Scripting', 'Plugin Systems'],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    desc: 'Native Discord Rich Presence and a pub/sub event system for clean decoupled module communication.',
    items: ['Discord SDK', 'Event System'],
  },
];

export function FeaturesSection() {
  return (
    <section id="features">
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Features</div>
            <h2>Built for creators.<br />Engineered for <span>production.</span></h2>
          </div>
          <a href="#" className="sec-link rev">View all docs <ArrowRight /></a>
        </div>

        <div className="feat-body">
          {/* Left: cluster list */}
          <div className="feat-clusters rev-l">
            {CLUSTERS.map((c, ci) => (
              <div key={c.id} className="fcluster" style={{ '--ci': ci } as React.CSSProperties}>
                <div className="fcluster-head">
                  <span className="fcluster-dot" />
                  <span className="fcluster-label">{c.label}</span>
                  <span className="fcluster-count">{c.items.length}</span>
                </div>
                <p className="fcluster-desc">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: animated node diagram */}
          <div className="feat-diagram rev-r">
            <div className="fdiagram-wrap">
              {CLUSTERS.map((c) => {
                const rad = (({ core: 0, rendering: 51, models: 102, threading: 180, networking: 231, sandbox: 282, integrations: 333 } as Record<string, number>)[c.id] * Math.PI) / 180;
                const r = 38;
                const cx = 50 + r * Math.cos(rad);
                const cy = 50 + r * Math.sin(rad);
                return (
                  <div
                    key={c.id}
                    className="fnode-group"
                    style={{ left: `${cx}%`, top: `${cy}%` }}
                  >
                    <div className="fnode">{c.label}</div>
                    <div className="fnode-leaves">
                      {c.items.map((item) => (
                        <div key={item} className="fnode-leaf">{item}</div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Center hub */}
              <div className="fhub">
                <span className="fhub-ring" />
                <span className="fhub-ring fhub-ring2" />
                <span className="fhub-label">VSDK</span>
              </div>

              {/* SVG connector lines */}
              <svg className="fdiagram-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {CLUSTERS.map((c) => {
                  const angle = ({ core: 0, rendering: 51, models: 102, threading: 180, networking: 231, sandbox: 282, integrations: 333 } as Record<string, number>)[c.id];
                  const rad = (angle * Math.PI) / 180;
                  const r = 38;
                  const cx = 50 + r * Math.cos(rad);
                  const cy = 50 + r * Math.sin(rad);
                  return (
                    <line
                      key={c.id}
                      x1="50" y1="50"
                      x2={cx} y2={cy}
                      className="fdiagram-line"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}