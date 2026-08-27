import * as lib_api_url from '@/lib/api_url';
import * as crypto      from 'crypto';

const STAFF_TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';
const GITHUB_USER = 'https://api.github.com/user';

function staff_secret(): string | null {
  return process.env.STAFF_JWT_SECRET || process.env.MASTERLIST_ADMIN_SECRET || null;
}

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
    staff_secret() &&
    staff_logins().size > 0
  );
}

export function is_staff_login(login: string): boolean {
  return staff_logins().has(login.toLowerCase());
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf, 'utf8') : buf;
  return b.toString('base64url');
}

function timing_safe_equal_str(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function issue_staff_token(login: string): string {
  const secret = staff_secret();
  if (!secret) throw new Error('staff secret not configured');
  const payload = {
    sub: login.toLowerCase(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + STAFF_TOKEN_TTL_SECONDS,
    typ: 'staff'
  };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(body).digest();
  return `${body}.${b64url(sig)}`;
}

export function verify_staff_token(token: string): { login: string } | null {
  const secret = staff_secret();
  if (!secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = b64url(crypto.createHmac('sha256', secret).update(body).digest());
  if (!timing_safe_equal_str(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      sub?: string;
      exp?: number;
      typ?: string;
    };
    if (payload.typ !== 'staff' || typeof payload.sub !== 'string') return null;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!is_staff_login(payload.sub)) return null;
    return { login: payload.sub };
  } catch {
    return null;
  }
}

export function authorize_register(auth_header: string | null): boolean {
  if (!auth_header?.startsWith('Bearer ')) return false;
  const token = auth_header.slice(7).trim();
  if (!token) return false;

  const admin = process.env.MASTERLIST_ADMIN_SECRET;
  if (admin) {
    const expected = `Bearer ${admin}`;
    const a = Buffer.from(auth_header);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }
  return verify_staff_token(token) !== null;
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

export function make_oauth_state(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function staff_frontend_callback_url(staff_token: string): string {
  const base = lib_api_url.get_frontend_url();
  return `${base}/staff#staff_token=${encodeURIComponent(staff_token)}`;
}

export function staff_frontend_error_url(message: string): string {
  const base = lib_api_url.get_frontend_url();
  return `${base}/staff?error=${encodeURIComponent(message)}`;
}
