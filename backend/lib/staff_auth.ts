import * as crypto      from 'crypto';
import * as lib_api_url from '@/lib/api_url';
import * as lib_redis   from '@/lib/redis';

const STAFF_SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';
const GITHUB_USER = 'https://api.github.com/user';

function staff_logins(): Set<string> {
  const raw = process.env.STAFF_GITHUB_LOGINS ?? '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function staff_auth_configured(): boolean {
  return Boolean(
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    staff_logins().size > 0 &&
    lib_redis.redis_configured
  );
}

export function is_staff_login(login: string): boolean {
  return staff_logins().has(login.toLowerCase());
}

export function make_oauth_state(): string {
  return crypto.randomBytes(24).toString('hex');
}

export async function store_oauth_state(state: string): Promise<void> {
  if (!lib_redis.redis) throw new Error('Redis not configured');
  await lib_redis.redis.set(lib_redis.staff_oauth_state_key(state), '1', { ex: 600 });
}

export async function consume_oauth_state(state: string): Promise<boolean> {
  if (!lib_redis.redis) return false;
  const key = lib_redis.staff_oauth_state_key(state);
  const ok = await lib_redis.redis.get(key);
  if (!ok) return false;
  await lib_redis.redis.del(key);
  return true;
}

export async function issue_staff_session(login: string): Promise<string> {
  if (!lib_redis.redis) throw new Error('Redis not configured');
  const session_token = crypto.randomBytes(32).toString('hex');
  await lib_redis.redis.set(
    lib_redis.staff_session_key(session_token),
    JSON.stringify({ login: login.toLowerCase() }),
    { ex: STAFF_SESSION_TTL_SECONDS }
  );
  return session_token;
}

export async function verify_staff_session(session_token: string): Promise<{ login: string } | null> {
  if (!lib_redis.redis || !session_token) return null;
  const raw = await lib_redis.redis.get(lib_redis.staff_session_key(session_token));
  if (!raw) return null;
  try {
    const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as { login?: string };
    if (typeof data.login !== 'string' || !is_staff_login(data.login)) return null;
    return { login: data.login };
  }
  catch { return null; }
}

export async function authorize_register(auth_header: string | null): Promise<{ login: string } | null> {
  if (!auth_header?.startsWith('Bearer ')) return null;
  const token = auth_header.slice(7).trim();
  if (!token) return null;
  return verify_staff_session(token);
}

export function github_authorize_url(state: string): string {
  const client_id = process.env.GITHUB_CLIENT_ID!;
  const redirect_uri = `${lib_api_url.get_backend_url()}/auth/github/callback`;
  const params = new URLSearchParams({
    client_id,
    redirect_uri,
    scope: 'read:user',
    state
  });
  return `${GITHUB_AUTHORIZE}?${params}`;
}

export async function exchange_github_code(code: string): Promise<{ access_token: string } | { error: string }> {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  if (!client_id || !client_secret) return { error: 'GitHub OAuth not configured' };

  const redirect_uri = `${lib_api_url.get_backend_url()}/auth/github/callback`;
  const res = await fetch(GITHUB_TOKEN, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri
    })
  });

  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!data.access_token) return { error: data.error_description || data.error || 'token exchange failed' };
  return { access_token: data.access_token };
}

export async function fetch_github_login(access_token: string): Promise<{ login: string } | { error: string }> {
  const res = await fetch(GITHUB_USER, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${access_token}`,
      'User-Agent': 'Vital.site/1.0'
    }
  });
  if (!res.ok) return { error: 'failed to fetch GitHub user' };
  const data = (await res.json()) as { login?: string };
  if (!data.login) return { error: 'GitHub user missing login' };
  return { login: data.login };
}

export function staff_frontend_callback_url(session_token: string, login: string): string {
  const base = lib_api_url.get_frontend_url();
  const params = new URLSearchParams({
    staff_token: session_token,
    login: login.toLowerCase()
  });
  return `${base}/staff#${params.toString()}`;
}

export function staff_frontend_error_url(message: string): string {
  const base = lib_api_url.get_frontend_url();
  return `${base}/staff?error=${encodeURIComponent(message)}`;
}
