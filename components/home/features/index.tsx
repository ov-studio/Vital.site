import './index.css';
import { ArrowRight } from '../atoms';
import { Features_Content } from '@/configs/homeData';

const R = 38;
const toXY = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: 50 + R * Math.cos(rad), y: 50 + R * Math.sin(rad) };
};

export function Features() {
  return (
    <section id="features">
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Features</div>
            <h2>Built for creators.<br/>Engineered for <span>production.</span></h2>
          </div>
          <a href="/docs" className="sec-link rev">View documentations <ArrowRight/></a>
        </div>

        <div className="feat-body">
          <div className="feat-clusters rev-l">
            {Features_Content.map((c, ci) => (
              <div key={c.id} className="fcluster" style={{ '--ci': ci } as React.CSSProperties}>
                <div className="fcluster-head">
                  <span className="fcluster-dot"/>
                  <span className="fcluster-label">{c.label}</span>
                  <span className="fcluster-count">{c.items.length}</span>
                </div>
                <p className="fcluster-desc">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="feat-diagram rev-r">
            <div className="fdiagram-wrap">
              {Features_Content.map((c) => {
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
                <span className="fhub-ring"/>
                <span className="fhub-ring fhub-ring2"/>
                <span className="fhub-label">VSDK</span>
              </div>

              <svg className="fdiagram-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Features_Content.map((c) => {
                  const { x, y } = toXY(c.angle);
                  return <line key={c.id} x1="50" y1="50" x2={x} y2={y} className="fdiagram-line"/>;
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
