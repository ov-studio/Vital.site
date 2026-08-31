import * as lib_redis         from '@/lib/redis';
import * as lib_ratelimit     from '@/lib/ratelimit';
import * as lib_auth          from '@/lib/auth';
import * as lib_applications  from '@/lib/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured() || !lib_redis.redis_configured) return Response.json({ error: 'Unavailable' }, { status: 503 });
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const pendingMine = await lib_applications.get_user_pending(session.login);
  const approvedMine = await lib_applications.list_user_approved(session.login);

  const body: {
    pending:      ReturnType<typeof lib_applications.sanitize_for_owner> | null;
    applications: ReturnType<typeof lib_applications.sanitize_for_owner>[];
    staffPending?: ReturnType<typeof lib_applications.sanitize_for_staff>[];
    staffTokens?:  ReturnType<typeof lib_applications.sanitize_for_staff>[];
  } = {
    pending:      pendingMine ? lib_applications.sanitize_for_owner(pendingMine) : null,
    applications: approvedMine.map(lib_applications.sanitize_for_owner)
  };

  if (session.staff) {
    const [pending, approved] = await Promise.all([
      lib_applications.list_pending(),
      lib_applications.list_approved()
    ]);
    body.staffPending = pending.map(lib_applications.sanitize_for_staff);
    body.staffTokens  = approved.map(lib_applications.sanitize_for_staff);
  }
  return Response.json(body);
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured() || !lib_redis.redis_configured) return Response.json({ error: 'Unavailable' }, { status: 503 });
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body?.name === 'string' ? body.name : '';
  const result = await lib_applications.create_pending(session.login, name);
  if ('error' in result) return Response.json({ error: result.error }, { status: 409 });
  return Response.json({ application: lib_applications.sanitize_for_owner(result) });
}

export async function DELETE(req: Request) {
  if (!lib_auth.auth_configured() || !lib_redis.redis_configured) return Response.json({ error: 'Unavailable' }, { status: 503 });
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const appId = typeof body?.appId === 'string' ? body.appId : undefined;
  const result = await lib_applications.cancel_pending(session.login, appId);
  if ('error' in result) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true });
}
