import * as config_site from '@/configs/site';

interface ContributorInfo {
  login:         string;
  avatar_url:    string;
  profile_url:   string;
  contributions: number;
  repos:         string[];
}

interface CacheEntry {
  data:       ContributorInfo[];
  fetched_at: number;
}

interface GithubContributor {
  login:         string;
  avatar_url:    string;
  html_url:      string;
  contributions: number;
  type:          string;
}

let cache: CacheEntry | null = null;

// GitHub paginates at 100/page max; walk pages until one comes back short.
async function fetch_all_pages<T>(url_base: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${url_base}${url_base.includes('?') ? '&' : '?'}per_page=100&page=${page}`, {
      cache: 'no-store',
      headers: config_site.info.api.github_headers
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status} for ${url_base}`);

    const batch: T[] = await res.json();
    results.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return results;
}

async function build_contributor_list(): Promise<ContributorInfo[]> {
  const repos    = Object.values(config_site.info.git);
  const per_repo = await Promise.all(
    repos.map(async ({ user, repo }) => {
      try {
        const contributors = await fetch_all_pages<GithubContributor>(`https://api.github.com/repos/${user}/${repo}/contributors`);
        return { repo, contributors };
      }
      catch (err) {
        console.error(`[api/contributors] failed for ${repo}:`, err);
        return { repo, contributors: [] as GithubContributor[] };
      }
    })
  );

  const merged = new Map<string, ContributorInfo>();

  for (const { repo, contributors } of per_repo) {
    for (const c of contributors) {
      if (c.type === 'Bot') continue; // skip bots.

      const existing = merged.get(c.login);
      if (existing) {
        existing.contributions += c.contributions;
        existing.repos.push(repo);
      }
      else {
        merged.set(c.login, {
          login:         c.login,
          avatar_url:    c.avatar_url,
          profile_url:   c.html_url,
          contributions: c.contributions,
          repos:         [repo],
        });
      }
    }
  }
  return Array.from(merged.values()).sort((a, b) => b.contributions - a.contributions);
}

export async function GET() {
  const now    = Date.now();
  const ttl_ms = config_site.info.api.cache_ttl_ms*12;
  const ttl_s  = Math.floor(ttl_ms/1000);

  // Serve from cache if still fresh
  if (cache && now - cache.fetched_at < ttl_ms) {
    return Response.json(cache.data, {
      headers: {
        'Cache-Control':        `public, s-maxage=${ttl_s}, stale-while-revalidate=${ttl_s*5}`,
        'X-Contributors-Cache': 'HIT'
      }
    });
  }

  // Fetch fresh from GitHub
  try {
    const data = await build_contributor_list();
    cache = { data, fetched_at: now };
    return Response.json(data, {
      headers: {
        'Cache-Control':        `public, s-maxage=${ttl_s}, stale-while-revalidate=${ttl_s*5}`,
        'X-Contributors-Cache': 'MISS'
      }
    });
  }
  catch (err) {
    if (cache) {
      console.error('[api/contributors] fetch failed, serving stale cache:', err);
      return Response.json(cache.data, {
        headers: {
          'Cache-Control':        `public, s-maxage=${Math.floor(ttl_s/2)}`,
          'X-Contributors-Cache': 'STALE'
        }
      });
    }

    console.error('[api/contributors] fetch failed, no cache available:', err);
    return Response.json(
      { error: 'Failed to load contributors data' },
      { status: 502 }
    );
  }
}
