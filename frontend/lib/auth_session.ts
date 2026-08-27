export const AUTH_TOKEN_KEY = 'vital_auth_token';
export const AUTH_LOGIN_KEY = 'vital_auth_login';
export const AUTH_STAFF_KEY = 'vital_auth_staff';
export const AUTH_SESSION_EVENT = 'vital-auth-session';

export type AuthSession = {
  token:     string;
  login:     string;
  isStaff:   boolean;
  avatarUrl: string;
};

function avatar_for(login: string): string {
  return `https://avatars.githubusercontent.com/${encodeURIComponent(login)}?s=64`;
}

export function session_from_parts(
  token: string | null | undefined,
  login: string | null | undefined,
  staff_flag: string | null | undefined
): AuthSession | null {
  if (!token || !login) return null;
  const normalized = login.toLowerCase();
  return {
    token,
    login:     normalized,
    isStaff:   staff_flag === '1' || staff_flag === 'true',
    avatarUrl: avatar_for(normalized)
  };
}

export function read_auth_session(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  return session_from_parts(
    sessionStorage.getItem(AUTH_TOKEN_KEY),
    sessionStorage.getItem(AUTH_LOGIN_KEY),
    sessionStorage.getItem(AUTH_STAFF_KEY)
  );
}

export function write_auth_session(token: string, login: string, is_staff: boolean): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const session = session_from_parts(token, login, is_staff ? '1' : '0');
  if (!session) {
    clear_auth_session();
    return null;
  }
  sessionStorage.setItem(AUTH_TOKEN_KEY, session.token);
  sessionStorage.setItem(AUTH_LOGIN_KEY, session.login);
  sessionStorage.setItem(AUTH_STAFF_KEY, session.isStaff ? '1' : '0');
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  return session;
}

export function clear_auth_session(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_LOGIN_KEY);
  sessionStorage.removeItem(AUTH_STAFF_KEY);
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
