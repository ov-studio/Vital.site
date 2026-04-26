import Image from 'next/image';
import { FOOTER_COLS } from '@/configs/homeData';
import './Footer.css';

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-brand-lock">
            <Image src="/logo.svg" alt="vital.sandbox" width={28} height={28} style={{ filter: 'brightness(0) invert(1)', opacity: .7 }} />
            <div className="footer-brand-name">Vital.sandbox</div>
          </div>
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
