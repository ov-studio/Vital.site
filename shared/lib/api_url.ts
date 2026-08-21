const LOCAL_FRONTEND_URL = 'http://localhost:3000';
const LOCAL_BACKEND_URL  = 'http://localhost:3001';

function vercel_host(): string | undefined {
  return process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
}

function base_domain(): string | undefined {
  const host = typeof window !== 'undefined' ? window.location.hostname : vercel_host();
  if (!host || host === 'localhost' || host === '127.0.0.1') return undefined;
  return host.replace(/^api\./, '');
}

export function get_frontend_url(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const domain = base_domain();
  return domain ? `https://${domain}` : LOCAL_FRONTEND_URL;
}

export function get_backend_url(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  const domain = base_domain();
  return domain ? `https://api.${domain}` : LOCAL_BACKEND_URL;
}

export function get_api_url(path: string): string {
  return `${get_backend_url()}${path}`;
}
