import * as config_site   from '@/shared/configs/site';
import * as lib_api_cache from '@/lib/api_cache';
import * as lib_ratelimit from '@/lib/ratelimit';

const TREE_URL = `https://api.github.com/repos/${config_site.info.git.vault.user}/${config_site.info.git.vault.repo}/git/trees/main?recursive=1`;

interface TreeEntry {
  path: string;
  type: string;
}

interface TreeInfo {
  tree: TreeEntry[];
}

async function fetch_fresh(): Promise<TreeInfo> {
  const res = await fetch(TREE_URL, {
    cache:   'no-store',
    headers: config_site.info.api.github_headers
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

  const data = await res.json();
  const tree: TreeEntry[] = Array.isArray(data.tree)
    ? data.tree.map((i: TreeEntry) => ({ path: i.path, type: i.type }))
    : [];

  return { tree };
}

const cached_GET = lib_api_cache.create_cached_route<TreeInfo>({
  label:          'VaultTree',
  fetch_fresh,
  fallback_error: 'Failed to load vault tree'
});

export async function GET(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;

  return cached_GET();
}
