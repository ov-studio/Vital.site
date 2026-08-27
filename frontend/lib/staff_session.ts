export const STAFF_TOKEN_KEY = 'vital_staff_token';
export const STAFF_SESSION_EVENT = 'vital-staff-session';

export type StaffSession = {
  token: string;
  login: string;
  avatarUrl: string;
};

function decode_payload(token: string): { sub?: string; exp?: number; typ?: string } | null {
  try {
    const body = token.split('.')[0];
    if (!body) return null;
    const json = atob(body.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as { sub?: string; exp?: number; typ?: string };
  }
  catch { return null; }
}

export function session_from_token(token: string | null | undefined): StaffSession | null {
  if (!token) return null;
  const payload = decode_payload(token);
  if (!payload || payload.typ !== 'staff' || typeof payload.sub !== 'string') return null;
  if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) return null;
  const login = payload.sub;
  return {
    token,
    login,
    avatarUrl: `https://avatars.githubusercontent.com/${encodeURIComponent(login)}?s=64`
  };
}

export function read_staff_session(): StaffSession | null {
  if (typeof window === 'undefined') return null;
  return session_from_token(sessionStorage.getItem(STAFF_TOKEN_KEY));
}

export function write_staff_session(token: string): StaffSession | null {
  if (typeof window === 'undefined') return null;
  const session = session_from_token(token);
  if (!session) {
    sessionStorage.removeItem(STAFF_TOKEN_KEY);
    window.dispatchEvent(new Event(STAFF_SESSION_EVENT));
    return null;
  }
  sessionStorage.setItem(STAFF_TOKEN_KEY, token);
  window.dispatchEvent(new Event(STAFF_SESSION_EVENT));
  return session;
}

export function clear_staff_session(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STAFF_TOKEN_KEY);
  window.dispatchEvent(new Event(STAFF_SESSION_EVENT));
}

export function capture_oauth_hash(): StaffSession | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash.startsWith('staff_token=')) return null;
  const token = decodeURIComponent(hash.slice('staff_token='.length));
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return write_staff_session(token);
}
