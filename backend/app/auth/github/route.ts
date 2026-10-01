import * as lib_auth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
  if (!lib_auth.auth_configured()) {
    return Response.json(
      {
        error: 'Auth is not configured (GITHUB_APP_CLIENT_ID + GITHUB_APP_CLIENT_SECRET, or GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET, and Redis)'
      },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/workspace';
  const state = lib_auth.make_oauth_state();
  await lib_auth.store_oauth_state(state, next.startsWith('/') ? next : '/workspace');
  return Response.redirect(lib_auth.github_authorize_url(state), 302);
}
