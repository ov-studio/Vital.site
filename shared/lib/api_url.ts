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

export function get_frontend_url(): string {
  const domain = base_domain();
  return domain ? `https://${domain}` : LOCAL_FRONTEND_URL;
}

export function get_backend_url(): string {
  const domain = base_domain();
  return domain ? `https://api.${domain}` : LOCAL_BACKEND_URL;
}

export function get_api_url(path: string): string {
  return `${get_backend_url()}${path}`;
}