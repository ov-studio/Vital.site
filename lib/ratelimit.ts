import * as config_site     from '@/configs/site';
import * as lib_redis       from '@/lib/redis';
import * as upstash_ratelimit from '@upstash/ratelimit';

const ratelimit = new upstash_ratelimit.Ratelimit({
  redis:   lib_redis.redis,
  prefix: 'api:ratelimit',
  limiter: upstash_ratelimit.Ratelimit.slidingWindow(
    config_site.info.ratelimit.requests_per_window,
    config_site.info.ratelimit.window as upstash_ratelimit.Duration
  )
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