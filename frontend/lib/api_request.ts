import * as lib_api_url      from '@/lib/api_url';
import * as lib_auth_session from '@/lib/auth_session';

/** Normalized result of an authenticated API call. */
export type ApiResult = {
  ok:     boolean;
  status: number;
  json:   any;
  error:  string | null;
};

/**
 * Authenticated JSON request against the API.
 * Never throws on HTTP errors; network failures reject (callers catch).
 */
export async function api_request(
  path: string,
  opts: { method?: string; body?: unknown } = {}
): Promise<ApiResult> {
  const res  = await fetch(lib_api_url.get_api_url(path), {
    method:  opts.method,
    headers: lib_auth_session.auth_headers(),
    body:    opts.body === undefined ? undefined : JSON.stringify(opts.body)
  });
  const json = await res.json().catch(() => ({}));
  return {
    ok:     res.ok,
    status: res.status,
    json,
    error:  typeof json?.error === 'string' ? json.error : null
  };
}
