import './FeaturesSection.css';
import { ArrowRight } from './atoms';

const CLUSTERS = [
  { id: 'core',         label: 'Core',         angle: 0,   desc: 'Cryptography, compression, hardware inspection, and a full runtime console — the foundation everything runs on.',             items: ['Crypto', 'Shrinker', 'Stack', 'Inspect', 'Console'] },
  { id: 'rendering',    label: 'Rendering',    angle: 51,  desc: 'Full programmatic control over 2D canvas, textures, fonts, render targets, and embedded web content.',                       items: ['Canvas', 'RenderTarget', 'Texture', 'Font', 'Webview'] },
  { id: 'models',       label: 'Models',       angle: 102, desc: 'Load, spawn, transform, animate, and morph 3D assets at runtime — built for advanced customization systems.',               items: ['Load / Unload', 'Instantiation', 'Transform', 'Animation', 'Blend Shapes', 'Visibility'] },
  { id: 'threading',    label: 'Threading',    angle: 180, desc: 'Async/await, promises, heartbeats, and low-level thread pooling — modern concurrency without sacrificing control.',          items: ['Async / Await', 'Promises', 'Heartbeats', 'Threader'] },
  { id: 'networking',   label: 'Networking',   angle: 231, desc: 'HTTP REST, high-performance transport, and precise task scheduling for time-sensitive execution.',                           items: ['REST', 'Robust Transport', 'Scheduling'] },
  { id: 'sandbox',      label: 'Sandboxing',   angle: 282, desc: 'Full Lua isolation with no access to host internals — safe, extensible, built for user scripting and plugins.',             items: ['Lua Isolation', 'User Scripting', 'Plugin Systems'] },
  { id: 'integrations', label: 'Integrations', angle: 333, desc: 'Native Discord Rich Presence and a pub/sub event system for clean decoupled module communication.',                         items: ['Discord SDK', 'Event System'] },
];

const R = 38;
const toXY = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: 50 + R * Math.cos(rad), y: 50 + R * Math.sin(rad) };
};

export function FeaturesSection() {
  return (
    <section id="features">
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Features</div>
            <h2>Built for creators.<br />Engineered for <span>production.</span></h2>
          </div>
          <a href="/docs" className="sec-link rev">View documentations <ArrowRight /></a>
        </div>

        <div className="feat-body">
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

          <div className="feat-diagram rev-r">
            <div className="fdiagram-wrap">
              {CLUSTERS.map((c) => {
                const { x, y } = toXY(c.angle);
                return (
                  <div key={c.id} className="fnode-group" style={{ left: `${x}%`, top: `${y}%` }}>
                    <div className="fnode">{c.label}</div>
                    <div className="fnode-leaves">
                      {c.items.map((item) => <div key={item} className="fnode-leaf">{item}</div>)}
                    </div>
                  </div>
                );
              })}

              <div className="fhub">
                <span className="fhub-ring" />
                <span className="fhub-ring fhub-ring2" />
                <span className="fhub-label">VSDK</span>
              </div>

              <svg className="fdiagram-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {CLUSTERS.map((c) => {
                  const { x, y } = toXY(c.angle);
                  return <line key={c.id} x1="50" y1="50" x2={x} y2={y} className="fdiagram-line" />;
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
