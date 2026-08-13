import * as config_site from '@/configs/site';
import * as api_cache from '@/lib/api_cache';

export interface StatsInfo {
  stars:   number;
  forks:   number;
  issues:  number;
  commits: number;
}

const EMPTY_STATS: StatsInfo = { stars: 0, forks: 0, issues: 0, commits: 0 };

async function get_commit_count(user: string, repo: string): Promise<number> {
  const res = await fetch(`https://api.github.com/repos/${user}/${repo}/commits?per_page=1`, {
    cache:   'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!res.ok) return 0;

  const link = res.headers.get('link') ?? '';
  const match = link.match(/page=(\d+)>; rel="last"/);
  if (match) return parseInt(match[1]);

  const commits = await res.json();
  return Array.isArray(commits) ? commits.length : 0;
}

async function fetch_fresh(): Promise<StatsInfo> {
  const repos = Object.values(config_site.info.git);
  const per_repo = await Promise.all(
    repos.map(async ({ user, repo }) => {
      try {
        const [repo_res, commits] = await Promise.all([
          fetch(`https://api.github.com/repos/${user}/${repo}`, {
            cache:   'no-store',
            headers: config_site.info.api.github_headers
          }),
          get_commit_count(user, repo),
        ]);

        if (!repo_res.ok) throw new Error(`GitHub responded ${repo_res.status}`);
        const data = await repo_res.json();

        return {
          stars:   data.stargazers_count  ?? 0,
          forks:   data.forks_count       ?? 0,
          issues:  data.open_issues_count ?? 0,
          commits,
        };
      }
      catch (err) {
        console.error(`[Stats] failed for ${repo}:`, err);
        return EMPTY_STATS;
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
    { ...EMPTY_STATS }
  );
}

export const GET = api_cache.create_cached_route<StatsInfo>({
  label:         'Stats',
  ttl_ms:        config_site.info.api.cache_ttl_ms * 12,
  fetch_fresh,
  fallback_data: EMPTY_STATS
});