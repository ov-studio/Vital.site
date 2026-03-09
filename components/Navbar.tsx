import Image from 'next/image';
import { NAV_LINKS } from '@/configs/homeData';

export function Navbar() {
  return (
    <nav id="nav">
      <div className="ni">
        <div className="logo">
          <Image src="/vital_sandbox_logo.png" alt="vital.sandbox" width={36} height={36} style={{ filter: 'invert(1) brightness(2)' }} />
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
