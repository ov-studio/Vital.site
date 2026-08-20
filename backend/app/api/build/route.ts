import * as config_site   from '@/configs/site';
import * as lib_api_cache from '@/lib/api_cache';
import * as lib_ratelimit from '@/lib/ratelimit';

const RELEASES_URL = `https://api.github.com/repos/${config_site.info.git.sandbox.user}/${config_site.info.git.sandbox.repo}/releases?per_page=1`;

interface ReleaseInfo {
  tag:         string;
  client_url:  string | null;
  server_url:  string | null;
  client_size: string | null;
  server_size: string | null;
}

const EMPTY_INFO: ReleaseInfo = {
  tag:         '',
  client_url:  null,
  server_url:  null,
  client_size: null,
  server_size: null
};

const format_size = (bytes: number) => `${(bytes / (1024*1024)).toFixed(1)} MB`;

async function fetch_fresh(): Promise<ReleaseInfo> {
  const res = await fetch(RELEASES_URL, {
    cache:   'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

  const releases = await res.json();
  const release = Array.isArray(releases) ? releases[0] : null;
  if (!release) return EMPTY_INFO;

  const assets: { name: string; browser_download_url: string; size: number }[] = release.assets ?? [];
  const client = assets.find((a) => a.name.toLowerCase().includes('client') && a.name.endsWith('.zip'));
  const server = assets.find((a) => a.name.toLowerCase().includes('server') && a.name.endsWith('.zip'));

  return {
    tag:         release.tag_name ?? '',
    client_url:  client?.browser_download_url ?? null,
    server_url:  server?.browser_download_url ?? null,
    client_size: client ? format_size(client.size) : null,
    server_size: server ? format_size(server.size) : null
  };
}

const cached_GET = lib_api_cache.create_cached_route<ReleaseInfo>({
  label:          'Build',
  fetch_fresh,
  fallback_error: 'Failed to load build data'
});

export async function GET(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  
  return cached_GET();
}
