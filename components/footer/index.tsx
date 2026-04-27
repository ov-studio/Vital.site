import { Brand } from '@/components/brand';
import { Footer_Flags, Footer_Content } from '@/configs/footer';
import './index.css';

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <Brand size="xs" className="footer-brand-lock" />
          <p className="footer-tagline">
            Next-generation open-source sandbox<br />Script It. Ship It. Limitless.
          </p>
          <div className="footer-flags">
            {Footer_Flags.map((code) => (
              <img
                key={code}
                src={`https://flagsapi.com/${code}/flat/32.png`}
                alt={code}
                className="footer-flag"
              />
            ))}
          </div>
        </div>
        <div className="footer-nav">
          {Footer_Content.map(({ heading, links }) => (
            <div className="footer-nav-col" key={heading}>
              <h4>{heading}</h4>
              <ul>
                {links.map(({ label, href }) => (
                  <li key={label}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}