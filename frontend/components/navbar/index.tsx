'use client';
import * as config_site      from '@/configs/site';
import * as component_social from '@/components/social';
import * as ui_brand         from '@/ui/brand';
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
  const [loaderMounted, setLoaderMounted] = react.useState(false);
  const [loaderOn, setLoaderOn] = react.useState(false);

  const refresh = react.useCallback(() => {
    setSession(lib_auth_session.read_auth_session());
  }, []);

  react.useEffect(() => {
    lib_auth_session.capture_oauth_hash();
    refresh();
    const initial = lib_page_loading.get_page_loading();
    setPageLoading(initial);
    if (initial) setLoaderMounted(true);
    const on_storage = (e: StorageEvent) => {
      if (
        e.key === lib_auth_session.AUTH_TOKEN_KEY ||
        e.key === lib_auth_session.AUTH_LOGIN_KEY ||
        e.key === lib_auth_session.AUTH_STAFF_KEY ||
        e.key === null
      ) refresh();
    };
    const on_loading = (e: Event) => {
      const on = lib_page_loading.read_page_loading_detail(e);
      if (on) setLoaderMounted(true);
      setPageLoading(on);
    };
    const on_visible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener(lib_auth_session.AUTH_SESSION_EVENT, refresh);
    window.addEventListener('storage', on_storage);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', on_visible);
    window.addEventListener(lib_page_loading.PAGE_LOADING_EVENT, on_loading);
    return () => {
      window.removeEventListener(lib_auth_session.AUTH_SESSION_EVENT, refresh);
      window.removeEventListener('storage', on_storage);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('visibilitychange', on_visible);
      window.removeEventListener(lib_page_loading.PAGE_LOADING_EVENT, on_loading);
    };
  }, [refresh]);

  react.useEffect(() => {
    if (!loaderMounted) {
      setLoaderOn(false);
      return;
    }
    if (pageLoading) {
      const id = requestAnimationFrame(() => setLoaderOn(true));
      return () => cancelAnimationFrame(id);
    }
    setLoaderOn(false);
  }, [loaderMounted, pageLoading]);

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
        <ui_brand.Brand name={config_site.info.name} size="xs" variant="full" className="nav-brand" href="/#"/>
        <ul className="nl">
          {links.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <div className="nav-end">
          <component_social.Social/>
          {!session ? (
            <a
              href="/workspace"
              className="nav-auth-icon"
              aria-label="Open workspace"
            >
              <lucide.Fingerprint className="nav-auth-svg" size={18} strokeWidth={2}/>
            </a>
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
      {loaderMounted && (
        <div
          className={`nav-loader${loaderOn ? ' nav-loader--on' : ''}`}
          aria-hidden
          onTransitionEnd={(e) => {
            if (e.propertyName === 'opacity' && !pageLoading) setLoaderMounted(false);
          }}
        >
          <div className="nav-loader-bar nav-loader-bar--1"/>
          <div className="nav-loader-bar nav-loader-bar--2"/>
        </div>
      )}
    </nav>
  );
}
