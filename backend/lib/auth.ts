import * as lib_api_url from '@/lib/api_url';
import * as lib_redis   from '@/lib/redis';
import * as lib_staff   from '@/lib/staff';
import * as crypto      from 'crypto';

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';
const GITHUB_USER = 'https://api.github.com/user';

export type AuthSession = {
  login: string;
  staff: boolean;
};

export function auth_configured(): boolean {
  return Boolean(
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    lib_redis.redis_configured
  );
}

export function is_staff_login(login: string): boolean {
  return lib_staff.is_staff_login(login);
}

export function make_oauth_state(): string {
  return crypto.randomBytes(24).toString('hex');
}

export async function store_oauth_state(state: string, next_path?: string): Promise<void> {
  if (!lib_redis.redis) throw new Error('Redis not configured');
  const payload = JSON.stringify({ next: next_path && next_path.startsWith('/') ? next_path : '/workspace' });
  await lib_redis.redis.set(lib_redis.auth_oauth_state_key(state), payload, { ex: 600 });
}

export async function consume_oauth_state(state: string): Promise<{ ok: boolean; next: string }> {
  if (!lib_redis.redis || !state) return { ok: false, next: '/workspace' };
  const key = lib_redis.auth_oauth_state_key(state);
  const raw = await lib_redis.redis.get(key);
  if (!raw) return { ok: false, next: '/workspace' };
  await lib_redis.redis.del(key);
  try {
    const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as { next?: string };
    const next = typeof data?.next === 'string' && data.next.startsWith('/') ? data.next : '/workspace';
    return { ok: true, next };
  }
  catch {
    return { ok: true, next: '/workspace' };
  }
}



export async function issue_session(login: string, github_token?: string): Promise<string> {
  if (!lib_redis.redis) throw new Error('Redis not configured');
  const session_token = crypto.randomBytes(32).toString('hex');
  const payload: AuthSession = {
    login:   login.toLowerCase(),
    staff: is_staff_login(login)
  };
  await lib_redis.redis.set(
    lib_redis.auth_session_key(session_token),
    JSON.stringify(payload),
    { ex: SESSION_TTL_SECONDS }
  );
  if (github_token) {
    await lib_redis.redis.set(
      lib_redis.auth_github_token_key(session_token),
      github_token,
      { ex: SESSION_TTL_SECONDS }
    );
  }
  return session_token;
}

export async function github_token_from_session(session_token: string): Promise<string | null> {
  if (!lib_redis.redis || !session_token) return null;
  const t = await lib_redis.redis.get(lib_redis.auth_github_token_key(session_token));
  return typeof t === 'string' && t ? t : null;
}

export async function github_token_from_auth_header(auth_header: string | null): Promise<string | null> {
  if (!auth_header?.startsWith('Bearer ')) return null;
  return github_token_from_session(auth_header.slice(7).trim());
}

export async function verify_session(session_token: string): Promise<AuthSession | null> {
  if (!lib_redis.redis || !session_token) return null;
  const raw = await lib_redis.redis.get(lib_redis.auth_session_key(session_token));
  if (!raw) return null;
  try {
    const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as AuthSession;
    if (typeof data.login !== 'string') return null;
    return {
      login:   data.login.toLowerCase(),
      staff: Boolean(data.staff) || is_staff_login(data.login)
    };
  }
  catch { return null; }
}

export async function session_from_auth_header(auth_header: string | null): Promise<AuthSession | null> {
  if (!auth_header?.startsWith('Bearer ')) return null;
  const token = auth_header.slice(7).trim();
  if (!token) return null;
  return verify_session(token);
}

export function github_authorize_url(state: string): string {
  const client_id = process.env.GITHUB_CLIENT_ID!;
  const redirect_uri = `${lib_api_url.get_backend_url()}/auth/github/callback`;
  const params = new URLSearchParams({
    client_id,
    redirect_uri,
    scope: 'read:user public_repo workflow',
    state
  });
  return `${GITHUB_AUTHORIZE}?${params}`;
}

export async function exchange_github_code(code: string): Promise<{ access_token: string } | { error: string }> {
  const client_id     = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  if (!client_id || !client_secret) return { error: 'GitHub OAuth not configured' };

  const redirect_uri = `${lib_api_url.get_backend_url()}/auth/github/callback`;
  const res = await fetch(GITHUB_TOKEN, {
    method:  'POST',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ client_id, client_secret, code, redirect_uri })
  });

  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!data.access_token) return { error: data.error_description || data.error || 'token exchange failed' };
  return { access_token: data.access_token };
}

export async function fetch_github_login(access_token: string): Promise<{ login: string } | { error: string }> {
  const res = await fetch(GITHUB_USER, {
    headers: {
      'Accept':        'application/vnd.github+json',
      'Authorization': `Bearer ${access_token}`,
      'User-Agent':    'Vital.site/1.0'
    }
  });
  if (!res.ok) return { error: 'failed to fetch GitHub user' };
  const data = (await res.json()) as { login?: string };
  if (!data.login) return { error: 'GitHub user missing login' };
  return { login: data.login };
}

export function auth_callback_url(
  next_path: string,
  session_token: string,
  login: string,
  is_staff: boolean
): string {
  const base = lib_api_url.get_frontend_url();
  const path = next_path.startsWith('/') ? next_path : '/workspace';
  const params = new URLSearchParams({
    auth_token: session_token,
    login:      login.toLowerCase(),
    staff:      is_staff ? '1' : '0'
  });
  return `${base}${path}#${params.toString()}`;
}

/** @deprecated use auth_callback_url */
export function workspace_callback_url(session_token: string, login: string, is_staff: boolean): string {
  return auth_callback_url('/workspace', session_token, login, is_staff);
}

export function auth_error_url(next_path: string, message: string): string {
  const base = lib_api_url.get_frontend_url();
  const path = next_path.startsWith('/') ? next_path : '/workspace';
  return `${base}${path}?error=${encodeURIComponent(message)}`;
}

export function workspace_error_url(message: string): string {
  return auth_error_url('/workspace', message);
}


/** Server-side token for staff vault PR merge/close (classic PAT or fine-grained). */
export function vault_github_token(): string | null {
  const t = process.env.GITHUB_VAULT_TOKEN || process.env.GITHUB_TOKEN || null;
  return t && t.trim() ? t.trim() : null;
}
