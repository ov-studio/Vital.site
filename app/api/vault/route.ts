import * as config_site from '@/configs/site';

const RAW_URL = `https://raw.githubusercontent.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/main/vault.json`;

interface CacheEntry {
  data:       unknown;
  fetched_at: number;
}

let cache: CacheEntry | null = null;

export async function GET() {
  const now    = Date.now();
  const ttl_ms = config_site.info.api.cache_ttl_ms;
  const ttl_s  = Math.floor(ttl_ms/1000);

  // Serve from cache if still fresh
  if (cache && now - cache.fetched_at < ttl_ms) {
    return Response.json(cache.data, {
      headers: {
        'Cache-Control': `public, s-maxage=${ttl_s}, stale-while-revalidate=${ttl_s*5}`,
        'X-Vault-Cache': 'HIT'
      }
    });
  }

  // Fetch fresh from GitHub
  try {
    const res = await fetch(RAW_URL, {
      cache: 'no-store',
      headers: config_site.info.api.github_headers
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const data = await res.json();
    cache = { data, fetched_at: now };
    return Response.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${ttl_s}, stale-while-revalidate=${ttl_s*5}`,
        'X-Vault-Cache': 'MISS'
      }
    });
  }
  catch (err) {
    if (cache) {
      console.error('[api/vault] fetch failed, serving stale cache:', err);
      return Response.json(cache.data, {
        headers: {
          'Cache-Control': `public, s-maxage=${Math.floor(ttl_s/2)}`,
          'X-Vault-Cache': 'STALE'
        }
      });
    }

    console.error('[api/vault] fetch failed, no cache available:', err);
    return Response.json(
      { error: 'Failed to load vault data' },
      { status: 502 }
    );
  }
}
