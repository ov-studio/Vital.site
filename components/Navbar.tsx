import Image from 'next/image';
import { NAV_LINKS } from '@/configs/homeData';
import './Navbar.css';

export function Navbar() {
  return (
    <nav id="nav">
      <div className="ni">
        <div className="logo">
          <Image src="/logo.svg" alt="vital.sandbox" width={36} height={36} />
          <div className="logo-text">vital<b>.</b>sandbox</div>
        </div>
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
