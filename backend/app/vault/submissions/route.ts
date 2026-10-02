import * as config_site       from '@/configs/site';
import * as lib_auth          from '@/lib/auth';
import * as lib_github_app    from '@/lib/github_app';
import * as lib_ratelimit     from '@/lib/ratelimit';
import * as lib_vault_publish from '@/lib/vault_publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

type GhPr = {
  number: number;
  title: string;
  html_url: string;
  user?: { login?: string };
  created_at: string;
  body?: string | null;
  merged_at?: string | null;
  state?: string;
};

async function gh(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Vital.site/1.0',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  let data: unknown = {};
  try { data = text ? JSON.parse(text) : {}; } catch { /* */ }
  return { ok: res.ok, status: res.status, data, text };
}

function parse_resource(title: string, body?: string | null) {
  const body_name = body?.match(/^##\s*(?:Add|Update|Remove)\s+resource:\s*(.+)$/im)?.[1]?.trim();
  const title_slug = title.match(/^(?:add|update|remove):\s*resource\s+(.+)$/i)?.[1]?.trim();
  const name = (body_name || title_slug || title).trim();
  const repo = body?.match(/\*\*Repository:\*\*\s*\[([^\]]+)\]/)?.[1]
    || body?.match(/Repository:\s*\[([^\]]+)\]/)?.[1]
    || body?.match(/github\.com\/([\w.-]+\/[\w.-]+)/)?.[1];
  const path = body?.match(/Submodule path:\s*`?([^`\s]+)`?/)?.[1];
  const submitted_by = body?.match(/\*\*Submitted by:\*\*\s*@([\w-]+)/i)?.[1]?.toLowerCase();
  return { name, repo_full: repo, path, submitted_by };
}

function map_pr(pr: GhPr) {
  const meta = parse_resource(pr.title, pr.body);
  const kind = /^(remove):/i.test(pr.title) ? 'remove'
    : /^(update):/i.test(pr.title) ? 'update' : 'add';
  const login = (meta.submitted_by || pr.user?.login || '').toLowerCase();
  return {
    id: String(pr.number),
    login,
    repo_full: meta.repo_full || '',
    repo_url: meta.repo_full ? `https://github.com/${meta.repo_full}` : pr.html_url,
    name: meta.name,
    path: meta.path || '',
    kind,
    status: pr.merged_at ? 'merged' : pr.state === 'closed' ? 'closed' : 'pending',
    createdAt: new Date(pr.created_at).getTime(),
    pr_url: pr.html_url
  };
}

async function manifest_name(token: string, repo_full: string): Promise<string | null> {
  for (const file of ['manifest.yaml', 'manifest.yml']) {
    const res = await gh(token, `/repos/${repo_full}/contents/${file}`);
    if (!res.ok) continue;
    const content = (res.data as { content?: string }).content;
    if (!content) continue;
    try {
      const raw = Buffer.from(content, 'base64').toString('utf8');
      const m =
        raw.match(/^[ \t]*name:[ \t]*["']([^"']+)["']/m) ||
        raw.match(/^[ \t]*name:[ \t]*([^\n#]+)/m);
      if (m?.[1]?.trim()) return m[1].trim();
    } catch { /* */ }
  }
  return null;
}

export async function GET(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured()) {
    return Response.json({ error: 'Unavailable' }, { status: 503 });
  }
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!session.staff) return Response.json({ error: 'forbidden' }, { status: 403 });

  const token = await lib_github_app.vault_write_token();
  if (!token) {
    return Response.json(
      { error: 'GitHub App not configured (GITHUB_APP_ID / INSTALLATION_ID / PRIVATE_KEY)' },
      { status: 503 }
    );
  }

  const vault = config_site.info.git.vault;
  const repo = `${vault.user}/${vault.repo}`;

  const [open_res, vault_json_res] = await Promise.all([
    gh(token, `/repos/${repo}/pulls?state=open&per_page=50`),
    fetch(
      `https://raw.githubusercontent.com/${vault.user}/${vault.repo}/${vault.branch || 'main'}/vault.json`,
      { headers: { 'User-Agent': 'Vital.site/1.0', Accept: 'application/json' }, cache: 'no-store' }
    )
  ]);

  const open_prs = (Array.isArray(open_res.data) ? open_res.data : []) as GhPr[];
  const is_resource_pr = (t: string) => /^(add|update|remove):\s*resource\s+/i.test(t);

  const pending_raw = open_prs.filter((pr) => is_resource_pr(pr.title)).map(map_pr);
  const pending = await Promise.all(
    pending_raw.map(async (row) => {
      if (!row.repo_full) return row;
      const looks_slug = !row.name.includes(' ') && row.name === row.name.toLowerCase();
      if (!looks_slug) return row;
      const from_manifest = await manifest_name(token, row.repo_full);
      return from_manifest ? { ...row, name: from_manifest } : row;
    })
  );

  let published: {
    id: string;
    name: string;
    author: string;
    path: string;
    source_url?: string;
    version?: string;
    is_submodule?: boolean;
  }[] = [];

  if (vault_json_res.ok) {
    try {
      const vj = await vault_json_res.json() as {
        resources?: {
          id?: string;
          name?: string;
          author?: string;
          source_url?: string;
          version?: string;
          is_submodule?: boolean;
        }[];
      };
      published = (vj.resources || [])
        .map((r) => ({
          id: r.id || '',
          name: r.name || r.id || '',
          author: r.author || '',
          path: `resources/${r.id}`,
          source_url: r.source_url,
          version: r.version,
          is_submodule: Boolean(r.is_submodule)
        }))
        .filter((r) => r.id);
    }
    catch { /* */ }
  }

  return Response.json({ pending, published });
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;
  if (!lib_auth.auth_configured()) {
    return Response.json({ error: 'Unavailable' }, { status: 503 });
  }
  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!session.staff) return Response.json({ error: 'forbidden' }, { status: 403 });

  const token = await lib_github_app.vault_write_token();
  if (!token) {
    return Response.json({
      error: 'missing_token',
      message: 'Configure GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY'
    }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const action = typeof body?.action === 'string' ? body.action : '';
  const vault = config_site.info.git.vault;
  const repo = `${vault.user}/${vault.repo}`;

  if (action === 'remove') {
    const path = typeof body?.path === 'string' ? body.path : '';
    if (!path) return Response.json({ error: 'path required' }, { status: 400 });
    const result = await lib_vault_publish.remove_resource_pr({
      token,
      path,
      actor: session.login
    });
    if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
    return Response.json({ ok: true, pr_url: result.pr_url, path: result.path });
  }

  const id = typeof body?.id === 'string' ? body.id : '';
  const decision = body?.decision === 'approved' || body?.decision === 'rejected' ? body.decision : null;
  const pr_number = Number(id);
  if (!pr_number || !decision) {
    return Response.json({ error: 'id (PR number) and decision required' }, { status: 400 });
  }

  if (decision === 'approved') {
    const merge = await gh(token, `/repos/${repo}/pulls/${pr_number}/merge`, {
      method: 'PUT',
      body: JSON.stringify({ merge_method: 'merge' })
    });
    if (!merge.ok) {
      const msg = String((merge.data as { message?: string })?.message || merge.text).slice(0, 220);
      if (merge.status !== 405 && !/already merged/i.test(msg)) {
        return Response.json({ error: `Could not merge PR #${pr_number}: ${msg}` }, { status: 400 });
      }
    }
  }
  else {
    const close = await gh(token, `/repos/${repo}/pulls/${pr_number}`, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'closed' })
    });
    if (!close.ok) {
      const msg = String((close.data as { message?: string })?.message || close.text).slice(0, 160);
      return Response.json({ error: `Could not close PR #${pr_number}: ${msg}` }, { status: 400 });
    }
  }

  return Response.json({
    ok: true,
    merged: decision === 'approved',
    closed: decision === 'rejected',
    pr: pr_number
  });
}
