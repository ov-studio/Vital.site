import * as config_site   from '@/configs/site';
import * as lib_api_cache from '@/lib/api_cache';

const RELEASES_URL = `https://api.github.com/repos/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/releases?per_page=15`;

interface GithubAsset {
  name:                  string;
  browser_download_url:  string;
  size:                  number;
}

interface GithubRelease {
  tag_name:      string;
  published_at:  string | null;
  assets:        GithubAsset[];
}

export interface BenchmarkPayload {
  tag:           string;
  published_at:  string | null;
  asset_url:     string;
  [key: string]: unknown;
}

async function fetch_fresh(): Promise<BenchmarkPayload> {
  const list_res = await fetch(RELEASES_URL, {
    cache:   'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!list_res.ok) throw new Error(`GitHub releases responded ${list_res.status}`);

  const releases: GithubRelease[] = await list_res.json();
  if (!Array.isArray(releases) || releases.length === 0) {
    throw new Error('No releases found');
  }

  let match: { release: GithubRelease; asset: GithubAsset } | null = null;
  for (const release of releases) {
    const asset = (release.assets ?? []).find((a) => a.name.toLowerCase() === 'benchmark.json');
    if (asset) {
      match = { release, asset };
      break;
    }
  }
  if (!match) throw new Error('No release with benchmark.json found');

  const file_res = await fetch(match.asset.browser_download_url, {
    cache:   'no-store',
    headers: {
      'Accept':     'application/json',
      'User-Agent': 'Vital.site/1.0'
    }
  });
  if (!file_res.ok) throw new Error(`benchmark.json download responded ${file_res.status}`);

  const body = await file_res.json();
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('benchmark.json is not a JSON object');
  }
  return {
    tag:          match.release.tag_name ?? '',
    published_at: match.release.published_at ?? null,
    asset_url:    match.asset.browser_download_url,
    ...body
  };
}

const cached_GET = lib_api_cache.create_cached_route<BenchmarkPayload>({
  label:          'Benchmark',
  fetch_fresh,
  fallback_error: 'Failed to load benchmark data'
});

export async function GET() {
  return cached_GET();
}
