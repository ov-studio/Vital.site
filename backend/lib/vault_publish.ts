import * as config_site from '@/configs/site';
import * as lib_api_url from '@/lib/api_url';

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

/** Result of opening a vault submodule PR (success URL or error). */
export type PublishResult =
  | { ok: true; pr_url: string; branch: string; path: string; updated: boolean }
  | { ok: false; error: string };

/**
 * Open a submodule add/update PR on Vital.vault using an installation token
 * (branch on upstream — no user fork required).
 */
export async function publish_resource_pr(opts: {
  token:              string;
  login:              string;
  resource_repo_full: string;
  resource_repo_url:  string;
  display_name:       string;
}): Promise<PublishResult> {
  const vault = config_site.info.git.vault;
  const upstream = `${vault.user}/${vault.repo}`;
  const branch_main = vault.branch || 'main';
  const login = opts.login.toLowerCase();

  // Resource tip (public repo — readable with app token)
  const repo = await gh<{ default_branch?: string; private?: boolean }>(
    opts.token,
    `/repos/${opts.resource_repo_full}`
  );
  if (!repo.ok) return { ok: false, error: 'Resource repository not found or not accessible' };
  if (repo.data.private) return { ok: false, error: 'Only public repositories can be submitted' };

  const def_branch = repo.data.default_branch || 'main';
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
        return { ok: false, error: 'Repository is empty — push at least one commit before submitting' };
      }
      return { ok: false, error: `Could not resolve resource commit on branch "${def_branch}"` };
    }
  }

  const slug = slugify(opts.display_name || opts.resource_repo_full.split('/')[1] || 'resource');
  const sub_path = `resources/${slug}`;
  const sub_url_clean = (opts.resource_repo_url || `https://github.com/${opts.resource_repo_full}`).replace(/\.git$/, '');

  const up_ref = await gh<{ object?: { sha?: string } }>(
    opts.token,
    `/repos/${upstream}/git/ref/heads/${encodeURIComponent(branch_main)}`
  );
  const base_sha = up_ref.data.object?.sha;
  if (!base_sha) return { ok: false, error: 'Could not resolve vault main branch' };

  const up_commit = await gh<{ tree?: { sha?: string } }>(
    opts.token,
    `/repos/${upstream}/git/commits/${base_sha}`
  );
  const base_tree = up_commit.data.tree?.sha;
  if (!base_tree) return { ok: false, error: 'Could not resolve vault tree' };

  let gitmodules = '';
  const gm = await gh<{ content?: string }>(
    opts.token,
    `/repos/${upstream}/contents/.gitmodules?ref=${encodeURIComponent(branch_main)}`
  );
  if (gm.ok && gm.data.content) {
    gitmodules = Buffer.from(gm.data.content, 'base64').toString('utf8');
  }

  const entries = parse_gitmodules(gitmodules);
  const is_update = entries.has(sub_path);
  entries.set(sub_path, { path: sub_path, url: sub_url_clean });
  const gm_body = serialize_gitmodules([...entries.values()]);

  const blob = await gh<{ sha?: string }>(opts.token, `/repos/${upstream}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content: gm_body, encoding: 'utf-8' })
  });
  if (!blob.ok || !blob.data.sha) {
    return {
      ok: false,
      error: `Failed to write .gitmodules (HTTP ${blob.status}): ${blob.text.slice(0, 160)}`
    };
  }

  const tree = await gh<{ sha?: string }>(opts.token, `/repos/${upstream}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree,
      tree: [
        { path: '.gitmodules', mode: '100644', type: 'blob', sha: blob.data.sha },
        { path: sub_path, mode: '160000', type: 'commit', sha: resource_sha }
      ]
    })
  });
  if (!tree.ok || !tree.data.sha) {
    return { ok: false, error: `Failed to create tree (HTTP ${tree.status}): ${tree.text.slice(0, 160)}` };
  }

  const msg = is_update
    ? `update: resource ${slug}`
    : `add: resource ${slug}`;
  const commit = await gh<{ sha?: string }>(opts.token, `/repos/${upstream}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: msg,
      tree: tree.data.sha,
      parents: [base_sha],
      author: {
        name: 'Vital.sandbox',
        email: '41898282+github-actions[bot]@users.noreply.github.com'
      }
    })
  });
  if (!commit.ok || !commit.data.sha) {
    return { ok: false, error: `Failed to create commit (HTTP ${commit.status}): ${commit.text.slice(0, 160)}` };
  }

  const short = commit.data.sha.slice(0, 7);
  const branch = `vault-${is_update ? 'update' : 'add'}-${slug}-${short}`.slice(0, 60);

  const cr = await gh(opts.token, `/repos/${upstream}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.data.sha })
  });
  if (!cr.ok) {
    const upd = await gh(opts.token, `/repos/${upstream}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.data.sha, force: true })
    });
    if (!upd.ok) {
      return { ok: false, error: `Failed to set branch ${branch} (HTTP ${cr.status}): ${cr.text.slice(0, 160)}` };
    }
  }

  const pr_body = [
    (is_update ? '## Update resource: ' : '## Add resource: ') + opts.display_name,
    '',
    '**Repository:** [' + opts.resource_repo_full + '](' + sub_url_clean + ')',
    '**Submodule path:** `' + sub_path + '`',
    '**Submitted by:** @' + login,
    '',
    '---',
    `Opened via [/vault](${lib_api_url.get_page_url('/vault')}).`
  ].join('\n');

  const pr = await gh<{ html_url?: string }>(opts.token, `/repos/${upstream}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: `${is_update ? 'update' : 'add'}: resource ${slug}`,
      head: branch,
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

  return { ok: true, pr_url: pr.data.html_url, branch, path: sub_path, updated: is_update };
}

/** Open a PR that removes a vault submodule path. */
export async function remove_resource_pr(opts: {
  token: string;
  path:  string;
  actor: string;
}): Promise<PublishResult> {
  const vault = config_site.info.git.vault;
  const upstream = `${vault.user}/${vault.repo}`;
  const branch_main = vault.branch || 'main';
  const sub_path = opts.path.startsWith('resources/') ? opts.path : `resources/${opts.path}`;
  const leaf = sub_path.replace(/^resources\//, '');

  const up_ref = await gh<{ object?: { sha?: string } }>(
    opts.token,
    `/repos/${upstream}/git/ref/heads/${encodeURIComponent(branch_main)}`
  );
  const base_sha = up_ref.data.object?.sha;
  if (!base_sha) return { ok: false, error: 'Could not resolve vault main' };

  const up_commit = await gh<{ tree?: { sha?: string } }>(
    opts.token,
    `/repos/${upstream}/git/commits/${base_sha}`
  );
  const base_tree = up_commit.data.tree?.sha;
  if (!base_tree) return { ok: false, error: 'Could not resolve vault tree' };

  let gitmodules = '';
  const gm = await gh<{ content?: string }>(
    opts.token,
    `/repos/${upstream}/contents/.gitmodules?ref=${encodeURIComponent(branch_main)}`
  );
  if (gm.ok && gm.data.content) {
    gitmodules = Buffer.from(gm.data.content, 'base64').toString('utf8');
  }

  const entries = parse_gitmodules(gitmodules);
  if (!entries.has(sub_path)) {
    return { ok: false, error: `No submodule at ${sub_path}` };
  }
  entries.delete(sub_path);
  const gm_body = serialize_gitmodules([...entries.values()]);

  const blob = await gh<{ sha?: string }>(opts.token, `/repos/${upstream}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content: gm_body, encoding: 'utf-8' })
  });
  if (!blob.ok || !blob.data.sha) {
    return { ok: false, error: `Failed to write .gitmodules (HTTP ${blob.status})` };
  }

  const full = await gh<{ tree?: { path?: string; mode?: string; type?: string; sha?: string }[] }>(
    opts.token,
    `/repos/${upstream}/git/trees/${base_tree}?recursive=1`
  );
  if (!full.ok || !full.data.tree) {
    return { ok: false, error: 'Failed to load vault tree' };
  }
  const filtered = full.data.tree
    .filter((e) => e.type !== 'tree' && e.path !== sub_path && e.path !== '.gitmodules')
    .map((e) => ({ path: e.path!, mode: e.mode!, type: e.type!, sha: e.sha! }));
  filtered.push({ path: '.gitmodules', mode: '100644', type: 'blob', sha: blob.data.sha });

  const tree = await gh<{ sha?: string }>(opts.token, `/repos/${upstream}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ tree: filtered })
  });
  if (!tree.ok || !tree.data.sha) {
    return { ok: false, error: 'Failed to create removal tree' };
  }

  const commit = await gh<{ sha?: string }>(opts.token, `/repos/${upstream}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `remove: resource ${leaf}`,
      tree: tree.data.sha,
      parents: [base_sha]
    })
  });
  if (!commit.ok || !commit.data.sha) {
    return { ok: false, error: 'Failed to create removal commit' };
  }

  const branch = `vault-remove-${leaf}-${commit.data.sha.slice(0, 7)}`.slice(0, 60);
  const cr = await gh(opts.token, `/repos/${upstream}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.data.sha })
  });
  if (!cr.ok) {
    const upd = await gh(opts.token, `/repos/${upstream}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.data.sha, force: true })
    });
    if (!upd.ok) return { ok: false, error: `Failed to set branch ${branch}` };
  }

  const pr = await gh<{ html_url?: string }>(opts.token, `/repos/${upstream}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: `remove: resource ${leaf}`,
      head: branch,
      base: branch_main,
      body: [
        `## Remove resource: ${leaf}`,
        '',
        `**Submodule path:** \`${sub_path}\``,
        `**Requested by:** @${opts.actor}`,
        '',
        '---',
        `Opened via [/vault](${lib_api_url.get_page_url('/vault')}).`
      ].join('\n')
    })
  });
  if (!pr.ok || !pr.data.html_url) {
    return { ok: false, error: 'Removal branch created but PR failed' };
  }
  return { ok: true, pr_url: pr.data.html_url, branch, path: sub_path, updated: false };
}
