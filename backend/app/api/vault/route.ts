import * as config_site   from '@/shared/configs/site';
import * as lib_api_cache from '@/lib/api_cache';
import * as lib_ratelimit from '@/lib/ratelimit';

const RAW_URL = `https://raw.githubusercontent.com/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/main/vault.json`;

async function fetch_fresh(): Promise<unknown> {
  const res = await fetch(RAW_URL, {
    cache:   'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

  return res.json();
}

const cached_GET = lib_api_cache.create_cached_route<unknown>({
  label:          'Vault',
  fetch_fresh,
  fallback_error: 'Failed to load vault data'
});

export async function GET(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  
  return cached_GET();
}
