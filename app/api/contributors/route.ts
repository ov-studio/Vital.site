import * as config_site from '@/configs/site';
import * as api_cache from '@/lib/api_cache';

interface ContributorInfo {
  login:         string;
  avatar_url:    string;
  profile_url:   string;
  contributions: number;
  repos:         string[];
}

interface GithubContributor {
  login:         string;
  avatar_url:    string;
  html_url:      string;
  contributions: number;
  type:          string;
}

// GitHub paginates at 100/page max; walk pages until one comes back short.
async function fetch_all_pages<T>(url_base: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${url_base}${url_base.includes('?') ? '&' : '?'}per_page=100&page=${page}`, {
      cache:   'no-store',
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

async function fetch_fresh(): Promise<ContributorInfo[]> {
  const repos = Object.values(config_site.info.git);
  const per_repo = await Promise.all(
    repos.map(async ({ user, repo }) => {
      try {
        const contributors = await fetch_all_pages<GithubContributor>(`https://api.github.com/repos/${user}/${repo}/contributors`);
        return { repo, contributors };
      }
      catch (err) {
        console.error(`[Contributors] failed for ${repo}:`, err);
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

export const GET = api_cache.create_cached_route<ContributorInfo[]>({
  label:          'Contributors',
  ttl_ms:         config_site.info.api.cache_ttl_ms * 12,
  fetch_fresh,
  fallback_error: 'Failed to load contributors data'
});