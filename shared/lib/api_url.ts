const LOCAL_FRONTEND_URL = 'http://localhost:3000';
const LOCAL_BACKEND_URL  = 'http://localhost:3001';

function vercel_host(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL
  );
}

function base_domain(): string | undefined {
  const host = vercel_host();
  if (!host || host === 'localhost' || host === '127.0.0.1') return undefined;
  return host.replace(/^api\./, '');
}

/** Frontend origin, e.g. https://vital-sandbox.com or http://localhost:3000 */
export function get_frontend_url(): string {
  const domain = base_domain();
  return domain ? `https://${domain}` : LOCAL_FRONTEND_URL;
}

/** Backend origin, e.g. https://api.vital-sandbox.com or http://localhost:3001 */
export function get_backend_url(): string {
  const domain = base_domain();
  return domain ? `https://api.${domain}` : LOCAL_BACKEND_URL;
}

/** Absolute API URL: get_backend_url() + path */
export function get_api_url(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${get_backend_url()}${p}`;
}

/** Hostname only from frontend URL */
export function get_frontend_host(): string {
  try {
    return new URL(get_frontend_url()).hostname;
  } catch {
    return 'localhost';
  }
}

/** Absolute frontend path: get_frontend_url() + path */
export function frontend_path(path: string): string {
  const base = get_frontend_url().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
