import * as lib_auth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  if (!lib_auth.auth_configured()) {
    return Response.json(
      { error: 'Auth is not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / Redis)' },
      { status: 503 }
    );
  }

  const state = lib_auth.make_oauth_state();
  await lib_auth.store_oauth_state(state);
  return Response.redirect(lib_auth.github_authorize_url(state), 302);
}
