import * as lib_staff_auth from '@/lib/staff_auth';
import * as lib_redis      from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  if (!lib_staff_auth.staff_auth_configured()) {
    return Response.json(
      { error: 'Staff GitHub login is not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / STAFF_GITHUB_LOGINS / secret)' },
      { status: 503 }
    );
  }

  const state = lib_staff_auth.make_oauth_state();
  if (lib_redis.redis_configured && lib_redis.redis) await lib_redis.redis.set(`staff:oauth:state:${state}`, '1', { ex: 600 });
  return Response.redirect(lib_staff_auth.github_authorize_url(state), 302);
}
