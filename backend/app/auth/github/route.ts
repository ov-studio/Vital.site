import * as lib_staff_auth from '@/lib/staff_auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  if (!lib_staff_auth.staff_auth_configured()) {
    return Response.json(
      { error: 'Staff GitHub login is not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / STAFF_GITHUB_LOGINS / Redis)' },
      { status: 503 }
    );
  }

  const state = lib_staff_auth.make_oauth_state();
  await lib_staff_auth.store_oauth_state(state);
  return Response.redirect(lib_staff_auth.github_authorize_url(state), 302);
}
