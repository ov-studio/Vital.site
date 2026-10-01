import * as lib_auth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
  if (!lib_auth.auth_configured()) {
    return Response.redirect(lib_auth.auth_error_url('/workspace', 'Auth not configured'), 302);
  }
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauth_error = url.searchParams.get('error');

  const consumed = state ? await lib_auth.consume_oauth_state(state) : { ok: false, next: '/workspace' };
  const next = consumed.next;

  if (oauth_error) {
    return Response.redirect(
      lib_auth.auth_error_url(next, url.searchParams.get('error_description') || oauth_error),
      302
    );
  }
  if (!code || !state || !consumed.ok) {
    return Response.redirect(lib_auth.auth_error_url(next, 'Invalid or expired OAuth state'), 302);
  }

  const token_result = await lib_auth.exchange_github_code(code);
  if ('error' in token_result) {
    return Response.redirect(lib_auth.auth_error_url(next, token_result.error), 302);
  }

  const user_result = await lib_auth.fetch_github_login(token_result.access_token);
  if ('error' in user_result) {
    return Response.redirect(lib_auth.auth_error_url(next, user_result.error), 302);
  }

  const is_staff = lib_auth.is_staff_login(user_result.login);
  const session_token = await lib_auth.issue_session(user_result.login, token_result.access_token);
  return Response.redirect(
    lib_auth.auth_callback_url(next, session_token, user_result.login, is_staff),
    302
  );
}
