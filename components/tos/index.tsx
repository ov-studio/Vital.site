import './index.css';
import { TOS_Section } from '@/configs/tos';

export function TOS() {
  return (
    <section id="tos">
      <div className="sw">
        <div className="tos-head">
          <div className="sec-head">
            <h2>Terms of <span>Service</span></h2>
          </div>
          <div className="tos-intro">
            Terms governing your use of Vital.sandbox, its associated tools and services
          </div>
        </div>

        <div className="tos-body">
          {TOS_Section.map(s => (
            <div key={s.id} id={s.id} className="tos-section">
              <div className="tos-section-title">{s.title}</div>
              {s.content.map((p, i) => (
                <p key={i} className="tos-section-p">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
