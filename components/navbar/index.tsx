'use client';
import * as component_brand from '@/components/brand';
import * as component_social from '@/components/social';
import './index.css';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  links?: NavLink[];
}

export function Navbar({ links = [] }: NavbarProps) {
  return (
    <nav id="nav">
      <div className="ni">
        <component_brand.Brand size="xs" variant="full" className="nav-brand" href="/#"/>
        <ul className="nl">
          {links.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <component_social.Social/>
      </div>
    </nav>
  );
}