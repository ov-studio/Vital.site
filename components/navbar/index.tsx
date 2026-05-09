'use client';
import { Brand } from '@/components/brand';
import { Social } from '@/components/social';
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
        <Brand size="xs" variant="full" className="nav-brand" href="/#"/>
        <ul className="nl">
          {links.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <Social/>
      </div>
    </nav>
  );
}