import * as config_site from '@/configs/site';

export interface StatsInfo {
  stars:   number;
  forks:   number;
  issues:  number;
  commits: number;
}

interface CacheEntry {
  data:       StatsInfo;
  fetched_at: number;
}

let cache: CacheEntry | null = null;

async function get_commit_count(user: string, repo: string): Promise<number> {
  const res = await fetch(`https://api.github.com/repos/${user}/${repo}/commits?per_page=1`, {
    cache: 'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!res.ok) return 0;

  const link = res.headers.get('link') ?? '';
  const match = link.match(/page=(\d+)>; rel="last"/);
  if (match) return parseInt(match[1]);

  const commits = await res.json();
  return Array.isArray(commits) ? commits.length : 0;
}

async function fetch_fresh_stats(): Promise<StatsInfo> {
  const repos = Object.values(config_site.info.git);
  const per_repo = await Promise.all(
    repos.map(async ({ user, repo }) => {
      try {
        const [repoRes, commits] = await Promise.all([
          fetch(`https://api.github.com/repos/${user}/${repo}`, {
            cache: 'no-store',
            headers: config_site.info.api.github_headers
          }),
          get_commit_count(user, repo),
        ]);

        if (!repoRes.ok) throw new Error(`GitHub responded ${repoRes.status}`);
        const data = await repoRes.json();

        return {
          stars:   data.stargazers_count  ?? 0,
          forks:   data.forks_count       ?? 0,
          issues:  data.open_issues_count ?? 0,
          commits,
        };
      }
      catch (err) {
        console.error(`[stats] failed for ${repo}:`, err);
        return { stars: 0, forks: 0, issues: 0, commits: 0 };
      }
    })
  );

  return per_repo.reduce(
    (total, r) => ({
      stars:   total.stars   + r.stars,
      forks:   total.forks   + r.forks,
      issues:  total.issues  + r.issues,
      commits: total.commits + r.commits
    }),
    { stars: 0, forks: 0, issues: 0, commits: 0 }
  );
}

export async function GET() {
  const now = Date.now();

  // Serve from cache if still fresh
  if (cache && now - cache.fetched_at < ttl_ms) {
    return Response.json(cache.data, {
      headers: { 
        'Cache-Control': `public, s-maxage=${ttl_s}, stale-while-revalidate=${Math.floor(ttl_s/6)}`
      }
    });
  }

  // Fetch fresh from GitHub
  try {
    const data = await fetch_fresh_stats();
    cache = { data, fetched_at: now };
    return Response.json(data, {
      headers: { 
        'Cache-Control': `public, s-maxage=${ttl_s}, stale-while-revalidate=${Math.floor(ttl_s/6)}`
      }
    });
  }
  catch (err) {
    if (cache) {
      console.error('[stats] fetch failed, serving stale cache:', err);
      return Response.json(cache.data, {
        headers: { 
          'Cache-Control': `public, s-maxage=${Math.floor(ttl_s/2)}`
        }
      });
    }

    console.error('[stats] fetch failed, no cache available:', err);
    return Response.json(
      { stars: 0, forks: 0, issues: 0, commits: 0 },
      { status: 502 }
    );
  }
}
