import * as lib_staff_auth from '@/lib/staff_auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
  if (!lib_staff_auth.staff_auth_configured()) return Response.redirect(lib_staff_auth.staff_frontend_error_url('Staff auth not configured'), 302);

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauth_error = url.searchParams.get('error');
  if (oauth_error) return Response.redirect(lib_staff_auth.staff_frontend_error_url(url.searchParams.get('error_description') || oauth_error), 302);
  if (!code || !state) return Response.redirect(lib_staff_auth.staff_frontend_error_url('Missing code or state'), 302);
  if (!(await lib_staff_auth.consume_oauth_state(state))) return Response.redirect(lib_staff_auth.staff_frontend_error_url('Invalid or expired OAuth state'), 302);
  const token_result = await lib_staff_auth.exchange_github_code(code);
  if ('error' in token_result) return Response.redirect(lib_staff_auth.staff_frontend_error_url(token_result.error), 302);
  const user_result = await lib_staff_auth.fetch_github_login(token_result.access_token);
  if ('error' in user_result) return Response.redirect(lib_staff_auth.staff_frontend_error_url(user_result.error), 302);
  if (!lib_staff_auth.is_staff_login(user_result.login)) return Response.redirect(lib_staff_auth.staff_frontend_error_url(`@${user_result.login} is not on the staff allowlist`), 302);
  
  const session_token = await lib_staff_auth.issue_staff_session(user_result.login);
  return Response.redirect(lib_staff_auth.staff_frontend_callback_url(session_token, user_result.login), 302);
}
