import { FEATURE_GROUPS } from '@/configs/homeData';
import { ArrowRight, FeatureCard } from './atoms';
import './FeaturesSection.css';

export function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '100px 0', borderTop: '1px solid var(--rule)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="sw">
        <div className="sec-head">
          <div className="rev">
            <div className="slabel">Platform</div>
            <h2>Built for creators.<br />Engineered for <span>production.</span></h2>
          </div>
          <a href="#" className="sec-link rev">View all docs <ArrowRight /></a>
        </div>
        {FEATURE_GROUPS.map(({ group, items }, gi) => (
          <div key={group} className="feat-group rev" style={gi > 0 ? { marginTop: '2px' } : undefined}>
            <div className="feat-group-label">{group}</div>
            <div className="feat-grid">
              {items.map(item => <FeatureCard key={item.n} {...item} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
