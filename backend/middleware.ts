import * as next_server from 'next/server';
import * as config_site from '@/configs/site';
import * as lib_ratelimit from '@/lib/ratelimit';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};

export async function middleware(req: next_server.NextRequest) {
  if (!config_site.info.ratelimit.routes.includes(req.nextUrl.pathname)) return next_server.NextResponse.next();
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  return next_server.NextResponse.next();
}