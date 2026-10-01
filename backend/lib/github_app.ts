import * as crypto from 'crypto';

function b64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function read_private_key(): string | null {
  const raw = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!raw?.trim()) return null;
  return raw.includes('\\n') ? raw.replace(/\\n/g, '\n') : raw;
}

export function github_app_configured(): boolean {
  return Boolean(
    process.env.GITHUB_APP_ID &&
    process.env.GITHUB_APP_INSTALLATION_ID &&
    read_private_key()
  );
}

export function app_jwt(): string {
  const app_id = process.env.GITHUB_APP_ID;
  const key = read_private_key();
  if (!app_id || !key) throw new Error('GitHub App not configured');

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iat: now - 60,
    exp: now + 9 * 60,
    iss: app_id
  }));
  const data = `${header}.${payload}`;
  const sig = crypto.sign('RSA-SHA256', Buffer.from(data), key);
  return `${data}.${b64url(sig)}`;
}

export async function installation_token(): Promise<string> {
  const installation_id = process.env.GITHUB_APP_INSTALLATION_ID;
  if (!installation_id) throw new Error('GITHUB_APP_INSTALLATION_ID missing');

  const jwt = app_jwt();
  const res = await fetch(
    `https://api.github.com/app/installations/${installation_id}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${jwt}`,
        'User-Agent': 'Vital.site/1.0'
      }
    }
  );
  const json = (await res.json().catch(() => ({}))) as { token?: string; message?: string };
  if (!res.ok || !json.token) {
    throw new Error(json.message || `GitHub App token failed (HTTP ${res.status})`);
  }
  return json.token;
}

/** Installation token for vault write (merge/close/remove). */
export async function vault_write_token(): Promise<string | null> {
  if (!github_app_configured()) return null;
  try {
    return await installation_token();
  }
  catch {
    return null;
  }
}
