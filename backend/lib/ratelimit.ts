import * as config_site     from '@/configs/site';
import * as lib_redis       from '@/lib/redis';
import * as upstash_ratelimit from '@upstash/ratelimit';

const ratelimit = lib_redis.redis_configured
  ? new upstash_ratelimit.Ratelimit({
      redis:   lib_redis.redis!,
      prefix:  'api:ratelimit',
      limiter: upstash_ratelimit.Ratelimit.slidingWindow(
        config_site.info.ratelimit.requests_per_window,
        config_site.info.ratelimit.window as upstash_ratelimit.Duration
      )
    })
  : null;

function strip_port(address: string): string {
  if (address.startsWith('[')) {
    const closing = address.indexOf(']');
    return closing !== -1 ? address.slice(1, closing) : address;
  }
  if (address.split(':').length > 2) return address;
  const colon_index = address.indexOf(':');
  return colon_index !== -1 ? address.slice(0, colon_index) : address;
}

export function get_ip(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return strip_port(forwarded);
  const real_ip = req.headers.get('x-real-ip')?.trim();
  if (real_ip) return strip_port(real_ip);
  return 'unknown';
}

export async function check(req: Request): Promise<Response | null> {
  if (!ratelimit) return null;

  try {
    const ip = get_ip(req);
    const { success } = await ratelimit.limit(ip);
    if (!success) return Response.json({ error: 'rate limited' }, { status: 429 });
    return null;
  }
  catch (err) {
    console.error('[Ratelimit] check failed, allowing request through:', err);
    return null;
  }
}