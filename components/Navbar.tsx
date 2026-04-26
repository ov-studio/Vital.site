import { VitalBrand } from '@/components/VitalBrand';
import { NAV_LINKS } from '@/configs/homeData';
import './Navbar.css';

export function Navbar() {
  return (
    <nav id="nav">
      <div className="ni">
        <VitalBrand size="sm" className="nav-brand" />
        <ul className="nl">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <a href="#" className="ncta">Get Started</a>
      </div>
    </nav>
  );
}
