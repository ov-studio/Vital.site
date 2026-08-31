import * as crypto      from 'crypto';
import * as config_site from '@/configs/site';
import * as lib_redis   from '@/lib/redis';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type Application = {
  appId:       string;
  login:       string;
  name:        string;
  status:      ApplicationStatus;
  createdAt:   number;
  decidedAt?:  number;
  decidedBy?:  string;
  token?:      string;
  /** Internal token hash — never shown to non-staff clients. */
  id?:         string;
  tokenClaimed?: boolean;
};

function parse_application(raw: unknown): Application | null {
  try {
    const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Application;
    if (typeof data?.appId !== 'string' || typeof data?.login !== 'string' || typeof data?.status !== 'string') {
      return null;
    }
    return data;
  }
  catch { return null; }
}

function new_app_id(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function get_application(appId: string): Promise<Application | null> {
  if (!lib_redis.redis) return null;
  const raw = await lib_redis.redis.get(lib_redis.application_key(appId));
  if (!raw) return null;
  return parse_application(raw);
}

export async function set_application(app: Application, ttl_seconds?: number): Promise<void> {
  if (!lib_redis.redis) throw new Error('Redis not configured');
  const key = lib_redis.application_key(app.appId);
  if (ttl_seconds) await lib_redis.redis.set(key, JSON.stringify(app), { ex: ttl_seconds });
  else await lib_redis.redis.set(key, JSON.stringify(app));
  await lib_redis.redis.sadd(lib_redis.user_apps_key(app.login), app.appId);
}

export async function delete_application(appId: string): Promise<void> {
  if (!lib_redis.redis) return;
  const app = await get_application(appId);
  await lib_redis.redis.del(lib_redis.application_key(appId));
  await lib_redis.redis.srem(lib_redis.applications_pending_key, appId);
  await lib_redis.redis.srem(lib_redis.applications_approved_key, appId);
  if (app) {
    await lib_redis.redis.srem(lib_redis.user_apps_key(app.login), appId);
  }
}

/** All applications for a user (any status), newest first. */
export async function list_user_applications(login: string): Promise<Application[]> {
  if (!lib_redis.redis) return [];
  const l = login.toLowerCase();
  const appIds = await lib_redis.redis.smembers(lib_redis.user_apps_key(l));
  if (!appIds.length) return [];

  const keys   = appIds.map((id) => lib_redis.application_key(String(id)));
  const values = await lib_redis.redis.mget<unknown[]>(...keys);
  const out: Application[] = [];
  const stale: string[] = [];

  values.forEach((v, i) => {
    const app = parse_application(v);
    if (!app) { stale.push(String(appIds[i])); return; }
    out.push(app);
  });
  if (stale.length) await lib_redis.redis.srem(lib_redis.user_apps_key(l), ...stale);

  out.sort((a, b) => (b.decidedAt ?? b.createdAt) - (a.decidedAt ?? a.createdAt));
  return out;
}

export async function get_user_pending(login: string): Promise<Application | null> {
  const apps = await list_user_applications(login);
  return apps.find((a) => a.status === 'pending') ?? null;
}

export async function list_user_approved(login: string): Promise<Application[]> {
  const apps = await list_user_applications(login);
  return apps.filter((a) => a.status === 'approved');
}

export async function list_pending(): Promise<Application[]> {
  if (!lib_redis.redis) return [];
  const ids = await lib_redis.redis.smembers(lib_redis.applications_pending_key);
  if (!ids.length) return [];

  const keys   = ids.map((id) => lib_redis.application_key(String(id)));
  const values = await lib_redis.redis.mget<unknown[]>(...keys);
  const out: Application[] = [];
  const stale: string[] = [];

  values.forEach((v, i) => {
    const app = parse_application(v);
    if (!app || app.status !== 'pending') { stale.push(String(ids[i])); return; }
    out.push(app);
  });
  if (stale.length) await lib_redis.redis.srem(lib_redis.applications_pending_key, ...stale);

  out.sort((a, b) => a.createdAt - b.createdAt);
  return out;
}

export async function list_approved(): Promise<Application[]> {
  if (!lib_redis.redis) return [];
  const ids = await lib_redis.redis.smembers(lib_redis.applications_approved_key);
  if (!ids.length) return [];

  const keys   = ids.map((id) => lib_redis.application_key(String(id)));
  const values = await lib_redis.redis.mget<unknown[]>(...keys);
  const out: Application[] = [];
  const stale: string[] = [];

  values.forEach((v, i) => {
    const app = parse_application(v);
    if (!app || app.status !== 'approved' || !app.id) { stale.push(String(ids[i])); return; }
    out.push(app);
  });
  if (stale.length) await lib_redis.redis.srem(lib_redis.applications_approved_key, ...stale);

  out.sort((a, b) => (b.decidedAt ?? b.createdAt) - (a.decidedAt ?? a.createdAt));
  return out;
}

/** Owner view: strip internal id; strip token after claim. */
export function sanitize_for_owner(app: Application): Omit<Application, 'id'> {
  const { id: _id, ...rest } = app;
  if (rest.tokenClaimed) {
    const { token: _t, ...noToken } = rest;
    return noToken;
  }
  return rest;
}

/** Staff view: no raw token secret. */
export function sanitize_for_staff(app: Application): Omit<Application, 'token'> {
  const { token: _t, ...rest } = app;
  return rest;
}

export async function create_pending(login: string, name: string): Promise<Application | { error: string }> {
  const existingPending = await get_user_pending(login);
  if (existingPending) {
    return { error: 'You already have a pending application. Cancel it or wait for a decision.' };
  }

  const approved = await list_user_approved(login);
  const unclaimed = approved.find((a) => !a.tokenClaimed && a.token);
  if (unclaimed) {
    return { error: 'You have an approved token waiting to be claimed. Open workspace to view it first.' };
  }

  const app: Application = {
    appId:     new_app_id(),
    login:     login.toLowerCase(),
    name:      name.trim().slice(0, 64) || 'Unnamed server',
    status:    'pending',
    createdAt: Date.now()
  };
  const ttl_seconds = Math.floor(config_site.info.applications.pending_ttl_ms / 1000);
  await set_application(app, ttl_seconds);
  await lib_redis.redis!.sadd(lib_redis.applications_pending_key, app.appId);
  return app;
}

export async function cancel_pending(login: string, appId?: string): Promise<{ ok: true } | { error: string }> {
  let existing: Application | null = null;
  if (appId) {
    existing = await get_application(appId);
    if (existing && existing.login !== login.toLowerCase()) {
      return { error: 'Not your application' };
    }
  } else {
    existing = await get_user_pending(login);
  }
  if (!existing) return { error: 'No application found' };
  if (existing.status !== 'pending') return { error: 'Only pending applications can be cancelled' };
  await delete_application(existing.appId);
  return { ok: true };
}

export async function approve_application(
  appId: string,
  staff_login: string
): Promise<{ app: Application } | { error: string }> {
  const existing = await get_application(appId);
  if (!existing) return { error: 'Application not found' };
  if (existing.status !== 'pending') return { error: 'Application is not pending' };

  const token = crypto.randomBytes(32).toString('hex');
  const id    = crypto.createHash('sha256').update(token).digest('hex');
  await lib_redis.redis!.set(lib_redis.token_key(id), Date.now(), { ex: lib_redis.applications_approved_ttl_seconds });

  const app: Application = {
    ...existing,
    status:       'approved',
    decidedAt:    Date.now(),
    decidedBy:    staff_login.toLowerCase(),
    token,
    id,
    tokenClaimed: false
  };
  await set_application(app);
  await lib_redis.redis!.srem(lib_redis.applications_pending_key, app.appId);
  await lib_redis.redis!.sadd(lib_redis.applications_approved_key, app.appId);
  return { app };
}

export async function reject_application(
  appId: string,
  staff_login: string
): Promise<{ app: Application } | { error: string }> {
  const existing = await get_application(appId);
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
  await lib_redis.redis!.srem(lib_redis.applications_pending_key, app.appId);
  return { app };
}

export async function claim_token(login: string, appId: string): Promise<{ ok: true } | { error: string }> {
  const existing = await get_application(appId);
  if (!existing) return { error: 'No application found' };
  if (existing.login !== login.toLowerCase()) return { error: 'Not your application' };
  if (existing.status !== 'approved' || !existing.token) return { error: 'Nothing to claim' };
  const app: Application = {
    ...existing,
    tokenClaimed: true
  };
  delete app.token;
  await set_application(app);
  return { ok: true };
}

export async function revoke_token(appId: string, staff_login: string): Promise<{ ok: true } | { error: string }> {
  const existing = await get_application(appId);
  if (!existing?.id) return { error: 'No approved token for this application' };
  const id = existing.id;
  await lib_redis.redis!.del(lib_redis.token_key(id));
  await lib_redis.redis!.del(lib_redis.server_key(id));
  await delete_application(appId);
  void staff_login;
  return { ok: true };
}
