import * as crypto      from 'crypto';
import * as config_site from '@/configs/site';
import * as lib_redis   from '@/lib/redis';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type Application = {
  login:       string;
  name:        string;
  status:      ApplicationStatus;
  createdAt:   number;
  decidedAt?:  number;
  decidedBy?:  string;
  token?:      string;
  id?:         string;
  tokenClaimed?: boolean;
};

function parse_application(raw: unknown): Application | null {
  try {
    const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Application;
    if (typeof data?.login !== 'string' || typeof data?.status !== 'string') return null;
    return data;
  }
  catch { return null; }
}

export async function get_application(login: string): Promise<Application | null> {
  if (!lib_redis.redis) return null;
  const raw = await lib_redis.redis.get(lib_redis.application_key(login));
  if (!raw) return null;
  return parse_application(raw);
}

export async function set_application(app: Application, ttl_seconds?: number): Promise<void> {
  if (!lib_redis.redis) throw new Error('Redis not configured');
  const key = lib_redis.application_key(app.login);
  if (ttl_seconds) await lib_redis.redis.set(key, JSON.stringify(app), { ex: ttl_seconds });
  else await lib_redis.redis.set(key, JSON.stringify(app));
}

export async function delete_application(login: string): Promise<void> {
  if (!lib_redis.redis) return;
  const l = login.toLowerCase();
  await lib_redis.redis.del(lib_redis.application_key(l));
  await lib_redis.redis.srem(lib_redis.applications_pending_key, l);
  await lib_redis.redis.srem(lib_redis.applications_approved_key, l);
}

export async function list_pending(): Promise<Application[]> {
  if (!lib_redis.redis) return [];
  const logins = await lib_redis.redis.smembers(lib_redis.applications_pending_key);
  if (!logins.length) return [];
  const keys   = logins.map((l) => lib_redis.application_key(String(l)));
  const values = await lib_redis.redis.mget<unknown[]>(...keys);
  const out: Application[] = [];
  const stale: string[] = [];
  values.forEach((v, i) => {
    const app = parse_application(v);
    if (!app || app.status !== 'pending') { stale.push(String(logins[i])); return; }
    out.push(app);
  });
  if (stale.length) await lib_redis.redis.srem(lib_redis.applications_pending_key, ...stale);
  out.sort((a, b) => a.createdAt - b.createdAt);
  return out;
}

export async function list_approved(): Promise<Application[]> {
  if (!lib_redis.redis) return [];
  const logins = await lib_redis.redis.smembers(lib_redis.applications_approved_key);
  if (!logins.length) return [];
  const keys   = logins.map((l) => lib_redis.application_key(String(l)));
  const values = await lib_redis.redis.mget<unknown[]>(...keys);
  const out: Application[] = [];
  const stale: string[] = [];
  values.forEach((v, i) => {
    const app = parse_application(v);
    if (!app || app.status !== 'approved' || !app.id) { stale.push(String(logins[i])); return; }
    out.push(app);
  });
  if (stale.length) await lib_redis.redis.srem(lib_redis.applications_approved_key, ...stale);
  out.sort((a, b) => (b.decidedAt ?? b.createdAt) - (a.decidedAt ?? a.createdAt));
  return out;
}

export function sanitize_for_owner(app: Application): Application {
  if (app.tokenClaimed) {
    const { token: _t, ...rest } = app;
    return rest;
  }
  return app;
}

export function sanitize_for_staff(app: Application): Omit<Application, 'token'> {
  const { token: _t, ...rest } = app;
  return rest;
}

export async function create_pending(login: string, name: string): Promise<Application | { error: string }> {
  const existing = await get_application(login);
  if (existing?.status === 'pending') {
    return { error: 'You already have a pending application. Cancel it or wait for a decision.' };
  }
  if (existing?.status === 'approved' && !existing.tokenClaimed && existing.token) {
    return { error: 'You have an approved token waiting to be claimed. Open workspace to view it first.' };
  }

  const app: Application = {
    login:     login.toLowerCase(),
    name:      name.trim().slice(0, 64) || 'Unnamed server',
    status:    'pending',
    createdAt: Date.now()
  };
  const ttl_seconds = Math.floor(config_site.info.applications.pending_ttl_ms / 1000);
  await set_application(app, ttl_seconds);
  await lib_redis.redis!.sadd(lib_redis.applications_pending_key, app.login);
  return app;
}

export async function cancel_pending(login: string): Promise<{ ok: true } | { error: string }> {
  const existing = await get_application(login);
  if (!existing) return { error: 'No application found' };
  if (existing.status !== 'pending') return { error: 'Only pending applications can be cancelled' };
  await delete_application(login);
  return { ok: true };
}

export async function approve_application(
  applicant_login: string,
  staff_login: string
): Promise<{ app: Application } | { error: string }> {
  const existing = await get_application(applicant_login);
  if (!existing) return { error: 'Application not found' };
  if (existing.status !== 'pending') return { error: 'Application is not pending' };

  const token = crypto.randomBytes(32).toString('hex');
  const id    = crypto.createHash('sha256').update(token).digest('hex');
  await lib_redis.redis!.set(lib_redis.token_key(id), Date.now());

  const app: Application = {
    ...existing,
    status:      'approved',
    decidedAt:   Date.now(),
    decidedBy:   staff_login.toLowerCase(),
    token,
    id,
    tokenClaimed: false
  };
  await set_application(app);
  await lib_redis.redis!.srem(lib_redis.applications_pending_key, app.login);
  await lib_redis.redis!.sadd(lib_redis.applications_approved_key, app.login);
  return { app };
}

export async function reject_application(
  applicant_login: string,
  staff_login: string
): Promise<{ app: Application } | { error: string }> {
  const existing = await get_application(applicant_login);
  if (!existing) return { error: 'Application not found' };
  if (existing.status !== 'pending') return { error: 'Application is not pending' };

  const app: Application = {
    ...existing,
    status:    'rejected',
    decidedAt: Date.now(),
    decidedBy: staff_login.toLowerCase()
  };
  delete app.token;
  delete app.id;
  await set_application(app);
  await lib_redis.redis!.srem(lib_redis.applications_pending_key, app.login);
  return { app };
}

export async function claim_token(login: string): Promise<{ ok: true } | { error: string }> {
  const existing = await get_application(login);
  if (!existing) return { error: 'No application found' };
  if (existing.status !== 'approved' || !existing.token) return { error: 'Nothing to claim' };
  const app: Application = {
    ...existing,
    tokenClaimed: true
  };
  delete app.token;
  await set_application(app);
  return { ok: true };
}

export async function revoke_token(login: string, staff_login: string): Promise<{ ok: true } | { error: string }> {
  const existing = await get_application(login);
  if (!existing?.id) return { error: 'No approved token for this user' };
  const id = existing.id;
  await lib_redis.redis!.del(lib_redis.token_key(id));
  await lib_redis.redis!.del(lib_redis.server_key(id));
  await delete_application(login);
  void staff_login;
  return { ok: true };
}
