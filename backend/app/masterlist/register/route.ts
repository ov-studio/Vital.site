import * as lib_redis      from '@/lib/redis';
import * as lib_ratelimit  from '@/lib/ratelimit';
import * as lib_staff_auth from '@/lib/staff_auth';
import * as crypto         from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_staff_auth.staff_auth_configured()) return Response.json({ error: 'Staff auth is not configured' }, { status: 503 });
  if (!lib_redis.redis_configured) return Response.json({ error: 'Masterlist is temporarily unavailable' }, { status: 503 });
  const staff = await lib_staff_auth.authorize_register(req.headers.get('authorization'));
  if (!staff) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name: string | undefined = typeof body?.name === 'string' ? body.name.trim() : undefined;
  if (name !== undefined && name.length > 64) return Response.json({ error: 'name too long (max 64)' }, { status: 400 });
  const token = crypto.randomBytes(32).toString('hex');
  const id = crypto.createHash('sha256').update(token).digest('hex');
  await lib_redis.redis!.set(lib_redis.token_key(id), Date.now());

  return Response.json({
    token,
    id,
    name: name ?? null,
    note: "Store this token in that server's config.yaml now — it will not be shown again."
  });
}
