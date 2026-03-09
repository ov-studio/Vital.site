import { WHY_ITEMS } from '@/configs/homeData';

export function EthosSection() {
  return (
    <section id="ethos" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: '1px solid var(--rule)' }}>
      <div className="sw" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="slabel rev">Why vital.sandbox</div>
        <h2 className="rev" style={{ marginBottom: '56px' }}>No bloat. No strings.<br /><span>Just power.</span></h2>
        <div className="why-grid rev">
          {WHY_ITEMS.map(({ title, desc, icon }) => (
            <div className="why-card" key={title}>
              <div className="why-ico">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">{icon}</svg>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
