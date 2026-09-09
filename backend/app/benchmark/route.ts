import * as config_site   from '@/configs/site';
import * as lib_api_cache from '@/lib/api_cache';

const RELEASES_URL = `https://api.github.com/repos/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/releases?per_page=15`;

interface BenchmarkInfo {
  tag:          string;
  published_at: string | null;
  asset_url:    string | null;
  data:         Record<string, unknown> | null;
}

const EMPTY_INFO: BenchmarkInfo = {
  tag:          '',
  published_at: null,
  asset_url:    null,
  data:         null
};

async function fetch_fresh(): Promise<BenchmarkInfo> {
  const list_res = await fetch(RELEASES_URL, {
    cache:   'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!list_res.ok) throw new Error(`GitHub responded ${list_res.status}`);

  const releases = await list_res.json();
  if (!Array.isArray(releases) || releases.length === 0) return EMPTY_INFO;

  const release = releases.find((r: { assets?: { name: string }[] }) =>
    (r.assets ?? []).some((a) => a.name.toLowerCase() === 'benchmark.json')
  );
  if (!release) return EMPTY_INFO;

  const assets: { name: string; browser_download_url: string; size: number }[] = release.assets ?? [];
  const asset = assets.find((a) => a.name.toLowerCase() === 'benchmark.json');
  if (!asset) return EMPTY_INFO;

  const file_res = await fetch(asset.browser_download_url, {
    cache:   'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!file_res.ok) throw new Error(`GitHub responded ${file_res.status}`);

  const data = await file_res.json();
  if (!data || typeof data !== 'object' || Array.isArray(data)) return EMPTY_INFO;

  return {
    tag:          release.tag_name ?? '',
    published_at: release.published_at ?? null,
    asset_url:    asset.browser_download_url,
    data
  };
}

const cached_GET = lib_api_cache.create_cached_route<BenchmarkInfo>({
  label:          'Benchmark',
  fetch_fresh,
  fallback_error: 'Failed to load benchmark data'
});

export async function GET() {
  return cached_GET();
}
