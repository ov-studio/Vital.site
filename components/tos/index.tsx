import { site } from '@/configs/site';
import * as config_tos from '@/configs/tos';
import './index.css';

export function TOS() {
  return (
    <section id="tos">
      <div className="sw">
        <div className="tos-head">
          <div className="sec-head">
            <h2>Terms of <span>Service</span></h2>
          </div>
          <div className="tos-intro">
            Terms and conditions governing your use of {site.name} and its associated services
          </div>
          <div className="tos-effective">
            Effective Date: {config_tos.TOS_Effective}*
          </div>
        </div>

        <div className="tos-body">
          {config_tos.TOS.map((s, i) => (
            <div key={s.id} id={s.id} className="tos-section">
              <div className="tos-section-title">{i + 1}. {s.title}</div>
              {s.content.map((p, j) => (
                <p key={j} className="tos-section-p">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
