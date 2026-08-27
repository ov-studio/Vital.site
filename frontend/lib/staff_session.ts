export const STAFF_TOKEN_KEY = 'vital_staff_token';
export const STAFF_LOGIN_KEY = 'vital_staff_login';
export const STAFF_SESSION_EVENT = 'vital-staff-session';

export type StaffSession = {
  token: string;
  login: string;
  avatarUrl: string;
};

function avatar_for(login: string): string {
  return `https://avatars.githubusercontent.com/${encodeURIComponent(login)}?s=64`;
}

export function session_from_parts(token: string | null | undefined, login: string | null | undefined): StaffSession | null {
  if (!token || !login) return null;
  const normalized = login.toLowerCase();
  return {
    token,
    login: normalized,
    avatarUrl: avatar_for(normalized)
  };
}

export function read_staff_session(): StaffSession | null {
  if (typeof window === 'undefined') return null;
  return session_from_parts(
    sessionStorage.getItem(STAFF_TOKEN_KEY),
    sessionStorage.getItem(STAFF_LOGIN_KEY)
  );
}

export function write_staff_session(token: string, login: string): StaffSession | null {
  if (typeof window === 'undefined') return null;
  const session = session_from_parts(token, login);
  if (!session) {
    clear_staff_session();
    return null;
  }
  sessionStorage.setItem(STAFF_TOKEN_KEY, session.token);
  sessionStorage.setItem(STAFF_LOGIN_KEY, session.login);
  window.dispatchEvent(new Event(STAFF_SESSION_EVENT));
  return session;
}

export function clear_staff_session(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STAFF_TOKEN_KEY);
  sessionStorage.removeItem(STAFF_LOGIN_KEY);
  window.dispatchEvent(new Event(STAFF_SESSION_EVENT));
}

export function capture_oauth_hash(): StaffSession | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const token = params.get('staff_token');
  const login = params.get('login');
  if (!token || !login) return null;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return write_staff_session(token, login);
}
