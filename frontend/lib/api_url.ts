const LOCAL_SITE_URL = 'http://localhost:3000';
const LOCAL_API_URL  = 'http://localhost:3001';

// the vercel deployment host (no protocol), preferring the stable production
// domain over the per-deployment one when both are available
function vercel_host(): string | undefined {
  return process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
}

// the frontend's own site url — reused by layout.tsx (metadataBase), and
// available for robots.ts / sitemap.ts to dedupe against too
export function get_site_url(): string {
  const host = vercel_host();
  return host ? `https://${host}` : LOCAL_SITE_URL;
}

function resolve_api_base(): string {
  // manual override always wins, e.g. for staging/preview deployments
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  // build-time / server context (static export prerender) — mirror the
  // frontend's own host so the api subdomain lines up automatically
  if (typeof window === 'undefined') {
    const host = vercel_host();
    return host ? `https://api.${host}` : LOCAL_API_URL;
  }

  // browser context — derive from the domain the page is actually served on
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return LOCAL_API_URL;

  return `https://api.${host}`;
}

const API_BASE = resolve_api_base();

export function api_url(path: string): string {
  return `${API_BASE}${path}`;
}
