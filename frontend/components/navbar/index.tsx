'use client';
import * as component_brand  from '@/components/brand';
import * as component_social from '@/components/social';
import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';
import * as lib_page_loading from '@/lib/page_loading';
import * as react            from 'react';
import * as lucide           from 'lucide-react';
import './index.css';

interface NavLink {
  label: string;
  href:  string;
}

interface NavbarProps {
  links?: NavLink[];
}

export function Navbar({ links = [] }: NavbarProps) {
  const [session, setSession]   = react.useState<lib_auth_session.AuthSession | null>(null);
  const [menuOpen, setMenuOpen] = react.useState(false);
  const [pageLoading, setPageLoading] = react.useState(false);

  const refresh = react.useCallback(() => {
    setSession(lib_auth_session.read_auth_session());
  }, []);

  react.useEffect(() => {
    lib_auth_session.capture_oauth_hash();
    refresh();
    // pick up loading state set before this effect ran
    setPageLoading(lib_page_loading.get_page_loading());
    const on_storage = (e: StorageEvent) => {
      if (
        e.key === lib_auth_session.AUTH_TOKEN_KEY ||
        e.key === lib_auth_session.AUTH_LOGIN_KEY ||
        e.key === null
      ) refresh();
    };
    const on_loading = (e: Event) => {
      setPageLoading(lib_page_loading.read_page_loading_detail(e));
    };
    window.addEventListener(lib_auth_session.AUTH_SESSION_EVENT, refresh);
    window.addEventListener('storage', on_storage);
    window.addEventListener(lib_page_loading.PAGE_LOADING_EVENT, on_loading);
    return () => {
      window.removeEventListener(lib_auth_session.AUTH_SESSION_EVENT, refresh);
      window.removeEventListener('storage', on_storage);
      window.removeEventListener(lib_page_loading.PAGE_LOADING_EVENT, on_loading);
    };
  }, [refresh]);

  const login = react.useCallback(() => {
    window.location.href = lib_api_url.get_api_url('/auth/github');
  }, []);

  const logout = react.useCallback(() => {
    lib_auth_session.clear_auth_session();
    setSession(null);
    setMenuOpen(false);
  }, []);

  return (
    <nav id="nav">
      <div className="ni">
        <component_brand.Brand size="xs" variant="full" className="nav-brand" href="/#"/>
        <ul className="nl">
          {links.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <div className="nav-end">
          <component_social.Social/>
          {!session ? (
            <button
              type="button"
              className="nav-auth-icon"
              onClick={login}
              aria-label="Sign in with GitHub"
            >
              <lucide.Fingerprint className="nav-auth-svg" size={18} strokeWidth={2}/>
            </button>
          ) : (
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
                  src={session.avatar}
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
                        src={session.avatar}
                        alt=""
                        width={28}
                        height={28}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="nav-staff-login">@{session.login}</div>
                        <div className="nav-staff-role">{session.staff ? 'Staff' : 'Member'}</div>
                      </div>
                    </div>
                    <a className="nav-staff-item" href="/workspace" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Workspace
                    </a>
                    <button type="button" className="nav-staff-item nav-staff-item--btn" role="menuitem" onClick={logout}>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {pageLoading && (
        <div className="nav-loader" aria-hidden>
          <div className="nav-loader-bar nav-loader-bar--1"/>
          <div className="nav-loader-bar nav-loader-bar--2"/>
          <div className="nav-loader-bar nav-loader-bar--3"/>
        </div>
      )}
    </nav>
  );
}
