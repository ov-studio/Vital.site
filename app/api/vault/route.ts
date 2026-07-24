
import * as config_site from '@/configs/site';

const RAW_URL = `https://raw.githubusercontent.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/main/vault.json`;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: unknown;
  fetched_at: number;
}

// Module-level cache — survives across requests within the same server process.
// In a multi-instance deploy each instance has its own cache, which is fine.
let cache: CacheEntry | null = null;

export async function GET() {
  const now = Date.now();

  // Serve from cache if still fresh
  if (cache && now - cache.fetched_at < CACHE_TTL_MS) {
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
      // Tell Next.js fetch not to cache this at the framework level —
      // we manage our own cache above so we control the TTL exactly.
      cache: 'no-store',
      headers: { 'User-Agent': 'Vital.site/1.0' },
    });

    if (!res.ok) {
      throw new Error(`GitHub responded ${res.status}`);
    }

    const data = await res.json();
    cache = { data, fetched_at: now };

    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Vault-Cache': 'MISS',
      },
    });
  } catch (err) {
    // If GitHub is unreachable but we have a stale copy, serve it rather
    // than returning an error — stale data is better than nothing.
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