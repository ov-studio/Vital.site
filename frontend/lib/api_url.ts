const LOCAL_FRONTEND_URL = 'http://localhost:3000';
const LOCAL_BACKEND_URL  = 'http://localhost:3001';

function vercel_host(): string | undefined {
  return process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
}

export function get_site_url(): string {
  const host = vercel_host();
  return host ? `https://${host}` : LOCAL_FRONTEND_URL;
}

function resolve_api_base(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') {
    const host = vercel_host();
    return host ? `https://api.${host}` : LOCAL_BACKEND_URL;
  }
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return LOCAL_BACKEND_URL;
  return `https://api.${host}`;
}

const API_BASE = resolve_api_base();

export function api_url(path: string): string {
  return `${API_BASE}${path}`;
}
