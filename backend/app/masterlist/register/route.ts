import * as lib_redis      from '@/lib/redis';
import * as lib_ratelimit  from '@/lib/ratelimit';
import * as lib_auth       from '@/lib/auth';
import * as lib_masterlist from '@/lib/masterlist';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured()) return Response.json({ error: 'Auth is not configured' }, { status: 503 });
  if (!lib_redis.redis_configured) return lib_masterlist.unavailable();
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session?.staff) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name: string = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) return Response.json({ error: 'name is required' }, { status: 400 });
  if (name.length > lib_masterlist.MAX_NAME_LENGTH) return Response.json({ error: `name too long (max ${lib_masterlist.MAX_NAME_LENGTH})` }, { status: 400 });
  const { token, id } = await lib_masterlist.issue_token();

  return Response.json({
    token,
    id,
    name,
    note: "Store this token in that server's config.yaml now — it will not be shown again."
  });
}
