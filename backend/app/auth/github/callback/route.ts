import * as lib_auth from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
  if (!lib_auth.auth_configured()) return Response.redirect(lib_auth.workspace_error_url('Auth not configured'), 302);
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauth_error = url.searchParams.get('error');

  if (oauth_error) {
    return Response.redirect(
      lib_auth.workspace_error_url(url.searchParams.get('error_description') || oauth_error),
      302
    );
  }
  if (!code || !state) return Response.redirect(lib_auth.workspace_error_url('Missing code or state'), 302);
  if (!(await lib_auth.consume_oauth_state(state))) return Response.redirect(lib_auth.workspace_error_url('Invalid or expired OAuth state'), 302);
  const token_result = await lib_auth.exchange_github_code(code);
  if ('error' in token_result) return Response.redirect(lib_auth.workspace_error_url(token_result.error), 302);
  const user_result = await lib_auth.fetch_github_login(token_result.access_token);
  if ('error' in user_result) return Response.redirect(lib_auth.workspace_error_url(user_result.error), 302);

  const is_staff = lib_auth.is_staff_login(user_result.login);
  const session_token = await lib_auth.issue_session(user_result.login);
  return Response.redirect(lib_auth.workspace_callback_url(session_token, user_result.login, is_staff), 302);
}
