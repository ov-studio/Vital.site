import * as lib_redis        from '@/lib/redis';
import * as lib_ratelimit    from '@/lib/ratelimit';
import * as lib_auth         from '@/lib/auth';
import * as lib_applications from '@/lib/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured() || !lib_redis.redis_configured) return Response.json({ error: 'Unavailable' }, { status: 503 });
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const result = await lib_applications.claim_token(session.login);
  if ('error' in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
