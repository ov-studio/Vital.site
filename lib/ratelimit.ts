import * as lib_redis         from '@/lib/redis';
import * as upstash_ratelimit from '@upstash/ratelimit';

// 30 requests per minute per IP — shared across all public API routes. // TODO: Integrate w config 
const ratelimit = new upstash_ratelimit.Ratelimit({
  redis:  lib_redis.redis,
  limiter: upstash_ratelimit.Ratelimit.slidingWindow(30, '1 m'),
  prefix: 'api:ratelimit'
});

export function get_ip(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

export async function check(req: Request): Promise<Response | null> {
  const ip = get_ip(req);
  const { success } = await ratelimit.limit(ip);
  if (!success) return new Response('rate limited', { status: 429 });
  return null;
}