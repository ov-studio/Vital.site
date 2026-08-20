import * as config_site from '@/shared/configs/site';

function cache_control(ttl_s: number): string {
  return `public, s-maxage=${ttl_s}, stale-while-revalidate=${ttl_s * config_site.info.api.cache_swr_multiplier}`;
}

function stale_cache_control(ttl_s: number): string {
  return `public, s-maxage=${Math.floor(ttl_s / config_site.info.api.cache_stale_divisor)}`;
}

interface CacheEntry<T> {
  data:       T;
  fetched_at: number;
}

export interface CachedRouteOptions<T> {
  label:            string;
  ttl_ms?:          number;
  fetch_fresh:      () => Promise<T>;
  fallback_status?: number;
  fallback_error?:  string;
  fallback_data?:   T;
}

export function create_cached_route<T>(opts: CachedRouteOptions<T>) {
  let cache: CacheEntry<T> | null = null;
  const ttl_ms = opts.ttl_ms ?? config_site.info.api.cache_ttl_ms;
  const ttl_s  = Math.floor(ttl_ms / 1000);
  const header_name = `X-${opts.label}-Cache`;

  return async function GET() {
    const now = Date.now();

    // Serve from cache if still fresh
    if (cache && now - cache.fetched_at < ttl_ms) return Response.json(cache.data, {
      headers: { 'Cache-Control': cache_control(ttl_s), [header_name]: 'HIT' }
    });

    // Fetch fresh
    try {
      const data = await opts.fetch_fresh();
      cache = { data, fetched_at: now };
      return Response.json(data, {
        headers: { 'Cache-Control': cache_control(ttl_s), [header_name]: 'MISS' }
      });
    }
    catch (err) {
      if (cache) {
        console.error(`[${opts.label}] fetch failed, serving stale cache:`, err);
        return Response.json(cache.data, {
          headers: { 'Cache-Control': stale_cache_control(ttl_s), [header_name]: 'STALE' }
        });
      }

      console.error(`[${opts.label}] fetch failed, no cache available:`, err);
      const status = opts.fallback_status ?? 502;
      return opts.fallback_data !== undefined
        ? Response.json(opts.fallback_data, { status })
        : Response.json({ error: opts.fallback_error ?? 'Failed to load data' }, { status });
    }
  };
}