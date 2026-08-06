import * as config_site from '@/configs/site';

const RELEASES_URL = `https://api.github.com/repos/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/releases?per_page=1`;

interface ReleaseInfo {
  tag:         string;
  client_url:  string | null;
  server_url:  string | null;
  client_size: string | null;
  server_size: string | null;
}

interface CacheEntry {
  data:       ReleaseInfo;
  fetched_at: number;
}

const EMPTY_INFO: ReleaseInfo = {
  tag:         '',
  client_url:  null,
  server_url:  null,
  client_size: null,
  server_size: null
};

let cache: CacheEntry | null = null;

const format_size = (bytes: number) => `${(bytes / (1024*1024)).toFixed(1)} MB`;

export async function GET() {
  const now    = Date.now();
  const ttl_ms = config_site.info.api.cache_ttl_ms;
  const ttl_s  = Math.floor(ttl_ms/1000);

  // Serve from cache if still fresh
  if (cache && now - cache.fetched_at < ttl_ms) {
    return Response.json(cache.data, {
      headers: {
        'Cache-Control': `public, s-maxage=${ttl_s}, stale-while-revalidate=${ttl_s*5}`,
        'X-Build-Cache': 'HIT'
      }
    });
  }

  // Fetch fresh from GitHub
  try {
    const res = await fetch(RELEASES_URL, {
      cache:  'no-store',
      headers: config_site.info.api.github_headers
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const releases = await res.json();
    const release  = Array.isArray(releases) ? releases[0] : null;
    let info: ReleaseInfo = EMPTY_INFO;

    if (release) {
      const assets: { name: string; browser_download_url: string; size: number }[] = release.assets ?? [];
      const client = assets.find((a) => a.name.toLowerCase().includes('client') && a.name.endsWith('.zip'));
      const server = assets.find((a) => a.name.toLowerCase().includes('server') && a.name.endsWith('.zip'));
      info = {
        tag:         release.tag_name ?? '',
        client_url:  client?.browser_download_url ?? null,
        server_url:  server?.browser_download_url ?? null,
        client_size: client ? format_size(client.size) : null,
        server_size: server ? format_size(server.size) : null,
      };
    }

    cache = { data: info, fetched_at: now };
    return Response.json(info, {
      headers: {
        'Cache-Control': `public, s-maxage=${ttl_s}, stale-while-revalidate=${ttl_s*5}`,
        'X-Build-Cache': 'MISS'
      }
    });
  }
  catch (err) {
    if (cache) {
      console.error('[api/build] fetch failed, serving stale cache:', err);
      return Response.json(cache.data, {
        headers: {
          'Cache-Control': `public, s-maxage=${Math.floor(ttl_s/2)}`,
          'X-Build-Cache': 'STALE'
        }
      });
    }

    console.error('[api/build] fetch failed, no cache available:', err);
    return Response.json(
      { error: 'Failed to load build data' },
      { status: 502 }
    );
  }
}
