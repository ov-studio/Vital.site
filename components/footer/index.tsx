import { Brand } from '@/components/brand';
import { FOOTER_COLS } from '@/configs/homeData';
import './index.css';

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <Brand size="sm" className="footer-brand-lock"/>
          <p className="footer-tagline">
            Next-generation open-source sandbox<br/>Script It. Ship It. Limitless.
          </p>
        </div>
        <div className="footer-nav">
          {FOOTER_COLS.map(({ heading, links }) => (
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
