'use client';
import * as config_footer from '@/configs/footer';
import * as component_brand from '@/components/brand';
import './index.css';

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <component_brand.Brand size="xs" className="footer-brand-lock"/>
          <p className="footer-tagline">
            An open-source, high-performance sandbox built on Godot.<br/>Script It. Ship It. Limitless.
          </p>
          <div className="footer-flags">
            {config_footer.Footer_Flags.map((code) => (
              <img
                key={code}
                src={`https://flagsapi.com/${code}/flat/64.png`}
                alt={code}
                className="footer-flag"
              />
            ))}
          </div>
        </div>
        <div className="footer-nav">
          {config_footer.Footer.map(({ heading, links }) => (
            <div className="footer-nav-col" key={heading}>
              <h4>{heading}</h4>
              <ul>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a 
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}