
import * as config_site from '@/configs/site';

const RAW_URL = `https://raw.githubusercontent.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/main/vault.json`;

interface CacheEntry {
  data: unknown;
  fetched_at: number;
}

let cache: CacheEntry | null = null;

export async function GET() {
  const now = Date.now();

  // Serve from cache if still fresh
  if (cache && now - cache.fetched_at < config_site.info.api.cache_ttl_ms) {
    return Response.json(cache.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Vault-Cache': 'HIT',
      },
    });
  }

  // Fetch fresh from GitHub
  try {
    const res = await fetch(RAW_URL, {
      cache: 'no-store',
      headers: { 'User-Agent': 'Vital.site/1.0' },
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const data = await res.json();
    cache = { data, fetched_at: now };
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Vault-Cache': 'MISS',
      },
    });
  } 
  catch (err) {
    if (cache) {
      console.error('[api/vault] fetch failed, serving stale cache:', err);
      return Response.json(cache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=30',
          'X-Vault-Cache': 'STALE',
        },
      });
    }

    console.error('[api/vault] fetch failed, no cache available:', err);
    return Response.json(
      { error: 'Failed to load vault data' },
      { status: 502 }
    );
  }
}