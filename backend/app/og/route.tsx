import * as lib_api_url from '@/lib/api_url';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Static Open Graph images (zero ImageResponse CPU).
 *
 * Files live in frontend/public/og/ — regenerate with:
 *   node shared/generate-og.mjs
 *
 *   /og?path=/           → default.png
 *   /og?path=/roadmap    → roadmap.png
 *   unknown path         → placeholder.png
 */
const PATH_FILE: Record<string, string> = {
  '/':           'default.png',
  '/roadmap':    'roadmap.png',
  '/vault':      'vault.png',
  '/studio':     'studio.png',
  '/workspace':  'workspace.png',
  '/tos':        'tos.png',
  '/benchmarks': 'benchmarks.png',
};

export async function GET(req: Request) {
  const frontend = lib_api_url.get_frontend_url();
  const url = new URL(req.url);
  let path = url.searchParams.get('path') ?? '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  const file = PATH_FILE[path] ?? 'placeholder.png';
  const asset_url = `${frontend}/og/${file}`;

  try {
    const res = await fetch(asset_url, { cache: 'force-cache' });
    if (!res.ok) {
      return new NextResponse(`Missing /og/${file} (${res.status}). Run: node shared/generate-og.mjs`, {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control':
          'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
      },
    });
  } catch (err) {
    return new NextResponse(`Failed to load /og/${file}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
