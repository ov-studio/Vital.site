'use client';
import * as component_brand from '@/components/brand';
import * as component_social from '@/components/social';
import * as lib_api_url from '@/lib/api_url';
import * as lib_staff_session from '@/lib/staff_session';
import { useCallback, useEffect, useState } from 'react';
import * as lucide from 'lucide-react';
import './index.css';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  links?: NavLink[];
  showStaffAuth?: boolean;
}

export function Navbar({ links = [], showStaffAuth }: NavbarProps) {
  const [session, setSession] = useState<lib_staff_session.StaffSession | null>(null);
  const [onStaffPage, setOnStaffPage] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const refresh = useCallback(() => {
    setSession(lib_staff_session.read_staff_session());
  }, []);

  useEffect(() => {
    lib_staff_session.capture_oauth_hash();
    refresh();
    setOnStaffPage(window.location.pathname.replace(/\/$/, '') === '/staff');

    const on_storage = (e: StorageEvent) => {
      if (e.key === lib_staff_session.STAFF_TOKEN_KEY || e.key === null) refresh();
    };
    window.addEventListener(lib_staff_session.STAFF_SESSION_EVENT, refresh);
    window.addEventListener('storage', on_storage);
    return () => {
      window.removeEventListener(lib_staff_session.STAFF_SESSION_EVENT, refresh);
      window.removeEventListener('storage', on_storage);
    };
  }, [refresh]);

  const showSignIn = (showStaffAuth ?? onStaffPage) && !session;

  const login = useCallback(() => {
    window.location.href = lib_api_url.get_api_url('/auth/github');
  }, []);

  const logout = useCallback(() => {
    lib_staff_session.clear_staff_session();
    setSession(null);
    setMenuOpen(false);
  }, []);

  return (
    <nav id="nav">
      <div className="ni">
        <component_brand.Brand size="xs" variant="full" className="nav-brand" href="/#" />
        <ul className="nl">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-end">
          {showSignIn && (
            <button
              type="button"
              className="nav-auth-icon"
              onClick={login}
              aria-label="Sign in with GitHub"
              title="Sign in"
            >
              <lucide.Fingerprint className="nav-auth-svg" size={18} strokeWidth={2} />
            </button>
          )}
          {session && (
            <div className="nav-staff">
              <button
                type="button"
                className="nav-avatar-btn"
                aria-label={`Signed in as ${session.login}`}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <img
                  className="nav-avatar"
                  src={session.avatarUrl}
                  alt=""
                  width={28}
                  height={28}
                  referrerPolicy="no-referrer"
                />
              </button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    className="nav-staff-backdrop"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="nav-staff-menu" role="menu">
                    <div className="nav-staff-meta">
                      <img
                        className="nav-avatar nav-avatar--sm"
                        src={session.avatarUrl}
                        alt=""
                        width={28}
                        height={28}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="nav-staff-login">@{session.login}</div>
                        <div className="nav-staff-role">Staff</div>
                      </div>
                    </div>
                    <a className="nav-staff-item" href="/staff" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Mint token
                    </a>
                    <button type="button" className="nav-staff-item nav-staff-item--btn" role="menuitem" onClick={logout}>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          <component_social.Social />
        </div>
      </div>
    </nav>
  );
}

