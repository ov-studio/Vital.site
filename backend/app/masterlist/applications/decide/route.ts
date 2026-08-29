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
  if (!session?.staff) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body   = await req.json().catch(() => ({}));
  const action = typeof body?.action === 'string' ? body.action : '';
  const login  = typeof body?.login === 'string' ? body.login.trim().toLowerCase() : '';
  if (!login) return Response.json({ error: 'missing login' }, { status: 400 });

  if (action === 'approve') {
    const result = await lib_applications.approve_application(login, session.login);
    if ('error' in result) return Response.json({ error: result.error }, { status: 400 });
    return Response.json({ application: lib_applications.sanitize_for_staff(result.app) });
  }

  if (action === 'reject') {
    const result = await lib_applications.reject_application(login, session.login);
    if ('error' in result) return Response.json({ error: result.error }, { status: 400 });
    return Response.json({ application: lib_applications.sanitize_for_staff(result.app) });
  }

  if (action === 'revoke') {
    const result = await lib_applications.revoke_token(login, session.login);
    if ('error' in result) return Response.json({ error: result.error }, { status: 400 });
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'action must be approve, reject, or revoke' }, { status: 400 });
}
