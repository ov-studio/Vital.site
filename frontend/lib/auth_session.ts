export const AUTH_TOKEN_KEY = 'vital_auth_token';
export const AUTH_LOGIN_KEY = 'vital_auth_login';
export const AUTH_STAFF_KEY = 'vital_auth_staff';
export const AUTH_SESSION_EVENT = 'vital-auth-session';

export type AuthSession = {
  token:  string;
  login:  string;
  staff:  boolean;
  avatar: string;
};

function avatar_for(login: string): string {
  return `https://avatars.githubusercontent.com/${encodeURIComponent(login)}?s=64`;
}

function store(): Storage | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; }
  catch { return null; }
}

function get_item(key: string): string | null {
  const ls = store();
  if (!ls) return null;
  const from_ls = ls.getItem(key);
  if (from_ls) return from_ls;
  try {
    const from_ss = sessionStorage.getItem(key);
    if (from_ss) {
      ls.setItem(key, from_ss);
      sessionStorage.removeItem(key);
      return from_ss;
    }
  }
  catch { }
  return null;
}

function set_item(key: string, value: string): void {
  const ls = store();
  if (!ls) return;
  ls.setItem(key, value);
  try { sessionStorage.removeItem(key); } catch { }
}

function remove_item(key: string): void {
  const ls = store();
  if (ls) ls.removeItem(key);
  try { sessionStorage.removeItem(key); } catch { }
}

/**
 * Build an AuthSession from raw token / login / staff flag strings.
 * Returns null when token or login is missing.
 */
export function session_from_parts(
  token: string | null | undefined,
  login: string | null | undefined,
  staff_flag: string | null | undefined
): AuthSession | null {
  if (!token || !login) return null;
  const normalized = login.toLowerCase();
  return {
    token,
    login:  normalized,
    staff:  staff_flag === '1' || staff_flag === 'true',
    avatar: avatar_for(normalized)
  };
}

/** Read the current auth session from localStorage (client only). */
export function read_auth_session(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  return session_from_parts(
    get_item(AUTH_TOKEN_KEY),
    get_item(AUTH_LOGIN_KEY),
    get_item(AUTH_STAFF_KEY)
  );
}

/**
 * Persist a new auth session and notify listeners via AUTH_SESSION_EVENT.
 * Clears storage and returns null when the session cannot be built.
 */
export function write_auth_session(token: string, login: string, is_staff: boolean): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const session = session_from_parts(token, login, is_staff ? '1' : '0');
  if (!session) {
    clear_auth_session();
    return null;
  }
  set_item(AUTH_TOKEN_KEY, session.token);
  set_item(AUTH_LOGIN_KEY, session.login);
  set_item(AUTH_STAFF_KEY, session.staff ? '1' : '0');
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  return session;
}

/** Remove stored auth keys and dispatch AUTH_SESSION_EVENT. */
export function clear_auth_session(): void {
  if (typeof window === 'undefined') return;
  remove_item(AUTH_TOKEN_KEY);
  remove_item(AUTH_LOGIN_KEY);
  remove_item(AUTH_STAFF_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function capture_oauth_hash(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const token = params.get('auth_token');
  const login = params.get('login');
  const staff = params.get('staff');
  if (!token || !login) return null;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return write_auth_session(token, login, staff === '1');
}

export function auth_headers(): HeadersInit {
  const s = read_auth_session();
  if (!s) return {};
  return {
    'Authorization': `Bearer ${s.token}`,
    'Content-Type': 'application/json'
  };
}
