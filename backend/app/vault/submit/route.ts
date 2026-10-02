import * as lib_auth              from '@/lib/auth';
import * as lib_ratelimit         from '@/lib/ratelimit';
import * as lib_vault_publish     from '@/lib/vault_publish';
import * as lib_github_app       from '@/lib/github_app';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

async function fetch_manifest(token: string, full_name: string): Promise<string | null> {
  for (const file of ['manifest.yaml', 'manifest.yml']) {
    const res = await fetch(
      `https://api.github.com/repos/${full_name}/contents/${file}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'Vital.site/1.0'
        }
      }
    );
    if (!res.ok) continue;
    const json = (await res.json().catch(() => null)) as { content?: string } | null;
    if (json?.content) {
      try { return Buffer.from(json.content, 'base64').toString('utf8'); }
      catch { /* */ }
    }
  }
  return null;
}

function manifest_display_name(raw: string, fallback: string): string {
  const m =
    raw.match(/^[ \t]*name:[ \t]*["']([^"']+)["']/m) ||
    raw.match(/^[ \t]*name:[ \t]*([^\n#]+)/m);
  return m?.[1]?.trim() || fallback;
}

export async function POST(req: Request) {
  const limited = await lib_ratelimit.check(req);
  if (limited) return limited;

  if (!lib_auth.auth_configured()) {
    return Response.json({ error: 'Unavailable' }, { status: 503 });
  }

  const session = await lib_auth.session_from_auth_header(req.headers.get('authorization'));
  if (!session) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const gh = await lib_auth.github_token_from_auth_header(req.headers.get('authorization'));
  if (!gh) {
    return Response.json(
      { error: 'reauth_required', message: 'Sign in again to grant repository access' },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const repo_full = typeof body?.repo === 'string' ? body.repo.trim() : '';

  if (!/^[\w.-]+\/[\w.-]+$/.test(repo_full)) {
    return Response.json({ error: 'Invalid repository' }, { status: 400 });
  }

  const repo_res = await fetch(`https://api.github.com/repos/${repo_full}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${gh}`,
      'User-Agent': 'Vital.site/1.0'
    }
  });
  if (!repo_res.ok) {
    return Response.json({ error: 'Repository not found or not accessible' }, { status: 400 });
  }
  const repo = (await repo_res.json()) as {
    full_name: string;
    html_url: string;
    private: boolean;
    name: string;
    owner?: { login?: string };
  };
  if (repo.private) {
    return Response.json({ error: 'Only public repositories can be submitted' }, { status: 400 });
  }
  if (repo.owner?.login?.toLowerCase() !== session.login) {
    return Response.json({ error: 'You must own the repository' }, { status: 403 });
  }

  const manifest_raw = await fetch_manifest(gh, repo.full_name);
  if (!manifest_raw) {
    return Response.json(
      { error: 'Repository needs a manifest.yaml (or manifest.yml) at the root — metadata is read from it by the vault build' },
      { status: 400 }
    );
  }

  const display_name = manifest_display_name(manifest_raw, repo.name);

  const app_token = await lib_github_app.vault_write_token();
  if (!app_token) {
    return Response.json(
      {
        error: 'Vault bot not configured',
        message: 'Set GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, and GITHUB_APP_PRIVATE_KEY'
      },
      { status: 503 }
    );
  }

  const published = await lib_vault_publish.publish_resource_pr({
    token: app_token,
    login: session.login,
    resource_repo_full: repo.full_name,
    resource_repo_url: repo.html_url,
    display_name
  });

  if (!published.ok) {
    return Response.json({ error: published.error }, { status: 400 });
  }

return Response.json({
    ok: true,
    pr_url: published.pr_url,
    path: published.path,
    updated: published.updated
  });
}
