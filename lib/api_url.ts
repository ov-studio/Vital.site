const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function api_url(path: string): string {
  return `${API_BASE}${path}`;
}
