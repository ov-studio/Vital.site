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

        <div className="ethos-body">
          <div className="ethos-left rev-l">
            {Ethos_Content.slice(0, 3).map(({ title, desc, icon }) => (
              <div className="ethos-item" key={title}>
                <div className="ethos-item-top">
                  <div className="ethos-ico">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">{icon}</svg>
                  </div>
                  <h3 className="ethos-title">{title}</h3>
                </div>
                <p className="ethos-desc">{desc}</p>
              </div>
            ))}
          </div>

          <div className="ethos-divider">
            <div className="ethos-divider-line"/>
            <div className="ethos-divider-node"/>
            <div className="ethos-divider-line"/>
          </div>

          <div className="ethos-right rev-r">
            {Ethos_Content.slice(3).map(({ title, desc, icon }) => (
              <div className="ethos-item" key={title}>
                <div className="ethos-item-top">
                  <div className="ethos-ico">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">{icon}</svg>
                  </div>
                  <h3 className="ethos-title">{title}</h3>
                </div>
                <p className="ethos-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}