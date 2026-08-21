import * as lib_ratelimit from '@/lib/ratelimit';
import * as next_server   from 'next/server';

export const config = {
  matcher: [
    '/contributors',
    '/stats',
    '/build',
    '/vault',
    '/vault/tree',
    '/masterlist'
  ]
};

export async function middleware(req: next_server.NextRequest) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  return next_server.NextResponse.next();
}