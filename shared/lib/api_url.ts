const LOCAL_FRONTEND_URL = 'http://localhost:3000';
const LOCAL_BACKEND_URL  = 'http://localhost:3001';

/** Deployment host from the Vercel environment variables, if any. */
function vercel_host(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL
  );
}

/** Public base domain (host without the "api." prefix); undefined on localhost or when unset. */
function base_domain(): string | undefined {
  const host = vercel_host();
  if (!host || host === 'localhost' || host === '127.0.0.1') return undefined;
  return host.replace(/^api\./, '');
}

/** Hostname of a URL, or `fallback` when it does not parse. */
function host_of(url: string, fallback = 'localhost'): string {
  try {
    return new URL(url).hostname;
  }
  catch {
    return fallback;
  }
}

/** Join a base URL and a path with exactly one slash between them. */
function with_path(base: string, path: string): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

/** Frontend origin, e.g. https://vital-sandbox.com or http://localhost:3000 */
export function get_frontend_url(): string {
  const domain = base_domain();
  return domain ? `https://${domain}` : LOCAL_FRONTEND_URL;
}

/** Hostname only from frontend URL */
export function get_frontend_host(): string {
  return host_of(get_frontend_url());
}

/** Backend origin, e.g. https://api.vital-sandbox.com or http://localhost:3001 */
export function get_backend_url(): string {
  const domain = base_domain();
  return domain ? `https://api.${domain}` : LOCAL_BACKEND_URL;
}

/** Absolute API URL: get_backend_url() + path */
export function get_api_url(path: string): string {
  return with_path(get_backend_url(), path);
}

/** Absolute page URL: get_frontend_url() + path */
export function get_page_url(path: string): string {
  return with_path(get_frontend_url(), path);
}
