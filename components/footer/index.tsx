import { Brand } from '@/components/brand';
import { FOOTER_COLS } from '@/configs/homeData';
import './index.css';

const LOVE_FLAGS = [
  { code: 'BH', label: 'Bahrain' },
  { code: 'TR', label: 'Turkey' },
  { code: 'US', label: 'USA' },
  { code: 'LT', label: 'Lithuania' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'RU', label: 'Russia' },
  { code: 'GB', label: 'UK' }
];

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
            {LOVE_FLAGS.map(({ code, label }) => (
              <img
                key={code}
                src={`https://flagsapi.com/${code}/flat/32.png`}
                alt={label}
                title={label}
                className="footer-flag"
                width={20}
                height={20}
              />
            ))}
          </div>
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