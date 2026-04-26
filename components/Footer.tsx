import { VitalBrand } from '@/components/VitalBrand';
import { FOOTER_COLS } from '@/configs/homeData';
import './Footer.css';

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <VitalBrand size="sm" className="footer-brand-lock" />
          <p className="footer-tagline">
            The next-generation sandbox runtime. One language, infinite power — built on Godot, engineered in C++17.
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
