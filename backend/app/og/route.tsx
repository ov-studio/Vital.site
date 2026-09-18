import * as lib_api_url from '@/lib/api_url';
import * as next from 'next';

/**
 * Homepage Open Graph image.
 *
 * Serves the static asset exported from Brand Studio:
 *   frontend/public/cdn/og.png
 *
 * Workflow:
 *   1. Open /studio → Open Graph → Download PNG
 *   2. Save as frontend/public/cdn/og.png
 *   3. This route proxies that file with long cache headers
 */

export async function GET() {
  const frontend_url = lib_api_url.get_frontend_url();
  const res = await fetch(`${frontend_url}/cdn/og.png`, {
    // avoid stale CDN during local iteration
    cache: 'no-store',
  });

  if (!res.ok) {
    return new next.NextResponse(
      `Missing /cdn/og.png (${res.status}). Export from /studio and save to frontend/public/cdn/og.png`,
      { status: 404, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  const buf = await res.arrayBuffer();

  return new next.NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control':
        'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
