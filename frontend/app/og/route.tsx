import * as fs          from 'fs';
import * as path        from 'path';
import { NextResponse } from 'next/server';

export const revalidate = false;
export const runtime = 'nodejs';

export async function GET() {
  const file = path.join(process.cwd(), 'public/og/default.png');
  if (!fs.existsSync(file)) {
    return new NextResponse(
      'Missing public/og/default.png — export from /studio (default, not placeholder)',
      { status: 404, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  const buf = fs.readFileSync(file);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000'
    }
  });
}
