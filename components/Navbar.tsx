import { VitalBrand } from '@/components/VitalBrand';
import { NAV_LINKS } from '@/configs/homeData';
import './Navbar.css';

const GitHubIcon = () => (
  <svg className="nav-social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12C22 6.48 17.52 2 12 2z" />
  </svg>
);

const KofiIcon = () => (
  <svg className="nav-social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d={"M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"} />
  </svg>
);

export function Navbar() {
  return (
    <nav id="nav">
      <div className="ni">
        <VitalBrand size="sm" variant="full" className="nav-brand" />
        <ul className="nl">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <div className="nav-social">
          <a href="https://github.com/ov-studio" target="_blank" rel="noopener noreferrer" className="nav-social-link" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a href="https://ko-fi.com/ovstudio" target="_blank" rel="noopener noreferrer" className="nav-social-link" aria-label="Ko-fi">
            <KofiIcon />
          </a>
        </div>
      </div>
    </nav>
  );
}