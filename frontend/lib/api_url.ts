const LOCAL_API_BASE = 'http://localhost:3001';

function resolve_api_base(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') {
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
    return host ? `https://api.${host}` : LOCAL_API_BASE;
  }
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return LOCAL_API_BASE;
  return `https://api.${host}`;
}

const API_BASE = resolve_api_base();

export function api_url(path: string): string {
  return `${API_BASE}${path}`;
}
