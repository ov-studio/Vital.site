import * as config_site from '@/configs/site';

const UA = 'Vital.site/1.0';
const GH = 'https://api.github.com';

type GhJson = Record<string, unknown>;

async function gh<T = GhJson>(
  token: string,
  path: string,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T; text: string }> {
  const res = await fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': UA,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  let data = {} as T;
  try { data = text ? JSON.parse(text) as T : ({} as T); } catch { /* raw */ }
  return { ok: res.ok, status: res.status, data, text };
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64) || 'resource';
}

function parse_gitmodules(raw: string): Map<string, { path: string; url: string }> {
  const map = new Map<string, { path: string; url: string }>();
  let current: { path?: string; url?: string } = {};
  for (const line of raw.split(/\r?\n/)) {
    const s = line.trim();
    if (s.startsWith('[submodule')) {
      if (current.path && current.url) map.set(current.path, { path: current.path, url: current.url });
      current = {};
      continue;
    }
    const m = s.match(/^(path|url)\s*=\s*(.+)$/);
    if (m) {
      if (m[1] === 'path') current.path = m[2].trim();
      if (m[1] === 'url') current.url = m[2].trim();
    }
  }
  if (current.path && current.url) map.set(current.path, { path: current.path, url: current.url });
  return map;
}

function serialize_gitmodules(entries: { path: string; url: string }[]): string {
  const sorted = [...entries].sort((a, b) => a.path.localeCompare(b.path));
  const lines: string[] = [];
  for (const e of sorted) {
    lines.push(`[submodule "${e.path}"]`);
    lines.push(`\tpath = ${e.path}`);
    lines.push(`\turl = ${e.url}`);
  }
  return lines.length ? lines.join('\n') + '\n' : '';
}

export type PublishResult =
  | { ok: true; pr_url: string; branch: string; path: string; updated: boolean }
  | { ok: false; error: string };

/**
 * README flow, automated with the submitter's token:
 * fork Vital.vault → add submodule under resources/{slug} → open PR upstream.
 */
export async function publish_resource_pr(opts: {
  token: string;
  login: string;
  resource_repo_full: string;
  resource_repo_url: string;
  display_name: string;
  tagline?: string;
  description?: string;
  tags?: string[];
}): Promise<PublishResult> {
  const vault = config_site.info.git.vault;
  const upstream = `${vault.user}/${vault.repo}`;
  const branch_main = vault.branch || 'main';
  const login = opts.login.toLowerCase();

  const repo = await gh<{
    default_branch?: string;
    private?: boolean;
    owner?: { login?: string };
    html_url?: string;
  }>(opts.token, `/repos/${opts.resource_repo_full}`);
  if (!repo.ok) return { ok: false, error: 'Resource repository not found or not accessible' };
  if (repo.data.private) return { ok: false, error: 'Only public repositories can be submitted' };
  if (repo.data.owner?.login?.toLowerCase() !== login) {
    return { ok: false, error: 'You must own the repository' };
  }

  const def_branch = repo.data.default_branch || 'main';

  // Prefer commits API (clearer empty-repo errors), fall back to git ref
  let resource_sha: string | undefined;
  const tip = await gh<{ sha?: string; message?: string }>(
    opts.token,
    `/repos/${opts.resource_repo_full}/commits/${encodeURIComponent(def_branch)}`
  );
  if (tip.ok && tip.data.sha) {
    resource_sha = tip.data.sha;
  }
  else {
    const ref = await gh<{ object?: { sha?: string }; message?: string }>(
      opts.token,
      `/repos/${opts.resource_repo_full}/git/ref/heads/${encodeURIComponent(def_branch)}`
    );
    resource_sha = ref.data.object?.sha;
    if (!resource_sha) {
      const msg = (tip.data.message || ref.data.message || tip.text || '').toLowerCase();
      if (tip.status === 409 || ref.status === 409 || msg.includes('empty')) {
        return {
          ok: false,
          error: 'Repository is empty — push at least one commit before submitting'
        };
      }
      return {
        ok: false,
        error: `Could not resolve resource commit on branch "${def_branch}"`
      };
    }
  }

  const slug = slugify(opts.display_name || opts.resource_repo_full.split('/')[1] || 'resource');
  const sub_path = `resources/${slug}`;
  const sub_url_clean = opts.resource_repo_url.replace(/\.git$/, '');

  // Fork (idempotent)
  let fork_full = `${login}/${vault.repo}`;
  const existing = await gh(opts.token, `/repos/${fork_full}`);
  if (!existing.ok) {
    const fork = await gh<{ full_name?: string }>(opts.token, `/repos/${upstream}/forks`, {
      method: 'POST',
      body: JSON.stringify({})
    });
    if (!fork.ok) {
      return { ok: false, error: `Could not fork ${upstream} (HTTP ${fork.status}). Check OAuth scopes.` };
    }
    if (fork.data.full_name) fork_full = fork.data.full_name;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const check = await gh(opts.token, `/repos/${fork_full}`);
      if (check.ok) break;
      if (i === 9) return { ok: false, error: 'Fork is still provisioning — try again in a moment' };
    }
  }

  const up_ref = await gh<{ object?: { sha?: string } }>(
    opts.token,
    `/repos/${upstream}/git/ref/heads/${encodeURIComponent(branch_main)}`
  );
  const upstream_sha = up_ref.data.object?.sha;
  if (!upstream_sha) return { ok: false, error: 'Could not resolve upstream vault commit' };

  const up_commit = await gh<{ tree?: { sha?: string } }>(
    opts.token,
    `/repos/${upstream}/git/commits/${upstream_sha}`
  );
  const base_tree = up_commit.data.tree?.sha;
  if (!up_commit.ok || !base_tree) return { ok: false, error: 'Could not resolve upstream vault tree' };

  // Sync fork main → upstream tip so parent/tree objects exist on the fork
  const sync = await gh(opts.token, `/repos/${fork_full}/git/refs/heads/${encodeURIComponent(branch_main)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: upstream_sha, force: true })
  });
  if (!sync.ok) {
    await gh(opts.token, `/repos/${fork_full}/merge-upstream`, {
      method: 'POST',
      body: JSON.stringify({ branch: branch_main })
    });
  }

  const fork_tip = await gh<{ object?: { sha?: string } }>(
    opts.token,
    `/repos/${fork_full}/git/ref/heads/${encodeURIComponent(branch_main)}`
  );
  let parent_sha = fork_tip.data.object?.sha || upstream_sha;

  const parent_commit = await gh<{ tree?: { sha?: string } }>(
    opts.token,
    `/repos/${fork_full}/git/commits/${parent_sha}`
  );
  let fork_base_tree = parent_commit.data.tree?.sha || base_tree;

  let gitmodules = '';
  const gm = await gh<{ content?: string }>(
    opts.token,
    `/repos/${upstream}/contents/.gitmodules?ref=${encodeURIComponent(branch_main)}`
  );
  if (gm.ok && gm.data.content) {
    gitmodules = Buffer.from(gm.data.content, 'base64').toString('utf8');
  }

  const entries = parse_gitmodules(gitmodules);
  let is_update = false;
  let target_path = sub_path;

  const norm = (u: string) =>
    u.replace(/\.git$/i, '').replace(/\/$/, '').toLowerCase().replace(/^git@github\.com:/, 'https://github.com/');

  for (const e of entries.values()) {
    if (norm(e.url) === norm(sub_url_clean)) {
      is_update = true;
      target_path = e.path;
      break;
    }
  }

  if (!is_update && entries.has(sub_path)) {
    return { ok: false, error: `Path ${sub_path} is already used by another repository` };
  }

  if (!is_update) {
    entries.set(sub_path, { path: sub_path, url: sub_url_clean });
  }

  const tree_items: { path: string; mode: string; type: string; sha: string }[] = [
    { path: target_path, mode: '160000', type: 'commit', sha: resource_sha }
  ];

  if (!is_update) {
    const gm_body = serialize_gitmodules([...entries.values()]);
    const blob = await gh<{ sha?: string }>(opts.token, `/repos/${fork_full}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: gm_body, encoding: 'utf-8' })
    });
    if (!blob.ok || !blob.data.sha) {
      return { ok: false, error: `Failed to write .gitmodules on fork (HTTP ${blob.status}): ${blob.text.slice(0, 160)}` };
    }
    tree_items.unshift({ path: '.gitmodules', mode: '100644', type: 'blob', sha: blob.data.sha });
  }

  const tree = await gh<{ sha?: string }>(opts.token, `/repos/${fork_full}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: fork_base_tree,
      tree: tree_items
    })
  });
  if (!tree.ok || !tree.data.sha) {
    return { ok: false, error: `Failed to create git tree (HTTP ${tree.status}): ${tree.text.slice(0, 180)}` };
  }

  const commit = await gh<{ sha?: string }>(opts.token, `/repos/${fork_full}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `${is_update ? 'update' : 'add'}: resource ${target_path.replace(/^resources\//, '') || slug}`,
      tree: tree.data.sha,
      parents: [parent_sha]
    })
  });
  if (!commit.ok || !commit.data.sha) {
    return { ok: false, error: `Failed to create commit (HTTP ${commit.status}): ${commit.text.slice(0, 180)}` };
  }

  const short = commit.data.sha.slice(0, 7);
  const leaf = (target_path.replace(/^resources\//, '') || slug).replace(/[^a-z0-9._-]+/gi, '-');
  const branch = `${is_update ? 'vault-update' : 'vault-add'}-${leaf}-${short}`.slice(0, 60);

  const cr = await gh(opts.token, `/repos/${fork_full}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha: commit.data.sha
    })
  });
  if (!cr.ok) {
    const upd = await gh(opts.token, `/repos/${fork_full}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.data.sha, force: true })
    });
    if (!upd.ok) {
      return {
        ok: false,
        error: `Failed to set branch ${branch} on ${fork_full} (HTTP ${cr.status}): ${cr.text.slice(0, 220)}`
      };
    }
  }

  const pr_body = [
    (is_update ? '## Update resource: ' : '## Add resource: ') + opts.display_name,
    '',
    '**Repository:** [' + opts.resource_repo_full + '](' + sub_url_clean + ')',
    '**Submodule path:** `' + target_path + '`',
    '',
    'Metadata (name, tags, description, banner) is read from `manifest.yaml` by the vault build workflow.',
    '',
    '---',
    '_Opened automatically via Vital.site — mirrors the README submodule flow._'
  ].join('\n');

  const pr = await gh<{ html_url?: string }>(opts.token, `/repos/${upstream}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: `${is_update ? 'update' : 'add'}: resource ${target_path.replace(/^resources\//, '') || slug}`,
      head: `${login}:${branch}`,
      base: branch_main,
      body: pr_body
    })
  });

  if (!pr.ok || !pr.data.html_url) {
    return {
      ok: false,
      error: `Branch pushed but PR failed (HTTP ${pr.status}): ${pr.text.slice(0, 220)}`
    };
  }

  return { ok: true, pr_url: pr.data.html_url, branch, path: target_path, updated: is_update };
}
